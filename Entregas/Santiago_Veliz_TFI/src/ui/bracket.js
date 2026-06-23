import {
  bracketInicial,
  cargarBracket,
  guardarBracket,
  registrarResultadoBracket
} from '../logic/playoffs.js';
import { mostrarBannerCampeon } from './campeon.js';
import { fixtureCompleto } from '../logic/playoffs.js';

let bracket = null;

function simularBracketAleatorio() {
  if (!bracket) return;
  const rondas = [
  'Dieciseisavos',
  'Octavos',
  'Cuartos',
  'Semis',
  'Final',
  'tercerPuesto'
];
  rondas.forEach(ronda => {
    (bracket[ronda] ?? []).forEach((cruce, idx) => {
      if (cruce.estado === 'pendiente' && cruce.local?.id && cruce.visitante?.id) {
        let gl, gv;
        do { gl = Math.floor(Math.random() * 5); gv = Math.floor(Math.random() * 5); }
        while (gl === gv);
        bracket = registrarResultadoBracket(bracket, ronda, idx, gl, gv);
      }
    });
  });
  guardarBracket(bracket);
  renderBracket();
}

function restablecerBracket() {
  bracket = bracketInicial();
  guardarBracket(bracket);
  renderBracket();
}

export function initBracket() {
  bracket = cargarBracket() ?? bracketInicial();
  renderBracket();
}

export function renderBracket() {

  const contenedor = document.getElementById('contenedor-bracket');
  if (!contenedor) return;

  if (!fixtureCompleto()) {
    contenedor.innerHTML = `
      <div class="mensaje-bracket-bloqueado">
        <h2>🔒 Eliminatorias bloqueadas</h2>
        <p>
          Debes completar todos los partidos del Fixture antes de jugar las eliminatorias.
        </p>
        <p>
          Cuando finalice la fase de grupos, los cruces de Octavos se generarán automáticamente.
        </p>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = '';

  const barraAcciones = document.createElement('div');
  barraAcciones.className = 'bracket-acciones';
  barraAcciones.innerHTML = `
    <button id="btn-restablecer-bracket" class="boton boton--peligro" style="margin-right: 10px;">🔄 Restablecer Todo</button>
    <button id="btn-aleatorio-bracket" class="boton boton--primario">🎲 Resultados Aleatorios</button>
  `;
  contenedor.appendChild(barraAcciones);

    const dieciseisavos = bracket?.Dieciseisavos ?? [];
  const octavos = bracket?.Octavos ?? [];
  const cuartos = bracket?.Cuartos ?? [];
  const semis = bracket?.Semis ?? [];

  const final = bracket?.Final?.length === 1
    ? bracket.Final
    : Array(1).fill({ estado: 'pendiente' });

  const tercero = bracket?.tercerPuesto?.length === 1
    ? bracket.tercerPuesto
    : Array(1).fill({ estado: 'pendiente' });

  // ─────────────────────────────
  // División de rondas izquierda/derecha
  // ─────────────────────────────

  const mitadDiec = Math.ceil(dieciseisavos.length / 2);
  const diecL = dieciseisavos.slice(0, mitadDiec);
  const diecR = dieciseisavos.slice(mitadDiec);

  const mitadOct = Math.ceil(octavos.length / 2);
  const octavosL = octavos.slice(0, mitadOct);
  const octavosR = octavos.slice(mitadOct);

  const cuartosL = cuartos.slice(0, Math.ceil(cuartos.length / 2));
  const cuartosR = cuartos.slice(Math.ceil(cuartos.length / 2));

  const semiL = semis.slice(0, Math.ceil(semis.length / 2));
  const semiR = semis.slice(Math.ceil(semis.length / 2));

  const wrapper = document.createElement('div');
  wrapper.className = 'bracket-wrapper bracket-wrapper--convergente';

  const ladoIzq = document.createElement('div');
  ladoIzq.className = 'bracket-mitad bracket-mitad--izq';

  const centro = document.createElement('div');
  centro.className = 'bracket-centro';

  const ladoDer = document.createElement('div');
  ladoDer.className = 'bracket-mitad bracket-mitad--der';

function crearColumna(titulo, crucesArr, rondaNombre, offsetIndice = 0) {
  const col = document.createElement('div');
  col.className = 'bracket-columna';

  const tit = document.createElement('h3');
  tit.className = 'bracket-columna__titulo';
  tit.textContent = titulo;

  col.appendChild(tit);

  crucesArr.forEach((cruce, idx) => {
    col.appendChild(
      crearTarjetaCruce(
        rondaNombre,
        offsetIndice + idx,
        cruce
      )
    );
  });

  return col;
}

/* ─────────────────────────────
   LADO IZQUIERDO
───────────────────────────── */

ladoIzq.appendChild(
  crearColumna(
    'Dieciseisavos',
    diecL,
    'Dieciseisavos',
    0
  )
);

ladoIzq.appendChild(
  crearColumna(
    'Octavos',
    octavosL,
    'Octavos',
    0
  )
);

ladoIzq.appendChild(
  crearColumna(
    'Cuartos',
    cuartosL,
    'Cuartos',
    0
  )
);

ladoIzq.appendChild(
  crearColumna(
    'Semifinal',
    semiL,
    'Semis',
    0
  )
);

/* ─────────────────────────────
   CENTRO
───────────────────────────── */

const colFinal = document.createElement('div');
colFinal.className = 'bracket-columna bracket-columna--final';

// 1. Armamos y agregamos la Final
const titFinal = document.createElement('h3');
titFinal.className = 'bracket-columna__titulo';
titFinal.textContent = '⚽ Final';
colFinal.appendChild(titFinal);

final.forEach((cruce, idx) => {
  colFinal.appendChild(crearTarjetaCruce('Final', idx, cruce));
});

// 2. Armamos y agregamos el 3er Puesto
const bloqueTercero = document.createElement('div');
bloqueTercero.className = 'bloque-tercero';

const titTercero = document.createElement('h3');
titTercero.className = 'bracket-columna__titulo';
titTercero.textContent = '3er Puesto';
bloqueTercero.appendChild(titTercero);

tercero.forEach((cruce, idx) => {
  bloqueTercero.appendChild(crearTarjetaCruce('tercerPuesto', idx, cruce));
});

// Insertamos el bloque del tercer puesto debajo de la final
colFinal.appendChild(bloqueTercero);

// 3. Insertamos toda la columna en el centro de la pantalla
centro.appendChild(colFinal);

/* ─────────────────────────────
   LADO DERECHO
───────────────────────────── */

ladoDer.appendChild(
  crearColumna(
    'Semifinal',
    semiR,
    'Semis',
    semiL.length
  )
);

ladoDer.appendChild(
  crearColumna(
    'Cuartos',
    cuartosR,
    'Cuartos',
    cuartosL.length
  )
);

ladoDer.appendChild(
  crearColumna(
    'Octavos',
    octavosR,
    'Octavos',
    mitadOct
  )
);

ladoDer.appendChild(
  crearColumna(
    'Dieciseisavos',
    diecR,
    'Dieciseisavos',
    mitadDiec
  )
);

wrapper.appendChild(ladoIzq);
wrapper.appendChild(centro);
wrapper.appendChild(ladoDer);

contenedor.appendChild(wrapper);

document
  .getElementById('btn-aleatorio-bracket')
  ?.addEventListener('click', simularBracketAleatorio);

document
  .getElementById('btn-restablecer-bracket')
  ?.addEventListener('click', restablecerBracket);
}

function crearTarjetaCruce(ronda, indice, cruce) {
  const card = document.createElement('div');
  card.className = `bracket-cruce ${cruce.estado === 'jugado' ? 'bracket-cruce--jugado' : ''}`;
  const esDefinido = cruce.local?.id && cruce.visitante?.id;

  card.innerHTML = `
    <div class="bracket-equipo ${ganador(cruce, 'local')}">
      ${escudoImg(cruce.local)}
      <span class="bracket-equipo__nombre">${cruce.local?.nombre ?? 'Por definir'}</span>
      <span class="bracket-equipo__goles">${cruce.golesLocal ?? '–'}</span>
    </div>
    <div class="bracket-equipo ${ganador(cruce, 'visitante')}">
      ${escudoImg(cruce.visitante)}
      <span class="bracket-equipo__nombre">${cruce.visitante?.nombre ?? 'Por definir'}</span>
      <span class="bracket-equipo__goles">${cruce.golesVisitante ?? '–'}</span>
    </div>
    ${cruce.estado === 'pendiente' && esDefinido ? botonCargar(ronda, indice) : ''}
  `;

  const form = card.querySelector('.bracket-form');
  if (form) form.addEventListener('submit', e => handleBracketSubmit(e, ronda, indice));
  return card;
}

function escudoImg(equipo) {
  if (!equipo?.escudo) return `<span class="bracket-equipo__placeholder">🏳️</span>`;
  return `<img class="bracket-equipo__escudo" src="${equipo.escudo}" alt="" loading="lazy" />`;
}

function ganador(cruce, lado) {
  if (cruce.estado !== 'jugado') return '';
  const esGanador = lado === 'local' ? cruce.golesLocal > cruce.golesVisitante : cruce.golesVisitante > cruce.golesLocal;
  return esGanador ? 'bracket-equipo--ganador' : 'bracket-equipo--perdedor';
}

function botonCargar(ronda, indice) {
  return `
    <form class="bracket-form" data-ronda="${ronda}" data-indice="${indice}">
      <div class="bracket-form__inputs">
        <input type="number" name="golesLocal" min="0" step="1" placeholder="0" required />
        <span>–</span>
        <input type="number" name="golesVisitante" min="0" step="1" placeholder="0" required />
      </div>
      <button type="submit" class="boton boton--primario bracket-form__btn">Guardar</button>
    </form>
  `;
}

function handleBracketSubmit(e, ronda, indice) {
  e.preventDefault();
  const form   = e.currentTarget;
  const golesL = parseInt(form.elements['golesLocal'].value, 10);
  const golesV = parseInt(form.elements['golesVisitante'].value, 10);

  if (isNaN(golesL) || isNaN(golesV) || golesL < 0 || golesV < 0) return;
  if (golesL === golesV) {
    alert('En eliminatorias no puede haber empate. Ingresá un resultado con ganador.');
    return;
  }

  bracket = registrarResultadoBracket(bracket, ronda, indice, golesL, golesV);
  guardarBracket(bracket);
  renderBracket();

  if (ronda === 'Final') {
    const finalJugada = bracket['Final']?.[0];
    if (finalJugada?.estado === 'jugado') {
      const campeon = golesL > golesV ? finalJugada.local : finalJugada.visitante;
      mostrarBannerCampeon(campeon);
    }
  }
}   