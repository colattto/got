/**
 * API Utilities
 * Centralized async patterns and API helpers
 */

import { ApiError, NetworkError } from "./errors";

/**
 * Configuration for mock delay (can be disabled in production)
 */
const API_CONFIG = {
  mockDelay: 300, // Default delay in ms
  enableMockDelay: true, // Set to false in production
} as const;

/**
 * Simulates network delay for mock data
 * @param ms - Delay in milliseconds (defaults to config value)
 */
export const delay = (ms: number = API_CONFIG.mockDelay): Promise<void> => {
  if (!API_CONFIG.enableMockDelay) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Result type for safe async operations
 */
export type Result<T, E = ApiError> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Wraps an async operation in a try-catch and returns a Result type
 * Eliminates the need for try-catch blocks in calling code
 */
export async function tryCatch<T>(
  promise: Promise<T>
): Promise<Result<T, ApiError>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error };
    }
    return {
      success: false,
      error: new NetworkError(
        error instanceof Error ? error.message : "Unknown error occurred"
      ),
    };
  }
}

/**
 * Generic ID generator
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Configuration for CRUD service factory
 */
interface CrudConfig<T> {
  /** Get all items, optionally filtered */
  getAll: () => T[];
  /** Find item by ID */
  findById: (id: string) => T | undefined;
  /** Create delay in ms */
  createDelay?: number;
  /** Update delay in ms */
  updateDelay?: number;
  /** Delete delay in ms */
  deleteDelay?: number;
}

/**
 * Factory function to create standardized CRUD operations
 * Reduces boilerplate in service files
 */
export function createBaseCrudOperations<T extends { id: string }>(
  config: CrudConfig<T>
) {
  return {
    /**
     * Simulate API delay
     */
    delay: (customDelay?: number) => delay(customDelay),

    /**
     * Find by ID with not found handling
     */
    findByIdOrThrow: (id: string, resourceName: string): T => {
      const item = config.findById(id);
      if (!item) {
        throw new ApiError(`${resourceName} not found`, "NOT_FOUND", 404);
      }
      return item;
    },

    /**
     * Generate new ID
     */
    generateId,
  };
}

/**
 * Debounce utility for search inputs
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Type-safe object keys utility
 */
export const objectKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};
