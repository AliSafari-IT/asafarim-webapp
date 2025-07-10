// Browser-compatible mock for MdFileExplorer
// Define mock file tree directly in this file to avoid import issues

// Types to match the original MdFileExplorer API
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  extension?: string;
  size?: number;
  lastModified?: Date;
  children?: FileNode[];
  metadata?: Record<string, any>;
}

export interface ScanResult {
  nodes: FileNode[];
  totalFiles: number;
  totalFolders: number;
  lastScanned: Date;
}

export interface MdFileExplorerOptions {
  maxDepth?: number;
  includeExtensions?: string[];
  excludePatterns?: string[];
  parseMarkdownMetadata?: boolean;
  sortBy?: 'name' | 'size' | 'date';
  sortDirection?: 'asc' | 'desc';
}

export class BrowserMdFileExplorer {
  private options: MdFileExplorerOptions;
  private mockData: FileNode[];
  private _watchIntervalId: number | null = null;

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
        type: 'folder',
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
            type: 'folder',
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
        type: 'folder',
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
            type: 'folder',
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
      totalFolders: this.countDirectories(filteredData),
      lastScanned: new Date()
    };
  }

  async getFileTree(path?: string, _depth: number = 1): Promise<FileNode[]> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 50));
    
    if (path) {
      // Find the specific node
      const findNode = (nodes: FileNode[], targetPath: string): FileNode | null => {
        for (const node of nodes) {
          if (node.path === targetPath) {
            return node;
          }
          if (node.children) {
            const found = findNode(node.children, targetPath);
            if (found) return found;
          }
        }
        return null;
      };
      
      const node = findNode(this.mockData, path);
      if (node && node.children) {
        return node.children;
      }
      return [];
    }
    
    return this.mockData;
  }

  async getFileContent(filePath: string): Promise<string> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 30));
    
    // Find the file in the mock data
    const findFile = (nodes: FileNode[], targetPath: string): FileNode | null => {
      for (const node of nodes) {
        if (node.path === targetPath) {
          return node;
        }
        if (node.children) {
          const found = findFile(node.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };
    
    const file = findFile(this.mockData, filePath);
    
    if (!file || file.type !== 'file') {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Generate mock content based on file extension
    if (file.extension === '.md') {
      return `# ${file.name}\n\nThis is a mock markdown file content.\n\n## Section 1\n\nLorem ipsum dolor sit amet.\n\n## Section 2\n\nConsectetur adipiscing elit.`;
    } else if (file.extension === '.json') {
      return `{\n  "name": "${file.name}",\n  "description": "This is a mock JSON file",\n  "version": "1.0.0"\n}`;
    } else if (file.extension === '.ts' || file.extension === '.js') {
      return `// ${file.name}\n\n/**\n * This is a mock TypeScript/JavaScript file\n */\nexport function example() {\n  console.log("Hello world");\n  return true;\n}`;
    }
    
    return `Mock content for ${file.name}`;
  }

  private countFiles(nodes: FileNode[]): number {
    return nodes.reduce((count, node) => {
      if (node.type === 'file') {
        return count + 1;
      } else if (node.type === 'folder' && node.children) {
        return count + this.countFiles(node.children);
      }
      return count;
    }, 0);
  }

  private countDirectories(nodes: FileNode[]): number {
    return nodes.reduce((count, node) => {
      if (node.type === 'folder') {
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
      } else if (node.type === 'folder' && node.children) {
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

  watchDirectory(callback: (event: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir', path: string) => void): void {
    // Simulate file system events with a timer
    if (this._watchIntervalId !== null) {
      this.stopWatching(); // Clear any existing watcher
    }
    
    const events: Array<'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir'> = [
      'add', 'change', 'unlink', 'addDir', 'unlinkDir'
    ];
    
    const paths = [
      '/docs/new-file.md',
      '/docs/getting-started.md',
      '/src/utils/helpers.ts',
      '/docs/examples',
      '/src/new-folder'
    ];
    
    // Generate random events every few seconds
    this._watchIntervalId = window.setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const randomPath = paths[Math.floor(Math.random() * paths.length)];
      
      callback(randomEvent, randomPath);
    }, 3000);
  }

  stopWatching(): void {
    if (this._watchIntervalId !== null) {
      window.clearInterval(this._watchIntervalId);
      this._watchIntervalId = null;
    }
  }
}
