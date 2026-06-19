import { useParams, useNavigate } from 'react-router-dom'
import { useNoticias } from '../context/NoticiasContext'
import '../styles/noticias.css'

function formatFecha(iso) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function youtubeEmbedUrl(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

export default function NoticiaDetalle() {
  const { slug } = useParams()
  const { noticias } = useNoticias()
  const navigate = useNavigate()

  const noticia = noticias.find(n => n.slug === slug)

  if (!noticia) {
    return (
      <div className="noticias-page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Noticia no encontrada.
        </p>
        <button className="btn-volver" onClick={() => navigate('/noticias')}>
          ← Volver a Noticias
        </button>
      </div>
    )
  }

  return (
    <div className="noticias-page">
      <button className="btn-volver" onClick={() => navigate('/noticias')}>
        ← Volver a Noticias
      </button>

      <article className="noticia-detalle-page">
        {/* Portada */}
        {noticia.portada
          ? <img src={noticia.portada} alt={noticia.titulo} className="nd-portada" />
          : <div className="nd-portada-placeholder">⚽</div>
        }

        <div className="nd-body">
          <p className="nd-fecha">{formatFecha(noticia.creadoEn)}</p>
          <h1 className="nd-titulo">{noticia.titulo}</h1>
          {noticia.subtitulo && <p className="nd-subtitulo">{noticia.subtitulo}</p>}
          {noticia.texto && <p className="nd-texto">{noticia.texto}</p>}

          {/* Bloques adicionales */}
          {(noticia.bloques || []).map((b, i) => {
            if (b.tipo === 'texto' && b.valor) {
              return <p key={i} className="nd-texto">{b.valor}</p>
            }
            if (b.tipo === 'imagen' && (b.valor || b.preview)) {
              return <img key={i} src={b.preview || b.valor} alt={`bloque-${i}`} className="nd-img-bloque" />
            }
            if (b.tipo === 'youtube') {
              const embed = youtubeEmbedUrl(b.valor)
              if (!embed) return null
              return (
                <div key={i} className="nd-yt">
                  <iframe src={embed} title={`yt-${i}`} allowFullScreen />
                </div>
              )
            }
            return null
          })}
        </div>
      </article>
    </div>
  )
}
