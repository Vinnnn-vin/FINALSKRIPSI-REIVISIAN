/* eslint-disable @typescript-eslint/no-explicit-any */
// File: hooks/useAsync.ts
// Utility hook untuk mengelola async operations dengan loading, error, dan data states
import { useState, useCallback, useEffect } from 'react';

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface AsyncActions<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
  setData: (data: T) => void;
  setError: (error: string) => void;
}

export const useAsync = <T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false
): AsyncState<T> & AsyncActions<T> => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: immediate,
    error: null,
  });
  
  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const result = await asyncFunction(...args);
        setState(prev => ({ ...prev, data: result, isLoading: false }));
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        throw err;
      }
    },
    [asyncFunction]
  );
  
  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);
  
  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);
  
  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  
  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
};