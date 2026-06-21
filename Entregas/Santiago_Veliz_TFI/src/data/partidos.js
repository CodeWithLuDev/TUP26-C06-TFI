/**
 * /src/data/partidos.js
 * Resultados reales del Mundial 2026 al 21/06/2026 (Jornada 2 en curso).
 * Fuente: FIFA / Wikipedia / UEFA.
 * Los partidos de jornada 3 y pendientes de jornada 2 quedan en 'pendiente'.
 */
export const partidos = [
  // ── GRUPO A: México · Sudáfrica · Corea del Sur · Chequia ──
  { id:1,  grupo:'A', equipoLocal:'mex', equipoVisitante:'rsa', golesLocal:2,    golesVisitante:0,    estado:'jugado',    goleadores:['Quiñones','Jiménez'], asistidores:[] },
  { id:2,  grupo:'A', equipoLocal:'kor', equipoVisitante:'cze', golesLocal:2,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:3,  grupo:'A', equipoLocal:'mex', equipoVisitante:'kor', golesLocal:1,    golesVisitante:0,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:4,  grupo:'A', equipoLocal:'cze', equipoVisitante:'rsa', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:5,  grupo:'A', equipoLocal:'mex', equipoVisitante:'cze', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:6,  grupo:'A', equipoLocal:'rsa', equipoVisitante:'kor', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },

  // ── GRUPO B: Canadá · Bosnia · Catar · Suiza ────────────
  { id:7,  grupo:'B', equipoLocal:'can', equipoVisitante:'bih', golesLocal:6,    golesVisitante:0,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:8,  grupo:'B', equipoLocal:'qat', equipoVisitante:'sui', golesLocal:1,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:9,  grupo:'B', equipoLocal:'can', equipoVisitante:'qat', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:10, grupo:'B', equipoLocal:'sui', equipoVisitante:'bih', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:11, grupo:'B', equipoLocal:'can', equipoVisitante:'sui', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:12, grupo:'B', equipoLocal:'bih', equipoVisitante:'qat', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },

  // ── GRUPO C: Brasil · Marruecos · Haití · Escocia ────────
  { id:13, grupo:'C', equipoLocal:'bra', equipoVisitante:'mar', golesLocal:1,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:14, grupo:'C', equipoLocal:'hai', equipoVisitante:'sco', golesLocal:0,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:15, grupo:'C', equipoLocal:'bra', equipoVisitante:'hai', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:16, grupo:'C', equipoLocal:'sco', equipoVisitante:'mar', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:17, grupo:'C', equipoLocal:'bra', equipoVisitante:'sco', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:18, grupo:'C', equipoLocal:'mar', equipoVisitante:'hai', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },

  // ── GRUPO D: EEUU · Paraguay · Australia · Turquía ───────
  { id:19, grupo:'D', equipoLocal:'usa', equipoVisitante:'par', golesLocal:2,    golesVisitante:0,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:20, grupo:'D', equipoLocal:'aus', equipoVisitante:'tur', golesLocal:2,    golesVisitante:0,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:21, grupo:'D', equipoLocal:'usa', equipoVisitante:'aus', golesLocal:2,    golesVisitante:0,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:22, grupo:'D', equipoLocal:'tur', equipoVisitante:'par', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:23, grupo:'D', equipoLocal:'usa', equipoVisitante:'tur', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:24, grupo:'D', equipoLocal:'par', equipoVisitante:'aus', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },

  // ── GRUPO E: Alemania · Curazao · C. de Marfil · Ecuador ─
  { id:25, grupo:'E', equipoLocal:'ger', equipoVisitante:'cur', golesLocal:7,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:26, grupo:'E', equipoLocal:'civ', equipoVisitante:'ecu', golesLocal:1,    golesVisitante:0,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:27, grupo:'E', equipoLocal:'ger', equipoVisitante:'civ', golesLocal:2,    golesVisitante:0,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:28, grupo:'E', equipoLocal:'ecu', equipoVisitante:'cur', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:29, grupo:'E', equipoLocal:'ger', equipoVisitante:'ecu', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:30, grupo:'E', equipoLocal:'cur', equipoVisitante:'civ', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },

  // ── GRUPO F: Países Bajos · Japón · Suecia · Túnez ───────
  { id:31, grupo:'F', equipoLocal:'ned', equipoVisitante:'jpn', golesLocal:2,    golesVisitante:2,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:32, grupo:'F', equipoLocal:'swe', equipoVisitante:'tun', golesLocal:5,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:33, grupo:'F', equipoLocal:'ned', equipoVisitante:'swe', golesLocal:5,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:34, grupo:'F', equipoLocal:'tun', equipoVisitante:'jpn', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:35, grupo:'F', equipoLocal:'ned', equipoVisitante:'tun', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:36, grupo:'F', equipoLocal:'jpn', equipoVisitante:'swe', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },

  // ── GRUPO G: Bélgica · Egipto · Irán · Nueva Zelanda ─────
  { id:37, grupo:'G', equipoLocal:'bel', equipoVisitante:'egy', golesLocal:1,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:38, grupo:'G', equipoLocal:'iri', equipoVisitante:'nzl', golesLocal:2,    golesVisitante:2,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:39, grupo:'G', equipoLocal:'bel', equipoVisitante:'iri', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:40, grupo:'G', equipoLocal:'nzl', equipoVisitante:'egy', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:41, grupo:'G', equipoLocal:'bel', equipoVisitante:'nzl', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:42, grupo:'G', equipoLocal:'egy', equipoVisitante:'iri', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },

  // ── GRUPO H: España · Cabo Verde · Arabia Saudí · Uruguay ─
  { id:43, grupo:'H', equipoLocal:'esp', equipoVisitante:'cpv', golesLocal:0,    golesVisitante:0,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:44, grupo:'H', equipoLocal:'ksa', equipoVisitante:'uru', golesLocal:1,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:45, grupo:'H', equipoLocal:'esp', equipoVisitante:'ksa', golesLocal:1,    golesVisitante:0,    estado:'jugado',    goleadores:['Yamal'], asistidores:[] },
  { id:46, grupo:'H', equipoLocal:'uru', equipoVisitante:'cpv', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:47, grupo:'H', equipoLocal:'esp', equipoVisitante:'uru', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:48, grupo:'H', equipoLocal:'cpv', equipoVisitante:'ksa', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },

  // ── GRUPO I: Francia · Senegal · Irak · Noruega ──────────
  { id:49, grupo:'I', equipoLocal:'fra', equipoVisitante:'sen', golesLocal:3,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:50, grupo:'I', equipoLocal:'irq', equipoVisitante:'nor', golesLocal:1,    golesVisitante:4,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:51, grupo:'I', equipoLocal:'fra', equipoVisitante:'irq', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:52, grupo:'I', equipoLocal:'nor', equipoVisitante:'sen', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:53, grupo:'I', equipoLocal:'fra', equipoVisitante:'nor', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:54, grupo:'I', equipoLocal:'sen', equipoVisitante:'irq', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },

  // ── GRUPO J: Argentina · Argelia · Austria · Jordania ────
  { id:55, grupo:'J', equipoLocal:'arg', equipoVisitante:'alg', golesLocal:3,    golesVisitante:0,    estado:'jugado',    goleadores:['Messi','Messi','Messi'], asistidores:[] },
  { id:56, grupo:'J', equipoLocal:'aut', equipoVisitante:'jor', golesLocal:3,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:57, grupo:'J', equipoLocal:'arg', equipoVisitante:'aut', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:58, grupo:'J', equipoLocal:'jor', equipoVisitante:'alg', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:59, grupo:'J', equipoLocal:'arg', equipoVisitante:'jor', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:60, grupo:'J', equipoLocal:'alg', equipoVisitante:'aut', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },

  // ── GRUPO K: Portugal · RD Congo · Uzbekistán · Colombia ─
  { id:61, grupo:'K', equipoLocal:'por', equipoVisitante:'cod', golesLocal:1,    golesVisitante:1,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:62, grupo:'K', equipoLocal:'uzb', equipoVisitante:'col', golesLocal:1,    golesVisitante:3,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:63, grupo:'K', equipoLocal:'por', equipoVisitante:'uzb', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:64, grupo:'K', equipoLocal:'col', equipoVisitante:'cod', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:65, grupo:'K', equipoLocal:'por', equipoVisitante:'col', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:66, grupo:'K', equipoLocal:'cod', equipoVisitante:'uzb', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },

  // ── GRUPO L: Inglaterra · Croacia · Ghana · Panamá ───────
  { id:67, grupo:'L', equipoLocal:'eng', equipoVisitante:'cro', golesLocal:4,    golesVisitante:2,    estado:'jugado',    goleadores:[], asistidores:[] },
  { id:68, grupo:'L', equipoLocal:'gha', equipoVisitante:'pan', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:69, grupo:'L', equipoLocal:'eng', equipoVisitante:'gha', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:70, grupo:'L', equipoLocal:'pan', equipoVisitante:'cro', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:71, grupo:'L', equipoLocal:'eng', equipoVisitante:'pan', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
  { id:72, grupo:'L', equipoLocal:'cro', equipoVisitante:'gha', golesLocal:null, golesVisitante:null, estado:'pendiente', goleadores:[], asistidores:[] },
];