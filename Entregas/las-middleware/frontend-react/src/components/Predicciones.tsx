import { useState, useEffect } from 'react';
import { api } from '../api';
import type { MatchData, Team } from '../types';

type Prediccion = { local: number; visitor: number };

const STORAGE_KEY = 'predicciones_mundial';

function formatearFecha(f: string): string {
  if (!f) return '';
  const [y, m, d] = f.split('-');
  return `${d}/${m}/${y}`;
}

function calcPuntos(pred: Prediccion, localG: number, visitorG: number): number {
  if (pred.local === localG && pred.visitor === visitorG) return 10;
  const predDif = pred.local - pred.visitor;
  const realDif = localG - visitorG;
  if ((predDif > 0 && realDif > 0) || (predDif < 0 && realDif < 0)) return 5;
  if (predDif === 0 && realDif === 0) return 5;
  return 0;
}

export default function Predicciones() {
  const [showAnim, setShowAnim] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShowAnim(false), 3000); return () => clearTimeout(t); }, []);
  const [partidos, setPartidos] = useState<MatchData[]>([]);
  const [teamMap, setTeamMap] = useState<Map<string, Team>>(new Map());
  const [predicciones, setPredicciones] = useState<Record<string, Prediccion>>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  });
  const [resultados, setResultados] = useState<Record<string, Prediccion>>({});
  const [cargando, setCargando] = useState<string | null>(null);
  const [diceRolling, setDiceRolling] = useState(false);

  const cargarResultado = async (id: string) => {
    const r = resultados[id];
    if (!r) return;
    setCargando(id);
    try {
      await api.cargarResultado(id, { local_goals: r.local, visitor_goals: r.visitor, goals: [] });
      const p = await api.partidos();
      setPartidos(p);
      setResultados(prev => { const n = { ...prev }; delete n[id]; return n; });
    } catch (e) {
      alert('Error al guardar resultado');
      console.error(e);
    } finally {
      setCargando(null);
    }
  };

  useEffect(() => {
    Promise.all([api.partidos(), api.equipos()])
      .then(([p, e]) => {
        setPartidos(p);
        setTeamMap(new Map(e.map(t => [t.id, t])));
      })
      .catch(console.error);
  }, []);

  const pendientes = partidos.filter(p => p.local_team_id && p.visitor_team_id && p.local_goals == null);
  const jugados = partidos.filter(p => p.local_team_id && p.visitor_team_id && p.local_goals != null);

  const setPred = (id: string, field: 'local' | 'visitor', val: number) => {
    setPredicciones(prev => {
      const next = { ...prev, [id]: { ...prev[id], [field]: val } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const totalPuntos = jugados.reduce((sum, p) => {
    const pred = predicciones[p.id];
    if (!pred) return sum;
    return sum + calcPuntos(pred, p.local_goals!, p.visitor_goals!);
  }, 0);

  const maxPosible = jugados.length * 10;

  const sugerirResultados = () => {
    setDiceRolling(true);
    setTimeout(() => setDiceRolling(false), 600);
    const nuevas: Record<string, Prediccion> = { ...predicciones };
    pendientes.forEach(p => {
      const gLocal = Math.floor(Math.random() * 4);
      const gVis = Math.floor(Math.random() * 4);
      nuevas[p.id] = { local: gLocal, visitor: gVis };
    });
    setPredicciones(nuevas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevas));
  };

  return (
    <div className="predicciones-page">
      {showAnim && <div className="ball-overlay"><span className="ball-emoji">⚽</span></div>}
      <h2>Predicciones</h2>
      <p className="predicciones-subtitulo">
        Pronosticá los resultados de los partidos pendientes
      </p>

      {jugados.length > 0 && (
        <>
          <div className="predicciones-aciertos">
            <span className="aciertos-label">Puntos:</span>
            <span className="aciertos-num">{totalPuntos}/{maxPosible}</span>
            <div className="aciertos-bar">
              <div className="aciertos-fill" style={{ width: maxPosible ? `${(totalPuntos / maxPosible) * 100}%` : '0%' }} />
            </div>
          </div>
          <p className="predicciones-leyenda">
            10 pts por resultado exacto · 5 pts por acertar ganador o empate
          </p>
        </>
      )}

      {pendientes.length > 0 && (
        <button className="btn-sugerir" onClick={sugerirResultados}><span className={`dice-icon${diceRolling ? ' rolling' : ''}`}>🎲</span> Sugerir resultados</button>
      )}

      <div className="predicciones-section">
        <h3>Partidos Pendientes</h3>
        {pendientes.length === 0 ? (
          <p className="predicciones-vacio">No hay partidos pendientes</p>
        ) : (
          <div className="predicciones-lista">
            {pendientes.map(p => {
              const loc = p.local_team_id ? teamMap.get(p.local_team_id) : null;
              const vis = p.visitor_team_id ? teamMap.get(p.visitor_team_id) : null;
              const pred = predicciones[p.id];
              return (
                <div key={p.id} className="prediccion-card">
                  <div className="prediccion-info">
                    {p.date && <span className="prediccion-fecha">{formatearFecha(p.date)}</span>}
                    {p.group_letter && <span className="prediccion-ronda">Grupo {p.group_letter}</span>}
                    {p.ronda && <span className="prediccion-ronda">{p.ronda}</span>}
                  </div>
                  <div className="prediccion-equipos">
                    <div className="prediccion-equipo">
                      {loc && <img src={`/assets/flags/${loc.id}.png`} alt="" className="bandera-med" />}
                      {loc?.name || '---'}
                    </div>
                    <div className="prediccion-inputs">
                      <input
                        type="number" min="0" max="20" value={pred?.local ?? ''}
                        onChange={e => setPred(p.id, 'local', parseInt(e.target.value) || 0)}
                        placeholder="?"
                      />
                      <span className="prediccion-vs">-</span>
                      <input
                        type="number" min="0" max="20" value={pred?.visitor ?? ''}
                        onChange={e => setPred(p.id, 'visitor', parseInt(e.target.value) || 0)}
                        placeholder="?"
                      />
                    </div>
                    <div className="prediccion-equipo">
                      {vis && <img src={`/assets/flags/${vis.id}.png`} alt="" className="bandera-med" />}
                      {vis?.name || '---'}
                    </div>
                  </div>
                  <div className="prediccion-resultado-form">
                    <span className="resultado-form-label">Cargar resultado real:</span>
                    <div className="resultado-form-inputs">
                      <input
                        type="number" min="0" max="20"
                        value={resultados[p.id]?.local ?? ''}
                        onChange={e => setResultados(prev => ({ ...prev, [p.id]: { ...prev[p.id], local: parseInt(e.target.value) || 0 } }))}
                        placeholder="0"
                      />
                      <span className="prediccion-vs">-</span>
                      <input
                        type="number" min="0" max="20"
                        value={resultados[p.id]?.visitor ?? ''}
                        onChange={e => setResultados(prev => ({ ...prev, [p.id]: { ...prev[p.id], visitor: parseInt(e.target.value) || 0 } }))}
                        placeholder="0"
                      />
                      <button className="btn-guardar-resultado" onClick={() => cargarResultado(p.id)} disabled={cargando === p.id}>
                        {cargando === p.id ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="predicciones-section">
        <h3>Resultados Reales</h3>
        {jugados.length === 0 ? (
          <p className="predicciones-vacio">No hay resultados aún</p>
        ) : (
          <div className="predicciones-lista">
            {jugados.slice().reverse().map(p => {
              const loc = p.local_team_id ? teamMap.get(p.local_team_id) : null;
              const vis = p.visitor_team_id ? teamMap.get(p.visitor_team_id) : null;
              const pred = predicciones[p.id];
              const puntos = pred ? calcPuntos(pred, p.local_goals!, p.visitor_goals!) : 0;
              return (
                <div key={p.id} className={`prediccion-card ${puntos > 0 ? (puntos === 10 ? 'acertado' : 'puntaje-medio') : ''}`}>
                  <div className="prediccion-info">
                    {p.date && <span className="prediccion-fecha">{formatearFecha(p.date)}</span>}
                    {p.group_letter && <span className="prediccion-ronda">Grupo {p.group_letter}</span>}
                    {p.ronda && <span className="prediccion-ronda">{p.ronda}</span>}
                    {puntos > 0 && <span className="prediccion-badge">+{puntos} pts</span>}
                  </div>
                  <div className="prediccion-equipos resultado">
                    <div className="prediccion-equipo">
                      {loc && <img src={`/assets/flags/${loc.id}.png`} alt="" className="bandera-med" />}
                      {loc?.name || '---'}
                    </div>
                    <div className="prediccion-resultado">
                      <span className="resultado-real">{p.local_goals} - {p.visitor_goals}</span>
                      {pred && (
                        <span className="resultado-pred">
                          Tu pronóstico: {pred.local} - {pred.visitor}
                        </span>
                      )}
                    </div>
                    <div className="prediccion-equipo">
                      {vis && <img src={`/assets/flags/${vis.id}.png`} alt="" className="bandera-med" />}
                      {vis?.name || '---'}
                    </div>
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
