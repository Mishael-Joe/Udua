import amqp, { Channel, ChannelModel } from "amqplib";
import { EventEmitter } from "events";

/**
 * RabbitMQ connection manager that handles connection establishment,
 * reconnection, and graceful shutdown.
 */
export class RabbitMQConnection extends EventEmitter {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private uri: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectInterval: number;
  private isShuttingDown = false;
  private connectionPromise: Promise<void> | null = null;

  /**
   * Creates a new RabbitMQ connection manager
   * @param config Configuration options for the connection
   */
  constructor(
    config: {
      uri?: string;
      maxReconnectAttempts?: number;
      reconnectInterval?: number;
    } = {}
  ) {
    super();

    // Get connection URI from environment variables or config
    this.uri =
      config.uri || process.env.RABBITMQ_URI || "amqp://localhost:5672";
    this.maxReconnectAttempts = config.maxReconnectAttempts || 10;
    this.reconnectInterval = config.reconnectInterval || 5000;

    // Setup graceful shutdown handlers
    process.once("SIGINT", this.handleShutdown.bind(this));
    process.once("SIGTERM", this.handleShutdown.bind(this));
  }

  /**
   * Connects to RabbitMQ and creates a channel
   */
  async connect(): Promise<void> {
    // If already connecting, return the existing promise
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Create a new connection promise
    this.connectionPromise = this.establishConnection();
    return this.connectionPromise;
  }

  /**
   * Establishes a connection to RabbitMQ
   */
  private async establishConnection(): Promise<void> {
    try {
      console.log("Connecting to RabbitMQ...");

      // Connect to RabbitMQ
      // this.connection = await amqp.connect(this.uri);
      // In your establishConnection method
      this.connection = await amqp.connect(this.uri, {
        // Add SSL options for production
        ...(process.env.NODE_ENV === "production"
          ? {
              ssl: {
                rejectUnauthorized: true,
              },
            }
          : {}),
      });

      // Reset reconnect attempts on successful connection
      this.reconnectAttempts = 0;

      // Handle connection errors and closed events
      this.connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err.message);
        this.attemptReconnect();
      });

      this.connection.on("close", () => {
        if (!this.isShuttingDown) {
          console.warn("RabbitMQ connection closed unexpectedly");
          this.attemptReconnect();
        }
      });

      // Create a channel
      this.channel = await this.connection.createChannel();

      // Set prefetch count to control concurrency
      // await this.channel.prefetch(5); // Process 5 messages at a time
      await this.channel.prefetch(1); // Process 1 messages at a time

      console.log("Connected to RabbitMQ successfully");

      // Emit connected event
      this.emit("connected");

      // Reset connection promise
      this.connectionPromise = null;
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);

      // Reset connection promise
      this.connectionPromise = null;

      // Attempt to reconnect
      this.attemptReconnect();
    }
  }

  /**
   * Attempts to reconnect to RabbitMQ after a connection failure
   */
  private attemptReconnect(): void {
    if (this.isShuttingDown) return;

    this.reconnectAttempts++;

    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      console.log(
        `Attempting to reconnect to RabbitMQ (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );

      setTimeout(() => {
        this.connectionPromise = this.establishConnection();
      }, this.reconnectInterval);
    } else {
      console.error(
        `Failed to reconnect to RabbitMQ after ${this.maxReconnectAttempts} attempts`
      );
      this.emit("reconnectFailed");
    }
  }

  /**
   * Gets the RabbitMQ channel, connecting if necessary
   */
  async getChannel(): Promise<Channel> {
    if (!this.channel) {
      await this.connect();
    }

    if (!this.channel) {
      throw new Error("Failed to create RabbitMQ channel");
    }

    return this.channel;
  }

  /**
   * Handles graceful shutdown of the RabbitMQ connection
   */
  private async handleShutdown(): Promise<void> {
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;
    console.log("Shutting down RabbitMQ connection...");

    try {
      // Close channel if it exists
      if (this.channel) {
        console.log("Closing RabbitMQ channel...");
        await this.channel.close();
        this.channel = null;
      }

      // Close connection if it exists
      if (this.connection) {
        console.log("Closing RabbitMQ connection...");
        await this.connection.close();
        this.connection = null;
      }

      console.log("RabbitMQ connection closed gracefully");
    } catch (error) {
      console.error("Error during RabbitMQ shutdown:", error);
    }

    // Allow process to exit
    process.exit(0);
  }

  /**
   * Closes the RabbitMQ connection
   */
  async close(): Promise<void> {
    await this.handleShutdown();
  }
}

// Create a singleton instance
const rabbitMQConnection = new RabbitMQConnection();

export default rabbitMQConnection;
