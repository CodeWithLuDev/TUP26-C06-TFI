/**
 * /src/ui/scoreForm.js
 */
import { partidos }            from '../data/partidos.js';
import { equipos }             from '../data/equipos.js';
import { calcularPosiciones, ordenarTabla } from '../logic/posiciones.js';
import { renderFixture, cerrarFormInline }  from './fixture.js';
import { renderGrupos }        from './grupos.js';
import { renderEstadisticas }  from './renderEstadisticas.js';
import { renderProde }         from './prode.js';

const LS_KEY = 'mundial26_partidos';

function guardarEnLS() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(partidos)); }
  catch(e) { console.warn('[scoreForm]', e); }
}

export function cargarDesdeLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    partidos.splice(0, partidos.length, ...JSON.parse(raw));
  } catch(e) { console.warn('[scoreForm]', e); }
}

export function poblarSelectPartidos() {
  // En el nuevo diseño no hay select visible, el id se setea desde fixture.js
}

function actualizarVistas() {
  renderFixture();
  renderGrupos();
  renderEstadisticas();
  renderProde();
}

function mostrarFeedback(msg, tipo) {
  const anuncios = document.getElementById('anuncios');
  if (anuncios) anuncios.textContent = msg;

  let zona = document.getElementById('scoreForm-feedback');
  if (!zona) {
    zona = document.createElement('p');
    zona.id = 'scoreForm-feedback';
    zona.setAttribute('aria-live', 'polite');
    zona.style.cssText = 'border-radius:6px;padding:0.5rem 1rem;margin-top:0.75rem;font-size:0.85rem;font-weight:600;transition:opacity 0.3s;';
    document.getElementById('formulario-resultado')?.appendChild(zona);
  }
  zona.textContent = msg;
  zona.style.opacity = '1';
  const ok = tipo === 'exito';
  zona.style.background = ok ? 'rgba(14,143,78,0.2)' : 'rgba(192,57,43,0.2)';
  zona.style.color       = ok ? '#4ade80' : '#f87171';
  zona.style.border      = ok ? '1px solid rgba(14,143,78,0.4)' : '1px solid rgba(192,57,43,0.4)';
  clearTimeout(zona._t);
  zona._t = setTimeout(() => { zona.style.opacity='0'; }, 3500);
}

function handleSubmit(e) {
  e.preventDefault();
  const form      = e.currentTarget;
  const partidoId = Number(form.elements['partido'].value);
  const golesL    = parseInt(form.elements['golesLocal'].value, 10);
  const golesV    = parseInt(form.elements['golesVisitante'].value, 10);
  const goleadores  = form.elements['goleadores'].value.trim();
  const asistidores = form.elements['asistidores'].value.trim();

  if (!partidoId) { mostrarFeedback('No hay partido seleccionado.', 'error'); return; }
  if (isNaN(golesL)||isNaN(golesV)||golesL<0||golesV<0) { mostrarFeedback('Ingresá goles válidos.', 'error'); return; }

  const partido = partidos.find(p => p.id === partidoId);
  if (!partido) { mostrarFeedback('Partido no encontrado.', 'error'); return; }
  if (partido.estado === 'jugado') { mostrarFeedback('Este partido ya tiene resultado.', 'error'); return; }

  partido.estado         = 'jugado';
  partido.golesLocal     = golesL;
  partido.golesVisitante = golesV;
  partido.goleadores  = goleadores  ? goleadores.split(',').map(n=>n.trim()).filter(Boolean)  : [];
  partido.asistidores = asistidores ? asistidores.split(',').map(n=>n.trim()).filter(Boolean) : [];

  guardarEnLS();
  actualizarVistas();
  cerrarFormInline();
  form.reset();
}

export function initScoreForm() {
  const form = document.getElementById('formulario-resultado');
  if (!form) return;
  cargarDesdeLS();
  form.addEventListener('submit', handleSubmit);
}