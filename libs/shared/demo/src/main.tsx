import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@asafarim/react-themes'
import '@asafarim/react-themes/styles.css'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultMode="auto" persistMode={true}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
