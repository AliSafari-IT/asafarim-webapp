import type { FileNode } from '@asafarim/markdown-explorer-viewer';

const API_BASE_URL = 'http://localhost:3001/api';

// API client for fetching documentation data from the server
export class DocsApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getFileTree(path?: string, depth?: number): Promise<FileNode[]> {
    const params = new URLSearchParams();
    if (path) params.append('path', path);
    if (depth) params.append('depth', depth.toString());
    
    const response = await fetch(`${this.baseUrl}/docs/tree?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch file tree: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch file tree');
    }
    
    return data.nodes;
  }

  async getFileContent(filePath: string): Promise<{
    content: string;
    metadata?: Record<string, unknown>;
    path: string;
    lastModified?: string;
  }> {
    const params = new URLSearchParams();
    params.append('path', filePath);
    
    const response = await fetch(`${this.baseUrl}/docs/file?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch file content');
    }
    
    return {
      content: data.content,
      metadata: data.metadata,
      path: data.path,
      lastModified: data.lastModified
    };
  }

  async searchFiles(query: string, includeContent: boolean = false): Promise<FileNode[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (includeContent) params.append('includeContent', 'true');
    
    const response = await fetch(`${this.baseUrl}/docs/search?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to search files: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to search files');
    }
    
    return data.results;
  }

  async fileExists(filePath: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('path', filePath);
    
    const response = await fetch(`${this.baseUrl}/docs/exists?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to check file existence: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to check file existence');
    }
    
    return data.exists;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create a default client instance
const docsApiClient = new DocsApiClient();

// Get the file tree dynamically from the API
export const createMdDocsFileTree = async (): Promise<FileNode> => {
  try {
    const nodes = await docsApiClient.getFileTree();
    
    // Create a root node that matches the expected structure
    const rootNode: FileNode = {
      name: 'Documentation',
      path: '/docs',
      type: 'folder',
      children: nodes.map((node: FileNode) => ({
        ...node,
        path: `/docs/${node.path}`
      }))
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
    const fileContent = await docsApiClient.getFileContent(filePath);
    return fileContent.content;
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
    return await docsApiClient.searchFiles(query, false);
  } catch (error) {
    console.error('Error searching documentation:', error);
    return [];
  }
};

// Check if a file exists
export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    return await docsApiClient.fileExists(filePath);
  } catch {
    return false;
  }
};

// Export the client for advanced usage
export { docsApiClient };
