import { useState } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import { equipos } from '../data/equipos'
import { useTorneo } from '../context/TorneoContext'
import { calcularPosiciones } from '../logic/posiciones'
import { calcularGoleadores, calcularAsistidores } from '../logic/estadisticas'
import Bracket from '../components/Bracket'
import { BtnPredecir } from '../components/ModalPredecir'
import '../styles/grupos.css'

const GRUPOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

function Bandera({ codigo, size = 24 }) {
  const Flag = Flags[codigo]
  if (!Flag) return null
  return <Flag style={{ width: size, height: 'auto', borderRadius: '2px' }} />
}

/** Devuelve array con los últimos N resultados de un equipo (más reciente primero).
 *  Cada elemento: 'W' | 'D' | 'L' */
function obtenerUltimos(equipoId, partidos, n = 5) {
  const jugados = partidos
    .filter(p => p.resultado && (p.localId === equipoId || p.visitanteId === equipoId))
    .sort((a, b) => new Date(b.horaUTC) - new Date(a.horaUTC))
    .slice(0, n)

  return jugados.map(p => {
    const esLocal = p.localId === equipoId
    const gF = esLocal ? p.resultado.local : p.resultado.visitante
    const gC = esLocal ? p.resultado.visitante : p.resultado.local
    if (gF > gC) return 'W'
    if (gF < gC) return 'L'
    return 'D'
  })
}

function UltimosIconos({ equipoId, partidos }) {
  const resultados = obtenerUltimos(equipoId, partidos, 5)
  const iconos = Array.from({ length: 5 }, (_, i) => resultados[i] || null)

  return (
    <div className="ultimos-iconos">
      {iconos.map((r, i) => (
        <span
          key={i}
          className={`ultimo-icono ${r === 'W' ? 'icono-w' : r === 'L' ? 'icono-l' : r === 'D' ? 'icono-d' : 'icono-vacio'}`}
          title={r === 'W' ? 'Ganó' : r === 'L' ? 'Perdió' : r === 'D' ? 'Empató' : 'No jugó'}
        >
          {r === 'W' ? '✓' : r === 'L' ? '✕' : r === 'D' ? '–' : '○'}
        </span>
      ))}
    </div>
  )
}

function TablaGrupo({ grupo, partidos }) {
  const equiposGrupo = equipos.filter(e => e.grupo === grupo)
  const partidosGrupo = partidos.filter(p => p.grupo === grupo && p.fase === `Grupo ${grupo}`)
  const tabla = calcularPosiciones(equiposGrupo, partidosGrupo)

  return (
    <div className="grupo-card">
      <h3 className="grupo-titulo">Grupo {grupo}</h3>
      <table className="tabla-posiciones">
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>G</th>
            <th>E</th>
            <th>P</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
            <th className="col-pts">Pts</th>
            <th className="col-ultimos">Últimos 5</th>
          </tr>
        </thead>
        <tbody>
          {tabla.map((eq, i) => (
            <tr key={eq.nombre} className={i < 2 ? 'clasificado' : ''}>
              <td className="pos-num">{i + 1}</td>
              <td className="pos-equipo">
                <Bandera codigo={eq.codigo} size={22} />
                <span>{eq.nombre}</span>
              </td>
              <td>{eq.PJ}</td>
              <td>{eq.PG}</td>
              <td>{eq.PE}</td>
              <td>{eq.PP}</td>
              <td>{eq.GF}</td>
              <td>{eq.GC}</td>
              <td>{eq.DG > 0 ? `+${eq.DG}` : eq.DG}</td>
              <td className="pts col-pts">{eq.PTS}</td>
              <td className="col-ultimos">
                <UltimosIconos equipoId={eq.id} partidos={partidosGrupo} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Leyenda */}
      <div className="tabla-leyenda">
        <div className="leyenda-izq">
          <span className="leyenda-clasificado"></span>
          <span className="leyenda-texto">Fase de eliminación directa</span>
        </div>
        <div className="leyenda-der">
          <span className="leyenda-label">Últimos 5 partidos</span>
          <span className="ultimo-icono icono-w">✓</span><span className="leyenda-txt-icono">Ganó</span>
          <span className="ultimo-icono icono-l">✕</span><span className="leyenda-txt-icono">Perdió</span>
          <span className="ultimo-icono icono-vacio">○</span><span className="leyenda-txt-icono">No jugó</span>
        </div>
      </div>

      <div className="grupo-partidos">
        <h4>Partidos</h4>
        {partidosGrupo.map(p => (
          <div key={p.id} className="grupo-partido">
            <div className="gp-equipos">
              <span className="gp-equipo">
                <Bandera codigo={p.codigoLocal} size={18} />
                {p.local}
              </span>
              <span className="gp-marcador">
                {p.resultado ? `${p.resultado.local} - ${p.resultado.visitante}` : 'vs'}
              </span>
              <span className="gp-equipo gp-equipo-der">
                {p.visitante}
                <Bandera codigo={p.codigoVisitante} size={18} />
              </span>
            </div>
            <p className="gp-fecha">{p.fecha} · {new Date(p.horaUTC).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs local</p>
            <BtnPredecir partido={p} />
          </div>
        ))}
      </div>
    </div>
  )
}

function TablaEstadisticas({ partidos }) {
  const goleadores = calcularGoleadores(partidos).slice(0, 5)
  const asistidores = calcularAsistidores(partidos).slice(0, 5)

  return (
    <div className="estadisticas-grid">
      <div className="estadistica-card">
        <h3 className="grupo-titulo">Top Goleadores</h3>
        <table className="tabla-posiciones tabla-estadistica">
          <thead>
            <tr><th>#</th><th>Jugador</th><th>Equipo</th><th>Goles</th></tr>
          </thead>
          <tbody>
            {goleadores.length === 0 && (
              <tr><td colSpan={4} className="estadistica-vacio">Todavía no hay goles cargados</td></tr>
            )}
            {goleadores.map((g, i) => (
              <tr key={`${g.jugador}-${g.equipo}`}>
                <td className="pos-num">{i + 1}</td>
                <td className="pos-equipo">{g.jugador}</td>
                <td>{g.equipo}</td>
                <td className="pts">{g.goles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="estadistica-card">
        <h3 className="grupo-titulo">Top Asistidores</h3>
        <table className="tabla-posiciones tabla-estadistica">
          <thead>
            <tr><th>#</th><th>Jugador</th><th>Equipo</th><th>Asist.</th></tr>
          </thead>
          <tbody>
            {asistidores.length === 0 && (
              <tr><td colSpan={4} className="estadistica-vacio">Todavía no hay asistencias cargadas</td></tr>
            )}
            {asistidores.map((a, i) => (
              <tr key={`${a.jugador}-${a.equipo}`}>
                <td className="pos-num">{i + 1}</td>
                <td className="pos-equipo">{a.jugador}</td>
                <td>{a.equipo}</td>
                <td className="pts">{a.asistencias}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Grupos() {
  const [grupoActivo, setGrupoActivo] = useState('A')
  const { partidos } = useTorneo()

  return (
    <>
      <div className="grupos-page">
        <h1>Clasificatoria y Grupos</h1>
        <p className="grupos-sub">Seguí el estado de cada grupo en tiempo real</p>

        <div className="grupos-tabs">
          {GRUPOS.map(g => (
            <button
              key={g}
              className={`grupo-tab ${grupoActivo === g ? 'active' : ''}`}
              onClick={() => setGrupoActivo(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <TablaGrupo grupo={grupoActivo} partidos={partidos} />

        <h2 className="estadisticas-titulo">Estadísticas del Torneo</h2>
        <TablaEstadisticas partidos={partidos} />
      </div>

      <div className="bracket-section-full">
        <Bracket />
      </div>
    </>
  )
}

export default Grupos
