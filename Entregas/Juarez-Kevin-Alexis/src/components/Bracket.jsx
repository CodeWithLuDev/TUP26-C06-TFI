import * as Flags from 'country-flag-icons/react/3x2'
import { useTorneo } from '../context/TorneoContext'

function Bandera({ codigo }) {
  const Flag = Flags[codigo]
  if (!Flag) return null
  return <Flag style={{ width: 18, height: 'auto', borderRadius: '2px', display: 'block', flexShrink: 0 }} />
}

function ganadorId(p) {
  if (!p?.resultado) return null
  const { local, visitante } = p.resultado
  if (local > visitante) return p.localId
  if (visitante > local) return p.visitanteId
  if (p.penales) return p.penales.local > p.penales.visitante ? p.localId : p.visitanteId
  return null
}

/* ── Fila de un equipo dentro de un partido ── */
function EquipoFila({ nombre, codigo, goles, esGanador, vacio }) {
  const base = {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 8px',
    fontSize: 11,
    fontWeight: 600,
    minHeight: 28,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  }
  const estilos = vacio
    ? { ...base, background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.18)', fontStyle: 'italic', justifyContent: 'center' }
    : esGanador
      ? { ...base, background: 'rgba(46,204,113,0.12)', color: '#fff', borderColor: 'rgba(46,204,113,0.2)' }
      : { ...base, background: '#0b1e38', color: 'rgba(255,255,255,0.65)' }

  if (vacio) return <div style={estilos}>—</div>

  return (
    <div style={estilos}>
      <Bandera codigo={codigo} />
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</span>
      {goles !== undefined && goles !== null && (
        <span style={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: esGanador ? '#2ecc71' : 'rgba(255,255,255,0.4)', minWidth: 12, textAlign: 'right' }}>
          {goles}
        </span>
      )}
    </div>
  )
}

/* ── Un partido (dos filas) ── */
function Partido({ p, mirror }) {
  const ganId = ganadorId(p)
  const conRes = !!p?.resultado

  const estiloMatch = {
    borderRadius: 7,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.09)',
    position: 'relative',
  }

  // Línea horizontal conectora hacia el centro
  const lineaConector = {
    content: '',
    position: 'absolute',
    top: '50%',
    ...(mirror ? { left: -8 } : { right: -8 }),
    width: 8,
    height: 2,
    background: 'rgba(255,255,255,0.15)',
    pointerEvents: 'none',
  }

  return (
    <div style={{ ...estiloMatch, ...(mirror ? { marginLeft: 8 } : { marginRight: 8 }) }}>
      <EquipoFila nombre={p?.local}     codigo={p?.codigoLocal}     goles={conRes ? p.resultado.local     : undefined} esGanador={!!p && ganId === p.localId}     vacio={!p} />
      <EquipoFila nombre={p?.visitante} codigo={p?.codigoVisitante} goles={conRes ? p.resultado.visitante : undefined} esGanador={!!p && ganId === p.visitanteId} vacio={!p} />
    </div>
  )
}

/* ── Columna de una ronda ── */
function Ronda({ label, slots, data, mirror }) {
  const partidos = Array.from({ length: slots }, (_, i) => data.find(x => x.orden === i) || null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Título de ronda */}
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginBottom: 8 }}>
        {label}
      </div>
      {/* Partidos distribuidos verticalmente con espacio uniforme */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-around', gap: 6 }}>
        {partidos.map((p, i) => (
          <Partido key={p?.id || `tbd-${i}`} p={p} mirror={mirror} />
        ))}
      </div>
    </div>
  )
}

/* ── Partido central (Final / 3er puesto) ── */
function PartidoCentral({ p, label, small }) {
  const ganId = ganadorId(p)
  const conRes = !!p?.resultado
  const ancho = small ? 150 : 165

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ fontSize: small ? 8 : 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: small ? 'rgba(255,255,255,0.25)' : 'var(--rojo)', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ width: ancho, borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.13)' }}>
        <EquipoFila nombre={p?.local}     codigo={p?.codigoLocal}     goles={conRes ? p.resultado.local     : undefined} esGanador={!!p && ganId === p.localId}     vacio={!p} />
        <EquipoFila nombre={p?.visitante} codigo={p?.codigoVisitante} goles={conRes ? p.resultado.visitante : undefined} esGanador={!!p && ganId === p.visitanteId} vacio={!p} />
      </div>
    </div>
  )
}

/* ── BRACKET PRINCIPAL ── */
export default function Bracket() {
  const { partidos } = useTorneo()

  const oct = partidos.filter(p => p.ronda === 'octavos')
  const cua = partidos.filter(p => p.ronda === 'cuartos')
  const sem = partidos.filter(p => p.ronda === 'semis')
  const fin = partidos.find(p => p.ronda === 'final') || null
  const tp  = partidos.find(p => p.ronda === 'tercerPuesto') || null

  // Izquierda: orden 0-3 / Derecha: orden 4-7 (remapeado a 0-3)
  const remap = (arr, desde) => arr.filter(p => p.orden >= desde && p.orden < desde + 4).map(p => ({ ...p, orden: p.orden - desde }))
  const oct_izq = remap(oct, 0); const oct_der = remap(oct, 4)
  const cua_izq = cua.filter(p => p.orden < 2)
  const cua_der = cua.filter(p => p.orden >= 2).map(p => ({ ...p, orden: p.orden - 2 }))
  const sem_izq = sem.filter(p => p.orden === 0)
  const sem_der = sem.filter(p => p.orden === 1).map(p => ({ ...p, orden: 0 }))

  // Altura total del bracket: 8 partidos de octavos * (56px por partido + 6px gap)
  const ALTURA = 8 * 56 + 7 * 6

  return (
    <section className="bracket-section">
      <h2 className="estadisticas-titulo">Eliminaciones</h2>
      <p className="bracket-subtitulo">Tournament Bracket</p>

      <div style={{ overflowX: 'auto', paddingBottom: 12 }}>
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          minWidth: 900,
          height: ALTURA,
          gap: 0,
        }}>

          {/* IZQUIERDA */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'stretch', borderRight: '2px solid rgba(255,255,255,0.07)' }}>
            <Ronda label="Octavos"  slots={4} data={oct_izq} />
            <Ronda label="Cuartos"  slots={2} data={cua_izq} />
            <Ronda label="Semis"    slots={1} data={sem_izq} />
          </div>

          {/* CENTRO */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 18px', gap: 14, flexShrink: 0 }}>
            <div style={{ fontSize: 32, filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))' }}>🏆</div>
            <PartidoCentral p={fin} label="Final" />
            {(sem.length > 0 || tp) && <PartidoCentral p={tp} label="3er Puesto" small />}
          </div>

          {/* DERECHA */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'stretch', borderLeft: '2px solid rgba(255,255,255,0.07)' }}>
            <Ronda label="Semis"    slots={1} data={sem_der}  mirror />
            <Ronda label="Cuartos"  slots={2} data={cua_der}  mirror />
            <Ronda label="Octavos"  slots={4} data={oct_der}  mirror />
          </div>

        </div>
      </div>
    </section>
  )
}
