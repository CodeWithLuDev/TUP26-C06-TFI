import { useState } from 'react';

interface PartidoCalendario {
  fase: string;
  grupo?: string;
  fecha: string;
  hora: string;
  local: string;
  visitante: string;
  sede: string;
  banderaL?: string;
  banderaV?: string;
}

const fases = [
  'Todos', 'Fase de Grupos', '16avos', 'Octavos', 'Cuartos', 'Semifinales', '3er Puesto', 'Final'
];

const partidos: PartidoCalendario[] = [
  // ---- GRUPOS ----
  { fase: 'Fase de Grupos', grupo: 'F', fecha: 'Dom 21 Jun', hora: '0:00', local: 'Túnez', visitante: 'Japón', sede: 'Estadio BBVA, Monterrey', banderaL: 'tun', banderaV: 'jpn' },
  { fase: 'Fase de Grupos', grupo: 'H', fecha: 'Dom 21 Jun', hora: '12:00', local: 'España', visitante: 'Arabia Saudita', sede: 'Mercedes-Benz Stadium, Atlanta', banderaL: 'esp', banderaV: 'ksa' },
  { fase: 'Fase de Grupos', grupo: 'H', fecha: 'Dom 21 Jun', hora: '18:00', local: 'Uruguay', visitante: 'Cabo Verde', sede: 'Hard Rock Stadium, Miami', banderaL: 'ury', banderaV: 'cpv' },
  { fase: 'Fase de Grupos', grupo: 'G', fecha: 'Dom 21 Jun', hora: '15:00', local: 'Bélgica', visitante: 'Irán', sede: 'SoFi Stadium, Los Angeles', banderaL: 'bel', banderaV: 'irn' },
  { fase: 'Fase de Grupos', grupo: 'G', fecha: 'Dom 21 Jun', hora: '21:00', local: 'Nueva Zelanda', visitante: 'Egipto', sede: 'BC Place, Vancouver', banderaL: 'nzl', banderaV: 'egy' },

  { fase: 'Fase de Grupos', grupo: 'J', fecha: 'Lun 22 Jun', hora: '13:00', local: 'Argentina', visitante: 'Austria', sede: 'AT&T Stadium, Arlington', banderaL: 'arg', banderaV: 'aut' },
  { fase: 'Fase de Grupos', grupo: 'I', fecha: 'Lun 22 Jun', hora: '17:00', local: 'Francia', visitante: 'Irak', sede: 'Lincoln Financial Field, Philadelphia', banderaL: 'fra', banderaV: 'irq' },
  { fase: 'Fase de Grupos', grupo: 'I', fecha: 'Lun 22 Jun', hora: '20:00', local: 'Noruega', visitante: 'Senegal', sede: 'MetLife Stadium, New Jersey', banderaL: 'nor', banderaV: 'sen' },
  { fase: 'Fase de Grupos', grupo: 'J', fecha: 'Lun 22 Jun', hora: '23:00', local: 'Jordania', visitante: 'Argelia', sede: "Levi's Stadium, Santa Clara", banderaL: 'jor', banderaV: 'alg' },

  { fase: 'Fase de Grupos', grupo: 'K', fecha: 'Mar 23 Jun', hora: '13:00', local: 'Portugal', visitante: 'Uzbekistán', sede: 'NRG Stadium, Houston', banderaL: 'por', banderaV: 'uzb' },
  { fase: 'Fase de Grupos', grupo: 'L', fecha: 'Mar 23 Jun', hora: '16:00', local: 'Inglaterra', visitante: 'Ghana', sede: 'Gillette Stadium, Boston', banderaL: 'eng', banderaV: 'gha' },
  { fase: 'Fase de Grupos', grupo: 'L', fecha: 'Mar 23 Jun', hora: '19:00', local: 'Panamá', visitante: 'Croacia', sede: 'BMO Field, Toronto', banderaL: 'pan', banderaV: 'cro' },
  { fase: 'Fase de Grupos', grupo: 'K', fecha: 'Mar 23 Jun', hora: '22:00', local: 'Colombia', visitante: 'RD Congo', sede: 'Estadio Akron, Guadalajara', banderaL: 'col', banderaV: 'cod' },

  { fase: 'Fase de Grupos', grupo: 'B', fecha: 'Mié 24 Jun', hora: '15:00', local: 'Canadá', visitante: 'Suiza', sede: 'BC Place, Vancouver', banderaL: 'can', banderaV: 'sui' },
  { fase: 'Fase de Grupos', grupo: 'B', fecha: 'Mié 24 Jun', hora: '15:00', local: 'Bosnia', visitante: 'Qatar', sede: 'Lumen Field, Seattle', banderaL: 'bih', banderaV: 'qat' },
  { fase: 'Fase de Grupos', grupo: 'C', fecha: 'Mié 24 Jun', hora: '18:00', local: 'Escocia', visitante: 'Brasil', sede: 'Hard Rock Stadium, Miami', banderaL: 'sco', banderaV: 'bra' },
  { fase: 'Fase de Grupos', grupo: 'C', fecha: 'Mié 24 Jun', hora: '18:00', local: 'Marruecos', visitante: 'Haití', sede: 'Mercedes-Benz Stadium, Atlanta', banderaL: 'mar', banderaV: 'hai' },
  { fase: 'Fase de Grupos', grupo: 'A', fecha: 'Mié 24 Jun', hora: '21:00', local: 'México', visitante: 'Rep. Checa', sede: 'Estadio Azteca, CDMX', banderaL: 'mex', banderaV: 'cze' },
  { fase: 'Fase de Grupos', grupo: 'A', fecha: 'Mié 24 Jun', hora: '21:00', local: 'Sudáfrica', visitante: 'Corea del Sur', sede: 'Estadio BBVA, Monterrey', banderaL: 'rsa', banderaV: 'kor' },

  { fase: 'Fase de Grupos', grupo: 'E', fecha: 'Jue 25 Jun', hora: '16:00', local: 'Ecuador', visitante: 'Alemania', sede: 'MetLife Stadium, New Jersey', banderaL: 'ecu', banderaV: 'ger' },
  { fase: 'Fase de Grupos', grupo: 'E', fecha: 'Jue 25 Jun', hora: '16:00', local: 'Curazao', visitante: 'Costa de Marfil', sede: 'Lincoln Financial Field, Philadelphia', banderaL: 'cuw', banderaV: 'civ' },
  { fase: 'Fase de Grupos', grupo: 'F', fecha: 'Jue 25 Jun', hora: '19:00', local: 'Túnez', visitante: 'Países Bajos', sede: 'Arrowhead Stadium, Kansas City', banderaL: 'tun', banderaV: 'ned' },
  { fase: 'Fase de Grupos', grupo: 'F', fecha: 'Jue 25 Jun', hora: '19:00', local: 'Japón', visitante: 'Suecia', sede: 'AT&T Stadium, Arlington', banderaL: 'jpn', banderaV: 'swe' },
  { fase: 'Fase de Grupos', grupo: 'D', fecha: 'Jue 25 Jun', hora: '22:00', local: 'EE.UU.', visitante: 'Turquía', sede: 'SoFi Stadium, Los Angeles', banderaL: 'usa', banderaV: 'tur' },
  { fase: 'Fase de Grupos', grupo: 'D', fecha: 'Jue 25 Jun', hora: '22:00', local: 'Paraguay', visitante: 'Australia', sede: "Levi's Stadium, Santa Clara", banderaL: 'par', banderaV: 'aus' },

  { fase: 'Fase de Grupos', grupo: 'I', fecha: 'Vie 26 Jun', hora: '15:00', local: 'Noruega', visitante: 'Francia', sede: 'Gillette Stadium, Boston', banderaL: 'nor', banderaV: 'fra' },
  { fase: 'Fase de Grupos', grupo: 'I', fecha: 'Vie 26 Jun', hora: '15:00', local: 'Senegal', visitante: 'Irak', sede: 'BMO Field, Toronto', banderaL: 'sen', banderaV: 'irq' },
  { fase: 'Fase de Grupos', grupo: 'H', fecha: 'Vie 26 Jun', hora: '20:00', local: 'Uruguay', visitante: 'España', sede: 'Estadio Akron, Guadalajara', banderaL: 'ury', banderaV: 'esp' },
  { fase: 'Fase de Grupos', grupo: 'H', fecha: 'Vie 26 Jun', hora: '20:00', local: 'Cabo Verde', visitante: 'Arabia Saudita', sede: 'NRG Stadium, Houston', banderaL: 'cpv', banderaV: 'ksa' },
  { fase: 'Fase de Grupos', grupo: 'G', fecha: 'Vie 26 Jun', hora: '23:00', local: 'N. Zelanda', visitante: 'Bélgica', sede: 'BC Place, Vancouver', banderaL: 'nzl', banderaV: 'bel' },
  { fase: 'Fase de Grupos', grupo: 'G', fecha: 'Vie 26 Jun', hora: '23:00', local: 'Egipto', visitante: 'Irán', sede: 'Lumen Field, Seattle', banderaL: 'egy', banderaV: 'irn' },

  { fase: 'Fase de Grupos', grupo: 'L', fecha: 'Sáb 27 Jun', hora: '17:00', local: 'Panamá', visitante: 'Inglaterra', sede: 'MetLife Stadium, New Jersey', banderaL: 'pan', banderaV: 'eng' },
  { fase: 'Fase de Grupos', grupo: 'L', fecha: 'Sáb 27 Jun', hora: '17:00', local: 'Croacia', visitante: 'Ghana', sede: 'Lincoln Financial Field, Philadelphia', banderaL: 'cro', banderaV: 'gha' },
  { fase: 'Fase de Grupos', grupo: 'K', fecha: 'Sáb 27 Jun', hora: '19:30', local: 'Colombia', visitante: 'Portugal', sede: 'Hard Rock Stadium, Miami', banderaL: 'col', banderaV: 'por' },
  { fase: 'Fase de Grupos', grupo: 'K', fecha: 'Sáb 27 Jun', hora: '19:30', local: 'RD Congo', visitante: 'Uzbekistán', sede: 'Mercedes-Benz Stadium, Atlanta', banderaL: 'cod', banderaV: 'uzb' },
  { fase: 'Fase de Grupos', grupo: 'J', fecha: 'Sáb 27 Jun', hora: '22:00', local: 'Jordania', visitante: 'Argentina', sede: 'AT&T Stadium, Arlington', banderaL: 'jor', banderaV: 'arg' },
  { fase: 'Fase de Grupos', grupo: 'J', fecha: 'Sáb 27 Jun', hora: '22:00', local: 'Argelia', visitante: 'Austria', sede: 'Arrowhead Stadium, Kansas City', banderaL: 'alg', banderaV: 'aut' },

  // ---- 16AVOS ----
  { fase: '16avos', fecha: 'Dom 28 Jun', hora: '15:00', local: '2° Grupo A', visitante: '2° Grupo B', sede: 'SoFi Stadium, Los Angeles' },
  { fase: '16avos', fecha: 'Lun 29 Jun', hora: '13:00', local: '1° Grupo C', visitante: '2° Grupo F', sede: 'NRG Stadium, Houston' },
  { fase: '16avos', fecha: 'Lun 29 Jun', hora: '16:30', local: '1° Grupo E', visitante: '3° A/B/C/D/F', sede: 'Gillette Stadium, Boston' },
  { fase: '16avos', fecha: 'Lun 29 Jun', hora: '21:00', local: '1° Grupo F', visitante: '2° Grupo C', sede: 'Estadio BBVA, Monterrey' },
  { fase: '16avos', fecha: 'Mar 30 Jun', hora: '13:00', local: '2° Grupo E', visitante: '2° Grupo I', sede: 'AT&T Stadium, Arlington' },
  { fase: '16avos', fecha: 'Mar 30 Jun', hora: '17:00', local: '1° Grupo I', visitante: '3° C/D/F/G/H', sede: 'MetLife Stadium, New Jersey' },
  { fase: '16avos', fecha: 'Mar 30 Jun', hora: '21:00', local: '1° Grupo A', visitante: '3° C/E/F/H/I', sede: 'Estadio Azteca, CDMX' },
  { fase: '16avos', fecha: 'Mié 1 Jul', hora: '12:00', local: '1° Grupo L', visitante: '3° E/H/I/J/K', sede: 'Mercedes-Benz Stadium, Atlanta' },
  { fase: '16avos', fecha: 'Mié 1 Jul', hora: '16:00', local: '1° Grupo G', visitante: '3° A/E/H/I/J', sede: 'Lumen Field, Seattle' },
  { fase: '16avos', fecha: 'Mié 1 Jul', hora: '20:00', local: '1° Grupo D', visitante: '3° B/E/F/I/J', sede: "Levi's Stadium, Santa Clara" },
  { fase: '16avos', fecha: 'Jue 2 Jul', hora: '15:00', local: '1° Grupo H', visitante: '2° Grupo J', sede: 'SoFi Stadium, Los Angeles' },
  { fase: '16avos', fecha: 'Jue 2 Jul', hora: '19:00', local: '2° Grupo K', visitante: '2° Grupo L', sede: 'BMO Field, Toronto' },
  { fase: '16avos', fecha: 'Jue 2 Jul', hora: '23:00', local: '1° Grupo B', visitante: '3° E/F/G/I/J', sede: 'BC Place, Vancouver' },
  { fase: '16avos', fecha: 'Vie 3 Jul', hora: '14:00', local: '2° Grupo D', visitante: '2° Grupo G', sede: 'AT&T Stadium, Arlington' },
  { fase: '16avos', fecha: 'Vie 3 Jul', hora: '18:00', local: '1° Grupo J', visitante: '2° Grupo H', sede: 'Hard Rock Stadium, Miami' },
  { fase: '16avos', fecha: 'Vie 3 Jul', hora: '21:30', local: '1° Grupo K', visitante: '3° D/E/I/J/L', sede: 'Arrowhead Stadium, Kansas City' },

  // ---- OCTAVOS ----
  { fase: 'Octavos', fecha: 'Sáb 4 Jul', hora: '13:00', local: 'Ganador 73', visitante: 'Ganador 75', sede: 'NRG Stadium, Houston' },
  { fase: 'Octavos', fecha: 'Sáb 4 Jul', hora: '17:00', local: 'Ganador 74', visitante: 'Ganador 77', sede: 'Lincoln Financial Field, Philadelphia' },
  { fase: 'Octavos', fecha: 'Dom 5 Jul', hora: '16:00', local: 'Ganador 76', visitante: 'Ganador 78', sede: 'MetLife Stadium, New Jersey' },
  { fase: 'Octavos', fecha: 'Dom 5 Jul', hora: '20:00', local: 'Ganador 79', visitante: 'Ganador 80', sede: 'Estadio Azteca, CDMX' },
  { fase: 'Octavos', fecha: 'Lun 6 Jul', hora: '15:00', local: 'Ganador 83', visitante: 'Ganador 84', sede: 'AT&T Stadium, Arlington' },
  { fase: 'Octavos', fecha: 'Lun 6 Jul', hora: '20:00', local: 'Ganador 81', visitante: 'Ganador 82', sede: 'Lumen Field, Seattle' },
  { fase: 'Octavos', fecha: 'Mar 7 Jul', hora: '12:00', local: 'Ganador 86', visitante: 'Ganador 88', sede: 'Mercedes-Benz Stadium, Atlanta' },
  { fase: 'Octavos', fecha: 'Mar 7 Jul', hora: '16:00', local: 'Ganador 85', visitante: 'Ganador 87', sede: 'BC Place, Vancouver' },

  // ---- CUARTOS ----
  { fase: 'Cuartos', fecha: 'Jue 9 Jul', hora: '16:00', local: 'Ganador 89', visitante: 'Ganador 90', sede: 'Gillette Stadium, Boston' },
  { fase: 'Cuartos', fecha: 'Vie 10 Jul', hora: '15:00', local: 'Ganador 93', visitante: 'Ganador 94', sede: 'SoFi Stadium, Los Angeles' },
  { fase: 'Cuartos', fecha: 'Sáb 11 Jul', hora: '17:00', local: 'Ganador 91', visitante: 'Ganador 92', sede: 'Hard Rock Stadium, Miami' },
  { fase: 'Cuartos', fecha: 'Sáb 11 Jul', hora: '21:00', local: 'Ganador 95', visitante: 'Ganador 96', sede: 'Arrowhead Stadium, Kansas City' },

  // ---- SEMIFINALES ----
  { fase: 'Semifinales', fecha: 'Mar 14 Jul', hora: '15:00', local: 'Ganador 97', visitante: 'Ganador 98', sede: 'AT&T Stadium, Arlington' },
  { fase: 'Semifinales', fecha: 'Mié 15 Jul', hora: '15:00', local: 'Ganador 99', visitante: 'Ganador 100', sede: 'Mercedes-Benz Stadium, Atlanta' },

  // ---- 3ER PUESTO ----
  { fase: '3er Puesto', fecha: 'Sáb 18 Jul', hora: '17:00', local: 'Perdedor 101', visitante: 'Perdedor 102', sede: 'Hard Rock Stadium, Miami' },

  // ---- FINAL ----
  { fase: 'Final', fecha: 'Dom 19 Jul', hora: '15:00', local: 'Ganador 101', visitante: 'Ganador 102', sede: 'MetLife Stadium, New Jersey' },
];

export default function Calendario() {
  const [filtroFase, setFiltroFase] = useState('Todos');

  const filtrados = filtroFase === 'Todos'
    ? partidos
    : partidos.filter(p => p.fase === filtroFase);

  const agrupados = filtrados.reduce<Record<string, PartidoCalendario[]>>((acc, p) => {
    if (!acc[p.fecha]) acc[p.fecha] = [];
    acc[p.fecha].push(p);
    return acc;
  }, {});

  return (
    <div className="calendario-page">
      <h2>Calendario Mundial 2026</h2>
      <p className="calendario-subtitulo">
        104 partidos · 11 junio - 19 julio · EE.UU., México y Canadá
      </p>

      <div className="calendario-resumen">
        <div className="resumen-item"><span className="resumen-num">11 Jun</span><span className="resumen-label">Inicio</span></div>
        <div className="resumen-item"><span className="resumen-num">48</span><span className="resumen-label">Selecciones</span></div>
        <div className="resumen-item"><span className="resumen-num">104</span><span className="resumen-label">Partidos</span></div>
        <div className="resumen-item"><span className="resumen-num">16</span><span className="resumen-label">Sedees</span></div>
        <div className="resumen-item"><span className="resumen-num">19 Jul</span><span className="resumen-label">Final</span></div>
      </div>

      <div className="calendario-filtros">
        {fases.map(f => (
          <button
            key={f}
            className={`filtro-btn ${filtroFase === f ? 'activo' : ''}`}
            onClick={() => setFiltroFase(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="calendario-lista">
        {Object.entries(agrupados).map(([fecha, pts]) => (
          <div key={fecha} className="calendario-dia">
            <h3 className="calendario-dia-titulo">{fecha}</h3>
            <div className="calendario-partidos">
              {pts.map((p, i) => (
                <div key={i} className="calendario-partido">
                  <div className="calendario-hora">{p.hora}</div>
                  <div className="calendario-info">
                    <div className="calendario-equipos">
                      <span className="calendario-equipo">
                        {p.banderaL && <img src={`/assets/flags/${p.banderaL}.png`} alt="" className="bandera-tiny" />}
                        {p.local}
                      </span>
                      <span className="calendario-vs">vs</span>
                      <span className="calendario-equipo">
                        {p.banderaV && <img src={`/assets/flags/${p.banderaV}.png`} alt="" className="bandera-tiny" />}
                        {p.visitante}
                      </span>
                    </div>
                    <div className="calendario-meta">
                      {p.grupo && <span className="calendario-grupo">Grupo {p.grupo}</span>}
                      <span className="calendario-sede">{p.sede}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
