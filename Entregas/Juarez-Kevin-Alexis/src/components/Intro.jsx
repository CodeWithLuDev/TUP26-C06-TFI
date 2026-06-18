import { useEffect, useState } from 'react'
import '../styles/intro.css'

function Intro({ onFinish }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onFinish, 800)
    }, 3000)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div className={`intro-overlay ${!visible ? 'fade-out' : ''}`}>
      <img
        src="/logo-mundial.png"
        alt="Copa Mundial 2026"
        className="intro-logo"
      />
      <h1 className="intro-titulo">Copa Mundial 2026</h1>
      <p className="intro-subtitulo">Fixture Oficial Interactivo</p>
    </div>
  )
}

export default Intro