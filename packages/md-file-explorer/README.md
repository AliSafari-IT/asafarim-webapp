# @asafarim/md-file-explorer

A TypeScript package for recursively exploring markdown files and folders with lazy loading capabilities.

## Features

- 🚀 **Lazy Loading**: Scan directories on-demand, not all at once
- 📁 **Recursive Scanning**: Automatically discovers nested folders and markdown files
- 🔍 **Smart Filtering**: Include/exclude files based on extensions and patterns
- 📝 **Metadata Parsing**: Extracts frontmatter from markdown files
- 👀 **File Watching**: Real-time updates when files change
- 🎯 **TypeScript**: Fully typed with comprehensive interfaces
- ⚡ **Performance**: Only loads content when needed

## Installation

```bash
npm install @asafarim/md-file-explorer
# or
yarn add @asafarim/md-file-explorer
# or
pnpm add @asafarim/md-file-explorer
```

## Basic Usage

```typescript
import { MdFileExplorer } from '@asafarim/md-file-explorer';

// Create explorer instance
const explorer = new MdFileExplorer('/path/to/docs', {
  includeExtensions: ['.md', '.mdx'],
  excludePatterns: ['node_modules', '.git'],
  parseMarkdownMetadata: true
});

// Get file tree (lazy loading)
const fileTree = await explorer.getFileTree();

// Get specific file content
const content = await explorer.getFileContent('folder/file.md');

// Scan entire directory
const scanResult = await explorer.scanDirectory();
```

## API Reference

### MdFileExplorer

Main class for exploring markdown files.

#### Constructor

```typescript
new MdFileExplorer(rootPath: string, options?: ExplorerOptions)
```

#### Methods

- `scanDirectory(path?, options?)` - Scan directory and return complete tree
- `getFileTree(path?, depth?)` - Get file tree with optional depth limit (lazy)
- `getFileContent(filePath)` - Get content of specific file
- `watchDirectory(callback)` - Watch for file changes
- `stopWatching()` - Stop watching for changes
- `searchFiles(query, searchInContent?)` - Search for files
- `fileExists(filePath)` - Check if file exists

### Types

#### FileNode
```typescript
interface FileNode {
  name: string;           // File or folder name
  path: string;           // Relative path from root
  type: 'folder' | 'file'; // Node type
  children?: FileNode[];   // Child nodes (folders only)
  lastModified?: Date;     // Last modification date
  size?: number;           // File size in bytes
  metadata?: MarkdownMetadata; // Parsed frontmatter
}
```

#### ExplorerOptions
```typescript
interface ExplorerOptions {
  rootPath: string;                    // Root directory path
  includeExtensions?: string[];        // File extensions to include
  excludePatterns?: string[];          // Patterns to exclude
  maxDepth?: number;                   // Maximum scan depth
  sortBy?: 'name' | 'date' | 'size';  // Sort criteria
  sortOrder?: 'asc' | 'desc';         // Sort order
  includeDotFiles?: boolean;           // Include hidden files
  parseMarkdownMetadata?: boolean;     // Parse frontmatter
}
```

## Examples

### Lazy Loading File Tree

```typescript
const explorer = new MdFileExplorer('/docs');

// Get top-level folders and files only
const topLevel = await explorer.getFileTree('/', 1);

// Load specific folder contents
const packageDocs = await explorer.getFileTree('/packages', 2);
```

### File Watching

```typescript
explorer.watchDirectory((event, path) => {
  console.log(`File ${event}: ${path}`);
  // Handle file changes (add, change, unlink, etc.)
});
```

### Search Files

```typescript
// Search by filename
const results = await explorer.searchFiles('react');

// Search in content (if implemented)
const contentResults = await explorer.searchFiles('component', true);
```

### Custom Options

```typescript
const explorer = new MdFileExplorer('/docs', {
  includeExtensions: ['.md', '.mdx', '.txt'],
  excludePatterns: ['draft-*', 'temp/**'],
  maxDepth: 5,
  sortBy: 'date',
  sortOrder: 'desc',
  parseMarkdownMetadata: true
});
```

## Integration Examples

### With Express API

```typescript
import express from 'express';
import { MdFileExplorer } from '@asafarim/md-file-explorer';

const app = express();
const explorer = new MdFileExplorer('./docs');

// Get file tree
app.get('/api/docs/tree', async (req, res) => {
  const { path, depth } = req.query;
  const tree = await explorer.getFileTree(path as string, Number(depth) || 1);
  res.json(tree);
});

// Get file content
app.get('/api/docs/file', async (req, res) => {
  const { path } = req.query;
  try {
    const content = await explorer.getFileContent(path as string);
    res.json(content);
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});
```

### With React Component

```typescript
import React, { useState, useEffect } from 'react';
import { MdFileExplorer, FileNode } from '@asafarim/md-file-explorer';

const DocumentationExplorer: React.FC = () => {
  const [explorer] = useState(() => new MdFileExplorer('./docs'));
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  
  useEffect(() => {
    const loadTree = async () => {
      const tree = await explorer.getFileTree();
      setFileTree(tree);
    };
    
    loadTree();
    
    // Watch for changes
    explorer.watchDirectory((event, path) => {
      // Refresh tree on changes
      loadTree();
    });
    
    return () => explorer.stopWatching();
  }, [explorer]);
  
  return (
    <div>
      {/* Render file tree */}
      {fileTree.map(node => (
        <FileTreeNode key={node.path} node={node} explorer={explorer} />
      ))}
    </div>
  );
};
```

## File System Structure

The package works best with organized documentation structures:

```
docs/
├── README.md
├── guides/
│   ├── getting-started.md
│   └── advanced-usage.md
├── api/
│   ├── overview.md
│   └── reference/
│       ├── classes.md
│       └── interfaces.md
└── examples/
    └── basic-usage.md
```

## Performance Considerations

- Use lazy loading (`getFileTree()` with depth limit) for large directory structures
- Enable file watching only when needed (development/preview modes)
- Consider implementing content caching for frequently accessed files
- Use exclude patterns to skip unnecessary directories (node_modules, .git, etc.)

## Contributing

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Build the package: `pnpm build`
4. Run tests: `pnpm test`

## License

MIT License - see LICENSE file for details.
