import type { FileNode } from "./mdDocsUtils";

const environment = import.meta.env as unknown as Record<string, string>;

// Use VITE_API_PORT or VITE_SERVER_PORT with fallback to 3500
const serverPort = environment.VITE_API_PORT || environment.VITE_SERVER_PORT || 3500;
console.log("Using server port:", serverPort);

const API_BASE_URL = `http://localhost:${serverPort}/api`;

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
    // Normalize the file path before sending to the API
    // Remove any leading /docs/ prefix as the backend will handle this
    let normalizedPath = filePath;
    
    // Remove any leading /docs/ prefix
    if (normalizedPath.startsWith('/docs/')) {
      normalizedPath = normalizedPath.substring(6);
    } else if (normalizedPath.startsWith('docs/')) {
      normalizedPath = normalizedPath.substring(5);
    } else if (normalizedPath.startsWith('/')) {
      normalizedPath = normalizedPath.substring(1);
    }
    
    console.log(`Original path: ${filePath}, Normalized path: ${normalizedPath}`);
    
    const params = new URLSearchParams();
    params.append('path', normalizedPath);
    
    console.log(`Fetching file content for path: ${normalizedPath}`);
    const response = await fetch(`${this.baseUrl}/docs/file?${params}`);
    if (!response.ok) {
      console.error(`Failed to fetch file content: ${response.statusText}`);
      throw new Error(`Failed to fetch file content: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      console.error(`API returned error: ${data.error}`);
      throw new Error(data.error || 'Failed to fetch file content');
    }
    
    return {
      content: data.content,
      metadata: data.metadata,
      path: filePath, // Return the original path to maintain the URL structure
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
    console.log('Received file tree nodes:', nodes);
    
    // Create a root node that matches the expected structure
    const rootNode: FileNode = {
      name: 'Documentation',
      path: '/docs',
      type: 'folder',
      children: nodes.map((node: FileNode) => {
        // Ensure path starts with /docs/ but doesn't have duplicate /docs/docs/
        let nodePath = node.path;
        if (!nodePath.startsWith('/docs/') && !nodePath.startsWith('docs/')) {
          nodePath = `/docs/${nodePath}`;
        } else if (nodePath.startsWith('docs/')) {
          nodePath = `/${nodePath}`;
        }
        
        // Recursively update paths for children
        const updateChildPaths = (children: FileNode[] | undefined): FileNode[] | undefined => {
          if (!children) return undefined;
          
          return children.map(child => {
            let childPath = child.path;
            if (!childPath.startsWith('/docs/') && !childPath.startsWith('docs/')) {
              childPath = `/docs/${childPath}`;
            } else if (childPath.startsWith('docs/')) {
              childPath = `/${childPath}`;
            }
            
            return {
              ...child,
              path: childPath,
              children: updateChildPaths(child.children)
            };
          });
        };
        
        return {
          ...node,
          path: nodePath,
          children: updateChildPaths(node.children)
        };
      })
    };
    
    console.log('Processed file tree root node:', rootNode);
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
    // Ensure the URL path is correctly formatted for routing
    let url = node.path;
    
    // Make sure the URL starts with /docs for proper routing
    if (!url.startsWith('/docs')) {
      url = `/docs/${url}`;
    }
    
    // Remove any duplicate /docs prefixes that might cause issues
    url = url.replace(/\/docs\/docs\//g, '/docs/');
    
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
