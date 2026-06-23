const partidosBase = [
  // ── GRUPO A ──
  { id:1, grupo:'A', equipoLocal:'mex', equipoVisitante:'rsa', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:2, grupo:'A', equipoLocal:'kor', equipoVisitante:'cze', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:3, grupo:'A', equipoLocal:'mex', equipoVisitante:'kor', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:4, grupo:'A', equipoLocal:'cze', equipoVisitante:'rsa', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:5, grupo:'A', equipoLocal:'mex', equipoVisitante:'cze', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:6, grupo:'A', equipoLocal:'rsa', equipoVisitante:'kor', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  // ── GRUPO B ──
  { id:7, grupo:'B', equipoLocal:'can', equipoVisitante:'bih', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:8, grupo:'B', equipoLocal:'qat', equipoVisitante:'sui', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:9, grupo:'B', equipoLocal:'can', equipoVisitante:'qat', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:10, grupo:'B', equipoLocal:'sui', equipoVisitante:'bih', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:11, grupo:'B', equipoLocal:'can', equipoVisitante:'sui', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:12, grupo:'B', equipoLocal:'bih', equipoVisitante:'qat', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  // ── GRUPO C ──
  { id:13, grupo:'C', equipoLocal:'bra', equipoVisitante:'mar', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:14, grupo:'C', equipoLocal:'hai', equipoVisitante:'sco', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:15, grupo:'C', equipoLocal:'bra', equipoVisitante:'hai', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:16, grupo:'C', equipoLocal:'sco', equipoVisitante:'mar', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:17, grupo:'C', equipoLocal:'bra', equipoVisitante:'sco', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:18, grupo:'C', equipoLocal:'mar', equipoVisitante:'hai', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  // ── GRUPO D ──
  { id:19, grupo:'D', equipoLocal:'usa', equipoVisitante:'par', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:20, grupo:'D', equipoLocal:'aus', equipoVisitante:'tur', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:21, grupo:'D', equipoLocal:'usa', equipoVisitante:'aus', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:22, grupo:'D', equipoLocal:'tur', equipoVisitante:'par', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:23, grupo:'D', equipoLocal:'usa', equipoVisitante:'tur', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:24, grupo:'D', equipoLocal:'par', equipoVisitante:'aus', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  // ── GRUPO E ──
  { id:25, grupo:'E', equipoLocal:'ger', equipoVisitante:'cur', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:26, grupo:'E', equipoLocal:'civ', equipoVisitante:'ecu', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:27, grupo:'E', equipoLocal:'ger', equipoVisitante:'civ', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:28, grupo:'E', equipoLocal:'ecu', equipoVisitante:'cur', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:29, grupo:'E', equipoLocal:'ger', equipoVisitante:'ecu', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:30, grupo:'E', equipoLocal:'cur', equipoVisitante:'civ', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  // ── GRUPO F ──
  { id:31, grupo:'F', equipoLocal:'ned', equipoVisitante:'jpn', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:32, grupo:'F', equipoLocal:'swe', equipoVisitante:'tun', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:33, grupo:'F', equipoLocal:'ned', equipoVisitante:'swe', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:34, grupo:'F', equipoLocal:'tun', equipoVisitante:'jpn', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:35, grupo:'F', equipoLocal:'ned', equipoVisitante:'tun', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:36, grupo:'F', equipoLocal:'jpn', equipoVisitante:'swe', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  // ── GRUPO G ──
  { id:37, grupo:'G', equipoLocal:'bel', equipoVisitante:'egy', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:38, grupo:'G', equipoLocal:'iri', equipoVisitante:'nzl', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:39, grupo:'G', equipoLocal:'bel', equipoVisitante:'iri', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:40, grupo:'G', equipoLocal:'nzl', equipoVisitante:'egy', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:41, grupo:'G', equipoLocal:'bel', equipoVisitante:'nzl', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:42, grupo:'G', equipoLocal:'egy', equipoVisitante:'iri', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  // ── GRUPO H ──
  { id:43, grupo:'H', equipoLocal:'esp', equipoVisitante:'cpv', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:44, grupo:'H', equipoLocal:'ksa', equipoVisitante:'uru', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:45, grupo:'H', equipoLocal:'esp', equipoVisitante:'ksa', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:46, grupo:'H', equipoLocal:'uru', equipoVisitante:'cpv', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:47, grupo:'H', equipoLocal:'esp', equipoVisitante:'uru', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:48, grupo:'H', equipoLocal:'cpv', equipoVisitante:'ksa', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  // ── GRUPO I ──
  { id:49, grupo:'I', equipoLocal:'fra', equipoVisitante:'sen', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:50, grupo:'I', equipoLocal:'irq', equipoVisitante:'nor', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:51, grupo:'I', equipoLocal:'fra', equipoVisitante:'irq', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:52, grupo:'I', equipoLocal:'nor', equipoVisitante:'sen', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:53, grupo:'I', equipoLocal:'fra', equipoVisitante:'nor', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:54, grupo:'I', equipoLocal:'sen', equipoVisitante:'irq', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  // ── GRUPO J ──
  { id:55, grupo:'J', equipoLocal:'arg', equipoVisitante:'alg', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:56, grupo:'J', equipoLocal:'aut', equipoVisitante:'jor', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:57, grupo:'J', equipoLocal:'arg', equipoVisitante:'aut', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:58, grupo:'J', equipoLocal:'jor', equipoVisitante:'alg', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:59, grupo:'J', equipoLocal:'arg', equipoVisitante:'jor', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:60, grupo:'J', equipoLocal:'alg', equipoVisitante:'aut', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  // ── GRUPO K ──
  { id:61, grupo:'K', equipoLocal:'por', equipoVisitante:'cod', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:62, grupo:'K', equipoLocal:'uzb', equipoVisitante:'col', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:63, grupo:'K', equipoLocal:'por', equipoVisitante:'uzb', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:64, grupo:'K', equipoLocal:'col', equipoVisitante:'cod', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:65, grupo:'K', equipoLocal:'por', equipoVisitante:'col', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:66, grupo:'K', equipoLocal:'cod', equipoVisitante:'uzb', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  // ── GRUPO L ──
  { id:67, grupo:'L', equipoLocal:'eng', equipoVisitante:'cro', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:68, grupo:'L', equipoLocal:'gha', equipoVisitante:'pan', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:69, grupo:'L', equipoLocal:'eng', equipoVisitante:'gha', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:70, grupo:'L', equipoLocal:'pan', equipoVisitante:'cro', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:71, grupo:'L', equipoLocal:'eng', equipoVisitante:'pan', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:72, grupo:'L', equipoLocal:'cro', equipoVisitante:'gha', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
];

const guardados = localStorage.getItem('mundial_partidos');
export const partidos = guardados ? JSON.parse(guardados) : partidosBase;