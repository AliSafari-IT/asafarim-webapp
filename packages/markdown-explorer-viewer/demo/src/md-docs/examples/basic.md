# Basic Examples

This page contains basic implementation examples for the Markdown Explorer Viewer.

## Minimal Setup

The simplest way to get started:

```tsx
import { MarkdownExplorer, parseFileTree } from '@asafarim/markdown-explorer-viewer';

const files = {
  '/README.md': '# Hello World\n\nWelcome to my documentation!'
};

function App() {
  return (
    <MarkdownExplorer 
      fileTree={parseFileTree(files)} 
    />
  );
}
```

## Multiple Files and Folders

Creating a more complex file structure:

```tsx
const documentationFiles = {
  '/README.md': '# Project Documentation\n\nOverview of the project.',
  '/getting-started.md': '# Getting Started\n\nQuick start guide.',
  '/guides/installation.md': '# Installation\n\nHow to install the project.',
  '/guides/configuration.md': '# Configuration\n\nConfiguring your setup.',
  '/api/overview.md': '# API Overview\n\nIntroduction to our API.',
  '/api/endpoints.md': '# API Endpoints\n\nComplete endpoint reference.',
  '/examples/basic.md': '# Basic Examples\n\nSimple usage examples.',
  '/examples/advanced.md': '# Advanced Examples\n\nComplex use cases.'
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
```

## With Theme Toggle

Adding a theme switcher:

```tsx
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
```

## Custom File Icons

Customizing how files appear in the tree:

```tsx
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
```

## Navigation Handling

Integrating with routing and analytics:

```tsx
import { useNavigate } from 'react-router-dom';

function RoutedDocumentation() {
  const navigate = useNavigate();
  
  const handleNavigate = (path: string, node: FileNode) => {
    // Update browser URL
    navigate(`/docs\$path}`);
    
    // Track page views
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: node.name,
        page_location: window.location.href
      });
    }
    
    // Update document title
    document.title = `\$node.name} - Documentation`;
  };
  
  return (
    <MarkdownExplorer 
      fileTree={fileTree}
      onNavigate={handleNavigate}
    />
  );
}
```

## Responsive Layout

Creating a mobile-friendly layout:

```tsx
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
```

## Search Integration

Adding custom search functionality:

```tsx
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
```

These examples should give you a solid foundation for implementing the Markdown Explorer Viewer in your own projects!