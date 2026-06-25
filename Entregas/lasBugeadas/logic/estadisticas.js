/**
 * estadisticas.js — Gestión de goleadores, asistidores y estadísticas del torneo
 */

/**
 * Calcula estadísticas generales del torneo
 * @param {Object} resultados - Todos los resultados
 * @param {Object} bracket - Estado del bracket
 * @returns {Object} Estadísticas resumidas
 */
function calcularEstadisticasTorneo(resultados, bracket) {
    let partidosJugados = 0;
    let golesTotal = 0;
    let gruposCompletos = 0;
  
    // Contar partidos de grupos jugados
    PARTIDOS_GRUPOS.forEach(partido => {
      const resultado = resultados[partido.id];
      if (resultado && resultado.jugado) {
        partidosJugados++;
        golesTotal += (resultado.golesLocal || 0) + (resultado.golesVisitante || 0);
      }
    });
  
    // Contar grupos completos
    getGrupos().forEach(grupo => {
      if (grupoCompleto(grupo, getPartidosPorGrupo(grupo), resultados)) {
        gruposCompletos++;
      }
    });
  
    // Contar partidos de playoffs
    if (bracket) {
      const rondasPlayoff = ['octavos', 'cuartos', 'semifinales', 'tercerPuesto', 'final'];
      rondasPlayoff.forEach(ronda => {
        (bracket[ronda] || []).forEach(partido => {
          if (partido.resultado) {
            partidosJugados++;
            golesTotal += (partido.resultado.gl || 0) + (partido.resultado.gv || 0);
          }
        });
      });
    }
  
    const promedioGoles = partidosJugados > 0
      ? (golesTotal / partidosJugados).toFixed(2)
      : '0.00';
  
    return {
      partidosJugados,
      golesTotal,
      promedioGoles,
      gruposCompletos,
      totalGrupos: 8,
    };
  }
  
  /**
   * Obtiene el ranking de goleadores con datos enriquecidos del equipo
   * @param {Object} todosGoleadores - Mapa { partidoId: [{ jugador, equipo, goles }] }
   * @returns {Array} Ranking ordenado
   */
  function getRankingGoleadores(todosGoleadores) {
    const ranking = calcularRankingGoleadores(todosGoleadores);
    const equiposMap = getEquiposMap();
  
    return ranking.map((item, i) => ({
      posicion: i + 1,
      jugador:  item.jugador,
      equipo:   item.equipo,
      equipoData: equiposMap[item.equipo] || null,
      goles:    item.goles,
    }));
  }
  
  /**
   * Obtiene el ranking de asistidores con datos enriquecidos del equipo
   * @param {Object} todosAsistidores - Mapa { partidoId: [{ jugador, equipo, asistencias }] }
   * @returns {Array} Ranking ordenado
   */
  function getRankingAsistidores(todosAsistidores) {
    const ranking = calcularRankingAsistidores(todosAsistidores);
    const equiposMap = getEquiposMap();
  
    return ranking.map((item, i) => ({
      posicion:    i + 1,
      jugador:     item.jugador,
      equipo:      item.equipo,
      equipoData:  equiposMap[item.equipo] || null,
      asistencias: item.asistencias,
    }));
  }
  
  /**
   * Busca el máximo goleador del torneo
   */
  function getMaximoGoleador(todosGoleadores) {
    const ranking = calcularRankingGoleadores(todosGoleadores);
    return ranking.length > 0 ? ranking[0] : null;
  }
  
  /**
   * Obtiene la lista de equipos con mayor cantidad de goles marcados
   */
  function getRankingGolesPorEquipo(resultados) {
    const golesEquipo = {};
  
    PARTIDOS_GRUPOS.forEach(partido => {
      const resultado = resultados[partido.id];
      if (!resultado || !resultado.jugado) return;
  
      const { golesLocal: gl, golesVisitante: gv } = resultado;
  
      golesEquipo[partido.local]     = (golesEquipo[partido.local]     || 0) + gl;
      golesEquipo[partido.visitante] = (golesEquipo[partido.visitante] || 0) + gv;
    });
  
    const equiposMap = getEquiposMap();
    return Object.entries(golesEquipo)
      .map(([id, goles]) => ({ equipo: equiposMap[id], goles }))
      .filter(e => e.equipo)
      .sort((a, b) => b.goles - a.goles);
  }
  
  /**
   * Obtiene los goleadores registrados en un partido específico
   */
  function getGoleadoresPartido(partidoId, todosGoleadores) {
    return todosGoleadores[partidoId] || [];
  }
  
  /**
   * Obtiene los asistidores registrados en un partido específico
   */
  function getAsistidoresPartido(partidoId, todosAsistidores) {
    return todosAsistidores[partidoId] || [];
  }
  