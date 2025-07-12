# Advanced Examples

This page demonstrates advanced usage patterns and integration techniques.

## Dynamic Content Loading

Loading markdown content from an API:

```tsx
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
        const response = await fetch(`/api/documentation/content?path=\$encodeURIComponent(path)}`);
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
```

## Multi-language Documentation

Supporting multiple languages:

```tsx
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
        const response = await fetch(`/api/docs/\$lang.code}/files`);
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
            initialRoute={`/README.\$currentLanguage}.md`}
          />
        )}
      </div>
    </div>
  );
}
```

## Version-aware Documentation

Supporting multiple documentation versions:

```tsx
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
      const response = await fetch(`/api/docs/\$currentVersion}/structure`);
      const files = await response.json();
      setFileTree(parseFileTree(files));
    }
    
    if (currentVersion) {
      loadVersionFiles();
    }
  }, [currentVersion]);
  
  const handleNavigate = async (path: string, node: FileNode) => {
    if (node.type === 'file' && !node.content) {
      const response = await fetch(`/api/docs/\$currentVersion}/content?path=\$encodeURIComponent(path)}`);
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
```

## Custom Markdown Plugins

Adding custom markdown processing:

```tsx
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
        const type = content.match(/\[!(\w+)\]/)?.[1]?.toLowerCase();
        const text = content.replace(/\[!\w+\]\s*/, '');
        
        const calloutStyles = {
          note: { border: '#3b82f6', bg: '#dbeafe' },
          warning: { border: '#f59e0b', bg: '#fef3c7' },
          danger: { border: '#ef4444', bg: '#fee2e2' },
          tip: { border: '#10b981', bg: '#d1fae5' }
        };
        
        const style = calloutStyles[type] || calloutStyles.note;
        
        return (
          <div style={{
            border: `2px solid \$style.border}`,
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
```

## Integration with State Management

Using with Redux or Zustand:

```tsx
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
```

These advanced examples show how to build sophisticated documentation systems with dynamic loading, multi-language support, versioning, and state management integration.