import { useState } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import BasicExplorerDemo from './components/demos/BasicExplorerDemo'
import LazyLoadingDemo from './components/demos/LazyLoadingDemo'
import FileWatcherDemo from './components/demos/FileWatcherDemo'
import AdvancedFeaturesDemo from './components/demos/AdvancedFeaturesDemo'
import PerformanceDemo from './components/demos/PerformanceDemo'
import styles from './App.module.css'

export type DemoType = 'basic' | 'lazy' | 'watcher' | 'advanced' | 'performance'

function App() {
  const [activeDemo, setActiveDemo] = useState<DemoType>('basic')

  const renderDemo = () => {
    switch (activeDemo) {
      case 'basic':
        return <BasicExplorerDemo />
      case 'lazy':
        return <LazyLoadingDemo />
      case 'watcher':
        return <FileWatcherDemo />
      case 'advanced':
        return <AdvancedFeaturesDemo />
      case 'performance':
        return <PerformanceDemo />
      default:
        return <BasicExplorerDemo />
    }
  }

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.container}>
        <Navigation 
          activeDemo={activeDemo} 
          onDemoChange={setActiveDemo} 
        />
        <main className={styles.main}>
          {renderDemo()}
        </main>
      </div>
    </div>
  )
}

export default App
