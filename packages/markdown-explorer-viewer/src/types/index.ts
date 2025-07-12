import React, { ReactNode } from 'react';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  lastModified?: string;
  size?: number;
  metadata?: Record<string, any>;
}

export interface FileTreeData {
  [path: string]: FileNode;
}

export interface MarkdownExplorerProps {
  /** Root path for the file tree or virtual file map */
  rootPath?: string;
  /** Virtual file tree data (alternative to rootPath) */
  fileTree?: FileNode;
  /** Theme preference */
  theme?: 'light' | 'dark' | 'auto';
  /** Custom CSS class name */
  className?: string;
  /** Initial route to navigate to */
  initialRoute?: string;
  /** Callback when navigation occurs */
  onNavigate?: (path: string, node: FileNode) => void;
  /** Enable search functionality */
  enableSearch?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Show file icons */
  showIcons?: boolean;
  /** Show file tree by default */
  showFileTree?: boolean;
  /** Custom file icon renderer */
  renderFileIcon?: (node: FileNode) => ReactNode;
  /** Custom folder icon renderer */
  renderFolderIcon?: (node: FileNode) => ReactNode;
  /** Maximum width for the file tree sidebar */
  sidebarWidth?: string;
  /** Enable breadcrumbs */
  showBreadcrumbs?: boolean;
  /** Custom markdown components */
  markdownComponents?: Record<string, React.ComponentType<any>>;
  /** Custom content fetcher for files that don't have content pre-loaded */
  contentFetcher?: (filePath: string) => Promise<string>;
  /** Custom renderer for folder content */
  renderFolderContent?: (props: { 
    currentNode: FileNode; 
    onNodeClick: (node: FileNode) => void;
  }) => ReactNode;
  /** Disable auto-selection of first file in folder */
  disableAutoSelect?: boolean;
}

export interface FileTreeProps {
  /** File tree data */
  fileTree: FileNode;
  /** Current selected path */
  currentPath?: string;
  /** Theme */
  theme?: 'light' | 'dark' | 'auto';
  /** Click handler for files/folders */
  onNodeClick: (node: FileNode) => void;
  /** Enable search */
  enableSearch?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Show icons */
  showIcons?: boolean;
  /** Custom file icon renderer */
  renderFileIcon?: (node: FileNode) => ReactNode;
  /** Custom folder icon renderer */
  renderFolderIcon?: (node: FileNode) => ReactNode;
  /** Custom class name */
  className?: string;
}

export interface MarkdownViewerProps {
  /** Markdown content to render */
  content: string;
  /** Theme */
  theme?: 'light' | 'dark' | 'auto';
  /** Custom class name */
  className?: string;
  /** Custom markdown components */
  components?: Record<string, React.ComponentType<any>>;
  /** File path for context */
  filePath?: string;
  /** Frontmatter metadata */
  metadata?: Record<string, any>;
}

export interface BreadcrumbsProps {
  /** Current path */
  path: string;
  /** Root path */
  rootPath?: string;
  /** Theme */
  theme?: 'light' | 'dark' | 'auto';
  /** Click handler for breadcrumb items */
  onPathClick: (path: string) => void;
  /** Custom class name */
  className?: string;
}

export interface SearchProps {
  /** Search query */
  query: string;
  /** Search change handler */
  onQueryChange: (query: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Theme */
  theme?: 'light' | 'dark' | 'auto';
  /** Custom class name */
  className?: string;
}

export interface NavigationState {
  currentPath: string;
  currentNode: FileNode | null;
  history: string[];
  historyIndex: number;
}

export type Theme = 'light' | 'dark' | 'auto';
