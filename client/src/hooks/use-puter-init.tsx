import { useState, useEffect } from 'react';

export function usePuterInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);

  useEffect(() => {
    const initializePuter = async () => {
      try {
        setIsLoading(true);
        console.log('Checking Puter availability:', {
          'Object exists': !!window.puter,
          'properties': window.puter ? Object.keys(window.puter) : 'none'
        });
        
        // Check if Puter is already available
        if (window.puter) {
           // Ensure puter is fully initialized with the AI property
           if (window.puter.ai) {
             console.log('Puter already initialized with AI capabilities');
             setIsInitialized(true);
             setIsLoading(false);
             return;
           }
         }

         // If we get here, we need to wait for the script to load
         console.log('Waiting for Puter to initialize...');
         setInitAttempted(true);

         // Wait for Puter to be loaded by the script
         const checkInterval = setInterval(() => {
           if (window.puter && window.puter.ai) {
             console.log('Puter initialized with AI capabilities');
             clearInterval(checkInterval);
             setIsInitialized(true);
             setIsLoading(false);
           }
         }, 500);

        // Set a timeout to prevent infinite waiting
        setTimeout(() => {
           if (!window.puter || !window.puter.ai) {
            clearInterval(checkInterval);
             console.error('Puter initialization timed out after 10 seconds');
             setError(new Error('Puter initialization timed out'));
             setIsLoading(false);
          }
        }, 10000); // 10 seconds timeout
      } catch (err) {
        console.error('Failed to initialize Puter:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    initializePuter();
  }, []);

  return { isInitialized, isLoading, error, initAttempted };
}
