import React from 'react';
import { FileNode } from '../../src/types';

interface CustomFolderRendererProps {
  currentNode: FileNode;
  onNodeClick: (node: FileNode) => void;
  theme: 'light' | 'dark';
}

export const CustomFolderRenderer: React.FC<CustomFolderRendererProps> = ({ 
  currentNode, 
  onNodeClick,
  theme
}) => {
  if (!currentNode || !currentNode.children) {
    return <div className="empty-folder">No folder content available</div>;
  }
  
  return (
    <div className="folder-content-container">
      <h2 className="folder-title">
        <span className="folder-icon">📁</span> {currentNode.name}
      </h2>
      
      {currentNode.children.length > 0 ? (
        <div className="folder-grid">
          {currentNode.children.map((child) => (
            <button
              key={child.path}
              onClick={() => onNodeClick(child)}
              className={`folder-item ${theme}`}
              title={child.name}
            >
              <span className="item-icon">
                {child.type === 'folder' ? '📁' : '📄'}
              </span>
              <span className="item-name">{child.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="empty-folder-message">This folder is empty.</p>
      )}
    </div>
  );
};
