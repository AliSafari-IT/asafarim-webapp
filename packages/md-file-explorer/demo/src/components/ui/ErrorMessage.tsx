import React from 'react'
import styles from './ErrorMessage.module.css'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <div className={styles.content}>
        <h3 className={styles.title}>Something went wrong</h3>
        <p className={styles.message}>{message}</p>
        {onRetry && (
          <button onClick={onRetry} className={styles.retryButton}>
            🔄 Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
