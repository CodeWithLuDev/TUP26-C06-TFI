import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TorneoProvider } from './context/TorneoContext'
import App from './App.jsx'
import './styles/main.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TorneoProvider>
          <App />
        </TorneoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)