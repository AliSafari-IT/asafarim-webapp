import React, { useState } from 'react'
import styles from './CodeExample.module.css'

interface CodeExampleProps {
  code: string
  language: string
  title?: string
}

const CodeExample: React.FC<CodeExampleProps> = ({ code, language, title }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.header}>
        <span className={styles.language}>{language}</span>
        <button 
          onClick={copyToClipboard}
          className={styles.copyButton}
          title="Copy to clipboard"
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
      <pre className={styles.code}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default CodeExample
