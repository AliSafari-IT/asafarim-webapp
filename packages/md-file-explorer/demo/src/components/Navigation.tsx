import React from 'react'
import { DemoType } from '../App'
import styles from './Navigation.module.css'

interface NavigationProps {
  activeDemo: DemoType
  onDemoChange: (demo: DemoType) => void
}

const demoItems = [
  {
    id: 'basic' as DemoType,
    title: 'Basic Explorer',
    description: 'Simple file tree exploration',
    icon: '📁'
  },
  {
    id: 'lazy' as DemoType,
    title: 'Lazy Loading',
    description: 'Efficient loading on demand',
    icon: '⚡'
  },
  {
    id: 'watcher' as DemoType,
    title: 'File Watcher',
    description: 'Real-time file monitoring',
    icon: '👀'
  },
  {
    id: 'advanced' as DemoType,
    title: 'Advanced Features',
    description: 'Filtering, sorting, metadata',
    icon: '🔧'
  },
  {
    id: 'performance' as DemoType,
    title: 'Performance',
    description: 'Benchmarks and optimization',
    icon: '📊'
  }
]

const Navigation: React.FC<NavigationProps> = ({ activeDemo, onDemoChange }) => {
  return (
    <nav className={styles.navigation}>
      <div className={styles.header}>
        <h2>Demos</h2>
        <p>Explore different capabilities</p>
      </div>
      <ul className={styles.list}>
        {demoItems.map((item) => (
          <li key={item.id}>
            <button
              className={`${styles.item} ${activeDemo === item.id ? styles.active : ''}`}
              onClick={() => onDemoChange(item.id)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.content}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
