import React, { useState, useEffect } from 'react'
import { BrowserMdFileExplorer, FileNode, MdFileExplorerOptions } from '../../browserMock'
import CodeExample from '../ui/CodeExample'
import styles from './AdvancedFeaturesDemo.module.css'
import LoadingSpinner from '../ui/LoadingSpinner'
import FileTree from '../ui/FileTree'

const AdvancedFeaturesDemo: React.FC = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [filteredTree, setFilteredTree] = useState<FileNode[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [filters, setFilters] = useState({
    includeExtensions: ['.md', '.txt', '.json'],
    excludePatterns: ['node_modules', '.git', 'dist'],
    sortBy: 'name' as 'name' | 'date' | 'size',
    sortOrder: 'asc' as 'asc' | 'desc',
    searchTerm: '',
    showMetadata: true,
    maxDepth: 3
  })

  const loadAdvancedTree = async () => {
    setLoading(true)
    
    try {
      const options: Partial<MdFileExplorerOptions> = {
        includeExtensions: filters.includeExtensions,
        excludePatterns: filters.excludePatterns,
        sortBy: filters.sortBy,
        sortDirection: filters.sortOrder,
        parseMarkdownMetadata: filters.showMetadata,
        maxDepth: filters.maxDepth
      }
      
      const explorer = new BrowserMdFileExplorer('/docs', options)
      const result = await explorer.scanDirectory()
      setFileTree(result.nodes)
      filterTree(result.nodes, filters.searchTerm)
    } catch (error) {
      console.error('Failed to load tree:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterTree = (nodes: FileNode[], searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredTree(nodes)
      return
    }

    const filterNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter(node => {
        const matchesName = node.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesMetadata = node.metadata && (
          (node.metadata.title && node.metadata.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (node.metadata.description && node.metadata.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (node.metadata.tags && node.metadata.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        )
        
        if (node.type === 'folder' && node.children) {
          const filteredChildren = filterNodes(node.children)
          if (filteredChildren.length > 0) {
            return { ...node, children: filteredChildren }
          }
        }
        
        return matchesName || matchesMetadata
      }).map(node => {
        if (node.type === 'folder' && node.children) {
          return { ...node, children: filterNodes(node.children) }
        }
        return node
      })
    }

    setFilteredTree(filterNodes(nodes))
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    if (newFilters.searchTerm !== filters.searchTerm) {
      filterTree(fileTree, newFilters.searchTerm)
    }
  }

  const handleTagClick = (tag: string) => {
    // Filter files by tag
    setFilters(prev => ({
      ...prev,
      searchTerm: `tag:${tag}`
    }))
  }

  useEffect(() => {
    loadAdvancedTree()
  }, [filters.includeExtensions, filters.excludePatterns, filters.sortBy, filters.sortOrder, filters.maxDepth, filters.showMetadata])

  useEffect(() => {
    filterTree(fileTree, filters.searchTerm)
  }, [filters.searchTerm, fileTree])

  const codeExample = `import { MdFileExplorer } from '@asafarim/md-file-explorer'

// Advanced configuration
const options = {
  includeExtensions: ['.md', '.txt', '.json'],
  excludePatterns: ['node_modules', '.git', 'dist'],
  sortBy: 'name', // 'name', 'date', or 'size'
  sortDirection: 'asc', // 'asc' or 'desc'
  maxDepth: 3,
  parseMarkdownMetadata: true
}

const explorer = new MdFileExplorer('./docs', options)

// Get filtered and sorted results
const result = await explorer.scanDirectory()

// Search within metadata
const hasTag = (node) => 
  node.metadata?.tags?.includes('documentation')

const hasTitleMatch = (node) =>
  node.metadata?.title?.includes('API')`

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <h1>Advanced Features</h1>
        <p>
          Explore powerful filtering, sorting, metadata parsing, and search capabilities
          that make file exploration flexible and efficient.
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.filterSection}>
          <h3>File Extensions</h3>
          <div className={styles.checkboxGroup}>
            {['.md', '.txt', '.json', '.js', '.ts'].map(ext => (
              <label key={ext} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.includeExtensions.includes(ext)}
                  onChange={(e) => {
                    const newExtensions = e.target.checked
                      ? [...filters.includeExtensions, ext]
                      : filters.includeExtensions.filter(e => e !== ext)
                    handleFilterChange({ ...filters, includeExtensions: newExtensions })
                  }}
                />
                {ext}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3>Sorting</h3>
          <div className={styles.sortControls}>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ 
                ...filters, 
                sortBy: e.target.value as 'name' | 'date' | 'size' 
              })}
              className={styles.select}
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="size">Size</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange({ 
                ...filters, 
                sortOrder: e.target.value as 'asc' | 'desc' 
              })}
              className={styles.select}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3>Search</h3>
          <input
            type="text"
            placeholder="Search files and metadata..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange({ ...filters, searchTerm: e.target.value })}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterSection}>
          <h3>Options</h3>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={filters.showMetadata}
              onChange={(e) => handleFilterChange({ ...filters, showMetadata: e.target.checked })}
            />
            Parse Metadata
          </label>
          <div className={styles.depthControl}>
            <label>Max Depth: {filters.maxDepth}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={filters.maxDepth}
              onChange={(e) => handleFilterChange({ ...filters, maxDepth: parseInt(e.target.value) })}
              className={styles.slider}
            />
          </div>
        </div>

        <button 
          onClick={loadAdvancedTree}
          disabled={loading}
          className={styles.refreshButton}
        >
          {loading ? '🔄' : '🔍'} {loading ? 'Loading...' : 'Apply Filters'}
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Filtered Results</h2>
          {loading && <LoadingSpinner message="Applying filters..." />}
          {!loading && filteredTree.length > 0 && (
            <FileTree 
              nodes={filteredTree} 
              onFileSelect={setSelectedFile}
            />
          )}
          {!loading && filteredTree.length === 0 && fileTree.length > 0 && (
            <div className={styles.noResults}>
              No files match the current filters
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>File Details</h2>
          {selectedFile ? (
            <div className={styles.fileDetails}>
              <h3>{selectedFile.name}</h3>
              <div className={styles.fileInfo}>
                <div className={styles.infoItem}>
                  <strong>Path:</strong> {selectedFile.path}
                </div>
                <div className={styles.infoItem}>
                  <strong>Type:</strong> {selectedFile.type}
                </div>
                {selectedFile.size && (
                  <div className={styles.infoItem}>
                    <strong>Size:</strong> {Math.round(selectedFile.size / 1024)}KB
                  </div>
                )}
                {selectedFile.lastModified && (
                  <div className={styles.infoItem}>
                    <strong>Modified:</strong> {selectedFile.lastModified.toLocaleDateString()}
                  </div>
                )}
              </div>
              
              {selectedFile.metadata && (
                <div className={styles.metadata}>
                  <h4>Metadata</h4>
                  {selectedFile.metadata.title && (
                    <div className={styles.metadataItem}>
                      <strong>Title:</strong> {selectedFile.metadata.title}
                    </div>
                  )}
                  {selectedFile.metadata.description && (
                    <div className={styles.metadataItem}>
                      <strong>Description:</strong> {selectedFile.metadata.description}
                    </div>
                  )}
                  {selectedFile.metadata.author && (
                    <div className={styles.metadataItem}>
                      <strong>Author:</strong> {selectedFile.metadata.author}
                    </div>
                  )}
                  {selectedFile.metadata.tags && selectedFile.metadata.tags.length > 0 && (
                    <div className={styles.metadataItem}>
                      <strong>Tags:</strong>
                      <div className={styles.tags}>
                        {selectedFile.metadata.tags.map((tag: string, index: number) => (
                          <span 
                            key={index} 
                            className={styles.tag}
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.selectPrompt}>
              Click on a file to view its details and metadata
            </div>
          )}
        </div>
      </div>

      <div className={styles.codeSection}>
        <h2>Implementation Example</h2>
        <CodeExample code={codeExample} language="typescript" />
      </div>
    </div>
  )
}

export default AdvancedFeaturesDemo
