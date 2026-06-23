import { useState } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import { sedes } from '../data/sedes'
import { useTorneo } from '../context/TorneoContext'
import { BtnPredecir } from '../components/ModalPredecir'
import '../styles/inicio.css'

function Bandera({ codigo, size = 32 }) {
  const Flag = Flags[codigo]
  if (!Flag) return null
  return <Flag style={{ width: size, height: 'auto', borderRadius: '3px' }} />
}

function tiempoTranscurrido(fechaFin) {
  const diff = Math.floor((new Date() - new Date(fechaFin)) / 86400000)
  if (diff === 0) return 'hoy'
  if (diff === 1) return 'ayer'
  return `hace ${diff} días`
}

function formatFechaHora(horaUTC) {
  if (!horaUTC) return ''
  const d = new Date(horaUTC)
  const fecha = d.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' })
  const utc = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
  const local = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  return `${fecha} · ${utc} UTC · ${local} local`
}

function ModalSede({ sede, onCerrar }) {
  return (
    <div className="auth-modal-overlay" onClick={onCerrar}>
      <div className="sede-modal" onClick={e => e.stopPropagation()}>
        <div className="sede-modal-header">
          <img src={sede.foto} alt={sede.pais} className="sede-modal-foto" />
          <div className="sede-modal-titulo">
            <h2>Sedes de {sede.pais}</h2>
            <p>{sede.estadios.length} estadios</p>
          </div>
          <button className="sede-modal-cerrar" onClick={onCerrar}>✕</button>
        </div>
        <div className="sede-modal-lista">
          {sede.estadios.map((e, i) => (
            <div key={i} className="sede-estadio">
              <p className="estadio-nombre">🏟️ {e.nombre}</p>
              <p className="estadio-detalle">{e.ciudad} · {e.capacidad.toLocaleString()} esp.</p>
              {e.nota && <p className="estadio-nota">⭐ {e.nota}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CardSede({ sede }) {
  const [abierta, setAbierta] = useState(false)
  return (
    <>
      <div className="sede-card" onClick={() => setAbierta(true)}>
        <div className="sede-pais-badge">{sede.pais}</div>
        <img src={sede.foto} alt={sede.pais} className="sede-foto" />
        <div className="sede-info">
          <h3>Sedes de {sede.pais}</h3>
          <span className="sede-expandir">▼ Ver estadios</span>
        </div>
      </div>
      {abierta && <ModalSede sede={sede} onCerrar={() => setAbierta(false)} />}
    </>
  )
}

export default function Inicio() {
  const { partidos } = useTorneo()

  const ORDEN_RONDA = {
    final: 0,
    tercerPuesto: 1,
    semis: 2,
    cuartos: 3,
    octavos: 4,
    ronda32: 5,
    grupos: 6,
  }

  const jugados = partidos
    .filter(p => p.resultado !== null && p.fechaFin)
    .sort((a, b) => {
      const ra = ORDEN_RONDA[a.ronda] ?? 7
      const rb = ORDEN_RONDA[b.ronda] ?? 7
      if (ra !== rb) return ra - rb
      return new Date(b.fechaFin) - new Date(a.fechaFin)
    })
    .slice(0, 6)

  // En vivo
  const enVivo = partidos.filter(p => p.enVivo && !p.resultado)

  // Próximos: solo partidos sin resultado que tienen fecha/hora cargada manualmente por el admin
  const proximos = partidos
    .filter(p => p.resultado === null && !p.enVivo && p.horaUTC && p.horaManual && new Date(p.horaUTC) > new Date())
    .sort((a, b) => new Date(a.horaUTC) - new Date(b.horaUTC))
    .slice(0, 4)

  return (
    <div className="inicio">
      <section className="hero">
        <div className="hero-texto">
          <h1>Copa Mundial 2026</h1>
          <p className="hero-sub">Fixture oficial interactivo, simulador de partidos y estadísticas en tiempo real</p>
        </div>

        {enVivo.length > 0 && (
          <div className="hero-proximos">
            <div className="hero-prox-principal" style={{ borderColor: 'rgba(231,76,60,0.5)', background: 'rgba(10,18,28,0.95)' }}>
              <span className="proximo-badge" style={{ background: 'linear-gradient(90deg,#e74c3c,#c0392b)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulseRojo 1.2s infinite' }} />
                EN VIVO
              </span>
              <p className="proximo-fase">{enVivo[0].fase}</p>
              <div className="proximo-equipos">
                <div className="proximo-equipo">
                  <Bandera codigo={enVivo[0].codigoLocal} size={36} />
                  <span>{enVivo[0].local}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: 2, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                    {(enVivo[0].goles?.filter(g => g.equipo === enVivo[0].local).length) ?? 0}
                    {' – '}
                    {(enVivo[0].goles?.filter(g => g.equipo === enVivo[0].visitante).length) ?? 0}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '1.5px', color: '#e74c3c', textTransform: 'uppercase' }}>en vivo</span>
                </div>
                <div className="proximo-equipo">
                  <Bandera codigo={enVivo[0].codigoVisitante} size={36} />
                  <span>{enVivo[0].visitante}</span>
                </div>
              </div>

              {/* Goles en vivo izquierda/derecha */}
              {enVivo[0].goles?.length > 0 && (() => {
                const golesOrdenados = [...enVivo[0].goles].sort((a, b) => (a.minuto ?? 999) - (b.minuto ?? 999))
                const golesLocal = golesOrdenados.filter(g => g.equipo === enVivo[0].local)
                const golesVisitante = golesOrdenados.filter(g => g.equipo === enVivo[0].visitante)
                const maxFilas = Math.max(golesLocal.length, golesVisitante.length)
                return (
                  <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    width: '100%',
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.3)', marginBottom: 2, textAlign: 'center' }}>
                      Goles del partido
                    </span>
                    {Array.from({ length: maxFilas }).map((_, i) => {
                      const gl = golesLocal[i]
                      const gv = golesVisitante[i]
                      return (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                          {/* Gol local — izquierda */}
                          {gl ? (
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              justifyContent: 'flex-end',
                              background: 'rgba(255,255,255,0.05)',
                              borderRadius: 8, padding: '5px 10px',
                              borderRight: '2px solid rgba(231,76,60,0.4)',
                            }}>
                              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{gl.jugador}</span>
                              {gl.minuto != null && (
                                <span style={{ fontSize: 11, color: '#e74c3c', fontWeight: 700, background: 'rgba(231,76,60,0.15)', padding: '1px 5px', borderRadius: 4 }}>{gl.minuto}'</span>
                              )}
                              <span style={{ fontSize: 13 }}>⚽</span>
                            </div>
                          ) : (
                            <div />
                          )}
                          {/* Gol visitante — derecha */}
                          {gv ? (
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              justifyContent: 'flex-start',
                              background: 'rgba(255,255,255,0.05)',
                              borderRadius: 8, padding: '5px 10px',
                              borderLeft: '2px solid rgba(231,76,60,0.4)',
                            }}>
                              <span style={{ fontSize: 13 }}>⚽</span>
                              {gv.minuto != null && (
                                <span style={{ fontSize: 11, color: '#e74c3c', fontWeight: 700, background: 'rgba(231,76,60,0.15)', padding: '1px 5px', borderRadius: 4 }}>{gv.minuto}'</span>
                              )}
                              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{gv.jugador}</span>
                            </div>
                          ) : (
                            <div />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}

              {enVivo.length > 1 && (
                <div className="hero-prox-mini-lista" style={{ marginTop: '0.6rem' }}>
                  {enVivo.slice(1).map(p => (
                    <div key={p.id} className="hero-prox-mini-item" style={{ borderColor: 'rgba(231,76,60,0.25)' }}>
                      <div className="hero-prox-mini-equipos">
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e74c3c', animation: 'pulseRojo 1.2s infinite', display: 'inline-block' }} />
                        <Bandera codigo={p.codigoLocal} size={16} />
                        <span>{p.local}</span>
                        <span className="hero-prox-mini-vs">vs</span>
                        <span>{p.visitante}</span>
                        <Bandera codigo={p.codigoVisitante} size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {proximos.length > 0 && (
          <div className="hero-proximos">
            {/* Próximo más reciente - destacado */}
            <div className="hero-prox-principal">
              <span className="proximo-badge">Próximo</span>
              <p className="proximo-fase">{proximos[0].fase}</p>
              <div className="proximo-equipos">
                <div className="proximo-equipo">
                  <Bandera codigo={proximos[0].codigoLocal} size={36} />
                  <span>{proximos[0].local}</span>
                </div>
                <span className="vs">VS</span>
                <div className="proximo-equipo">
                  <Bandera codigo={proximos[0].codigoVisitante} size={36} />
                  <span>{proximos[0].visitante}</span>
                </div>
              </div>
              <p className="proximo-hora">{formatFechaHora(proximos[0].horaUTC)}</p>
              <BtnPredecir partido={proximos[0]} />
            </div>

            {/* Próximos 3 siguientes - mini */}
            {proximos.slice(1).length > 0 && (
              <div className="hero-prox-mini-lista">
                {proximos.slice(1).map(p => (
                  <div key={p.id} className="hero-prox-mini-item">
                    <div className="hero-prox-mini-equipos">
                      <Bandera codigo={p.codigoLocal} size={16} />
                      <span>{p.local}</span>
                      <span className="hero-prox-mini-vs">vs</span>
                      <span>{p.visitante}</span>
                      <Bandera codigo={p.codigoVisitante} size={16} />
                    </div>
                    <span className="hero-prox-mini-hora">{formatFechaHora(p.horaUTC)}</span>
                    <BtnPredecir partido={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>


      {/* Últimos resultados */}
      {jugados.length > 0 && (
        <section className="ultimos">
          <h2>Últimos resultados</h2>
          <div className="ultimos-grid">
            {jugados.map(p => (
              <div key={p.id} className="partido-card">
                <span className="partido-fase">{p.fase}</span>
                <div className="partido-resultado">
                  <div className="equipo">
                    <Bandera codigo={p.codigoLocal} size={70} />
                    <span>{p.local}</span>
                  </div>
                  <span className="marcador">{p.resultado.local} - {p.resultado.visitante}</span>
                  <div className="equipo equipo-derecha">
                    <Bandera codigo={p.codigoVisitante} size={70} />
                    <span>{p.visitante}</span>
                  </div>
                </div>
                <p className="partido-cuando">Finalizó {tiempoTranscurrido(p.fechaFin)}</p>
                {p.goles?.length > 0 && (() => {
                  const golesOrdenados = [...p.goles].sort((a, b) => (a.minuto ?? 999) - (b.minuto ?? 999))
                  const golesLocal = golesOrdenados.filter(g => g.equipo === p.local)
                  const golesVisitante = golesOrdenados.filter(g => g.equipo === p.visitante)
                  const maxFilas = Math.max(golesLocal.length, golesVisitante.length)
                  return (
                    <div className="partido-goles" style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: '0.5rem' }}>
                      {Array.from({ length: maxFilas }).map((_, i) => {
                        const gl = golesLocal[i]
                        const gv = golesVisitante[i]
                        return (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                            {gl ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{gl.jugador}</span>
                                {gl.minuto != null && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{gl.minuto}'</span>}
                                <span style={{ fontSize: 12 }}>⚽</span>
                              </div>
                            ) : <div />}
                            {gv ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-start' }}>
                                <span style={{ fontSize: 12 }}>⚽</span>
                                {gv.minuto != null && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{gv.minuto}'</span>}
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{gv.jugador}</span>
                              </div>
                            ) : <div />}
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="sedes">
        <h2>Sedes Oficiales del Mundial 2026</h2>
        <p className="sedes-sub">Conoce los imponentes escenarios de Norteamérica donde se escribirá la historia.</p>
        <div className="sedes-grid">
          {sedes.map((s, i) => <CardSede key={i} sede={s} />)}
        </div>
      </section>
    </div>
  )
}
