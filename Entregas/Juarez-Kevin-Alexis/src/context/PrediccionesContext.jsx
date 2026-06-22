import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const PrediccionesContext = createContext()

// Puntos: resultado exacto = 3, solo ganador/empate correcto = 1, fallo = 0
function calcularPuntos(prediccion, resultado) {
  if (!resultado) return null // partido sin jugar
  const aciertaLocal = prediccion.local === resultado.local
  const aciertaVisitante = prediccion.visitante === resultado.visitante
  if (aciertaLocal && aciertaVisitante) return 3

  const ganadorPred =
    prediccion.local > prediccion.visitante ? 'local' :
    prediccion.local < prediccion.visitante ? 'visitante' : 'empate'
  const ganadorReal =
    resultado.local > resultado.visitante ? 'local' :
    resultado.local < resultado.visitante ? 'visitante' : 'empate'

  return ganadorPred === ganadorReal ? 1 : 0
}

export function PrediccionesProvider({ children }) {
  // { [userId]: { [partidoId]: { local, visitante } } }
  const [todas, setTodas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mundial2026_predicciones') || '{}') }
    catch { return {} }
  })
  const { usuario } = useAuth()

  useEffect(() => {
    localStorage.setItem('mundial2026_predicciones', JSON.stringify(todas))
  }, [todas])

  // Guardar o actualizar predicción
  function predecir(partidoId, local, visitante) {
    if (!usuario) return { error: 'Debés iniciar sesión para predecir' }
    const uid = String(usuario.id)
    setTodas(prev => ({
      ...prev,
      [uid]: { ...(prev[uid] || {}), [partidoId]: { local: Number(local), visitante: Number(visitante) } }
    }))
    return { ok: true }
  }

  // Predicción del usuario actual para un partido
  function miPrediccion(partidoId) {
    if (!usuario) return null
    return todas[String(usuario.id)]?.[partidoId] || null
  }

  // Mis predicciones con puntos calculados (necesita lista de partidos)
  function misPrediccionesConPuntos(partidos) {
    if (!usuario) return []
    const uid = String(usuario.id)
    const misP = todas[uid] || {}
    return Object.entries(misP).map(([partidoId, pred]) => {
      const partido = partidos.find(p => String(p.id) === String(partidoId))
      const pts = partido ? calcularPuntos(pred, partido.resultado) : null
      return { partidoId, pred, partido, pts }
    }).sort((a, b) => {
      // primero los que ya tienen resultado
      if (a.pts !== null && b.pts === null) return -1
      if (a.pts === null && b.pts !== null) return 1
      return 0
    })
  }

  // Ranking global de todos los usuarios con puntos totales
  function rankingGlobal(partidos) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    return usuarios
      .filter(u => u.rol !== 'admin')
      .map(u => {
        const uid = String(u.id)
        const misP = todas[uid] || {}
        let puntos = 0
        let exactos = 0
        let aciertos = 0
        Object.entries(misP).forEach(([pid, pred]) => {
          const partido = partidos.find(p => String(p.id) === String(pid))
          const pts = partido ? calcularPuntos(pred, partido.resultado) : null
          if (pts !== null) {
            puntos += pts
            if (pts === 3) exactos++
            if (pts >= 1) aciertos++
          }
        })
        return { nombre: `${u.nombre} ${u.apellido}`, puntos, exactos, aciertos, predicciones: Object.keys(misP).length }
      })
      .sort((a, b) => b.puntos - a.puntos || b.exactos - a.exactos)
  }

  return (
    <PrediccionesContext.Provider value={{ predecir, miPrediccion, misPrediccionesConPuntos, rankingGlobal }}>
      {children}
    </PrediccionesContext.Provider>
  )
}

export function usePredicciones() {
  return useContext(PrediccionesContext)
}
