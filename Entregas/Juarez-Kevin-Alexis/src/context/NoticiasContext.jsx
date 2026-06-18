import { createContext, useContext, useState, useEffect } from 'react'

const NoticiasContext = createContext()
const CLAVE = 'mundial2026_noticias'

function cargar() {
  try {
    const g = localStorage.getItem(CLAVE)
    if (g) return JSON.parse(g)
  } catch {}
  return []
}

export function NoticiasProvider({ children }) {
  const [noticias, setNoticias] = useState(cargar)

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(noticias))
  }, [noticias])

  function agregarNoticia(noticia) {
    const nueva = {
      ...noticia,
      id: Date.now(),
      creadoEn: new Date().toISOString(),
    }
    setNoticias(prev => [nueva, ...prev])
    return nueva
  }

  function editarNoticia(id, datos) {
    setNoticias(prev => prev.map(n => n.id === id ? { ...n, ...datos, editadoEn: new Date().toISOString() } : n))
  }

  function borrarNoticia(id) {
    setNoticias(prev => prev.filter(n => n.id !== id))
  }

  return (
    <NoticiasContext.Provider value={{ noticias, agregarNoticia, editarNoticia, borrarNoticia }}>
      {children}
    </NoticiasContext.Provider>
  )
}

export function useNoticias() {
  return useContext(NoticiasContext)
}
