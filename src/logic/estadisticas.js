export function calcularGoleadores(partidosMap, equiposMap) {
  const acumulador = {};

  for (const partido of Object.values(partidosMap)) {
    if (!partido.resultado?.goles) continue;
    for (const gol of partido.resultado.goles) {
      const { jugadorId, jugadorNombre, equipoId } = gol;
      if (!acumulador[jugadorId]) {
        const equipo = equiposMap[equipoId] || {};
        acumulador[jugadorId] = {
          jugadorId, jugadorNombre, equipoId,
          equipoNombre: equipo.nombre || equipoId,
          equipoBandera: equipo.bandera || "",
          goles: 0,
        };
      }
      acumulador[jugadorId].goles += 1;
    }
  }
  return Object.values(acumulador).sort((a, b) => b.goles - a.goles);
}

export function calcularAsistidores(partidosMap, equiposMap) {
  const acumulador = {};
  for (const partido of Object.values(partidosMap)) {
    if (!partido.resultado?.goles) continue;
    for (const gol of partido.resultado.goles) {
      const { asistenciaJugadorId, asistenciaJugadorNombre, equipoId } = gol;
      if (!asistenciaJugadorId) continue;
      if (!acumulador[asistenciaJugadorId]) {
        const equipo = equiposMap[equipoId] || {};
        acumulador[asistenciaJugadorId] = {
          jugadorId: asistenciaJugadorId,
          jugadorNombre: asistenciaJugadorNombre,
          equipoId,
          equipoNombre: equipo.nombre || equipoId,
          equipoBandera: equipo.bandera || "",
          asistencias: 0,
        };
      }
      acumulador[asistenciaJugadorId].asistencias += 1;
    }
  }
  return Object.values(acumulador).sort((a, b) => b.asistencias - a.asistencias);
}

export function calcularTarjetas(partidosMap, equiposMap) {
  const jugadores = {};
  const equipos = {};
  for (const partido of Object.values(partidosMap)) {
    if (!partido.resultado?.tarjetasLista) continue;
    for (const t of partido.resultado.tarjetasLista) {
      if (!jugadores[t.jugadorNombre]) {
        const eq = equiposMap[t.equipoId] || {};
        jugadores[t.jugadorNombre] = { jugadorNombre: t.jugadorNombre, equipoId: t.equipoId, equipoNombre: eq.nombre || t.equipoId, equipoBandera: eq.bandera || "", amarillas: 0, rojas: 0 };
      }
      if (t.tipo === "amarilla") jugadores[t.jugadorNombre].amarillas++;
      else jugadores[t.jugadorNombre].rojas++;
    }
    // also accumulate per-team
    const t = partido.resultado.tarjetas;
    if (!t) continue;
    for (const [campo, id] of [["localAmarillas", partido.localId], ["localRojas", partido.localId], ["visitanteAmarillas", partido.visitanteId], ["visitanteRojas", partido.visitanteId]]) {
      const cant = Number(t[campo] || 0);
      if (cant === 0) continue;
      if (!equipos[id]) {
        const eq = equiposMap[id] || {};
        equipos[id] = { equipoId: id, equipoNombre: eq.nombre || id, equipoBandera: eq.bandera || "", amarillas: 0, rojas: 0 };
      }
      if (campo.includes("Amarillas")) equipos[id].amarillas += cant;
      else equipos[id].rojas += cant;
    }
  }
  return { jugadores: Object.values(jugadores).sort((a, b) => (b.rojas + b.amarillas) - (a.rojas + a.amarillas)), equipos: Object.values(equipos) };
}

export function generarJugadorId(nombre, equipoId) {
  const slug = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-");
  return `${equipoId}-${slug}`;
}
