import { partidos }                   from '../data/partidos.js';
import { equipos }                    from '../data/equipos.js';
import { calcularPosiciones, ordenarTabla } from './posiciones.js';

const LS_BRACKET = 'mundial26_bracket';

// ── Constantes ────────────────────────────────────────────────

export const RONDAS = [
  'Dieciseisavos',
  'Octavos',
  'Cuartos',
  'Semis',
  'Final'
];

// Cuántos clasificados por grupo avanzan directamente
const CLASIFICADOS_POR_GRUPO = 2;

// Placeholder para equipos aún no definidos
const POR_DEFINIR = { id: null, nombre: 'Por definir', escudo: null };

// ── Helpers ───────────────────────────────────────────────────

/**
 * Devuelve la tabla ordenada de un grupo específico.
 * @param {string} grupo - Letra del grupo ('A', 'B', …)
 * @returns {Array} Equipos del grupo ordenados por posición.
 */
function tablaDeGrupo(grupo) {
  const equiposGrupo  = equipos.filter(e => e.grupo === grupo);
  const partidosGrupo = partidos.filter(p => p.grupo === grupo);
  const tabla = calcularPosiciones(partidosGrupo, equiposGrupo);
  return ordenarTabla(tabla);
}

/**
 * Devuelve los N clasificados de un grupo.
 * Si el grupo no terminó, completa con POR_DEFINIR.
 * @param {string} grupo
 * @param {number} cantidad
 * @returns {Array}
 */
function clasificadosDeGrupo(grupo, cantidad = CLASIFICADOS_POR_GRUPO) {
  const tabla = tablaDeGrupo(grupo);
  const result = [];
  for (let i = 0; i < cantidad; i++) {
    result.push(tabla[i] ?? POR_DEFINIR);
  }
  return result;
}

/**
 * Devuelve true si todos los partidos del fixture tienen resultado.
 */
export function fixtureCompleto() {
  return partidos.every(p =>
    p.golesLocal !== null &&
    p.golesVisitante !== null
  );
}

/**
 * Obtiene todos los terceros de todos los grupos y devuelve los
 * 8 mejores ordenados por pts → dg → gf (criterio FIFA simplificado).
 * @returns {Array} 8 mejores terceros.
 */
function mejoresTerceros() {
  const grupos = [...new Set(equipos.map(e => e.grupo))].sort();
  const terceros = grupos
    .map(g => tablaDeGrupo(g)[2] ?? null)
    .filter(Boolean);

  return terceros
    .sort((a, b) =>
      b.pts - a.pts || b.dg - a.dg || b.gf - a.gf
    )
    .slice(0, 8);
}

// ── Armado del bracket inicial ────────────────────────────────

/**
 * Construye los 16 cruces de Octavos según el sorteo del Mundial 2026.
 * Cruce oficial: 1°A vs 2°B, 1°C vs 2°D, etc.
 * Con 12 grupos (A–L) + 8 mejores terceros.
 *
 * Si un equipo no está definido aún, usa POR_DEFINIR.
 * @returns {Array<{local, visitante, golesLocal, golesVisitante, estado}>}
 */
export function armarDieciseisavos() {

  if (!fixtureCompleto()) {
    return Array(16)
      .fill(null)
      .map(() => cruce(POR_DEFINIR, POR_DEFINIR));
  }

  const grupos = [...new Set(equipos.map(e => e.grupo))].sort();

  const primeros = [];
  const segundos = [];

  grupos.forEach(grupo => {
    const tabla = tablaDeGrupo(grupo);

    if (tabla[0]) primeros.push(tabla[0]);
    if (tabla[1]) segundos.push(tabla[1]);
  });

  const terceros = mejoresTerceros();

  const clasificados = [
    ...primeros,
    ...segundos,
    ...terceros
  ];

  const cruces = [];

  for (let i = 0; i < 32; i += 2) {
    cruces.push(
      cruce(
        clasificados[i],
        clasificados[i + 1]
      )
    );
  }

  return cruces;
}

/** Crea un objeto de cruce vacío. */
function cruce(local, visitante) {
  return {
    local:         { id: local?.id ?? null,     nombre: local?.nombre     ?? 'Por definir', escudo: local?.escudo     ?? null },
    visitante:     { id: visitante?.id ?? null,  nombre: visitante?.nombre ?? 'Por definir', escudo: visitante?.escudo ?? null },
    golesLocal:    null,
    golesVisitante: null,
    estado:        'pendiente',
  };
}

// ── Estado del bracket ────────────────────────────────────────

/**
 * Estructura inicial del bracket con las 4 rondas.
 */
export function bracketInicial() {
  return {
  Dieciseisavos: armarDieciseisavos(),

  Octavos: Array(8)
    .fill(null)
    .map(() => cruce(POR_DEFINIR, POR_DEFINIR)),

  Cuartos: Array(4)
    .fill(null)
    .map(() => cruce(POR_DEFINIR, POR_DEFINIR)),

  Semis: Array(2)
    .fill(null)
    .map(() => cruce(POR_DEFINIR, POR_DEFINIR)),

  Final: [cruce(POR_DEFINIR, POR_DEFINIR)],

  tercerPuesto: [cruce(POR_DEFINIR, POR_DEFINIR)],
};
}

// ── Persistencia ──────────────────────────────────────────────

export function guardarBracket(bracket) {
  try { localStorage.setItem(LS_BRACKET, JSON.stringify(bracket)); }
  catch (e) { console.warn('[playoffs] Error al guardar bracket:', e); }
}

export function cargarBracket() {
  try {
    const raw = localStorage.getItem(LS_BRACKET);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('[playoffs] Error al leer bracket:', e);
    return null;
  }
}

/**
 * Avanza al ganador de un cruce a la ronda siguiente.
 * @param {Object} bracket  - Estado actual del bracket.
 * @param {string} ronda    - Ronda actual ('Octavos', 'Cuartos', 'Semis').
 * @param {number} indice   - Índice del cruce dentro de la ronda.
 * @param {number} golesL   - Goles del local.
 * @param {number} golesV   - Goles del visitante.
 * @returns {Object} Nuevo bracket mutado.
 */
export function registrarResultadoBracket(bracket, ronda, indice, golesL, golesV) {
  const crucesRonda = bracket[ronda];
  if (!crucesRonda || !crucesRonda[indice]) return bracket;

  const partido = crucesRonda[indice];
  partido.golesLocal     = golesL;
  partido.golesVisitante = golesV;
  partido.estado         = 'jugado';

  const ganador = golesL > golesV ? partido.local : partido.visitante;
  const perdedor = golesL > golesV ? partido.visitante : partido.local;

  // Avanzar ganador a siguiente ronda
  const siguienteRonda = {
  Dieciseisavos: 'Octavos',
  Octavos: 'Cuartos',
  Cuartos: 'Semis',
  Semis: 'Final',
}[ronda];

  if (siguienteRonda && bracket[siguienteRonda]) {
    const destino = Math.floor(indice / 2);
    const esLocal = indice % 2 === 0;

    if (!bracket[siguienteRonda][destino]) {
      bracket[siguienteRonda][destino] = cruce(POR_DEFINIR, POR_DEFINIR);
    }

    if (esLocal) bracket[siguienteRonda][destino].local     = ganador;
    else         bracket[siguienteRonda][destino].visitante = ganador;
  }

  // Tercer puesto: los perdedores de Semis
  if (ronda === 'Semis') {
    const esLocal = indice % 2 === 0;
    if (esLocal) bracket.tercerPuesto[0].local     = perdedor;
    else         bracket.tercerPuesto[0].visitante = perdedor;
  }

  guardarBracket(bracket);
  return bracket;
}