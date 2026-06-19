import { createContext, useContext, useState, useEffect } from 'react'

const NoticiasContext = createContext()
const CLAVE = 'mundial2026_noticias'

function slugify(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
}

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
    const id = Date.now()
    const nueva = {
      ...noticia,
      id,
      slug: `${slugify(noticia.titulo)}-${id}`,
      creadoEn: new Date().toISOString(),
    }
    setNoticias(prev => [nueva, ...prev])
    return nueva
  }

  function editarNoticia(id, datos) {
    setNoticias(prev => prev.map(n =>
      n.id === id
        ? { ...n, ...datos, slug: `${slugify(datos.titulo)}-${id}`, editadoEn: new Date().toISOString() }
        : n
    ))
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
