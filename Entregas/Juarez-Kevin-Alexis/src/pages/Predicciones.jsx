import { useState } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import { useTorneo } from '../context/TorneoContext'
import { useAuth } from '../context/AuthContext'
import { usePredicciones } from '../context/PrediccionesContext'
import '../styles/predicciones.css'

function Bandera({ codigo, size = 20 }) {
  const Flag = Flags[codigo]
  if (!Flag) return null
  return <Flag style={{ width: size, height: 'auto', borderRadius: '2px', flexShrink: 0 }} />
}

function EstadoPuntos({ pts }) {
  if (pts === null) return <span className="pred-badge pred-pendiente">Pendiente</span>
  if (pts === 3) return <span className="pred-badge pred-exacto">Exacto +3</span>
  if (pts === 1) return <span className="pred-badge pred-acierto">Ganador +1</span>
  return <span className="pred-badge pred-fallo">Fallado +0</span>
}

function MisPredicciones() {
  const { partidos } = useTorneo()
  const { misPrediccionesConPuntos } = usePredicciones()
  const lista = misPrediccionesConPuntos(partidos)

  const totalPuntos = lista.reduce((acc, x) => acc + (x.pts || 0), 0)
  const exactos = lista.filter(x => x.pts === 3).length
  const aciertos = lista.filter(x => x.pts >= 1).length
  const pendientes = lista.filter(x => x.pts === null).length

  if (lista.length === 0) {
    return (
      <div className="pred-vacio">
        <span className="pred-vacio-icon">🔮</span>
        <p>Todavía no hiciste ninguna predicción.</p>
        <p className="pred-vacio-sub">Andá a <strong>Grupos</strong> y predecí los resultados antes de que empiecen los partidos.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="pred-resumen">
        <div className="pred-resumen-item">
          <span className="pred-resumen-num">{totalPuntos}</span>
          <span className="pred-resumen-label">Puntos totales</span>
        </div>
        <div className="pred-resumen-item">
          <span className="pred-resumen-num pred-exacto-txt">{exactos}</span>
          <span className="pred-resumen-label">Exactos</span>
        </div>
        <div className="pred-resumen-item">
          <span className="pred-resumen-num pred-acierto-txt">{aciertos}</span>
          <span className="pred-resumen-label">Aciertos</span>
        </div>
        <div className="pred-resumen-item">
          <span className="pred-resumen-num">{pendientes}</span>
          <span className="pred-resumen-label">Pendientes</span>
        </div>
      </div>

      <div className="pred-lista">
        {lista.map(({ partidoId, pred, partido, pts }) => (
          <div key={partidoId} className={`pred-item ${pts === 3 ? 'pred-item-exacto' : pts === 1 ? 'pred-item-acierto' : pts === 0 ? 'pred-item-fallo' : ''}`}>
            <div className="pred-item-partido">
              {partido ? (
                <>
                  <span className="pred-equipo-nombre">
                    <Bandera codigo={partido.codigoLocal} />
                    {partido.local}
                  </span>
                  <div className="pred-marcadores">
                    <span className="pred-marcador-tu">{pred.local} - {pred.visitante}</span>
                    {partido.resultado && (
                      <span className="pred-marcador-real">{partido.resultado.local} - {partido.resultado.visitante}</span>
                    )}
                  </div>
                  <span className="pred-equipo-nombre pred-equipo-der">
                    {partido.visitante}
                    <Bandera codigo={partido.codigoVisitante} />
                  </span>
                </>
              ) : (
                <span className="pred-sin-partido">Partido #{partidoId} · Tu predicción: {pred.local}-{pred.visitante}</span>
              )}
            </div>
            <div className="pred-item-meta">
              {partido && <span className="pred-fase">{partido.fase || partido.grupo || ''}</span>}
              <EstadoPuntos pts={pts} />
            </div>
          </div>
        ))}
      </div>

      <p className="pred-sistema">
        🔮 Sistema de puntos: <strong>+3</strong> resultado exacto · <strong>+1</strong> solo el ganador · <strong>+0</strong> fallo
      </p>
    </div>
  )
}

function Ranking() {
  const { partidos } = useTorneo()
  const { rankingGlobal } = usePredicciones()
  const { usuario } = useAuth()
  const ranking = rankingGlobal(partidos)

  if (ranking.length === 0) {
    return (
      <div className="pred-vacio">
        <span className="pred-vacio-icon">🏆</span>
        <p>Nadie ha hecho predicciones todavía.</p>
        <p className="pred-vacio-sub">¡Sé el primero en predecir y aparecer en el ranking!</p>
      </div>
    )
  }

  const medalias = ['🥇', '🥈', '🥉']

  return (
    <div className="ranking-tabla-wrap">
      <table className="ranking-tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Usuario</th>
            <th>Predicciones</th>
            <th>Exactos</th>
            <th>Aciertos</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((u, i) => {
            const esYo = usuario && `${usuario.nombre} ${usuario.apellido}` === u.nombre
            return (
              <tr key={u.nombre} className={`ranking-fila ${esYo ? 'ranking-yo' : ''}`}>
                <td className="ranking-pos">
                  {i < 3 ? medalias[i] : i + 1}
                </td>
                <td className="ranking-nombre">
                  {u.nombre}
                  {esYo && <span className="ranking-tu-tag"> (vos)</span>}
                </td>
                <td>{u.predicciones}</td>
                <td className="pred-exacto-txt">{u.exactos}</td>
                <td className="pred-acierto-txt">{u.aciertos}</td>
                <td className="ranking-pts">{u.puntos}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Predicciones() {
  const [tab, setTab] = useState('mis')

  return (
    <div className="pred-page">
      <h1>🔮 Predicciones</h1>
      <p className="pred-sub">Predecí los resultados antes de que empiecen los partidos y compará con los demás.</p>

      <div className="pred-tabs">
        <button className={`pred-tab ${tab === 'mis' ? 'active' : ''}`} onClick={() => setTab('mis')}>
          Mis predicciones
        </button>
        <button className={`pred-tab ${tab === 'ranking' ? 'active' : ''}`} onClick={() => setTab('ranking')}>
          🏆 Ranking global
        </button>
      </div>

      {tab === 'mis' ? <MisPredicciones /> : <Ranking />}
    </div>
  )
}

export default Predicciones
