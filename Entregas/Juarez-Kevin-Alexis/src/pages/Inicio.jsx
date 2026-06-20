import { useState } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import { sedes } from '../data/sedes'
import { useTorneo } from '../context/TorneoContext'
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
  return d.toLocaleString('es-AR', {
    weekday: 'short', day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit',
  }) + ' hs'
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

  // Próximos: solo partidos sin resultado que tienen fecha/hora cargada manualmente
  const proximos = partidos
    .filter(p => p.resultado === null && p.horaUTC && p.horaManual)
    .sort((a, b) => new Date(a.horaUTC) - new Date(b.horaUTC))
    .slice(0, 3)

  return (
    <div className="inicio">
      <section className="hero">
        <div className="hero-texto">
          <h1>Copa Mundial 2026</h1>
          <p className="hero-sub">Fixture oficial interactivo, simulador de partidos y estadísticas en tiempo real</p>
        </div>
      </section>

      {/* Próximos partidos — solo si el admin cargó fecha/hora */}
      {proximos.length > 0 && (
        <section className="proximos-section">
          <h2>Próximos partidos</h2>
          <div className="proximos-grid">
            {proximos.map(p => (
              <div key={p.id} className="proximo-card">
                <span className="proximo-badge">Próximo</span>
                <p className="proximo-fase">{p.fase}</p>
                <div className="proximo-equipos">
                  <div className="proximo-equipo">
                    <Bandera codigo={p.codigoLocal} size={36} />
                    <span>{p.local}</span>
                  </div>
                  <span className="vs">VS</span>
                  <div className="proximo-equipo">
                    <Bandera codigo={p.codigoVisitante} size={36} />
                    <span>{p.visitante}</span>
                  </div>
                </div>
                <p className="proximo-hora">{formatFechaHora(p.horaUTC)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

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
                {p.goles?.length > 0 && (
                  <div className="partido-goles">
                    {p.goles.map((g, i) => (
                      <p key={i} className="gol">⚽ {g.jugador} {g.minuto ? `${g.minuto}'` : ''} {g.asistencia ? `(asist. ${g.asistencia})` : ''}</p>
                    ))}
                  </div>
                )}
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
