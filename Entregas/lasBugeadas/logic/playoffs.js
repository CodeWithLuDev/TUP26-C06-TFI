/**
 * playoffs.js — Lógica de generación y actualización del bracket eliminatorio
 * Determina clasificados, arma llaves y propaga resultados
 */

/**
 * Genera o actualiza el estado del bracket de playoffs.
 * @param {Object} resultados - Todos los resultados de grupos
 * @param {Object} playoffsGuardados - Estado guardado de playoffs (puede ser null)
 * @returns {Object} Estado completo del bracket
 */
function generarBracket(resultados, playoffsGuardados) {
    const grupos = getGrupos();
    const clasificados = {};
  
    // Determinar clasificados de cada grupo
    grupos.forEach(grupo => {
      const partidos = getPartidosPorGrupo(grupo);
      const tabla = calcularTablaGrupo(grupo, partidos, resultados);
  
      // Solo asignar clasificados si hay al menos datos mínimos
      clasificados[grupo] = {
        primero: tabla[0]?.equipo || null,
        segundo: tabla[1]?.equipo || null,
        completo: grupoCompleto(grupo, partidos, resultados),
      };
    });
  
    // Construir estructura de partidos de playoffs
    const bracket = {
      clasificados,
      octavos:      [],
      cuartos:      [],
      semifinales:  [],
      tercerPuesto: [],
      final:        [],
    };
  
    // ── Octavos de final ──────────────────────────────────────
    // Cruce oficial del Mundial: 1A vs 2B, 1C vs 2D, etc.
    const crucesOctavos = [
      { id: 'R16_1', local: clasificados['A']?.primero, visitante: clasificados['B']?.segundo },
      { id: 'R16_2', local: clasificados['C']?.primero, visitante: clasificados['D']?.segundo },
      { id: 'R16_3', local: clasificados['B']?.primero, visitante: clasificados['A']?.segundo },
      { id: 'R16_4', local: clasificados['D']?.primero, visitante: clasificados['C']?.segundo },
      { id: 'R16_5', local: clasificados['E']?.primero, visitante: clasificados['F']?.segundo },
      { id: 'R16_6', local: clasificados['G']?.primero, visitante: clasificados['H']?.segundo },
      { id: 'R16_7', local: clasificados['F']?.primero, visitante: clasificados['E']?.segundo },
      { id: 'R16_8', local: clasificados['H']?.primero, visitante: clasificados['G']?.segundo },
    ];
  
    crucesOctavos.forEach((cruce, i) => {
      const guardado = playoffsGuardados?.octavos?.[i] || null;
      bracket.octavos.push({
        ...ESTRUCTURA_PLAYOFFS.octavos[i],
        local:      cruce.local,
        visitante:  cruce.visitante,
        resultado:  guardado?.resultado || null,
        ganador:    guardado?.ganador   || null,
      });
    });
  
    // ── Cuartos de final ─────────────────────────────────────
    // Ganadores: R16_1 vs R16_2, R16_3 vs R16_4, R16_5 vs R16_6, R16_7 vs R16_8
    const paresOctavos = [[0,1],[2,3],[4,5],[6,7]];
    paresOctavos.forEach(([ia, ib], i) => {
      const guardado = playoffsGuardados?.cuartos?.[i] || null;
      bracket.cuartos.push({
        ...ESTRUCTURA_PLAYOFFS.cuartos[i],
        local:     bracket.octavos[ia]?.ganador || null,
        visitante: bracket.octavos[ib]?.ganador || null,
        resultado: guardado?.resultado || null,
        ganador:   guardado?.ganador   || null,
      });
    });
  
    // ── Semifinales ───────────────────────────────────────────
    const paresCuartos = [[0,1],[2,3]];
    paresCuartos.forEach(([ia, ib], i) => {
      const guardado = playoffsGuardados?.semifinales?.[i] || null;
      bracket.semifinales.push({
        ...ESTRUCTURA_PLAYOFFS.semifinales[i],
        local:     bracket.cuartos[ia]?.ganador || null,
        visitante: bracket.cuartos[ib]?.ganador || null,
        resultado: guardado?.resultado || null,
        ganador:   guardado?.ganador   || null,
        perdedor:  guardado?.perdedor  || null,
      });
    });
  
    // ── Tercer Puesto ─────────────────────────────────────────
    const guardadoTP = playoffsGuardados?.tercerPuesto?.[0] || null;
    bracket.tercerPuesto.push({
      ...ESTRUCTURA_PLAYOFFS.tercerPuesto[0],
      local:     bracket.semifinales[0]?.perdedor || null,
      visitante: bracket.semifinales[1]?.perdedor || null,
      resultado: guardadoTP?.resultado || null,
      ganador:   guardadoTP?.ganador   || null,
    });
  
    // ── Final ─────────────────────────────────────────────────
    const guardadoFin = playoffsGuardados?.final?.[0] || null;
    bracket.final.push({
      ...ESTRUCTURA_PLAYOFFS.final[0],
      local:     bracket.semifinales[0]?.ganador || null,
      visitante: bracket.semifinales[1]?.ganador || null,
      resultado: guardadoFin?.resultado || null,
      ganador:   guardadoFin?.ganador   || null,
      campeon:   guardadoFin?.ganador   || null,
    });
  
    return bracket;
  }
  
  /**
   * Registra el resultado de un partido de playoffs y determina el ganador.
   * En playoff, si hay empate se requiere definición (tiempo extra o penales).
   *
   * @param {Object} bracket - Estado actual del bracket
   * @param {string} ronda - 'octavos' | 'cuartos' | 'semifinales' | 'tercerPuesto' | 'final'
   * @param {number} indice - Índice del partido en la ronda
   * @param {Object} resultado - { golesLocal, golesVisitante, tipoResultado, golesLocalPenales, golesVisitantePenales }
   * @returns {Object} Bracket actualizado
   */
  function registrarResultadoPlayoff(bracket, ronda, indice, resultado) {
    const partido = bracket[ronda][indice];
    if (!partido) return bracket;
  
    const { golesLocal: gl, golesVisitante: gv, tipoResultado, golesLocalPenales, golesVisitantePenales } = resultado;
  
    let ganador  = null;
    let perdedor = null;
  
    if (gl > gv) {
      ganador  = partido.local;
      perdedor = partido.visitante;
    } else if (gl < gv) {
      ganador  = partido.visitante;
      perdedor = partido.local;
    } else {
      // Empate en tiempo regular → se necesita definición
      if (tipoResultado === 'penales') {
        const penL = Number(golesLocalPenales)    || 0;
        const penV = Number(golesVisitantePenales) || 0;
        ganador  = penL >= penV ? partido.local : partido.visitante;
        perdedor = ganador === partido.local ? partido.visitante : partido.local;
      } else {
        // Tiempo extra (prórroga)
        ganador  = partido.local;  // fallback; debería determinarse con goles extra
        perdedor = partido.visitante;
      }
    }
  
    // Clonar bracket para inmutabilidad
    const nuevoBracket = JSON.parse(JSON.stringify(bracket));
    nuevoBracket[ronda][indice].resultado = { gl, gv, tipoResultado, golesLocalPenales, golesVisitantePenales };
    nuevoBracket[ronda][indice].ganador  = ganador;
    nuevoBracket[ronda][indice].perdedor = perdedor;
  
    // Propagar ganador a la siguiente ronda
    nuevoBracket = propagarGanador(nuevoBracket, ronda, indice, ganador, perdedor);
  
    return nuevoBracket;
  }
  
  /**
   * Propaga el ganador de un partido a la siguiente ronda del bracket.
   */
  function propagarGanador(bracket, rondaActual, indiceActual, ganador, perdedor) {
    const siguienteRonda = {
      octavos:     'cuartos',
      cuartos:     'semifinales',
      semifinales: null, // se bifurca en final y tercerPuesto
    };
  
    if (rondaActual === 'semifinales') {
      // Ganadores van a la final, perdedores al tercer puesto
      const slotFinal       = 0;
      const slotTercerPuesto = 0;
  
      if (indiceActual === 0) {
        bracket.final[slotFinal].local        = ganador;
        bracket.tercerPuesto[slotTercerPuesto].local = perdedor;
      } else {
        bracket.final[slotFinal].visitante        = ganador;
        bracket.tercerPuesto[slotTercerPuesto].visitante = perdedor;
      }
      return bracket;
    }
  
    const siguiente = siguienteRonda[rondaActual];
    if (!siguiente) return bracket;
  
    // Calcular slot en la siguiente ronda
    const slotSiguiente = Math.floor(indiceActual / 2);
    const esLocal       = indiceActual % 2 === 0;
  
    if (bracket[siguiente][slotSiguiente]) {
      if (esLocal) {
        bracket[siguiente][slotSiguiente].local     = ganador;
      } else {
        bracket[siguiente][slotSiguiente].visitante = ganador;
      }
    }
  
    return bracket;
  }
  
  /**
   * Verifica si todos los grupos están completos (para habilitar playoffs)
   */
  function puedeIniciarPlayoffs(resultados) {
    const grupos = getGrupos();
    return grupos.every(grupo => {
      const partidos = getPartidosPorGrupo(grupo);
      return grupoCompleto(grupo, partidos, resultados);
    });
  }
  
  /**
   * Obtiene la etiqueta legible de una ronda
   */
  function etiquetaRonda(ronda) {
    const etiquetas = {
      octavos:      'Octavos de Final',
      cuartos:      'Cuartos de Final',
      semifinales:  'Semifinales',
      tercerPuesto: 'Tercer Puesto',
      final:        'Final',
    };
    return etiquetas[ronda] || ronda;
  }
  
  /**
   * Obtiene el ícono de una ronda
   */
  function iconoRonda(ronda) {
    const iconos = {
      octavos:      '⚽',
      cuartos:      '🔥',
      semifinales:  '⚡',
      tercerPuesto: '🥉',
      final:        '🏆',
    };
    return iconos[ronda] || '🏅';
  }
  