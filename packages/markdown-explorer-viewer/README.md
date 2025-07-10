# @asafarim/markdown-explorer-viewer

A powerful, flexible React component for exploring and viewing markdown files with an integrated file tree navigation system. Perfect for documentation sites, static site generators, and any application that needs to display markdown content with file system navigation.

## ✨ Features

- 🗂️ **File Tree Navigation** - Interactive folder/file browser with expand/collapse
- 📝 **Markdown Rendering** - Full GitHub Flavored Markdown support with syntax highlighting
- 🔍 **Search & Filter** - Search through files and folders with real-time filtering
- 🎨 **Themeable** - Built-in light/dark themes with auto system detection
- 📱 **Responsive Design** - Mobile-friendly with collapsible sidebar
- 🧭 **Breadcrumb Navigation** - Easy navigation with clickable breadcrumbs
- ⚡ **Performance Optimized** - Lazy loading and efficient rendering
- ♿ **Accessible** - Full keyboard navigation and screen reader support
- 🎯 **TypeScript First** - Complete type safety and IntelliSense support
- 🔗 **Router Integration** - Works seamlessly with React Router and other routers

## 📦 Installation

```bash
npm install @asafarim/markdown-explorer-viewer
# or
yarn add @asafarim/markdown-explorer-viewer
# or
pnpm add @asafarim/markdown-explorer-viewer
```

### Peer Dependencies

```bash
npm install react react-dom react-router-dom
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { MarkdownExplorer } from '@asafarim/markdown-explorer-viewer';
import { parseFileTree } from '@asafarim/markdown-explorer-viewer';

// Create a virtual file tree from your markdown content
const files = {
  '/docs/README.md': '# Welcome\n\nThis is the main documentation.',
  '/docs/getting-started.md': '# Getting Started\n\nFollow these steps...',
  '/docs/api/overview.md': '# API Overview\n\nOur API provides...',
  '/docs/api/reference.md': '# API Reference\n\nComplete API documentation.'
};

const fileTree = parseFileTree(files);

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <MarkdownExplorer
        fileTree={fileTree}
        theme="dark"
        showBreadcrumbs={true}
        enableSearch={true}
        initialRoute="/docs/README.md"
      />
    </div>
  );
}
```

### With React Router Integration

```tsx
import { MarkdownExplorer } from '@asafarim/markdown-explorer-viewer';
import { useNavigate, useLocation } from 'react-router-dom';

function DocumentationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(`/docs${path}`);
  };

  return (
    <MarkdownExplorer
      fileTree={docsFileTree}
      initialRoute={location.pathname.replace('/docs', '')}
      onNavigate={handleNavigate}
      theme="auto"
      showFileTree={true}
      enableSearch={true}
    />
  );
}
```

### Custom File Tree Structure

```tsx
import { FileNode } from '@asafarim/markdown-explorer-viewer';

const customFileTree: FileNode = {
  name: 'Documentation',
  path: '/',
  type: 'folder',
  children: [
    {
      name: 'Introduction',
      path: '/intro',
      type: 'folder',
      children: [
        {
          name: 'Overview.md',
          path: '/intro/overview.md',
          type: 'file',
          content: '# Overview\n\nWelcome to our documentation...'
        }
      ]
    },
    {
      name: 'Guide.md',
      path: '/guide.md',
      type: 'file',
      content: '# User Guide\n\nThis guide will help you...'
    }
  ]
};

<MarkdownExplorer fileTree={customFileTree} />
```

## 📚 API Reference

### MarkdownExplorer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileTree` | `FileNode` | `undefined` | Virtual file tree structure |
| `rootPath` | `string` | `'/'` | Root path for navigation |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Color theme |
| `className` | `string` | `''` | Additional CSS class |
| `initialRoute` | `string` | `undefined` | Initial path to navigate to |
| `onNavigate` | `(path: string, node: FileNode) => void` | `undefined` | Navigation callback |
| `enableSearch` | `boolean` | `true` | Enable file search |
| `searchPlaceholder` | `string` | `'Search files...'` | Search input placeholder |
| `showIcons` | `boolean` | `true` | Show file/folder icons |
| `showFileTree` | `boolean` | `true` | Show file tree sidebar |
| `renderFileIcon` | `(node: FileNode) => ReactNode` | `undefined` | Custom file icon renderer |
| `renderFolderIcon` | `(node: FileNode) => ReactNode` | `undefined` | Custom folder icon renderer |
| `sidebarWidth` | `string` | `'280px'` | Sidebar width |
| `showBreadcrumbs` | `boolean` | `true` | Show breadcrumb navigation |
| `markdownComponents` | `Record<string, ComponentType>` | `undefined` | Custom markdown components |

### FileNode Structure

```typescript
interface FileNode {
  name: string;           // Display name
  path: string;           // Full path
  type: 'file' | 'folder'; // Node type
  children?: FileNode[];  // Child nodes (for folders)
  content?: string;       // File content (for files)
  lastModified?: string;  // Last modification date
  size?: number;          // File size in bytes
}
```

### Utility Functions

#### `parseFileTree(files: Record<string, string>): FileNode`

Converts a flat file structure into a hierarchical tree.

```tsx
const files = {
  '/docs/README.md': '# Documentation',
  '/docs/guide/setup.md': '# Setup Guide',
  '/docs/guide/usage.md': '# Usage Examples'
};

const tree = parseFileTree(files);
```

#### `findNodeByPath(tree: FileNode, path: string): FileNode | null`

Finds a specific node in the tree by its path.

```tsx
const node = findNodeByPath(fileTree, '/docs/README.md');
```

#### `searchNodes(tree: FileNode, query: string): FileNode[]`

Searches for nodes matching the query.

```tsx
const results = searchNodes(fileTree, 'api');
```

## 🎨 Theming & Customization

### CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  --me-primary: #2563eb;
  --me-primary-hover: #1d4ed8;
  --me-text-primary: #1f2937;
  --me-text-secondary: #6b7280;
  --me-bg-primary: #ffffff;
  --me-bg-secondary: #f9fafb;
  --me-border: #e5e7eb;
  --me-radius: 0.375rem;
  --me-sidebar-width: 280px;
}

[data-theme="dark"] {
  --me-text-primary: #f9fafb;
  --me-text-secondary: #d1d5db;
  --me-bg-primary: #111827;
  --me-bg-secondary: #1f2937;
  --me-border: #374151;
}
```

### Custom Styling

```tsx
<MarkdownExplorer
  className="my-custom-explorer"
  fileTree={fileTree}
  theme="dark"
/>
```

```css
.my-custom-explorer {
  border: 2px solid #2563eb;
  border-radius: 8px;
}

.my-custom-explorer .file-tree {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Custom Markdown Components

```tsx
const customComponents = {
  h1: ({ children }) => (
    <h1 style={{ color: '#2563eb', borderBottom: '2px solid #2563eb' }}>
      {children}
    </h1>
  ),
  code: ({ children, className }) => (
    <code className={className} style={{ background: '#f1f5f9' }}>
      {children}
    </code>
  )
};

<MarkdownExplorer
  fileTree={fileTree}
  markdownComponents={customComponents}
/>
```

## 🔧 Advanced Usage

### File System Integration

```tsx
// Example with file system API
async function loadFileSystem() {
  const files: Record<string, string> = {};
  
  // Load files from your source
  files['/README.md'] = await fetch('/docs/README.md').then(r => r.text());
  files['/guide.md'] = await fetch('/docs/guide.md').then(r => r.text());
  
  return parseFileTree(files);
}

function App() {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  
  useEffect(() => {
    loadFileSystem().then(setFileTree);
  }, []);
  
  if (!fileTree) return <div>Loading...</div>;
  
  return <MarkdownExplorer fileTree={fileTree} />;
}
```

### Dynamic Content Loading

```tsx
function DynamicMarkdownExplorer() {
  const [currentContent, setCurrentContent] = useState('');
  
  const handleNavigate = async (path: string, node: FileNode) => {
    if (node.type === 'file' && !node.content) {
      // Load content dynamically
      const content = await fetch(`/api/files${path}`).then(r => r.text());
      node.content = content;
      setCurrentContent(content);
    }
  };
  
  return (
    <MarkdownExplorer
      fileTree={fileTree}
      onNavigate={handleNavigate}
    />
  );
}
```

### Search and Filter

```tsx
function SearchableExplorer() {
  const [searchResults, setSearchResults] = useState<FileNode[]>([]);
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      const results = searchNodes(fileTree, query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  return (
    <div>
      <input 
        type="text" 
        placeholder="Search documentation..." 
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          {searchResults.map(node => (
            <div key={node.path}>{node.name}</div>
          ))}
        </div>
      )}
      
      <MarkdownExplorer
        fileTree={fileTree}
        enableSearch={true}
      />
    </div>
  );
}
```

## 🌍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Ali Safari](https://github.com/AliSafari-IT)

## 🔗 Related Packages

- [`@asafarim/project-card`](../project-card) - Project showcase cards
- [`@asafarim/display-code`](../display-code) - Syntax-highlighted code blocks
- [`@asafarim/paginated-project-grid`](../paginated-project-grid) - Project grid with pagination
