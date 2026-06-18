import { useState, useMemo, useRef } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import { useAuth } from '../context/AuthContext'
import { useTorneo } from '../context/TorneoContext'

function Bandera({ codigo, size = 20 }) {
  const Flag = Flags[codigo]
  if (!Flag) return null
  return <Flag style={{ width: size, height: 'auto', borderRadius: '2px', display: 'block' }} />
}

/* ── STEPPER con estilos inline para evitar conflictos CSS ── */
function Stepper({ valor, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.18)', background: '#060e1c' }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, Number(valor) - 1))}
        style={{
          width: 36, height: 48, background: 'rgba(255,255,255,0.07)', border: 'none',
          borderRight: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 20,
          fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#c0392b'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
      >−</button>
      <input
        type="number" min="0" value={valor}
        onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        style={{
          width: 52, textAlign: 'center', border: 'none', background: 'transparent',
          color: '#fff', fontWeight: 800, fontSize: 22, padding: '0 4px',
          MozAppearance: 'textfield', height: 48,
        }}
      />
      <button
        type="button"
        onClick={() => onChange(Number(valor) + 1)}
        style={{
          width: 36, height: 48, background: 'rgba(255,255,255,0.07)', border: 'none',
          borderLeft: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 20,
          fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#c0392b'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
      >+</button>
    </div>
  )
}

function FormularioGol({ golLocal, golVisitante, onAgregar, onQuitar, goles }) {
  const [jugador, setJugador] = useState('')
  const [equipo, setEquipo] = useState(golLocal)
  const [minuto, setMinuto] = useState('')
  const [asistencia, setAsistencia] = useState('')

  const inputStyle = {
    padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 13,
    fontFamily: 'inherit', outline: 'none',
  }

  function agregar() {
    if (!jugador.trim()) return
    onAgregar({ jugador: jugador.trim(), equipo, minuto: minuto ? Number(minuto) : null, asistencia: asistencia.trim() || null })
    setJugador(''); setMinuto(''); setAsistencia('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.35)' }}>
        Goleadores y asistencias
      </span>

      {goles.length > 0 && (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {goles.map((g, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
              <span>⚽</span>
              <strong style={{ color: '#fff' }}>{g.jugador}</strong>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{g.equipo}</span>
              {g.minuto && <span style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>{g.minuto}'</span>}
              {g.asistencia && <span style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontSize: 12 }}>asist. {g.asistencia}</span>}
              <button type="button" onClick={() => onQuitar(i)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 14, padding: 2 }}>✕</button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        <input type="text" placeholder="Jugador que convierte" value={jugador} onChange={e => setJugador(e.target.value)} style={{ ...inputStyle, flex: 2, minWidth: 140 }} />
        <select value={equipo} onChange={e => setEquipo(e.target.value)} style={{ ...inputStyle, background: '#0b1e38' }}>
          <option value={golLocal}>{golLocal}</option>
          <option value={golVisitante}>{golVisitante}</option>
        </select>
        <input type="number" placeholder="Min." value={minuto} onChange={e => setMinuto(e.target.value)} style={{ ...inputStyle, width: 60 }} />
        <input type="text" placeholder="Asistencia (opcional)" value={asistencia} onChange={e => setAsistencia(e.target.value)} style={{ ...inputStyle, flex: 2, minWidth: 120 }} />
        <button
          type="button" onClick={agregar}
          style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
        >+ Agregar gol</button>
      </div>
    </div>
  )
}

function FilaPartido({ partido, onCargar, onBorrar }) {
  const [editando, setEditando] = useState(false)
  const [golLocal, setGolLocal] = useState(partido.resultado?.local ?? 0)
  const [golVisitante, setGolVisitante] = useState(partido.resultado?.visitante ?? 0)
  const [conPenales, setConPenales] = useState(!!partido.penales)
  const [penalLocal, setPenalLocal] = useState(partido.penales?.local ?? 0)
  const [penalVisitante, setPenalVisitante] = useState(partido.penales?.visitante ?? 0)
  const [tiempoExtra, setTiempoExtra] = useState(!!partido.tiempoExtra)
  const [goles, setGoles] = useState(partido.goles || [])

  const esEliminacion = !partido.fase?.startsWith('Grupo')
  const cargado = !!partido.resultado
  const penalesEnEmpate = conPenales && Number(penalLocal) === Number(penalVisitante)

  function confirmar() {
    onCargar(partido.id, { golesLocal: Number(golLocal), golesVisitante: Number(golVisitante), penales: conPenales ? { local: Number(penalLocal), visitante: Number(penalVisitante) } : null, tiempoExtra, goles })
    setEditando(false)
  }

  return (
    <div style={{
      background: '#0a1628',
      border: `1px solid ${editando ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
      borderLeft: `3px solid ${cargado ? '#2ecc71' : 'rgba(192,57,43,0.5)'}`,
      borderRadius: 12,
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Header clickeable */}
      <button
        type="button"
        onClick={() => setEditando(!editando)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
          cursor: 'pointer', width: '100%', background: 'none', border: 'none',
          textAlign: 'left', fontFamily: 'inherit', color: 'inherit',
        }}
      >
        {/* Dot de estado */}
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: cargado ? '#2ecc71' : 'rgba(192,57,43,0.7)', flexShrink: 0, display: 'block' }} />

        {/* Fase */}
        <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, width: 100, flexShrink: 0 }}>
          {partido.fase}
        </span>

        {/* Equipos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', minWidth: 0 }}>
          <Bandera codigo={partido.codigoLocal} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{partido.local}</span>
          <span style={{ background: cargado ? 'rgba(46,204,113,0.12)' : 'rgba(255,255,255,0.07)', color: cargado ? '#2ecc71' : 'rgba(255,255,255,0.7)', padding: '3px 10px', borderRadius: 6, fontWeight: 800, fontSize: 13, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
            {cargado ? `${partido.resultado.local} – ${partido.resultado.visitante}` : 'vs'}
          </span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{partido.visitante}</span>
          <Bandera codigo={partido.codigoVisitante} />
        </div>

        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16, flexShrink: 0, width: 18, textAlign: 'center' }}>{editando ? '−' : '+'}</span>
      </button>

      {/* Formulario expandido */}
      {editando && (
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(255,255,255,0.015)' }}>

          {/* Scoreboard */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, background: '#020810', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
              <Bandera codigo={partido.codigoLocal} size={26} />
              <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{partido.local}</span>
              <Stepper valor={golLocal} onChange={setGolLocal} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 22, fontWeight: 300 }}>:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-start' }}>
              <Stepper valor={golVisitante} onChange={setGolVisitante} />
              <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{partido.visitante}</span>
              <Bandera codigo={partido.codigoVisitante} size={26} />
            </div>
          </div>

          {/* Opciones eliminación */}
          {esEliminacion && (
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.35)' }}>Definición</span>
              <div style={{ display: 'flex', gap: 20 }}>
                {[['tiempoExtra', tiempoExtra, setTiempoExtra, 'Tiempo extra'], ['penales', conPenales, setConPenales, 'Penales']].map(([key, val, setter, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} style={{ accentColor: '#c0392b', width: 15, height: 15 }} />
                    {label}
                  </label>
                ))}
              </div>
              {conPenales && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                  <Stepper valor={penalLocal} onChange={setPenalLocal} />
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>—</span>
                  <Stepper valor={penalVisitante} onChange={setPenalVisitante} />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>(penales)</span>
                </div>
              )}
              {penalesEnEmpate && <p style={{ color: '#e74c3c', fontSize: 12, margin: 0 }}>⚠ Los penales no pueden empatar.</p>}
            </div>
          )}

          {/* Goleadores */}
          <FormularioGol golLocal={partido.local} golVisitante={partido.visitante} goles={goles} onAgregar={g => setGoles([...goles, g])} onQuitar={i => setGoles(goles.filter((_, idx) => idx !== i))} />

          {/* Botones acción */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button
              type="button"
              disabled={penalesEnEmpate}
              onClick={confirmar}
              style={{
                background: penalesEnEmpate ? 'rgba(192,57,43,0.3)' : '#c0392b',
                border: 'none', borderRadius: 9, padding: '10px 22px',
                color: '#fff', fontWeight: 700, fontSize: 14, cursor: penalesEnEmpate ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', letterSpacing: '0.3px',
                boxShadow: penalesEnEmpate ? 'none' : '0 3px 14px rgba(192,57,43,0.4)',
                transition: 'filter 0.15s',
              }}
              onMouseEnter={e => { if (!penalesEnEmpate) e.currentTarget.style.filter = 'brightness(1.12)' }}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}
            >
              {cargado ? 'Actualizar resultado' : 'Confirmar resultado'}
            </button>
            {cargado && (
              <button
                type="button"
                onClick={() => { onBorrar(partido.id); setEditando(false) }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 9, padding: '10px 18px', color: 'rgba(255,255,255,0.55)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(192,57,43,0.6)'; e.currentTarget.style.color = '#e74c3c' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
              >
                Borrar resultado
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const FILTROS = ['Todos', 'Grupos', 'Playoffs']

function BotonHerramienta({ onClick, color, children, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
        borderRadius: 10, fontWeight: 700, fontSize: 13.5, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', border: `1px solid ${color}55`, background: `${color}1a`,
        color, transition: 'filter 0.15s, transform 0.1s', opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.25)' }}
      onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
    >
      {children}
    </button>
  )
}

function PanelAdmin() {
  const { usuario } = useAuth()
  const { partidos, cargarResultado, borrarResultado, reiniciarTorneo, generarTorneoAleatorio, exportarTorneo, importarTorneo } = useTorneo()
  const [filtro, setFiltro] = useState('Todos')
  const [mensaje, setMensaje] = useState('')
  const inputArchivoRef = useRef(null)

  function manejarAleatorio() {
    const ok = confirm('Esto va a generar resultados aleatorios para TODO el torneo (grupos y eliminación directa), reemplazando lo que haya cargado. ¿Continuar?')
    if (!ok) return
    generarTorneoAleatorio()
    setMensaje('Se generaron resultados aleatorios para todo el torneo.')
  }

  function manejarExportar() {
    exportarTorneo()
  }

  function manejarImportarClick() {
    inputArchivoRef.current?.click()
  }

  async function manejarArchivoSeleccionado(e) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    try {
      await importarTorneo(archivo)
      setMensaje('Fixture importado correctamente.')
    } catch (err) {
      setMensaje(`Error al importar: ${err.message}`)
    } finally {
      e.target.value = ''
    }
  }

  const filtrados = useMemo(() => {
    if (filtro === 'Grupos')   return partidos.filter(p => p.fase?.startsWith('Grupo'))
    if (filtro === 'Playoffs') return partidos.filter(p => !p.fase?.startsWith('Grupo'))
    return partidos
  }, [filtro, partidos])

  const totalCargados = useMemo(() => partidos.filter(p => p.resultado).length, [partidos])
  const pct = partidos.length ? Math.round((totalCargados / partidos.length) * 100) : 0

  if (!usuario || usuario.rol !== 'admin') {
    return (
      <div style={{ maxWidth: 600, margin: '5rem auto', textAlign: 'center', padding: '0 2rem' }}>
        <span style={{ fontSize: 40, opacity: 0.4 }}>🔒</span>
        <h1 style={{ color: '#fff', margin: '1rem 0 0.5rem' }}>Panel de Administración</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>Esta sección es exclusiva para administradores. Iniciá sesión con una cuenta de admin para cargar resultados.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>

      {/* Encabezado */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#c0392b', display: 'block', marginBottom: 6 }}>Sala de control · Mundial 2026</span>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Panel de Administración</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 6, fontSize: 14 }}>Cargá resultados. Tablas, bracket y estadísticas se actualizan solos.</p>
        </div>
        {/* Contador de progreso */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, minWidth: 160 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <strong style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{totalCargados}</strong>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>/ {partidos.length}</span>
          </div>
          <div style={{ width: 160, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: '#2ecc71', borderRadius: 99, transition: 'width 0.4s', minWidth: pct > 0 ? 4 : 0 }} />
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>partidos cargados</span>
        </div>
      </div>

      {/* Herramientas: aleatorio, exportar, importar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <BotonHerramienta onClick={manejarAleatorio} color="#9b59b6">
          🎲 Aleatorio
        </BotonHerramienta>
        <BotonHerramienta onClick={manejarExportar} color="#2ecc71">
          ⬇ Exportar
        </BotonHerramienta>
        <BotonHerramienta onClick={manejarImportarClick} color="#3498db">
          ⬆ Importar
        </BotonHerramienta>
        <input
          ref={inputArchivoRef}
          type="file"
          accept="application/json"
          onChange={manejarArchivoSeleccionado}
          style={{ display: 'none' }}
        />
      </div>

      {mensaje && (
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px' }}>
          {mensaje}
        </p>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTROS.map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              padding: '8px 18px', borderRadius: 99, fontWeight: 600, fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              background: filtro === f ? '#c0392b' : 'rgba(255,255,255,0.05)',
              border: filtro === f ? '1px solid #c0392b' : '1px solid rgba(255,255,255,0.1)',
              color: filtro === f ? '#fff' : 'rgba(255,255,255,0.6)',
            }}
          >{f}</button>
        ))}
        <button
          onClick={() => confirm('¿Reiniciar todos los resultados?') && reiniciarTorneo()}
          style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 99, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#e74c3c'; e.currentTarget.style.borderColor = 'rgba(192,57,43,0.5)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
        >↺ Reiniciar</button>
      </div>

      {/* Lista de partidos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtrados.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
            No hay partidos generados para esta fase todavía.
          </p>
        )}
        {filtrados.map(p => (
          <FilaPartido key={p.id} partido={p} onCargar={cargarResultado} onBorrar={borrarResultado} />
        ))}
      </div>
    </div>
  )
}

export default PanelAdmin
