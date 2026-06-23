import * as Flags from 'country-flag-icons/react/3x2'
import { useTorneo } from '../context/TorneoContext'

function Bandera({ codigo, size = 16 }) {
  const Flag = Flags[codigo]
  if (!Flag) return null
  return <Flag style={{ width: size, height: 'auto', borderRadius: '2px', display: 'block', flexShrink: 0 }} />
}

function Trofeo({ size = 42, flotante = true, opacidad = 1 }) {
  return (
    <img
      src="/copa-m26.png"
      alt="Copa del Mundial 2026"
      className={flotante ? 'bracket-trophy-img' : ''}
      style={{ width: size, height: 'auto', opacity: opacidad, filter: 'drop-shadow(0 0 14px rgba(255,215,0,0.55))', display: 'block' }}
    />
  )
}

function ganadorId(p) {
  if (!p?.resultado) return null
  const { local, visitante } = p.resultado
  if (local > visitante)   return p.localId
  if (visitante > local)   return p.visitanteId
  if (p.penales) return p.penales.local > p.penales.visitante ? p.localId : p.visitanteId
  return null
}

function EquipoFila({ nombre, codigo, goles, esGanador }) {
  return (
    <div className={esGanador ? 'bracket-fila-ganador' : ''} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '5px 8px', minHeight: 28, fontSize: 11, fontWeight: esGanador ? 700 : 500,
      background: esGanador ? 'rgba(46,204,113,0.15)' : '#0c1e38',
      color: esGanador ? '#fff' : 'rgba(255,255,255,0.65)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      transition: 'background 0.2s',
    }}>
      <Bandera codigo={codigo} />
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{nombre || '—'}</span>
      {goles !== undefined && goles !== null && (
        <span style={{ fontWeight: 800, fontSize: 12, color: esGanador ? '#2ecc71' : 'rgba(255,255,255,0.4)', flexShrink: 0, paddingLeft: 4 }}>
          {goles}
        </span>
      )}
    </div>
  )
}

function formatFechaCorta(horaUTC) {
  if (!horaUTC) return null
  const d = new Date(horaUTC)
  const fecha = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', timeZone: 'UTC' })
  const hora = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
  return `${fecha} · ${hora} UTC`
}

function PartidoCard({ p, delayMs = 0 }) {
  const ganId = ganadorId(p)
  const conRes = !!p?.resultado
  const fechaTexto = p ? formatFechaCorta(p.horaUTC) : null
  return (
    <div className="bracket-anim-in" style={{ width: '100%', animationDelay: `${delayMs}ms` }}>
      {fechaTexto && (
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.5px', color: 'rgba(255,255,255,0.35)',
          textAlign: 'center', marginBottom: 3, textTransform: 'uppercase',
        }}>
          📅 {fechaTexto}
        </div>
      )}
      <div className="bracket-card" style={{
        width: '100%', borderRadius: 7, overflow: 'hidden',
        border: `1px solid ${conRes ? 'rgba(46,204,113,0.25)' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: conRes ? '0 0 10px rgba(46,204,113,0.06)' : 'none',
      }}>
        <EquipoFila nombre={p?.local}     codigo={p?.codigoLocal}     goles={conRes ? p.resultado.local     : undefined} esGanador={!!p && ganId === p.localId} />
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <EquipoFila nombre={p?.visitante} codigo={p?.codigoVisitante} goles={conRes ? p.resultado.visitante : undefined} esGanador={!!p && ganId === p.visitanteId} />
      </div>
    </div>
  )
}

function RondaCol({ label, partidos, align = 'left', delayBase = 0 }) {
  if (!partidos || partidos.length === 0) return null
  const ordenados = [...partidos].sort((a, b) => a.orden - b.orden)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
      <div className="bracket-anim-in" style={{
        textAlign: 'center', fontSize: 9, fontWeight: 800, letterSpacing: '1.2px',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
        padding: '0 4px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 8,
        animationDelay: `${delayBase}ms`,
      }}>{label}</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        {ordenados.map((p, i) => (
          <div key={p.id}
            style={{ display: 'flex', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', padding: '4px 6px' }}>
            <PartidoCard p={p} delayMs={delayBase + i * 60} />
          </div>
        ))}
      </div>
    </div>
  )
}

function Sep({ delayMs = 0 }) {
  return <div className="bracket-sep" style={{ width: 1, background: 'rgba(255,255,255,0.05)', flexShrink: 0, alignSelf: 'stretch', animationDelay: `${delayMs}ms` }} />
}

function CentroCol({ fin, tp }) {
  const ganFin = ganadorId(fin)
  const conFin = !!fin?.resultado
  const ganTp  = ganadorId(tp)
  const conTp  = !!tp?.resultado
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 20, padding: '0 24px',
      flex: '0 1 220px', minWidth: 180,
    }}>
      <Trofeo size={56} />
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div className="bracket-anim-in" style={{ fontSize: 9, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#e74c3c', marginBottom: 8 }}>
          ⚽ FINAL
        </div>
        {fin ? (
          <>
            {fin.horaUTC && (
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📅 {formatFechaCorta(fin.horaUTC)}
              </div>
            )}
            <div className={`bracket-anim-in ${ganFin ? 'bracket-card-campeon' : ''}`} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(231,76,60,0.35)', boxShadow: '0 0 20px rgba(231,76,60,0.1)' }}>
              <EquipoFila nombre={fin.local}     codigo={fin.codigoLocal}     goles={conFin ? fin.resultado.local     : undefined} esGanador={conFin && ganFin === fin.localId} />
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <EquipoFila nombre={fin.visitante} codigo={fin.codigoVisitante} goles={conFin ? fin.resultado.visitante : undefined} esGanador={conFin && ganFin === fin.visitanteId} />
            </div>
            {ganFin && (
              <div className="bracket-anim-in" style={{ marginTop: 8, fontSize: 10, fontWeight: 700, color: '#f1c40f', letterSpacing: '0.5px' }}>
                🥇 {fin.localId === ganFin ? fin.local : fin.visitante}
              </div>
            )}
          </>
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontStyle: 'italic', padding: '12px 20px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 8 }}>
            Pendiente
          </div>
        )}
      </div>
      {tp && (
        <div className="bracket-anim-in" style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
            🥉 3er Puesto
          </div>
          <div className="bracket-card" style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <EquipoFila nombre={tp.local}     codigo={tp.codigoLocal}     goles={conTp ? tp.resultado.local     : undefined} esGanador={conTp && ganTp === tp.localId} />
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <EquipoFila nombre={tp.visitante} codigo={tp.codigoVisitante} goles={conTp ? tp.resultado.visitante : undefined} esGanador={conTp && ganTp === tp.visitanteId} />
          </div>
        </div>
      )}
    </div>
  )
}

function BracketVacio() {
  return (
    <div style={{
      minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 16, padding: '3rem',
      background: 'linear-gradient(180deg, #071426 0%, #050f1e 100%)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <Trofeo size={56} opacidad={0.3} />
      <div className="bracket-anim-in" style={{ textAlign: 'center', animationDelay: '120ms' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 16, margin: '0 0 6px' }}>
          El bracket se genera automáticamente
        </p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, margin: 0 }}>
          Completá todos los resultados de la Fase de Grupos para desbloquear los Dieciseisavos
        </p>
      </div>
    </div>
  )
}

/*
  Split determinista:
  ronda32  → órdenes 0-7  izq | 8-15  der  (8 por lado)
  octavos  → órdenes 0-3  izq | 4-7   der  (4 por lado)
  cuartos  → órdenes 0-1  izq | 2-3   der  (2 por lado)
  semis    → orden  0     izq | 1     der  (1 por lado)
*/
function splitPorOrden(arr, mitad) {
  const ordenados = [...arr].sort((a, b) => a.orden - b.orden)
  return [
    ordenados.filter(p => p.orden < mitad),
    ordenados.filter(p => p.orden >= mitad),
  ]
}

export default function Bracket() {
  const { partidos } = useTorneo()

  const r32 = partidos.filter(p => p.ronda === 'ronda32')   // 16 partidos → 8|8
  const oct = partidos.filter(p => p.ronda === 'octavos')   //  8 partidos → 4|4
  const cua = partidos.filter(p => p.ronda === 'cuartos')   //  4 partidos → 2|2
  const sem = partidos.filter(p => p.ronda === 'semis')     //  2 partidos → 1|1
  const fin = partidos.find(p  => p.ronda === 'final') || null
  const tp  = partidos.find(p  => p.ronda === 'tercerPuesto') || null

  const bracketGenerado = r32.length > 0

  const [r32i, r32d] = splitPorOrden(r32,  8)
  const [octi, octd] = splitPorOrden(oct,  4)
  const [cuai, cuad] = splitPorOrden(cua,  2)
  const [semi, semd] = splitPorOrden(sem,  1)

  return (
    <section style={{ padding: '0 0 3rem' }}>
      <div style={{ padding: '2rem 0 1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Trofeo size={26} flotante />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: 0 }}>
          Tournament Bracket
        </h2>
        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
          Mundial 2026 — Fase Eliminatoria
        </span>
      </div>

      {!bracketGenerado ? <BracketVacio /> : (
        <div style={{ width: '100%', overflowX: 'auto', paddingBottom: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'stretch',
            background: 'linear-gradient(180deg, #071426 0%, #050f1e 100%)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            minHeight: 1100,
            width: '100%',
            minWidth: 760,
            padding: '20px 0',
          }}>

            {/* ── IZQUIERDA: Dieciseisavos → Semis (convergiendo al centro) ── */}
            <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0 }}>
              <RondaCol label="Dieciseisavos" partidos={r32i} align="left" delayBase={0} />
              {octi.length > 0 && <><Sep delayMs={80} /><RondaCol label="Octavos"  partidos={octi} align="left" delayBase={80} /></>}
              {cuai.length > 0 && <><Sep delayMs={160} /><RondaCol label="Cuartos"  partidos={cuai} align="left" delayBase={160} /></>}
              {semi.length > 0 && <><Sep delayMs={240} /><RondaCol label="Semis"    partidos={semi} align="left" delayBase={240} /></>}
            </div>

            {/* ── CENTRO ── */}
            <Sep delayMs={320} />
            <CentroCol fin={fin} tp={tp} />
            <Sep delayMs={320} />

            {/* ── DERECHA: Semis → Dieciseisavos (espejo) ── */}
            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'stretch', flex: 1, minWidth: 0 }}>
              <RondaCol label="Dieciseisavos" partidos={r32d} align="right" delayBase={0} />
              {octd.length > 0 && <><Sep delayMs={80} /><RondaCol label="Octavos"  partidos={octd} align="right" delayBase={80} /></>}
              {cuad.length > 0 && <><Sep delayMs={160} /><RondaCol label="Cuartos"  partidos={cuad} align="right" delayBase={160} /></>}
              {semd.length > 0 && <><Sep delayMs={240} /><RondaCol label="Semis"    partidos={semd} align="right" delayBase={240} /></>}
            </div>

          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 20, padding: '12px 0', flexWrap: 'wrap' }}>
        {[['#2ecc71','Resultado cargado'],['rgba(255,255,255,0.1)','Partido pendiente'],['rgba(46,204,113,0.15)','Equipo ganador']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </section>
  )
}
