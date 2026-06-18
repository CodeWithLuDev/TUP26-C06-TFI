// Genera los 6 partidos (todos contra todos) de un grupo de 4 equipos
function generarPartidosGrupo(grupo, equipo1, equipo2, equipo3, equipo4, fechaBase, idInicio) {
  const combinaciones = [
    [equipo1, equipo2], [equipo3, equipo4],
    [equipo1, equipo3], [equipo2, equipo4],
    [equipo1, equipo4], [equipo2, equipo3],
  ]
  return combinaciones.map(([local, vis], i) => {
    const fecha = new Date(fechaBase)
    fecha.setDate(fecha.getDate() + Math.floor(i / 2) * 4 + (i % 2))
    const fechaStr = fecha.toISOString().slice(0, 10)
    const horaUTC = new Date(fecha.getTime() + (i % 2 === 0 ? 20 : 23) * 3600000).toISOString()
    return {
      id: idInicio + i,
      grupo,
      fase: `Grupo ${grupo}`,
      local: local.nombre,
      localId: local.id,
      codigoLocal: local.codigo,
      visitante: vis.nombre,
      visitanteId: vis.id,
      codigoVisitante: vis.codigo,
      fecha: fechaStr,
      horaUTC,
      resultado: null,
      goles: [],
    }
  })
}

import { equipos } from './equipos'

function eq(id) { return equipos.find(e => e.id === id) }

export const partidos = [
  // GRUPO A
  ...generarPartidosGrupo('A', eq(1), eq(2), eq(3), eq(4),  '2026-06-11', 1),
  // GRUPO B
  ...generarPartidosGrupo('B', eq(5), eq(6), eq(7), eq(8),  '2026-06-11', 7),
  // GRUPO C
  ...generarPartidosGrupo('C', eq(9), eq(10), eq(11), eq(12), '2026-06-12', 13),
  // GRUPO D
  ...generarPartidosGrupo('D', eq(13), eq(14), eq(15), eq(16), '2026-06-12', 19),
  // GRUPO E
  ...generarPartidosGrupo('E', eq(17), eq(18), eq(19), eq(20), '2026-06-13', 25),
  // GRUPO F
  ...generarPartidosGrupo('F', eq(21), eq(22), eq(23), eq(24), '2026-06-13', 31),
  // GRUPO G
  ...generarPartidosGrupo('G', eq(25), eq(26), eq(27), eq(28), '2026-06-14', 37),
  // GRUPO H
  ...generarPartidosGrupo('H', eq(29), eq(30), eq(31), eq(32), '2026-06-14', 43),
  // GRUPO I
  ...generarPartidosGrupo('I', eq(33), eq(34), eq(35), eq(36), '2026-06-15', 49),
  // GRUPO J
  ...generarPartidosGrupo('J', eq(37), eq(38), eq(39), eq(40), '2026-06-15', 55),
  // GRUPO K
  ...generarPartidosGrupo('K', eq(41), eq(42), eq(43), eq(44), '2026-06-16', 61),
  // GRUPO L
  ...generarPartidosGrupo('L', eq(45), eq(46), eq(47), eq(48), '2026-06-16', 67),
]
