# Markdown Explorer Viewer Demo

This demo showcases the capabilities of the `@asafarim/markdown-explorer-viewer` React component package. It demonstrates how to integrate the component with a backend server to create a full-featured markdown documentation explorer.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm
- The `md-file-folder-server` running on port 3011

### Step-by-Step Setup

#### 1. Start the Markdown Server

First, you need to start the backend server that provides markdown files:

```bash
# Navigate to the server directory
cd ../../libs/md-server

# Install dependencies (if not already done)
pnpm install

# Start the server
node load-md-files.js
```

The server should start and display:
```
📁 Loading markdown files from: D:\repos\asafarim-webapp\packages\markdown-explorer-viewer\demo\src\md-docs
📁 Serving markdown files from: [your-path]\md-docs
🌐 Server is running on http://localhost:3011
📋 Available endpoints:
   - GET /api/health
   - GET /api/folder-structure  
   - GET /api/md-files
   - GET /api/md-content/:path
```

#### 2. Install Demo Dependencies

```bash
# From the demo directory
cd packages/markdown-explorer-viewer/demo

# Install dependencies
pnpm install
```

#### 3. Start the Demo Application

```bash
# Start the development server
pnpm run dev
```

The demo app will start at `http://localhost:5173` (Vite default) or the next available port.

## 🎯 What You'll See

### Features Demonstrated

1. **File Tree Navigation**
   - Hierarchical folder structure
   - Expandable/collapsible folders
   - File selection with visual feedback

2. **Markdown Rendering**
   - GitHub Flavored Markdown support
   - Syntax highlighting for code blocks
   - Tables, lists, and formatting

3. **Search Functionality**
   - Real-time search through file names
   - Highlight matching results
   - Navigate between search results

4. **Theme Support**
   - Light/Dark mode toggle
   - Auto theme detection
   - Consistent styling

5. **Responsive Design**
   - Works on desktop and mobile
   - Collapsible sidebar
   - Adaptive layout

### Sample Content

The demo includes sample markdown files in `src/md-docs/`:

```
md-docs/
├── changelog.md                    # Project changelog
├── project-init.md                # Project initialization guide
├── docs/
│   ├── api/
│   │   ├── overview.md            # API documentation
│   │   └── endpoints.md           # Endpoint details
│   ├── getting-started.md         # Getting started guide
│   └── troubleshooting.md         # Common issues
├── examples/
│   ├── basic-usage.md             # Basic component usage
│   ├── advanced-features.md       # Advanced examples
│   └── custom-styling.md          # Styling guide
└── guides/
    ├── installation.md            # Installation instructions
    └── configuration.md           # Configuration options
```

## 🔧 How It Works

### Architecture Overview

```
┌─────────────────┐    HTTP Requests    ┌─────────────────┐
│                 │ ──────────────────> │                 │
│   React Demo    │                     │  Express Server │
│   (Port 5173)   │ <────────────────── │  (Port 3011)    │
│                 │    JSON Responses   │                 │
└─────────────────┘                     └─────────────────┘
        │                                        │
        │                                        │
        v                                        v
┌─────────────────┐                     ┌─────────────────┐
│ MarkdownExplorer│                     │  File System    │
│   Component     │                     │   md-docs/      │
└─────────────────┘                     └─────────────────┘
```

### Key Components

#### 1. App.tsx - Main Application
```tsx
// Demonstrates the MarkdownExplorer component usage
import { MarkdownExplorer } from '@asafarim/markdown-explorer-viewer';

function App() {
  return (
    <MarkdownExplorer
      fileTree={fileTree}              // File structure from API
      contentFetcher={fetchContent}    // Custom content fetcher
      theme="auto"                     // Theme configuration
      enableSearch={true}              // Enable search functionality
      defaultPath="/docs/getting-started.md"  // Default file to show
    />
  );
}
```

#### 2. contentFetcher.ts - API Integration
```tsx
// Custom function to fetch markdown content from server
export const fetchMarkdownContent = async (filePath: string): Promise<string> => {
  const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  const response = await fetch(`http://localhost:3011/api/md-content/${cleanPath}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch content: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.content;
};
```

#### 3. File Tree Loading
```tsx
// Loading file structure from the server
useEffect(() => {
  const loadFileTree = async () => {
    try {
      const response = await fetch('http://localhost:3011/api/folder-structure');
      const data = await response.json();
      setFileTree(data);
    } catch (error) {
      console.error('Failed to load file tree:', error);
    }
  };
  
  loadFileTree();
}, []);
```

## 🎨 Customization Examples

### Custom Styling

The demo shows how to customize the appearance:

```css
/* Custom CSS variables for theming */
.markdown-explorer {
  --primary-color: #007acc;
  --background-color: #ffffff;
  --text-color: #333333;
  --border-color: #e1e4e8;
  --hover-background: #f6f8fa;
}

/* Dark theme overrides */
.markdown-explorer[data-theme="dark"] {
  --background-color: #0d1117;
  --text-color: #c9d1d9;
  --border-color: #30363d;
  --hover-background: #161b22;
}
```

### Custom Content Fetcher

Example of implementing a content fetcher with caching:

```tsx
const fetchWithCache = async (filePath: string): Promise<string> => {
  // Check cache first
  const cached = contentCache.get(filePath);
  if (cached) return cached;
  
  // Fetch from server
  const content = await fetchMarkdownContent(filePath);
  
  // Cache the result
  contentCache.set(filePath, content);
  
  return content;
};
```

### Error Handling

The demo includes comprehensive error handling:

```tsx
const [error, setError] = useState<string | null>(null);

const handleContentFetch = async (filePath: string) => {
  try {
    setError(null);
    const content = await fetchMarkdownContent(filePath);
    return content;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    setError(`Failed to load ${filePath}: ${errorMessage}`);
    throw err;
  }
};
```

## 📦 Package Usage

This demo shows how to use the `@asafarim/markdown-explorer-viewer` package in your own projects:

### Installation
```bash
npm install @asafarim/markdown-explorer-viewer
# or
pnpm add @asafarim/markdown-explorer-viewer
# or
yarn add @asafarim/markdown-explorer-viewer
```

### Basic Usage
```tsx
import React from 'react';
import { MarkdownExplorer } from '@asafarim/markdown-explorer-viewer';

function MyApp() {
  const fileTree = {
    name: 'docs',
    type: 'folder',
    children: [
      { name: 'readme.md', type: 'file', path: '/readme.md' }
    ]
  };

  const contentFetcher = async (path: string) => {
    // Your implementation to fetch markdown content
    const response = await fetch(`/api/markdown${path}`);
    return response.text();
  };

  return (
    <MarkdownExplorer
      fileTree={fileTree}
      contentFetcher={contentFetcher}
      theme="light"
      enableSearch={true}
    />
  );
}
```

## 🔧 Development

### Building the Package

```bash
# Build the package
pnpm run build

# Watch for changes during development
pnpm run dev
```

### Running Tests

```bash
# Run tests (if available)
pnpm test
```

### Package Scripts

- `pnpm run build` - Build the component library
- `pnpm run dev` - Start development server for the demo
- `pnpm run preview` - Preview the built demo
- `pnpm run lint` - Run ESLint
- `pnpm run type-check` - Run TypeScript type checking

## 🛠️ Troubleshooting

### Server Connection Issues

**Problem:** Demo can't connect to the server
**Solution:**
1. Ensure the server is running on port 3011
2. Check the console for CORS errors
3. Verify the server is serving the correct directory

### File Not Found Errors

**Problem:** Markdown files return 404 errors
**Solution:**
1. Check that files exist in `src/md-docs/`
2. Verify file paths match the API requests
3. Ensure file extensions are `.md` or `.mdx`

### Styling Issues

**Problem:** Component doesn't look right
**Solution:**
1. Import the component's CSS file
2. Check for CSS conflicts with your app's styles
3. Use CSS custom properties for theming

### Build Errors

**Problem:** Demo fails to build
**Solution:**
1. Ensure all dependencies are installed
2. Check for TypeScript errors
3. Verify the package is built (`pnpm run build`)

## 🌟 Features to Explore

### 1. File Navigation
- Click folders to expand/collapse
- Click files to view content
- Use breadcrumbs for navigation

### 2. Search Functionality
- Type in the search box to filter files
- Navigate through search results
- Clear search to return to full tree

### 3. Theme Switching
- Toggle between light and dark themes
- Observe auto theme detection
- See custom styling in action

### 4. Markdown Rendering
- View various markdown features
- See syntax highlighting in code blocks
- Explore tables, lists, and formatting

### 5. Responsive Design
- Resize the window to see responsive behavior
- Test on mobile devices
- Use the sidebar toggle on small screens

## 📚 Documentation

- **Component API:** See the main package README
- **Server API:** Check `../../libs/md-server/README.md`
- **Styling Guide:** Explore the demo's CSS files
- **Examples:** Browse the sample markdown files

## 🤝 Contributing

To contribute to this demo or the main package:

1. Fork the repository
2. Make your changes
3. Test with this demo
4. Submit a pull request

## 📄 License

MIT License - see the main project LICENSE file for details.

---

**Need Help?** 
- Check the troubleshooting section above
- Look at the server README for API details
- Open an issue on the GitHub repository
