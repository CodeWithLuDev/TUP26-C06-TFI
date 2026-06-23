/**
 * ─────────────────────────────────────────────────────────────
 * Renderiza las tablas #tabla-goleadores y #tabla-asistidores
 * con búsqueda por nombre y apellido completo.
 * ─────────────────────────────────────────────────────────────
 */

import { partidos }                               from '../data/partidos.js';
import { calcularGoleadores, calcularAsistidores } from '../logic/estadisticas.js';

// Estado de búsqueda
let busquedaGoleadores   = '';
let busquedaAsistidores  = '';

// ── Helper: pintar tabla con filtro opcional ──────────────────

function pintarTabla(tbodyId, ranking, mensajeVacio, filtro = '') {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody.innerHTML = '';

  const rankingFiltrado = filtro
    ? ranking.filter(j => j.nombre.toLowerCase().includes(filtro.toLowerCase()))
    : ranking;

  if (rankingFiltrado.length === 0) {
    tbody.innerHTML =
      `<tr><td colspan="3" class="mensaje-vacio">${filtro ? 'No se encontraron jugadores.' : mensajeVacio}</td></tr>`;
    return;
  }

  rankingFiltrado.forEach((jugador, index) => {
    const tr = document.createElement('tr');
    const posicion = index === 0 ? '🥇'
                   : index === 1 ? '🥈'
                   : index === 2 ? '🥉'
                   : index + 1;

    // Asegurar que se muestre nombre y apellido completo
    const nombreCompleto = jugador.nombreCompleto ?? jugador.nombre ?? '—';

    tr.innerHTML = `
      <td>${posicion}</td>
      <td>${nombreCompleto}</td>
      <td class="pts">${jugador.cantidad}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Helper: crear/reusar input de búsqueda sobre una tabla ───

function asegurarBuscador(contenedorId, placeholder, onInput) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  // Buscar si ya existe un buscador previo
  let wrapper = contenedor.previousElementSibling;
  if (wrapper && wrapper.classList.contains('estadistica-buscador')) return;

  wrapper = document.createElement('div');
  wrapper.className = 'estadistica-buscador';

  const label = document.createElement('span');
  label.className = 'estadistica-buscador__icono';
  label.textContent = '🔍';

  const input = document.createElement('input');
  input.type        = 'text';
  input.placeholder = placeholder;
  input.className   = 'estadistica-buscador__input';
  input.addEventListener('input', e => onInput(e.target.value));

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  // Insertar antes del contenedor (panel-estadistica)
  const panel = contenedor.closest('.panel-estadistica');
  if (panel) {
    panel.insertBefore(wrapper, contenedor.querySelector('table'));
  }
}

// ── Función pública ───────────────────────────────────────────

export function renderEstadisticas() {
  const goleadores   = calcularGoleadores(partidos);
  const asistidores  = calcularAsistidores(partidos);

  // Buscador de goleadores
  asegurarBuscador('panel-goleadores', 'Buscar goleador…', val => {
    busquedaGoleadores = val;
    pintarTabla('cuerpo-tabla-goleadores', goleadores, 'Todavía no hay goles cargados.', busquedaGoleadores);
  });

  // Buscador de asistidores
  asegurarBuscador('panel-asistidores', 'Buscar asistidor…', val => {
    busquedaAsistidores = val;
    pintarTabla('cuerpo-tabla-asistidores', asistidores, 'Todavía no hay asistencias cargadas.', busquedaAsistidores);
  });

  pintarTabla(
    'cuerpo-tabla-goleadores',
    goleadores,
    'Todavía no hay goles cargados.',
    busquedaGoleadores
  );

  pintarTabla(
    'cuerpo-tabla-asistidores',
    asistidores,
    'Todavía no hay asistencias cargadas.',
    busquedaAsistidores
  );
}