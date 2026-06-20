/**
 * Módulo de Posiciones
 * Lógica pura para calcular las estadísticas y ordenar la tabla 
 * según los criterios oficiales de la FIFA.
 */

/**
 * Calcula estadísticas (puntos, goles, etc.) leyendo los partidos jugados.
 * @param {Array} listaPartidos - Array de objetos de partidos.
 * @param {Array} listaEquipos - Array de objetos de equipos.
 * @returns {Array} Tabla de posiciones con los datos acumulados (sin ordenar).
 */
export function calcularPosiciones(listaPartidos, listaEquipos) {
    // 1. Inicializar las estadísticas de cada equipo en 0
    let tabla = listaEquipos.map(equipo => ({
        ...equipo,
        pj: 0, // Partidos Jugados
        pg: 0, // Partidos Ganados
        pe: 0, // Partidos Empatados
        pp: 0, // Partidos Perdidos
        gf: 0, // Goles a Favor
        gc: 0, // Goles en Contra
        dg: 0, // Diferencia de Gol
        pts: 0 // Puntos
    }));

    // 2. Filtrar solo los partidos finalizados y calcular
    listaPartidos.filter(p => p.estado === 'jugado').forEach(partido => {
        let local = tabla.find(e => e.id === partido.equipoLocal);
        let visitante = tabla.find(e => e.id === partido.equipoVisitante);

        if (!local || !visitante) return; // Validación de seguridad

        // Sumar PJ y Goles
        local.pj++;
        visitante.pj++;
        local.gf += partido.golesLocal;
        local.gc += partido.golesVisitante;
        visitante.gf += partido.golesVisitante;
        visitante.gc += partido.golesLocal;

        // Determinar ganador, perdedor o empate para asignar puntos
        if (partido.golesLocal > partido.golesVisitante) {
            local.pg++;
            local.pts += 3;
            visitante.pp++;
        } else if (partido.golesLocal < partido.golesVisitante) {
            visitante.pg++;
            visitante.pts += 3;
            local.pp++;
        } else {
            local.pe++;
            visitante.pe++;
            local.pts += 1;
            visitante.pts += 1;
        }

        // Calcular Diferencia de Gol (GF - GC)
        local.dg = local.gf - local.gc;
        visitante.dg = visitante.gf - visitante.gc;
    });

    return tabla;
}

/**
 * Ordena la tabla aplicando criterios FIFA.
 * @param {Array} tabla - Array de equipos con estadísticas ya calculadas.
 * @returns {Array} Tabla ordenada.
 */
export function ordenarTabla(tabla) {
    return tabla.sort((a, b) => {
        // Criterio 1: Mayor cantidad de puntos
        if (b.pts !== a.pts) return b.pts - a.pts;
        // Criterio 2: Mayor diferencia de goles
        if (b.dg !== a.dg) return b.dg - a.dg;
        // Criterio 3: Mayor cantidad de goles a favor
        return b.gf - a.gf;
    });
}