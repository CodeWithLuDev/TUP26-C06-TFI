/**
 * /src/ui/prode.js
 * Sistema de predicciones sincronizado en vivo con el Fixture.
 */
import { partidos as partidosBase } from '../data/partidos.js';
import { equipos }  from '../data/equipos.js';

const LS_PRODE = 'mundial26_prode';

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

// ── LECTURA EN VIVO (Esto arregla el bug de sincronización) ──
function getPartidosLive() {
  const guardados = localStorage.getItem('mundial_partidos');
  return guardados ? JSON.parse(guardados) : partidosBase;
}

function resolverEquipo(id) {
  return equipos.find(e => e.id === id);
}

function evaluarPrediccion(partido, pred) {
  if (partido.estado !== 'jugado') return 'pendiente';
  if (pred.golesLocal === null || pred.golesVisitante === null) return 'pendiente';

  const gl = partido.golesLocal;
  const gv = partido.golesVisitante;
  const pl = pred.golesLocal;
  const pv = pred.golesVisitante;

  if (gl === pl && gv === pv) return 'exacto';

  const tendenciaReal = gl > gv ? 'L' : gl < gv ? 'V' : 'E';
  const tendenciaPred = pl > pv ? 'L' : pl < pv ? 'V' : 'E';
  if (tendenciaReal === tendenciaPred) return 'tendencia';

  return 'error';
}

const ICONOS  = { exacto: '🎯', tendencia: '✅', error: '❌', pendiente: '⏳' };
const LABELS  = { exacto: 'Exacto · +3 pts', tendencia: 'Tendencia · +1 pt', error: 'Error · 0 pts', pendiente: 'Pendiente' };
const PUNTOS  = { exacto: 3, tendencia: 1, error: 0, pendiente: 0 };

function bloqueEquipo(equipo, claseExtra = '') {
  return `
    <div class="prode-card__equipo ${claseExtra}">
      <img class="prode-card__escudo" src="${equipo?.escudo ?? ''}" alt="${equipo?.nombre ?? ''}" loading="lazy" />
      <span class="prode-card__nombre">${equipo?.nombre ?? '—'}</span>
    </div>
  `;
}

function crearTarjetaPendiente(partido, pred) {
  const local     = resolverEquipo(partido.equipoLocal);
  const visitante = resolverEquipo(partido.equipoVisitante);

  const card = document.createElement('div');
  card.className = 'prode-card prode-card--pendiente';
  card.innerHTML = `
    <div class="prode-card__cabecera">
      <span>Grupo ${partido.grupo}</span>
      <span class="prode-resultado prode-resultado--pendiente">⏳ Pendiente</span>
    </div>
    <div class="prode-card__cuerpo">
      ${bloqueEquipo(local)}
      <div class="prode-card__centro">
        <span class="prode-card__vs">VS</span>
      </div>
      ${bloqueEquipo(visitante, 'prode-card__equipo--visitante')}
    </div>
    <div class="prode-card__pie prode-card__pie--form">
      <form class="prode-form prode-form--centrada" data-partido-id="${partido.id}">
        <div class="prode-form__marcador">
          <input type="number" name="golesLocal" min="0" step="1" placeholder="0" value="${pred.golesLocal ?? ''}" class="prode-input" required />
          <span class="prode-separador">–</span>
          <input type="number" name="golesVisitante" min="0" step="1" placeholder="0" value="${pred.golesVisitante ?? ''}" class="prode-input" required />
        </div>
        <button type="submit" class="boton boton--prode">
          ${pred.golesLocal !== null ? '✏️ Editar' : '💾 Guardar'}
        </button>
      </form>
    </div>
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
    renderProde(); 
  });

  return card;
}

function crearTarjetaJugado(partido, pred) {
  const local     = resolverEquipo(partido.equipoLocal);
  const visitante = resolverEquipo(partido.equipoVisitante);
  const resultado = evaluarPrediccion(partido, pred);

  const card = document.createElement('div');
  card.className = `prode-card prode-card--${resultado}`;
  card.innerHTML = `
    <div class="prode-card__cabecera">
      <span>Grupo ${partido.grupo} · Finalizado</span>
      <span class="prode-resultado prode-resultado--${resultado}">
        ${ICONOS[resultado]} ${LABELS[resultado]}
      </span>
    </div>
    <div class="prode-card__cuerpo">
      ${bloqueEquipo(local)}
      <div class="prode-card__centro">
        <span class="prode-marcador--real">${partido.golesLocal} – ${partido.golesVisitante}</span>
        <span class="prode-card__vs">Resultado real</span>
      </div>
      ${bloqueEquipo(visitante, 'prode-card__equipo--visitante')}
    </div>
    <div class="prode-card__pie">
      <span class="prode-marcador--pred">Tu predicción: <strong>${pred.golesLocal} – ${pred.golesVisitante}</strong></span>
      <span class="prode-card__puntos">+${PUNTOS[resultado]} pts</span>
    </div>
  `;
  return card;
}

export function renderProde() {
  const contenedor = document.getElementById('contenedor-prode');
  if (!contenedor) return;

  const predicciones = cargarPredicciones();
  contenedor.innerHTML = '';

  const partidosLive = getPartidosLive();
  const pendientes  = partidosLive.filter(p => p.estado === 'pendiente');
  const jugados     = partidosLive.filter(p => p.estado === 'jugado');
  const predJugados = jugados.filter(p => predicciones[p.id]);

  let totalPuntos = 0;
  let totalPredecidos = 0;

  predJugados.forEach(p => {
    totalPredecidos++;
    totalPuntos += PUNTOS[evaluarPrediccion(p, predicciones[p.id])];
  });

  const banner = document.createElement('div');
  banner.className = 'prode-banner';
  banner.innerHTML = `
    <div class="prode-banner__stat">
      <span class="prode-banner__valor">${totalPuntos}</span><span class="prode-banner__label">Puntos</span>
    </div>
    <div class="prode-banner__stat">
      <span class="prode-banner__valor">${totalPredecidos}</span><span class="prode-banner__label">Predecidos</span>
    </div>
    <div class="prode-banner__stat prode-banner__stat--info">
      <span class="prode-banner__valor prode-banner__valor--sm">🎯 exacto = 3pts</span>
      <span class="prode-banner__valor prode-banner__valor--sm">✅ tendencia = 1pt</span>
    </div>
  `;
  contenedor.appendChild(banner);

  if (pendientes.length > 0) {
    const sec = document.createElement('div');
    sec.className = 'prode-seccion';
    sec.innerHTML = '<h2 class="prode-seccion__titulo">Predecí los próximos partidos</h2>';
    pendientes.forEach(partido => {
      const pred = predicciones[partido.id] ?? { golesLocal: null, golesVisitante: null };
      sec.appendChild(crearTarjetaPendiente(partido, pred));
    });
    contenedor.appendChild(sec);
  }

  if (predJugados.length > 0) {
    const sec = document.createElement('div');
    sec.className = 'prode-seccion';
    sec.innerHTML = '<h2 class="prode-seccion__titulo">Tus predicciones vs. resultados reales</h2>';
    predJugados.forEach(partido => {
      sec.appendChild(crearTarjetaJugado(partido, predicciones[partido.id]));
    });
    contenedor.appendChild(sec);
  }

  if (pendientes.length === 0 && predJugados.length === 0) {
    contenedor.innerHTML += '<p class="mensaje-vacio">No hay partidos disponibles para predecir.</p>';
  }
}