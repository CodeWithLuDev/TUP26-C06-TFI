import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNoticias } from '../context/NoticiasContext'
import { useAuth } from '../context/AuthContext'
import ModalNoticia from '../components/ModalNoticia'
import '../styles/noticias.css'

function formatFecha(iso) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function NoticiaCard({ noticia, esAdmin, onVer, onEditar, onBorrar }) {
  return (
    <div className="noticia-card">
      <div className="noticia-card-inner" onClick={onVer}>
        <div className="noticia-card-img-wrap">
          {noticia.portada
            ? <img src={noticia.portada} alt={noticia.titulo} className="noticia-card-img" />
            : <div className="noticia-card-img-placeholder">⚽</div>
          }
        </div>
        <div className="noticia-card-body">
          <p className="noticia-card-fecha">{formatFecha(noticia.creadoEn)}</p>
          <h3 className="noticia-card-titulo">{noticia.titulo}</h3>
          {noticia.subtitulo && <p className="noticia-card-subtitulo">{noticia.subtitulo}</p>}
          <span className="noticia-card-leer">Leer más →</span>
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

export default function Noticias() {
  const { noticias, agregarNoticia, editarNoticia, borrarNoticia } = useNoticias()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const esAdmin = usuario?.rol === 'admin'

  const [modalAbierto,  setModalAbierto]  = useState(false)
  const [noticiaEditar, setNoticiaEditar] = useState(null)

  function abrirNueva()         { setNoticiaEditar(null); setModalAbierto(true) }
  function abrirEditar(n)       { setNoticiaEditar(n);    setModalAbierto(true) }
  function cerrarModal()        { setModalAbierto(false); setNoticiaEditar(null) }

  function handleGuardar(datos) {
    if (noticiaEditar) editarNoticia(noticiaEditar.id, datos)
    else               agregarNoticia(datos)
    cerrarModal()
  }

  function handleBorrar(id) {
    if (confirm('¿Borrar esta noticia?')) borrarNoticia(id)
  }

  return (
    <div className="noticias-page">
      <div className="noticias-header">
        <div>
          <h1>📰 Noticias</h1>
          <p className="noticias-sub">Últimas novedades del Mundial 2026</p>
        </div>
        {esAdmin && (
          <button className="btn-nueva-noticia" onClick={abrirNueva}>
            + Nueva noticia
          </button>
        )}
      </div>

      {noticias.length === 0 ? (
        <div className="noticias-vacio">
          {esAdmin
            ? '📭 Todavía no hay noticias. Creá la primera con el botón de arriba.'
            : '📭 No hay noticias publicadas todavía.'}
        </div>
      ) : (
        <div className="noticias-lista">
          {noticias.map(n => (
            <NoticiaCard
              key={n.id}
              noticia={n}
              esAdmin={esAdmin}
              onVer={() => navigate(`/noticias/${n.slug}`)}
              onEditar={() => abrirEditar(n)}
              onBorrar={() => handleBorrar(n.id)}
            />
          ))}
        </div>
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
