import React, { useState } from 'react'
import { MdFileExplorer } from '@asafarim/md-file-explorer'
import CodeExample from '../ui/CodeExample'
import LoadingSpinner from '../ui/LoadingSpinner'
import styles from './PerformanceDemo.module.css'

interface BenchmarkResult {
  operation: string
  duration: number
  itemsProcessed: number
  throughput: number
}

const PerformanceDemo: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkResult[]>([])
  const [running, setRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState('')

  const runBenchmark = async (
    operation: string,
    testFn: () => Promise<any>,
    expectedItems: number = 0
  ): Promise<BenchmarkResult> => {
    const startTime = performance.now()
    await testFn()
    const endTime = performance.now()
    const duration = endTime - startTime
    const throughput = expectedItems > 0 ? (expectedItems / duration) * 1000 : 0

    return {
      operation,
      duration,
      itemsProcessed: expectedItems,
      throughput
    }
  }

  const runAllBenchmarks = async () => {
    setRunning(true)
    setBenchmarks([])
    const results: BenchmarkResult[] = []

    try {
      // Benchmark 1: Basic directory scan
      setCurrentTest('Basic Directory Scan')
      const basicResult = await runBenchmark(
        'Basic Directory Scan',
        async () => {
          const explorer = new MdFileExplorer('../../test-docs')
          return await explorer.scanDirectory()
        },
        10 // Estimated files
      )
      results.push(basicResult)
      setBenchmarks([...results])

      // Benchmark 2: Scan with metadata parsing
      setCurrentTest('Scan with Metadata Parsing')
      const metadataResult = await runBenchmark(
        'Scan with Metadata Parsing',
        async () => {
          const explorer = new MdFileExplorer('../../test-docs', {
            parseMarkdownMetadata: true,
            includeExtensions: ['.md']
          })
          return await explorer.scanDirectory()
        },
        5 // Estimated markdown files
      )
      results.push(metadataResult)
      setBenchmarks([...results])

      // Benchmark 3: Lazy loading (depth 1)
      setCurrentTest('Lazy Loading (Depth 1)')
      const lazyResult = await runBenchmark(
        'Lazy Loading (Depth 1)',
        async () => {
          const explorer = new MdFileExplorer('../../test-docs', { maxDepth: 1 })
          return await explorer.getFileTree()
        },
        3 // Estimated top-level items
      )
      results.push(lazyResult)
      setBenchmarks([...results])

      // Benchmark 4: Deep scan (max depth)
      setCurrentTest('Deep Scan (Max Depth)')
      const deepResult = await runBenchmark(
        'Deep Scan (Max Depth)',
        async () => {
          const explorer = new MdFileExplorer('../../test-docs', { maxDepth: 10 })
          return await explorer.scanDirectory()
        },
        15 // Estimated total files
      )
      results.push(deepResult)
      setBenchmarks([...results])

      // Benchmark 5: Filtered scan
      setCurrentTest('Filtered Scan')
      const filteredResult = await runBenchmark(
        'Filtered Scan',
        async () => {
          const explorer = new MdFileExplorer('../../test-docs', {
            includeExtensions: ['.md'],
            excludePatterns: ['temp', 'cache'],
            sortBy: 'name'
          })
          return await explorer.scanDirectory()
        },
        5 // Estimated filtered files
      )
      results.push(filteredResult)
      setBenchmarks([...results])

      // Benchmark 6: Multiple file content reads
      setCurrentTest('File Content Reading')
      const contentResult = await runBenchmark(
        'File Content Reading (5 files)',
        async () => {
          const explorer = new MdFileExplorer('../../test-docs')
          const scanResult = await explorer.scanDirectory()
          const files = scanResult.nodes
            .filter(node => node.type === 'file')
            .slice(0, 5)
          
          const promises = files.map(file => 
            explorer.getFileContent(file.path).catch(() => null)
          )
          return await Promise.all(promises)
        },
        5
      )
      results.push(contentResult)
      setBenchmarks([...results])

    } catch (error) {
      console.error('Benchmark failed:', error)
    } finally {
      setRunning(false)
      setCurrentTest('')
    }
  }

  const getBestPerformer = () => {
    if (benchmarks.length === 0) return null
    return benchmarks.reduce((best, current) => 
      current.throughput > best.throughput ? current : best
    )
  }

  const getWorstPerformer = () => {
    if (benchmarks.length === 0) return null
    return benchmarks.reduce((worst, current) => 
      current.throughput < worst.throughput ? current : worst
    )
  }

  const optimizationExample = `import { MdFileExplorer } from '@asafarim/md-file-explorer'

// ❌ Inefficient: Deep scan with metadata parsing
const slowExplorer = new MdFileExplorer('./large-docs', {
  maxDepth: 10,
  parseMarkdownMetadata: true,
  includeExtensions: ['.md', '.txt', '.json', '.js', '.ts']
})

// ✅ Optimized: Lazy loading with specific filters
const fastExplorer = new MdFileExplorer('./large-docs', {
  maxDepth: 2, // Limit initial depth
  includeExtensions: ['.md'], // Only needed extensions
  excludePatterns: ['node_modules', '.git', 'dist'],
  parseMarkdownMetadata: false // Disable if not needed
})

// Use lazy loading for large directories
const initialTree = await fastExplorer.getFileTree(undefined, 1)

// Load subfolders on demand
const expandFolder = async (path: string) => {
  return await fastExplorer.getFileTree(path, 1)
}

// Performance tips:
// 1. Use specific file extensions
// 2. Exclude unnecessary directories
// 3. Limit initial scan depth
// 4. Parse metadata only when needed
// 5. Use lazy loading for large trees`

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <h1>Performance Benchmarks</h1>
        <p>
          Measure and compare performance across different operations and configurations
          to optimize your file exploration workflow.
        </p>
      </div>

      <div className={styles.controls}>
        <button 
          onClick={runAllBenchmarks}
          disabled={running}
          className={styles.benchmarkButton}
        >
          {running ? '⏱️ Running Benchmarks...' : '🚀 Run Performance Tests'}
        </button>
        
        {running && (
          <div className={styles.progress}>
            <LoadingSpinner size="small" />
            <span>Running: {currentTest}</span>
          </div>
        )}
      </div>

      {benchmarks.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{benchmarks.length}</span>
            <span className={styles.statLabel}>Tests Completed</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue} style={{ color: '#28a745' }}>
              {getBestPerformer()?.throughput.toFixed(1) || '0'}/s
            </span>
            <span className={styles.statLabel}>Best Throughput</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue} style={{ color: '#dc3545' }}>
              {getWorstPerformer()?.duration.toFixed(1) || '0'}ms
            </span>
            <span className={styles.statLabel}>Slowest Operation</span>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Benchmark Results</h2>
          {benchmarks.length === 0 && !running && (
            <div className={styles.placeholder}>
              Click "Run Performance Tests" to start benchmarking
            </div>
          )}
          
          {benchmarks.length > 0 && (
            <div className={styles.resultsTable}>
              <div className={styles.tableHeader}>
                <div>Operation</div>
                <div>Duration</div>
                <div>Items</div>
                <div>Throughput</div>
              </div>
              {benchmarks.map((result, index) => (
                <div key={index} className={styles.tableRow}>
                  <div className={styles.operation}>{result.operation}</div>
                  <div className={styles.duration}>
                    {result.duration.toFixed(1)}ms
                  </div>
                  <div className={styles.items}>{result.itemsProcessed}</div>
                  <div className={styles.throughput}>
                    {result.throughput > 0 ? `${result.throughput.toFixed(1)}/s` : '-'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>Performance Tips</h2>
          <div className={styles.tips}>
            <div className={styles.tip}>
              <div className={styles.tipIcon}>⚡</div>
              <div>
                <h4>Use Specific Extensions</h4>
                <p>Filter by specific file extensions to reduce processing time</p>
              </div>
            </div>
            <div className={styles.tip}>
              <div className={styles.tipIcon}>🚫</div>
              <div>
                <h4>Exclude Large Directories</h4>
                <p>Skip node_modules, .git, and other large directories</p>
              </div>
            </div>
            <div className={styles.tip}>
              <div className={styles.tipIcon}>📊</div>
              <div>
                <h4>Limit Initial Depth</h4>
                <p>Use lazy loading for better initial performance</p>
              </div>
            </div>
            <div className={styles.tip}>
              <div className={styles.tipIcon}>📝</div>
              <div>
                <h4>Conditional Metadata</h4>
                <p>Only parse metadata when actually needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.codeSection}>
        <h2>Optimization Examples</h2>
        <CodeExample code={optimizationExample} language="typescript" />
      </div>
    </div>
  )
}

export default PerformanceDemo
