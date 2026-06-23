/**
 * ─────────────────────────────────────────────────────────────
 * Botón "Resetear torneo": limpia todo el LocalStorage y
 * recarga la app a su estado inicial (partidos todos pendientes).
 * ─────────────────────────────────────────────────────────────
 */

import { partidos }        from '../data/partidos.js';
import { renderFixture }   from './fixture.js';
import { renderGrupos }    from './grupos.js';
import { renderEstadisticas } from './renderEstadisticas.js';
import { renderProde }     from './prode.js';
import { initBracket }     from './bracket.js';
import { poblarSelectPartidos } from './scoreForm.js';

const LS_KEYS = [
  'mundial26_partidos',
  'mundial26_bracket',
  'mundial26_prode',
];

// Estado original: todos los partidos vuelven a pendiente
function resetearPartidos() {
  partidos.forEach(p => {
    p.estado         = 'pendiente';
    p.golesLocal     = null;
    p.golesVisitante = null;
    p.goleadores     = [];
    p.asistidores    = [];
  });
}

function resetearTodo() {
  // 1. Limpiar LocalStorage
  LS_KEYS.forEach(k => localStorage.removeItem(k));

  // 2. Resetear array en memoria
  resetearPartidos();

  // 3. Ocultar banner de campeón si estaba visible
  ocultarBannerCampeon();

  // 4. Re-renderizar todas las vistas
  renderFixture();
  renderGrupos();
  renderEstadisticas();
  renderProde();
  initBracket();
  poblarSelectPartidos();

  // 5. Feedback
  const anuncios = document.getElementById('anuncios');
  if (anuncios) anuncios.textContent = 'Torneo reseteado correctamente.';
}

export function initReset() {
  const btn = document.getElementById('btn-reset');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const confirmado = window.confirm(
      '⚠️ ¿Estás seguro? Se borrarán TODOS los resultados, predicciones y el bracket. Esta acción no se puede deshacer.'
    );
    if (confirmado) resetearTodo();
  });
}