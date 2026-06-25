/**
 * partidos.js — Calendario completo del Mundial Qatar 2022
 * Zona horaria de referencia: ART (UTC-3) — Argentina
 * Incluye fase de grupos (48 partidos) + playoffs generados dinámicamente
 */

const ZONA_HORARIA = 'ART (UTC-3)';

/** Estructura de un partido de fase de grupos */
const PARTIDOS_GRUPOS = [
  // ── GRUPO A ──────────────────────────────────────────────
  { id: 'GA1', local: 'QAT', visitante: 'ECU', grupo: 'A', fecha: '2022-11-20', hora: '13:00', estadio: 'Al Bayt' },
  { id: 'GA2', local: 'SEN', visitante: 'NED', grupo: 'A', fecha: '2022-11-21', hora: '10:00', estadio: 'Al Thumama' },
  { id: 'GA3', local: 'QAT', visitante: 'SEN', grupo: 'A', fecha: '2022-11-25', hora: '13:00', estadio: 'Al Thumama' },
  { id: 'GA4', local: 'NED', visitante: 'ECU', grupo: 'A', fecha: '2022-11-25', hora: '16:00', estadio: 'Khalifa Intl.' },
  { id: 'GA5', local: 'ECU', visitante: 'SEN', grupo: 'A', fecha: '2022-11-29', hora: '16:00', estadio: 'Khalifa Intl.' },
  { id: 'GA6', local: 'NED', visitante: 'QAT', grupo: 'A', fecha: '2022-11-29', hora: '16:00', estadio: 'Al Bayt' },

  // ── GRUPO B ──────────────────────────────────────────────
  { id: 'GB1', local: 'ENG', visitante: 'IRN', grupo: 'B', fecha: '2022-11-21', hora: '16:00', estadio: 'Khalifa Intl.' },
  { id: 'GB2', local: 'USA', visitante: 'WAL', grupo: 'B', fecha: '2022-11-21', hora: '22:00', estadio: 'Ahmad Bin Ali' },
  { id: 'GB3', local: 'WAL', visitante: 'IRN', grupo: 'B', fecha: '2022-11-25', hora: '10:00', estadio: 'Ahmad Bin Ali' },
  { id: 'GB4', local: 'ENG', visitante: 'USA', grupo: 'B', fecha: '2022-11-25', hora: '22:00', estadio: 'Al Bayt' },
  { id: 'GB5', local: 'IRN', visitante: 'USA', grupo: 'B', fecha: '2022-11-29', hora: '22:00', estadio: 'Al Thumama' },
  { id: 'GB6', local: 'WAL', visitante: 'ENG', grupo: 'B', fecha: '2022-11-29', hora: '22:00', estadio: 'Ahmad Bin Ali' },

  // ── GRUPO C ──────────────────────────────────────────────
  { id: 'GC1', local: 'ARG', visitante: 'KSA', grupo: 'C', fecha: '2022-11-22', hora: '10:00', estadio: 'Lusail' },
  { id: 'GC2', local: 'MEX', visitante: 'POL', grupo: 'C', fecha: '2022-11-22', hora: '16:00', estadio: '974' },
  { id: 'GC3', local: 'POL', visitante: 'KSA', grupo: 'C', fecha: '2022-11-26', hora: '13:00', estadio: 'Education City' },
  { id: 'GC4', local: 'ARG', visitante: 'MEX', grupo: 'C', fecha: '2022-11-26', hora: '22:00', estadio: 'Lusail' },
  { id: 'GC5', local: 'POL', visitante: 'ARG', grupo: 'C', fecha: '2022-11-30', hora: '20:00', estadio: '974' },
  { id: 'GC6', local: 'KSA', visitante: 'MEX', grupo: 'C', fecha: '2022-11-30', hora: '20:00', estadio: 'Lusail' },

  // ── GRUPO D ──────────────────────────────────────────────
  { id: 'GD1', local: 'DEN', visitante: 'TUN', grupo: 'D', fecha: '2022-11-22', hora: '13:00', estadio: 'Education City' },
  { id: 'GD2', local: 'FRA', visitante: 'AUS', grupo: 'D', fecha: '2022-11-22', hora: '22:00', estadio: 'Al Janoub' },
  { id: 'GD3', local: 'TUN', visitante: 'AUS', grupo: 'D', fecha: '2022-11-26', hora: '10:00', estadio: 'Al Janoub' },
  { id: 'GD4', local: 'FRA', visitante: 'DEN', grupo: 'D', fecha: '2022-11-26', hora: '16:00', estadio: '974' },
  { id: 'GD5', local: 'TUN', visitante: 'FRA', grupo: 'D', fecha: '2022-11-30', hora: '20:00', estadio: 'Education City' },
  { id: 'GD6', local: 'AUS', visitante: 'DEN', grupo: 'D', fecha: '2022-11-30', hora: '20:00', estadio: 'Al Janoub' },

  // ── GRUPO E ──────────────────────────────────────────────
  { id: 'GE1', local: 'GER', visitante: 'JPN', grupo: 'E', fecha: '2022-11-23', hora: '13:00', estadio: 'Khalifa Intl.' },
  { id: 'GE2', local: 'ESP', visitante: 'CRC', grupo: 'E', fecha: '2022-11-23', hora: '22:00', estadio: 'Al Thumama' },
  { id: 'GE3', local: 'JPN', visitante: 'CRC', grupo: 'E', fecha: '2022-11-27', hora: '13:00', estadio: 'Ahmad Bin Ali' },
  { id: 'GE4', local: 'ESP', visitante: 'GER', grupo: 'E', fecha: '2022-11-27', hora: '22:00', estadio: 'Al Bayt' },
  { id: 'GE5', local: 'JPN', visitante: 'ESP', grupo: 'E', fecha: '2022-12-01', hora: '20:00', estadio: 'Khalifa Intl.' },
  { id: 'GE6', local: 'CRC', visitante: 'GER', grupo: 'E', fecha: '2022-12-01', hora: '20:00', estadio: 'Al Bayt' },

  // ── GRUPO F ──────────────────────────────────────────────
  { id: 'GF1', local: 'MAR', visitante: 'CRO', grupo: 'F', fecha: '2022-11-23', hora: '10:00', estadio: 'Al Bayt' },
  { id: 'GF2', local: 'BEL', visitante: 'CAN', grupo: 'F', fecha: '2022-11-23', hora: '16:00', estadio: 'Ahmad Bin Ali' },
  { id: 'GF3', local: 'BEL', visitante: 'MAR', grupo: 'F', fecha: '2022-11-27', hora: '10:00', estadio: 'Al Thumama' },
  { id: 'GF4', local: 'CRO', visitante: 'CAN', grupo: 'F', fecha: '2022-11-27', hora: '16:00', estadio: 'Khalifa Intl.' },
  { id: 'GF5', local: 'CRO', visitante: 'BEL', grupo: 'F', fecha: '2022-12-01', hora: '20:00', estadio: 'Ahmad Bin Ali' },
  { id: 'GF6', local: 'CAN', visitante: 'MAR', grupo: 'F', fecha: '2022-12-01', hora: '20:00', estadio: 'Al Thumama' },

  // ── GRUPO G ──────────────────────────────────────────────
  { id: 'GG1', local: 'SUI', visitante: 'CMR', grupo: 'G', fecha: '2022-11-24', hora: '10:00', estadio: 'Al Janoub' },
  { id: 'GG2', local: 'BRA', visitante: 'SRB', grupo: 'G', fecha: '2022-11-24', hora: '22:00', estadio: 'Lusail' },
  { id: 'GG3', local: 'CMR', visitante: 'SRB', grupo: 'G', fecha: '2022-11-28', hora: '10:00', estadio: 'Al Janoub' },
  { id: 'GG4', local: 'BRA', visitante: 'SUI', grupo: 'G', fecha: '2022-11-28', hora: '16:00', estadio: '974' },
  { id: 'GG5', local: 'SRB', visitante: 'SUI', grupo: 'G', fecha: '2022-12-02', hora: '20:00', estadio: 'Stadium 974' },
  { id: 'GG6', local: 'CMR', visitante: 'BRA', grupo: 'G', fecha: '2022-12-02', hora: '20:00', estadio: 'Lusail' },

  // ── GRUPO H ──────────────────────────────────────────────
  { id: 'GH1', local: 'POR', visitante: 'GHA', grupo: 'H', fecha: '2022-11-24', hora: '16:00', estadio: '974' },
  { id: 'GH2', local: 'URU', visitante: 'KOR', grupo: 'H', fecha: '2022-11-24', hora: '13:00', estadio: 'Education City' },
  { id: 'GH3', local: 'KOR', visitante: 'GHA', grupo: 'H', fecha: '2022-11-28', hora: '13:00', estadio: 'Education City' },
  { id: 'GH4', local: 'POR', visitante: 'URU', grupo: 'H', fecha: '2022-11-28', hora: '22:00', estadio: 'Lusail' },
  { id: 'GH5', local: 'GHA', visitante: 'URU', grupo: 'H', fecha: '2022-12-02', hora: '20:00', estadio: 'Al Janoub' },
  { id: 'GH6', local: 'KOR', visitante: 'POR', grupo: 'H', fecha: '2022-12-02', hora: '20:00', estadio: 'Education City' },
];

/** Estructura de los partidos de playoffs (IDs y slots se asignan dinámicamente) */
const ESTRUCTURA_PLAYOFFS = {
  octavos: [
    { id: 'R16_1', slot: '1A_2B', ronda: 'Octavos', fecha: '2022-12-03', hora: '16:00', estadio: 'Ahmad Bin Ali' },
    { id: 'R16_2', slot: '1C_2D', ronda: 'Octavos', fecha: '2022-12-03', hora: '20:00', estadio: 'Al Thumama' },
    { id: 'R16_3', slot: '1B_2A', ronda: 'Octavos', fecha: '2022-12-04', hora: '16:00', estadio: 'Khalifa Intl.' },
    { id: 'R16_4', slot: '1D_2C', ronda: 'Octavos', fecha: '2022-12-04', hora: '20:00', estadio: 'Al Bayt' },
    { id: 'R16_5', slot: '1E_2F', ronda: 'Octavos', fecha: '2022-12-05', hora: '16:00', estadio: 'Al Janoub' },
    { id: 'R16_6', slot: '1G_2H', ronda: 'Octavos', fecha: '2022-12-05', hora: '20:00', estadio: 'Stadium 974' },
    { id: 'R16_7', slot: '1F_2E', ronda: 'Octavos', fecha: '2022-12-06', hora: '16:00', estadio: 'Education City' },
    { id: 'R16_8', slot: '1H_2G', ronda: 'Octavos', fecha: '2022-12-06', hora: '20:00', estadio: 'Lusail' },
  ],
  cuartos: [
    { id: 'QF_1', ronda: 'Cuartos', fecha: '2022-12-09', hora: '16:00', estadio: 'Education City' },
    { id: 'QF_2', ronda: 'Cuartos', fecha: '2022-12-09', hora: '20:00', estadio: 'Lusail' },
    { id: 'QF_3', ronda: 'Cuartos', fecha: '2022-12-10', hora: '16:00', estadio: 'Al Thumama' },
    { id: 'QF_4', ronda: 'Cuartos', fecha: '2022-12-10', hora: '20:00', estadio: 'Al Bayt' },
  ],
  semifinales: [
    { id: 'SF_1', ronda: 'Semifinal', fecha: '2022-12-13', hora: '20:00', estadio: 'Lusail' },
    { id: 'SF_2', ronda: 'Semifinal', fecha: '2022-12-14', hora: '20:00', estadio: 'Al Bayt' },
  ],
  tercerPuesto: [
    { id: 'TP_1', ronda: 'Tercer Puesto', fecha: '2022-12-17', hora: '16:00', estadio: 'Khalifa Intl.' },
  ],
  final: [
    { id: 'FIN_1', ronda: 'Final', fecha: '2022-12-18', hora: '16:00', estadio: 'Lusail' },
  ],
};

/** Obtiene los partidos de un grupo */
function getPartidosPorGrupo(grupo) {
  return PARTIDOS_GRUPOS.filter(p => p.grupo === grupo);
}

/** Obtiene un partido por ID */
function getPartidoPorId(id) {
  return PARTIDOS_GRUPOS.find(p => p.id === id) || null;
}

/** Formatea una fecha al español */
function formatearFecha(fechaStr) {
  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/** Formatea una fecha corta */
function formatearFechaCorta(fechaStr) {
  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  });
}
