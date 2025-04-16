import "module-alias/register";
import rabbitMQConnection from "@/lib/queue/rabbitmq-connection";
import { QUEUE_CONFIG } from "@/lib/queue/queue-config";
import { connectToDB } from "@/lib/mongoose";

interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  rabbitmq: {
    connected: boolean;
    queues?: {
      [key: string]: {
        messageCount: number;
        consumerCount: number;
      };
    };
    error?: string;
  };
  database: {
    connected: boolean;
    error?: string;
  };
}

/**
 * Health check function for monitoring systems
 */
async function healthCheck() {
  const status: HealthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    rabbitmq: {
      connected: false,
      queues: {},
    },
    database: {
      connected: false,
    },
  };

  try {
    // Check database connection
    try {
      await connectToDB();
      status.database.connected = true;
    } catch (error: any) {
      status.database.connected = false;
      status.database.error = error.message;
      status.status = "unhealthy";
    }

    // Check RabbitMQ connection
    try {
      const channel = await rabbitMQConnection.getChannel();
      status.rabbitmq.connected = true;

      // Check queue status
      try {
        const orderQueueStatus = await channel.checkQueue(
          QUEUE_CONFIG.ORDER_QUEUE
        );
        status.rabbitmq.queues![QUEUE_CONFIG.ORDER_QUEUE] = {
          messageCount: orderQueueStatus.messageCount,
          consumerCount: orderQueueStatus.consumerCount,
        };

        const deadLetterQueueStatus = await channel.checkQueue(
          QUEUE_CONFIG.DEAD_LETTER_QUEUE
        );
        status.rabbitmq.queues![QUEUE_CONFIG.DEAD_LETTER_QUEUE] = {
          messageCount: deadLetterQueueStatus.messageCount,
          consumerCount: deadLetterQueueStatus.consumerCount,
        };

        const retryQueueStatus = await channel.checkQueue(
          QUEUE_CONFIG.RETRY_QUEUE
        );
        status.rabbitmq.queues![QUEUE_CONFIG.RETRY_QUEUE] = {
          messageCount: retryQueueStatus.messageCount,
          consumerCount: retryQueueStatus.consumerCount,
        };
      } catch (error: any) {
        // If queues don't exist yet, this is not necessarily an error
        status.rabbitmq.error = `Queue check error: ${error.message}`;
      }
    } catch (error: any) {
      status.rabbitmq.connected = false;
      status.rabbitmq.error = error.message;
      status.status = "unhealthy";
    }

    // Output health status
    console.log(JSON.stringify(status, null, 2));

    // Exit with appropriate code
    process.exit(status.status === "healthy" ? 0 : 1);
  } catch (error: any) {
    console.error("Health check failed:", error);
    process.exit(1);
  }
}

// Run health check if this script is executed directly
if (require.main === module) {
  healthCheck();
}

// Export for programmatic use
export default healthCheck;
