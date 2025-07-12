import React, { useState, useEffect, useMemo } from 'react';
import { MarkdownExplorerProps, FileNode, NavigationState } from '../types';
import { FileTree } from './FileTree';
import { MarkdownViewer } from './MarkdownViewer';
import { Breadcrumbs } from './Breadcrumbs';
import { 
  findNodeByPath, 
  isMarkdownFile, 
  normalizePath,
  applyTheme,
  getEffectiveTheme
} from '../utils';
import styles from './MarkdownExplorer.module.css';

/** Helper: Find best file to show in a folder (README.md > .md > first child) */
function findFirstFileOrFolder(node: FileNode): FileNode | null {
  if (!node.children || node.children.length === 0) return null;
  // Prefer README.md
  const readme = node.children.find(
    child => child.type === 'file' && child.name.toLowerCase() === 'readme.md'
  );
  if (readme) return readme;
  // Then any markdown file
  const firstMd = node.children.find(
    child => child.type === 'file' && isMarkdownFile(child.name)
  );
  if (firstMd) return firstMd;
  // Or fallback to first child (file or folder)
  return node.children[0] || null;
}

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
  contentFetcher,
  renderFolderContent
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

  // Apply theme to container
  useEffect(() => {
    const newTheme = getEffectiveTheme(theme);
    setEffectiveTheme(newTheme);
    const container = document.querySelector(`.${styles.markdownExplorer}`) as HTMLElement;
    if (container) {
      applyTheme(container, theme);
    }
  }, [theme]);

  // File tree structure
  const resolvedFileTree = useMemo(() => {
    if (fileTree) return fileTree;
    return {
      name: 'root',
      path: rootPath,
      type: 'folder' as const,
      children: []
    };
  }, [fileTree, rootPath]);

  // Auto-select logic: always show a file if possible
  useEffect(() => {
    let node = findNodeByPath(resolvedFileTree, navigationState.currentPath);

    // If folder: find best child to open
    if (
      node &&
      node.type === 'folder' &&
      node.children &&
      node.children.length > 0
    ) {
      const firstChild = findFirstFileOrFolder(node);
      if (
        // Only auto-navigate if we're not already at a file,
        // and haven't already opened it in the history (prevents infinite loop)
        firstChild && navigationState.currentPath !== firstChild.path
      ) {
        setNavigationState(prev => ({
          ...prev,
          currentPath: firstChild.path,
          currentNode: firstChild,
          history: [...prev.history, firstChild.path],
          historyIndex: prev.historyIndex + 1,
        }));
        return; // Stop here; effect will re-run with new path
      }
    }

    setNavigationState(prev => ({
      ...prev,
      currentNode: node
    }));

    // File content logic (unchanged)
    if (node && node.type === 'file' && contentFetcher && !node.content) {
      setContentLoading(true);
      setContentError(null);
      contentFetcher(node.path)
        .then(content => {
          setFileContent(content);
          setContentLoading(false);
        })
        .catch(error => {
          setContentError('Failed to load file content');
          setFileContent('');
          setContentLoading(false);
        });
    } else if (node && node.type === 'file' && node.content) {
      setFileContent(node.content);
      setContentLoading(false);
      setContentError(null);
    } else {
      setFileContent('');
      setContentLoading(false);
      setContentError(null);
    }
    // eslint-disable-next-line
  }, [resolvedFileTree, navigationState.currentPath, contentFetcher]);

  const handleNodeClick = (node: FileNode) => {
    const newPath = normalizePath(node.path);
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
    if (onNavigate) onNavigate(newPath, node);
  };

  const handleBreadcrumbClick = (path: string) => {
    const node = findNodeByPath(resolvedFileTree, path);
    if (node) handleNodeClick(node);
  };

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

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
      if (renderFolderContent && children.length > 0) {
        return (
          <div className={styles.folderView}>
            {renderFolderContent({
              currentNode,
              onNodeClick: handleNodeClick
            })}
          </div>
        );
      }
      // Default folder view
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
        <aside 
          className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          {!sidebarCollapsed && (
            <div 
              className={styles.sidebarContent} 
              style={{ 
                flex: '1 1 auto', 
                overflowY: 'auto', 
                overflowX: 'hidden',
                height: 'calc(100% - 60px)',
                minHeight: '0'
              }}
            >
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
            </div>
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
