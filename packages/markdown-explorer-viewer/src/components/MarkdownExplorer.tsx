import React, { useState, useEffect, useMemo } from 'react';
import { MarkdownExplorerProps, FileNode, NavigationState } from '../types';
import { FileTree } from './FileTree';
import { MarkdownViewer } from './MarkdownViewer';
import { Breadcrumbs } from './Breadcrumbs';
import { 
  parseFileTree, 
  findNodeByPath, 
  isMarkdownFile, 
  normalizePath,
  getParentPath,
  applyTheme,
  getEffectiveTheme
} from '../utils';
import styles from './MarkdownExplorer.module.css';

export const MarkdownExplorer: React.FC<MarkdownExplorerProps> = ({
  rootPath = '/',
  fileTree,
  theme = 'auto',
  className = '',
  initialRoute,
  onNavigate,
  enableSearch = true,
  searchPlaceholder = 'Search files...',
  showIcons = true,
  showFileTree = true,
  renderFileIcon,
  renderFolderIcon,
  sidebarWidth = '280px',
  showBreadcrumbs = true,
  markdownComponents,
  contentFetcher
}) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentPath: initialRoute || rootPath,
    currentNode: null,
    history: [initialRoute || rootPath],
    historyIndex: 0
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  const [fileContent, setFileContent] = useState<string>('');
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  // Apply theme
  useEffect(() => {
    const newTheme = getEffectiveTheme(theme);
    setEffectiveTheme(newTheme);
    
    // Apply theme to container
    const container = document.querySelector(`.${styles.markdownExplorer}`) as HTMLElement;
    if (container) {
      applyTheme(container, theme);
    }
  }, [theme]);

  // Create file tree from virtual data if provided
  const resolvedFileTree = useMemo(() => {
    if (fileTree) {
      return fileTree;
    }
    
    // If no fileTree provided, create a minimal structure
    return {
      name: 'root',
      path: rootPath,
      type: 'folder' as const,
      children: []
    };
  }, [fileTree, rootPath]);

  // Find current node and fetch content if needed
  useEffect(() => {
    const node = findNodeByPath(resolvedFileTree, navigationState.currentPath);
    setNavigationState(prev => ({
      ...prev,
      currentNode: node
    }));

    // Fetch content for files if contentFetcher is provided and content is not already available
    if (node && node.type === 'file' && contentFetcher && !node.content) {
      setContentLoading(true);
      setContentError(null);
      
      contentFetcher(node.path)
        .then(content => {
          setFileContent(content);
          setContentLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch file content:', error);
          setContentError('Failed to load file content');
          setFileContent('');
          setContentLoading(false);
        });
    } else if (node && node.type === 'file' && node.content) {
      // Use pre-loaded content
      setFileContent(node.content);
      setContentLoading(false);
      setContentError(null);
    } else {
      // Not a file or no content needed
      setFileContent('');
      setContentLoading(false);
      setContentError(null);
    }
  }, [resolvedFileTree, navigationState.currentPath, contentFetcher]);

  const handleNodeClick = (node: FileNode) => {
    const newPath = normalizePath(node.path);
    
    // Update navigation state
    setNavigationState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newPath);
      
      return {
        currentPath: newPath,
        currentNode: node,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });

    // Call navigation callback
    if (onNavigate) {
      onNavigate(newPath, node);
    }
  };

  const handleBreadcrumbClick = (path: string) => {
    const node = findNodeByPath(resolvedFileTree, path);
    if (node) {
      handleNodeClick(node);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    const { currentNode } = navigationState;
    
    if (!currentNode) {
      return (
        <div className={styles.emptyState}>
          <h3>Path not found</h3>
          <p>The requested path could not be found in the file tree.</p>
        </div>
      );
    }

    if (currentNode.type === 'file') {
      if (isMarkdownFile(currentNode.name)) {
        if (contentLoading) {
          return (
            <div className={styles.emptyState}>
              <h3>Loading...</h3>
              <p>Please wait while the file content is loaded.</p>
            </div>
          );
        }

        if (contentError) {
          return (
            <div className={styles.emptyState}>
              <h3>Error</h3>
              <p>{contentError}</p>
            </div>
          );
        }

        return (
          <MarkdownViewer
            content={fileContent || currentNode.content || ''}
            theme={effectiveTheme}
            components={markdownComponents}
            filePath={currentNode.path}
            metadata={currentNode.metadata}
          />
        );
      } else {
        return (
          <div className={styles.fileViewer}>
            <h3>File: {currentNode.name}</h3>
            <p>This file type is not supported for preview.</p>
            {(fileContent || currentNode.content) && (
              <pre className={styles.rawContent}>
                {fileContent || currentNode.content}
              </pre>
            )}
          </div>
        );
      }
    } else {
      // Folder view - show children
      const children = currentNode.children || [];
      
      return (
        <div className={styles.folderView}>
          <h2>📁 {currentNode.name}</h2>
          {children.length === 0 ? (
            <p>This folder is empty.</p>
          ) : (
            <div className={styles.fileGrid}>
              {children.map(child => (
                <button
                  key={child.path}
                  className={`${styles.fileCard} ${child.type === 'folder' ? styles.folderCard : styles.fileCard}`}
                  onClick={() => handleNodeClick(child)}
                >
                  <span className={styles.fileCardIcon}>
                    {child.type === 'folder' ? '📁' : '📄'}
                  </span>
                  <span className={styles.fileCardName}>{child.name}</span>
                  {child.type === 'file' && (
                    <span className={styles.fileCardType}>
                      {child.name.split('.').pop()?.toUpperCase()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div 
      className={`${styles.markdownExplorer} ${!showFileTree || sidebarCollapsed ? styles.hideFileTree : ''} ${className}`}
      style={{ '--me-sidebar-width': sidebarWidth } as React.CSSProperties}
    >
      {showFileTree && (
        <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
          <div className={styles.sidebarHeader}>
            <h3 className={styles.sidebarTitle}>
              📂 Files
              <button
                className={styles.toggleButton}
                onClick={toggleSidebar}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? '▶' : '◀'}
              </button>
            </h3>
          </div>
          
          {!sidebarCollapsed && (
            <FileTree
              fileTree={resolvedFileTree}
              currentPath={navigationState.currentPath}
              theme={effectiveTheme}
              onNodeClick={handleNodeClick}
              enableSearch={enableSearch}
              searchPlaceholder={searchPlaceholder}
              showIcons={showIcons}
              renderFileIcon={renderFileIcon}
              renderFolderIcon={renderFolderIcon}
            />
          )}
        </aside>
      )}
      
      <main className={styles.mainContent}>
        {showBreadcrumbs && (
          <header className={styles.contentHeader}>
            <Breadcrumbs
              path={navigationState.currentPath}
              rootPath={rootPath}
              theme={effectiveTheme}
              onPathClick={handleBreadcrumbClick}
            />
            
            {!showFileTree && (
              <button
                className={styles.toggleButton}
                onClick={() => setSidebarCollapsed(false)}
                aria-label="Show file tree"
              >
                📂 Files
              </button>
            )}
          </header>
        )}
        
        <div className={`${styles.contentArea} ${styles.fadeIn}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
