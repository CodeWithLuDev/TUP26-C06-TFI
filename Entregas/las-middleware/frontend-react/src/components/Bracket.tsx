import { useState, useEffect } from 'react';
import { api } from '../api';
import type { BracketMatch, Team } from '../types';

const fases = [
  { key: 'r32', titulo: 'Dieciseisavos' },
  { key: 'r16', titulo: 'Octavos de Final' },
  { key: 'qf', titulo: 'Cuartos de Final' },
  { key: 'sf', titulo: 'Semifinales' },
  { key: 'final', titulo: 'Final' },
];

export default function Bracket() {
  const [bracketData, setBracketData] = useState<BracketMatch[]>([]);
  const [teamMap, setTeamMap] = useState<Map<string, Team>>(new Map());

  useEffect(() => {
    Promise.all([api.bracket(), api.equipos()])
      .then(([b, e]) => {
        setBracketData(b);
        setTeamMap(new Map(e.map(t => [t.id, t])));
      })
      .catch(console.error);
  }, []);

  const getWinner = (m: BracketMatch): { local: boolean; visitor: boolean } => {
    if (m.local_goals == null || m.visitor_goals == null) return { local: false, visitor: false };
    if (m.penales_local != null && m.local_goals === m.visitor_goals) {
      return { local: m.penales_local > (m.penales_visitor || 0), visitor: (m.penales_visitor || 0) > m.penales_local };
    }
    return { local: m.local_goals > m.visitor_goals, visitor: m.visitor_goals > m.local_goals };
  };

  const tp = bracketData.filter(m => m.phase === 'tp');

  return (
    <div className="bracket-page">
      <h2>Fase Eliminatoria</h2>
      <div className="bracket-container">
        {fases.map(({ key, titulo }) => {
          const matches = bracketData.filter(m => m.phase === key);
          if (!matches.length) return null;
          return (
            <div key={key} className="bracket-columna">
              <h3 className="bracket-titulo">{titulo}</h3>
              {matches.map(m => {
                const localEq = m.local_team_id ? teamMap.get(m.local_team_id) : null;
                const visEq = m.visitor_team_id ? teamMap.get(m.visitor_team_id) : null;
                const { local: ganLocal, visitor: ganVisit } = getWinner(m);
                return (
                  <div key={m.id} className="bracket-match">
                    <div className={`match-equipo ${ganLocal ? 'ganador' : ''}`}>
                      <span className="match-nombre">
                        {localEq ? <img src={`/assets/flags/${localEq.id}.png`} alt="" className="bandera-peq" /> : null}
                        {localEq?.name || '---'}
                      </span>
                      {m.local_goals != null && <span className="match-goles">{m.local_goals}</span>}
                    </div>
                    <div className={`match-equipo ${ganVisit ? 'ganador' : ''}`}>
                      <span className="match-nombre">
                        {visEq ? <img src={`/assets/flags/${visEq.id}.png`} alt="" className="bandera-peq" /> : null}
                        {visEq?.name || '---'}
                      </span>
                      {m.visitor_goals != null && <span className="match-goles">{m.visitor_goals}</span>}
                    </div>
                    {m.penales_local != null && (
                      <div className="match-penales">Penales: {m.penales_local}-{m.penales_visitor}</div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
        {tp.length > 0 && (
          <div className="bracket-columna">
            <h3 className="bracket-titulo tercer-puesto">Tercer Puesto</h3>
            {tp.map(m => {
              const localEq = m.local_team_id ? teamMap.get(m.local_team_id) : null;
              const visEq = m.visitor_team_id ? teamMap.get(m.visitor_team_id) : null;
              return (
                <div key={m.id} className="bracket-match">
                  <div className={`match-equipo ${(m.local_goals ?? 0) > (m.visitor_goals ?? 0) ? 'ganador' : ''}`}>
                    <span className="match-nombre">
                      {localEq ? <img src={`/assets/flags/${localEq.id}.png`} alt="" className="bandera-peq" /> : null}
                      {localEq?.name || '---'}
                    </span>
                    {m.local_goals != null && <span className="match-goles">{m.local_goals}</span>}
                  </div>
                  <div className={`match-equipo ${(m.visitor_goals ?? 0) > (m.local_goals ?? 0) ? 'ganador' : ''}`}>
                    <span className="match-nombre">
                      {visEq ? <img src={`/assets/flags/${visEq.id}.png`} alt="" className="bandera-peq" /> : null}
                      {visEq?.name || '---'}
                    </span>
                    {m.visitor_goals != null && <span className="match-goles">{m.visitor_goals}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
