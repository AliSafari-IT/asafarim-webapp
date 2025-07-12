# Getting Started

## Installation

```bash
npm install @asafarim/markdown-explorer-viewer
```

## Usage

```tsx
import { MarkdownExplorer } from '@asafarim/markdown-explorer-viewer';

const fileTree = {
  '/docs/introduction.md': '# Introduction',
  '/docs/getting-started.md': '# Getting Started',
};

function App() {
  return (
    <MarkdownExplorer
      fileTree={fileTree}
      initialRoute="/docs/introduction.md"
    />
  );
}
```

## Props

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

