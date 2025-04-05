import { v4 as uuidv4 } from "uuid";
import rabbitMQConnection from "./rabbitmq-connection";
import { QUEUE_CONFIG, OrderMessage } from "./queue-config";

/**
 * Producer for sending order messages to RabbitMQ
 */
export class OrderQueueProducer {
  /**
   * Initializes the order queue and related exchanges
   */
  async initialize(): Promise<void> {
    const channel = await rabbitMQConnection.getChannel();

    // Create the dead letter exchange
    await channel.assertExchange(QUEUE_CONFIG.DEAD_LETTER_EXCHANGE, "direct", {
      durable: true,
    });

    // Create the dead letter queue
    await channel.assertQueue(QUEUE_CONFIG.DEAD_LETTER_QUEUE, {
      durable: true,
    });

    // Bind the dead letter queue to the exchange
    await channel.bindQueue(
      QUEUE_CONFIG.DEAD_LETTER_QUEUE,
      QUEUE_CONFIG.DEAD_LETTER_EXCHANGE,
      ""
    );

    // Create the retry exchange
    await channel.assertExchange(QUEUE_CONFIG.RETRY_EXCHANGE, "direct", {
      durable: true,
    });

    // Create the retry queue with TTL (time-to-live) for delayed retries
    await channel.assertQueue(QUEUE_CONFIG.RETRY_QUEUE, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": "",
        "x-dead-letter-routing-key": QUEUE_CONFIG.ORDER_QUEUE,
      },
    });

    // Bind the retry queue to the exchange
    await channel.bindQueue(
      QUEUE_CONFIG.RETRY_QUEUE,
      QUEUE_CONFIG.RETRY_EXCHANGE,
      ""
    );

    // Create the main order queue with dead letter exchange
    await channel.assertQueue(QUEUE_CONFIG.ORDER_QUEUE, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": QUEUE_CONFIG.DEAD_LETTER_EXCHANGE,
        "x-dead-letter-routing-key": "",
      },
    });

    console.log("Order queue and exchanges initialized");
  }

  /**
   * Sends an order to the RabbitMQ queue
   * @param orderData The order data to send
   * @returns The ID of the queued message
   */
  async sendOrder(orderData: OrderMessage["data"]): Promise<string> {
    try {
      const channel = await rabbitMQConnection.getChannel();

      // Create a unique ID for the message
      const messageId = uuidv4();

      // Create the message with metadata
      const message: OrderMessage = {
        id: messageId,
        data: orderData,
        metadata: {
          retryCount: 0,
          originalTimestamp: new Date().toISOString(),
        },
      };

      // Convert the message to a buffer
      const messageBuffer = Buffer.from(JSON.stringify(message));

      // Publish the message to the queue
      const published = channel.sendToQueue(
        QUEUE_CONFIG.ORDER_QUEUE,
        messageBuffer,
        {
          persistent: true, // Make message persistent (durable)
          messageId,
          contentType: "application/json",
          headers: {
            "x-retry-count": 0,
          },
        }
      );

      if (!published) {
        console.warn("RabbitMQ write buffer is full, applying back pressure");
        // Wait for drain event before sending more messages
        await new Promise((resolve) => channel.once("drain", resolve));
      }

      console.log(`Order queued successfully: ${messageId}`);
      return messageId;
    } catch (error: any) {
      console.error("Failed to queue order:", error);
      throw new Error(`Failed to queue order: ${error.message}`);
    }
  }

  /**
   * Sends a message to the retry queue with a delay
   * @param message The message to retry
   * @param retryCount The current retry count
   */
  async sendToRetryQueue(
    message: OrderMessage,
    retryCount: number
  ): Promise<void> {
    try {
      const channel = await rabbitMQConnection.getChannel();

      // Get the appropriate delay based on retry count
      const delayIndex = Math.min(
        retryCount - 1,
        QUEUE_CONFIG.RETRY_DELAYS.length - 1
      );
      const delay = QUEUE_CONFIG.RETRY_DELAYS[delayIndex];

      // Update the message metadata
      message.metadata.retryCount = retryCount;
      message.metadata.lastRetryTimestamp = new Date().toISOString();

      // Convert the message to a buffer
      const messageBuffer = Buffer.from(JSON.stringify(message));

      // Create a temporary queue with TTL for the delay
      const tempQueueName = `${QUEUE_CONFIG.RETRY_QUEUE}.${message.id}.${retryCount}`;

      await channel.assertQueue(tempQueueName, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": "",
          "x-dead-letter-routing-key": QUEUE_CONFIG.ORDER_QUEUE,
          "x-message-ttl": delay,
          "x-expires": delay + 60000, // Queue will be deleted after TTL + 1 minute
        },
      });

      // Publish the message to the temporary queue
      channel.sendToQueue(tempQueueName, messageBuffer, {
        persistent: true,
        messageId: message.id,
        contentType: "application/json",
        headers: {
          "x-retry-count": retryCount,
        },
      });

      console.log(
        `Order ${message.id} scheduled for retry ${retryCount} in ${delay}ms`
      );
    } catch (error) {
      console.error(`Failed to schedule retry for order ${message.id}:`, error);
      // If we can't schedule a retry, send to dead letter queue
      await this.sendToDeadLetterQueue(message);
    }
  }

  /**
   * Sends a message to the dead letter queue
   * @param message The message to send to the dead letter queue
   */
  async sendToDeadLetterQueue(message: OrderMessage): Promise<void> {
    try {
      const channel = await rabbitMQConnection.getChannel();

      // Update the message metadata
      message.metadata.lastRetryTimestamp = new Date().toISOString();

      // Convert the message to a buffer
      const messageBuffer = Buffer.from(JSON.stringify(message));

      // Publish the message to the dead letter queue
      channel.publish(QUEUE_CONFIG.DEAD_LETTER_EXCHANGE, "", messageBuffer, {
        persistent: true,
        messageId: message.id,
        contentType: "application/json",
        headers: {
          "x-retry-count": message.metadata.retryCount,
          "x-failed-reason": "Max retries exceeded or unrecoverable error",
        },
      });

      console.log(
        `Order ${message.id} moved to dead letter queue after ${message.metadata.retryCount} retries`
      );
    } catch (error) {
      console.error(
        `Failed to move order ${message.id} to dead letter queue:`,
        error
      );
    }
  }
}

// Create a singleton instance
const orderQueueProducer = new OrderQueueProducer();

export default orderQueueProducer;
