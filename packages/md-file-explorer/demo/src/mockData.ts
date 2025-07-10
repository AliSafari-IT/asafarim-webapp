import { FileNode, ScanResult } from '@asafarim/md-file-explorer';

// Mock data for the file explorer demo
export const mockFileTree: FileNode[] = [
  {
    name: 'docs',
    path: 'docs',
    type: 'folder',
    children: [
      {
        name: 'getting-started.md',
        path: 'docs/getting-started.md',
        type: 'file',
        size: 1024,
        lastModified: new Date('2023-06-15'),
        metadata: {
          title: 'Getting Started',
          description: 'How to get started with the library',
          tags: ['tutorial', 'beginner']
        }
      },
      {
        name: 'api-reference.md',
        path: 'docs/api-reference.md',
        type: 'file',
        size: 2048,
        lastModified: new Date('2023-07-20'),
        metadata: {
          title: 'API Reference',
          description: 'Complete API documentation',
          tags: ['api', 'reference']
        }
      },
      {
        name: 'examples',
        path: 'docs/examples',
        type: 'folder',
        children: [
          {
            name: 'basic-usage.md',
            path: 'docs/examples/basic-usage.md',
            type: 'file',
            size: 512,
            lastModified: new Date('2023-08-05'),
            metadata: {
              title: 'Basic Usage',
              description: 'Basic usage examples',
              tags: ['example', 'basic']
            }
          },
          {
            name: 'advanced-usage.md',
            path: 'docs/examples/advanced-usage.md',
            type: 'file',
            size: 768,
            lastModified: new Date('2023-08-10'),
            metadata: {
              title: 'Advanced Usage',
              description: 'Advanced usage examples',
              tags: ['example', 'advanced']
            }
          }
        ]
      }
    ]
  },
  {
    name: 'src',
    path: 'src',
    type: 'folder',
    children: [
      {
        name: 'index.ts',
        path: 'src/index.ts',
        type: 'file',
        size: 256,
        lastModified: new Date('2023-05-01')
      },
      {
        name: 'components',
        path: 'src/components',
        type: 'folder',
        children: [
          {
            name: 'Explorer.tsx',
            path: 'src/components/Explorer.tsx',
            type: 'file',
            size: 1536,
            lastModified: new Date('2023-05-15')
          }
        ]
      }
    ]
  },
  {
    name: 'README.md',
    path: 'README.md',
    type: 'file',
    size: 4096,
    lastModified: new Date('2023-04-20'),
    metadata: {
      title: 'Markdown File Explorer',
      description: 'A TypeScript library for exploring markdown files',
      tags: ['readme', 'documentation']
    }
  }
];

// Mock scan result
export const mockScanResult: ScanResult = {
  nodes: mockFileTree,
  totalFiles: 6,
  totalFolders: 3,
  lastScanned: new Date()
};

// Mock file content
export const mockFileContent: Record<string, { content: string; metadata?: any }> = {
  'docs/getting-started.md': {
    content: `# Getting Started
    
This guide will help you get started with the Markdown File Explorer library.

## Installation

\`\`\`bash
npm install @asafarim/md-file-explorer
\`\`\`

## Basic Usage

\`\`\`typescript
import { MdFileExplorer } from '@asafarim/md-file-explorer';

const explorer = new MdFileExplorer('./docs');
const result = await explorer.scanDirectory();
console.log(result);
\`\`\`
`,
    metadata: {
      title: 'Getting Started',
      description: 'How to get started with the library',
      tags: ['tutorial', 'beginner']
    }
  },
  'docs/api-reference.md': {
    content: `# API Reference

Complete documentation for the Markdown File Explorer API.

## MdFileExplorer

The main class for exploring markdown files.

### Methods

- \`scanDirectory(path?: string, options?: Partial<ExplorerOptions>): Promise<ScanResult>\`
- \`getFileContent(filePath: string): Promise<FileContent>\`
- \`getFileTree(path?: string, depth?: number): Promise<FileNode[]>\`
- \`watchDirectory(callback: FileWatcherCallback): void\`
- \`stopWatching(): void\`
`,
    metadata: {
      title: 'API Reference',
      description: 'Complete API documentation',
      tags: ['api', 'reference']
    }
  }
};

// Mock explorer class for browser demo
export class BrowserMdFileExplorer {
  constructor(private rootPath: string) {
    // rootPath is stored as a class property
  }
  
  async scanDirectory(): Promise<ScanResult> {
    // In a real implementation, this would fetch data from an API
    // For the demo, we'll just return mock data
    return mockScanResult;
  }
  
  async getFileContent(filePath: string): Promise<any> {
    // Return mock content for the requested file
    return mockFileContent[filePath] || {
      content: `# File not found\n\nThe file ${filePath} was not found.`,
      metadata: { title: 'Not Found' }
    };
  }
  
  async getFileTree(path?: string, _depth?: number): Promise<FileNode[]> {
    // In a real implementation, this would fetch data from an API with path and depth parameters
    // For the demo, we'll just return mock data with a simulated delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (path) {
      // If a specific path is requested, find that node in the tree and return its children
      const findNode = (nodes: FileNode[]): FileNode | undefined => {
        for (const node of nodes) {
          if (node.path === path) {
            return node;
          }
          if (node.children) {
            const found = findNode(node.children);
            if (found) return found;
          }
        }
        return undefined;
      };
      
      const node = findNode(mockFileTree);
      if (node && node.type === 'folder') {
        // Create some mock children if none exist
        if (!node.children || node.children.length === 0) {
          node.children = [
            {
              name: 'generated-file.md',
              path: `${node.path}/generated-file.md`,
              type: 'file',
              size: 1024,
              lastModified: new Date()
            },
            {
              name: 'generated-folder',
              path: `${node.path}/generated-folder`,
              type: 'folder'
            }
          ];
        }
        return node.children;
      }
      return [];
    }
    
    return mockFileTree;
  }
  
  watchDirectory(callback: (event: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir', path: string) => void): void {
    console.log('Watching directory (mock implementation)');
    
    // Simulate file system events with random intervals
    this._watchIntervalId = setInterval(() => {
      const events = ['add', 'change', 'unlink', 'addDir', 'unlinkDir'] as const;
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      
      // Generate a random path based on the event type
      let randomPath: string;
      if (randomEvent === 'add' || randomEvent === 'change' || randomEvent === 'unlink') {
        const fileNames = ['document.md', 'readme.md', 'config.json', 'notes.txt', 'example.md'];
        const randomFile = fileNames[Math.floor(Math.random() * fileNames.length)];
        randomPath = `${this.rootPath}/${randomFile}`;
      } else {
        const folderNames = ['docs', 'src', 'examples', 'config', 'assets'];
        const randomFolder = folderNames[Math.floor(Math.random() * folderNames.length)];
        randomPath = `${this.rootPath}/${randomFolder}`;
      }
      
      // Call the callback with the simulated event
      callback(randomEvent, randomPath);
    }, 3000); // Simulate an event every 3 seconds
  }
  
  private _watchIntervalId: any = null;
  
  stopWatching(): void {
    console.log('Stopped watching directory (mock implementation)');
    if (this._watchIntervalId) {
      clearInterval(this._watchIntervalId);
      this._watchIntervalId = null;
    }
  }
}
