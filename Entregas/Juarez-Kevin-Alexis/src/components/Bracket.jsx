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
  if (local > visitante)   return p.localId
  if (visitante > local)   return p.visitanteId
  if (p.penales) return p.penales.local > p.penales.visitante ? p.localId : p.visitanteId
  return null
}

function EquipoFila({ nombre, codigo, goles, esGanador, vacio }) {
  const base = {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '5px 8px', fontSize: 11, fontWeight: 600, minHeight: 28,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  }
  const estilos = vacio
    ? { ...base, background: '#112240', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', justifyContent: 'center' }
    : esGanador
      ? { ...base, background: 'rgba(46,204,113,0.18)', color: '#fff', borderColor: 'rgba(46,204,113,0.25)' }
      : { ...base, background: '#0d1f3c', color: 'rgba(255,255,255,0.7)' }

  if (vacio) return <div style={estilos}>—</div>
  return (
    <div style={estilos}>
      <Bandera codigo={codigo} />
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</span>
      {goles !== undefined && goles !== null && (
        <span style={{ fontWeight: 800, color: esGanador ? '#2ecc71' : 'rgba(255,255,255,0.45)', minWidth: 14, textAlign: 'right' }}>
          {goles}
        </span>
      )}
    </div>
  )
}

function Partido({ p, mirror }) {
  const ganId = ganadorId(p)
  const conRes = !!p?.resultado
  return (
    <div style={{
      borderRadius: 7, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.12)',
      background: '#0d1f3c',
      ...(mirror ? { marginLeft: 6 } : { marginRight: 6 }),
    }}>
      <EquipoFila nombre={p?.local}     codigo={p?.codigoLocal}     goles={conRes ? p.resultado.local     : undefined} esGanador={!!p && ganId === p.localId}     vacio={!p} />
      <EquipoFila nombre={p?.visitante} codigo={p?.codigoVisitante} goles={conRes ? p.resultado.visitante : undefined} esGanador={!!p && ganId === p.visitanteId} vacio={!p} />
    </div>
  )
}

function Ronda({ label, slots, data, mirror }) {
  const partidos = Array.from({ length: slots }, (_, i) => data.find(x => x.orden === i) || null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 8, whiteSpace: 'nowrap' }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-around', gap: 4 }}>
        {partidos.map((p, i) => (
          <Partido key={p?.id || `tbd-${i}`} p={p} mirror={mirror} />
        ))}
      </div>
    </div>
  )
}

function PartidoCentral({ p, label, small }) {
  const ganId = ganadorId(p)
  const conRes = !!p?.resultado
  const ancho = small ? 145 : 160
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ fontSize: small ? 8 : 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: small ? 'rgba(255,255,255,0.3)' : '#e74c3c', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ width: ancho, borderRadius: 9, overflow: 'hidden', border: `1px solid ${small ? 'rgba(255,255,255,0.1)' : 'rgba(231,76,60,0.4)'}`, background: '#0d1f3c' }}>
        <EquipoFila nombre={p?.local}     codigo={p?.codigoLocal}     goles={conRes ? p.resultado.local     : undefined} esGanador={!!p && ganId === p.localId}     vacio={!p} />
        <EquipoFila nombre={p?.visitante} codigo={p?.codigoVisitante} goles={conRes ? p.resultado.visitante : undefined} esGanador={!!p && ganId === p.visitanteId} vacio={!p} />
      </div>
    </div>
  )
}

/* ── BRACKET PRINCIPAL – Mundial 2026 (32 clasificados) ── */
export default function Bracket() {
  const { partidos } = useTorneo()

  const r32 = partidos.filter(p => p.ronda === 'ronda32')
  const oct = partidos.filter(p => p.ronda === 'octavos')
  const cua = partidos.filter(p => p.ronda === 'cuartos')
  const sem = partidos.filter(p => p.ronda === 'semis')
  const fin = partidos.find(p  => p.ronda === 'final') || null
  const tp  = partidos.find(p  => p.ronda === 'tercerPuesto') || null

  // Dividir cada ronda en izquierda (primera mitad) y derecha (segunda mitad)
  const split = (arr, total) => {
    const mitad = total / 2
    const izq = arr.filter(p => p.orden < mitad)
    const der = arr.filter(p => p.orden >= mitad).map(p => ({ ...p, orden: p.orden - mitad }))
    return [izq, der]
  }

  const [r32_izq, r32_der] = split(r32, 32)
  const [oct_izq, oct_der] = split(oct, 16)
  const [cua_izq, cua_der] = split(cua, 8)
  const sem_izq = sem.filter(p => p.orden === 0)
  const sem_der = sem.filter(p => p.orden === 1).map(p => ({ ...p, orden: 0 }))

  // Altura proporcional: 16 partidos por lado * 50px + gaps
  const ALTURA = 16 * 50 + 15 * 4

  return (
    <section className="bracket-section">
      <h2 className="estadisticas-titulo">Eliminaciones</h2>
      <p className="bracket-subtitulo">Tournament Bracket — Mundial 2026</p>

      <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'stretch',
          minWidth: 1100, height: ALTURA, gap: 0,
          background: '#071426',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '16px 8px',
        }}>

          {/* IZQUIERDA */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'stretch', gap: 4 }}>
            <Ronda label="R. de 32" slots={16} data={r32_izq} />
            <Ronda label="Octavos"  slots={8}  data={oct_izq} />
            <Ronda label="Cuartos"  slots={4}  data={cua_izq} />
            <Ronda label="Semis"    slots={2}  data={sem_izq} />
          </div>

          {/* CENTRO */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px', gap: 12, flexShrink: 0, background: '#071426' }}>
            <div style={{ fontSize: 28, filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.7))' }}>🏆</div>
            <PartidoCentral p={fin} label="Final" />
            {(sem.length > 0 || tp) && <PartidoCentral p={tp} label="3er Puesto" small />}
          </div>

          {/* DERECHA (espejo) */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'stretch', gap: 4, flexDirection: 'row-reverse' }}>
            <Ronda label="R. de 32" slots={16} data={r32_der} mirror />
            <Ronda label="Octavos"  slots={8}  data={oct_der} mirror />
            <Ronda label="Cuartos"  slots={4}  data={cua_der} mirror />
            <Ronda label="Semis"    slots={2}  data={sem_der} mirror />
          </div>

        </div>
      </div>
    </section>
  )
}
