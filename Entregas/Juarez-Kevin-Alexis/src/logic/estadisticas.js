// Calcula el ranking de goleadores a partir de todos los partidos jugados
export function calcularGoleadores(partidos) {
  const stats = {}

  partidos.forEach(p => {
    if (!p.resultado || !p.goles) return
    p.goles.forEach(g => {
      const clave = `${g.jugador}|${g.equipo}`
      if (!stats[clave]) {
        stats[clave] = { jugador: g.jugador, equipo: g.equipo, goles: 0 }
      }
      stats[clave].goles++
    })
  })

  return Object.values(stats).sort((a, b) => b.goles - a.goles)
}

// Calcula el ranking de asistidores a partir de todos los partidos jugados
export function calcularAsistidores(partidos) {
  const stats = {}

  partidos.forEach(p => {
    if (!p.resultado || !p.goles) return
    p.goles.forEach(g => {
      if (!g.asistencia) return
      const clave = `${g.asistencia}|${g.equipo}`
      if (!stats[clave]) {
        stats[clave] = { jugador: g.asistencia, equipo: g.equipo, asistencias: 0 }
      }
      stats[clave].asistencias++
    })
  })

  return Object.values(stats).sort((a, b) => b.asistencias - a.asistencias)
}
