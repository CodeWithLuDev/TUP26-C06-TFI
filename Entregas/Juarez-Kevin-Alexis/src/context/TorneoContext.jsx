import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { partidos as partidosIniciales } from '../data/partidos'
import {
  generarOctavos,
  generarSiguienteRonda,
  generarTercerPuesto,
  ETIQUETAS_RONDAS,
} from '../logic/playoffs'

const TorneoContext = createContext()

const CLAVE_STORAGE = 'mundial2026_partidos'

function cargarPartidosGuardados() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    if (guardado) return JSON.parse(guardado)
  } catch {
    // si el storage está corrupto, seguimos con los datos iniciales
  }
  return partidosIniciales
}

export function TorneoProvider({ children }) {
  const [partidos, setPartidos] = useState(cargarPartidosGuardados)

  // Persistimos cada cambio para que no se pierdan los datos al refrescar
  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(partidos))
  }, [partidos])

  // Cada vez que cambian los partidos, recalculamos si corresponde generar
  // la siguiente ronda de playoffs (octavos, cuartos, semis, final, 3er puesto).
  // Esto es lo que hace que el bracket se actualice solo, sin botones.
  const partidosCompletos = useMemo(() => {
    let actuales = [...partidos]

    const tienenFase = (ronda) => actuales.some(p => p.ronda === ronda)
    const partidosDe = (ronda) => actuales.filter(p => p.ronda === ronda)

    // Octavos: se generan en cuanto termina la fase de grupos
    if (!tienenFase('octavos')) {
      const octavos = generarOctavos(actuales)
      if (octavos) actuales = [...actuales, ...octavos]
    }

    // Cuartos: se generan en cuanto los 8 octavos tienen ganador
    if (tienenFase('octavos') && !tienenFase('cuartos')) {
      const cuartos = generarSiguienteRonda(partidosDe('octavos'), ETIQUETAS_RONDAS.cuartos, 'cuartos')
      if (cuartos) actuales = [...actuales, ...cuartos]
    }

    // Semis: se generan en cuanto los 4 cuartos tienen ganador
    if (tienenFase('cuartos') && !tienenFase('semis')) {
      const semis = generarSiguienteRonda(partidosDe('cuartos'), ETIQUETAS_RONDAS.semis, 'semis')
      if (semis) actuales = [...actuales, ...semis]
    }

    // Final + Tercer puesto: se generan en cuanto las 2 semis tienen ganador
    if (tienenFase('semis') && !tienenFase('final')) {
      const final = generarSiguienteRonda(partidosDe('semis'), ETIQUETAS_RONDAS.final, 'final')
      if (final) actuales = [...actuales, ...final]
    }
    if (tienenFase('semis') && !tienenFase('tercerPuesto')) {
      const tercerPuesto = generarTercerPuesto(partidosDe('semis'))
      if (tercerPuesto) actuales = [...actuales, tercerPuesto]
    }

    return actuales
  }, [partidos])

  // Carga (o sobreescribe) el resultado de un partido. Si el partido
  // pertenece a una ronda de playoffs, los partidos generados automáticamente
  // de rondas posteriores que dependían del equipo se eliminan, para evitar
  // datos inconsistentes si el admin corrige un resultado ya cargado.
  function cargarResultado(idPartido, { golesLocal, golesVisitante, penales = null, tiempoExtra = false, goles = [] }) {
    setPartidos(prev => {
      const partidoExiste = prev.find(p => p.id === idPartido)
      const ronda = partidoExiste?.ronda

      let siguientes = prev.map(p => {
        if (p.id !== idPartido) return p
        return {
          ...p,
          resultado: { local: golesLocal, visitante: golesVisitante },
          penales,
          tiempoExtra,
          goles,
          fechaFin: new Date().toISOString(),
        }
      })

      // Si es un partido de playoffs, borramos rondas posteriores ya generadas
      // para que se reconstruyan limpias con el nuevo resultado.
      if (ronda) {
        const ordenRondas = ['octavos', 'cuartos', 'semis', 'final', 'tercerPuesto']
        const idx = ordenRondas.indexOf(ronda)
        if (idx !== -1) {
          const rondasABorrar = ordenRondas.slice(idx + 1)
          siguientes = siguientes.filter(p => !rondasABorrar.includes(p.ronda))
        }
      }

      return siguientes
    })
  }

  // Borra el resultado cargado de un partido (vuelve a "pendiente")
  function borrarResultado(idPartido) {
    setPartidos(prev => {
      const partidoExiste = prev.find(p => p.id === idPartido)
      const ronda = partidoExiste?.ronda

      let siguientes = prev.map(p =>
        p.id === idPartido
          ? { ...p, resultado: null, penales: null, tiempoExtra: false, goles: [], fechaFin: undefined }
          : p
      )

      if (ronda) {
        const ordenRondas = ['octavos', 'cuartos', 'semis', 'final', 'tercerPuesto']
        const idx = ordenRondas.indexOf(ronda)
        if (idx !== -1) {
          const rondasABorrar = ordenRondas.slice(idx + 1)
          siguientes = siguientes.filter(p => !rondasABorrar.includes(p.ronda))
        }
      }

      return siguientes
    })
  }

  function reiniciarTorneo() {
    localStorage.removeItem(CLAVE_STORAGE)
    setPartidos(partidosIniciales)
  }

  const value = {
    partidos: partidosCompletos,
    cargarResultado,
    borrarResultado,
    reiniciarTorneo,
  }

  return <TorneoContext.Provider value={value}>{children}</TorneoContext.Provider>
}

export function useTorneo() {
  return useContext(TorneoContext)
}
