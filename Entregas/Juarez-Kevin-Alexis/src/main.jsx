import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TorneoProvider } from './context/TorneoContext'
import { NoticiasProvider } from './context/NoticiasContext'
import App from './App.jsx'
import './styles/main.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TorneoProvider>
          <NoticiasProvider>
            <App />
          </NoticiasProvider>
        </TorneoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
