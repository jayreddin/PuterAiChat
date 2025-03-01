import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { usePuterInit } from '@/hooks/use-puter-init';

interface PuterContextType {
  isInitialized: boolean;
  isLoading: boolean;
  initAttempted: boolean;
  error: Error | null;
}

const PuterContext = createContext<PuterContextType | undefined>(undefined);

export function PuterProvider({ children }: { children: ReactNode }) {
  const puterState = usePuterInit();

  // Log the current state for debugging
  useEffect(() => {
    console.log('Puter context state:', puterState);
  }, [puterState.isInitialized, puterState.isLoading, puterState.error]);

  return (
    <PuterContext.Provider value={puterState}>
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
