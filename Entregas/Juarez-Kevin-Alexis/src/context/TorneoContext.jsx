import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { partidos as partidosIniciales } from '../data/partidos'
import {
  generarRondaDe32,
  generarSiguienteRonda,
  generarTercerPuesto,
  ganadorDePartido,
  ETIQUETAS_RONDAS,
} from '../logic/playoffs'

const TorneoContext = createContext()

const CLAVE_STORAGE = 'mundial2026_partidos'
const ORDEN_RONDAS = ['ronda32', 'octavos', 'cuartos', 'semis', 'final', 'tercerPuesto']

// Fechas base para cada ronda eliminatoria (Mundial 2026 real aproximado)
const FECHAS_ELIMINATORIAS = {
  ronda32:     '2026-06-27',
  octavos:     '2026-07-02',
  cuartos:     '2026-07-07',
  semis:       '2026-07-11',
  final:       '2026-07-15',
  tercerPuesto:'2026-07-14',
}

function cargarPartidosGuardados() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    if (guardado) return JSON.parse(guardado)
  } catch { /* storage corrupto */ }
  return partidosIniciales
}

function construirPartidosCompletos(partidosBase) {
  let actuales = [...partidosBase]

  const tienenFase = (ronda) => actuales.some(p => p.ronda === ronda)
  const partidosDe = (ronda) => actuales.filter(p => p.ronda === ronda)

  if (!tienenFase('ronda32')) {
    const r32 = generarRondaDe32(actuales)
    if (r32) actuales = [...actuales, ...r32]
  }

  if (tienenFase('ronda32') && !tienenFase('octavos')) {
    const oct = generarSiguienteRonda(partidosDe('ronda32'), ETIQUETAS_RONDAS.octavos, 'octavos')
    if (oct) actuales = [...actuales, ...oct]
  }

  if (tienenFase('octavos') && !tienenFase('cuartos')) {
    const cua = generarSiguienteRonda(partidosDe('octavos'), ETIQUETAS_RONDAS.cuartos, 'cuartos')
    if (cua) actuales = [...actuales, ...cua]
  }

  if (tienenFase('cuartos') && !tienenFase('semis')) {
    const sem = generarSiguienteRonda(partidosDe('cuartos'), ETIQUETAS_RONDAS.semis, 'semis')
    if (sem) actuales = [...actuales, ...sem]
  }

  if (tienenFase('semis') && !tienenFase('final')) {
    const fin = generarSiguienteRonda(partidosDe('semis'), ETIQUETAS_RONDAS.final, 'final')
    if (fin) actuales = [...actuales, ...fin]
  }

  if (tienenFase('semis') && !tienenFase('tercerPuesto')) {
    const tp = generarTercerPuesto(partidosDe('semis'))
    if (tp) actuales = [...actuales, tp]
  }

  return actuales
}

/* ── Pool de jugadores aleatorios ── */
const POOL_JUGADORES = [
  'Hernández','Silva','Müller','Dupont','Kowalski','Tanaka','Park','Diallo',
  'Fernández','Rossi','Andersson','Novak','Petrov','Costa','Martins','Nakamura',
  'Hassan','Okafor','Ibrahim','Kim','García','López','Torres','Bianchi',
  'Schmidt','Dubois','Janssen','Larsen','Sato','Wang','Ahmed','Osei',
  'Mensah','Khan','Cooper','Walker','Brennan','Murphy','Romero','Acosta',
]

function nombreAleatorio() {
  return POOL_JUGADORES[Math.floor(Math.random() * POOL_JUGADORES.length)]
}

function golesAleatorios() {
  const pesos = [0,0,0,1,1,1,1,2,2,2,3,4]
  return pesos[Math.floor(Math.random() * pesos.length)]
}

function generarGolesDelPartido(local, visitante, gl, gv) {
  const goles = []
  const usados = new Set()
  function jugador(equipo) {
    let nombre, intentos = 0
    do { nombre = nombreAleatorio(); intentos++ }
    while (usados.has(`${equipo}-${nombre}`) && intentos < 8)
    usados.add(`${equipo}-${nombre}`)
    return nombre
  }
  for (let i = 0; i < gl; i++) {
    const j = jugador(local)
    goles.push({ jugador: j, equipo: local, minuto: 1 + Math.floor(Math.random() * 90), asistencia: Math.random() > 0.35 ? jugador(local) : null })
  }
  for (let i = 0; i < gv; i++) {
    const j = jugador(visitante)
    goles.push({ jugador: j, equipo: visitante, minuto: 1 + Math.floor(Math.random() * 90), asistencia: Math.random() > 0.35 ? jugador(visitante) : null })
  }
  return goles.sort((a, b) => a.minuto - b.minuto)
}

/* Genera una fecha ISO aleatoria dentro de un rango de días desde la fechaBase */
function fechaAleatoria(fechaBase, rangoDias = 3) {
  const base = new Date(fechaBase + 'T00:00:00Z')
  const diasExtra = Math.floor(Math.random() * (rangoDias + 1))
  base.setUTCDate(base.getUTCDate() + diasExtra)
  // Hora aleatoria entre 16:00 y 22:00 UTC
  const hora = 16 + Math.floor(Math.random() * 7)
  const min = Math.random() > 0.5 ? 30 : 0
  base.setUTCHours(hora, min, 0, 0)
  return base.toISOString()
}

function completarConResultadoAleatorio(partido, esEliminacion) {
  const gl = golesAleatorios()
  const gv = golesAleatorios()
  const goles = generarGolesDelPartido(partido.local, partido.visitante, gl, gv)
  let penales = null, tiempoExtra = false
  if (esEliminacion && gl === gv) {
    tiempoExtra = Math.random() > 0.5
    let pl = 3 + Math.floor(Math.random() * 4)
    let pv = 3 + Math.floor(Math.random() * 4)
    if (pl === pv) pv += 1
    penales = { local: pl, visitante: pv }
  }
  // Asignar fecha aleatoria según ronda si no tiene una
  const ronda = partido.ronda
  const horaUTC = partido.horaUTC || (ronda && FECHAS_ELIMINATORIAS[ronda]
    ? fechaAleatoria(FECHAS_ELIMINATORIAS[ronda])
    : fechaAleatoria(partido.fecha || '2026-06-27'))
  return { ...partido, resultado: { local: gl, visitante: gv }, goles, penales, tiempoExtra, horaUTC, fechaFin: new Date().toISOString() }
}

export function TorneoProvider({ children }) {
  const [partidos, setPartidos] = useState(cargarPartidosGuardados)

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(partidos))
  }, [partidos])

  const partidosCompletos = useMemo(() => construirPartidosCompletos(partidos), [partidos])

  function cargarResultado(idPartido, { golesLocal, golesVisitante, penales = null, tiempoExtra = false, goles = [], horaUTC, horaManual }) {
    setPartidos(prev => {
      const partidoBase = construirPartidosCompletos(prev).find(p => p.id === idPartido)
      if (!partidoBase) return prev
      // fechaFin = la hora real del partido (horaUTC pasada o la que ya tenía), NO new Date()
      const horaFinal = horaUTC || partidoBase.horaUTC
      const actualizado = {
        ...partidoBase,
        resultado: { local: golesLocal, visitante: golesVisitante },
        penales, tiempoExtra, goles,
        fechaFin: horaFinal || new Date().toISOString(),
        ...(horaUTC ? { horaUTC, horaManual: !!horaManual } : {})
      }
      const yaExistia = prev.some(p => p.id === idPartido)
      let siguientes = yaExistia
        ? prev.map(p => (p.id === idPartido ? actualizado : p))
        : [...prev, actualizado]
      const idx = ORDEN_RONDAS.indexOf(partidoBase.ronda)
      if (idx !== -1) {
        const aBorrar = ORDEN_RONDAS.slice(idx + 1)
        siguientes = siguientes.filter(p => !aBorrar.includes(p.ronda))
      }
      return siguientes
    })
  }

  // Solo actualiza la fecha/hora del partido sin tocar el resultado
  function guardarFecha(idPartido, horaUTC) {
    setPartidos(prev => {
      const partidoBase = construirPartidosCompletos(prev).find(p => p.id === idPartido)
      if (!partidoBase) return prev
      const actualizado = { ...partidoBase, horaUTC, horaManual: true }
      const yaExistia = prev.some(p => p.id === idPartido)
      return yaExistia
        ? prev.map(p => p.id === idPartido ? actualizado : p)
        : [...prev, actualizado]
    })
  }

  function borrarResultado(idPartido) {
    setPartidos(prev => {
      const partidoBase = construirPartidosCompletos(prev).find(p => p.id === idPartido)
      if (!partidoBase) return prev
      let siguientes = partidoBase.ronda
        ? prev.filter(p => p.id !== idPartido)
        : prev.map(p => p.id === idPartido ? { ...p, resultado: null, penales: null, tiempoExtra: false, goles: [], fechaFin: undefined } : p)
      const idx = ORDEN_RONDAS.indexOf(partidoBase.ronda)
      if (idx !== -1) {
        const aBorrar = ORDEN_RONDAS.slice(idx + 1)
        siguientes = siguientes.filter(p => !aBorrar.includes(p.ronda))
      }
      return siguientes
    })
  }

  function reiniciarTorneo() {
    localStorage.removeItem(CLAVE_STORAGE)
    setPartidos(partidosIniciales)
  }

  function generarTorneoAleatorio() {
    let actuales = partidosIniciales.map(p => completarConResultadoAleatorio(p, false))

    const simularRonda = (rondaPartidos) => {
      const conRes = rondaPartidos.map(p => completarConResultadoAleatorio(p, true))
      actuales = [...actuales, ...conRes]
      return conRes
    }

    let r32 = generarRondaDe32(actuales)
    if (!r32) return
    r32 = simularRonda(r32)

    let oct = generarSiguienteRonda(r32, ETIQUETAS_RONDAS.octavos, 'octavos')
    if (!oct) return
    oct = simularRonda(oct)

    let cua = generarSiguienteRonda(oct, ETIQUETAS_RONDAS.cuartos, 'cuartos')
    if (!cua) return
    cua = simularRonda(cua)

    let sem = generarSiguienteRonda(cua, ETIQUETAS_RONDAS.semis, 'semis')
    if (!sem) return
    sem = simularRonda(sem)

    let fin = generarSiguienteRonda(sem, ETIQUETAS_RONDAS.final, 'final')
    if (fin) simularRonda(fin)

    let tp = generarTercerPuesto(sem)
    if (tp) actuales = [...actuales, completarConResultadoAleatorio(tp, true)]

    setPartidos(actuales)
  }

  function exportarTorneo() {
    const blob = new Blob([JSON.stringify({ version: 1, exportadoEn: new Date().toISOString(), partidos }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `mundial2026-${new Date().toISOString().slice(0,10)}.json`
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  function importarTorneo(archivo) {
    return new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => {
        try {
          const datos = JSON.parse(r.result)
          const lista = Array.isArray(datos) ? datos : datos.partidos
          if (!Array.isArray(lista) || lista.length === 0) throw new Error('Formato inválido')
          setPartidos(lista); resolve()
        } catch (err) { reject(err) }
      }
      r.onerror = () => reject(new Error('No se pudo leer el archivo'))
      r.readAsText(archivo)
    })
  }

  const value = { partidos: partidosCompletos, cargarResultado, borrarResultado, guardarFecha, reiniciarTorneo, generarTorneoAleatorio, exportarTorneo, importarTorneo }
  return <TorneoContext.Provider value={value}>{children}</TorneoContext.Provider>
}

export function useTorneo() {
  return useContext(TorneoContext)
}