import { useState, useEffect } from 'react';
import { api } from '../api';
import { GRUPOS } from '../types';
import type { StandingRow } from '../types';

export default function Grupos() {
  const [posicionesMap, setPosicionesMap] = useState<Record<string, StandingRow[]>>({});

  useEffect(() => {
    Promise.all(GRUPOS.map(g => api.posiciones(g).then(d => ({ grupo: g, data: d }))))
      .then(results => {
        const map: Record<string, StandingRow[]> = {};
        results.forEach(r => { map[r.grupo] = r.data; });
        setPosicionesMap(map);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="grupos-page">
      <h2>Fase de Grupos</h2>
      <div className="grupos-container">
        {GRUPOS.map(grupo => {
          const posiciones = posicionesMap[grupo] || [];
          if (!posiciones.length) {
            return (
              <div key={grupo} className="grupo-card">
                <h3 className="grupo-titulo">Grupo {grupo}</h3>
                <p className="grupo-vacio">Sin datos</p>
              </div>
            );
          }
          return (
            <div key={grupo} className="grupo-card">
              <h3 className="grupo-titulo">Grupo {grupo}</h3>
              <table className="tabla-posiciones">
                <thead>
                  <tr>
                    <th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th>
                    <th>GF</th><th>GC</th><th>DG</th><th>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {posiciones.map((eq, i) => (
                    <tr key={eq.id} className={i < 2 ? 'clasificado' : ''}>
                      <td>{i + 1}</td>
                      <td className="equipo-cell">
                        <img src={`/assets/flags/${eq.id}.png`} alt={eq.name} className="bandera-img" />
                        {eq.name}
                      </td>
                      <td>{eq.pj}</td><td>{eq.pg}</td><td>{eq.pe}</td><td>{eq.pp}</td>
                      <td>{eq.gf}</td><td>{eq.gc}</td><td>{eq.dg}</td>
                      <td className="pts">{eq.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="grupo-legend">
                <span className="legend-item"><span className="legend-dot verde"></span> Clasifica</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
