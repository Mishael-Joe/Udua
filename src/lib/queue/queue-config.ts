/**
 * Configuration for RabbitMQ queues and exchanges
 */
export const QUEUE_CONFIG = {
  // Main order processing queue
  ORDER_QUEUE: "udua.orders",

  // Dead letter queue for failed orders
  DEAD_LETTER_QUEUE: "udua.orders.dead-letter",

  // Dead letter exchange
  DEAD_LETTER_EXCHANGE: "udua.orders.dead-letter-exchange",

  // Retry queue for orders that failed processing
  RETRY_QUEUE: "udua.orders.retry",

  // Retry exchange
  RETRY_EXCHANGE: "udua.orders.retry-exchange",

  // Maximum number of retries before moving to dead letter queue
  MAX_RETRIES: 3,

  // Retry delays in milliseconds (exponential backoff)
  RETRY_DELAYS: [
    30000, // 30 seconds
    60000, // 1 minute
    90000, // 1 minute and 30 seconds
  ],
};

/**
 * Order message type for the queue
 */
export interface OrderMessage {
  // Unique ID for the message
  id: string;

  // Order data
  data: {
    cartItems: any[];
    userID: string;
    userEmail: string;
    shippingAddress: string;
    shippingMethod?: string;
    status: string;
    paymentType: string;
    postalCode: string;
    amount: number;
    transactionReference: string;
    timestamp: string;
  };

  // Metadata for the message
  metadata: {
    // Number of retries attempted
    retryCount: number;

    // Original timestamp when the message was first created
    originalTimestamp: string;

    // Timestamp when the message was last retried
    lastRetryTimestamp?: string;
  };
}
