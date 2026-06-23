import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/header.css'

function Header() {
  const { usuario, iniciarSesion, registrarse, cerrarSesion } = useAuth()
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [modo, setModo] = useState('login')
  const [form, setForm] = useState({ nombre: '', apellido: '', correo: '', contrasena: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleLogin() {
    setError('')
    const res = iniciarSesion(form.correo, form.contrasena)
    if (res.error) setError(res.error)
    else setPanelAbierto(false)
  }

  function handleRegistro() {
    setError('')
    const res = registrarse(form.nombre, form.apellido, form.correo, form.contrasena)
    if (res.error) setError(res.error)
    else setPanelAbierto(false)
  }

  return (
    <>
      <header className="header">
        <Link to="/" className="header-logo">
          <img src="/logo-m26.png" alt="Mundial 2026" />
          <div className="header-titulo">
            <span className="header-titulo-copa">Copa Mundial</span>
            <span className="header-titulo-anio">2026</span>
          </div>
        </Link>

        <div className="header-right">
          <nav className="header-nav">
            <Link to="/">Inicio</Link>
            <Link to="/grupos">Clasificatoria y Grupos</Link>
            <Link to="/playoffs">Eliminatoria</Link>
            <Link to="/equipos">Equipos</Link>
            <Link to="/noticias">Noticias</Link>
            {usuario?.rol === 'admin' && <Link to="/admin">Panel Admin</Link>}
          </nav>

          <button className="header-user-btn" onClick={() => setPanelAbierto(!panelAbierto)}>
            <svg className="perfil-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2" fill="rgba(255,255,255,0.08)" />
              <circle cx="20" cy="15" r="6" fill="currentColor" />
              <path d="M8 34c0-6.627 5.373-10 12-10s12 3.373 12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>
      </header>

      {panelAbierto && usuario && (
        <div className="auth-panel">
          <p className="auth-bienvenida">Hola, <strong>{usuario.nombre}</strong></p>
          <p className="auth-rol">{usuario.rol === 'admin' ? '🔧 Administrador' : '👤 Usuario'}</p>
          <button
            className="auth-submit auth-pred-btn"
            onClick={() => { navigate('/predicciones'); setPanelAbierto(false) }}
          >
             Mis predicciones
          </button>
          <button className="auth-submit auth-logout-btn" onClick={() => { cerrarSesion(); setPanelAbierto(false) }}>
            Cerrar sesión
          </button>
        </div>
      )}

      {panelAbierto && !usuario && (
        <div className="auth-modal-overlay" onClick={() => setPanelAbierto(false)}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <div className="auth-tabs">
              <button className={modo === 'login' ? 'active' : ''} onClick={() => { setModo('login'); setError('') }}>Iniciar sesión</button>
              <button className={modo === 'registro' ? 'active' : ''} onClick={() => { setModo('registro'); setError('') }}>Registrarse</button>
            </div>

            {error && <p className="auth-error">{error}</p>}

            {modo === 'login' ? (
              <div className="auth-form">
                <input type="email" name="correo" placeholder="Correo" onChange={handleChange} />
                <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} />
                <button className="auth-submit" onClick={handleLogin}>Ingresar</button>
              </div>
            ) : (
              <div className="auth-form">
                <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} />
                <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} />
                <input type="email" name="correo" placeholder="Correo" onChange={handleChange} />
                <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} />
                <button className="auth-submit" onClick={handleRegistro}>Registrarse</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Header