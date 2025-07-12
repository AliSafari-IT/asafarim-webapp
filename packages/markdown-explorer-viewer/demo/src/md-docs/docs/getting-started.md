# Getting Started

This guide will walk you through setting up and using the Markdown Explorer Viewer in your React application.

## Installation

```bash
npm install @asafarim/markdown-explorer-viewer
# or
yarn add @asafarim/markdown-explorer-viewer
# or  
pnpm add @asafarim/markdown-explorer-viewer
```

## Basic Usage

Here's a simple example to get you started:

```tsx
import { MarkdownExplorer, parseFileTree } from '@asafarim/markdown-explorer-viewer';

// Your markdown files
const files = {
  '/README.md': '# Welcome\n\nThis is your documentation.',
  '/guide.md': '# Guide\n\nStep-by-step instructions.'
};

// Convert to file tree
const fileTree = parseFileTree(files);

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <MarkdownExplorer 
        fileTree={fileTree}
        theme="auto"
        enableSearch={true}
      />
    </div>
  );
}
```

## Advanced Configuration

### Custom Themes

```tsx
<MarkdownExplorer
  fileTree={fileTree}
  theme="dark"
  className="my-custom-explorer"
/>
```

### Navigation Callbacks

```tsx
const handleNavigate = (path: string, node: FileNode) => {
  console.log('Navigated to:', path);
  // Update URL, analytics, etc.
};

<MarkdownExplorer
  fileTree={fileTree}
  onNavigate={handleNavigate}
/>
```

## What's Next?

- Explore the [API Reference](/docs/api/overview.md) for detailed configuration options
- Check out [Examples](/examples/basic.md) for more implementation patterns
- Learn about [Theming](/docs/theming.md) to customize the appearance