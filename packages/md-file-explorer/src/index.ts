// Core API
export { MdFileExplorer } from './api/MdFileExplorer';
export { FileSystemExplorer } from './core/FileSystemExplorer';
export { FileWatcher } from './core/FileWatcher';

// Types
export type {
  FileNode,
  MarkdownMetadata,
  FileContent,
  ExplorerOptions,
  ScanResult,
  FileWatcherCallback,
  ExplorerAPI
} from './types';

// Utilities
export {
  normalizePath,
  isValidMarkdownFile,
  shouldExcludePath,
  getFileStats,
  parseMarkdownMetadata,
  sortFileNodes,
  createFileNode,
  getRelativePath
} from './utils/fileUtils';

// Default export
export { MdFileExplorer as default } from './api/MdFileExplorer';
