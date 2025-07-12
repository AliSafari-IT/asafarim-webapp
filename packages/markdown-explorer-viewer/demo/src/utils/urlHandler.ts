import { FileNode } from '../../../src/types';

/**
 * Find a node in the file tree by its path
 * @param fileTree The file tree to search
 * @param path The path to search for
 * @returns The node if found, null otherwise
 */
export function findNodeByPath(fileTree: FileNode, path: string): FileNode | null {
  // Handle root path
  if (path === '/' || path === '') {
    return fileTree;
  }

  // Normalize path
  const normalizedPath = normalizePath(path);
  
  // Split path into segments
  const segments = normalizedPath.split('/').filter(Boolean);
  
  // Start from the root node
  let currentNode: FileNode | null = fileTree;
  
  // Traverse the tree
  for (const segment of segments) {
    if (!currentNode || !currentNode.children) {
      return null;
    }
    
    // Find the child node with matching name
    const childNode: FileNode | undefined = currentNode.children.find(
      child => child.name.toLowerCase() === segment.toLowerCase()
    );
    
    if (!childNode) {
      return null;
    }
    
    currentNode = childNode;
  }
  
  return currentNode;
}

/**
 * Normalize a path by removing .md extension and ensuring it starts with /
 * @param path The path to normalize
 * @returns The normalized path
 */
export function normalizePath(path: string): string {
  // Ensure path starts with /
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Handle potential URL parameters or hash
  const urlParts = normalizedPath.split(/[?#]/);
  normalizedPath = urlParts[0];
  
  // Remove .md extension if present
  if (normalizedPath.endsWith('.md')) {
    normalizedPath = normalizedPath.slice(0, -3);
  }
  
  // Remove trailing slash except for root path
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  
  return normalizedPath;
}

/**
 * Handle direct navigation to a markdown file URL
 * @param path The current URL path
 * @returns The normalized path and original extension
 */
export function handleDirectNavigation(path: string): { normalizedPath: string; hasExtension: boolean } {
  // Get path from URL
  const urlPath = path || window.location.pathname;
  
  // Check if the path has a .md extension
  const hasExtension = urlPath.endsWith('.md');
  
  // Normalize the path
  const normalizedPath = normalizePath(urlPath);
  
  return { normalizedPath, hasExtension };
}
