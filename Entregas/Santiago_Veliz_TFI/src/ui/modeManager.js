/**
 * /src/ui/modeManager.js
 * ─────────────────────────────────────────────────────────────
 * Gestiona el modo global: "real" (Mundial Real) o "sim" (Simulación).
 * Expone helpers para inyectar el selector en cualquier vista.
 * ─────────────────────────────────────────────────────────────
 */

let modoActual = 'real'; // 'real' | 'sim'
const listeners = [];

export function getModo() { return modoActual; }

export function onModoChange(fn) { listeners.push(fn); }

function notificar() { listeners.forEach(fn => fn(modoActual)); }

/**
 * Inyecta el selector de modo en `contenedor` (div padre).
 * Llama `onCambio(modo)` cada vez que el usuario cambia.
 */
export function inyectarSelectorModo(contenedor, onCambio) {
  // Evitar duplicados
  if (contenedor.querySelector('.modo-selector')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'modo-selector';

  const btnReal = document.createElement('button');
  btnReal.className = `modo-btn ${modoActual === 'real' ? 'modo-btn--activo' : ''}`;
  btnReal.textContent = '🌍 Mundial Real';
  btnReal.dataset.modo = 'real';

  const btnSim = document.createElement('button');
  btnSim.className = `modo-btn ${modoActual === 'sim' ? 'modo-btn--activo' : ''}`;
  btnSim.textContent = '🎮 Simulación';
  btnSim.dataset.modo = 'sim';

  const cambiar = (modo) => {
    modoActual = modo;
    btnReal.classList.toggle('modo-btn--activo', modo === 'real');
    btnSim.classList.toggle('modo-btn--activo', modo === 'sim');
    // Sync todos los otros selectores del mismo tipo
    document.querySelectorAll('.modo-btn').forEach(b => {
      b.classList.toggle('modo-btn--activo', b.dataset.modo === modo);
    });
    notificar();
    if (onCambio) onCambio(modo);
  };

  btnReal.addEventListener('click', () => cambiar('real'));
  btnSim.addEventListener('click',  () => cambiar('sim'));

  wrapper.appendChild(btnReal);
  wrapper.appendChild(btnSim);

  // Insertar al inicio del contenedor
  contenedor.insertBefore(wrapper, contenedor.firstChild);
}

/**
 * Genera acciones de simulación (Restablecer / Aleatorio).
 * `onRestablecer` y `onAleatorio` son callbacks.
 */
export function crearBarraSimulacion(onRestablecer, onAleatorio) {
  const barra = document.createElement('div');
  barra.className = 'sim-barra';

  const btnReset = document.createElement('button');
  btnReset.className = 'boton sim-btn sim-btn--reset';
  btnReset.innerHTML = '🔄 Restablecer todo';
  btnReset.addEventListener('click', onRestablecer);

  const btnAleatorio = document.createElement('button');
  btnAleatorio.className = 'boton sim-btn sim-btn--aleatorio';
  btnAleatorio.innerHTML = '🎲 Generar datos aleatorios';
  btnAleatorio.addEventListener('click', onAleatorio);

  barra.appendChild(btnReset);
  barra.appendChild(btnAleatorio);
  return barra;
}