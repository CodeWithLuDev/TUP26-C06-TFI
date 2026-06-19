import { useEffect, useState } from 'react'
import '../styles/intro.css'

function Intro({ onFinish }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onFinish, 800)
    }, 3200)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div className={`intro-overlay ${!visible ? 'fade-out' : ''}`}>
      {/* Anillos de expansión con colores del logo */}
      <div className="intro-rings">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="intro-ring" />
        ))}
      </div>

      {/* Contenido central */}
      <div className="intro-content">
        <img
          src="/logo-m26.jpg"
          alt="Copa Mundial 2026"
          className="intro-logo"
        />
        <h1 className="intro-titulo">
          Copa Mundial<br />
          <span>2026</span>
        </h1>
        <p className="intro-subtitulo">Fixture Oficial Interactivo</p>
      </div>
    </div>
  )
}

export default Intro