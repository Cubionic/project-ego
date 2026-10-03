import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/dm-sans/opsz.css'
import '@fontsource/libre-baskerville/latin-400.css'
import '@fontsource/libre-baskerville/latin-400-italic.css'
import '@fontsource/libre-baskerville/latin-700.css'
import './index.css'
import App from './App'
import { startCloudSync } from './lib/cloud'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

startCloudSync()
