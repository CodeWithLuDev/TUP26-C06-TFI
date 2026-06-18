import { equipos, grupos } from '../data/equipos'
import { calcularPosiciones } from './posiciones'

// Cruces estándar de octavos de final (formato de 8 grupos, 16 clasificados).
// Cada entrada indica [grupo del 1°, grupo del 2°] que se enfrentan.
const CRUCES_OCTAVOS = [
  ['A', 'B'], // 1A vs 2B
  ['C', 'D'], // 1C vs 2D
  ['E', 'F'], // 1E vs 2F
  ['G', 'H'], // 1G vs 2H
  ['B', 'A'], // 1B vs 2A
  ['D', 'C'], // 1D vs 2C
  ['F', 'E'], // 1F vs 2E
  ['H', 'G'], // 1H vs 2G
]

function obtenerEquipo(id) {
  return equipos.find(e => e.id === id) || null
}

// Determina si la fase de grupos está completa: todos los partidos de
// fase de grupos cargados con resultado.
export function faseDeGruposCompleta(partidosGrupos) {
  return partidosGrupos.length > 0 && partidosGrupos.every(p => p.resultado !== null)
}

// Devuelve, para cada grupo, la tabla ordenada (usa la misma lógica que
// la tabla de posiciones visible en la fase de grupos).
function obtenerClasificadosPorGrupo(partidosTodos) {
  const tablasPorGrupo = {}
  grupos.forEach(g => {
    const equiposGrupo = equipos.filter(e => e.grupo === g)
    const partidosGrupo = partidosTodos.filter(p => p.grupo === g && p.fase === `Grupo ${g}`)
    tablasPorGrupo[g] = calcularPosiciones(equiposGrupo, partidosGrupo)
  })
  return tablasPorGrupo
}

// Determina el ganador de un partido de eliminación directa.
// Si hubo penales, esos definen; si no, el resultado en los 90 (o tiempo extra).
export function ganadorDePartido(partido) {
  if (!partido || !partido.resultado) return null
  const { local, visitante } = partido.resultado
  if (local > visitante) return { id: partido.localId, nombre: partido.local, codigo: partido.codigoLocal }
  if (visitante > local) return { id: partido.visitanteId, nombre: partido.visitante, codigo: partido.codigoVisitante }
  // Empate en el marcador reglamentario: debe haber penales para definir
  if (partido.penales) {
    const { local: pl, visitante: pv } = partido.penales
    if (pl > pv) return { id: partido.localId, nombre: partido.local, codigo: partido.codigoLocal }
    if (pv > pl) return { id: partido.visitanteId, nombre: partido.visitante, codigo: partido.codigoVisitante }
  }
  return null // empate sin definir todavía
}

// Genera los 8 partidos de octavos de final a partir de las tablas de grupos.
// Devuelve null si la fase de grupos todavía no terminó.
export function generarOctavos(partidosTodos) {
  const partidosFaseDeGrupos = partidosTodos.filter(p => p.fase && p.fase.startsWith('Grupo'))
  if (!faseDeGruposCompleta(partidosFaseDeGrupos)) return null

  const tablas = obtenerClasificadosPorGrupo(partidosTodos)

  return CRUCES_OCTAVOS.map((cruce, i) => {
    const [grupoPrimero, grupoSegundo] = cruce
    const primero = tablas[grupoPrimero]?.[0]
    const segundo = tablas[grupoSegundo]?.[1]
    if (!primero || !segundo) return null

    const eqLocal = obtenerEquipo(primero.id)
    const eqVisitante = obtenerEquipo(segundo.id)

    return {
      id: `octavos-${i + 1}`,
      fase: 'Octavos de Final',
      ronda: 'octavos',
      orden: i,
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
  }).filter(Boolean)
}

// Genera la siguiente ronda (cuartos, semis, final) a partir de los
// partidos de la ronda anterior, emparejando ganadores consecutivos.
// etiquetaRonda: 'Cuartos de Final' | 'Semifinales' | 'Final'
export function generarSiguienteRonda(partidosRondaAnterior, etiquetaRonda, claveRonda) {
  if (!partidosRondaAnterior || partidosRondaAnterior.length === 0) return null

  const ordenados = [...partidosRondaAnterior].sort((a, b) => a.orden - b.orden)
  const todosConGanador = ordenados.every(p => ganadorDePartido(p) !== null)
  if (!todosConGanador) return null

  const siguiente = []
  for (let i = 0; i < ordenados.length; i += 2) {
    const partidoA = ordenados[i]
    const partidoB = ordenados[i + 1]
    if (!partidoB) break
    const ganadorA = ganadorDePartido(partidoA)
    const ganadorB = ganadorDePartido(partidoB)

    siguiente.push({
      id: `${claveRonda}-${siguiente.length + 1}`,
      fase: etiquetaRonda,
      ronda: claveRonda,
      orden: siguiente.length,
      local: ganadorA.nombre,
      localId: ganadorA.id,
      codigoLocal: ganadorA.codigo,
      visitante: ganadorB.nombre,
      visitanteId: ganadorB.id,
      codigoVisitante: ganadorB.codigo,
      resultado: null,
      penales: null,
      tiempoExtra: false,
      goles: [],
    })
  }
  return siguiente
}

// Genera el partido por el tercer puesto a partir de los perdedores de semis
export function generarTercerPuesto(partidosSemis) {
  if (!partidosSemis || partidosSemis.length !== 2) return null
  const ganadores = partidosSemis.map(ganadorDePartido)
  if (ganadores.some(g => g === null)) return null

  const perdedores = partidosSemis.map(p => {
    const g = ganadorDePartido(p)
    return g.id === p.localId
      ? { id: p.visitanteId, nombre: p.visitante, codigo: p.codigoVisitante }
      : { id: p.localId, nombre: p.local, codigo: p.codigoLocal }
  })

  return {
    id: 'tercer-puesto-1',
    fase: 'Tercer Puesto',
    ronda: 'tercerPuesto',
    orden: 0,
    local: perdedores[0].nombre,
    localId: perdedores[0].id,
    codigoLocal: perdedores[0].codigo,
    visitante: perdedores[1].nombre,
    visitanteId: perdedores[1].id,
    codigoVisitante: perdedores[1].codigo,
    resultado: null,
    penales: null,
    tiempoExtra: false,
    goles: [],
  }
}

export const ETIQUETAS_RONDAS = {
  octavos: 'Octavos de Final',
  cuartos: 'Cuartos de Final',
  semis: 'Semifinales',
  final: 'Final',
  tercerPuesto: 'Tercer Puesto',
}
