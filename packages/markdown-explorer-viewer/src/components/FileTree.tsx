import React, { useState, useMemo } from 'react';
import { FileTreeProps, FileNode } from '../types';
import { searchNodes, getFileIcon, getFileExtension } from '../utils';
import styles from './FileTree.module.css';

export const FileTree: React.FC<FileTreeProps> = ({
  fileTree,
  currentPath,
  theme = 'light',
  onNodeClick,
  enableSearch = true,
  searchPlaceholder = 'Search files...',
  showIcons = true,
  renderFileIcon,
  renderFolderIcon,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) {
      return fileTree.children || [];
    }
    return searchNodes(fileTree, searchQuery);
  }, [fileTree, searchQuery]);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderIcon = (node: FileNode) => {
    if (!showIcons) return null;

    if (node.type === 'folder' && renderFolderIcon) {
      return renderFolderIcon(node);
    }
    
    if (node.type === 'file' && renderFileIcon) {
      return renderFileIcon(node);
    }

    return (
      <span className={`${styles.nodeIcon} ${node.type === 'folder' ? styles.folderIcon : styles.fileIcon}`}>
        {getFileIcon(node)}
      </span>
    );
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isActive = currentPath === node.path;
    const hasChildren = node.children && node.children.length > 0;
    const fileExtension = getFileExtension(node.name);

    return (
      <div key={node.path} className={styles.treeNode}>
        <button
          className={`${styles.nodeButton} ${isActive ? styles.active : ''} ${node.type === 'folder' ? styles.folder : ''}`}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            }
            onNodeClick(node);
          }}
          style={{ paddingLeft: `${level * 1 + 0.5}rem` }}
          data-file-type={fileExtension}
        >
          {node.type === 'folder' && hasChildren && (
            <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
              ▶
            </span>
          )}
          {node.type === 'folder' && !hasChildren && (
            <span className={styles.expandIcon}></span>
          )}
          {renderIcon(node)}
          <span className={styles.fileName}>{node.name}</span>
        </button>
        
        {node.type === 'folder' && hasChildren && isExpanded && (
          <div className={styles.children}>
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!fileTree.children || fileTree.children.length === 0) {
    return (
      <div className={`${styles.fileTree} ${className}`}>
        <div className={styles.emptyState}>No files found</div>
      </div>
    );
  }

  return (
    <div className={`${styles.fileTree} ${className}`}>
      {enableSearch && (
        <div className={styles.searchContainer} style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'inherit' }}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search files"
          />
        </div>
      )}
      
      {filteredNodes.length === 0 && searchQuery ? (
        <div className={styles.noResults}>No files match your search</div>
      ) : (
        <div>
          {filteredNodes.map(node => renderNode(node))}
        </div>
      )}
    </div>
  );
};
