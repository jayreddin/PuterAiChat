
/**
 * This utility suppresses the ResizeObserver loop limit exceeded warning
 * which commonly occurs with Monaco Editor
 */
export function suppressResizeObserverWarning() {
  // Original console error
  const originalError = window.console.error;
  
  // Override console.error
  window.console.error = (...args) => {
    // Don't log ResizeObserver warnings
    if (args[0]?.toString().includes('ResizeObserver loop')) {
      return;
    }
    originalError(...args);
  };
}
