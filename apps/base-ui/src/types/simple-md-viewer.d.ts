declare module '@asafarim/simple-md-viewer' {
  import React from 'react';

  export interface MarkdownContentProps {
    showHomePage?: boolean;
    apiBaseUrl?: string;
    hideFileTree?: boolean;
    hideHeader?: boolean;
    hideFooter?: boolean;
    apiEndpoints?: {
      tree: string;
      file: string;
      search: string;
      exists: string;
    };
    showFrontMatter?: boolean;
    // full, minimal, header-only, or hidden
    frontMatterMode?: "full" | "minimal" | "header-only" | "hidden";
    // Directory view props
    directoryViewEnabled?: boolean;
    directoryViewStyle?: "list" | "grid" | "detailed";
    showDirectoryBreadcrumbs?: boolean;
    enableDirectorySorting?: boolean;
    basePath?: string;
    onNavigate?: (path: string) => boolean;
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
