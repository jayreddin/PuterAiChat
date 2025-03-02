import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect, useMemo } from 'react';
import { usePuterInit } from '@/hooks/use-puter-init';

interface PuterError {
  name: string;
  message: string;
  code?: string;
  retryable: boolean;
  stack?: string;
}

interface PuterContextType {
  isInitialized: boolean;
  isLoading: boolean;
  initAttempted: boolean;
  error: PuterError | null;
  retryInit: () => Promise<void>;
  status: 'idle' | 'initializing' | 'ready' | 'error';
  performance: {
    initStartTime: number | null;
    initDuration: number | null;
  };
}

const INIT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

const PuterContext = createContext<PuterContextType | undefined>(undefined);

interface PuterProviderProps {
  children: ReactNode;
  timeout?: number;
  maxRetries?: number;
}

function createPuterError(error: Error | string, retryable: boolean = true): PuterError {
  if (typeof error === 'string') {
    return {
      name: 'PuterError',
      message: error,
      retryable,
    };
  }
  
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    retryable,
  };
}

export function PuterProvider({ 
  children, 
  timeout = INIT_TIMEOUT,
  maxRetries = MAX_RETRIES 
}: PuterProviderProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [initStartTime, setInitStartTime] = useState<number | null>(null);
  const [initDuration, setInitDuration] = useState<number | null>(null);
  
  // Use the existing hook
  const initState = usePuterInit();
  
  // Convert Error to PuterError if needed
  const normalizedError = useMemo(() => 
    initState.error ? createPuterError(initState.error) : null
  , [initState.error]);

  // Track initialization performance
  useEffect(() => {
    setInitStartTime(Date.now());
    return () => {
      if (initStartTime) {
        setInitDuration(Date.now() - initStartTime);
      }
    };
  }, []);

  // Initialize Puter with timeout handling
  const initializeWithTimeout = useCallback(async () => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(createPuterError(`Initialization timed out after ${timeout}ms`));
      }, timeout);
    });

    try {
      await Promise.race([initState.initAttempted, timeoutPromise]);
    } catch (error) {
      throw createPuterError(error instanceof Error ? error : String(error));
    }
  }, [timeout, initState.initAttempted]);

  // Add retry functionality
  const retryInit = useCallback(async () => {
    if (retryCount >= maxRetries) {
      throw createPuterError('Max retry attempts reached', false);
    }

    setRetryCount(prev => prev + 1);
    setInitStartTime(Date.now());
    
    try {
      await initializeWithTimeout();
      setInitDuration(Date.now() - initStartTime!);
    } catch (error) {
      const puterError = createPuterError(error instanceof Error ? error : String(error));
      puterError.code = 'INIT_RETRY_FAILED';
      throw puterError;
    }
  }, [retryCount, maxRetries, initializeWithTimeout, initStartTime]);

  // Memoize the context value with normalized error
  const contextValue = useMemo<PuterContextType>(() => ({
    isInitialized: initState.isInitialized,
    isLoading: initState.isLoading,
    initAttempted: initState.initAttempted,
    error: normalizedError,
    retryInit,
    status: normalizedError 
      ? 'error' 
      : initState.isInitialized 
        ? 'ready' 
        : initState.isLoading 
          ? 'initializing' 
          : 'idle',
    performance: {
      initStartTime,
      initDuration
    }
  }), [
    initState,
    normalizedError,
    retryInit,
    initStartTime,
    initDuration
  ]);

  // Add error boundary for initialization failures
  if (normalizedError && !normalizedError.retryable && retryCount >= maxRetries) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-background">
        <div className="space-y-4 text-center">
          <h2 className="text-lg font-semibold">Failed to Initialize</h2>
          <p className="text-sm text-muted-foreground">
            {normalizedError.message}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm text-primary bg-primary/10 rounded-md hover:bg-primary/20"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <PuterContext.Provider value={contextValue}>
      {children}
    </PuterContext.Provider>
  );
}

export function usePuter() {
  const context = useContext(PuterContext);
  if (context === undefined) {
    throw new Error('usePuter must be used within a PuterProvider');
  }
  return context;
}

export type { PuterContextType, PuterError, PuterProviderProps };
