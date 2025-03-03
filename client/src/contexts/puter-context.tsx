import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { PuterAPI } from "@/types/puter";

export interface PuterContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  puter: PuterAPI | null;
}

const PuterContext = createContext<PuterContextType>({
  isInitialized: false,
  isLoading: true,
  error: null,
  puter: null
});

interface PuterProviderProps {
  children: ReactNode;
}

export function PuterProvider({ children }: PuterProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [puter, setPuter] = useState<PuterAPI | null>(null);

  useEffect(() => {
    const checkPuter = async () => {
      try {
        // Wait for window.puter to be available
        for (let i = 0; i < 20; i++) {  // Try for 10 seconds (20 * 500ms)
          if (window.puter) {
            console.log('Checking Puter availability:', {
              exists: !!window.puter,
              properties: Object.keys(window.puter)
            });
            
            setPuter(window.puter);
            setIsInitialized(true);
            setIsLoading(false);
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        throw new Error('Puter initialization timed out');
      } catch (err) {
        console.error('Puter initialization error:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize Puter'));
        setIsLoading(false);
      }
    };

    checkPuter();
    
    return () => {
      setIsInitialized(false);
      setPuter(null);
    };
  }, []);

  return (
    <PuterContext.Provider value={{ isInitialized, isLoading, error, puter }}>
      {children}
    </PuterContext.Provider>
  );
}

// Export hook for easy access to Puter context
export const usePuter = () => {
  const context = useContext(PuterContext);
  if (!context) {
    throw new Error('usePuter must be used within a PuterProvider');
  }
  return context;
};

// Export context for direct usage if needed
export { PuterContext };
