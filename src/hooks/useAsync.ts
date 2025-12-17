/**
 * useAsync Hook
 * Generic hook for handling async operations with loading/error states
 *
 * Eliminates repeated loading/error patterns across hooks
 */

import { useState, useCallback, useEffect, useRef, DependencyList } from "react";

export interface AsyncState<T> {
  /** The data returned from the async operation */
  data: T | null;
  /** Whether the operation is currently in progress */
  loading: boolean;
  /** Error from the last operation, if any */
  error: Error | null;
  /** Whether data has been loaded at least once */
  isLoaded: boolean;
}

export interface UseAsyncReturn<T> extends AsyncState<T> {
  /** Manually trigger the async operation */
  execute: () => Promise<void>;
  /** Reset state to initial values */
  reset: () => void;
  /** Update data optimistically */
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

interface UseAsyncOptions {
  /** Whether to execute immediately on mount */
  immediate?: boolean;
  /** Callback on success */
  onSuccess?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

const defaultOptions: UseAsyncOptions = {
  immediate: true,
};

/**
 * Hook for managing async operations with standardized loading/error states
 *
 * @example
 * ```typescript
 * const { data: holidays, loading, execute } = useAsync(
 *   () => HolidaysService.list(storeId),
 *   [storeId]
 * );
 * ```
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: DependencyList = [],
  options: UseAsyncOptions = defaultOptions
): UseAsyncReturn<T> {
  const { immediate = true, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
    isLoaded: false,
  });

  // Track if component is mounted to avoid state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFn();
      if (isMounted.current) {
        setState({ data, loading: false, error: null, isLoaded: true });
        onSuccess?.();
      }
    } catch (error) {
      if (isMounted.current) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorObj,
        }));
        onError?.(errorObj);
      }
    }
  }, [asyncFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isLoaded: false,
    });
  }, []);

  const setData = useCallback((update: React.SetStateAction<T | null>) => {
    setState((prev) => ({
      ...prev,
      data: typeof update === "function" 
        ? (update as (prevState: T | null) => T | null)(prev.data)
        : update,
    }));
  }, []);

  // Execute on mount or when deps change
  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

/**
 * Hook for mutations (create, update, delete) with optimistic updates
 */
export interface UseMutationReturn<TData, TVariables> {
  /** Execute the mutation */
  mutate: (variables: TVariables) => Promise<TData>;
  /** Whether mutation is in progress */
  loading: boolean;
  /** Error from last mutation */
  error: Error | null;
  /** Reset mutation state */
  reset: () => void;
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
  }
): UseMutationReturn<TData, TVariables> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setLoading(true);
      setError(null);

      try {
        const data = await mutationFn(variables);
        setLoading(false);
        options?.onSuccess?.(data);
        return data;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setLoading(false);
        options?.onError?.(errorObj);
        throw errorObj;
      }
    },
    [mutationFn, options]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { mutate, loading, error, reset };
}
