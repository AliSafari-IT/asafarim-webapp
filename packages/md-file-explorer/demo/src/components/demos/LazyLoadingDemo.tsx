import React, { useState, useEffect } from 'react'
import { MdFileExplorer, FileNode } from '@asafarim/md-file-explorer'
import CodeExample from '../ui/CodeExample'
import FileTree from '../ui/FileTree'
import LoadingSpinner from '../ui/LoadingSpinner'
import styles from './LazyLoadingDemo.module.css'

const LazyLoadingDemo: React.FC = () => {
  const [rootNodes, setRootNodes] = useState<FileNode[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingStats, setLoadingStats] = useState<{
    loadedFolders: number
    totalRequests: number
    startTime?: number
  }>({
    loadedFolders: 0,
    totalRequests: 0
  })

  const explorer = new MdFileExplorer('../../test-docs', {
    includeExtensions: ['.md', '.txt', '.json'],
    maxDepth: 1, // Only load first level initially
    sortBy: 'name'
  })

  const loadInitialTree = async () => {
    setLoading(true)
    setLoadingStats(prev => ({ 
      ...prev, 
      startTime: Date.now(),
      totalRequests: prev.totalRequests + 1 
    }))
    
    try {
      const tree = await explorer.getFileTree(undefined, 1)
      setRootNodes(tree)
      setLoadingStats(prev => ({ 
        ...prev, 
        loadedFolders: prev.loadedFolders + tree.filter(n => n.type === 'folder').length 
      }))
    } catch (error) {
      console.error('Failed to load initial tree:', error)
    } finally {
      setLoading(false)
    }
  }

  const expandFolder = async (folderPath: string) => {
    setLoadingStats(prev => ({ 
      ...prev, 
      totalRequests: prev.totalRequests + 1 
    }))
    
    try {
      const subTree = await explorer.getFileTree(folderPath, 1)
      
      // Update the tree by finding and expanding the specific folder
      setRootNodes(prevNodes => {
        const updateNodes = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.path === folderPath && node.type === 'folder') {
              setLoadingStats(prev => ({ 
                ...prev, 
                loadedFolders: prev.loadedFolders + 1 
              }))
              return { ...node, children: subTree }
            } else if (node.children) {
              return { ...node, children: updateNodes(node.children) }
            }
            return node
          })
        }
        return updateNodes(prevNodes)
      })
    } catch (error) {
      console.error('Failed to expand folder:', error)
    }
  }

  useEffect(() => {
    loadInitialTree()
  }, [])

  const codeExample = `import { MdFileExplorer } from '@asafarim/md-file-explorer'

// Initialize with depth limit for lazy loading
const explorer = new MdFileExplorer('./docs', {
  maxDepth: 1, // Only load first level
  includeExtensions: ['.md', '.txt']
})

// Load initial tree (only first level)
const initialTree = await explorer.getFileTree(undefined, 1)

// Expand specific folder on demand
const expandFolder = async (folderPath: string) => {
  const subTree = await explorer.getFileTree(folderPath, 1)
  // Update your state to include the new subtree
}`

  const getLoadTime = () => {
    if (loadingStats.startTime) {
      return ((Date.now() - loadingStats.startTime) / 1000).toFixed(2)
    }
    return '0.00'
  }

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <h1>Lazy Loading Demo</h1>
        <p>
          Efficiently load large directory structures on demand. 
          Only load what you need, when you need it, for optimal performance.
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{loadingStats.loadedFolders}</span>
          <span className={styles.statLabel}>Folders Loaded</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{loadingStats.totalRequests}</span>
          <span className={styles.statLabel}>API Requests</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{getLoadTime()}s</span>
          <span className={styles.statLabel}>Load Time</span>
        </div>
      </div>

      <div className={styles.controls}>
        <button 
          onClick={loadInitialTree}
          disabled={loading}
          className={styles.resetButton}
        >
          {loading ? '🔄' : '🔄'} Reset Demo
        </button>
        <p className={styles.instruction}>
          💡 Click on folders in the tree below to load their contents lazily
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Interactive Lazy Tree</h2>
          {loading && <LoadingSpinner message="Loading directory structure..." />}
          {!loading && (
            <div className={styles.treeContainer}>
              <LazyFileTree 
                nodes={rootNodes} 
                onExpandFolder={expandFolder}
              />
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>Implementation</h2>
          <CodeExample code={codeExample} language="typescript" />
        </div>
      </div>
    </div>
  )
}

// Custom tree component with lazy loading
interface LazyFileTreeProps {
  nodes: FileNode[]
  onExpandFolder: (path: string) => void
}

const LazyFileTree: React.FC<LazyFileTreeProps> = ({ nodes, onExpandFolder }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (node: FileNode) => {
    if (node.type !== 'folder') return
    
    const newExpanded = new Set(expandedFolders)
    
    if (expandedFolders.has(node.path)) {
      newExpanded.delete(node.path)
    } else {
      newExpanded.add(node.path)
      if (!node.children) {
        onExpandFolder(node.path)
      }
    }
    
    setExpandedFolders(newExpanded)
  }

  const renderNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path)
    const hasChildren = node.children && node.children.length > 0
    const isFolder = node.type === 'folder'

    return (
      <div key={node.path} className={styles.treeItem}>
        <div 
          className={`${styles.treeItemHeader} ${isFolder ? styles.folder : styles.file}`}
          style={{ paddingLeft: `${level * 20}px` }}
          onClick={() => isFolder && toggleFolder(node)}
        >
          <span className={styles.icon}>
            {isFolder ? (isExpanded ? '📂' : '📁') : '📄'}
          </span>
          <span className={styles.name}>{node.name}</span>
          {isFolder && (
            <span className={styles.toggle}>
              {!node.children ? '⏳' : isExpanded ? '▼' : '▶'}
            </span>
          )}
        </div>
        
        {isFolder && isExpanded && hasChildren && (
          <div className={styles.children}>
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.lazyTree}>
      {nodes.map(node => renderNode(node))}
    </div>
  )
}

export default LazyLoadingDemo
