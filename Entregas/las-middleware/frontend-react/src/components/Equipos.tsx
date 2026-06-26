import { useState, useEffect } from 'react';
import { api } from '../api';
import { GRUPOS } from '../types';
import type { Team } from '../types';

export default function Equipos() {
  const [equipos, setEquipos] = useState<Team[]>([]);

  useEffect(() => {
    api.equipos().then(setEquipos).catch(console.error);
  }, []);

  return (
    <div className="equipos-page">
      <h2>Equipos Participantes</h2>
      <div className="equipos-count">
        <span>{equipos.length} equipos · 12 grupos · 48 selecciones</span>
      </div>
      {GRUPOS.map(grupo => {
        const equiposGrupo = equipos.filter(e => e.group_letter === grupo);
        if (!equiposGrupo.length) return null;
        return (
          <div key={grupo} className="grupo-equipos">
            <h3>Grupo {grupo}</h3>
            <div className="equipos-grid">
              {equiposGrupo.map(eq => (
                <div key={eq.id} className="equipo-card">
                  <div className="equipo-bandera">
                    <img src={`/assets/flags/${eq.id}.png`} alt={eq.name} loading="lazy" />
                  </div>
                  <span className="equipo-nombre">{eq.flag} {eq.name}</span>
                  <span className="equipo-grupo">Grupo {eq.group_letter}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
