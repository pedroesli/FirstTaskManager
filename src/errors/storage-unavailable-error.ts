export class StorageUnavailableError extends Error {
  constructor(message = "Redis is unavailable", options?: { cause?: unknown }) {
    super(message);
    this.name = "StorageUnavailableError";

    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}
