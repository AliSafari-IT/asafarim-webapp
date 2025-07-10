// Browser-compatible mock for MdFileExplorer
// Define mock file tree directly in this file to avoid import issues

// Types to match the original MdFileExplorer API
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  extension?: string;
  size?: number;
  lastModified?: Date;
  children?: FileNode[];
  metadata?: Record<string, any>;
}

export interface ScanResult {
  nodes: FileNode[];
  totalFiles: number;
  totalDirectories: number;
}

export interface MdFileExplorerOptions {
  maxDepth?: number;
  includeExtensions?: string[];
  excludePatterns?: string[];
  parseMarkdownMetadata?: boolean;
  sortBy?: 'name' | 'size' | 'date';
  sortDirection?: 'asc' | 'desc';
}

// Browser-compatible mock implementation
export class BrowserMdFileExplorer {
  private options: MdFileExplorerOptions;
  private mockData: FileNode[];

  constructor(_basePath: string, options: MdFileExplorerOptions = {}) {
    this.options = {
      maxDepth: 10,
      includeExtensions: [],
      excludePatterns: [],
      parseMarkdownMetadata: false,
      sortBy: 'name',
      sortDirection: 'asc',
      ...options
    };
    
    // Initialize mock data
    this.mockData = [
      {
        name: 'docs',
        path: '/docs',
        type: 'directory',
        children: [
          {
            name: 'getting-started.md',
            path: '/docs/getting-started.md',
            type: 'file',
            extension: '.md',
            size: 2048,
            lastModified: new Date('2025-01-15'),
            metadata: {
              title: 'Getting Started Guide',
              author: 'ASafariM Team',
              tags: ['guide', 'tutorial']
            }
          },
          {
            name: 'api-reference.md',
            path: '/docs/api-reference.md',
            type: 'file',
            extension: '.md',
            size: 5120,
            lastModified: new Date('2025-02-10'),
            metadata: {
              title: 'API Reference',
              author: 'ASafariM Team',
              tags: ['api', 'reference']
            }
          },
          {
            name: 'examples',
            path: '/docs/examples',
            type: 'directory',
            children: [
              {
                name: 'basic-usage.md',
                path: '/docs/examples/basic-usage.md',
                type: 'file',
                extension: '.md',
                size: 1536,
                lastModified: new Date('2025-01-20')
              },
              {
                name: 'advanced-usage.md',
                path: '/docs/examples/advanced-usage.md',
                type: 'file',
                extension: '.md',
                size: 3072,
                lastModified: new Date('2025-02-05')
              }
            ]
          }
        ]
      },
      {
        name: 'src',
        path: '/src',
        type: 'directory',
        children: [
          {
            name: 'index.ts',
            path: '/src/index.ts',
            type: 'file',
            extension: '.ts',
            size: 512,
            lastModified: new Date('2025-01-10')
          },
          {
            name: 'utils',
            path: '/src/utils',
            type: 'directory',
            children: [
              {
                name: 'helpers.ts',
                path: '/src/utils/helpers.ts',
                type: 'file',
                extension: '.ts',
                size: 768,
                lastModified: new Date('2025-01-12')
              },
              {
                name: 'constants.ts',
                path: '/src/utils/constants.ts',
                type: 'file',
                extension: '.ts',
                size: 256,
                lastModified: new Date('2025-01-08')
              }
            ]
          }
        ]
      },
      {
        name: 'package.json',
        path: '/package.json',
        type: 'file',
        extension: '.json',
        size: 1024,
        lastModified: new Date('2025-01-05')
      },
      {
        name: 'README.md',
        path: '/README.md',
        type: 'file',
        extension: '.md',
        size: 3584,
        lastModified: new Date('2025-01-01'),
        metadata: {
          title: 'MD File Explorer',
          description: 'A library for exploring markdown files in a directory structure',
          version: '1.0.0'
        }
      }
    ];
  }

  async scanDirectory(): Promise<ScanResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Apply filtering based on options
    let filteredData = [...this.mockData];
    
    // Apply extension filtering if specified
    if (this.options.includeExtensions && this.options.includeExtensions.length > 0) {
      filteredData = this.filterByExtensions(filteredData, this.options.includeExtensions);
    }
    
    // Return filtered mock data
    return {
      nodes: filteredData,
      totalFiles: this.countFiles(filteredData),
      totalDirectories: this.countDirectories(filteredData)
    };
  }

  async getFileTree(): Promise<FileNode[]> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return this.mockData;
  }

  async getFileContent(filePath: string): Promise<string> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 30));
    
    // Return mock content based on file extension
    if (filePath.endsWith('.md')) {
      return '# Mock Markdown Content\n\nThis is a mock markdown file content.\n\n## Section\n\nSome text here.';
    } else if (filePath.endsWith('.json')) {
      return '{\n  "key": "value",\n  "number": 42,\n  "array": [1, 2, 3]\n}';
    } else if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
      return '// Mock code file\nfunction example() {\n  console.log("Hello world");\n  return 42;\n}';
    } else {
      return 'Mock content for ' + filePath;
    }
  }

  private countFiles(nodes: FileNode[]): number {
    return nodes.reduce((count, node) => {
      if (node.type === 'file') {
        return count + 1;
      } else if (node.children) {
        return count + this.countFiles(node.children);
      }
      return count;
    }, 0);
  }

  private countDirectories(nodes: FileNode[]): number {
    return nodes.reduce((count, node) => {
      if (node.type === 'directory') {
        return count + 1 + (node.children ? this.countDirectories(node.children) : 0);
      }
      return count;
    }, 0);
  }
  
  private filterByExtensions(nodes: FileNode[], extensions: string[]): FileNode[] {
    return nodes.map(node => {
      if (node.type === 'file') {
        // Include file if its extension is in the list
        if (node.extension && extensions.includes(node.extension)) {
          return node;
        }
        // Skip this file
        return null;
      } else if (node.type === 'directory' && node.children) {
        // Process directory children
        const filteredChildren = this.filterByExtensions(node.children, extensions);
        if (filteredChildren.length > 0) {
          // Return directory with filtered children
          return {
            ...node,
            children: filteredChildren
          };
        }
        // Skip empty directory
        return null;
      }
      return node;
    }).filter(Boolean) as FileNode[];
  }
}
