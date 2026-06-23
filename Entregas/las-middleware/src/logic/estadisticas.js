function calcularGoleadores(partidos) {
  const goleadores = {};

  partidos.forEach(p => {
    if (!p.resultado || !p.resultado.goles) return;
    p.resultado.goles.forEach(g => {
      if (!g.jugador) return;
      const key = g.jugador + '_' + g.equipo;
      if (!goleadores[key]) {
        goleadores[key] = { jugador: g.jugador, equipo: g.equipo, goles: 0 };
      }
      goleadores[key].goles++;
    });
  });

  return Object.values(goleadores).sort((a, b) => b.goles - a.goles);
}

function calcularAsistidores(partidos) {
  const asistidores = {};

  partidos.forEach(p => {
    if (!p.resultado || !p.resultado.goles) return;
    p.resultado.goles.forEach(g => {
      if (!g.asistencia) return;
      const key = g.asistencia + '_' + g.equipo;
      if (!asistidores[key]) {
        asistidores[key] = { jugador: g.asistencia, equipo: g.equipo, asistencias: 0 };
      }
      asistidores[key].asistencias++;
    });
  });

  return Object.values(asistidores).sort((a, b) => b.asistencias - a.asistencias);
}
