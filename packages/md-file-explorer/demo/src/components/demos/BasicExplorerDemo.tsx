import React, { useState, useEffect } from 'react'
import { BrowserMdFileExplorer, FileNode, ScanResult } from '../../browserMock'
import CodeExample from '../ui/CodeExample'
import FileTree from '../ui/FileTree'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorMessage from '../ui/ErrorMessage'
import styles from './BasicExplorerDemo.module.css'

const BasicExplorerDemo: React.FC = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState('../../test-docs')

  const paths = [
    { label: 'Test Documents', value: '../../test-docs' },
    { label: 'Project Root', value: '../../../' },
    { label: 'Current Package', value: '../' }
  ]

  const exploreDirectory = async (path: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Use the browser-compatible mock explorer instead of the actual MdFileExplorer
      const explorer = new BrowserMdFileExplorer(path)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const result = await explorer.scanDirectory()
      setScanResult(result)
      setFileTree(result.nodes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to explore directory')
      setFileTree([])
      setScanResult(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    exploreDirectory(selectedPath)
  }, [selectedPath])

  const codeExample = `import { MdFileExplorer } from '@asafarim/md-file-explorer'

// Initialize the explorer
const explorer = new MdFileExplorer('./docs', {
  includeExtensions: ['.md', '.txt', '.json'],
  maxDepth: 3,
  sortBy: 'name',
  parseMarkdownMetadata: true
})

// Scan directory
const result = await explorer.scanDirectory()
console.log(\`Found \${result.totalFiles} files and \${result.totalFolders} folders\`)`

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <h1>Basic File Explorer</h1>
        <p>
          Explore markdown files and folders with customizable options. 
          This demo shows the basic functionality of scanning directories and displaying file trees.
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.pathSelector}>
          <label htmlFor="path-select">Select Directory:</label>
          <select 
            id="path-select"
            value={selectedPath} 
            onChange={(e) => setSelectedPath(e.target.value)}
            className={styles.select}
          >
            {paths.map(path => (
              <option key={path.value} value={path.value}>
                {path.label}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={() => exploreDirectory(selectedPath)}
          disabled={loading}
          className={styles.refreshButton}
        >
          {loading ? '🔄' : '🔍'} {loading ? 'Scanning...' : 'Refresh'}
        </button>
      </div>

      {scanResult && (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{scanResult.totalFiles}</span>
            <span className={styles.statLabel}>Files</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{scanResult.totalFolders}</span>
            <span className={styles.statLabel}>Folders</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {scanResult.lastScanned.toLocaleTimeString()}
            </span>
            <span className={styles.statLabel}>Last Scanned</span>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>File Tree</h2>
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && fileTree.length > 0 && (
            <FileTree nodes={fileTree} />
          )}
          {!loading && !error && fileTree.length === 0 && (
            <p className={styles.emptyState}>No files found in the selected directory.</p>
          )}
        </div>

        <div className={styles.section}>
          <h2>Code Example</h2>
          <CodeExample code={codeExample} language="typescript" />
        </div>
      </div>
    </div>
  )
}

export default BasicExplorerDemo
