export interface FileNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: FileNode[];
  lastModified?: Date;
  size?: number;
  metadata?: MarkdownMetadata;
}

export interface MarkdownMetadata {
  title?: string;
  description?: string;
  author?: string;
  tags?: string[];
  date?: string;
  [key: string]: any;
}

export interface FileContent {
  content: string;
  metadata?: MarkdownMetadata;
  path: string;
  lastModified?: Date;
}

export interface ExplorerOptions {
  rootPath: string;
  includeExtensions?: string[];
  excludePatterns?: string[];
  maxDepth?: number;
  sortBy?: 'name' | 'date' | 'size';
  sortOrder?: 'asc' | 'desc';
  includeDotFiles?: boolean;
  parseMarkdownMetadata?: boolean;
}

export interface ScanResult {
  nodes: FileNode[];
  totalFiles: number;
  totalFolders: number;
  lastScanned: Date;
}

export interface FileWatcherCallback {
  (event: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir', path: string): void;
}

export interface ExplorerAPI {
  scanDirectory(path?: string, options?: Partial<ExplorerOptions>): Promise<ScanResult>;
  getFileContent(filePath: string): Promise<FileContent>;
  getFileTree(path?: string, depth?: number): Promise<FileNode[]>;
  watchDirectory(callback: FileWatcherCallback): void;
  stopWatching(): void;
  isValidMarkdownFile(filePath: string): boolean;
  normalizePath(filePath: string): string;
}
