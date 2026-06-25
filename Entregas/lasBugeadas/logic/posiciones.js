/**
 * posiciones.js — Cálculo de tablas de posiciones con desempates FIFA
 * Lógica pura: sin manipulación del DOM
 */

/** ── Constantes de puntuación ── */
const PUNTOS = { VICTORIA: 3, EMPATE: 1, DERROTA: 0 };

/**
 * Calcula la tabla de posiciones de un grupo a partir de los partidos y resultados.
 * @param {string} grupo - Letra del grupo (ej: 'A')
 * @param {Array} partidos - Partidos de ese grupo
 * @param {Object} resultados - Mapa de resultados { [partidoId]: resultado }
 * @returns {Array} Tabla ordenada con estadísticas
 */
function calcularTablaGrupo(grupo, partidos, resultados) {
  // 1. Inicializar estadísticas vacías para cada equipo
  const equiposGrupo = getEquiposPorGrupo(grupo);
  const stats = {};

  equiposGrupo.forEach(eq => {
    stats[eq.id] = {
      equipo:  eq,
      pj: 0, pg: 0, pe: 0, pp: 0,
      gf: 0, gc: 0, dg: 0, pts: 0,
      // Para desempate por enfrentamiento directo
      directos: {},
    };
  });

  // 2. Procesar resultados de partidos jugados
  partidos.forEach(partido => {
    const resultado = resultados[partido.id];
    if (!resultado || !resultado.jugado) return;

    const { golesLocal: gl, golesVisitante: gv } = resultado;
    const loc = partido.local;
    const vis = partido.visitante;

    if (!stats[loc] || !stats[vis]) return;

    // Partidos jugados
    stats[loc].pj++;
    stats[vis].pj++;

    // Goles
    stats[loc].gf += gl;
    stats[loc].gc += gv;
    stats[vis].gf += gv;
    stats[vis].gc += gl;

    // Diferencia de goles
    stats[loc].dg = stats[loc].gf - stats[loc].gc;
    stats[vis].dg = stats[vis].gf - stats[vis].gc;

    // Resultado
    if (gl > gv) {
      // Victoria local
      stats[loc].pg++;  stats[loc].pts += PUNTOS.VICTORIA;
      stats[vis].pp++;
    } else if (gl < gv) {
      // Victoria visitante
      stats[vis].pg++;  stats[vis].pts += PUNTOS.VICTORIA;
      stats[loc].pp++;
    } else {
      // Empate
      stats[loc].pe++;  stats[loc].pts += PUNTOS.EMPATE;
      stats[vis].pe++;  stats[vis].pts += PUNTOS.EMPATE;
    }

    // Guardar resultado del enfrentamiento directo
    _registrarEnfrentamientoDirecto(stats, loc, vis, gl, gv);
  });

  // 3. Ordenar con criterios FIFA
  return ordenarTablaFIFA(Object.values(stats), partidos, resultados);
}

/**
 * Registra el enfrentamiento directo entre dos equipos
 * (usado como criterio de desempate)
 */
function _registrarEnfrentamientoDirecto(stats, local, visitante, golesLocal, golesVisitante) {
  if (!stats[local].directos[visitante]) {
    stats[local].directos[visitante]  = { pj: 0, pts: 0, gf: 0, gc: 0, dg: 0 };
  }
  if (!stats[visitante].directos[local]) {
    stats[visitante].directos[local] = { pj: 0, pts: 0, gf: 0, gc: 0, dg: 0 };
  }

  stats[local].directos[visitante].pj++;
  stats[local].directos[visitante].gf += golesLocal;
  stats[local].directos[visitante].gc += golesVisitante;
  stats[local].directos[visitante].dg  = stats[local].directos[visitante].gf - stats[local].directos[visitante].gc;

  stats[visitante].directos[local].pj++;
  stats[visitante].directos[local].gf += golesVisitante;
  stats[visitante].directos[local].gc += golesLocal;
  stats[visitante].directos[local].dg  = stats[visitante].directos[local].gf - stats[visitante].directos[local].gc;

  if (golesLocal > golesVisitante) {
    stats[local].directos[visitante].pts    += PUNTOS.VICTORIA;
    stats[visitante].directos[local].pts    += PUNTOS.DERROTA;
  } else if (golesLocal < golesVisitante) {
    stats[visitante].directos[local].pts    += PUNTOS.VICTORIA;
    stats[local].directos[visitante].pts    += PUNTOS.DERROTA;
  } else {
    stats[local].directos[visitante].pts    += PUNTOS.EMPATE;
    stats[visitante].directos[local].pts    += PUNTOS.EMPATE;
  }
}

/**
 * Criterio 1 — Puntos totales
 */
function criterio_puntos(a, b) {
  return b.pts - a.pts;
}

/**
 * Criterio 2 — Diferencia de goles general
 */
function criterio_diferencia_goles(a, b) {
  return b.dg - a.dg;
}

/**
 * Criterio 3 — Goles a favor
 */
function criterio_goles_favor(a, b) {
  return b.gf - a.gf;
}

/**
 * Criterio 4 — Enfrentamiento directo (entre empatados)
 * Aplica solo cuando exactamente dos equipos están empatados
 */
function criterio_enfrentamiento_directo(a, b) {
  const dirA = a.directos[b.equipo.id];
  const dirB = b.directos[a.equipo.id];

  if (!dirA || !dirB) return 0;

  // Puntos en el enfrentamiento directo
  if (dirA.pts !== dirB.pts) return dirA.pts - dirB.pts;
  // DG en el enfrentamiento directo
  if (dirA.dg !== dirB.dg) return dirA.dg - dirB.dg;
  // GF en el enfrentamiento directo
  return dirA.gf - dirB.gf;
}

/**
 * Criterio 5 — Sorteo / criterio alfabético (fallback de la cátedra)
 */
function criterio_sorteo(a, b) {
  return a.equipo.nombre.localeCompare(b.equipo.nombre);
}

/**
 * Ordena la tabla aplicando los criterios FIFA en orden de prioridad.
 * Cuando un grupo de equipos está completamente empatado en pts+dg+gf,
 * se aplica enfrentamiento directo dentro de ese subgrupo.
 */
function ordenarTablaFIFA(equipos, _partidos, _resultados) {
  // Primera pasada: ordenar por criterios generales
  const ordenados = [...equipos].sort((a, b) => {
    let cmp = criterio_puntos(a, b);
    if (cmp !== 0) return cmp;

    cmp = criterio_diferencia_goles(a, b);
    if (cmp !== 0) return cmp;

    cmp = criterio_goles_favor(a, b);
    if (cmp !== 0) return cmp;

    // Enfrentamiento directo (válido solo entre pares)
    cmp = criterio_enfrentamiento_directo(a, b);
    if (cmp !== 0) return cmp;

    return criterio_sorteo(a, b);
  });

  return ordenados;
}

/**
 * Retorna los dos primeros clasificados de un grupo
 */
function getClasificados(grupo, partidos, resultados) {
  const tabla = calcularTablaGrupo(grupo, partidos, resultados);
  return { primero: tabla[0], segundo: tabla[1] };
}

/**
 * Verifica si todos los partidos de un grupo están jugados
 */
function grupoCompleto(grupo, partidos, resultados) {
  const partidosGrupo = partidos.filter(p => p.grupo === grupo);
  return partidosGrupo.every(p => resultados[p.id] && resultados[p.id].jugado);
}

/**
 * Calcula el ranking de goleadores del torneo
 */
function calcularRankingGoleadores(todosGoleadores) {
  const acumulado = {};

  Object.values(todosGoleadores).forEach(goleadoresPartido => {
    goleadoresPartido.forEach(({ jugador, equipo, goles }) => {
      if (!jugador.trim()) return;
      const key = `${jugador.trim()}|${equipo}`;
      if (!acumulado[key]) {
        acumulado[key] = { jugador: jugador.trim(), equipo, goles: 0 };
      }
      acumulado[key].goles += Number(goles) || 0;
    });
  });

  return Object.values(acumulado)
    .filter(g => g.goles > 0)
    .sort((a, b) => b.goles - a.goles);
}

/**
 * Calcula el ranking de asistidores del torneo
 */
function calcularRankingAsistidores(todosAsistidores) {
  const acumulado = {};

  Object.values(todosAsistidores).forEach(asistidoresPartido => {
    asistidoresPartido.forEach(({ jugador, equipo, asistencias }) => {
      if (!jugador.trim()) return;
      const key = `${jugador.trim()}|${equipo}`;
      if (!acumulado[key]) {
        acumulado[key] = { jugador: jugador.trim(), equipo, asistencias: 0 };
      }
      acumulado[key].asistencias += Number(asistencias) || 0;
    });
  });

  return Object.values(acumulado)
    .filter(a => a.asistencias > 0)
    .sort((a, b) => b.asistencias - a.asistencias);
}
