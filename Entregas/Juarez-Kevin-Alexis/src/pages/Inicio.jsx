import * as Flags from 'country-flag-icons/react/3x2'
import { partidos } from '../data/partidos'
import '../styles/inicio.css'

function Bandera({ codigo, size = 32 }) {
  const Flag = Flags[codigo]
  if (!Flag) return null
  return <Flag style={{ width: size, height: 'auto', borderRadius: '3px' }} />
}

function tiempoTranscurrido(fechaFin) {
  const ahora = new Date()
  const fin = new Date(fechaFin)
  const diffMs = ahora - fin
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDias === 0) return 'hoy'
  if (diffDias === 1) return 'ayer'
  return `hace ${diffDias} días`
}

function horaLocal(horaUTC) {
  const fecha = new Date(horaUTC)
  return fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' (hora local)'
}

function Inicio() {
  const jugados = partidos.filter(p => p.resultado !== null)
  const proximos = partidos.filter(p => p.resultado === null)
  const ultimosCuatro = jugados.slice(-4).reverse()
  const proximoPartido = proximos[0]

  return (
    <div className="inicio">

      {/* Hero section */}
      <section className="hero">
        <div className="hero-texto">
          <h1>Copa Mundial 2026</h1>
          <p className="hero-sub">Fixture oficial interactivo, simulador de partidos y estadísticas en tiempo real</p>
        </div>

        {proximoPartido && (
          <div className="proximo-partido">
            <span className="proximo-badge">Próximo partido</span>
            <p className="proximo-fase">{proximoPartido.fase}</p>
            <div className="proximo-equipos">
              <div className="proximo-equipo">
                <Bandera codigo={proximoPartido.codigoLocal} size={40} />
                <span>{proximoPartido.local}</span>
              </div>
              <span className="vs">VS</span>
              <div className="proximo-equipo">
                <Bandera codigo={proximoPartido.codigoVisitante} size={40} />
                <span>{proximoPartido.visitante}</span>
              </div>
            </div>
            <p className="proximo-fecha">{proximoPartido.fecha}</p>
            <p className="proximo-hora">{horaLocal(proximoPartido.horaUTC)}</p>
          </div>
        )}
      </section>

      {/* Últimos partidos */}
      <section className="ultimos">
        <h2>Últimos resultados</h2>
        <div className="ultimos-grid">
          {ultimosCuatro.map(p => (
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
              {p.goles.length > 0 && (
                <div className="partido-goles">
                  {p.goles.map((g, i) => (
                    <p key={i} className="gol">⚽ {g.jugador} {g.minuto}' {g.asistencia ? `(asist. ${g.asistencia})` : ''}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Inicio