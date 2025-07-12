import React, { useState, useEffect, useRef } from 'react'
import { MdFileExplorer } from '@asafarim/md-file-explorer'
import CodeExample from '../ui/CodeExample'
import LoadingSpinner from '../ui/LoadingSpinner'
import styles from './FileWatcherDemo.module.css'

interface FileEvent {
  event: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir'
  path: string
  timestamp: Date
}

const FileWatcherDemo: React.FC = () => {
  const [isWatching, setIsWatching] = useState(false)
  const [events, setEvents] = useState<FileEvent[]>([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    filesAdded: 0,
    filesChanged: 0,
    filesRemoved: 0,
    foldersAdded: 0,
    foldersRemoved: 0
  })
  
  const explorerRef = useRef<MdFileExplorer>()

  const startWatching = () => {
    if (!explorerRef.current) {
      explorerRef.current = new MdFileExplorer('../../test-docs', {
        includeExtensions: ['.md', '.txt', '.json'],
        parseMarkdownMetadata: true
      })
    }

    explorerRef.current.watchDirectory((event, path) => {
      const fileEvent: FileEvent = {
        event,
        path,
        timestamp: new Date()
      }
      
      setEvents(prev => [fileEvent, ...prev.slice(0, 49)]) // Keep last 50 events
      setStats(prev => ({
        ...prev,
        totalEvents: prev.totalEvents + 1,
        filesAdded: event === 'add' ? prev.filesAdded + 1 : prev.filesAdded,
        filesChanged: event === 'change' ? prev.filesChanged + 1 : prev.filesChanged,
        filesRemoved: event === 'unlink' ? prev.filesRemoved + 1 : prev.filesRemoved,
        foldersAdded: event === 'addDir' ? prev.foldersAdded + 1 : prev.foldersAdded,
        foldersRemoved: event === 'unlinkDir' ? prev.foldersRemoved + 1 : prev.foldersRemoved
      }))
    })
    
    setIsWatching(true)
  }

  const stopWatching = () => {
    if (explorerRef.current) {
      explorerRef.current.stopWatching()
    }
    setIsWatching(false)
  }

  const clearEvents = () => {
    setEvents([])
    setStats({
      totalEvents: 0,
      filesAdded: 0,
      filesChanged: 0,
      filesRemoved: 0,
      foldersAdded: 0,
      foldersRemoved: 0
    })
  }

  useEffect(() => {
    return () => {
      if (explorerRef.current) {
        explorerRef.current.stopWatching()
      }
    }
  }, [])

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'add': return '➕'
      case 'change': return '✏️'
      case 'unlink': return '🗑️'
      case 'addDir': return '📁➕'
      case 'unlinkDir': return '📁🗑️'
      default: return '📄'
    }
  }

  const getEventColor = (event: string) => {
    switch (event) {
      case 'add':
      case 'addDir': return '#28a745'
      case 'change': return '#ffc107'
      case 'unlink':
      case 'unlinkDir': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const codeExample = `import { MdFileExplorer } from '@asafarim/md-file-explorer'

const explorer = new MdFileExplorer('./docs', {
  includeExtensions: ['.md', '.txt'],
  parseMarkdownMetadata: true
})

// Start watching for file changes
explorer.watchDirectory((event, path) => {
  console.log(\`File \${event}: \${path}\`)
  
  switch (event) {
    case 'add':
      console.log('New file added')
      break
    case 'change':
      console.log('File modified')
      break
    case 'unlink':
      console.log('File deleted')
      break
    case 'addDir':
      console.log('New directory created')
      break
    case 'unlinkDir':
      console.log('Directory removed')
      break
  }
})

// Stop watching
explorer.stopWatching()`

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <h1>File Watcher Demo</h1>
        <p>
          Monitor file system changes in real-time. 
          Watch for file additions, modifications, deletions, and directory changes.
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.buttonGroup}>
          <button 
            onClick={startWatching}
            disabled={isWatching}
            className={`${styles.button} ${styles.startButton}`}
          >
            {isWatching ? '👀 Watching...' : '▶️ Start Watching'}
          </button>
          <button 
            onClick={stopWatching}
            disabled={!isWatching}
            className={`${styles.button} ${styles.stopButton}`}
          >
            ⏹️ Stop Watching
          </button>
          <button 
            onClick={clearEvents}
            className={`${styles.button} ${styles.clearButton}`}
          >
            🧹 Clear Events
          </button>
        </div>
        
        {isWatching && (
          <div className={styles.status}>
            <div className={styles.indicator}></div>
            <span>Actively monitoring file changes...</span>
          </div>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.totalEvents}</span>
          <span className={styles.statLabel}>Total Events</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: '#28a745' }}>
            {stats.filesAdded}
          </span>
          <span className={styles.statLabel}>Files Added</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: '#ffc107' }}>
            {stats.filesChanged}
          </span>
          <span className={styles.statLabel}>Files Changed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: '#dc3545' }}>
            {stats.filesRemoved}
          </span>
          <span className={styles.statLabel}>Files Removed</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Live Event Feed</h2>
          <div className={styles.eventFeed}>
            {!isWatching && events.length === 0 && (
              <div className={styles.placeholder}>
                <p>Click "Start Watching" to monitor file changes</p>
                <p className={styles.tip}>
                  💡 Try creating, editing, or deleting files in the test-docs folder to see events
                </p>
              </div>
            )}
            
            {isWatching && events.length === 0 && (
              <div className={styles.placeholder}>
                <LoadingSpinner size="small" message="Waiting for file changes..." />
              </div>
            )}
            
            {events.map((event, index) => (
              <div key={index} className={styles.event}>
                <div className={styles.eventHeader}>
                  <span 
                    className={styles.eventIcon}
                    style={{ color: getEventColor(event.event) }}
                  >
                    {getEventIcon(event.event)}
                  </span>
                  <span 
                    className={styles.eventType}
                    style={{ color: getEventColor(event.event) }}
                  >
                    {event.event.toUpperCase()}
                  </span>
                  <span className={styles.eventTime}>
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className={styles.eventPath}>{event.path}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Implementation</h2>
          <CodeExample code={codeExample} language="typescript" />
          
          <div className={styles.instructions}>
            <h3>Try It Out</h3>
            <ul>
              <li>Start the file watcher</li>
              <li>Create a new file in the test-docs folder</li>
              <li>Edit an existing markdown file</li>
              <li>Delete a file or folder</li>
              <li>Watch the events appear in real-time!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileWatcherDemo
