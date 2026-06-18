import { Link } from 'react-router-dom'
import { useState } from 'react'
import '../styles/header.css'

function Header() {
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [modo, setModo] = useState('login') // 'login' o 'registro'

return (
    <>
      <header className="header">
        {/* Logo izquierda */}
        <Link to="/" className="header-logo">
          <img src="/logo-m26.jpg" alt="Mundial 2026" />
        </Link>

        {/* Nav + icono derecha */}
        <div className="header-right">
          <nav className="header-nav">
            <Link to="/">Inicio</Link>
            <Link to="/grupos">Clasificatoria y Grupos</Link>
            <Link to="/equipos">Equipos</Link>
            <Link to="/noticias">Noticias</Link>
          </nav>

          <button className="header-user-btn" onClick={() => setPanelAbierto(!panelAbierto)}>
            👤
          </button>
        </div>
      </header>

      {/* Panel login/registro */}
      {panelAbierto && (
        <div className="auth-panel">
          <div className="auth-tabs">
            <button className={modo === 'login' ? 'active' : ''} onClick={() => setModo('login')}>Iniciar sesión</button>
            <button className={modo === 'registro' ? 'active' : ''} onClick={() => setModo('registro')}>Registrarse</button>
          </div>

          {modo === 'login' ? (
            <div className="auth-form">
              <input type="email" placeholder="Correo" />
              <input type="password" placeholder="Contraseña" />
              <button className="auth-submit">Ingresar</button>
            </div>
          ) : (
            <div className="auth-form">
              <input type="text" placeholder="Nombre" />
              <input type="text" placeholder="Apellido" />
              <input type="email" placeholder="Correo" />
              <input type="password" placeholder="Contraseña" />
              <button className="auth-submit">Registrarse</button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Header