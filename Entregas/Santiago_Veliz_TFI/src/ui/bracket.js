/**
 * /src/ui/bracket.js
 * ─────────────────────────────────────────────────────────────
 * Renderiza la llave de eliminación en #contenedor-bracket.
 * Permite cargar resultados de cada cruce directamente desde
 * la vista de Playoffs.
 * ─────────────────────────────────────────────────────────────
 */

import {
  bracketInicial,
  cargarBracket,
  guardarBracket,
  registrarResultadoBracket,
  RONDAS,
} from '../logic/playoffs.js';

// Estado en memoria
let bracket = null;

// ── Init público ──────────────────────────────────────────────

/**
 * Inicializa o restaura el bracket y lo renderiza.
 * Llamar desde main.js en DOMContentLoaded.
 */
export function initBracket() {
  bracket = cargarBracket() ?? bracketInicial();
  renderBracket();
}

// ── Render principal ──────────────────────────────────────────

export function renderBracket() {
  const contenedor = document.getElementById('contenedor-bracket');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'bracket-wrapper';

  // Renderizar cada ronda
  [...RONDAS, 'tercerPuesto'].forEach(ronda => {
    const cruces = bracket[ronda];
    if (!cruces) return;

    const col = document.createElement('div');
    col.className = 'bracket-columna';

    const titulo = document.createElement('h3');
    titulo.className = 'bracket-columna__titulo';
    titulo.textContent = ronda === 'tercerPuesto' ? '3er Puesto' : ronda;
    col.appendChild(titulo);

    cruces.forEach((cruce, idx) => {
      col.appendChild(crearTarjetaCruce(ronda, idx, cruce));
    });

    wrapper.appendChild(col);
  });

  contenedor.appendChild(wrapper);
}

// ── Tarjeta de cruce ──────────────────────────────────────────

function crearTarjetaCruce(ronda, indice, cruce) {
  const card = document.createElement('div');
  card.className = `bracket-cruce ${cruce.estado === 'jugado' ? 'bracket-cruce--jugado' : ''}`;

  const esDefinido = cruce.local.id && cruce.visitante.id;

  card.innerHTML = `
    <div class="bracket-equipo ${ganador(cruce, 'local')}">
      ${escudoImg(cruce.local)}
      <span class="bracket-equipo__nombre">${cruce.local.nombre}</span>
      <span class="bracket-equipo__goles">${cruce.golesLocal ?? '–'}</span>
    </div>
    <div class="bracket-equipo ${ganador(cruce, 'visitante')}">
      ${escudoImg(cruce.visitante)}
      <span class="bracket-equipo__nombre">${cruce.visitante.nombre}</span>
      <span class="bracket-equipo__goles">${cruce.golesVisitante ?? '–'}</span>
    </div>
    ${cruce.estado === 'pendiente' && esDefinido ? botonCargar(ronda, indice) : ''}
  `;

  // Listener del formulario inline
  const form = card.querySelector('.bracket-form');
  if (form) {
    form.addEventListener('submit', e => handleBracketSubmit(e, ronda, indice));
  }

  return card;
}

// ── Helpers de render ─────────────────────────────────────────

function escudoImg(equipo) {
  if (!equipo.escudo) return `<span class="bracket-equipo__placeholder">🏳️</span>`;
  return `<img class="bracket-equipo__escudo" src="${equipo.escudo}" alt="${equipo.nombre}" />`;
}

function ganador(cruce, lado) {
  if (cruce.estado !== 'jugado') return '';
  const esGanador =
    lado === 'local'
      ? cruce.golesLocal > cruce.golesVisitante
      : cruce.golesVisitante > cruce.golesLocal;
  return esGanador ? 'bracket-equipo--ganador' : 'bracket-equipo--perdedor';
}

function botonCargar(ronda, indice) {
  return `
    <form class="bracket-form" data-ronda="${ronda}" data-indice="${indice}">
      <div class="bracket-form__inputs">
        <input type="number" name="golesLocal"     min="0" step="1" placeholder="0" required />
        <span>–</span>
        <input type="number" name="golesVisitante" min="0" step="1" placeholder="0" required />
      </div>
      <button type="submit" class="boton boton--primario bracket-form__btn">Guardar</button>
    </form>
  `;
}

// ── Handler submit del bracket ────────────────────────────────

function handleBracketSubmit(e, ronda, indice) {
  e.preventDefault();
  const form  = e.currentTarget;
  const golesL = parseInt(form.elements['golesLocal'].value,     10);
  const golesV = parseInt(form.elements['golesVisitante'].value, 10);

  if (isNaN(golesL) || isNaN(golesV) || golesL < 0 || golesV < 0) return;

  // No se permiten empates en eliminatorias
  if (golesL === golesV) {
    alert('En eliminatorias no puede haber empate. Ingresá un resultado con ganador.');
    return;
  }

  bracket = registrarResultadoBracket(bracket, ronda, indice, golesL, golesV);
  renderBracket();
}