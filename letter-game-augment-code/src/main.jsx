import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// 在开发模式下加载开发工具
if (process.env.NODE_ENV === 'development') {
  import('./utils/devTools.js').then(({ devTools }) => {
    console.log('🔧 开发工具已加载')
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
