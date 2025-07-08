import { parseFileTree } from '../../src/utils/fileUtils';

// Sample markdown files for the demo
export const sampleFiles = {
  '/README.md': `# Markdown Explorer Viewer Demo

Welcome to the **Markdown Explorer Viewer** demo! This interactive demonstration showcases the powerful features of our markdown viewing and navigation component.

## 🌟 Features

- 📁 **File Tree Navigation** - Browse through folders and files
- 📝 **Markdown Rendering** - Rich markdown support with syntax highlighting
- 🔍 **Search Functionality** - Find files quickly with built-in search
- 🎨 **Theme Support** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works perfectly on mobile devices

## 🚀 Getting Started

Navigate through the file tree on the left to explore different markdown documents. You can:

1. Click on folders to expand/collapse them
2. Click on files to view their content
3. Use the search box to find specific files
4. Toggle the theme to see dark mode
5. Use breadcrumbs for quick navigation

Enjoy exploring!`,

  '/docs/introduction.md': `# Introduction

Welcome to our comprehensive documentation! This guide will help you understand and use all the features available in the Markdown Explorer Viewer.

## What is Markdown Explorer Viewer?

The Markdown Explorer Viewer is a React component that provides:

- **File tree navigation** for organizing documentation
- **Rich markdown rendering** with GitHub Flavored Markdown support
- **Search capabilities** to find content quickly
- **Responsive design** that works on all devices
- **Theme support** for both light and dark modes

## Key Benefits

### For Developers
- Easy integration with existing React applications
- TypeScript support for better development experience
- Customizable theming and styling options
- Performance optimized with lazy loading

### For Users
- Intuitive navigation similar to VS Code
- Fast search across all documentation
- Clean, readable markdown rendering
- Accessible design with keyboard navigation

## Next Steps

Check out the [Getting Started](/docs/getting-started.md) guide to learn how to implement this in your project!`,

  '/docs/getting-started.md': `# Getting Started

This guide will walk you through setting up and using the Markdown Explorer Viewer in your React application.

## Installation

\`\`\`bash
npm install @asafarim/markdown-explorer-viewer
# or
yarn add @asafarim/markdown-explorer-viewer
# or  
pnpm add @asafarim/markdown-explorer-viewer
\`\`\`

## Basic Usage

Here's a simple example to get you started:

\`\`\`tsx
import { MarkdownExplorer, parseFileTree } from '@asafarim/markdown-explorer-viewer';

// Your markdown files
const files = {
  '/README.md': '# Welcome\\n\\nThis is your documentation.',
  '/guide.md': '# Guide\\n\\nStep-by-step instructions.'
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
\`\`\`

## Advanced Configuration

### Custom Themes

\`\`\`tsx
<MarkdownExplorer
  fileTree={fileTree}
  theme="dark"
  className="my-custom-explorer"
/>
\`\`\`

### Navigation Callbacks

\`\`\`tsx
const handleNavigate = (path: string, node: FileNode) => {
  console.log('Navigated to:', path);
  // Update URL, analytics, etc.
};

<MarkdownExplorer
  fileTree={fileTree}
  onNavigate={handleNavigate}
/>
\`\`\`

## What's Next?

- Explore the [API Reference](/docs/api/overview.md) for detailed configuration options
- Check out [Examples](/examples/basic.md) for more implementation patterns
- Learn about [Theming](/docs/theming.md) to customize the appearance`,

  '/docs/api/overview.md': `# API Overview

The Markdown Explorer Viewer provides a comprehensive API for customizing and controlling the component behavior.

## Core Components

### MarkdownExplorer

The main component that orchestrates the entire experience.

**Props:**
- \`fileTree\`: FileNode - The hierarchical file structure
- \`theme\`: 'light' | 'dark' | 'auto' - Color theme
- \`enableSearch\`: boolean - Enable/disable search functionality
- \`showBreadcrumbs\`: boolean - Show navigation breadcrumbs
- \`onNavigate\`: function - Callback for navigation events

### FileTree

Standalone file tree component for custom layouts.

**Props:**
- \`fileTree\`: FileNode - File structure to display
- \`currentPath\`: string - Currently selected path
- \`onNodeClick\`: function - Handle file/folder clicks
- \`enableSearch\`: boolean - Enable search within tree

### MarkdownViewer

Pure markdown rendering component.

**Props:**
- \`content\`: string - Markdown content to render
- \`theme\`: 'light' | 'dark' | 'auto' - Color theme
- \`components\`: object - Custom React components for markdown elements

## Data Types

### FileNode

\`\`\`typescript
interface FileNode {
  name: string;           // Display name
  path: string;           // Full path identifier
  type: 'file' | 'folder'; // Node type
  children?: FileNode[];  // Child nodes (folders only)
  content?: string;       // File content (files only)
  lastModified?: string;  // ISO date string
  size?: number;          // File size in bytes
}
\`\`\`

## Utility Functions

### parseFileTree(files: Record<string, string>): FileNode

Converts a flat file structure into a hierarchical tree.

\`\`\`typescript
const files = {
  '/docs/readme.md': '# Documentation',
  '/docs/api/overview.md': '# API Overview'
};

const tree = parseFileTree(files);
\`\`\`

### findNodeByPath(tree: FileNode, path: string): FileNode | null

Locates a specific node in the file tree.

\`\`\`typescript
const node = findNodeByPath(fileTree, '/docs/api/overview.md');
\`\`\`

### searchNodes(tree: FileNode, query: string): FileNode[]

Searches for nodes matching the given query.

\`\`\`typescript
const results = searchNodes(fileTree, 'api');
\`\`\`

## Event Handling

### Navigation Events

\`\`\`typescript
const handleNavigate = (path: string, node: FileNode) => {
  // Called when user navigates to a different file/folder
  console.log('Navigated to:', path);
  
  // Update browser URL
  window.history.pushState({}, '', \`/docs\${path}\`);
  
  // Track analytics
  analytics.track('documentation_view', { path });
};
\`\`\`

### Search Events

Search is handled internally, but you can control it programmatically:

\`\`\`typescript
// Custom search implementation
const MyCustomExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredTree = useMemo(() => {
    return searchQuery 
      ? filterTreeByQuery(fileTree, searchQuery)
      : fileTree;
  }, [fileTree, searchQuery]);

  return (
    <MarkdownExplorer
      fileTree={filteredTree}
      enableSearch={false} // Disable built-in search
    />
  );
};
\`\`\`

For more detailed examples, see the [API Reference](/docs/api/reference.md).`,

  '/docs/api/reference.md': `# API Reference

Complete reference for all components, props, and utility functions.

## MarkdownExplorer

The primary component providing the complete markdown exploration experience.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`fileTree\` | \`FileNode\` | - | **Required.** The root node of the file tree |
| \`rootPath\` | \`string\` | \`'/'\` | Root path for navigation |
| \`theme\` | \`'light' \\| 'dark' \\| 'auto'\` | \`'auto'\` | Color theme |
| \`className\` | \`string\` | \`''\` | Additional CSS class |
| \`initialRoute\` | \`string\` | - | Initial path to navigate to |
| \`onNavigate\` | \`(path: string, node: FileNode) => void\` | - | Navigation callback |
| \`enableSearch\` | \`boolean\` | \`true\` | Enable search functionality |
| \`searchPlaceholder\` | \`string\` | \`'Search files...'\` | Search input placeholder |
| \`showIcons\` | \`boolean\` | \`true\` | Show file/folder icons |
| \`showFileTree\` | \`boolean\` | \`true\` | Show file tree sidebar |
| \`renderFileIcon\` | \`(node: FileNode) => ReactNode\` | - | Custom file icon renderer |
| \`renderFolderIcon\` | \`(node: FileNode) => ReactNode\` | - | Custom folder icon renderer |
| \`sidebarWidth\` | \`string\` | \`'280px'\` | Sidebar width CSS value |
| \`showBreadcrumbs\` | \`boolean\` | \`true\` | Show breadcrumb navigation |
| \`markdownComponents\` | \`Record<string, ComponentType>\` | - | Custom markdown components |

### Usage Examples

#### Basic Setup
\`\`\`tsx
<MarkdownExplorer fileTree={myFileTree} />
\`\`\`

#### With Custom Theme
\`\`\`tsx
<MarkdownExplorer 
  fileTree={myFileTree}
  theme="dark"
  className="documentation-explorer"
/>
\`\`\`

#### With Navigation Handling
\`\`\`tsx
<MarkdownExplorer 
  fileTree={myFileTree}
  initialRoute="/docs/introduction.md"
  onNavigate={(path, node) => {
    console.log('Navigated to:', path);
    // Update router, analytics, etc.
  }}
/>
\`\`\`

## FileTree

Standalone file tree navigation component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`fileTree\` | \`FileNode\` | - | **Required.** Root file tree node |
| \`currentPath\` | \`string\` | - | Currently selected path |
| \`theme\` | \`'light' \\| 'dark' \\| 'auto'\` | \`'light'\` | Color theme |
| \`onNodeClick\` | \`(node: FileNode) => void\` | - | **Required.** Node click handler |
| \`enableSearch\` | \`boolean\` | \`true\` | Enable search functionality |
| \`searchPlaceholder\` | \`string\` | \`'Search files...'\` | Search input placeholder |
| \`showIcons\` | \`boolean\` | \`true\` | Show file/folder icons |
| \`renderFileIcon\` | \`(node: FileNode) => ReactNode\` | - | Custom file icon renderer |
| \`renderFolderIcon\` | \`(node: FileNode) => ReactNode\` | - | Custom folder icon renderer |
| \`className\` | \`string\` | \`''\` | Additional CSS class |

## MarkdownViewer

Pure markdown content renderer.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`content\` | \`string\` | - | **Required.** Markdown content |
| \`theme\` | \`'light' \\| 'dark' \\| 'auto'\` | \`'light'\` | Color theme |
| \`className\` | \`string\` | \`''\` | Additional CSS class |
| \`components\` | \`Record<string, ComponentType>\` | - | Custom markdown components |
| \`filePath\` | \`string\` | - | File path for relative links |

### Custom Components Example

\`\`\`tsx
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
\`\`\`

## Breadcrumbs

Navigation breadcrumb component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`path\` | \`string\` | - | **Required.** Current path |
| \`rootPath\` | \`string\` | \`'/'\` | Root path |
| \`theme\` | \`'light' \\| 'dark' \\| 'auto'\` | \`'light'\` | Color theme |
| \`onPathClick\` | \`(path: string) => void\` | - | **Required.** Path click handler |
| \`className\` | \`string\` | \`''\` | Additional CSS class |

## TypeScript Types

### FileNode
\`\`\`typescript
interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  lastModified?: string;
  size?: number;
}
\`\`\`

### Theme
\`\`\`typescript
type Theme = 'light' | 'dark' | 'auto';
\`\`\`

### NavigationState
\`\`\`typescript
interface NavigationState {
  currentPath: string;
  currentNode: FileNode | null;
  history: string[];
  historyIndex: number;
}
\`\`\`

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

This concludes the complete API reference. For examples and guides, see the other documentation sections.`,

  '/docs/theming.md': `# Theming Guide

Learn how to customize the appearance of the Markdown Explorer Viewer to match your application's design.

## Built-in Themes

The component comes with three theme options:

- \`light\` - Clean, bright theme suitable for most applications
- \`dark\` - Dark theme for low-light environments
- \`auto\` - Automatically detects system preference

### Setting a Theme

\`\`\`tsx
// Light theme
<MarkdownExplorer fileTree={fileTree} theme="light" />

// Dark theme  
<MarkdownExplorer fileTree={fileTree} theme="dark" />

// Auto-detect system preference
<MarkdownExplorer fileTree={fileTree} theme="auto" />
\`\`\`

## CSS Custom Properties

The component uses CSS custom properties (variables) for easy theming:

### Light Theme Variables

\`\`\`css
:root {
  --me-primary: #2563eb;
  --me-primary-hover: #1d4ed8;
  --me-text-primary: #1f2937;
  --me-text-secondary: #6b7280;
  --me-text-muted: #9ca3af;
  --me-bg-primary: #ffffff;
  --me-bg-secondary: #f9fafb;
  --me-bg-tertiary: #f3f4f6;
  --me-border: #e5e7eb;
  --me-border-hover: #d1d5db;
  --me-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --me-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --me-radius: 0.375rem;
  --me-radius-lg: 0.5rem;
  --me-transition: all 0.15s ease-in-out;
  --me-sidebar-width: 280px;
  --me-code-bg: #f8fafc;
  --me-code-border: #e2e8f0;
}
\`\`\`

### Dark Theme Variables

\`\`\`css
[data-theme="dark"] {
  --me-text-primary: #f9fafb;
  --me-text-secondary: #d1d5db;
  --me-text-muted: #9ca3af;
  --me-bg-primary: #111827;
  --me-bg-secondary: #1f2937;
  --me-bg-tertiary: #374151;
  --me-border: #374151;
  --me-border-hover: #4b5563;
  --me-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  --me-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  --me-code-bg: #1e293b;
  --me-code-border: #334155;
}
\`\`\`

## Custom Styling

### Using CSS Classes

You can add custom styling using the \`className\` prop:

\`\`\`tsx
<MarkdownExplorer 
  fileTree={fileTree}
  className="my-custom-explorer"
/>
\`\`\`

\`\`\`css
.my-custom-explorer {
  border: 2px solid #3b82f6;
  border-radius: 12px;
  overflow: hidden;
}

/* Customize sidebar */
.my-custom-explorer .sidebar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Customize file tree */
.my-custom-explorer .file-tree {
  padding: 1rem;
}
\`\`\`

### Overriding CSS Variables

Create your own theme by overriding the CSS variables:

\`\`\`css
.purple-theme {
  --me-primary: #8b5cf6;
  --me-primary-hover: #7c3aed;
  --me-bg-secondary: #faf5ff;
  --me-border: #e9d5ff;
}
\`\`\`

\`\`\`tsx
<MarkdownExplorer 
  fileTree={fileTree}
  className="purple-theme"
/>
\`\`\`

## Custom Markdown Components

Customize how markdown elements are rendered:

\`\`\`tsx
const customComponents = {
  h1: ({ children }) => (
    <h1 style={{ 
      color: '#8b5cf6', 
      borderBottom: '3px solid #8b5cf6',
      paddingBottom: '0.5rem'
    }}>
      {children}
    </h1>
  ),
  
  h2: ({ children }) => (
    <h2 style={{ 
      color: '#6366f1',
      marginTop: '2rem'
    }}>
      🎯 {children}
    </h2>
  ),
  
  code: ({ children, className }) => (
    <code 
      className={className}
      style={{ 
        background: '#f1f5f9',
        padding: '2px 6px',
        borderRadius: '4px',
        border: '1px solid #cbd5e1'
      }}
    >
      {children}
    </code>
  ),
  
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '4px solid #8b5cf6',
      background: 'linear-gradient(90deg, #faf5ff 0%, #f3f4f6 100%)',
      padding: '1rem',
      margin: '1rem 0',
      borderRadius: '0 8px 8px 0'
    }}>
      {children}
    </blockquote>
  ),
  
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {children}
      </table>
    </div>
  )
};

<MarkdownExplorer 
  fileTree={fileTree}
  markdownComponents={customComponents}
/>
\`\`\`

## Icon Customization

### Custom File Icons

\`\`\`tsx
const renderFileIcon = (node: FileNode) => {
  const ext = node.name.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'md':
    case 'markdown':
      return <span style={{ color: '#22c55e' }}>📝</span>;
    case 'js':
    case 'jsx':
      return <span style={{ color: '#f7df1e' }}>🟨</span>;
    case 'ts':
    case 'tsx':
      return <span style={{ color: '#3178c6' }}>🟦</span>;
    case 'css':
      return <span style={{ color: '#1572b6' }}>🎨</span>;
    default:
      return <span style={{ color: '#6b7280' }}>📄</span>;
  }
};

const renderFolderIcon = (node: FileNode) => {
  return <span style={{ color: '#f59e0b' }}>📁</span>;
};

<MarkdownExplorer 
  fileTree={fileTree}
  renderFileIcon={renderFileIcon}
  renderFolderIcon={renderFolderIcon}
/>
\`\`\`

## Responsive Design

The component is responsive by default, but you can customize breakpoints:

\`\`\`css
/* Custom mobile styles */
@media (max-width: 768px) {
  .my-explorer {
    --me-sidebar-width: 100%;
  }
}

/* Custom tablet styles */
@media (max-width: 1024px) {
  .my-explorer {
    --me-sidebar-width: 240px;
  }
}
\`\`\`

## Advanced Theming

### Theme Switching

\`\`\`tsx
function ThemeableExplorer() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  
  return (
    <div>
      <div style={{ padding: '1rem' }}>
        <label>
          Theme:
          <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </label>
      </div>
      
      <MarkdownExplorer 
        fileTree={fileTree}
        theme={theme}
      />
    </div>
  );
}
\`\`\`

### Dynamic Styling

\`\`\`tsx
function DynamicExplorer() {
  const [accentColor, setAccentColor] = useState('#2563eb');
  
  const customStyle = {
    '--me-primary': accentColor,
    '--me-primary-hover': adjustBrightness(accentColor, -20)
  } as React.CSSProperties;
  
  return (
    <div style={customStyle}>
      <input 
        type="color" 
        value={accentColor}
        onChange={(e) => setAccentColor(e.target.value)}
      />
      
      <MarkdownExplorer fileTree={fileTree} />
    </div>
  );
}
\`\`\`

This comprehensive theming system allows you to create a markdown explorer that perfectly matches your application's design language!`,

  '/examples/basic.md': `# Basic Examples

This page contains basic implementation examples for the Markdown Explorer Viewer.

## Minimal Setup

The simplest way to get started:

\`\`\`tsx
import { MarkdownExplorer, parseFileTree } from '@asafarim/markdown-explorer-viewer';

const files = {
  '/README.md': '# Hello World\\n\\nWelcome to my documentation!'
};

function App() {
  return (
    <MarkdownExplorer 
      fileTree={parseFileTree(files)} 
    />
  );
}
\`\`\`

## Multiple Files and Folders

Creating a more complex file structure:

\`\`\`tsx
const documentationFiles = {
  '/README.md': '# Project Documentation\\n\\nOverview of the project.',
  '/getting-started.md': '# Getting Started\\n\\nQuick start guide.',
  '/guides/installation.md': '# Installation\\n\\nHow to install the project.',
  '/guides/configuration.md': '# Configuration\\n\\nConfiguring your setup.',
  '/api/overview.md': '# API Overview\\n\\nIntroduction to our API.',
  '/api/endpoints.md': '# API Endpoints\\n\\nComplete endpoint reference.',
  '/examples/basic.md': '# Basic Examples\\n\\nSimple usage examples.',
  '/examples/advanced.md': '# Advanced Examples\\n\\nComplex use cases.'
};

const fileTree = parseFileTree(documentationFiles);

function DocumentationSite() {
  return (
    <div style={{ height: '100vh' }}>
      <MarkdownExplorer 
        fileTree={fileTree}
        initialRoute="/README.md"
        enableSearch={true}
        showBreadcrumbs={true}
      />
    </div>
  );
}
\`\`\`

## With Theme Toggle

Adding a theme switcher:

\`\`\`tsx
import { useState } from 'react';

function ThemedDocumentation() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <div>
      <header style={{ padding: '1rem', background: theme === 'dark' ? '#1f2937' : '#f9fafb' }}>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
      </header>
      
      <div style={{ height: 'calc(100vh - 70px)' }}>
        <MarkdownExplorer 
          fileTree={fileTree}
          theme={theme}
        />
      </div>
    </div>
  );
}
\`\`\`

## Custom File Icons

Customizing how files appear in the tree:

\`\`\`tsx
const customFileIcon = (node: FileNode) => {
  const extension = node.name.split('.').pop()?.toLowerCase();
  
  const iconMap = {
    'md': '📖',
    'js': '💛', 
    'ts': '💙',
    'json': '⚙️',
    'css': '🎨',
    'html': '🌐',
    'png': '🖼️',
    'jpg': '🖼️',
    'gif': '🖼️'
  };
  
  return <span>{iconMap[extension] || '📄'}</span>;
};

const customFolderIcon = (node: FileNode) => {
  const folderNames = {
    'api': '🔌',
    'docs': '📚',
    'examples': '💡',
    'guides': '📋',
    'assets': '📦'
  };
  
  return <span>{folderNames[node.name] || '📁'}</span>;
};

<MarkdownExplorer 
  fileTree={fileTree}
  renderFileIcon={customFileIcon}
  renderFolderIcon={customFolderIcon}
/>
\`\`\`

## Navigation Handling

Integrating with routing and analytics:

\`\`\`tsx
import { useNavigate } from 'react-router-dom';

function RoutedDocumentation() {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string, node: FileNode) => {
    // Update browser URL
    navigate(\`/docs\${path}\`);
    
    // Track page views
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: node.name,
        page_location: window.location.href
      });
    }
    
    // Update document title
    document.title = \`\${node.name} - Documentation\`;
  };
  
  return (
    <MarkdownExplorer 
      fileTree={fileTree}
      onNavigate={handleNavigate}
    />
  );
}
\`\`\`

## Responsive Layout

Creating a mobile-friendly layout:

\`\`\`tsx
import { useState, useEffect } from 'react';

function ResponsiveDocumentation() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarVisible(!mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div>
      {isMobile && (
        <header style={{ padding: '1rem', background: '#f3f4f6' }}>
          <button onClick={() => setSidebarVisible(!sidebarVisible)}>
            {sidebarVisible ? 'Hide' : 'Show'} Files
          </button>
        </header>
      )}
      
      <MarkdownExplorer 
        fileTree={fileTree}
        showFileTree={sidebarVisible}
        sidebarWidth={isMobile ? '100%' : '280px'}
      />
    </div>
  );
}
\`\`\`

## Search Integration

Adding custom search functionality:

\`\`\`tsx
import { useState, useMemo } from 'react';
import { searchNodes } from '@asafarim/markdown-explorer-viewer';

function SearchableDocumentation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FileNode[]>([]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchNodes(fileTree, query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  return (
    <div>
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem'
          }}
        />
        
        {searchResults.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4>Search Results ({searchResults.length})</h4>
            <ul>
              {searchResults.map(node => (
                <li key={node.path}>
                  <strong>{node.name}</strong> - {node.path}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <MarkdownExplorer 
        fileTree={fileTree}
        enableSearch={false} // Use custom search instead
      />
    </div>
  );
}
\`\`\`

These examples should give you a solid foundation for implementing the Markdown Explorer Viewer in your own projects!`,

  '/examples/advanced.md': `# Advanced Examples

This page demonstrates advanced usage patterns and integration techniques.

## Dynamic Content Loading

Loading markdown content from an API:

\`\`\`tsx
import { useState, useEffect } from 'react';
import { FileNode } from '@asafarim/markdown-explorer-viewer';

function DynamicDocumentation() {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadDocumentation() {
      try {
        // Load file list from API
        const response = await fetch('/api/documentation/files');
        const fileList = await response.json();
        
        // Build file tree with lazy loading
        const tree = buildFileTreeWithLazyLoading(fileList);
        setFileTree(tree);
      } catch (error) {
        console.error('Failed to load documentation:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadDocumentation();
  }, []);
  
  const handleNavigate = async (path: string, node: FileNode) => {
    if (node.type === 'file' && !node.content) {
      // Lazy load content when file is accessed
      try {
        const response = await fetch(\`/api/documentation/content?path=\${encodeURIComponent(path)}\`);
        const content = await response.text();
        node.content = content;
        
        // Force re-render by updating the tree
        setFileTree({ ...fileTree! });
      } catch (error) {
        console.error('Failed to load file content:', error);
        node.content = 'Error loading content';
      }
    }
  };
  
  if (loading) {
    return <div>Loading documentation...</div>;
  }
  
  if (!fileTree) {
    return <div>Failed to load documentation</div>;
  }
  
  return (
    <MarkdownExplorer 
      fileTree={fileTree}
      onNavigate={handleNavigate}
    />
  );
}

function buildFileTreeWithLazyLoading(fileList: string[]): FileNode {
  // Implementation details...
  return {
    name: 'Documentation',
    path: '/',
    type: 'folder',
    children: fileList.map(filePath => ({
      name: filePath.split('/').pop()!,
      path: filePath,
      type: 'file' as const,
      // content will be loaded lazily
    }))
  };
}
\`\`\`

## Multi-language Documentation

Supporting multiple languages:

\`\`\`tsx
interface MultiLanguageProps {
  languages: { code: string; name: string }[];
  defaultLanguage: string;
}

function MultiLanguageDocumentation({ languages, defaultLanguage }: MultiLanguageProps) {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [fileTrees, setFileTrees] = useState<Record<string, FileNode>>({});
  
  useEffect(() => {
    async function loadLanguageFiles() {
      const trees: Record<string, FileNode> = {};
      
      for (const lang of languages) {
        const response = await fetch(\`/api/docs/\${lang.code}/files\`);
        const files = await response.json();
        trees[lang.code] = parseFileTree(files);
      }
      
      setFileTrees(trees);
    }
    
    loadLanguageFiles();
  }, [languages]);
  
  const currentFileTree = fileTrees[currentLanguage];
  
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1>Documentation</h1>
          <select 
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </header>
      
      <div style={{ flex: 1 }}>
        {currentFileTree && (
          <MarkdownExplorer 
            key={currentLanguage} // Force re-render on language change
            fileTree={currentFileTree}
            initialRoute={\`/README.\${currentLanguage}.md\`}
          />
        )}
      </div>
    </div>
  );
}
\`\`\`

## Version-aware Documentation

Supporting multiple documentation versions:

\`\`\`tsx
interface VersionedDocumentationProps {
  versions: { version: string; label: string; default?: boolean }[];
}

function VersionedDocumentation({ versions }: VersionedDocumentationProps) {
  const [currentVersion, setCurrentVersion] = useState(
    versions.find(v => v.default)?.version || versions[0]?.version
  );
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  
  useEffect(() => {
    async function loadVersionFiles() {
      const response = await fetch(\`/api/docs/\${currentVersion}/structure\`);
      const files = await response.json();
      setFileTree(parseFileTree(files));
    }
    
    if (currentVersion) {
      loadVersionFiles();
    }
  }, [currentVersion]);
  
  const handleNavigate = async (path: string, node: FileNode) => {
    if (node.type === 'file' && !node.content) {
      const response = await fetch(\`/api/docs/\${currentVersion}/content?path=\${encodeURIComponent(path)}\`);
      const content = await response.text();
      node.content = content;
      setFileTree({ ...fileTree! });
    }
  };
  
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        padding: '1rem', 
        background: '#1f2937', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>Project Documentation</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem' }}>Version:</label>
          <select 
            value={currentVersion}
            onChange={(e) => setCurrentVersion(e.target.value)}
            style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
          >
            {versions.map(version => (
              <option key={version.version} value={version.version}>
                {version.label}
              </option>
            ))}
          </select>
        </div>
      </header>
      
      <div style={{ flex: 1 }}>
        {fileTree && (
          <MarkdownExplorer 
            key={currentVersion}
            fileTree={fileTree}
            onNavigate={handleNavigate}
            theme="dark"
          />
        )}
      </div>
    </div>
  );
}
\`\`\`

## Custom Markdown Plugins

Adding custom markdown processing:

\`\`\`tsx
import { useMemo } from 'react';

function CustomMarkdownExplorer() {
  const customComponents = useMemo(() => ({
    // Custom code block with copy functionality
    pre: ({ children, ...props }: any) => {
      const [copied, setCopied] = useState(false);
      
      const handleCopy = async () => {
        const code = children.props.children;
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };
      
      return (
        <div style={{ position: 'relative' }}>
          <pre {...props} style={{ paddingTop: '2.5rem' }}>
            {children}
          </pre>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              padding: '0.25rem 0.5rem',
              background: copied ? '#10b981' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              fontSize: '0.75rem'
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      );
    },
    
    // Custom callout boxes
    blockquote: ({ children }: any) => {
      const content = children.props.children;
      const isCallout = content.startsWith('[!');
      
      if (isCallout) {
        const type = content.match(/\\[!(\\w+)\\]/)?.[1]?.toLowerCase();
        const text = content.replace(/\\[!\\w+\\]\\s*/, '');
        
        const calloutStyles = {
          note: { border: '#3b82f6', bg: '#dbeafe' },
          warning: { border: '#f59e0b', bg: '#fef3c7' },
          danger: { border: '#ef4444', bg: '#fee2e2' },
          tip: { border: '#10b981', bg: '#d1fae5' }
        };
        
        const style = calloutStyles[type] || calloutStyles.note;
        
        return (
          <div style={{
            border: \`2px solid \${style.border}\`,
            background: style.bg,
            padding: '1rem',
            borderRadius: '0.5rem',
            margin: '1rem 0'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              fontSize: '0.875rem',
              color: style.border,
              marginBottom: '0.5rem'
            }}>
              {type || 'Note'}
            </div>
            {text}
          </div>
        );
      }
      
      return <blockquote>{children}</blockquote>;
    },
    
    // Interactive checkboxes for task lists
    input: ({ type, checked, ...props }: any) => {
      if (type === 'checkbox') {
        return (
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {}} // Make readonly for demo
            style={{ marginRight: '0.5rem' }}
            {...props}
          />
        );
      }
      return <input type={type} {...props} />;
    }
  }), []);
  
  return (
    <MarkdownExplorer 
      fileTree={fileTree}
      markdownComponents={customComponents}
    />
  );
}
\`\`\`

## Integration with State Management

Using with Redux or Zustand:

\`\`\`tsx
// Zustand store
import { create } from 'zustand';

interface DocumentationStore {
  currentPath: string;
  history: string[];
  bookmarks: string[];
  setCurrentPath: (path: string) => void;
  addBookmark: (path: string) => void;
  removeBookmark: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
}

const useDocumentationStore = create<DocumentationStore>((set, get) => ({
  currentPath: '/',
  history: ['/'],
  bookmarks: [],
  
  setCurrentPath: (path) => set(state => ({
    currentPath: path,
    history: [...state.history, path]
  })),
  
  addBookmark: (path) => set(state => ({
    bookmarks: [...state.bookmarks, path]
  })),
  
  removeBookmark: (path) => set(state => ({
    bookmarks: state.bookmarks.filter(b => b !== path)
  })),
  
  goBack: () => set(state => {
    const newHistory = state.history.slice(0, -1);
    return {
      history: newHistory,
      currentPath: newHistory[newHistory.length - 1] || '/'
    };
  }),
  
  goForward: () => {
    // Implementation for forward navigation
  }
}));

function StateManagedDocumentation() {
  const { 
    currentPath, 
    bookmarks, 
    setCurrentPath, 
    addBookmark, 
    removeBookmark,
    goBack 
  } = useDocumentationStore();
  
  const handleNavigate = (path: string, node: FileNode) => {
    setCurrentPath(path);
  };
  
  const isBookmarked = bookmarks.includes(currentPath);
  
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={goBack}>← Back</button>
          <span>Current: {currentPath}</span>
          <button 
            onClick={() => isBookmarked ? removeBookmark(currentPath) : addBookmark(currentPath)}
          >
            {isBookmarked ? '★' : '☆'} Bookmark
          </button>
        </div>
        
        {bookmarks.length > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Bookmarks:</strong>
            {bookmarks.map(bookmark => (
              <button 
                key={bookmark}
                onClick={() => setCurrentPath(bookmark)}
                style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}
              >
                {bookmark}
              </button>
            ))}
          </div>
        )}
      </header>
      
      <div style={{ flex: 1 }}>
        <MarkdownExplorer 
          fileTree={fileTree}
          initialRoute={currentPath}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}
\`\`\`

These advanced examples show how to build sophisticated documentation systems with dynamic loading, multi-language support, versioning, and state management integration.`,

  '/changelog.md': `# Changelog

All notable changes to the Markdown Explorer Viewer will be documented in this file.

## [1.0.0] - 2024-01-15

### 🎉 Initial Release

This is the first stable release of the Markdown Explorer Viewer!

### ✨ Features Added

- **File Tree Navigation** - Interactive folder and file browser
- **Markdown Rendering** - Full GitHub Flavored Markdown support
- **Search Functionality** - Real-time search through files and content
- **Theme Support** - Light, dark, and auto themes
- **Responsive Design** - Mobile-friendly with collapsible sidebar
- **Breadcrumb Navigation** - Easy navigation with clickable breadcrumbs
- **TypeScript Support** - Complete type definitions included
- **Accessibility** - Full keyboard navigation and screen reader support

### 📚 Components

- \`MarkdownExplorer\` - Main component with integrated file tree and viewer
- \`FileTree\` - Standalone file tree component
- \`MarkdownViewer\` - Pure markdown rendering component
- \`Breadcrumbs\` - Navigation breadcrumb component

### 🛠️ Utility Functions

- \`parseFileTree()\` - Convert flat file structure to hierarchical tree
- \`findNodeByPath()\` - Find specific nodes in the file tree
- \`searchNodes()\` - Search for nodes matching a query
- \`generateBreadcrumbs()\` - Create breadcrumb navigation items
- Theme utilities for light/dark mode handling

### 🎨 Styling

- CSS modules for component styling
- CSS custom properties for easy theming
- Responsive design with mobile-first approach
- Support for custom icons and styling

### 📦 Dependencies

- React 18+ support
- React Router integration ready
- Minimal external dependencies
- Tree-shakeable for optimal bundle size

---

## Future Releases

### Planned for v1.1.0

- **Enhanced Search** - Full-text search with highlighting
- **File Metadata** - Display file sizes, modification dates
- **Export Functionality** - Export selected files or entire trees
- **Performance Improvements** - Virtual scrolling for large file trees
- **Plugin System** - Custom markdown processors and renderers

### Planned for v1.2.0

- **Real-time Collaboration** - Multi-user editing and navigation
- **Version Control Integration** - Git integration for file history
- **Advanced Theming** - Theme builder and more built-in themes
- **Internationalization** - Multi-language support for UI

### Planned for v2.0.0

- **Visual Editor** - WYSIWYG markdown editing
- **Media Support** - Enhanced image, video, and file handling
- **API Integration** - Direct CMS and headless CMS integration
- **Advanced Analytics** - Usage tracking and insights

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to:

- Report bugs
- Suggest new features
- Submit pull requests
- Help with documentation

## Support

If you encounter any issues or have questions:

- 📝 [Create an issue](https://github.com/AliSafari-IT/asafarim-webapp/issues)
- 💬 [Join our discussions](https://github.com/AliSafari-IT/asafarim-webapp/discussions)
- 📧 [Contact support](mailto:support@asafarim.com)

Thank you for using Markdown Explorer Viewer! 🚀`
};

export const createSampleFileTree = () => {
  return parseFileTree(sampleFiles);
};
