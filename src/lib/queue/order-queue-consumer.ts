import { ConsumeMessage } from "amqplib";
import rabbitMQConnection from "./rabbitmq-connection";
import { QUEUE_CONFIG, OrderMessage } from "./queue-config";
import orderQueueProducer from "./order-queue-producer";
import { processOrder } from "../services/order.service";

/**
 * Consumer for processing order messages from RabbitMQ
 */
export class OrderQueueConsumer {
  private isProcessing = false;
  private shouldStop = false;

  /**
   * Starts consuming messages from the order queue
   */
  async start(): Promise<void> {
    try {
      // Initialize the producer to ensure queues are created
      await orderQueueProducer.initialize();

      const channel = await rabbitMQConnection.getChannel();

      this.isProcessing = true;
      this.shouldStop = false;

      console.log(
        `Starting to consume messages from ${QUEUE_CONFIG.ORDER_QUEUE}`
      );

      // Start consuming messages
      await channel.consume(
        QUEUE_CONFIG.ORDER_QUEUE,
        async (message) => {
          if (!message) return;

          try {
            await this.processMessage(message);
          } catch (error) {
            console.error("Error processing message:", error);
            // Nack the message to requeue it
            channel.nack(message, false, false);
          }
        },
        {
          // Manual acknowledgment
          noAck: false,
        }
      );

      // Listen for connection events
      rabbitMQConnection.on("connected", async () => {
        if (this.isProcessing && !this.shouldStop) {
          console.log("Reconnected to RabbitMQ, restarting consumer");
          await this.start();
        }
      });
    } catch (error) {
      console.error("Failed to start order queue consumer:", error);
      this.isProcessing = false;

      // Retry starting the consumer after a delay
      setTimeout(() => this.start(), 5000);
    }
  }

  /**
   * Processes a message from the queue
   * @param message The message to process
   */
  private async processMessage(message: ConsumeMessage): Promise<void> {
    const channel = await rabbitMQConnection.getChannel();

    try {
      // Parse the message content
      const content = message.content.toString();
      const orderMessage = JSON.parse(content) as OrderMessage;

      // console.log(`Processing order ${orderMessage.id}`);

      // Get the retry count from the message headers
      const retryCount = message.properties.headers?.["x-retry-count"] || 0;

      // Process the order
      const orderId = await processOrder(orderMessage.data);

      console.log(
        `Order ${orderMessage.id} processed successfully, created order ID: ${orderId}`
      );

      // Acknowledge the message
      channel.ack(message);
    } catch (error) {
      console.error("Error processing order:", error);

      try {
        // Parse the message content
        const content = message.content.toString();
        const orderMessage = JSON.parse(content) as OrderMessage;

        // Get the retry count from the message headers
        const retryCount = (message.properties.headers?.["x-retry-count"] ||
          0) as number;

        // Check if we should retry
        if (retryCount < QUEUE_CONFIG.MAX_RETRIES) {
          console.log(
            `Scheduling retry ${retryCount + 1} for order ${orderMessage.id}`
          );

          // Send to retry queue
          await orderQueueProducer.sendToRetryQueue(
            orderMessage,
            retryCount + 1
          );

          // Acknowledge the message since we've scheduled a retry
          channel.ack(message);
        } else {
          console.log(
            `Max retries (${QUEUE_CONFIG.MAX_RETRIES}) exceeded for order ${orderMessage.id}, moving to dead letter queue`
          );

          // Send to dead letter queue
          await orderQueueProducer.sendToDeadLetterQueue(orderMessage);

          // Acknowledge the message since we've moved it to the dead letter queue
          channel.ack(message);
        }
      } catch (parseError) {
        console.error("Error parsing message for retry:", parseError);

        // If we can't parse the message, reject it without requeuing
        channel.nack(message, false, false);
      }
    }
  }

  /**
   * Stops consuming messages from the queue
   */
  async stop(): Promise<void> {
    this.shouldStop = true;
    this.isProcessing = false;
    console.log("Stopping order queue consumer");
  }
}

// Create a singleton instance
const orderQueueConsumer = new OrderQueueConsumer();

export default orderQueueConsumer;
