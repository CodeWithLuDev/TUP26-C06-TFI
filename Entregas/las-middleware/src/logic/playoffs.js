const BRACKET_R32 = [
  { id: 'r32_1', local: { tipo: 'segundo', grupo: 'A' }, visitante: { tipo: 'segundo', grupo: 'B' } },
  { id: 'r32_2', local: { tipo: 'primero', grupo: 'E' }, visitante: { tipo: 'tercero_grupos', pools: ['A','B','C','D','F'] } },
  { id: 'r32_3', local: { tipo: 'primero', grupo: 'F' }, visitante: { tipo: 'segundo', grupo: 'C' } },
  { id: 'r32_4', local: { tipo: 'primero', grupo: 'G' }, visitante: { tipo: 'segundo', grupo: 'D' } },
  { id: 'r32_5', local: { tipo: 'primero', grupo: 'I' }, visitante: { tipo: 'tercero_grupos', pools: ['C','D','F','G','H'] } },
  { id: 'r32_6', local: { tipo: 'segundo', grupo: 'E' }, visitante: { tipo: 'segundo', grupo: 'I' } },
  { id: 'r32_7', local: { tipo: 'primero', grupo: 'A' }, visitante: { tipo: 'tercero_grupos', pools: ['C','E','F','H','I'] } },
  { id: 'r32_8', local: { tipo: 'primero', grupo: 'D' }, visitante: { tipo: 'tercero_grupos', pools: ['B','E','F','I','J'] } },
  { id: 'r32_9', local: { tipo: 'primero', grupo: 'G' }, visitante: { tipo: 'tercero_grupos', pools: ['A','E','H','I','J'] } },
  { id: 'r32_10', local: { tipo: 'primero', grupo: 'H' }, visitante: { tipo: 'segundo', grupo: 'D' } },
  { id: 'r32_11', local: { tipo: 'segundo', grupo: 'K' }, visitante: { tipo: 'segundo', grupo: 'L' } },
  { id: 'r32_12', local: { tipo: 'primero', grupo: 'L' }, visitante: { tipo: 'tercero_grupos', pools: ['A','B','C','D','E','F'] } },
  { id: 'r32_13', local: { tipo: 'primero', grupo: 'B' }, visitante: { tipo: 'tercero_grupos', pools: ['E','F','G','I','J'] } },
  { id: 'r32_14', local: { tipo: 'primero', grupo: 'J' }, visitante: { tipo: 'segundo', grupo: 'H' } },
  { id: 'r32_15', local: { tipo: 'primero', grupo: 'C' }, visitante: { tipo: 'tercero_grupos', pools: ['I','J','K','L'] } },
  { id: 'r32_16', local: { tipo: 'primero', grupo: 'K' }, visitante: { tipo: 'segundo', grupo: 'G' } }
];

const BRACKET_R16 = [
  { id: 'r16_1', origen: { partido: 'r32_1', lado: 'ganador' }, origen2: { partido: 'r32_3', lado: 'ganador' } },
  { id: 'r16_2', origen: { partido: 'r32_2', lado: 'ganador' }, origen2: { partido: 'r32_5', lado: 'ganador' } },
  { id: 'r16_3', origen: { partido: 'r32_4', lado: 'ganador' }, origen2: { partido: 'r32_6', lado: 'ganador' } },
  { id: 'r16_4', origen: { partido: 'r32_7', lado: 'ganador' }, origen2: { partido: 'r32_8', lado: 'ganador' } },
  { id: 'r16_5', origen: { partido: 'r32_9', lado: 'ganador' }, origen2: { partido: 'r32_11', lado: 'ganador' } },
  { id: 'r16_6', origen: { partido: 'r32_10', lado: 'ganador' }, origen2: { partido: 'r32_12', lado: 'ganador' } },
  { id: 'r16_7', origen: { partido: 'r32_13', lado: 'ganador' }, origen2: { partido: 'r32_15', lado: 'ganador' } },
  { id: 'r16_8', origen: { partido: 'r32_14', lado: 'ganador' }, origen2: { partido: 'r32_16', lado: 'ganador' } }
];

const BRACKET_QF = [
  { id: 'qf_1', origen: { partido: 'r16_1', lado: 'ganador' }, origen2: { partido: 'r16_2', lado: 'ganador' } },
  { id: 'qf_2', origen: { partido: 'r16_3', lado: 'ganador' }, origen2: { partido: 'r16_4', lado: 'ganador' } },
  { id: 'qf_3', origen: { partido: 'r16_5', lado: 'ganador' }, origen2: { partido: 'r16_6', lado: 'ganador' } },
  { id: 'qf_4', origen: { partido: 'r16_7', lado: 'ganador' }, origen2: { partido: 'r16_8', lado: 'ganador' } }
];

const BRACKET_SF = [
  { id: 'sf_1', origen: { partido: 'qf_1', lado: 'ganador' }, origen2: { partido: 'qf_3', lado: 'ganador' } },
  { id: 'sf_2', origen: { partido: 'qf_2', lado: 'ganador' }, origen2: { partido: 'qf_4', lado: 'ganador' } }
];

function actualizarLlaves(partidos) {
  const copia = partidos.map(p => ({
    ...p,
    resultado: p.resultado ? { ...p.resultado, goles: p.resultado.goles ? [...p.resultado.goles] : [] } : null
  }));

  const clasificados = obtenerClasificados(copia);

  const mejoresTercerosMap = {};
  clasificados.mejoresTerceros.forEach(t => {
    mejoresTercerosMap[t.grupo] = t.id;
  });

  BRACKET_R32.forEach(config => {
    const p = copia.find(m => m.id === config.id);
    if (!p) return;

    p.local = resolverOrigen(config.local, copia, clasificados, mejoresTercerosMap);
    p.visitante = resolverOrigen(config.visitante, copia, clasificados, mejoresTercerosMap);
  });

  const todasRondas = [
    { configs: BRACKET_R16, prefix: 'r16' },
    { configs: BRACKET_QF, prefix: 'qf' },
    { configs: BRACKET_SF, prefix: 'sf' }
  ];

  todasRondas.forEach(ronda => {
    ronda.configs.forEach(config => {
      const p = copia.find(m => m.id === config.id);
      if (!p) return;

      const origen1 = copia.find(o => o.id === config.origen.partido);
      const origen2 = copia.find(o => o.id === config.origen2.partido);

      p.local = obtenerEquipoDeOrigen(origen1, config.origen.lado);
      p.visitante = obtenerEquipoDeOrigen(origen2, config.origen2.lado);
    });
  });

  const tp = copia.find(m => m.id === 'tp');
  if (tp) {
    const sf1 = copia.find(m => m.id === 'sf_1');
    const sf2 = copia.find(m => m.id === 'sf_2');
    tp.local = obtenerEquipoDeOrigen(sf1, 'perdedor');
    tp.visitante = obtenerEquipoDeOrigen(sf2, 'perdedor');
  }

  const final = copia.find(m => m.id === 'final');
  if (final) {
    const sf1 = copia.find(m => m.id === 'sf_1');
    const sf2 = copia.find(m => m.id === 'sf_2');
    final.local = obtenerEquipoDeOrigen(sf1, 'ganador');
    final.visitante = obtenerEquipoDeOrigen(sf2, 'ganador');
  }

  return copia;
}

function resolverOrigen(origen, partidos, clasificados, mejoresTercerosMap) {
  if (!origen) return null;

  if (origen.tipo === 'primero') {
    const pos = calcularPosiciones(origen.grupo, partidos);
    return pos.length > 0 ? pos[0].id : null;
  }

  if (origen.tipo === 'segundo') {
    const pos = calcularPosiciones(origen.grupo, partidos);
    return pos.length > 1 ? pos[1].id : null;
  }

  if (origen.tipo === 'tercero_grupos') {
    return encontrarMejorTercero(origen.pools, clasificados, mejoresTercerosMap);
  }

  return null;
}

function encontrarMejorTercero(pools, clasificados, mejoresTercerosMap) {
  for (const grupo of pools) {
    if (mejoresTercerosMap[grupo]) {
      return mejoresTercerosMap[grupo];
    }
  }
  if (clasificados.mejoresTerceros.length > 0) {
    return clasificados.mejoresTerceros[0].id;
  }
  return null;
}

function obtenerEquipoDeOrigen(partido, lado) {
  if (!partido || !partido.resultado) return null;
  const { golesLocal, golesVisitante, penalesLocal, penalesVisitante } = partido.resultado;

  let ganador, perdedor;

  if (penalesLocal !== undefined && penalesLocal !== null && golesLocal === golesVisitante) {
    if (penalesLocal > penalesVisitante) { ganador = partido.local; perdedor = partido.visitante; }
    else { ganador = partido.visitante; perdedor = partido.local; }
  } else if (golesLocal > golesVisitante) {
    ganador = partido.local; perdedor = partido.visitante;
  } else if (golesVisitante > golesLocal) {
    ganador = partido.visitante; perdedor = partido.local;
  } else {
    return null;
  }

  return lado === 'ganador' ? ganador : perdedor;
}

function hayPartidoDisponible(partido) {
  return !!(partido.local && partido.visitante);
}
