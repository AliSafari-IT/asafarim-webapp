# API Reference

Complete reference for all components, props, and utility functions.

## MarkdownExplorer

The primary component providing the complete markdown exploration experience.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileTree` | `FileNode` | - | **Required.** The root node of the file tree |
| `rootPath` | `string` | `'/'` | Root path for navigation |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Color theme |
| `className` | `string` | `''` | Additional CSS class |
| `initialRoute` | `string` | - | Initial path to navigate to |
| `onNavigate` | `(path: string, node: FileNode) => void` | - | Navigation callback |
| `enableSearch` | `boolean` | `true` | Enable search functionality |
| `searchPlaceholder` | `string` | `'Search files...'` | Search input placeholder |
| `showIcons` | `boolean` | `true` | Show file/folder icons |
| `showFileTree` | `boolean` | `true` | Show file tree sidebar |
| `renderFileIcon` | `(node: FileNode) => ReactNode` | - | Custom file icon renderer |
| `renderFolderIcon` | `(node: FileNode) => ReactNode` | - | Custom folder icon renderer |
| `sidebarWidth` | `string` | `'280px'` | Sidebar width CSS value |
| `showBreadcrumbs` | `boolean` | `true` | Show breadcrumb navigation |
| `markdownComponents` | `Record<string, ComponentType>` | - | Custom markdown components |

### Usage Examples

#### Basic Setup
```tsx
<MarkdownExplorer fileTree={myFileTree} />
```

#### With Custom Theme
```tsx
<MarkdownExplorer 
  fileTree={myFileTree}
  theme="dark"
  className="documentation-explorer"
/>
```

#### With Navigation Handling
```tsx
<MarkdownExplorer 
  fileTree={myFileTree}
  initialRoute="/docs/introduction.md"
  onNavigate={(path, node) => {
    console.log('Navigated to:', path);
    // Update router, analytics, etc.
  }}
/>
```

## FileTree

Standalone file tree navigation component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileTree` | `FileNode` | - | **Required.** Root file tree node |
| `currentPath` | `string` | - | Currently selected path |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Color theme |
| `onNodeClick` | `(node: FileNode) => void` | - | **Required.** Node click handler |
| `enableSearch` | `boolean` | `true` | Enable search functionality |
| `searchPlaceholder` | `string` | `'Search files...'` | Search input placeholder |
| `showIcons` | `boolean` | `true` | Show file/folder icons |
| `renderFileIcon` | `(node: FileNode) => ReactNode` | - | Custom file icon renderer |
| `renderFolderIcon` | `(node: FileNode) => ReactNode` | - | Custom folder icon renderer |
| `className` | `string` | `''` | Additional CSS class |

## MarkdownViewer

Pure markdown content renderer.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | - | **Required.** Markdown content |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Color theme |
| `className` | `string` | `''` | Additional CSS class |
| `components` | `Record<string, ComponentType>` | - | Custom markdown components |
| `filePath` | `string` | - | File path for relative links |

### Custom Components Example

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
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} ↗
    </a>
  )
};

<MarkdownViewer 
  content={markdownContent}
  components={customComponents}
/>
```

## Breadcrumbs

Navigation breadcrumb component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | - | **Required.** Current path |
| `rootPath` | `string` | `'/'` | Root path |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Color theme |
| `onPathClick` | `(path: string) => void` | - | **Required.** Path click handler |
| `className` | `string` | `''` | Additional CSS class |

## TypeScript Types

### FileNode
```typescript
interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  lastModified?: string;
  size?: number;
}
```

### Theme
```typescript
type Theme = 'light' | 'dark' | 'auto';
```

### NavigationState
```typescript
interface NavigationState {
  currentPath: string;
  currentNode: FileNode | null;
  history: string[];
  historyIndex: number;
}
```

## Utility Functions

### parseFileTree(files: Record<string, string>): FileNode
Converts flat file structure to hierarchical tree.

### findNodeByPath(tree: FileNode, path: string): FileNode | null
Finds node by path in the tree.

### searchNodes(tree: FileNode, query: string): FileNode[]
Searches nodes matching the query.

### generateBreadcrumbs(path: string, rootPath?: string): Array<{name: string, path: string}>
Generates breadcrumb items from path.

### isMarkdownFile(filename: string): boolean
Checks if file is a markdown file.

### getFileExtension(filename: string): string
Extracts file extension from filename.

### normalizePath(path: string): string
Normalizes path format.

---

This concludes the complete API reference. For examples and guides, see the other documentation sections.