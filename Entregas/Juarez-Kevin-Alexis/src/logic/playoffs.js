import { equipos, grupos } from '../data/equipos'
import { calcularPosiciones } from './posiciones'

/*
  MUNDIAL 2026 — Formato oficial FIFA
  ─────────────────────────────────────
  48 equipos · 12 grupos de 4
  Clasifican: 1° y 2° de cada grupo (24) + 8 mejores terceros = 32 clasificados
  Fase eliminatoria:
    Dieciseisavos (16 partidos) → Octavos (8) → Cuartos (4) → Semis (2) → Final (1) + 3er Puesto (1)
  Total: 72 + 16 + 8 + 4 + 2 + 1 + 1 = 104 partidos ✓
*/

function obtenerEquipo(id) {
  return equipos.find(e => e.id === id) || null
}

export function faseDeGruposCompleta(partidosGrupos) {
  return partidosGrupos.length > 0 && partidosGrupos.every(p => p.resultado !== null)
}

function obtenerClasificadosPorGrupo(partidosTodos) {
  const tablas = {}
  grupos.forEach(g => {
    const eqs = equipos.filter(e => e.grupo === g)
    const parts = partidosTodos.filter(p => p.grupo === g && p.fase === `Grupo ${g}`)
    tablas[g] = calcularPosiciones(eqs, parts)
  })
  return tablas
}

// 8 mejores terceros de los 12 grupos (por PTS, DG, GF, nombre)
function obtenerMejoresTerceros(tablas) {
  return grupos
    .map(g => tablas[g]?.[2])
    .filter(Boolean)
    .sort((a, b) => {
      if (b.PTS !== a.PTS) return b.PTS - a.PTS
      if (b.DG  !== a.DG)  return b.DG  - a.DG
      if (b.GF  !== a.GF)  return b.GF  - a.GF
      return a.nombre.localeCompare(b.nombre)
    })
    .slice(0, 8)
}

function crearPartido(id, fase, ronda, orden, eqLocal, eqVisitante) {
  return {
    id, fase, ronda, orden,
    local:            eqLocal.nombre,
    localId:          eqLocal.id,
    codigoLocal:      eqLocal.codigo,
    visitante:        eqVisitante.nombre,
    visitanteId:      eqVisitante.id,
    codigoVisitante:  eqVisitante.codigo,
    resultado: null, penales: null, tiempoExtra: false, goles: [],
  }
}

/*
  GENERA LOS 16 DIECISEISAVOS
  ─────────────────────────────
  32 clasificados:
    Primeros:  1A 1B 1C 1D 1E 1F 1G 1H 1I 1J 1K 1L   (12)
    Segundos:  2A 2B 2C 2D 2E 2F 2G 2H 2I 2J 2K 2L   (12)
    Terceros:  los 8 mejores 3°                         (8)

  Cruces (orden FIFA simplificado):
    Lado izquierdo del bracket  (órdenes 0-7):
      0: 1A vs 2B
      1: 1C vs 2D
      2: 1E vs 2F
      3: 1G vs 2H
      4: 1I vs 2J
      5: 1K vs 2L
      6: mejor 3° #1 vs mejor 3° #8
      7: mejor 3° #2 vs mejor 3° #7

    Lado derecho del bracket  (órdenes 8-15):
      8:  1B vs 2A
      9:  1D vs 2C
      10: 1F vs 2E
      11: 1H vs 2G
      12: 1J vs 2I
      13: 1L vs 2K
      14: mejor 3° #3 vs mejor 3° #6
      15: mejor 3° #4 vs mejor 3° #5

  Así: 8 partidos por lado, bracket perfectamente simétrico 8-8.

  IMPORTANTE — por qué los terceros se cruzan ENTRE SÍ y no contra
  un "peor primero": los 12 primeros de grupo ya quedan emparejados
  exactamente una vez cada uno en los cruces 0-5 y 8-13 (cada 1X
  aparece una sola vez). Si a un tercero se lo cruzara contra "el
  primero con menos puntos", ese primero terminaría apareciendo DOS
  veces en los Dieciseisavos (una vez en su cruce normal y otra vez
  como rival del tercero), generando un equipo duplicado en el
  bracket que eventualmente puede chocar contra sí mismo en una
  ronda posterior. Cruzando los 8 mejores terceros entre sí se
  garantiza matemáticamente que los 32 equipos sean distintos:
  12 primeros + 12 segundos + 8 terceros = 32, sin repetidos.
*/
export function generarRondaDe32(partidosTodos) {
  const partidosGrupo = partidosTodos.filter(p => p.fase && p.fase.startsWith('Grupo'))
  if (!faseDeGruposCompleta(partidosGrupo)) return null

  const tablas = obtenerClasificadosPorGrupo(partidosTodos)
  const mejoresTerceros = obtenerMejoresTerceros(tablas)

  // Helpers
  const p1 = (g) => obtenerEquipo(tablas[g]?.[0]?.id)  // 1° del grupo g
  const p2 = (g) => obtenerEquipo(tablas[g]?.[1]?.id)  // 2° del grupo g
  const t3 = (i) => obtenerEquipo(mejoresTerceros[i]?.id) // i-ésimo mejor 3°

  // 16 cruces: órdenes 0-7 lado izq, 8-15 lado der
  const cruces = [
    // Lado izquierdo (0-7)
    [p1('A'), p2('B')],
    [p1('C'), p2('D')],
    [p1('E'), p2('F')],
    [p1('G'), p2('H')],
    [p1('I'), p2('J')],
    [p1('K'), p2('L')],
    [t3(0), t3(7)],
    [t3(1), t3(6)],
    // Lado derecho (8-15)
    [p1('B'), p2('A')],
    [p1('D'), p2('C')],
    [p1('F'), p2('E')],
    [p1('H'), p2('G')],
    [p1('J'), p2('I')],
    [p1('L'), p2('K')],
    [t3(2), t3(5)],
    [t3(3), t3(4)],
  ]

  const partidos = []
  cruces.forEach(([local, visitante], orden) => {
    if (!local || !visitante) return
    partidos.push(crearPartido(`r32-${orden + 1}`, 'Dieciseisavos', 'ronda32', orden, local, visitante))
  })

  return partidos.length > 0 ? partidos : null
}

export function ganadorDePartido(partido) {
  if (!partido || !partido.resultado) return null
  const { local, visitante } = partido.resultado
  if (local > visitante) return { id: partido.localId,     nombre: partido.local,     codigo: partido.codigoLocal }
  if (visitante > local) return { id: partido.visitanteId, nombre: partido.visitante, codigo: partido.codigoVisitante }
  if (partido.penales) {
    const { local: pl, visitante: pv } = partido.penales
    if (pl > pv) return { id: partido.localId,     nombre: partido.local,     codigo: partido.codigoLocal }
    if (pv > pl) return { id: partido.visitanteId, nombre: partido.visitante, codigo: partido.codigoVisitante }
  }
  return null
}

export function generarSiguienteRonda(partidosRondaAnterior, etiquetaRonda, claveRonda) {
  if (!partidosRondaAnterior || partidosRondaAnterior.length === 0) return null
  const ordenados = [...partidosRondaAnterior].sort((a, b) => a.orden - b.orden)
  if (!ordenados.every(p => ganadorDePartido(p) !== null)) return null

  const siguiente = []
  for (let i = 0; i < ordenados.length; i += 2) {
    const pA = ordenados[i]
    const pB = ordenados[i + 1]
    if (!pB) break
    const gA = ganadorDePartido(pA)
    const gB = ganadorDePartido(pB)
    siguiente.push({
      id: `${claveRonda}-${siguiente.length + 1}`,
      fase: etiquetaRonda,
      ronda: claveRonda,
      orden: siguiente.length,
      local: gA.nombre, localId: gA.id, codigoLocal: gA.codigo,
      visitante: gB.nombre, visitanteId: gB.id, codigoVisitante: gB.codigo,
      resultado: null, penales: null, tiempoExtra: false, goles: [],
    })
  }
  return siguiente.length > 0 ? siguiente : null
}

export function generarTercerPuesto(partidosSemis) {
  if (!partidosSemis || partidosSemis.length !== 2) return null
  if (partidosSemis.some(p => ganadorDePartido(p) === null)) return null

  const perdedores = partidosSemis.map(p => {
    const g = ganadorDePartido(p)
    return g.id === p.localId
      ? { id: p.visitanteId, nombre: p.visitante, codigo: p.codigoVisitante }
      : { id: p.localId,     nombre: p.local,     codigo: p.codigoLocal }
  })

  return {
    id: 'tercer-puesto-1', fase: 'Tercer Puesto', ronda: 'tercerPuesto', orden: 0,
    local: perdedores[0].nombre, localId: perdedores[0].id, codigoLocal: perdedores[0].codigo,
    visitante: perdedores[1].nombre, visitanteId: perdedores[1].id, codigoVisitante: perdedores[1].codigo,
    resultado: null, penales: null, tiempoExtra: false, goles: [],
  }
}

export const ETIQUETAS_RONDAS = {
  ronda32:      'Dieciseisavos',
  octavos:      'Octavos de Final',
  cuartos:      'Cuartos de Final',
  semis:        'Semifinales',
  final:        'Final',
  tercerPuesto: 'Tercer Puesto',
}