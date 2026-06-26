function calcularPosiciones(grupo, partidos) {
  const equiposGrupo = obtenerEquiposPorGrupo(grupo);
  const stats = {};

  equiposGrupo.forEach(e => {
    stats[e.id] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 };
  });

  const partidosGrupo = partidos.filter(p => p.fase === 'grupos' && p.grupo === grupo && p.resultado);

  partidosGrupo.forEach(p => {
    const { golesLocal, golesVisitante } = p.resultado;
    const local = stats[p.local];
    const visitante = stats[p.visitante];

    if (golesLocal === null || golesVisitante === null) return;

    local.pj++; visitante.pj++;
    local.gf += golesLocal; local.gc += golesVisitante;
    visitante.gf += golesVisitante; visitante.gc += golesLocal;

    if (golesLocal > golesVisitante) {
      local.pg++; local.pts += 3;
      visitante.pp++;
    } else if (golesLocal < golesVisitante) {
      visitante.pg++; visitante.pts += 3;
      local.pp++;
    } else {
      local.pe++; local.pts += 1;
      visitante.pe++; visitante.pts += 1;
    }
  });

  Object.values(stats).forEach(s => { s.dg = s.gf - s.gc; });

  const ordenado = equiposGrupo.map(e => ({
    ...e,
    ...stats[e.id]
  })).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.dg !== a.dg) return b.dg - a.dg;
    if (b.gf !== a.gf) return b.gf - a.gf;

    const enfrentamiento = resolverEnfrentamientoDirecto(a.id, b.id, partidosGrupo);
    if (enfrentamiento !== 0) return enfrentamiento;

    return a.nombre.localeCompare(b.nombre);
  });

  return ordenado;
}

function resolverEnfrentamientoDirecto(idA, idB, partidos) {
  const partido = partidos.find(p =>
    (p.local === idA && p.visitante === idB) ||
    (p.local === idB && p.visitante === idA)
  );

  if (!partido || !partido.resultado) return 0;

  const { golesLocal, golesVisitante } = partido.resultado;
  if (golesLocal === null || golesVisitante === null) return 0;

  let puntosA = 0, puntosB = 0;
  if (partido.local === idA) {
    if (golesLocal > golesVisitante) puntosA = 3;
    else if (golesLocal < golesVisitante) puntosB = 3;
    else { puntosA = 1; puntosB = 1; }
  } else {
    if (golesVisitante > golesLocal) puntosA = 3;
    else if (golesVisitante < golesLocal) puntosB = 3;
    else { puntosA = 1; puntosB = 1; }
  }

  return puntosB - puntosA;
}

function obtenerPrimerosDos(grupo, partidos) {
  const posiciones = calcularPosiciones(grupo, partidos);
  const tieneResultados = partidos.some(p => p.fase === 'grupos' && p.grupo === grupo && p.resultado);
  return {
    primero: tieneResultados && posiciones.length > 0 ? posiciones[0] : null,
    segundo: tieneResultados && posiciones.length > 1 ? posiciones[1] : null,
    tercero: posiciones.length > 2 ? posiciones[2] : null
  };
}

function obtenerTercerosPuestos(partidos) {
  const terceros = [];

  gruposDisponibles.forEach(grupo => {
    const tieneResultados = partidos.some(p => p.fase === 'grupos' && p.grupo === grupo && p.resultado);
    const posiciones = calcularPosiciones(grupo, partidos);
    if (tieneResultados && posiciones.length >= 3) {
      terceros.push({
        ...posiciones[2],
        grupo
      });
    }
  });

  const ordenado = terceros.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.dg !== a.dg) return b.dg - a.dg;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.nombre.localeCompare(b.nombre);
  });

  return ordenado;
}

function obtenerClasificados(partidos) {
  const primeros = [];
  const segundos = [];

  gruposDisponibles.forEach(grupo => {
    const tieneResultados = partidos.some(p => p.fase === 'grupos' && p.grupo === grupo && p.resultado);
    const pos = calcularPosiciones(grupo, partidos);
    if (tieneResultados && pos.length >= 1) primeros.push(pos[0]);
    if (tieneResultados && pos.length >= 2) segundos.push(pos[1]);
  });

  const terceros = obtenerTercerosPuestos(partidos);
  const mejoresTerceros = terceros.slice(0, 8);

  return { primeros, segundos, mejoresTerceros, todosTerceros: terceros };
}
