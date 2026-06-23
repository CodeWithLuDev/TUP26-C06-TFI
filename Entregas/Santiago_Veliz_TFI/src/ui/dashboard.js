/**
 * ─────────────────────────────────────────────────────────────
 * Panel de inicio ("Dashboard"), accesible al hacer clic en el
 * logo MUNDIAL26. Muestra de un vistazo:
 *   - Columna izquierda : grilla de los 48 equipos participantes
 *   - Columna derecha   : tabla de posiciones (reutiliza el mismo
 *                          render que la vista "Tabla de Posiciones"
 *                          gracias a #dashboard-tablas en grupos.js),
 *                          + top 5 goleadores + top 5 asistidores.
 * ─────────────────────────────────────────────────────────────
 */

import { equipos }   from '../data/equipos.js';
import { partidos }  from '../data/partidos.js';
import { calcularGoleadores, calcularAsistidores } from '../logic/estadisticas.js';
import { mostrarModalEquipo } from './renderEquipos.js';

export function renderDashboard() {
  renderEquiposDashboard();
  renderRankingDashboard('dashboard-goleadores', calcularGoleadores(partidos), 'Todavía no hay goles cargados.');
  renderRankingDashboard('dashboard-asistidores', calcularAsistidores(partidos), 'Todavía no hay asistencias cargadas.');
  // La tabla de posiciones (#dashboard-tablas) se llena sola: renderGrupos()
  // ya la incluye entre sus contenedores de destino.
}

// ── Grilla compacta de equipos ────────────────────────────────

function renderEquiposDashboard() {
  const contenedor = document.getElementById('dashboard-equipos');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'grid-equipos__items grid-equipos__items--mini';

  equipos.forEach(equipo => {
    const card = document.createElement('article');
    card.className = 'tarjeta-equipo tarjeta-equipo--mini';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Ver información de ${equipo.nombre}`);

    card.innerHTML = `
      <span class="tarjeta-equipo__grupo">${equipo.grupo}</span>
      <img class="tarjeta-equipo__escudo" src="${equipo.escudo}" alt="Bandera de ${equipo.nombre}" loading="lazy" />
      <h3 class="tarjeta-equipo__nombre">${equipo.nombreCorto}</h3>
    `;

    const abrir = () => mostrarModalEquipo(equipo);
    card.addEventListener('click', abrir);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } });

    grid.appendChild(card);
  });

  contenedor.appendChild(grid);
}

// ── Top 5 goleadores / asistidores ────────────────────────────

function renderRankingDashboard(tbodyId, rankingCompleto, mensajeVacio) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  const top5 = rankingCompleto.slice(0, 5);
  tbody.innerHTML = '';

  if (top5.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="mensaje-vacio">${mensajeVacio}</td></tr>`;
    return;
  }

  top5.forEach((jugador, index) => {
    const tr = document.createElement('tr');
    const posicion = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1;
    tr.innerHTML = `
      <td>${posicion}</td>
      <td>${jugador.nombre}</td>
      <td class="pts">${jugador.cantidad}</td>
    `;
    tbody.appendChild(tr);
  });
}
