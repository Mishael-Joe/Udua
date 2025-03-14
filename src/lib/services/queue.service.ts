/**
 * A simple in-memory queue implementation for processing tasks asynchronously
 */
export class Queue {
  private queue: any[] = [];
  private processing = false;

  /**
   * Adds a task to the queue and starts processing if not already processing
   * @param task The task to add to the queue
   */
  add(task: any): void {
    this.queue.push(task);
    this.process();
  }

  /**
   * Processes tasks in the queue one by one
   */
  private async process(): Promise<void> {
    // If already processing, return
    if (this.processing) return;

    this.processing = true;

    try {
      while (this.queue.length > 0) {
        const task = this.queue.shift();

        try {
          // Import dynamically to avoid circular dependencies
          const { processOrder } = await import("./order.service");
          await processOrder(task);
        } catch (error) {
          console.error("Error processing task:", error);
          // Consider implementing retry logic or dead-letter queue
        }
      }
    } finally {
      this.processing = false;
    }
  }
}

// For production, consider using a more robust solution like Bull or Celery
