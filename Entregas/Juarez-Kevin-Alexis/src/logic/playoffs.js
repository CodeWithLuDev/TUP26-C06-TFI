import { equipos, grupos } from '../data/equipos'
import { calcularPosiciones } from './posiciones'

// Mundial 2026: 12 grupos de 4 equipos = 48 equipos
// Clasifican: 1° y 2° de cada grupo (24) + 8 mejores terceros = 32
// Rondas: Ronda de 32 → Octavos → Cuartos → Semis → Final

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

// Obtiene los 8 mejores terceros de entre los 12 grupos
function obtenerMejoresTerceros(tablas) {
  const terceros = grupos
    .map(g => tablas[g]?.[2])
    .filter(Boolean)
    .sort((a, b) => {
      if (b.PTS !== a.PTS) return b.PTS - a.PTS
      if (b.DG  !== a.DG)  return b.DG  - a.DG
      if (b.GF  !== a.GF)  return b.GF  - a.GF
      return a.nombre.localeCompare(b.nombre)
    })
  return terceros.slice(0, 8)
}

// Genera los 32 partidos de Ronda de 32 según cruces del Mundial 2026
// Orden de cruces: 1A vs mejor3, 1B vs 2A, etc.
// Para simplificar, usamos: 1°(grupos 1-12) vs 2°/3° (espejo)
export function generarRondaDe32(partidosTodos) {
  const partidosGrupo = partidosTodos.filter(p => p.fase && p.fase.startsWith('Grupo'))
  if (!faseDeGruposCompleta(partidosGrupo)) return null

  const tablas = obtenerClasificadosPorGrupo(partidosTodos)
  const mejoresTerceros = obtenerMejoresTerceros(tablas)

  // 24 primeros + 24 segundos = 24 cruces 1° vs 2°
  // + 8 cruces 1° vs mejor 3°  (los 8 primeros por pts entre los primeros vs los 8 mejores 3°)
  // Para el torneo académico: emparejamos los 12 primeros vs los 12 segundos (24 partidos)
  // y los 8 primeros por puntos vs los 8 mejores terceros (8 partidos) = 32 partidos

  // Ordenar primeros por puntos para el emparejamiento vs terceros
  const primerosPorPts = grupos
    .map(g => tablas[g]?.[0])
    .filter(Boolean)
    .sort((a, b) => b.PTS - a.PTS)

  const partidos32 = []

  // 12 partidos: 1° grupo X vs 2° grupo Y (cruces cruzados)
  const ordenCruces = [
    ['A','B'], ['C','D'], ['E','F'], ['G','H'], ['I','J'], ['K','L'],
    ['B','A'], ['D','C'], ['F','E'], ['H','G'], ['J','I'], ['L','K'],
  ]
  ordenCruces.forEach(([g1, g2], i) => {
    const primero  = tablas[g1]?.[0]
    const segundo  = tablas[g2]?.[1]
    if (!primero || !segundo) return
    const eqL = obtenerEquipo(primero.id)
    const eqV = obtenerEquipo(segundo.id)
    partidos32.push(crearPartido(`r32-${i + 1}`, 'Ronda de 32', 'ronda32', i, eqL, eqV))
  })

  // 8 partidos: los 8 mejores primeros vs los 8 mejores terceros
  for (let i = 0; i < 8; i++) {
    const primero = primerosPorPts[i]
    const tercero = mejoresTerceros[i]
    if (!primero || !tercero) continue
    const eqL = obtenerEquipo(primero.id)
    const eqV = obtenerEquipo(tercero.id)
    partidos32.push(crearPartido(`r32-${13 + i}`, 'Ronda de 32', 'ronda32', 12 + i, eqL, eqV))
  }

  return partidos32.length > 0 ? partidos32 : null
}

function crearPartido(id, fase, ronda, orden, eqLocal, eqVisitante) {
  return {
    id,
    fase,
    ronda,
    orden,
    local: eqLocal.nombre,
    localId: eqLocal.id,
    codigoLocal: eqLocal.codigo,
    visitante: eqVisitante.nombre,
    visitanteId: eqVisitante.id,
    codigoVisitante: eqVisitante.codigo,
    resultado: null,
    penales: null,
    tiempoExtra: false,
    goles: [],
  }
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
  ronda32:     'Ronda de 32',
  octavos:     'Octavos de Final',
  cuartos:     'Cuartos de Final',
  semis:       'Semifinales',
  final:       'Final',
  tercerPuesto:'Tercer Puesto',
}
