import React, { useEffect, useState } from 'react';
import type { Theme, ThemeContextType } from './types';
import { ThemeContext } from './context';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  storageKey = 'ui-theme'
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateEffectiveTheme = () => {
      const newEffectiveTheme = theme === 'auto' 
        ? (mediaQuery.matches ? 'dark' : 'light')
        : theme;
      
      setEffectiveTheme(newEffectiveTheme);
      
      // Update CSS classes
      root.classList.remove('light', 'dark');
      root.classList.add(newEffectiveTheme);
      
      // Update CSS custom properties
      root.style.colorScheme = newEffectiveTheme;
    };

    updateEffectiveTheme();

    // Listen for system theme changes when in auto mode
    const handleMediaChange = () => {
      if (theme === 'auto') {
        updateEffectiveTheme();
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
