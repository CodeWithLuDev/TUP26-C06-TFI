import * as Flags from 'country-flag-icons/react/3x2'
import { equipos, grupos } from '../data/equipos'
import '../styles/equipos.css'

function Bandera({ codigo }) {
  const Flag = Flags[codigo]
  if (!Flag) return <span className="eq-bandera-fallback">🏳</span>
  return <Flag className="eq-bandera" />
}

function TarjetaEquipo({ equipo }) {
  return (
    <div className="eq-tarjeta">
      <div className="eq-bandera-wrap">
        <Bandera codigo={equipo.codigo} />
      </div>
      <span className="eq-nombre">{equipo.nombre}</span>
    </div>
  )
}

function GrupoCard({ letra }) {
  const miembros = equipos.filter(e => e.grupo === letra)

  return (
    <div className="eq-grupo">
      <div className="eq-grupo-header">
        <span className="eq-grupo-letra">Grupo {letra}</span>
      </div>
      <div className="eq-grupo-equipos">
        {miembros.map(eq => (
          <TarjetaEquipo key={eq.id} equipo={eq} />
        ))}
      </div>
    </div>
  )
}

function Equipos() {
  return (
    <div className="equipos-page">
      <h1>Equipos participantes</h1>
      <p className="equipos-sub">32 selecciones divididas en 8 grupos</p>

      <div className="eq-grid">
        {grupos.map(g => (
          <GrupoCard key={g} letra={g} />
        ))}
      </div>
    </div>
  )
}

export default Equipos
