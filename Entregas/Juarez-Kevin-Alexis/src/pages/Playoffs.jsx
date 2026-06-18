import * as Flags from 'country-flag-icons/react/3x2'
import { useTorneo } from '../context/TorneoContext'

function Bandera({ codigo, size = 20 }) {
  const Flag = Flags[codigo]
  if (!Flag) return null
  return <Flag style={{ width: size, height: 'auto', borderRadius: '2px' }} />
}

function resultadoTexto(partido) {
  if (!partido.resultado) return 'vs'
  const { local, visitante } = partido.resultado
  let texto = `${local} - ${visitante}`
  if (partido.penales) texto += ` (pen. ${partido.penales.local}-${partido.penales.visitante})`
  else if (partido.tiempoExtra) texto += ' (TE)'
  return texto
}

function ganadorId(partido) {
  if (!partido.resultado) return null
  const { local, visitante } = partido.resultado
  if (local > visitante) return partido.localId
  if (visitante > local) return partido.visitanteId
  if (partido.penales) {
    return partido.penales.local > partido.penales.visitante ? partido.localId : partido.visitanteId
  }
  return null
}

function LlaveEquipo({ nombre, codigo, esGanador, definido }) {
  if (!definido) {
    return <div className="llave-equipo llave-equipo-pendiente">Por definir</div>
  }
  return (
    <div className={`llave-equipo ${esGanador ? 'llave-equipo-ganador' : ''}`}>
      <Bandera codigo={codigo} size={18} />
      <span>{nombre}</span>
    </div>
  )
}

function LlavePartido({ partido }) {
  const ganador = partido ? ganadorId(partido) : null

  return (
    <div className="llave-partido">
      <LlaveEquipo
        nombre={partido?.local}
        codigo={partido?.codigoLocal}
        esGanador={ganador === partido?.localId}
        definido={!!partido}
      />
      <div className="llave-marcador">{partido ? resultadoTexto(partido) : '—'}</div>
      <LlaveEquipo
        nombre={partido?.visitante}
        codigo={partido?.codigoVisitante}
        esGanador={ganador === partido?.visitanteId}
        definido={!!partido}
      />
    </div>
  )
}

function Columna({ titulo, partidos, cantidadEsperada }) {
  const slots = Array.from({ length: cantidadEsperada }, (_, i) =>
    partidos.find(p => p.orden === i) || null
  )

  return (
    <div className="llave-columna">
      <h3 className="llave-columna-titulo">{titulo}</h3>
      <div className="llave-columna-partidos">
        {slots.map((p, i) => (
          <LlavePartido key={p?.id || `vacio-${i}`} partido={p} />
        ))}
      </div>
    </div>
  )
}

function Playoffs() {
  const { partidos } = useTorneo()

  const partidosGrupos = partidos.filter(p => p.fase && p.fase.startsWith('Grupo'))
  const faseGruposLista = partidosGrupos.length > 0 && partidosGrupos.every(p => p.resultado !== null)

  const octavos = partidos.filter(p => p.ronda === 'octavos')
  const cuartos = partidos.filter(p => p.ronda === 'cuartos')
  const semis = partidos.filter(p => p.ronda === 'semis')
  const final = partidos.filter(p => p.ronda === 'final')
  const tercerPuesto = partidos.find(p => p.ronda === 'tercerPuesto')

  if (!faseGruposLista) {
    return (
      <div className="playoffs-page">
        <h1>Eliminación Directa</h1>
        <p className="playoffs-aviso">
          Las llaves se generarán automáticamente cuando finalice la fase de grupos
          (faltan resultados por cargar).
        </p>
      </div>
    )
  }

  return (
    <div className="playoffs-page">
      <h1>Eliminación Directa</h1>
      <p className="playoffs-sub">El bracket se actualiza solo a medida que se cargan resultados</p>

      <div className="llave-bracket">
        <Columna titulo="Octavos de Final" partidos={octavos} cantidadEsperada={8} />
        <Columna titulo="Cuartos de Final" partidos={cuartos} cantidadEsperada={4} />
        <Columna titulo="Semifinales" partidos={semis} cantidadEsperada={2} />
        <Columna titulo="Final" partidos={final} cantidadEsperada={1} />
      </div>

      {(semis.length === 2) && (
        <div className="tercer-puesto-section">
          <h3 className="llave-columna-titulo">Tercer Puesto</h3>
          <LlavePartido partido={tercerPuesto} />
        </div>
      )}
    </div>
  )
}

export default Playoffs
