import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initSentry } from './utils/sentry.js'
import { initializeGA } from './utils/analytics.js'
import './index.css'

// Initialize Sentry for error tracking and performance monitoring
initSentry()

// Initialize Google Analytics
if (typeof window !== 'undefined') {
  initializeGA()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
