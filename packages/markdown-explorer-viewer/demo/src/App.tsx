import { useState, useEffect } from 'react';
import { MarkdownExplorer } from '../../src/components/MarkdownExplorer';
import { CustomFolderRenderer } from './CustomFolderRenderer';
import { handleDirectNavigation, findNodeByPath } from './utils/urlHandler';
import { fetchMarkdownContent } from './utils/contentFetcher';
import './App.css';
import './sidebar-scroll.css';
import './folder-content.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [initialRoute, setInitialRoute] = useState<string>('/');
  const [fileTree, setFileTree] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch file tree from the server
    const fetchFileTree = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add cache-busting parameter to avoid 304 issues
        const response = await fetch(`http://localhost:3011/api/folder-structure?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('File tree loaded:', data);
        
        setFileTree(data);
      } catch (err) {
        console.error('Failed to fetch file tree:', err);
        const errorMessage = (err instanceof Error) ? err.message : String(err);
        setError(`Failed to load file tree: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFileTree();
  }, []);

  // Handle direct navigation to markdown files
  useEffect(() => {
    // Get the current URL path and normalize it
    // Check if we have an original path from direct navigation
    const originalPath = (window as any).__ORIGINAL_PATH__ || window.location.pathname;
    const { normalizedPath, hasExtension } = handleDirectNavigation(originalPath);
    
    console.log(`Original path: ${originalPath}, normalized path: ${normalizedPath}, has extension: ${hasExtension}`);
    
    // Check if the path exists in our file tree
    const node = findNodeByPath(fileTree, normalizedPath);
    
    if (node) {
      // If the node exists, set it as the initial route
      console.log(`Node found for path: ${normalizedPath}`, node);
      setInitialRoute(normalizedPath);
      
      // Keep the original URL with extension if it had one
      if (hasExtension && originalPath !== normalizedPath) {
        // Don't replace the URL, keep the .md extension for direct linking
        // This allows users to share URLs with .md extension
      }
    } else if (normalizedPath.includes('/examples/')) {
      // Special handling for examples directory
      // Try to find the specific file in the examples directory
      const examplesNode = findNodeByPath(fileTree, '/examples');
      
      if (examplesNode && examplesNode.children) {
        // Get the file name from the path
        const pathParts = normalizedPath.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        // Try to find the file in the examples directory
        const fileNode = examplesNode.children.find(child => 
          child.name.toLowerCase() === fileName.toLowerCase() || 
          child.name.toLowerCase() === `${fileName.toLowerCase()}.md`
        );
        
        if (fileNode) {
          // If the file exists, navigate to it
          console.log(`Found file in examples: ${fileNode.path}`);
          setInitialRoute(fileNode.path);
          return;
        }
      }
      
      // If we couldn't find the specific file, just navigate to the examples directory
      const examplesBasePath = '/examples';
      console.log(`File not found in examples, navigating to directory: ${examplesBasePath}`);
      setInitialRoute(examplesBasePath);
      
      // Update URL to the examples directory
      window.history.replaceState({}, '', examplesBasePath);
    } else if (normalizedPath !== '/') {
      // If the node doesn't exist and it's not the root path
      // Try to find a close match by checking parent paths
      console.warn(`Path not found: ${normalizedPath}, trying to find a close match`);
      
      // Split the path into segments and try to find the closest existing node
      const segments = normalizedPath.split('/').filter(Boolean);
      let closestPath = '/';
      
      for (let i = segments.length - 1; i >= 0; i--) {
        const partialPath = '/' + segments.slice(0, i).join('/');
        const partialNode = findNodeByPath(fileTree, partialPath);
        
        if (partialNode) {
          closestPath = partialPath;
          console.log(`Found closest match: ${closestPath}`);
          break;
        }
      }
      
      // Set the closest path as the initial route
      setInitialRoute(closestPath);
      window.history.replaceState({}, '', closestPath);
    }
  }, [fileTree]);

  // Handle navigation events
  const handleNavigate = (path: string, node: any) => {
    if (!node) return;
    
    // Get the file extension for files
    let urlPath = path;
    
    // Only add .md extension for file nodes, not folders
    if (node.type === 'file' && node.name.endsWith('.md') && !path.endsWith('.md')) {
      // For files, append .md to create a permanent link
      urlPath = `${path}.md`;
    } else if (node.type === 'folder') {
      // For folders, ensure we don't have a .md extension
      if (urlPath.endsWith('.md')) {
        urlPath = urlPath.slice(0, -3);
      }
    }
    
    // Update the browser URL without causing a page reload
    window.history.pushState({}, '', urlPath);
    
    // Log navigation for debugging
    console.log(`Navigated to: ${urlPath}`, node);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>Markdown Explorer Viewer Demo</h1>
        <div className="app-controls">
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      
      <main className="app-main">
        {loading && (
          <div className="loading-state">
            <p>Loading file tree...</p>
          </div>
        )}
        
        {error && (
          <div className="error-state">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && fileTree && (
          <MarkdownExplorer
            fileTree={fileTree}
            theme={theme}
            enableSearch={true}
            showBreadcrumbs={true}
            className="demo-explorer"
            disableAutoSelect={true}
            initialRoute={initialRoute}
            onNavigate={(path, node) => handleNavigate(path, node)}
            contentFetcher={fetchMarkdownContent}
            renderFolderContent={({currentNode, onNodeClick}) => (
              <CustomFolderRenderer 
                currentNode={currentNode} 
                onNodeClick={onNodeClick} 
                theme={theme}
              />
            )}
          />
        )}
      </main>
      
      <footer className="app-footer">
        <p>
          Built with ❤️ using the{' '}
          <strong>@asafarim/markdown-explorer-viewer</strong> package
        </p>
      </footer>
    </div>
  );
}

export default App;
