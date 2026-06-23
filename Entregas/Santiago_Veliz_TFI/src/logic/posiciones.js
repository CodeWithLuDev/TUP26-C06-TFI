/**
 * Módulo de Posiciones
 * Lógica pura para calcular estadísticas, ordenar la tabla (FIFA)
 * y calcular la racha de los últimos 3 partidos por equipo.
 */

/**
 * Calcula la racha de los últimos 3 partidos jugados por cada equipo.
 * @param {Array} listaPartidos
 * @param {string} equipoId
 * @returns {Array<'G'|'E'|'P'>} hasta 3 resultados, más reciente primero
 */
export function calcularRacha(listaPartidos, equipoId) {
  const jugados = listaPartidos
    .filter(p => p.estado === 'jugado' &&
      (p.equipoLocal === equipoId || p.equipoVisitante === equipoId));

  // Los últimos 3 (al final del array = más recientes)
  const ultimos = jugados.slice(-3).reverse();

  return ultimos.map(p => {
    const esLocal = p.equipoLocal === equipoId;
    const gF = esLocal ? p.golesLocal : p.golesVisitante;
    const gC = esLocal ? p.golesVisitante : p.golesLocal;
    if (gF > gC) return 'G';
    if (gF < gC) return 'P';
    return 'E';
  });
}

/**
 * Calcula estadísticas (puntos, goles, etc.) leyendo los partidos jugados.
 * @param {Array} listaPartidos
 * @param {Array} listaEquipos
 * @returns {Array} Tabla de posiciones con datos acumulados (sin ordenar).
 */
export function calcularPosiciones(listaPartidos, listaEquipos) {
  let tabla = listaEquipos.map(equipo => ({
    ...equipo,
    pj: 0, pg: 0, pe: 0, pp: 0,
    gf: 0, gc: 0, dg: 0, pts: 0,
    racha: calcularRacha(listaPartidos, equipo.id),
  }));

  listaPartidos.filter(p => p.estado === 'jugado').forEach(partido => {
    let local     = tabla.find(e => e.id === partido.equipoLocal);
    let visitante = tabla.find(e => e.id === partido.equipoVisitante);
    if (!local || !visitante) return;

    local.pj++;     visitante.pj++;
    local.gf     += partido.golesLocal;
    local.gc     += partido.golesVisitante;
    visitante.gf += partido.golesVisitante;
    visitante.gc += partido.golesLocal;

    if (partido.golesLocal > partido.golesVisitante) {
      local.pg++; local.pts += 3; visitante.pp++;
    } else if (partido.golesLocal < partido.golesVisitante) {
      visitante.pg++; visitante.pts += 3; local.pp++;
    } else {
      local.pe++; visitante.pe++;
      local.pts += 1; visitante.pts += 1;
    }

    local.dg     = local.gf - local.gc;
    visitante.dg = visitante.gf - visitante.gc;
  });

  return tabla;
}

/**
 * Ordena la tabla aplicando criterios FIFA.
 */
export function ordenarTabla(tabla) {
  return tabla.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.dg  !== a.dg)  return b.dg  - a.dg;
    return b.gf - a.gf;
  });
}

/**
 * Genera el HTML para los círculos de racha (G/E/P).
 * @param {Array<'G'|'E'|'P'>} racha
 * @returns {string} HTML string
 */
export function renderRacha(racha) {
  if (!racha || racha.length === 0) {
    return '<span class="racha-vacia">—</span>';
  }
  return racha.map(r => {
    const clase = r === 'G' ? 'racha-circulo--g'
                : r === 'P' ? 'racha-circulo--p'
                : 'racha-circulo--e';
    return `<span class="racha-circulo ${clase}">${r}</span>`;
  }).join('');
}