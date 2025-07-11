import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { MarkdownExplorer, type FileNode } from '@asafarim/markdown-explorer-viewer';
import { createMdDocsFileTree, getFileContent } from '../utils/dynamicMdDocsUtils';
import { useTheme } from '../context';
import DocLink from '../components/documentation/DocLink';

const DocumentationOverview: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Documentation</h1>
      
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          Welcome to the Base UI documentation. Here you'll find comprehensive guides, 
          changelogs, and package documentation for all components and utilities.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ 
          padding: '2rem', 
          background: 'var(--surface)', 
          borderRadius: 'var(--border-radius-lg)', 
          border: '1px solid var(--border)',
          transition: 'var(--transition)'
        }}>
          <h3>📋 Changelogs</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Track all changes, updates, and improvements to the project.
          </p>
          <DocLink 
            to="/changelogs" 
            className="" 
            style={{ 
              color: 'var(--primary)', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            View Changelogs →
          </DocLink>
        </div>
        
        <div style={{ 
          padding: '2rem', 
          background: 'var(--surface)', 
          borderRadius: 'var(--border-radius-lg)', 
          border: '1px solid var(--border)',
          transition: 'var(--transition)'
        }}>
          <h3>📦 Package Documentation</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Detailed documentation for all reusable packages and components.
          </p>
          <DocLink 
            to="/CurrentProjects/packages" 
            className="" 
            style={{ 
              color: 'var(--primary)', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Browse Packages →
          </DocLink>
        </div>
        
        <div style={{ 
          padding: '2rem', 
          background: 'var(--surface)', 
          borderRadius: 'var(--border-radius-lg)', 
          border: '1px solid var(--border)',
          transition: 'var(--transition)'
        }}>
          <h3>🔍 Explorer View</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Browse all documentation with an interactive file tree explorer.
          </p>
          <DocLink 
            to="/explorer" 
            className="" 
            style={{ 
              color: 'var(--primary)', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Open Explorer →
          </DocLink>
        </div>
      </div>

      <section style={{ 
        padding: '2rem', 
        background: 'var(--surface)', 
        borderRadius: 'var(--border-radius-lg)', 
        border: '1px solid var(--border)' 
      }}>
        <h2>Quick Links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <DocLink to="/changelogs/CHANGELOG.md" style={{ 
            color: 'var(--primary)', 
            textDecoration: 'none',
            padding: '0.5rem',
            background: 'var(--background)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border)',
            display: 'block',
            transition: 'var(--transition)'
          }}>
            📋 Main Changelog
          </DocLink>
          <DocLink to="/CurrentProjects" style={{ 
            color: 'var(--primary)', 
            textDecoration: 'none',
            padding: '0.5rem',
            background: 'var(--background)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border)',
            display: 'block',
            transition: 'var(--transition)'
          }}>
            🎴 Project Card Docs
          </DocLink>
          <DocLink to="/CurrentProjects/packages/asafarim/paginated-project-grid.md" style={{ 
            color: 'var(--primary)', 
            textDecoration: 'none',
            padding: '0.5rem',
            background: 'var(--background)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border)',
            display: 'block',
            transition: 'var(--transition)'
          }}>
            📊 Paginated Project Grid Component
          </DocLink>
          <DocLink to="/TechDocs/Cloud/cloud-computing.md" style={{ 
            color: 'var(--primary)', 
            textDecoration: 'none',
            padding: '0.5rem',
            background: 'var(--background)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border)',
            display: 'block',
            transition: 'var(--transition)'
          }}>
            💻 Cloud Computing
          </DocLink>
        </div>
      </section>
    </div>
  );
};

const DocumentationExplorer: React.FC = () => {
  const { effectiveTheme } = useTheme();
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFileTree = async () => {
      try {
        const tree = await createMdDocsFileTree();
        setFileTree(tree);
      } catch (error) {
        console.error('Failed to load file tree:', error);
        // Create fallback empty tree
        setFileTree({
          name: 'Documentation',
          path: '/docs',
          type: 'folder',
          children: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadFileTree();
  }, []);

  // Convert URL path to file tree path
  const getCurrentPath = () => {
    const urlPath = location.pathname;
    if (urlPath === '/docs' || urlPath === '/docs/' || urlPath === '/docs/explorer') {
      return '/docs';
    }
    // Convert URL path to file tree path format
    return urlPath.startsWith('/docs') ? urlPath : `/docs${urlPath}`;
  };

  const handleNavigate = (path: string, node: FileNode) => {
    console.log('Navigated to:', path, node);
    // Ensure URL always starts with /docs
    const urlPath = path.startsWith('/docs') ? path : `/docs/${path.replace(/^\//, '')}`;
    if (urlPath !== location.pathname) {
      navigate(urlPath, { replace: true });
    }
  };

  if (loading) {
    return (
      <div style={{ 
        height: 'calc(100vh - 200px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--text-secondary)'
      }}>
        Loading documentation...
      </div>
    );
  }

  if (!fileTree) {
    return (
      <div style={{ 
        height: 'calc(100vh - 200px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--text-secondary)'
      }}>
        Failed to load documentation
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'var(--background)',
      zIndex: 1000
    }}>
      <MarkdownExplorer
        fileTree={fileTree}
        theme={effectiveTheme}
        enableSearch={true}
        showFileTree={true}
        showBreadcrumbs={true}
        showIcons={true}
        searchPlaceholder="Search documentation..."
        sidebarWidth="280px"
        contentFetcher={getFileContent}
        initialRoute={getCurrentPath()}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

const DocumentationPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<DocumentationOverview />} />
      <Route path="explorer" element={<DocumentationExplorer />} />
      <Route path="*" element={<DocumentationExplorer />} />
    </Routes>
  );
};

export default DocumentationPage;
