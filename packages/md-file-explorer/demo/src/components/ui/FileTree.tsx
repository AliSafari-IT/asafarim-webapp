import React, { useState } from 'react'
import styles from './FileTree.module.css'
import { FileNode } from '@asafarim/md-file-explorer'

interface FileTreeProps {
  nodes: FileNode[]
  onFileSelect?: (node: FileNode) => void
}

interface FileTreeItemProps {
  node: FileNode
  level: number
  onFileSelect?: (node: FileNode) => void
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ node, level, onFileSelect }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const hasChildren = node.children && node.children.length > 0

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleFileClick = () => {
    if (node.type === 'file' && onFileSelect) {
      onFileSelect(node)
    }
  }

  const getIcon = () => {
    if (node.type === 'folder') {
      return isExpanded ? '📂' : '📁'
    }
    
    const ext = node.name.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'md':
        return '📝'
      case 'json':
        return '📋'
      case 'txt':
        return '📄'
      default:
        return '📄'
    }
  }

  const getFileSize = () => {
    if (node.type === 'file' && node.size) {
      const kb = Math.round(node.size / 1024)
      return kb > 0 ? `${kb}KB` : '<1KB'
    }
    return null
  }

  const getLastModified = () => {
    if (node.lastModified) {
      return node.lastModified.toLocaleDateString()
    }
    return null
  }

  return (
    <div className={styles.item}>
      <div 
        className={`${styles.header} ${node.type === 'file' ? styles.file : styles.folder}`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={node.type === 'folder' ? handleToggle : handleFileClick}
      >
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.name}>{node.name}</span>
        {node.type === 'file' && (
          <div className={styles.metadata}>
            {getFileSize() && <span className={styles.size}>{getFileSize()}</span>}
            {getLastModified() && <span className={styles.date}>{getLastModified()}</span>}
          </div>
        )}
        {hasChildren && (
          <span className={styles.toggle}>
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <div className={styles.children}>
          {node.children!.map((child, index) => (
            <FileTreeItem 
              key={`${child.path}-${index}`}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
      
      {node.metadata && node.type === 'file' && (
        <div className={styles.metadataDetails} style={{ paddingLeft: `${(level + 1) * 20}px` }}>
          {node.metadata.title && (
            <div className={styles.metadataItem}>
              <strong>Title:</strong> {node.metadata.title}
            </div>
          )}
          {node.metadata.description && (
            <div className={styles.metadataItem}>
              <strong>Description:</strong> {node.metadata.description}
            </div>
          )}
          {node.metadata.tags && node.metadata.tags.length > 0 && (
            <div className={styles.metadataItem}>
              <strong>Tags:</strong> {node.metadata.tags.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const FileTree: React.FC<FileTreeProps> = ({ nodes, onFileSelect }) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className={styles.empty}>
        No files or folders found
      </div>
    )
  }

  return (
    <div className={styles.tree}>
      {nodes.map((node, index) => (
        <FileTreeItem 
          key={`${node.path}-${index}`}
          node={node}
          level={0}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  )
}

export default FileTree
