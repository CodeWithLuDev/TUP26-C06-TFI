import { createContext, useContext, useState, useEffect } from 'react'

const NoticiasContext = createContext()
const CLAVE = 'mundial2026_noticias'
const IMG_PREFIX = 'mundial2026_img_'

// ── helpers de imagen ──────────────────────────────────────────────────────────
// Las imágenes base64 se guardan en sessionStorage con clave IMG_PREFIX + key.
// En localStorage solo guardamos la clave de referencia (ej: "img::1234::portada").
// Así localStorage nunca recibe base64 y no explota.

function guardarImagen(key, base64) {
  try { sessionStorage.setItem(IMG_PREFIX + key, base64) } catch {}
}

function recuperarImagen(key) {
  if (!key || !key.startsWith('img::')) return key  // es una URL normal, devolverla tal cual
  return sessionStorage.getItem(IMG_PREFIX + key) || ''
}

function limpiarImagenes(noticia) {
  // Devuelve la noticia con las imágenes base64 reemplazadas por claves de referencia
  const id = noticia.id
  let portada = noticia.portada
  if (portada && portada.startsWith('data:')) {
    const key = `img::${id}::portada`
    guardarImagen(key, portada)
    portada = key
  }

  const bloques = (noticia.bloques || []).map((b, i) => {
    if (b.tipo === 'imagen' && b.valor && b.valor.startsWith('data:')) {
      const key = `img::${id}::b${i}`
      guardarImagen(key, b.valor)
      return { ...b, valor: key, preview: '' }
    }
    return { ...b, preview: '' }  // preview nunca al localStorage
  })

  return { ...noticia, portada, bloques }
}

function hidratarNoticia(noticia) {
  // Rehidrata las referencias de imagen con los datos de sessionStorage
  const portada = recuperarImagen(noticia.portada)
  const bloques = (noticia.bloques || []).map(b => {
    if (b.tipo === 'imagen') return { ...b, valor: recuperarImagen(b.valor) }
    return b
  })
  return { ...noticia, portada, bloques }
}

// ── persistencia ──────────────────────────────────────────────────────────────

function cargar() {
  try {
    const g = localStorage.getItem(CLAVE)
    if (g) {
      const noticias = JSON.parse(g)
      return noticias.map(hidratarNoticia)
    }
  } catch {}
  return []
}

function slugify(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
}

export function NoticiasProvider({ children }) {
  const [noticias, setNoticias] = useState(cargar)

  useEffect(() => {
    // Al persistir, siempre limpiar base64 antes de tocar localStorage
    try {
      const paraGuardar = noticias.map(n => limpiarImagenes({ ...n }))
      localStorage.setItem(CLAVE, JSON.stringify(paraGuardar))
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e)
    }
  }, [noticias])

  function agregarNoticia(noticia) {
    const id = Date.now()
    const nueva = {
      ...noticia,
      id,
      slug: `${slugify(noticia.titulo)}-${id}`,
      creadoEn: new Date().toISOString(),
    }
    // Antes de guardar en estado, mover base64 a sessionStorage
    const limpia = limpiarImagenes(nueva)
    // Pero en el estado React guardamos la versión hidratada (con base64) para mostrar
    // las imágenes sin recargar. Para eso re-hidratamos inmediatamente.
    const hidratada = hidratarNoticia(limpia)
    setNoticias(prev => [hidratada, ...prev])
    return hidratada
  }

  function editarNoticia(id, datos) {
    setNoticias(prev => prev.map(n => {
      if (n.id !== id) return n
      const actualizada = {
        ...n, ...datos,
        slug: `${slugify(datos.titulo)}-${id}`,
        editadoEn: new Date().toISOString(),
      }
      const limpia   = limpiarImagenes(actualizada)
      return hidratarNoticia(limpia)
    }))
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
