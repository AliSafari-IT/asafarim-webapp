import React from 'react'
import styles from './Header.module.css'

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h1>@asafarim/md-file-explorer</h1>
          <span className={styles.version}>v1.0.0</span>
        </div>
        <div className={styles.description}>
          Professional markdown file exploration with TypeScript, lazy loading, and real-time file watching
        </div>
        <div className={styles.links}>
          <a 
            href="https://github.com/asafarim/md-file-explorer" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            GitHub
          </a>
          <a 
            href="https://npmjs.com/package/@asafarim/md-file-explorer" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            NPM
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
