import { NextResponse } from "next/server";
import rabbitMQConnection from "@/lib/queue/rabbitmq-connection";
import { QUEUE_CONFIG } from "@/lib/queue/queue-config";
import mongoose from "mongoose";

export async function GET() {
  const status = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    rabbitmq: {
      connected: false,
      queues: {} as Record<
        string,
        { messageCount: number; consumerCount: number }
      >,
    },
    database: {
      connected: false,
    },
  };

  try {
    // Check database connection
    status.database.connected = mongoose.connection.readyState === 1;
    if (!status.database.connected) {
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
        status.rabbitmq.queues[QUEUE_CONFIG.ORDER_QUEUE] = {
          messageCount: orderQueueStatus.messageCount,
          consumerCount: orderQueueStatus.consumerCount,
        };

        const deadLetterQueueStatus = await channel.checkQueue(
          QUEUE_CONFIG.DEAD_LETTER_QUEUE
        );
        status.rabbitmq.queues[QUEUE_CONFIG.DEAD_LETTER_QUEUE] = {
          messageCount: deadLetterQueueStatus.messageCount,
          consumerCount: deadLetterQueueStatus.consumerCount,
        };
      } catch (error) {
        // If queues don't exist yet, this is not necessarily an error
      }
    } catch (error) {
      status.rabbitmq.connected = false;
      status.status = "unhealthy";
    }

    // Return status with appropriate HTTP status code
    return NextResponse.json(status, {
      status: status.status === "healthy" ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: "Health check failed" },
      { status: 503 }
    );
  }
}
