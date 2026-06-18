import { useState } from 'react'
import { useNoticias } from '../context/NoticiasContext'
import { useAuth } from '../context/AuthContext'
import '../styles/noticias.css'

/* ─── Helpers ─── */
function formatFecha(iso) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function youtubeEmbedUrl(url) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  if (!match) return null
  return `https://www.youtube.com/embed/${match[1]}`
}

/* ─── Modal de creación / edición ─── */
const BLOQUE_VACIO_TEXTO = () => ({ tipo: 'texto', valor: '' })
const BLOQUE_VACIO_IMG   = () => ({ tipo: 'imagen', valor: '', preview: '' })
const BLOQUE_VACIO_YT    = () => ({ tipo: 'youtube', valor: '' })

function ModalNoticia({ noticia, onGuardar, onCerrar }) {
  const editar = !!noticia

  const [titulo,    setTitulo]    = useState(noticia?.titulo    || '')
  const [subtitulo, setSubtitulo] = useState(noticia?.subtitulo || '')
  const [texto,     setTexto]     = useState(noticia?.texto     || '')
  const [portada,   setPortada]   = useState(noticia?.portada   || '')
  const [portadaPreview, setPortadaPreview] = useState(noticia?.portada || '')
  const [bloques,   setBloques]   = useState(noticia?.bloques   || [])
  const [error,     setError]     = useState('')

  /* Portada: acepta URL o archivo */
  function handlePortadaUrl(e) {
    setPortada(e.target.value)
    setPortadaPreview(e.target.value)
  }

  function handlePortadaArchivo(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setPortada(ev.target.result)
      setPortadaPreview(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  /* Bloques */
  function agregarBloque(tipo) {
    const nuevo = tipo === 'texto' ? BLOQUE_VACIO_TEXTO()
                : tipo === 'imagen' ? BLOQUE_VACIO_IMG()
                : BLOQUE_VACIO_YT()
    setBloques(prev => [...prev, nuevo])
  }

  function actualizarBloque(i, campo, valor) {
    setBloques(prev => prev.map((b, idx) => idx === i ? { ...b, [campo]: valor } : b))
  }

  function handleBloqueImgArchivo(i, e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setBloques(prev => prev.map((b, idx) => idx === i ? { ...b, valor: ev.target.result, preview: ev.target.result } : b))
    }
    reader.readAsDataURL(file)
  }

  function quitarBloque(i) {
    setBloques(prev => prev.filter((_, idx) => idx !== i))
  }

  function moverBloque(i, dir) {
    setBloques(prev => {
      const arr = [...prev]
      const j = i + dir
      if (j < 0 || j >= arr.length) return arr
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return arr
    })
  }

  function guardar() {
    if (!titulo.trim()) { setError('El título es obligatorio.'); return }
    onGuardar({ titulo: titulo.trim(), subtitulo: subtitulo.trim(), texto: texto.trim(), portada, bloques })
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10, color: '#fff', fontSize: '0.95rem',
    fontFamily: 'inherit', padding: '0.65rem 0.9rem', outline: 'none', width: '100%',
  }

  return (
    <div className="noticia-modal-overlay" onClick={onCerrar}>
      <div className="noticia-modal" onClick={e => e.stopPropagation()}>
        <button className="noticia-modal-cerrar" onClick={onCerrar}>✕</button>
        <h2>{editar ? '✏️ Editar noticia' : '📝 Nueva noticia'}</h2>

        {error && <p style={{ color: '#e74c3c', marginBottom: '1rem', fontSize: '0.88rem' }}>{error}</p>}

        {/* PORTADA */}
        <div className="nm-field">
          <span className="nm-label">🖼️ Imagen de portada — URL</span>
          <input className="nm-input" placeholder="https://..." value={portada.startsWith('data:') ? '' : portada} onChange={handlePortadaUrl} style={inputStyle} />
        </div>
        <div className="nm-field">
          <span className="nm-label">o cargar archivo</span>
          <input type="file" accept="image/*" onChange={handlePortadaArchivo} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }} />
          {portadaPreview && <img src={portadaPreview} alt="preview" className="nm-portada-preview" />}
        </div>

        {/* TÍTULO */}
        <div className="nm-field">
          <span className="nm-label">Título *</span>
          <input className="nm-input" placeholder="Título de la noticia" value={titulo} onChange={e => { setTitulo(e.target.value); setError('') }} style={inputStyle} />
        </div>

        {/* SUBTÍTULO */}
        <div className="nm-field">
          <span className="nm-label">Subtítulo</span>
          <input className="nm-input" placeholder="Breve descripción o bajada" value={subtitulo} onChange={e => setSubtitulo(e.target.value)} style={inputStyle} />
        </div>

        {/* TEXTO PRINCIPAL */}
        <div className="nm-field">
          <span className="nm-label">Texto principal</span>
          <textarea className="nm-textarea" placeholder="Escribí el cuerpo de la noticia..." value={texto} onChange={e => setTexto(e.target.value)} style={{ ...inputStyle, resize: 'vertical', minHeight: 100, lineHeight: 1.6 }} />
        </div>

        {/* BLOQUES EXTRA */}
        {bloques.length > 0 && (
          <div className="nm-extra-lista">
            {bloques.map((b, i) => (
              <div key={i} className="nm-extra-bloque">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="nm-extra-tipo">
                    {b.tipo === 'texto' ? '📄 Texto adicional' : b.tipo === 'imagen' ? '🖼️ Imagen' : '▶️ Video YouTube'}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => moverBloque(i, -1)} style={{ ...smallBtn, opacity: i === 0 ? 0.3 : 1 }}>↑</button>
                    <button onClick={() => moverBloque(i, 1)} style={{ ...smallBtn, opacity: i === bloques.length - 1 ? 0.3 : 1 }}>↓</button>
                    <button className="nm-extra-quitar" onClick={() => quitarBloque(i)}>✕</button>
                  </div>
                </div>

                {b.tipo === 'texto' && (
                  <textarea
                    value={b.valor}
                    onChange={e => actualizarBloque(i, 'valor', e.target.value)}
                    placeholder="Escribí el texto adicional..."
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
                  />
                )}

                {b.tipo === 'imagen' && (
                  <>
                    <input
                      value={b.valor.startsWith('data:') ? '' : b.valor}
                      onChange={e => actualizarBloque(i, 'valor', e.target.value)}
                      placeholder="URL de la imagen"
                      style={{ ...inputStyle, marginBottom: 6 }}
                    />
                    <input type="file" accept="image/*" onChange={e => handleBloqueImgArchivo(i, e)}
                      style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: 6 }} />
                    {(b.preview || b.valor) && (
                      <img src={b.preview || b.valor} alt="preview" style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover', marginTop: 4 }} />
                    )}
                  </>
                )}

                {b.tipo === 'youtube' && (
                  <>
                    <input
                      value={b.valor}
                      onChange={e => actualizarBloque(i, 'valor', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      style={inputStyle}
                    />
                    {youtubeEmbedUrl(b.valor) && (
                      <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                        <iframe src={youtubeEmbedUrl(b.valor)} title="yt-preview" style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* AÑADIR BLOQUE */}
        <div style={{ marginBottom: '0.5rem' }}>
          <span className="nm-label" style={{ display: 'block', marginBottom: '0.5rem' }}>+ Añadir bloque de contenido</span>
          <div className="nm-add-bloques">
            <button className="nm-add-btn" onClick={() => agregarBloque('texto')}>📄 Texto</button>
            <button className="nm-add-btn" onClick={() => agregarBloque('imagen')}>🖼️ Imagen</button>
            <button className="nm-add-btn" onClick={() => agregarBloque('youtube')}>▶️ Link YouTube</button>
          </div>
        </div>

        <div className="nm-acciones">
          <button className="nm-btn-cancelar" onClick={onCerrar}>Cancelar</button>
          <button className="nm-btn-guardar" onClick={guardar}>{editar ? 'Guardar cambios' : 'Publicar noticia'}</button>
        </div>
      </div>
    </div>
  )
}

const smallBtn = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.6)', width: 24, height: 24, borderRadius: 5,
  cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
}

/* ─── Vista detalle de una noticia ─── */
function DetalleNoticia({ noticia, onCerrar }) {
  return (
    <div className="noticia-detalle-overlay" onClick={onCerrar}>
      <div className="noticia-detalle" onClick={e => e.stopPropagation()}>
        <button className="noticia-detalle-cerrar" onClick={onCerrar}>✕</button>

        {noticia.portada
          ? <img src={noticia.portada} alt={noticia.titulo} className="noticia-detalle-portada" />
          : <div className="noticia-detalle-portada-placeholder">⚽</div>
        }

        <div className="noticia-detalle-body">
          <p className="noticia-detalle-fecha">{formatFecha(noticia.creadoEn)}</p>
          <h1 className="noticia-detalle-titulo">{noticia.titulo}</h1>
          {noticia.subtitulo && <p className="noticia-detalle-subtitulo">{noticia.subtitulo}</p>}
          {noticia.texto && <p className="noticia-detalle-texto">{noticia.texto}</p>}

          {/* Bloques adicionales */}
          {(noticia.bloques || []).map((b, i) => {
            if (b.tipo === 'texto') {
              return <p key={i} className="noticia-detalle-texto">{b.valor}</p>
            }
            if (b.tipo === 'imagen' && (b.valor || b.preview)) {
              return <img key={i} src={b.preview || b.valor} alt={`img-${i}`} className="noticia-detalle-img" />
            }
            if (b.tipo === 'youtube') {
              const embed = youtubeEmbedUrl(b.valor)
              if (!embed) return null
              return (
                <div key={i} className="noticia-detalle-yt">
                  <iframe src={embed} title={`yt-${i}`} allowFullScreen />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}

/* ─── Tarjeta de noticia ─── */
function NoticiaCard({ noticia, esAdmin, onVer, onEditar, onBorrar }) {
  return (
    <div className="noticia-card">
      <div onClick={onVer} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {noticia.portada
          ? <img src={noticia.portada} alt={noticia.titulo} className="noticia-card-img" />
          : <div className="noticia-card-img-placeholder">⚽</div>
        }
        <div className="noticia-card-body">
          <p className="noticia-card-fecha">{formatFecha(noticia.creadoEn)}</p>
          <h3 className="noticia-card-titulo">{noticia.titulo}</h3>
          {noticia.subtitulo && <p className="noticia-card-subtitulo">{noticia.subtitulo}</p>}
        </div>
      </div>

      {esAdmin && (
        <div className="noticia-card-admin">
          <button className="nc-btn-editar" onClick={e => { e.stopPropagation(); onEditar() }}>✏️ Editar</button>
          <button className="nc-btn-borrar" onClick={e => { e.stopPropagation(); onBorrar() }}>🗑️ Borrar</button>
        </div>
      )}
    </div>
  )
}

/* ─── Página principal ─── */
export default function Noticias() {
  const { noticias, agregarNoticia, editarNoticia, borrarNoticia } = useNoticias()
  const { usuario } = useAuth()
  const esAdmin = usuario?.rol === 'admin'

  const [modalAbierto,    setModalAbierto]    = useState(false)
  const [noticiaEditar,   setNoticiaEditar]   = useState(null)   // null = nueva
  const [noticiaDetalle,  setNoticiaDetalle]  = useState(null)

  function abrirNueva()          { setNoticiaEditar(null); setModalAbierto(true) }
  function abrirEditar(noticia)  { setNoticiaEditar(noticia); setModalAbierto(true) }
  function cerrarModal()         { setModalAbierto(false); setNoticiaEditar(null) }

  function handleGuardar(datos) {
    if (noticiaEditar) {
      editarNoticia(noticiaEditar.id, datos)
    } else {
      agregarNoticia(datos)
    }
    cerrarModal()
  }

  function handleBorrar(id) {
    if (confirm('¿Borrar esta noticia?')) borrarNoticia(id)
  }

  return (
    <div className="noticias-page">
      <div className="noticias-header">
        <h1>📰 Noticias</h1>
        {esAdmin && (
          <button className="btn-nueva-noticia" onClick={abrirNueva}>
            + Nueva noticia
          </button>
        )}
      </div>
      <p className="noticias-sub">Últimas novedades del Mundial 2026</p>

      {noticias.length === 0 ? (
        <div className="noticias-vacio">
          {esAdmin
            ? '📭 Todavía no hay noticias. Creá la primera con el botón de arriba.'
            : '📭 No hay noticias publicadas todavía.'}
        </div>
      ) : (
        <div className="noticias-grid">
          {noticias.map(n => (
            <NoticiaCard
              key={n.id}
              noticia={n}
              esAdmin={esAdmin}
              onVer={() => setNoticiaDetalle(n)}
              onEditar={() => abrirEditar(n)}
              onBorrar={() => handleBorrar(n.id)}
            />
          ))}
        </div>
      )}

      {noticiaDetalle && (
        <DetalleNoticia noticia={noticiaDetalle} onCerrar={() => setNoticiaDetalle(null)} />
      )}

      {modalAbierto && (
        <ModalNoticia
          noticia={noticiaEditar}
          onGuardar={handleGuardar}
          onCerrar={cerrarModal}
        />
      )}
    </div>
  )
}
