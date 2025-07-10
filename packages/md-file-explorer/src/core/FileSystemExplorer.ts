import * as fs from 'fs/promises';
import * as path from 'path';
import { FileNode, ExplorerOptions, ScanResult, FileContent } from '../types';
import { 
  normalizePath, 
  shouldExcludePath, 
  isValidMarkdownFile, 
  createFileNode, 
  sortFileNodes, 
  getRelativePath,
  parseMarkdownMetadata
} from '../utils/fileUtils';

export class FileSystemExplorer {
  private _rootPath: string;
  private _options: ExplorerOptions;

  constructor(rootPath: string, options: Partial<ExplorerOptions> = {}) {
    this._rootPath = path.resolve(rootPath);
    this._options = {
      rootPath: this._rootPath,
      includeExtensions: ['.md', '.markdown', '.mdx'],
      excludePatterns: [],
      maxDepth: 10,
      sortBy: 'name',
      sortOrder: 'asc',
      includeDotFiles: false,
      parseMarkdownMetadata: true,
      ...options
    };
  }

  /**
   * Get the root path
   */
  get rootPath(): string {
    return this._rootPath;
  }

  /**
   * Get the options
   */
  get options(): ExplorerOptions {
    return this._options;
  }

  /**
   * Recursively scan directory and build file tree
   */
  async scanDirectory(targetPath?: string, currentDepth: number = 0): Promise<ScanResult> {
    const scanPath = targetPath ? path.resolve(this._rootPath, targetPath) : this._rootPath;
    
    if (currentDepth >= (this._options.maxDepth || 10)) {
      return { nodes: [], totalFiles: 0, totalFolders: 0, lastScanned: new Date() };
    }

    const nodes: FileNode[] = [];
    let totalFiles = 0;
    let totalFolders = 0;

    try {
      const entries = await fs.readdir(scanPath, { withFileTypes: true });

      for (const entry of entries) {
        const entryPath = path.join(scanPath, entry.name);
        const relativePath = getRelativePath(entryPath, this._rootPath);

        // Skip excluded paths
        if (shouldExcludePath(relativePath, this._options.excludePatterns)) {
          continue;
        }

        // Skip dot files if not included
        if (!this._options.includeDotFiles && entry.name.startsWith('.')) {
          continue;
        }

        if (entry.isDirectory()) {
          totalFolders++;
          const folderNode = await createFileNode(entryPath, relativePath, false);
          if (folderNode) {
            // Recursively scan subdirectory
            const subResult = await this.scanDirectory(relativePath, currentDepth + 1);
            folderNode.children = subResult.nodes;
            totalFiles += subResult.totalFiles;
            totalFolders += subResult.totalFolders;
            nodes.push(folderNode);
          }
        } else if (entry.isFile()) {
          // Only include files with specified extensions
          if (this._options.includeExtensions?.length) {
            const ext = path.extname(entry.name).toLowerCase();
            if (!this._options.includeExtensions.includes(ext)) {
              continue;
            }
          }

          totalFiles++;
          const fileNode = await createFileNode(
            entryPath, 
            relativePath, 
            this._options.parseMarkdownMetadata
          );
          if (fileNode) {
            nodes.push(fileNode);
          }
        }
      }

      // Sort nodes
      const sortedNodes = sortFileNodes(
        nodes, 
        this._options.sortBy, 
        this._options.sortOrder
      );

      return {
        nodes: sortedNodes,
        totalFiles,
        totalFolders,
        lastScanned: new Date()
      };

    } catch (error) {
      console.error(`Error scanning directory ${scanPath}:`, error);
      return { nodes: [], totalFiles: 0, totalFolders: 0, lastScanned: new Date() };
    }
  }

  /**
   * Get file tree at specific path (lazy loading)
   */
  async getFileTree(targetPath?: string, depth: number = 1): Promise<FileNode[]> {
    const tempOptions = { ...this._options, maxDepth: depth };
    const tempExplorer = new FileSystemExplorer(this._rootPath, tempOptions);
    const result = await tempExplorer.scanDirectory(targetPath);
    return result.nodes;
  }

  /**
   * Get content of a specific file
   */
  async getFileContent(filePath: string): Promise<FileContent> {
    const fullPath = path.resolve(this._rootPath, filePath);
    
    try {
      const rawContent = await fs.readFile(fullPath, 'utf-8');
      const stats = await fs.stat(fullPath);
      
      let content = rawContent;
      let metadata;
      
      if (isValidMarkdownFile(fullPath) && this._options.parseMarkdownMetadata) {
        // Parse frontmatter and strip it from content
        const matter = await import('gray-matter');
        const parsed = matter.default(rawContent);
        metadata = parsed.data;
        content = parsed.content; // Content without frontmatter
      } else if (isValidMarkdownFile(fullPath)) {
        metadata = await parseMarkdownMetadata(fullPath);
      }

      return {
        content,
        metadata,
        path: normalizePath(filePath),
        lastModified: stats.mtime
      };
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error}`);
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.resolve(this._rootPath, filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file/folder info without content
   */
  async getNodeInfo(targetPath: string): Promise<FileNode | null> {
    const fullPath = path.resolve(this._rootPath, targetPath);
    return createFileNode(fullPath, targetPath, this._options.parseMarkdownMetadata);
  }

  /**
   * Search for files matching a pattern
   */
  async searchFiles(query: string, searchInContent: boolean = false): Promise<FileNode[]> {
    const result = await this.scanDirectory();
    const matchingNodes: FileNode[] = [];

    const searchInNodes = (nodes: FileNode[]) => {
      for (const node of nodes) {
        // Search in file name
        if (node.name.toLowerCase().includes(query.toLowerCase())) {
          matchingNodes.push(node);
        }
        
        // Search in metadata
        if (node.metadata) {
          const metadataStr = JSON.stringify(node.metadata).toLowerCase();
          if (metadataStr.includes(query.toLowerCase())) {
            matchingNodes.push(node);
          }
        }

        // Recursively search in children
        if (node.children) {
          searchInNodes(node.children);
        }
      }
    };

    searchInNodes(result.nodes);

    // TODO: Implement content search if searchInContent is true
    if (searchInContent) {
      // This would require reading all files and searching their content
      // Can be implemented as needed
    }

    return matchingNodes;
  }
}
