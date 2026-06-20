import { partidos }      from '../data/partidos.js';
import { equipos }       from '../data/equipos.js';
import { renderFixture } from './fixture.js';
import { renderGrupos }  from './grupos.js';
import { renderEstadisticas } from './renderEstadisticas.js';


// ── Clave de LocalStorage ─────────────────────────────────────
const LS_KEY = 'mundial26_partidos';

// ── Persistencia ──────────────────────────────────────────────

function guardarEnLS() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(partidos));
  } catch (e) {
    console.warn('[scoreForm] Error al guardar en LocalStorage:', e);
  }
}

/**
 * Restaura el estado de los partidos desde LocalStorage
 * mutando el array exportado (que es `const` pero mutable).
 * Llamar UNA VEZ al iniciar la app, antes de cualquier render.
 */
export function cargarDesdeLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const guardados = JSON.parse(raw);
    // Mutamos sin reasignar (respeta el `export const`)
    partidos.splice(0, partidos.length, ...guardados);
  } catch (e) {
    console.warn('[scoreForm] Error al leer LocalStorage:', e);
  }
}

// ── Helpers ───────────────────────────────────────────────────

/**
 * Resuelve el nombre legible de un equipo a partir del ID usado
 * en partidos.js (mayúsculas) buscando en equipos.js (minúsculas).
 * @param {string} idPartido - Ej: 'ARG'
 * @returns {string} Nombre completo o el propio ID si no se encuentra.
 */
function resolverNombre(idPartido) {
  const equipo = equipos.find(
    e => e.id.toUpperCase() === idPartido.toUpperCase()
  );
  return equipo ? equipo.nombre : idPartido;
}

// ── Poblar el <select> ────────────────────────────────────────

/**
 * Rellena el selector #select-partido con los partidos pendientes.
 * Se llama al init y después de cada resultado guardado.
 */
export function poblarSelectPartidos() {
  const select = document.getElementById('select-partido');
  if (!select) return;

  select.innerHTML = '<option value="">— Seleccioná un partido —</option>';

  const pendientes = partidos.filter(p => p.estado === 'pendiente');

  if (pendientes.length === 0) {
    select.innerHTML =
      '<option value="" disabled>✔ Todos los partidos están jugados</option>';
    return;
  }

  pendientes.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent =
      `Grupo ${p.grupo} · ${resolverNombre(p.equipoLocal)} vs ${resolverNombre(p.equipoVisitante)}`;
    select.appendChild(option);
  });
}

// ── Re-renderizado global ─────────────────────────────────────

/**
 * Vuelve a pintar fixture y grupos después de cada cambio.
 * Ambas funciones leen directamente del array `partidos` importado,
 * por lo que alcanza con haberlo mutado antes de llamarlas.
 */
function actualizarVistas() {
  renderFixture();
  renderGrupos();
  renderEstadisticas();
  poblarSelectPartidos();
}

// ── Feedback visual/accesible ─────────────────────────────────

/**
 * Muestra un mensaje inline dentro del formulario y lo anuncia
 * al lector de pantalla a través del contenedor #anuncios.
 * @param {string} mensaje
 * @param {'exito'|'error'} tipo
 */
function mostrarFeedback(mensaje, tipo) {
  const anuncios = document.getElementById('anuncios');
  if (anuncios) anuncios.textContent = mensaje;

  let zona = document.getElementById('scoreForm-feedback');
  if (!zona) {
    zona = document.createElement('p');
    zona.id = 'scoreForm-feedback';
    zona.setAttribute('aria-live', 'polite');
    zona.style.cssText =
      'border-radius:6px;padding:0.5rem 1rem;margin-top:0.75rem;' +
      'font-size:0.85rem;font-weight:600;transition:opacity 0.3s;';
    document.getElementById('formulario-resultado')?.appendChild(zona);
  }

  zona.textContent  = mensaje;
  zona.style.opacity = '1';

  const esExito      = tipo === 'exito';
  zona.style.background = esExito ? 'rgba(14,143,78,0.2)'       : 'rgba(192,57,43,0.2)';
  zona.style.color      = esExito ? '#4ade80'                    : '#f87171';
  zona.style.border     = esExito
    ? '1px solid rgba(14,143,78,0.4)'
    : '1px solid rgba(192,57,43,0.4)';

  clearTimeout(zona._fadeTimer);
  zona._fadeTimer = setTimeout(() => { zona.style.opacity = '0'; }, 4500);
}

// ── Handler principal del submit ──────────────────────────────

function handleSubmit(e) {
  e.preventDefault();

  const form        = e.currentTarget;
  const partidoId   = Number(form.elements['partido'].value);
  const golesL      = parseInt(form.elements['golesLocal'].value,     10);
  const golesV      = parseInt(form.elements['golesVisitante'].value, 10);
  const goleadores  = form.elements['goleadores'].value.trim();
  const asistidores = form.elements['asistidores'].value.trim();

  // Validaciones
  if (!partidoId) {
    mostrarFeedback('Seleccioná un partido antes de guardar.', 'error');
    return;
  }
  if (isNaN(golesL) || isNaN(golesV) || golesL < 0 || golesV < 0) {
    mostrarFeedback('Ingresá valores de goles válidos (números ≥ 0).', 'error');
    return;
  }

  // Buscar partido por id numérico
  const partido = partidos.find(p => p.id === partidoId);
  if (!partido) {
    mostrarFeedback('Partido no encontrado. Recargá la página.', 'error');
    return;
  }
  if (partido.estado === 'jugado') {
    mostrarFeedback('Este partido ya tiene resultado cargado.', 'error');
    return;
  }

  // Mutar el objeto (el array es el mismo que importan fixture.js y grupos.js)
  partido.estado         = 'jugado';
  partido.golesLocal     = golesL;
  partido.golesVisitante = golesV;

  // Guardar goleadores/asistidores como arrays (para estadisticas.js futuro)
  partido.goleadores  = goleadores
    ? goleadores.split(',').map(n => n.trim()).filter(Boolean)
    : [];
  partido.asistidores = asistidores
    ? asistidores.split(',').map(n => n.trim()).filter(Boolean)
    : [];

  // Persistir y actualizar UI
  guardarEnLS();
  actualizarVistas();

  mostrarFeedback(
    `✔ ${resolverNombre(partido.equipoLocal)} ${golesL} – ${golesV} ${resolverNombre(partido.equipoVisitante)} guardado.`,
    'exito'
  );
  form.reset();
}

// ── Init público ──────────────────────────────────────────────

/**
 * Registra el listener del formulario y restaura el estado guardado.
 * Llamar UNA sola vez desde main.js dentro del DOMContentLoaded.
 */
export function initScoreForm() {
  const form = document.getElementById('formulario-resultado');
  if (!form) return;

  cargarDesdeLS();        // 1. Restaurar estado previo desde LocalStorage
  poblarSelectPartidos(); // 2. Poblar el <select> con los pendientes
  form.addEventListener('submit', handleSubmit);
}

