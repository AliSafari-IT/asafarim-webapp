import { Theme } from '../types';

/**
 * Get the effective theme considering auto theme detection
 */
export function getEffectiveTheme(theme: Theme = 'auto'): 'light' | 'dark' {
  if (theme !== 'auto') {
    return theme;
  }

  // Check for system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return 'light';
}

/**
 * Apply theme to a DOM element
 */
export function applyTheme(element: HTMLElement, theme: Theme): void {
  const effectiveTheme = getEffectiveTheme(theme);
  
  // Remove existing theme classes
  element.removeAttribute('data-theme');
  
  // Apply new theme
  element.setAttribute('data-theme', effectiveTheme);
}

/**
 * Listen for system theme changes
 */
export function watchSystemTheme(callback: (isDark: boolean) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  mediaQuery.addEventListener('change', handler);
  
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}
