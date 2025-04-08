import dotenv from "dotenv";
dotenv.config();

import { connectToDB } from "@/lib/mongoose";
import deadLetterQueueConsumer from "@/lib/queue/dead-letter-consumer";
import orderQueueConsumer from "@/lib/queue/order-queue-consumer";
import rabbitMQConnection from "@/lib/queue/rabbitmq-connection";

/**
 * Main worker function to start the queue consumers
 */
async function startWorker() {
  try {
    console.log("Starting order processing worker...");
    await connectToDB();

    // Connect to RabbitMQ
    await rabbitMQConnection.connect();

    // Start the order queue consumer
    await orderQueueConsumer.start();

    // Start the dead letter queue consumer
    await deadLetterQueueConsumer.start();

    console.log("Order processing worker started successfully");

    // Handle graceful shutdown
    process.on("SIGINT", handleShutdown);
    process.on("SIGTERM", handleShutdown);
  } catch (error) {
    console.error("Failed to start order processing worker:", error);
    process.exit(1);
  }
}

/**
 * Handles graceful shutdown of the worker
 */
async function handleShutdown() {
  console.log("Shutting down order processing worker...");

  try {
    // Stop the consumers
    await orderQueueConsumer.stop();
    await deadLetterQueueConsumer.stop();

    // Close the RabbitMQ connection
    await rabbitMQConnection.close();

    console.log("Order processing worker shut down gracefully");
    process.exit(0);
  } catch (error) {
    console.error("Error during worker shutdown:", error);
    process.exit(1);
  }
}

// Start the worker
startWorker().catch((error) => {
  console.error("Unhandled error in worker:", error);
  process.exit(1);
});
