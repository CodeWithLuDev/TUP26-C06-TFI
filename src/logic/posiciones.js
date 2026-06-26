import { EQUIPOS } from "../data/equipos.js";

// FIFA Ranking (aproximado junio 2026) para desempate
const RANKING = {
  ARG:1, FRA:2, BRA:3, ENG:4, BEL:5, POR:6, NED:7, ESP:8, ITA:9, GER:10,
  CRO:11, MAR:12, USA:13, MEX:14, URU:15, COL:16, SEN:17, SUI:18, JPN:19,
  SWE:20, TUR:21, IRN:22, KOR:23, AUS:24, UKR:25, AUT:26, POL:27, ECU:28,
  WAL:29, DEN:30, ALG:31, EGY:32, SCO:33, CZE:34, NOR:35, CMR:36, MLI:37,
  PAN:38, PAR:39, BFA:40, RSA:41, CAN:42, IRQ:43, GHA:44, KSA:45, CIV:46,
  COD:47, TUN:48, CPV:49, BIH:50, UZB:51, NZL:52, JOR:53, HAI:54, QAT:55,
  CUW:56,
};

function calcularPuntosFairPlay(equipoId, partidos) {
  let puntos = 0;
  for (const p of partidos) {
    if (!p.resultado?.tarjetas) continue;
    const esLocal = p.localId === equipoId;
    const tarjetas = p.resultado.tarjetas;
    if (esLocal) {
      puntos += (tarjetas.localAmarillas || 0) * -1;
      puntos += (tarjetas.localRojas || 0) * -4;
    } else if (p.visitanteId === equipoId) {
      puntos += (tarjetas.visitanteAmarillas || 0) * -1;
      puntos += (tarjetas.visitanteRojas || 0) * -4;
    }
  }
  return puntos;
}

export function calcularEstadisticasEquipo(equipoId, partidos) {
  const stats = { equipoId, pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 };
  for (const p of partidos) {
    if (!p.resultado) continue;
    const esLocal = p.localId === equipoId;
    const esVisitante = p.visitanteId === equipoId;
    if (!esLocal && !esVisitante) continue;
    const { golesLocal, golesVisitante } = p.resultado;
    const gf = esLocal ? golesLocal : golesVisitante;
    const gc = esLocal ? golesVisitante : golesLocal;
    stats.pj++; stats.gf += gf; stats.gc += gc;
    if (gf > gc) { stats.pg++; stats.pts += 3; }
    else if (gf === gc) { stats.pe++; stats.pts += 1; }
    else { stats.pp++; }
  }
  stats.dg = stats.gf - stats.gc;
  const fp = calcularPuntosFairPlay(equipoId, partidos);
  stats.fairPlay = fp;
  stats.ranking = RANKING[equipoId] || 999;
  return stats;
}

export function ordenarTabla(equiposGrupo, partidosGrupo) {
  const tabla = equiposGrupo.map(id =>
    calcularEstadisticasEquipo(id, partidosGrupo)
  );
  tabla.sort((a, b) => {
    if (a.pts !== b.pts) return b.pts - a.pts;

    // Directos entre todos los empatados en puntos
    const empatados = tabla.filter(x => x.pts === a.pts);
    if (empatados.length > 1) {
      const idsEmp = empatados.map(x => x.equipoId);
      const partidosEmp = partidosGrupo.filter(p =>
        p.resultado &&
        idsEmp.includes(p.localId) &&
        idsEmp.includes(p.visitanteId)
      );
      const dirA = calcularEstadisticasEquipo(a.equipoId, partidosEmp);
      const dirB = calcularEstadisticasEquipo(b.equipoId, partidosEmp);
      const difPtsDir = dirB.pts - dirA.pts;
      if (difPtsDir !== 0) return difPtsDir;
      const difDgDir = dirB.dg - dirA.dg;
      if (difDgDir !== 0) return difDgDir;
      const difGfDir = dirB.gf - dirA.gf;
      if (difGfDir !== 0) return difGfDir;
    }

    if (a.dg !== b.dg) return b.dg - a.dg;
    if (a.gf !== b.gf) return b.gf - a.gf;
    const fp = (b.fairPlay || 0) - (a.fairPlay || 0);
    if (fp !== 0) return fp;
    return (a.ranking || 999) - (b.ranking || 999);
  });
  return tabla;
}

export function obtenerClasificados(equiposGrupo, partidosGrupo) {
  const tabla = ordenarTabla(equiposGrupo, partidosGrupo);
  return {
    primero: tabla[0]?.equipoId || null,
    segundo: tabla[1]?.equipoId || null,
    tercero: tabla[2]?.equipoId || null,
    statsTercero: tabla[2] || null,
  };
}

export function obtenerMejoresTerceros(partidosMap) {
  const grupos = ["A","B","C","D","E","F","G","H","I","J","K","L"];
  const terceros = [];
  for (const letra of grupos) {
    const equiposGrupo = EQUIPOS.filter(e => e.grupo === letra).map(e => e.id);
    const partidosGrupo = Object.values(partidosMap).filter(p => p.grupo === letra);
    const tabla = ordenarTabla(equiposGrupo, partidosGrupo);
    if (tabla.length >= 3) {
      terceros.push({ grupo: letra, ...tabla[2] });
    }
  }
  terceros.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.dg !== a.dg) return b.dg - a.dg;
    if (b.gf !== a.gf) return b.gf - a.gf;
    const fp = (b.fairPlay || 0) - (a.fairPlay || 0);
    if (fp !== 0) return fp;
    return (a.ranking || 999) - (b.ranking || 999);
  });
  return terceros.slice(0, 8);
}
