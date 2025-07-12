import { useState } from 'react';
import { createSampleFileTree } from './sampleData';
import { MarkdownExplorer } from '../../src/components/MarkdownExplorer';
import './App.css';
import './sidebar-scroll.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const fileTree = createSampleFileTree();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>Markdown Explorer Viewer Demo</h1>
        <button 
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>
      
      <main className="app-main">
        <MarkdownExplorer
          fileTree={fileTree}
          theme={theme}
          enableSearch={true}
          showBreadcrumbs={true}
          className="demo-explorer"
        />
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
