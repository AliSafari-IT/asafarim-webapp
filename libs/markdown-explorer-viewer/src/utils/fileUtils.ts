import { FileNode } from '../types';

/**
 * Parse a virtual file tree from a flat structure
 */
export function parseFileTree(files: Record<string, string>): FileNode {
  const root: FileNode = {
    name: 'root',
    path: '/',
    type: 'folder',
    children: []
  };

  const nodeMap = new Map<string, FileNode>();
  nodeMap.set('/', root);

  // Sort paths to ensure parent directories are created before children
  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const content = files[filePath];
    const pathParts = filePath.split('/').filter(Boolean);
    
    let currentPath = '';
    let currentNode = root;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : `/${part}`;
      
      if (!nodeMap.has(currentPath)) {
        const isFile = i === pathParts.length - 1;
        const newNode: FileNode = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
          content: isFile ? content : undefined
        };

        nodeMap.set(currentPath, newNode);
        currentNode.children = currentNode.children || [];
        currentNode.children.push(newNode);
      }

      currentNode = nodeMap.get(currentPath)!;
    }
  }

  return root;
}

/**
 * Find a node by path in the file tree
 */
export function findNodeByPath(tree: FileNode, path: string): FileNode | null {
  if (tree.path === path) {
    return tree;
  }

  if (tree.children) {
    for (const child of tree.children) {
      const found = findNodeByPath(child, path);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Get all file paths in the tree
 */
export function getAllFilePaths(tree: FileNode): string[] {
  const paths: string[] = [];

  function traverse(node: FileNode) {
    if (node.type === 'file') {
      paths.push(node.path);
    }

    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(tree);
  return paths;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot > 0 ? filename.slice(lastDot + 1).toLowerCase() : '';
}

/**
 * Check if a file is a markdown file
 */
export function isMarkdownFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ['md', 'markdown', 'mdown', 'mkd'].includes(ext);
}

/**
 * Generate breadcrumb items from a path
 */
export function generateBreadcrumbs(path: string, rootPath: string = '/'): Array<{ name: string; path: string }> {
  const breadcrumbs: Array<{ name: string; path: string }> = [];
  
  if (path === rootPath) {
    return [{ name: 'Home', path: rootPath }];
  }

  const pathParts = path.split('/').filter(Boolean);
  let currentPath = rootPath === '/' ? '' : rootPath;

  breadcrumbs.push({ name: 'Home', path: rootPath });

  for (const part of pathParts) {
    currentPath = currentPath ? `${currentPath}/${part}` : `/${part}`;
    breadcrumbs.push({ name: part, path: currentPath });
  }

  return breadcrumbs;
}

/**
 * Search nodes by query
 */
export function searchNodes(tree: FileNode, query: string): FileNode[] {
  const results: FileNode[] = [];
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return results;
  }

  function search(node: FileNode) {
    const nameMatch = node.name.toLowerCase().includes(normalizedQuery);
    const pathMatch = node.path.toLowerCase().includes(normalizedQuery);
    const contentMatch = node.content && node.content.toLowerCase().includes(normalizedQuery);

    if (nameMatch || pathMatch || contentMatch) {
      results.push(node);
    }

    if (node.children) {
      for (const child of node.children) {
        search(child);
      }
    }
  }

  search(tree);
  return results;
}

/**
 * Get parent path from a given path
 */
export function getParentPath(path: string): string {
  if (path === '/' || path === '') {
    return '/';
  }

  const parts = path.split('/').filter(Boolean);
  if (parts.length <= 1) {
    return '/';
  }

  return '/' + parts.slice(0, -1).join('/');
}

/**
 * Normalize path to ensure consistent format
 */
export function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }

  // Remove trailing slash except for root
  const normalized = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  
  // Ensure leading slash
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

/**
 * Get file icon based on file extension
 */
export function getFileIcon(node: FileNode): string {
  if (node.type === 'folder') {
    return '📁';
  }

  const ext = getFileExtension(node.name);
  
  switch (ext) {
    case 'md':
    case 'markdown':
      return '📝';
    case 'txt':
      return '📄';
    case 'json':
      return '📋';
    case 'js':
    case 'jsx':
      return '📜';
    case 'ts':
    case 'tsx':
      return '📘';
    case 'css':
      return '🎨';
    case 'html':
      return '🌐';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return '🖼️';
    case 'pdf':
      return '📕';
    case 'zip':
    case 'tar':
    case 'gz':
      return '📦';
    default:
      return '📄';
  }
}
