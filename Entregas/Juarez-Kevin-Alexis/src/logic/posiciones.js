export function calcularPosiciones(equiposGrupo, partidos) {
  // Inicializar stats de cada equipo (indexado por id, no por nombre,
  // porque puede haber equipos con el mismo nombre en distintos grupos)
  const stats = {}
  equiposGrupo.forEach(eq => {
    stats[eq.id] = {
      id: eq.id,
      nombre: eq.nombre,
      codigo: eq.codigo,
      PJ: 0, PG: 0, PE: 0, PP: 0,
      GF: 0, GC: 0, DG: 0, PTS: 0
    }
  })

  // Procesar partidos jugados
  partidos.forEach(p => {
    if (!p.resultado) return
    const { localId, visitanteId } = p
    const gl = p.resultado.local
    const gv = p.resultado.visitante

    if (!stats[localId] || !stats[visitanteId]) return

    stats[localId].PJ++
    stats[visitanteId].PJ++
    stats[localId].GF += gl
    stats[localId].GC += gv
    stats[visitanteId].GF += gv
    stats[visitanteId].GC += gl
    stats[localId].DG = stats[localId].GF - stats[localId].GC
    stats[visitanteId].DG = stats[visitanteId].GF - stats[visitanteId].GC

    if (gl > gv) {
      stats[localId].PG++
      stats[localId].PTS += 3
      stats[visitanteId].PP++
    } else if (gl < gv) {
      stats[visitanteId].PG++
      stats[visitanteId].PTS += 3
      stats[localId].PP++
    } else {
      stats[localId].PE++
      stats[localId].PTS++
      stats[visitanteId].PE++
      stats[visitanteId].PTS++
    }
  })

  // Ordenar con criterios FIFA
  const tabla = Object.values(stats)

  tabla.sort((a, b) => {
    // 1. Puntos
    if (b.PTS !== a.PTS) return b.PTS - a.PTS
    // 2. Diferencia de goles
    if (b.DG !== a.DG) return b.DG - a.DG
    // 3. Goles a favor
    if (b.GF !== a.GF) return b.GF - a.GF
    // 4. Enfrentamiento directo
    const directo = obtenerResultadoDirecto(a.id, b.id, partidos)
    if (directo !== 0) return directo
    // 5. Alfabético como criterio final
    return a.nombre.localeCompare(b.nombre)
  })

  return tabla
}

function obtenerResultadoDirecto(idA, idB, partidos) {
  const partido = partidos.find(p =>
    p.resultado && (
      (p.localId === idA && p.visitanteId === idB) ||
      (p.localId === idB && p.visitanteId === idA)
    )
  )
  if (!partido) return 0

  const { localId } = partido
  const gl = partido.resultado.local
  const gv = partido.resultado.visitante

  if (localId === idA) {
    if (gl > gv) return -1 // A gana
    if (gl < gv) return 1  // B gana
  } else {
    if (gv > gl) return -1 // A gana
    if (gv < gl) return 1  // B gana
  }
  return 0
}
