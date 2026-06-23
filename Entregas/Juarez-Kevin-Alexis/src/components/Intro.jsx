import { useEffect, useState } from 'react'
import '../styles/intro.css'

function Intro({ onFinish }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onFinish, 1000)
    }, 4000)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div className={`intro-overlay ${!visible ? 'fade-out' : ''}`}>

      {/* Fondo con la misma imagen que la app */}
      <div className="intro-bg" />

      {/* Partículas flotantes */}
      <div className="intro-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="intro-particle" />
        ))}
      </div>

      {/* Línea de barrido */}
      <div className="intro-scanline" />

      {/* Anillos sutiles */}
      <div className="intro-rings">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="intro-ring" />
        ))}
      </div>

      {/* Contenido */}
      <div className="intro-content">
        <img src="/logo-m26.png" alt="Copa Mundial 2026" className="intro-logo" />
        <h1 className="intro-titulo">
          Copa Mundial<br />
          <span>2026</span>
        </h1>
        <div className="intro-divider" />
        <p className="intro-subtitulo">Fixture Oficial Interactivo</p>
        <div className="intro-loader">
          <div className="intro-loader-bar" />
        </div>
      </div>

    </div>
  )
}

export default Intro
