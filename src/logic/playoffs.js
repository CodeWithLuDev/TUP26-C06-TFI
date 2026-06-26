import { obtenerClasificados, obtenerMejoresTerceros } from "./posiciones.js";
import { EQUIPOS } from "../data/equipos.js";

const GRUPOS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

// Round of 32: fixed pairings (FIFA 2026 regulations)
// 1A vs 3CEFHI, 1B vs 3EFGIJ, 1C vs 2F, 1D vs 3BEFIJ,
// 1E vs 3ABCDF, 1F vs 2C, 1G vs 3AEHIJ, 1H vs 2J,
// 1I vs 3CDFGH, 1J vs 2H, 1K vs 3DEIJL, 1L vs 3EHIJK,
// 2A vs 2B, 2D vs 2G, 2E vs 2I, 2K vs 2L
const R32_POOLS = {
  "M74": { local: "1E", pools: ["A","B","C","D","F"] },
  "M77": { local: "1I", pools: ["C","D","F","G","H"] },
  "M79": { local: "1A", pools: ["C","E","F","H","I"] },
  "M80": { local: "1L", pools: ["E","H","I","J","K"] },
  "M81": { local: "1D", pools: ["B","E","F","I","J"] },
  "M82": { local: "1G", pools: ["A","E","H","I","J"] },
  "M85": { local: "1B", pools: ["E","F","G","I","J"] },
  "M87": { local: "1K", pools: ["D","E","I","J","L"] },
};

const R32_FIJOS = {
  "M73": { local: "2A", visitante: "2B" },
  "M75": { local: "1F", visitante: "2C" },
  "M76": { local: "1C", visitante: "2F" },
  "M78": { local: "2E", visitante: "2I" },
  "M83": { local: "2K", visitante: "2L" },
  "M84": { local: "1H", visitante: "2J" },
  "M86": { local: "1J", visitante: "2H" },
  "M88": { local: "2D", visitante: "2G" },
};

const AVANCE = {
  "M89": { local: "M74", visitante: "M77" },
  "M90": { local: "M73", visitante: "M75" },
  "M91": { local: "M83", visitante: "M84" },
  "M92": { local: "M81", visitante: "M82" },
  "M93": { local: "M76", visitante: "M78" },
  "M94": { local: "M79", visitante: "M80" },
  "M95": { local: "M86", visitante: "M88" },
  "M96": { local: "M85", visitante: "M87" },
  "M97": { local: "M89", visitante: "M90" },
  "M98": { local: "M93", visitante: "M94" },
  "M99": { local: "M91", visitante: "M92" },
  "M100":{ local: "M95", visitante: "M96" },
  "M101":{ local: "M97", visitante: "M98" },
  "M102":{ local: "M99", visitante: "M100" },
  "M104":{ local: "M101", visitante: "M102" },
};

export function obtenerGanador(partido) {
  if (!partido?.resultado) return null;
  const { golesLocal, golesVisitante } = partido.resultado;
  if (golesLocal > golesVisitante) return partido.localId;
  if (golesVisitante > golesLocal) return partido.visitanteId;
  return null;
}

export function obtenerPerdedor(partido) {
  if (!partido?.resultado) return null;
  const ganador = obtenerGanador(partido);
  if (!ganador) return null;
  return ganador === partido.localId ? partido.visitanteId : partido.localId;
}

function resolverPos(clave, clasificados) {
  if (!clave) return null;
  if (clave === "1A") return clasificados["1A"];
  if (clave === "2A") return clasificados["2A"];
  const m = clave.match(/^([A-Z])(\d)$/);
  if (m) return clasificados[`${m[2]}${m[1]}`];
  return null;
}

function asignarTerceros(bracket, clasificados, mejoresTerceros, partidosMap) {
  // Build map of which third-placed teams advanced, keyed by group
  const tercerosAvanzan = {};
  for (const t of mejoresTerceros) {
    tercerosAvanzan[t.grupo] = t.equipoId;
  }

  // For each match needing a third-placed team, find the best eligible
  const usados = new Set();
  for (const [matchId, cfg] of Object.entries(R32_POOLS)) {
    const localId = clasificados[cfg.local];
    if (!localId) continue;
    const elegibles = cfg.pools
      .filter(g => tercerosAvanzan[g] && !usados.has(tercerosAvanzan[g]))
      .map(g => ({ grupo: g, equipoId: tercerosAvanzan[g] }));
    // Rank eligible third-placed teams by overall ranking among best third
    const ranked = elegibles
      .map(e => ({
        ...e,
        rank: mejoresTerceros.findIndex(t => t.grupo === e.grupo)
      }))
      .sort((a, b) => a.rank - b.rank);
    if (ranked.length > 0 && bracket[matchId]) {
      bracket[matchId].visitanteId = ranked[0].equipoId;
      usados.add(ranked[0].equipoId);
    }
  }
}

export function construirBracket(partidosMap) {
  const bracket = {};
  const clasificados = {};

  // Get all group classifications
  for (const grupo of GRUPOS) {
    const ids = EQUIPOS.filter(e => e.grupo === grupo).map(e => e.id);
    const partidos = Object.values(partidosMap).filter(p => p.grupo === grupo);
    const { primero, segundo } = obtenerClasificados(ids, partidos);
    clasificados[`1${grupo}`] = primero;
    clasificados[`2${grupo}`] = segundo;
  }

  // Build all matches from templates
  const allIds = ["M73","M74","M75","M76","M77","M78","M79","M80",
                  "M81","M82","M83","M84","M85","M86","M87","M88",
                  "M89","M90","M91","M92","M93","M94","M95","M96",
                  "M97","M98","M99","M100","M101","M102","M103","M104"];
  for (const id of allIds) {
    const base = Object.values(partidosMap).find(p => p.id === id) || {};
    bracket[id] = { ...base, localId: null, visitanteId: null };
  }

  // Assign fixed R32 matches
  for (const [matchId, cfg] of Object.entries(R32_FIJOS)) {
    if (bracket[matchId]) {
      bracket[matchId].localId = resolverPos(cfg.local, clasificados);
      bracket[matchId].visitanteId = resolverPos(cfg.visitante, clasificados);
    }
  }

  // Assign third-placed team to R32 matches that need them
  const mejoresTerceros = obtenerMejoresTerceros(partidosMap);
  asignarTerceros(bracket, clasificados, mejoresTerceros, partidosMap);

  // Assign winner-based matches (R16, QF, SF, Final)
  const avanceIds = ["M89","M90","M91","M92","M93","M94","M95","M96",
                     "M97","M98","M99","M100","M101","M102","M104"];
  for (const id of avanceIds) {
    const fuentes = AVANCE[id];
    if (!fuentes) continue;
    const pLocal = bracket[fuentes.local];
    const pVisit = bracket[fuentes.visitante];
    if (bracket[id]) {
      bracket[id].localId = obtenerGanador(pLocal) ?? null;
      bracket[id].visitanteId = obtenerGanador(pVisit) ?? null;
    }
  }

  // Third place match: losers of semifinals
  if (bracket["M103"]) {
    const sem1 = bracket["M101"];
    const sem2 = bracket["M102"];
    bracket["M103"].localId = obtenerPerdedor(sem1) ?? null;
    bracket["M103"].visitanteId = obtenerPerdedor(sem2) ?? null;
  }

  return bracket;
}
