import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MarkdownContent, ThemeProvider } from '@asafarim/simple-md-viewer';
import { useTheme } from '../context';
import '@asafarim/simple-md-viewer/dist/style.css';
import './MdDocsPage.css';

const MdDocsPage: React.FC = () => {
  const { effectiveTheme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check server health on component mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:3300/api/health');
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        console.log('📄 Markdown server status:', data);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Failed to connect to markdown server:', error);
        setError('Failed to connect to markdown server. Please ensure the server is running on port 3300.');
        setIsLoading(false);
      }
    };

    checkServer();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="md-docs-loading">
        <div className="loading-spinner"></div>
        <h2>Loading Documentation...</h2>
        <p>Connecting to markdown server...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="md-docs-error">
        <div className="error-icon">⚠️</div>
        <h2>Server Connection Error</h2>
        <p>{error}</p>
        <div className="error-instructions">
          <h3>To start the markdown server:</h3>
          <ol>
            <li>Open a terminal in the base-ui directory</li>
            <li>Run: <code>node server.js</code></li>
            <li>Server should start on http://localhost:3300</li>
            <li>Refresh this page once the server is running</li>
          </ol>
        </div>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="md-docs-page">
      <ThemeProvider theme={effectiveTheme} toggleTheme={toggleTheme}>
        <div className={`md-docs-container ${effectiveTheme}`}>
          <Routes>
            <Route 
              path="/*" 
              element={
                <MarkdownContent 
                  apiBaseUrl="http://localhost:3300" 
                  showHomePage={true}
                  hideFileTree={true}
                  hideHeader={true}
                  hideFooter={true}
                />
              } 
            />
          </Routes>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default MdDocsPage;
