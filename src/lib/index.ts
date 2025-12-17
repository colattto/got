/**
 * Lib Index
 * Re-exports all library utilities
 */

// API utilities
export { delay, tryCatch, generateId, debounce, objectKeys } from "./api";
export type { Result } from "./api";

// Error handling
export {
  ApiError,
  NotFoundError,
  ValidationError,
  NetworkError,
  isApiError,
  getErrorMessage,
} from "./errors";

// Mock data (for services)
export * from "./mockData";
