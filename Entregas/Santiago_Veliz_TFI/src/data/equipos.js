/**
 * /src/data/equipos.js
 * Grupos reales del Mundial 2026 (sorteo oficial, 5 dic 2025).
 * 48 selecciones en 12 grupos (A–L).
 * Escudos: banderas de flagcdn.com (uso libre).
 */

export const equipos = [
  // ── GRUPO A ──────────────────────────────────────────────
  { id:'mex', nombre:'México',            nombreCorto:'MEX', confederacion:'CONCACAF', grupo:'A', escudo:'https://flagcdn.com/w80/mx.png', rankingFifa:12, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Javier Aguirre', nacionalidad:'México' } } },
  { id:'rsa', nombre:'Sudáfrica',         nombreCorto:'RSA', confederacion:'CAF',      grupo:'A', escudo:'https://flagcdn.com/w80/za.png', rankingFifa:58, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Hugo Broos',    nacionalidad:'Bélgica' } } },
  { id:'kor', nombre:'Corea del Sur',     nombreCorto:'KOR', confederacion:'AFC',      grupo:'A', escudo:'https://flagcdn.com/w80/kr.png', rankingFifa:22, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Hong Myung-bo', nacionalidad:'Corea del Sur' } } },
  { id:'cze', nombre:'Chequia',           nombreCorto:'CZE', confederacion:'UEFA',     grupo:'A', escudo:'https://flagcdn.com/w80/cz.png', rankingFifa:37, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Ivan Hasek',    nacionalidad:'Chequia' } } },

  // ── GRUPO B ──────────────────────────────────────────────
  { id:'can', nombre:'Canadá',            nombreCorto:'CAN', confederacion:'CONCACAF', grupo:'B', escudo:'https://flagcdn.com/w80/ca.png', rankingFifa:48, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Jesse Marsch',  nacionalidad:'EEUU' } } },
  { id:'bih', nombre:'Bosnia y Herz.',    nombreCorto:'BIH', confederacion:'UEFA',     grupo:'B', escudo:'https://flagcdn.com/w80/ba.png', rankingFifa:61, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Sergej Barbarez', nacionalidad:'Bosnia' } } },
  { id:'qat', nombre:'Catar',             nombreCorto:'QAT', confederacion:'AFC',      grupo:'B', escudo:'https://flagcdn.com/w80/qa.png', rankingFifa:35, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Marquez Lopez', nacionalidad:'España' } } },
  { id:'sui', nombre:'Suiza',             nombreCorto:'SUI', confederacion:'UEFA',     grupo:'B', escudo:'https://flagcdn.com/w80/ch.png', rankingFifa:19, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Murat Yakin',   nacionalidad:'Suiza' } } },

  // ── GRUPO C ──────────────────────────────────────────────
  { id:'bra', nombre:'Brasil',            nombreCorto:'BRA', confederacion:'CONMEBOL', grupo:'C', escudo:'https://flagcdn.com/w80/br.png', rankingFifa:5,  estadisticasTorneo:stats(), wiki:{ mundialesGanados:5, aniosCampeon:[1958,1962,1970,1994,2002], directorTecnico:{ nombre:'Dorival Júnior', nacionalidad:'Brasil' } } },
  { id:'mar', nombre:'Marruecos',         nombreCorto:'MAR', confederacion:'CAF',      grupo:'C', escudo:'https://flagcdn.com/w80/ma.png', rankingFifa:13, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Walid Regragui',  nacionalidad:'Marruecos' } } },
  { id:'hai', nombre:'Haití',             nombreCorto:'HAI', confederacion:'CONCACAF', grupo:'C', escudo:'https://flagcdn.com/w80/ht.png', rankingFifa:83, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Marc Collat',    nacionalidad:'Francia' } } },
  { id:'sco', nombre:'Escocia',           nombreCorto:'SCO', confederacion:'UEFA',     grupo:'C', escudo:'https://flagcdn.com/w80/gb-sct.png', rankingFifa:39, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Steve Clarke',  nacionalidad:'Escocia' } } },

  // ── GRUPO D ──────────────────────────────────────────────
  { id:'usa', nombre:'Estados Unidos',    nombreCorto:'USA', confederacion:'CONCACAF', grupo:'D', escudo:'https://flagcdn.com/w80/us.png', rankingFifa:16, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Mauricio Pochettino', nacionalidad:'Argentina' } } },
  { id:'par', nombre:'Paraguay',          nombreCorto:'PAR', confederacion:'CONMEBOL', grupo:'D', escudo:'https://flagcdn.com/w80/py.png', rankingFifa:60, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Gustavo Alfaro',  nacionalidad:'Argentina' } } },
  { id:'aus', nombre:'Australia',         nombreCorto:'AUS', confederacion:'AFC',      grupo:'D', escudo:'https://flagcdn.com/w80/au.png', rankingFifa:24, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Tony Popovic',   nacionalidad:'Australia' } } },
  { id:'tur', nombre:'Turquía',           nombreCorto:'TUR', confederacion:'UEFA',     grupo:'D', escudo:'https://flagcdn.com/w80/tr.png', rankingFifa:29, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Vincenzo Montella', nacionalidad:'Italia' } } },

  // ── GRUPO E ──────────────────────────────────────────────
  { id:'ger', nombre:'Alemania',          nombreCorto:'GER', confederacion:'UEFA',     grupo:'E', escudo:'https://flagcdn.com/w80/de.png', rankingFifa:14, estadisticasTorneo:stats(), wiki:{ mundialesGanados:4, aniosCampeon:[1954,1974,1990,2014], directorTecnico:{ nombre:'Julian Nagelsmann', nacionalidad:'Alemania' } } },
  { id:'cur', nombre:'Curazao',           nombreCorto:'CUR', confederacion:'CONCACAF', grupo:'E', escudo:'https://flagcdn.com/w80/cw.png', rankingFifa:86, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Remko Bicentini', nacionalidad:'Curazao' } } },
  { id:'civ', nombre:'Costa de Marfil',   nombreCorto:'CIV', confederacion:'CAF',      grupo:'E', escudo:'https://flagcdn.com/w80/ci.png', rankingFifa:51, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Emerse Faé',     nacionalidad:'Costa de Marfil' } } },
  { id:'ecu', nombre:'Ecuador',           nombreCorto:'ECU', confederacion:'CONMEBOL', grupo:'E', escudo:'https://flagcdn.com/w80/ec.png', rankingFifa:44, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Sebastián Beccacece', nacionalidad:'Argentina' } } },

  // ── GRUPO F ──────────────────────────────────────────────
  { id:'ned', nombre:'Países Bajos',      nombreCorto:'NED', confederacion:'UEFA',     grupo:'F', escudo:'https://flagcdn.com/w80/nl.png', rankingFifa:7,  estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Ronald Koeman',  nacionalidad:'Países Bajos' } } },
  { id:'jpn', nombre:'Japón',             nombreCorto:'JPN', confederacion:'AFC',      grupo:'F', escudo:'https://flagcdn.com/w80/jp.png', rankingFifa:17, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Hajime Moriyasu', nacionalidad:'Japón' } } },
  { id:'swe', nombre:'Suecia',            nombreCorto:'SWE', confederacion:'UEFA',     grupo:'F', escudo:'https://flagcdn.com/w80/se.png', rankingFifa:25, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Jon Dahl Tomasson', nacionalidad:'Dinamarca' } } },
  { id:'tun', nombre:'Túnez',             nombreCorto:'TUN', confederacion:'CAF',      grupo:'F', escudo:'https://flagcdn.com/w80/tn.png', rankingFifa:34, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Faouzi Benzarti', nacionalidad:'Túnez' } } },

  // ── GRUPO G ──────────────────────────────────────────────
  { id:'bel', nombre:'Bélgica',           nombreCorto:'BEL', confederacion:'UEFA',     grupo:'G', escudo:'https://flagcdn.com/w80/be.png', rankingFifa:3,  estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Domenico Tedesco', nacionalidad:'Alemania' } } },
  { id:'egy', nombre:'Egipto',            nombreCorto:'EGY', confederacion:'CAF',      grupo:'G', escudo:'https://flagcdn.com/w80/eg.png', rankingFifa:32, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Hossam Hassan',  nacionalidad:'Egipto' } } },
  { id:'iri', nombre:'Irán',              nombreCorto:'IRI', confederacion:'AFC',      grupo:'G', escudo:'https://flagcdn.com/w80/ir.png', rankingFifa:23, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Amir Ghalenoei', nacionalidad:'Irán' } } },
  { id:'nzl', nombre:'Nueva Zelanda',     nombreCorto:'NZL', confederacion:'OFC',      grupo:'G', escudo:'https://flagcdn.com/w80/nz.png', rankingFifa:96, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Darren Bazeley', nacionalidad:'Nueva Zelanda' } } },

  // ── GRUPO H ──────────────────────────────────────────────
  { id:'esp', nombre:'España',            nombreCorto:'ESP', confederacion:'UEFA',     grupo:'H', escudo:'https://flagcdn.com/w80/es.png', rankingFifa:4,  estadisticasTorneo:stats(), wiki:{ mundialesGanados:1, aniosCampeon:[2010], directorTecnico:{ nombre:'Luis de la Fuente', nacionalidad:'España' } } },
  { id:'cpv', nombre:'Cabo Verde',        nombreCorto:'CPV', confederacion:'CAF',      grupo:'H', escudo:'https://flagcdn.com/w80/cv.png', rankingFifa:77, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Pedro Brito',    nacionalidad:'Cabo Verde' } } },
  { id:'ksa', nombre:'Arabia Saudí',      nombreCorto:'KSA', confederacion:'AFC',      grupo:'H', escudo:'https://flagcdn.com/w80/sa.png', rankingFifa:56, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Roberto Mancini', nacionalidad:'Italia' } } },
  { id:'uru', nombre:'Uruguay',           nombreCorto:'URU', confederacion:'CONMEBOL', grupo:'H', escudo:'https://flagcdn.com/w80/uy.png', rankingFifa:18, estadisticasTorneo:stats(), wiki:{ mundialesGanados:2, aniosCampeon:[1930,1950], directorTecnico:{ nombre:'Marcelo Bielsa', nacionalidad:'Argentina' } } },

  // ── GRUPO I ──────────────────────────────────────────────
  { id:'fra', nombre:'Francia',           nombreCorto:'FRA', confederacion:'UEFA',     grupo:'I', escudo:'https://flagcdn.com/w80/fr.png', rankingFifa:2,  estadisticasTorneo:stats(), wiki:{ mundialesGanados:2, aniosCampeon:[1998,2018], directorTecnico:{ nombre:'Didier Deschamps', nacionalidad:'Francia' } } },
  { id:'sen', nombre:'Senegal',           nombreCorto:'SEN', confederacion:'CAF',      grupo:'I', escudo:'https://flagcdn.com/w80/sn.png', rankingFifa:20, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Aliou Cissé',    nacionalidad:'Senegal' } } },
  { id:'irq', nombre:'Irak',              nombreCorto:'IRQ', confederacion:'AFC',      grupo:'I', escudo:'https://flagcdn.com/w80/iq.png', rankingFifa:55, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Jesús Casas',    nacionalidad:'España' } } },
  { id:'nor', nombre:'Noruega',           nombreCorto:'NOR', confederacion:'UEFA',     grupo:'I', escudo:'https://flagcdn.com/w80/no.png', rankingFifa:26, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Ståle Solbakken', nacionalidad:'Noruega' } } },

  // ── GRUPO J ──────────────────────────────────────────────
  { id:'arg', nombre:'Argentina',         nombreCorto:'ARG', confederacion:'CONMEBOL', grupo:'J', escudo:'https://flagcdn.com/w80/ar.png', rankingFifa:1,  estadisticasTorneo:stats(), wiki:{ mundialesGanados:3, aniosCampeon:[1978,1986,2022], directorTecnico:{ nombre:'Lionel Scaloni', nacionalidad:'Argentina' } } },
  { id:'alg', nombre:'Argelia',           nombreCorto:'ALG', confederacion:'CAF',      grupo:'J', escudo:'https://flagcdn.com/w80/dz.png', rankingFifa:42, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Vladimir Petkovic', nacionalidad:'Suiza' } } },
  { id:'aut', nombre:'Austria',           nombreCorto:'AUT', confederacion:'UEFA',     grupo:'J', escudo:'https://flagcdn.com/w80/at.png', rankingFifa:27, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Ralf Rangnick',  nacionalidad:'Alemania' } } },
  { id:'jor', nombre:'Jordania',          nombreCorto:'JOR', confederacion:'AFC',      grupo:'J', escudo:'https://flagcdn.com/w80/jo.png', rankingFifa:71, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Hussein Ammouta', nacionalidad:'Marruecos' } } },

  // ── GRUPO K ──────────────────────────────────────────────
  { id:'por', nombre:'Portugal',          nombreCorto:'POR', confederacion:'UEFA',     grupo:'K', escudo:'https://flagcdn.com/w80/pt.png', rankingFifa:6,  estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Roberto Martínez', nacionalidad:'España' } } },
  { id:'cod', nombre:'RD Congo',          nombreCorto:'COD', confederacion:'CAF',      grupo:'K', escudo:'https://flagcdn.com/w80/cd.png', rankingFifa:50, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Sébastien Desabre', nacionalidad:'Francia' } } },
  { id:'uzb', nombre:'Uzbekistán',        nombreCorto:'UZB', confederacion:'AFC',      grupo:'K', escudo:'https://flagcdn.com/w80/uz.png', rankingFifa:65, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Srecko Katanec',  nacionalidad:'Eslovenia' } } },
  { id:'col', nombre:'Colombia',          nombreCorto:'COL', confederacion:'CONMEBOL', grupo:'K', escudo:'https://flagcdn.com/w80/co.png', rankingFifa:9,  estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Néstor Lorenzo',  nacionalidad:'Argentina' } } },

  // ── GRUPO L ──────────────────────────────────────────────
  { id:'eng', nombre:'Inglaterra',        nombreCorto:'ENG', confederacion:'UEFA',     grupo:'L', escudo:'https://flagcdn.com/w80/gb-eng.png', rankingFifa:5, estadisticasTorneo:stats(), wiki:{ mundialesGanados:1, aniosCampeon:[1966], directorTecnico:{ nombre:'Thomas Tuchel',  nacionalidad:'Alemania' } } },
  { id:'cro', nombre:'Croacia',           nombreCorto:'CRO', confederacion:'UEFA',     grupo:'L', escudo:'https://flagcdn.com/w80/hr.png', rankingFifa:10, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Zlatko Dalic',   nacionalidad:'Croacia' } } },
  { id:'gha', nombre:'Ghana',             nombreCorto:'GHA', confederacion:'CAF',      grupo:'L', escudo:'https://flagcdn.com/w80/gh.png', rankingFifa:64, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Otto Addo',      nacionalidad:'Ghana' } } },
  { id:'pan', nombre:'Panamá',            nombreCorto:'PAN', confederacion:'CONCACAF', grupo:'L', escudo:'https://flagcdn.com/w80/pa.png', rankingFifa:54, estadisticasTorneo:stats(), wiki:{ mundialesGanados:0, aniosCampeon:[], directorTecnico:{ nombre:'Thomas Christiansen', nacionalidad:'Alemania' } } },
];

/** Estadísticas iniciales en cero (se recalculan desde partidos). */
function stats() {
  return {
    puntos:0, partidosJugados:0, partidosGanados:0,
    partidosEmpatados:0, partidosPerdidos:0,
    golesFavor:0, golesContra:0, diferenciaGoles:0,
  };
}

export function obtenerEquipoPorId(id) {
  return equipos.find(e => e.id === id);
}

export function obtenerEquiposPorGrupo(grupo) {
  return equipos.filter(e => e.grupo === grupo);
}

export function obtenerListaDeGrupos() {
  return [...new Set(equipos.map(e => e.grupo))].sort();
}