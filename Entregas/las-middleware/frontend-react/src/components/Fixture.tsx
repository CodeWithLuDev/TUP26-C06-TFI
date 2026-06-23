import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import type { MatchData, Team, GoalData, ResultPayload } from '../types';

type Filtro = 'todos' | 'grupos' | 'r32' | 'r16' | 'qf' | 'sf' | 'final';

const filtros: { key: Filtro; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'grupos', label: 'Fase de Grupos' },
  { key: 'r32', label: 'Dieciseisavos' },
  { key: 'r16', label: 'Octavos' },
  { key: 'qf', label: 'Cuartos' },
  { key: 'sf', label: 'Semifinales' },
  { key: 'final', label: 'Final' },
];

function formatearFecha(f: string): string {
  if (!f) return '';
  const [y, m, d] = f.split('-');
  return `${d}/${m}/${y}`;
}

function agrupar(partidos: MatchData[]): { titulo: string; partidos: MatchData[] }[] {
  const map = new Map<string, MatchData[]>();
  partidos.forEach(p => {
    const key = p.phase === 'grupos'
      ? `Grupo ${p.group_letter} - Jornada ${p.jornada || 1}`
      : p.ronda || p.phase;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  });
  return Array.from(map.entries()).map(([titulo, pts]) => ({ titulo, partidos: pts }));
}

export default function Fixture() {
  const [partidos, setPartidos] = useState<MatchData[]>([]);
  const [teamMap, setTeamMap] = useState<Map<string, Team>>(new Map());
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [modalMatch, setModalMatch] = useState<MatchData | null>(null);

  useEffect(() => {
    Promise.all([api.partidos(), api.equipos()])
      .then(([p, e]) => {
        setPartidos(p);
        setTeamMap(new Map(e.map(t => [t.id, t])));
      })
      .catch(console.error);
  }, []);

  const cargarPartidos = useCallback(async () => {
    const p = await api.partidos();
    setPartidos(p);
  }, []);

  const filtrados = filtro === 'todos'
    ? partidos
    : partidos.filter(p => filtro === 'grupos' ? p.phase === 'grupos' : p.phase === filtro);

  const grupos = agrupar(filtrados);

  const local = modalMatch?.local_team_id ? teamMap.get(modalMatch.local_team_id) : null;
  const vis = modalMatch?.visitor_team_id ? teamMap.get(modalMatch.visitor_team_id) : null;
  const esEliminatoria = modalMatch?.phase !== 'grupos';

  return (
    <div className="fixture-page">
      <h2>Cargar Resultados</h2>

      <div className="fixture-filtros">
        {filtros.map(f => (
          <button
            key={f.key}
            className={`filtro-btn ${filtro === f.key ? 'activo' : ''}`}
            onClick={() => setFiltro(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="fixture-lista">
        {grupos.map(({ titulo, partidos: pts }) => (
          <div key={titulo} className="fixture-bloque">
            <h4 className="fixture-bloque-titulo">{titulo}</h4>
            {pts.map(p => {
              const loc = p.local_team_id ? teamMap.get(p.local_team_id) : null;
              const vis = p.visitor_team_id ? teamMap.get(p.visitor_team_id) : null;
              const disponible = !!p.local_team_id && !!p.visitor_team_id;
              const tieneResultado = p.local_goals != null;
              return (
                <div key={p.id} className="fixture-partido">
                  <div className="partido-info">
                    {p.date && <span className="partido-fecha">{formatearFecha(p.date)} {p.time || ''}</span>}
                    {p.group_letter && <span className="partido-ronda">Grupo {p.group_letter}</span>}
                    {p.ronda && <span className="partido-ronda">{p.ronda}</span>}
                  </div>
                  <div className={`partido-marcador ${!disponible ? 'no-disponible' : ''}`}>
                    <div className="partido-equipo">
                      {loc && <img src={`/assets/flags/${loc.id}.png`} alt="" className="bandera-med" />}
                      {loc?.name || '---'}
                    </div>
                    <div className="partido-vs">
                      {tieneResultado
                        ? <span className="resultado-final">{p.local_goals} - {p.visitor_goals}</span>
                        : <span className="vs">VS</span>}
                    </div>
                    <div className="partido-equipo">
                      {vis && <img src={`/assets/flags/${vis.id}.png`} alt="" className="bandera-med" />}
                      {vis?.name || '---'}
                    </div>
                  </div>
                  {disponible && !tieneResultado && (
                    <button className="btn-cargar-resultado" onClick={() => setModalMatch(p)}>Cargar Resultado</button>
                  )}
                  {tieneResultado && (
                    <button className="btn-editar-resultado" onClick={() => setModalMatch(p)}>Editar</button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {modalMatch && local && vis && (
        <ModalResultado
          match={modalMatch}
          local={local}
          vis={vis}
          esEliminatoria={esEliminatoria}
          onClose={() => setModalMatch(null)}
          onSave={async () => {
            setModalMatch(null);
            await cargarPartidos();
          }}
        />
      )}
    </div>
  );
}

function ModalResultado({ match, local, vis, esEliminatoria, onClose, onSave }: {
  match: MatchData;
  local: Team;
  vis: Team;
  esEliminatoria: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const editando = match.local_goals != null;
  const [localGoals, setLocalGoals] = useState(match.local_goals ?? 0);
  const [visitorGoals, setVisitorGoals] = useState(match.visitor_goals ?? 0);
  const [penalesLocal, setPenalesLocal] = useState(match.penales_local ?? 0);
  const [penalesVisitor, setPenalesVisitor] = useState(match.penales_visitor ?? 0);
  const [golesTemp, setGolesTemp] = useState<GoalData[]>([]);
  const [showGolForm, setShowGolForm] = useState(false);
  const [golTeam, setGolTeam] = useState(local.id);
  const [golPlayer, setGolPlayer] = useState('');
  const [golMinute, setGolMinute] = useState('');
  const [golAssist, setGolAssist] = useState('');

  const showPenales = esEliminatoria && localGoals === visitorGoals;

  const handleSave = async () => {
    const payload: ResultPayload = {
      local_goals: localGoals,
      visitor_goals: visitorGoals,
      goals: golesTemp,
    };
    if (showPenales) {
      payload.penales_local = penalesLocal;
      payload.penales_visitor = penalesVisitor;
    }
    await api.cargarResultado(match.id, payload);
    onSave();
  };

  const addGol = () => {
    if (!golPlayer.trim()) return;
    setGolesTemp(prev => [...prev, {
      team_id: golTeam,
      player_name: golPlayer.trim(),
      minute: parseInt(golMinute) || null,
      assist_player: golAssist.trim() || null,
    }]);
    setGolPlayer('');
    setGolMinute('');
    setGolAssist('');
    setShowGolForm(false);
  };

  const removeGol = (idx: number) => {
    setGolesTemp(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3>{editando ? 'Editar' : 'Cargar'} Resultado</h3>
        <div className="modal-partido">
          <div className="modal-equipo">
            <img src={`/assets/flags/${local.id}.png`} alt="" className="bandera-med" />
            {local.name}
          </div>
          <div className="modal-marcador-input">
            <input type="number" min="0" max="99" value={localGoals} onChange={e => setLocalGoals(parseInt(e.target.value) || 0)} />
            <span>-</span>
            <input type="number" min="0" max="99" value={visitorGoals} onChange={e => setVisitorGoals(parseInt(e.target.value) || 0)} />
          </div>
          <div className="modal-equipo">
            <img src={`/assets/flags/${vis.id}.png`} alt="" className="bandera-med" />
            {vis.name}
          </div>
        </div>

        {showPenales && (
          <div className="modal-penales">
            <h4>Penales</h4>
            <div className="modal-marcador-input">
              <input type="number" min="0" max="99" value={penalesLocal} onChange={e => setPenalesLocal(parseInt(e.target.value) || 0)} />
              <span>-</span>
              <input type="number" min="0" max="99" value={penalesVisitor} onChange={e => setPenalesVisitor(parseInt(e.target.value) || 0)} />
            </div>
          </div>
        )}

        <div className="modal-goles">
          <h4>Goles del partido</h4>
          <div id="goles-lista">
            {golesTemp.map((g, i) => (
              <div key={i} className="gol-item">
                <span>{g.minute ? g.minute + "' " : ''}{g.player_name} ({g.team_id === local.id ? local.name : vis.name}){g.assist_player ? ` - Asist: ${g.assist_player}` : ''}</span>
                <button className="btn-eliminar-gol" onClick={() => removeGol(i)}>✕</button>
              </div>
            ))}
          </div>
          {!showGolForm ? (
            <button className="btn-agregar-gol" onClick={() => setShowGolForm(true)}>+ Agregar gol</button>
          ) : (
            <div className="gol-form">
              <select value={golTeam} onChange={e => setGolTeam(e.target.value)}>
                <option value={local.id}>{local.name}</option>
                <option value={vis.id}>{vis.name}</option>
              </select>
              <input type="text" placeholder="Goleador" value={golPlayer} onChange={e => setGolPlayer(e.target.value)} />
              <input type="number" placeholder="Minuto" min="1" max="120" value={golMinute} onChange={e => setGolMinute(e.target.value)} />
              <input type="text" placeholder="Asistencia (opcional)" value={golAssist} onChange={e => setGolAssist(e.target.value)} />
              <button className="btn-agregar" onClick={addGol}>Agregar</button>
              <button className="btn-cancelar" onClick={() => setShowGolForm(false)}>Cancelar</button>
            </div>
          )}
        </div>

        <div className="modal-acciones">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-guardar" onClick={handleSave}>{editando ? 'Actualizar' : 'Guardar'} Resultado</button>
        </div>
      </div>
    </div>
  );
}
