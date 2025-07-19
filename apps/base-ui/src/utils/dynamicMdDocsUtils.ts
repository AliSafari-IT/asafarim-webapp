// Import our custom FileNode interface
import type { FileNode } from './mdDocsUtils';

// API base URL - in production this would be configurable
const API_BASE_URL = 'http://localhost:3500/api';

// Type for API response nodes
interface ApiFileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: ApiFileNode[];
}

// Convert API response node to FileNode format
const convertApiNode = (node: ApiFileNode): FileNode => {
  // The API already returns the correct relative paths, just add /docs prefix
  const fullPath = `/docs/${node.path}`;
  
  return {
    name: node.name,
    path: fullPath,
    type: node.type,
    children: node.children?.map(convertApiNode), // Simple recursive call
  };
};

// Get the file tree dynamically from the API
export const createMdDocsFileTree = async (): Promise<FileNode> => {
  try {
    const response = await fetch(`${API_BASE_URL}/docs/tree`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch file tree');
    }
    
    // Create a root node that matches the expected structure
    const rootNode: FileNode = {
      name: 'Documentation',
      path: '/docs',
      type: 'folder',
      children: data.nodes.map((node: ApiFileNode) => 
        convertApiNode(node)
      )
    };
    
    return rootNode;
  } catch (error) {
    console.error('Error loading documentation tree:', error);
    
    // Fallback to empty structure
    return {
      name: 'Documentation',
      path: '/docs',
      type: 'folder',
      children: []
    };
  }
};

// Get file content dynamically from the API
export const getFileContent = async (filePath: string): Promise<string> => {
  try {
    // Remove the /docs prefix to get the actual file path
    const actualPath = filePath.replace(/^\/docs\//, '');
    
    const response = await fetch(`${API_BASE_URL}/docs/file?path=${encodeURIComponent(actualPath)}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch file content');
    }
    
    return data.content;
  } catch (error) {
    console.error(`Error loading file content for ${filePath}:`, error);
    return `# Error Loading File\n\nCould not load content for: ${filePath}`;
  }
};

// Create sidebar items dynamically from the file tree
export const createDocumentationSidebarItems = async () => {
  const fileTree = await createMdDocsFileTree();
  
  interface SidebarItem {
    id: string;
    label: string;
    url: string;
    children?: SidebarItem[];
  }
  
  const convertNodeToSidebarItem = (node: FileNode): SidebarItem => {
    const url = node.path;
    
    const item: SidebarItem = {
      id: node.path.replace(/[/.]/g, '-'),
      label: node.name.replace(/\.md$/, ''),
      url: url,
    };
    
    if (node.children && node.children.length > 0) {
      item.children = node.children.map((child: FileNode) => 
        convertNodeToSidebarItem(child)
      );
    }
    
    return item;
  };
  
  // Start with an overview item
  const items: SidebarItem[] = [
    {
      id: 'docs-overview',
      label: 'Overview',
      url: '/docs',
    }
  ];
  
  // Add items from the file tree
  if (fileTree.children) {
    items.push(...fileTree.children.map((child: FileNode) => convertNodeToSidebarItem(child)));
  }
  
  return items;
};

// Search functionality
export const searchDocumentation = async (query: string): Promise<FileNode[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/docs/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to search files');
    }
    
    return data.results.map(convertApiNode);
  } catch (error) {
    console.error('Error searching documentation:', error);
    return [];
  }
};

// Check if a file exists
export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    const actualPath = filePath.replace(/^\/docs\//, '');
    const response = await fetch(`${API_BASE_URL}/docs/exists?path=${encodeURIComponent(actualPath)}`);
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.success && data.exists;
  } catch {
    return false;
  }
};
