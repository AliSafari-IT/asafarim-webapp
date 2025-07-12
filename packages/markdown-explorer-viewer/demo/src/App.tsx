import { useState, useEffect } from 'react';
import { createSampleFileTree } from './sampleData';
import { MarkdownExplorer } from '../../src/components/MarkdownExplorer';
import { FileNode } from '../../src/types';
import './App.css';
import './sidebar-scroll.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fileTree, setFileTree] = useState<FileNode | null>(null);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const loadFileTree = async () => {
      const fileTree = await createSampleFileTree();
      setFileTree(fileTree);
    };
    loadFileTree();
  }, []);

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
        {fileTree ? (
          <MarkdownExplorer
            fileTree={fileTree}
            theme={theme}
            enableSearch={true}
            showBreadcrumbs={true}
            className="demo-explorer"
          />
        ) : (
          <p>Loading file tree...</p>
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
