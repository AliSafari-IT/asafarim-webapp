import { FileSystemExplorer } from '../core/FileSystemExplorer';
import { FileWatcher } from '../core/FileWatcher';
import { 
  ExplorerOptions, 
  FileNode, 
  FileContent, 
  ScanResult, 
  FileWatcherCallback,
  ExplorerAPI
} from '../types';

/**
 * Main API class for the markdown file explorer
 */
export class MdFileExplorer implements ExplorerAPI {
  private explorer: FileSystemExplorer;
  private watcher?: FileWatcher;

  constructor(rootPath: string, options: Partial<ExplorerOptions> = {}) {
    this.explorer = new FileSystemExplorer(rootPath, options);
  }

  /**
   * Scan directory and return complete file tree
   */
  async scanDirectory(path?: string, options?: Partial<ExplorerOptions>): Promise<ScanResult> {
    if (options) {
      // Create a new explorer with updated options
      const updatedOptions = { ...this.explorer.options, ...options };
      const tempExplorer = new FileSystemExplorer(this.explorer.rootPath, updatedOptions);
      return tempExplorer.scanDirectory(path);
    }
    return this.explorer.scanDirectory(path);
  }

  /**
   * Get file content by path
   */
  async getFileContent(filePath: string): Promise<FileContent> {
    return this.explorer.getFileContent(filePath);
  }

  /**
   * Get file tree at specific path with optional depth limit (lazy loading)
   */
  async getFileTree(path?: string, depth?: number): Promise<FileNode[]> {
    return this.explorer.getFileTree(path, depth);
  }

  /**
   * Watch directory for changes
   */
  watchDirectory(callback: FileWatcherCallback): void {
    if (!this.watcher) {
      this.watcher = new FileWatcher(this.explorer.rootPath, this.explorer.options);
    }
    this.watcher.watch(callback);
  }

  /**
   * Stop watching directory
   */
  stopWatching(): void {
    if (this.watcher) {
      this.watcher.stopWatching();
    }
  }

  /**
   * Check if file is a valid markdown file
   */
  isValidMarkdownFile(filePath: string): boolean {
    return this.explorer.constructor.prototype.isValidMarkdownFile?.call(null, filePath) || false;
  }

  /**
   * Normalize file path
   */
  normalizePath(filePath: string): string {
    return this.explorer.constructor.prototype.normalizePath?.call(null, filePath) || filePath;
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    return this.explorer.fileExists(filePath);
  }

  /**
   * Get node info without content
   */
  async getNodeInfo(path: string): Promise<FileNode | null> {
    return this.explorer.getNodeInfo(path);
  }

  /**
   * Search for files
   */
  async searchFiles(query: string, searchInContent: boolean = false): Promise<FileNode[]> {
    return this.explorer.searchFiles(query, searchInContent);
  }

  /**
   * Get explorer options
   */
  get options(): ExplorerOptions {
    return this.explorer.options;
  }

  /**
   * Get root path
   */
  get rootPath(): string {
    return this.explorer.rootPath;
  }
}
