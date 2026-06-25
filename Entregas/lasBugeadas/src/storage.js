/**
 * storage.js — Capa de persistencia con LocalStorage
 * Centraliza todas las operaciones de lectura/escritura
 */

const STORAGE_KEYS = {
  RESULTADOS:   'mundial_resultados',
  GOLEADORES:   'mundial_goleadores',
  ASISTIDORES:  'mundial_asistidores',
  PLAYOFFS:     'mundial_playoffs',
  CONFIG:       'mundial_config',
  VERSION:      'mundial_version',
};

const STORAGE_VERSION = '1.0.0';

/** ── Utilidades internas ── */
function _guardar(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
    return true;
  } catch (e) {
    console.error(`[Storage] Error guardando ${clave}:`, e);
    return false;
  }
}

function _leer(clave, valorPorDefecto = null) {
  try {
    const raw = localStorage.getItem(clave);
    return raw !== null ? JSON.parse(raw) : valorPorDefecto;
  } catch (e) {
    console.error(`[Storage] Error leyendo ${clave}:`, e);
    return valorPorDefecto;
  }
}

/** ── Inicialización ── */
function inicializarStorage() {
  const version = _leer(STORAGE_KEYS.VERSION);
  if (version !== STORAGE_VERSION) {
    // Solo limpiar si hay versión diferente (no en primera carga)
    if (version !== null) {
      console.warn('[Storage] Versión diferente detectada. Se conservan los datos.');
    }
    _guardar(STORAGE_KEYS.VERSION, STORAGE_VERSION);
  }
}

/** ── Resultados ── */

/**
 * Guarda el resultado de un partido de grupos
 * @param {string} partidoId
 * @param {{ golesLocal: number, golesVisitante: number, jugado: boolean, tipoResultado?: string }} resultado
 */
function guardarResultado(partidoId, resultado) {
  const resultados = _leer(STORAGE_KEYS.RESULTADOS, {});
  resultados[partidoId] = { ...resultado, timestamp: Date.now() };
  return _guardar(STORAGE_KEYS.RESULTADOS, resultados);
}

/** Obtiene el resultado de un partido por ID */
function getResultado(partidoId) {
  const resultados = _leer(STORAGE_KEYS.RESULTADOS, {});
  return resultados[partidoId] || null;
}

/** Obtiene todos los resultados */
function getTodosLosResultados() {
  return _leer(STORAGE_KEYS.RESULTADOS, {});
}

/** Borra el resultado de un partido */
function borrarResultado(partidoId) {
  const resultados = _leer(STORAGE_KEYS.RESULTADOS, {});
  delete resultados[partidoId];
  return _guardar(STORAGE_KEYS.RESULTADOS, resultados);
}

/** ── Estadísticas: Goleadores ── */

/**
 * Guarda los goleadores de un partido
 * @param {string} partidoId
 * @param {Array<{ jugador: string, equipo: string, goles: number }>} goleadores
 */
function guardarGoleadores(partidoId, goleadores) {
  const todos = _leer(STORAGE_KEYS.GOLEADORES, {});
  todos[partidoId] = goleadores;
  return _guardar(STORAGE_KEYS.GOLEADORES, todos);
}

/** Obtiene todos los goleadores del torneo agrupados */
function getTodosGoleadores() {
  return _leer(STORAGE_KEYS.GOLEADORES, {});
}

/** ── Estadísticas: Asistidores ── */

/**
 * Guarda los asistidores de un partido
 * @param {string} partidoId
 * @param {Array<{ jugador: string, equipo: string, asistencias: number }>} asistidores
 */
function guardarAsistidores(partidoId, asistidores) {
  const todos = _leer(STORAGE_KEYS.ASISTIDORES, {});
  todos[partidoId] = asistidores;
  return _guardar(STORAGE_KEYS.ASISTIDORES, todos);
}

/** Obtiene todos los asistidores del torneo */
function getTodosAsistidores() {
  return _leer(STORAGE_KEYS.ASISTIDORES, {});
}

/** ── Playoffs ── */

/**
 * Guarda el estado completo de los playoffs
 * @param {Object} playoffsState
 */
function guardarPlayoffs(playoffsState) {
  return _guardar(STORAGE_KEYS.PLAYOFFS, playoffsState);
}

/** Obtiene el estado de los playoffs */
function getPlayoffs() {
  return _leer(STORAGE_KEYS.PLAYOFFS, null);
}

/** ── Configuración ── */

function guardarConfig(config) {
  return _guardar(STORAGE_KEYS.CONFIG, config);
}

function getConfig() {
  return _leer(STORAGE_KEYS.CONFIG, { tema: 'auto' });
}

/** ── Reset Total ── */
function resetearTodoLosDatos() {
  Object.values(STORAGE_KEYS).forEach(clave => {
    localStorage.removeItem(clave);
  });
  // También limpiar el nombre de usuario para volver a la bienvenida
  localStorage.removeItem('mundial_usuario');
  inicializarStorage();
  console.info('[Storage] Datos reseteados completamente.');
}

/** ── Exportar estado completo ── */
function exportarEstado() {
  return {
    version:    STORAGE_VERSION,
    timestamp:  Date.now(),
    resultados: getTodosLosResultados(),
    goleadores: getTodosGoleadores(),
    asistidores:getTodosAsistidores(),
    playoffs:   getPlayoffs(),
    config:     getConfig(),
  };
}

/** ── Importar estado ── */
function importarEstado(estado) {
  if (!estado || estado.version !== STORAGE_VERSION) return false;
  _guardar(STORAGE_KEYS.RESULTADOS, estado.resultados || {});
  _guardar(STORAGE_KEYS.GOLEADORES, estado.goleadores || {});
  _guardar(STORAGE_KEYS.ASISTIDORES, estado.asistidores || {});
  if (estado.playoffs) _guardar(STORAGE_KEYS.PLAYOFFS, estado.playoffs);
  if (estado.config)   _guardar(STORAGE_KEYS.CONFIG, estado.config);
  return true;
}