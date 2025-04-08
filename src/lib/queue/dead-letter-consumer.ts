import { ConsumeMessage } from "amqplib";
import rabbitMQConnection from "./rabbitmq-connection";
import { QUEUE_CONFIG, OrderMessage } from "./queue-config";
import { sendEmail } from "../services/email.service";
import { formatNaira } from "../utils";

/**
 * Consumer for processing messages from the dead letter queue
 */
export class DeadLetterQueueConsumer {
  private isProcessing = false;
  private shouldStop = false;

  /**
   * Starts consuming messages from the dead letter queue
   */
  async start(): Promise<void> {
    try {
      const channel = await rabbitMQConnection.getChannel();

      this.isProcessing = true;
      this.shouldStop = false;

      console.log(
        `Starting to consume messages from ${QUEUE_CONFIG.DEAD_LETTER_QUEUE}`
      );

      // Start consuming messages
      await channel.consume(
        QUEUE_CONFIG.DEAD_LETTER_QUEUE,
        async (message) => {
          if (!message) return;

          try {
            await this.processDeadLetter(message);
            channel.ack(message);
          } catch (error) {
            console.error("Error processing dead letter:", error);
            // Nack without requeue to prevent infinite loop
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
          console.log(
            "Reconnected to RabbitMQ, restarting dead letter consumer"
          );
          await this.start();
        }
      });
    } catch (error) {
      console.error("Failed to start dead letter queue consumer:", error);
      this.isProcessing = false;

      // Retry starting the consumer after a delay
      setTimeout(() => this.start(), 5000);
    }
  }

  /**
   * Processes a message from the dead letter queue
   * @param message The message to process
   */
  private async processDeadLetter(message: ConsumeMessage): Promise<void> {
    try {
      // Parse the message content
      const content = message.content.toString();
      const orderMessage = JSON.parse(content) as OrderMessage;

      console.log(`Processing dead letter for order ${orderMessage.id}`);

      // Log the failed order
      console.error("Order processing failed after maximum retries:", {
        orderId: orderMessage.id,
        retryCount: orderMessage.metadata.retryCount,
        originalTimestamp: orderMessage.metadata.originalTimestamp,
        lastRetryTimestamp: orderMessage.metadata.lastRetryTimestamp,
        orderData: orderMessage.data,
      });

      // Send notification to admin
      await this.notifyAdminOfFailedOrder(orderMessage);

      // Send notification to customer
      await this.notifyCustomerOfFailedOrder(orderMessage);

      // Here you could also store the failed order in a database for manual review
    } catch (error) {
      console.error("Error processing dead letter:", error);
      throw error;
    }
  }

  /**
   * Notifies the admin of a failed order
   * @param orderMessage The failed order message
   */
  private async notifyAdminOfFailedOrder(
    orderMessage: OrderMessage
  ): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || "mishaeljoe55@gmail.com";
    const text = `
    An order has failed processing after ${
      orderMessage.metadata.retryCount
    } retries.
    
    Order ID: ${orderMessage.id}
    Transaction Reference: ${orderMessage.data.transactionReference}
    User ID: ${orderMessage.data.userID}
    User Email: ${orderMessage.data.userEmail}
    Amount: ${formatNaira(orderMessage.data.amount)}
    Original Timestamp: ${orderMessage.metadata.originalTimestamp}
    Last Retry: ${orderMessage.metadata.lastRetryTimestamp}
    
    Please review this order manually in the admin dashboard.
  `;

    const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
An order has failed processing after ${
      orderMessage.metadata.retryCount
    } retries.
    
    Order ID: ${orderMessage.id}
    Transaction Reference: ${orderMessage.data.transactionReference}
    User ID: ${orderMessage.data.userID}
    User Email: ${orderMessage.data.userEmail}
    Amount: ${formatNaira(orderMessage.data.amount)}
    Original Timestamp: ${orderMessage.metadata.originalTimestamp}
    Last Retry: ${orderMessage.metadata.lastRetryTimestamp}
    
    Please review this order manually in the admin dashboard.
      </body>
    </html>

    `;

    await sendEmail({
      to: adminEmail,
      subject: `URGENT: Failed Order Processing - ${orderMessage.id}`,
      text,
      html,
    });
  }

  /**
   * Notifies the customer of a failed order
   * @param orderMessage The failed order message
   */
  private async notifyCustomerOfFailedOrder(
    orderMessage: OrderMessage
  ): Promise<void> {
    const text = `
    Dear Customer,
    
    We're sorry to inform you that we encountered an issue while processing your recent order.
    
    Our team has been notified and is working to resolve this issue. You have not been charged for this order.
    
    If you have any questions, please contact our customer support team and reference the following information:
    
    Transaction Reference: ${orderMessage.data.transactionReference}
    Date: ${new Date(orderMessage.metadata.originalTimestamp).toLocaleString()}
    
    We apologize for any inconvenience this may have caused.
    
    Best regards,
    The Udua Team
  `;

    const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            Dear Customer,
    
    We're sorry to inform you that we encountered an issue while processing your recent order.
    
    Our team has been notified and is working to resolve this issue. You have not been charged for this order.
    
    If you have any questions, please contact our customer support team and reference the following information:
    
    Transaction Reference: ${orderMessage.data.transactionReference}
    Date: ${new Date(orderMessage.metadata.originalTimestamp).toLocaleString()}
    
    We apologize for any inconvenience this may have caused.
    
    Best regards,
    The Udua Team
      </body>
    </html>

    `;
    await sendEmail({
      to: orderMessage.data.userEmail,
      subject: "Important: Issue with Your Order",
      text,
      html,
    });
  }

  /**
   * Stops consuming messages from the dead letter queue
   */
  async stop(): Promise<void> {
    this.shouldStop = true;
    this.isProcessing = false;
    console.log("Stopping dead letter queue consumer");
  }
}

// Create a singleton instance
const deadLetterQueueConsumer = new DeadLetterQueueConsumer();

export default deadLetterQueueConsumer;
