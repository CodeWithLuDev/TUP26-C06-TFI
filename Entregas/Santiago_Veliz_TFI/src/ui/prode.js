/**
 * /src/ui/prode.js
 * ─────────────────────────────────────────────────────────────
 * Sistema de predicciones: el usuario pronostica resultados de
 * partidos pendientes ANTES de cargarlos en el fixture.
 * Las predicciones se guardan en LocalStorage y se comparan
 * automáticamente cuando se carga el resultado real.
 *
 * Contenedor: #contenedor-prode (.prode-lista)
 * LS key:     'mundial26_prode'
 * ─────────────────────────────────────────────────────────────
 */

import { partidos }          from '../data/partidos.js';
import { equipos }           from '../data/equipos.js';

const LS_PRODE = 'mundial26_prode';

// ── Persistencia ──────────────────────────────────────────────

function cargarPredicciones() {
  try {
    const raw = localStorage.getItem(LS_PRODE);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function guardarPredicciones(predicciones) {
  try { localStorage.setItem(LS_PRODE, JSON.stringify(predicciones)); }
  catch (e) { console.warn('[prode] Error al guardar:', e); }
}

// ── Helpers ───────────────────────────────────────────────────

function resolverEquipo(id) {
  return equipos.find(e => e.id === id);
}

/**
 * Evalúa si una predicción fue correcta comparándola con el resultado real.
 * @returns {'exacto'|'tendencia'|'error'|'pendiente'}
 */
function evaluarPrediccion(partido, pred) {
  if (partido.estado !== 'jugado') return 'pendiente';
  if (pred.golesLocal === null || pred.golesVisitante === null) return 'pendiente';

  const gl = partido.golesLocal;
  const gv = partido.golesVisitante;
  const pl = pred.golesLocal;
  const pv = pred.golesVisitante;

  if (gl === pl && gv === pv) return 'exacto';

  const tendenciaReal  = gl > gv ? 'L' : gl < gv ? 'V' : 'E';
  const tendenciaPred  = pl > pv ? 'L' : pl < pv ? 'V' : 'E';
  if (tendenciaReal === tendenciaPred) return 'tendencia';

  return 'error';
}

// ── Render ────────────────────────────────────────────────────

export function renderProde() {
  const contenedor = document.getElementById('contenedor-prode');
  if (!contenedor) return;

  const predicciones = cargarPredicciones();
  contenedor.innerHTML = '';

  // Separar partidos pendientes y jugados
  const pendientes = partidos.filter(p => p.estado === 'pendiente');
  const jugados    = partidos.filter(p => p.estado === 'jugado');

  // ── Resumen de puntos ─────────────────────────────────────
  const puntosExacto    = 3;
  const puntosTendencia = 1;

  let totalPuntos = 0;
  let totalPredecidos = 0;

  jugados.forEach(p => {
    const pred = predicciones[p.id];
    if (!pred) return;
    totalPredecidos++;
    const resultado = evaluarPrediccion(p, pred);
    if (resultado === 'exacto')    totalPuntos += puntosExacto;
    if (resultado === 'tendencia') totalPuntos += puntosTendencia;
  });

  // Banner de puntos
  const banner = document.createElement('div');
  banner.className = 'prode-banner';
  banner.innerHTML = `
    <div class="prode-banner__stat">
      <span class="prode-banner__valor">${totalPuntos}</span>
      <span class="prode-banner__label">Puntos</span>
    </div>
    <div class="prode-banner__stat">
      <span class="prode-banner__valor">${totalPredecidos}</span>
      <span class="prode-banner__label">Predecidos</span>
    </div>
    <div class="prode-banner__stat prode-banner__stat--info">
      <span class="prode-banner__valor prode-banner__valor--sm">⚽ exacto = 3pts</span>
      <span class="prode-banner__valor prode-banner__valor--sm">✅ tendencia = 1pt</span>
    </div>
  `;
  contenedor.appendChild(banner);

  // ── Sección de partidos pendientes (formulario) ───────────
  if (pendientes.length > 0) {
    const secPendientes = document.createElement('div');
    secPendientes.className = 'prode-seccion';
    secPendientes.innerHTML = '<h2 class="prode-seccion__titulo">Predecí los próximos partidos</h2>';

    pendientes.forEach(partido => {
      const local     = resolverEquipo(partido.equipoLocal);
      const visitante = resolverEquipo(partido.equipoVisitante);
      if (!local || !visitante) return;

      const pred = predicciones[partido.id] ?? { golesLocal: null, golesVisitante: null };

      const card = document.createElement('div');
      card.className = 'prode-card prode-card--pendiente';
      card.innerHTML = `
        <div class="prode-card__equipos">
          <div class="prode-card__equipo">
            <img class="prode-card__escudo" src="${local.escudo}" alt="${local.nombre}" />
            <span>${local.nombre}</span>
          </div>
          <span class="prode-card__vs">vs</span>
          <div class="prode-card__equipo prode-card__equipo--visitante">
            <img class="prode-card__escudo" src="${visitante.escudo}" alt="${visitante.nombre}" />
            <span>${visitante.nombre}</span>
          </div>
        </div>
        <form class="prode-form" data-partido-id="${partido.id}">
          <input
            type="number" name="golesLocal" min="0" step="1"
            placeholder="0" value="${pred.golesLocal ?? ''}"
            aria-label="Goles ${local.nombre}"
            class="prode-input"
          />
          <span class="prode-separador">–</span>
          <input
            type="number" name="golesVisitante" min="0" step="1"
            placeholder="0" value="${pred.golesVisitante ?? ''}"
            aria-label="Goles ${visitante.nombre}"
            class="prode-input"
          />
          <button type="submit" class="boton boton--prode">
            ${pred.golesLocal !== null ? '✏️ Editar' : '💾 Guardar'}
          </button>
        </form>
        <span class="prode-grupo">Grupo ${partido.grupo}</span>
      `;

      card.querySelector('.prode-form').addEventListener('submit', e => {
        e.preventDefault();
        const form = e.currentTarget;
        const gl = parseInt(form.elements['golesLocal'].value, 10);
        const gv = parseInt(form.elements['golesVisitante'].value, 10);
        if (isNaN(gl) || isNaN(gv) || gl < 0 || gv < 0) return;

        const preds = cargarPredicciones();
        preds[partido.id] = { golesLocal: gl, golesVisitante: gv };
        guardarPredicciones(preds);
        renderProde(); // re-render para reflejar cambio
      });

      secPendientes.appendChild(card);
    });

    contenedor.appendChild(secPendientes);
  }

  // ── Sección de resultados comparados ─────────────────────
  const predJugados = jugados.filter(p => predicciones[p.id]);

  if (predJugados.length > 0) {
    const secJugados = document.createElement('div');
    secJugados.className = 'prode-seccion';
    secJugados.innerHTML = '<h2 class="prode-seccion__titulo">Mis predicciones vs resultados reales</h2>';

    predJugados.forEach(partido => {
      const local     = resolverEquipo(partido.equipoLocal);
      const visitante = resolverEquipo(partido.equipoVisitante);
      const pred      = predicciones[partido.id];
      const resultado = evaluarPrediccion(partido, pred);

      const iconos = { exacto: '🎯', tendencia: '✅', error: '❌', pendiente: '⏳' };
      const labels = { exacto: 'Exacto (+3pts)', tendencia: 'Tendencia (+1pt)', error: 'Error (0pts)', pendiente: 'Pendiente' };

      const card = document.createElement('div');
      card.className = `prode-card prode-card--${resultado}`;
      card.innerHTML = `
        <div class="prode-card__equipos">
          <div class="prode-card__equipo">
            <img class="prode-card__escudo" src="${local?.escudo}" alt="${local?.nombre}" />
            <span>${local?.nombre ?? partido.equipoLocal}</span>
          </div>
          <div class="prode-card__marcadores">
            <span class="prode-marcador prode-marcador--pred" title="Tu predicción">
              ${pred.golesLocal} – ${pred.golesVisitante}
            </span>
            <span class="prode-marcador prode-marcador--real" title="Resultado real">
              ${partido.golesLocal} – ${partido.golesVisitante}
            </span>
          </div>
          <div class="prode-card__equipo prode-card__equipo--visitante">
            <img class="prode-card__escudo" src="${visitante?.escudo}" alt="${visitante?.nombre}" />
            <span>${visitante?.nombre ?? partido.equipoVisitante}</span>
          </div>
        </div>
        <span class="prode-resultado prode-resultado--${resultado}">
          ${iconos[resultado]} ${labels[resultado]}
        </span>
      `;

      secJugados.appendChild(card);
    });

    contenedor.appendChild(secJugados);
  }

  // Estado vacío
  if (pendientes.length === 0 && predJugados.length === 0) {
    contenedor.innerHTML = '<p class="mensaje-vacio">No hay partidos disponibles para predecir.</p>';
  }
}