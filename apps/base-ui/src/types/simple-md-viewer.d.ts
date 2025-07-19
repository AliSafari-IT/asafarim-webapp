declare module '@asafarim/simple-md-viewer' {
  import React from 'react';

  export interface MarkdownContentProps {
    showHomePage?: boolean;
    apiBaseUrl?: string;
    hideFileTree?: boolean;
    apiEndpoints?: {
      tree: string;
      file: string;
      search: string;
      exists: string;
    };
  }

  export const MarkdownContent: React.FC<MarkdownContentProps>;
  
  export interface ThemeProviderProps {
    theme: string;
    toggleTheme: () => void;
    children: React.ReactNode;
  }
  
  export const ThemeProvider: React.FC<ThemeProviderProps>;
  
  export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    content?: string;
  }
}
