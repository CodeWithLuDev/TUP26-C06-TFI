import { useState } from 'react'

function youtubeEmbedUrl(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

const smallBtn = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.6)', width: 24, height: 24, borderRadius: 5,
  cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const inputStyle = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10, color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit',
  padding: '0.65rem 0.9rem', outline: 'none', width: '100%',
}

export default function ModalNoticia({ noticia, onGuardar, onCerrar }) {
  const editar = !!noticia

  const [titulo,         setTitulo]         = useState(noticia?.titulo    || '')
  const [subtitulo,      setSubtitulo]      = useState(noticia?.subtitulo || '')
  const [texto,          setTexto]          = useState(noticia?.texto     || '')
  const [portada,        setPortada]        = useState(noticia?.portada   || '')
  const [portadaPreview, setPortadaPreview] = useState(noticia?.portada   || '')
  const [bloques,        setBloques]        = useState(noticia?.bloques   || [])
  const [error,          setError]          = useState('')

  function handlePortadaUrl(e) {
    setPortada(e.target.value)
    setPortadaPreview(e.target.value)
  }

  function handlePortadaArchivo(e) {
    const file = e.target.files[0]
    if (!file) return
    const r = new FileReader()
    r.onload = ev => { setPortada(ev.target.result); setPortadaPreview(ev.target.result) }
    r.readAsDataURL(file)
  }

  function agregarBloque(tipo) {
    const nuevo = tipo === 'texto'   ? { tipo: 'texto',   valor: '' }
               : tipo === 'imagen'  ? { tipo: 'imagen',  valor: '', preview: '' }
               :                      { tipo: 'youtube', valor: '' }
    setBloques(prev => [...prev, nuevo])
  }

  function actualizarBloque(i, campo, valor) {
    setBloques(prev => prev.map((b, idx) => idx === i ? { ...b, [campo]: valor } : b))
  }

  function handleBloqueImgArchivo(i, e) {
    const file = e.target.files[0]
    if (!file) return
    const r = new FileReader()
    r.onload = ev => setBloques(prev => prev.map((b, idx) => idx === i ? { ...b, valor: ev.target.result, preview: ev.target.result } : b))
    r.readAsDataURL(file)
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
          <span className="nm-label">o cargar desde archivo</span>
          <input type="file" accept="image/*" onChange={handlePortadaArchivo} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }} />
          {portadaPreview && <img src={portadaPreview} alt="preview" className="nm-portada-preview" />}
        </div>

        {/* TÍTULO */}
        <div className="nm-field">
          <span className="nm-label">Título *</span>
          <input className="nm-input" placeholder="Título de la noticia" value={titulo}
            onChange={e => { setTitulo(e.target.value); setError('') }} style={inputStyle} />
        </div>

        {/* SUBTÍTULO */}
        <div className="nm-field">
          <span className="nm-label">Subtítulo</span>
          <input className="nm-input" placeholder="Breve descripción o bajada" value={subtitulo}
            onChange={e => setSubtitulo(e.target.value)} style={inputStyle} />
        </div>

        {/* TEXTO PRINCIPAL */}
        <div className="nm-field">
          <span className="nm-label">Texto principal</span>
          <textarea className="nm-textarea" placeholder="Cuerpo de la noticia..."
            value={texto} onChange={e => setTexto(e.target.value)}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 100, lineHeight: 1.6 }} />
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
                  <textarea value={b.valor} onChange={e => actualizarBloque(i, 'valor', e.target.value)}
                    placeholder="Texto adicional..." style={{ ...inputStyle, resize: 'vertical', minHeight: 80, lineHeight: 1.6 }} />
                )}

                {b.tipo === 'imagen' && (
                  <>
                    <input value={b.valor.startsWith('data:') ? '' : b.valor}
                      onChange={e => actualizarBloque(i, 'valor', e.target.value)}
                      placeholder="URL de la imagen" style={{ ...inputStyle, marginBottom: 6 }} />
                    <input type="file" accept="image/*" onChange={e => handleBloqueImgArchivo(i, e)}
                      style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: 6 }} />
                    {(b.preview || b.valor) && (
                      <img src={b.preview || b.valor} alt="preview"
                        style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover', marginTop: 4 }} />
                    )}
                  </>
                )}

                {b.tipo === 'youtube' && (
                  <>
                    <input value={b.valor} onChange={e => actualizarBloque(i, 'valor', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..." style={inputStyle} />
                    {youtubeEmbedUrl(b.valor) && (
                      <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                        <iframe src={youtubeEmbedUrl(b.valor)} title="yt-preview"
                          style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
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
