import * as fs from 'fs/promises';
import * as path from 'path';
import { FileNode, MarkdownMetadata } from '../types';
import matter from 'gray-matter';

/**
 * Normalize file path to use forward slashes and remove leading/trailing slashes
 */
export function normalizePath(filePath: string): string {
  return filePath
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/');
}

/**
 * Check if a file is a valid markdown file
 */
export function isValidMarkdownFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ['.md', '.markdown', '.mdx'].includes(ext);
}

/**
 * Check if a path should be excluded based on exclude patterns
 */
export function shouldExcludePath(filePath: string, excludePatterns: string[] = []): boolean {
  const normalizedPath = normalizePath(filePath);
  
  // Default exclusions
  const defaultExclusions = [
    'node_modules',
    '.git',
    '.next',
    '.nuxt',
    'dist',
    'build',
    '.DS_Store',
    'Thumbs.db'
  ];
  
  const allExclusions = [...defaultExclusions, ...excludePatterns];
  
  return allExclusions.some(pattern => {
    if (pattern.includes('*') || pattern.includes('?')) {
      // Simple glob pattern matching
      const regex = new RegExp(
        pattern.replace(/\*/g, '.*').replace(/\?/g, '.')
      );
      return regex.test(normalizedPath);
    }
    return normalizedPath.includes(pattern);
  });
}

/**
 * Get file stats safely
 */
export async function getFileStats(filePath: string) {
  try {
    const stats = await fs.stat(filePath);
    return {
      lastModified: stats.mtime,
      size: stats.size,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile()
    };
  } catch (error) {
    return null;
  }
}

/**
 * Parse markdown file metadata using gray-matter
 */
export async function parseMarkdownMetadata(filePath: string): Promise<MarkdownMetadata | undefined> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data } = matter(fileContent);
    return data as MarkdownMetadata;
  } catch (error) {
    console.warn(`Failed to parse metadata for ${filePath}:`, error);
    return undefined;
  }
}

/**
 * Sort file nodes based on criteria
 */
export function sortFileNodes(
  nodes: FileNode[], 
  sortBy: 'name' | 'date' | 'size' = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): FileNode[] {
  return nodes.sort((a, b) => {
    // Always put folders first
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name, undefined, { numeric: true });
        break;
      case 'date':
        const aDate = a.lastModified?.getTime() || 0;
        const bDate = b.lastModified?.getTime() || 0;
        comparison = aDate - bDate;
        break;
      case 'size':
        const aSize = a.size || 0;
        const bSize = b.size || 0;
        comparison = aSize - bSize;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

/**
 * Create a FileNode from a file path
 */
export async function createFileNode(
  filePath: string, 
  relativePath: string,
  parseMetadata: boolean = false
): Promise<FileNode | null> {
  const stats = await getFileStats(filePath);
  if (!stats) return null;
  
  const name = path.basename(filePath);
  const normalizedPath = normalizePath(relativePath);
  
  const node: FileNode = {
    name,
    path: normalizedPath,
    type: stats.isDirectory ? 'folder' : 'file',
    lastModified: stats.lastModified,
    size: stats.size
  };
  
  // Parse metadata for markdown files if requested
  if (node.type === 'file' && isValidMarkdownFile(filePath) && parseMetadata) {
    node.metadata = await parseMarkdownMetadata(filePath);
  }
  
  return node;
}

/**
 * Calculate relative path from root
 */
export function getRelativePath(fullPath: string, rootPath: string): string {
  const normalized = normalizePath(path.relative(rootPath, fullPath));
  return normalized || '/';
}
