import { FileNode } from '../../../src/types';

/**
 * Find a node in the file tree by its path
 * @param fileTree The file tree to search
 * @param path The path to search for
 * @returns The node if found, null otherwise
 */
export function findNodeByPath(fileTree: FileNode, path: string): FileNode | null {
  // Handle empty path
  if (!path) return fileTree;
  
  // Handle root path
  if (path === '/' || path === '') {
    return fileTree;
  }

  // Special case for README.md at root
  if (path === 'README.md' || path === '/README.md') {
    if (fileTree.children) {
      const readmeNode = fileTree.children.find(child => 
        child.name === 'README.md' || child.path === 'README.md' || child.path === '/README.md'
      );
      if (readmeNode) return readmeNode;
    }
  }
  
  // Special case for changelog.md at root
  if (path === 'changelog.md' || path === '/changelog.md') {
    if (fileTree.children) {
      const changelogNode = fileTree.children.find(child => 
        child.name === 'changelog.md' || child.path === 'changelog.md' || child.path === '/changelog.md'
      );
      if (changelogNode) return changelogNode;
    }
  }

  // Normalize path
  const normalizedPath = normalizePath(path);
  
  // Direct path match first (most reliable)
  if (fileTree.path === normalizedPath) {
    return fileTree;
  }
  
  // Try to find by exact path match in the tree
  const findByExactPath = (node: FileNode, targetPath: string): FileNode | null => {
    if (node.path === targetPath || normalizePath(node.path) === targetPath) {
      return node;
    }
    
    // Also check by name for root-level files
    if (node.name === targetPath) {
      return node;
    }
    
    if (node.children) {
      for (const child of node.children) {
        const found = findByExactPath(child, targetPath);
        if (found) return found;
      }
    }
    
    return null;
  };
  
  // Try exact path matching first
  const exactMatch = findByExactPath(fileTree, normalizedPath);
  if (exactMatch) return exactMatch;
  
  // Fall back to segment-based matching
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
  if (!path) return '/';
  
  // Special case for README.md and changelog.md - preserve the extension for these files
  if (path === 'README.md' || path === '/README.md') {
    return '/README.md';
  }
  
  // Special case for changelog.md
  if (path === 'changelog.md' || path === '/changelog.md') {
    return '/changelog.md';
  }
  
  // Ensure path starts with /
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Handle potential URL parameters or hash
  const urlParts = normalizedPath.split(/[?#]/);
  normalizedPath = urlParts[0];
  
  // Remove .md extension if present (except for README.md which we handled above)
  if (normalizedPath.endsWith('.md') && !normalizedPath.endsWith('/README.md')) {
    normalizedPath = normalizedPath.slice(0, -3);
  }
  
  // Remove trailing slash except for root path
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  
  // Handle special case for paths like /md-docs/api which should match md-docs/api
  // This helps with the file tree API response format
  if (normalizedPath.startsWith('/') && normalizedPath !== '/') {
    // Check if this is a direct match to a file path in the tree
    // We'll return both versions and let the findNodeByPath function try both
    return normalizedPath;
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
  
  // Handle special cases for common paths
  let normalizedPath = urlPath;
  
  // Special handling for changelog.md
  if (urlPath.endsWith('changelog.md')) {
    normalizedPath = '/changelog.md';
    console.log(`Special handling for changelog.md: ${normalizedPath}`);
  }
  // Special handling for /md-docs/api/overview.md pattern
  else if (urlPath.includes('/md-docs/') && hasExtension) {
    // Keep the path as is, but also try without leading slash
    normalizedPath = urlPath;
    console.log(`Special handling for md-docs path: ${normalizedPath}`);
  } else {
    // Standard normalization for other paths
    normalizedPath = normalizePath(urlPath);
  }
  
  return { normalizedPath, hasExtension };
}
