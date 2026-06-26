import { useState, useEffect } from 'react';
import { api } from '../api';
import type { Scorer, Assister, Team } from '../types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Estadisticas() {
  const [goleadores, setGoleadores] = useState<Scorer[]>([]);
  const [asistidores, setAsistidores] = useState<Assister[]>([]);
  const [teamMap, setTeamMap] = useState<Map<string, Team>>(new Map());

  useEffect(() => {
    Promise.all([api.goleadores(), api.asistidores(), api.equipos()])
      .then(([g, a, e]) => {
        setGoleadores(g);
        setAsistidores(a);
        setTeamMap(new Map(e.map(t => [t.id, t])));
      })
      .catch(console.error);
  }, []);

  const getTeamName = (teamId: string) => {
    const eq = teamMap.get(teamId);
    return eq ? { name: eq.name, flag: eq.id } : { name: teamId, flag: '' };
  };

  const chartGoleadores = {
    labels: goleadores.slice(0, 10).map(g => g.player_name),
    datasets: [{
      label: 'Goles',
      data: goleadores.slice(0, 10).map(g => g.goals),
      backgroundColor: 'rgba(226, 183, 20, 0.8)',
      borderColor: '#e2b714',
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const chartAsistidores = {
    labels: asistidores.slice(0, 10).map(a => a.player_name),
    datasets: [{
      label: 'Asistencias',
      data: asistidores.slice(0, 10).map(a => a.assists),
      backgroundColor: 'rgba(0, 200, 83, 0.8)',
      borderColor: '#00c853',
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const chartOptions = (title: string) => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title, color: '#e8e8e8', font: { size: 14 } },
    },
    scales: {
      x: { ticks: { color: '#a0a0b0' } },
      y: { ticks: { color: '#a0a0b0', stepSize: 1 } },
    },
  });

  return (
    <div className="estadisticas-page">
      <h2>Estadísticas del Torneo</h2>

      <div className="estadisticas-columnas">
        <div className="estadisticas-box">
          <h3>Goleadores</h3>
          <table className="tabla-estadisticas">
            <thead>
              <tr><th>#</th><th>Jugador</th><th>Equipo</th><th>Goles</th></tr>
            </thead>
            <tbody>
              {goleadores.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#a0a0b0' }}>No hay goles registrados</td></tr>
              ) : (
                goleadores.slice(0, 15).map((g, i) => {
                  const t = getTeamName(g.team_id);
                  return (
                    <tr key={i}>
                      <td className="num">{i + 1}</td>
                      <td>{g.player_name}</td>
                      <td className="equipo-cell-td">
                        {t.flag && <img src={`/assets/flags/${t.flag}.png`} alt="" className="bandera-tiny" />}
                        {t.name}
                      </td>
                      <td className="num">{g.goals}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="estadisticas-box">
          <h3>Asistidores</h3>
          <table className="tabla-estadisticas">
            <thead>
              <tr><th>#</th><th>Jugador</th><th>Equipo</th><th>Asistencias</th></tr>
            </thead>
            <tbody>
              {asistidores.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#a0a0b0' }}>No hay asistencias registradas</td></tr>
              ) : (
                asistidores.slice(0, 15).map((a, i) => {
                  const t = getTeamName(a.team_id);
                  return (
                    <tr key={i}>
                      <td className="num">{i + 1}</td>
                      <td>{a.player_name}</td>
                      <td className="equipo-cell-td">
                        {t.flag && <img src={`/assets/flags/${t.flag}.png`} alt="" className="bandera-tiny" />}
                        {t.name}
                      </td>
                      <td className="num">{a.assists}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts-row">
        {goleadores.length > 0 && (
          <div className="chart-box">
            <Bar data={chartGoleadores} options={chartOptions('Top Goleadores')} />
          </div>
        )}
        {asistidores.length > 0 && (
          <div className="chart-box">
            <Bar data={chartAsistidores} options={chartOptions('Top Asistidores')} />
          </div>
        )}
      </div>
    </div>
  );
}
