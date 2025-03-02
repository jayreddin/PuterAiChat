import { useState, useEffect, useMemo, useCallback } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface DarkModeHook {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setTheme: (theme: Theme) => void;
  theme: Theme;
  systemTheme: 'dark' | 'light';
}

const STORAGE_KEY = 'theme';
const DARK_CLASS = 'dark';
const THEME_TRANSITION_CLASS = 'theme-transition';

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme {
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
  } catch {
    return 'system';
  }
}

function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
}

function enableTransitions() {
  document.documentElement.classList.add(THEME_TRANSITION_CLASS);
}

function disableTransitions() {
  document.documentElement.classList.remove(THEME_TRANSITION_CLASS);
}

export function useDarkMode(): DarkModeHook {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(getSystemTheme);

  // Memoize the current theme state
  const isDarkMode = useMemo(() => {
    return theme === 'system' ? systemTheme === 'dark' : theme === 'dark';
  }, [theme, systemTheme]);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle theme storage changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setThemeState(e.newValue as Theme);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Apply theme changes with transitions
  useEffect(() => {
    const applyTheme = () => {
      enableTransitions();
      
      if (isDarkMode) {
        document.documentElement.classList.add(DARK_CLASS);
      } else {
        document.documentElement.classList.remove(DARK_CLASS);
      }

      // Disable transitions after they've likely completed
      const timeout = setTimeout(disableTransitions, 200);
      return () => clearTimeout(timeout);
    };

    const cleanup = applyTheme();
    return cleanup;
  }, [isDarkMode]);

  // Theme setter with storage
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
  }, []);

  // Toggle between light and dark, preserving system preference
  const toggleDarkMode = useCallback(() => {
    setTheme(theme === 'system' 
      ? systemTheme === 'dark' ? 'light' : 'dark'
      : theme === 'dark' ? 'light' : 'dark'
    );
  }, [theme, systemTheme]);

  return {
    isDarkMode,
    toggleDarkMode,
    setTheme,
    theme,
    systemTheme
  };
}

// Add CSS to handle transitions
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .theme-transition * {
      transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease !important;
    }
  `;
  document.head.appendChild(style);
}