/**
 * store.js
 * Estado global de la aplicación y persistencia en localStorage.
 *
 * Patrón: Estado centralizado con suscriptores (observer simple).
 * Cualquier módulo puede:
 *   - Leer el estado:          store.getState()
 *   - Mutar el estado:         store.dispatch(accion, payload)
 *   - Suscribirse a cambios:   store.subscribe(callback)
 *
 * El estado se persiste automáticamente en localStorage después de cada dispatch.
 */

import { PARTIDOS_GRUPOS, PLANTILLAS_PLAYOFFS } from "./data/partidos.js";
import { RESULTADOS_SEED } from "./data/resultados_seed.js";

const STORAGE_KEY = "mundial2022_estado";

// ── Estado inicial ─────────────────────────────────────────────────────────────
function crearEstadoInicial(conSemilla = false) {
  // Convertir arrays de partidos a mapas para O(1) lookup
  const partidos = {};
  for (const p of [...PARTIDOS_GRUPOS, ...PLANTILLAS_PLAYOFFS]) {
    partidos[p.id] = { ...p, resultado: null };
  }
  // Aplicar resultados semilla si se solicita
  if (conSemilla) {
    for (const [id, res] of Object.entries(RESULTADOS_SEED)) {
      if (partidos[id]) {
        partidos[id].resultado = {
          golesLocal: res.golesLocal,
          golesVisitante: res.golesVisitante,
          definidoPor: "normal",
          goles: [],
          tarjetas: {},
          tarjetasLista: [],
        };
      }
    }
  }
  return { partidos, jugadores: {}, predicciones: {} };
}

// ── Carga desde localStorage ───────────────────────────────────────────────────
function cargarEstado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return crearEstadoInicial(true);
    const guardado = JSON.parse(raw);

    // Merge: partidos base + resultados guardados + seed para completar faltantes
    const base = crearEstadoInicial(true);
    for (const id of Object.keys(base.partidos)) {
      if (guardado.partidos?.[id]?.resultado) {
        base.partidos[id].resultado = guardado.partidos[id].resultado;
      }
    }
    base.jugadores = guardado.jugadores || {};
    base.predicciones = guardado.predicciones || {};
    return base;
  } catch {
    console.warn("Estado corrupto en localStorage, reseteando.");
    return crearEstadoInicial();
  }
}

// ── Store ──────────────────────────────────────────────────────────────────────
let estado = cargarEstado();
const suscriptores = new Set();

function persistir() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch (e) {
    console.error("Error al persistir estado:", e);
  }
}

function notificar() {
  for (const fn of suscriptores) fn(estado);
}

export const store = {
  /** Retorna una copia del estado actual */
  getState: () => estado,

  /** Suscribirse a cambios. Retorna función para desuscribirse. */
  subscribe: (fn) => {
    suscriptores.add(fn);
    return () => suscriptores.delete(fn);
  },

  /**
   * Mutaciones disponibles.
   *
   * @param {"CARGAR_RESULTADO"|"BORRAR_RESULTADO"|"RESET"} accion
   * @param {Object} payload
   */
  dispatch: (accion, payload) => {
    switch (accion) {

      case "CARGAR_RESULTADO": {
        const { partidoId, golesLocal, golesVisitante, definidoPor, goles, localId, visitanteId } = payload;
        let partido = estado.partidos[partidoId];
        if (!partido) throw new Error(`Partido no encontrado: ${partidoId}`);

        // Para playoffs, el store tiene plantillas sin localId/visitanteId;
        // se asignan desde el payload que viene del bracket resuelto.
        if (localId)   partido = { ...partido, localId };
        if (visitanteId) partido = { ...partido, visitanteId };
        if (!partido.localId || !partido.visitanteId) {
          throw new Error("El partido no tiene equipos asignados aún.");
        }

        // Registrar jugadores nuevos en el mapa global de jugadores
        for (const gol of (goles || [])) {
          if (gol.jugadorId && !estado.jugadores[gol.jugadorId]) {
            estado.jugadores[gol.jugadorId] = {
              id:      gol.jugadorId,
              nombre:  gol.jugadorNombre,
              equipoId: gol.equipoId,
            };
          }
          if (gol.asistenciaJugadorId && !estado.jugadores[gol.asistenciaJugadorId]) {
            estado.jugadores[gol.asistenciaJugadorId] = {
              id:      gol.asistenciaJugadorId,
              nombre:  gol.asistenciaJugadorNombre,
              equipoId: gol.equipoId,
            };
          }
        }

        // Calcular conteos de tarjetas
        const tarjetasLista = payload.tarjetasLista || [];
        const tarjetas = { localAmarillas: 0, localRojas: 0, visitanteAmarillas: 0, visitanteRojas: 0 };
        for (const t of tarjetasLista) {
          if (t.equipoId === partido.localId) {
            if (t.tipo === "amarilla") tarjetas.localAmarillas++;
            else tarjetas.localRojas++;
          } else {
            if (t.tipo === "amarilla") tarjetas.visitanteAmarillas++;
            else tarjetas.visitanteRojas++;
          }
        }

        // Actualizar el partido con el resultado
        estado.partidos[partidoId] = {
          ...partido,
          resultado: {
            golesLocal:     Number(golesLocal),
            golesVisitante: Number(golesVisitante),
            definidoPor:    definidoPor || "normal",
            goles:          goles || [],
            tarjetas,
            tarjetasLista,
          },
        };
        break;
      }

      case "BORRAR_RESULTADO": {
        const { partidoId } = payload;
        const partido = estado.partidos[partidoId];
        if (partido) {
          estado.partidos[partidoId] = { ...partido, resultado: null };
        }
        break;
      }

      case "PREDECIR": {
        const { partidoId: ppId, localGoles, visitanteGoles } = payload;
        estado.predicciones = estado.predicciones || {};
        estado.predicciones[ppId] = {
          localGoles: Number(localGoles),
          visitanteGoles: Number(visitanteGoles),
        };
        break;
      }

      case "RESET": {
        // ⚠️ Borra todos los resultados cargados (mantiene el calendario)
        estado = crearEstadoInicial(true);
        break;
      }

      default:
        console.warn(`Acción desconocida: ${accion}`);
        return;
    }

    persistir();
    notificar();
  },

  /** Resetea el estado y limpia localStorage (útil para tests) */
  resetCompleto: () => {
    localStorage.removeItem(STORAGE_KEY);
    estado = crearEstadoInicial(true);
    notificar();
  },
};
