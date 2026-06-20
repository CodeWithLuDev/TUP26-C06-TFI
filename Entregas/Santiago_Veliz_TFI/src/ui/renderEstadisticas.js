/**
 * ─────────────────────────────────────────────────────────────
 * Renderiza las tablas #tabla-goleadores y #tabla-asistidores
 * usando los datos calculados por /src/logic/estadisticas.js.
 * ─────────────────────────────────────────────────────────────
 */

import { partidos }                           from '../data/partidos.js';
import { calcularGoleadores, calcularAsistidores } from '../logic/estadisticas.js';

// ── Helper interno ────────────────────────────────────────────

/**
 * Rellena un <tbody> con filas de ranking.
 * @param {string} tbodyId        - ID del elemento <tbody>.
 * @param {Array}  ranking        - [{nombre, cantidad}] ya ordenado.
 * @param {string} mensajeVacio   - Texto cuando no hay datos.
 */
function pintarTabla(tbodyId, ranking, mensajeVacio) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody.innerHTML = '';

  if (ranking.length === 0) {
    tbody.innerHTML =
      `<tr><td colspan="3" class="mensaje-vacio">${mensajeVacio}</td></tr>`;
    return;
  }

  ranking.forEach((jugador, index) => {
    const tr = document.createElement('tr');

    // Medalla para el podio
    const posicion = index === 0 ? '🥇'
                   : index === 1 ? '🥈'
                   : index === 2 ? '🥉'
                   : index + 1;

    tr.innerHTML = `
      <td>${posicion}</td>
      <td>${jugador.nombre}</td>
      <td class="pts">${jugador.cantidad}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Función pública ───────────────────────────────────────────

/**
 * Recalcula y re-renderiza ambas tablas de estadísticas.
 * Llamar desde main.js al iniciar y desde scoreForm.js tras cada resultado.
 */
export function renderEstadisticas() {
  pintarTabla(
    'cuerpo-tabla-goleadores',
    calcularGoleadores(partidos),
    'Todavía no hay goles cargados.'
  );

  pintarTabla(
    'cuerpo-tabla-asistidores',
    calcularAsistidores(partidos),
    'Todavía no hay asistencias cargadas.'
  );
}