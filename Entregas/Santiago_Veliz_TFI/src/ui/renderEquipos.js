/**
 * /src/ui/renderEquipos.js
 */
import { equipos, obtenerListaDeGrupos } from '../data/equipos.js';

let grupoFiltro = '';
let busqueda    = '';

export function renderEquipos() {
  const contenedor = document.getElementById('grid-equipos');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // ── Controles ────────────────────────────────────────────
  const controles = document.createElement('div');
  controles.className = 'equipos-controles';

  const input = document.createElement('input');
  input.type        = 'text';
  input.placeholder = '🔍 Buscar equipo…';
  input.value       = busqueda;
  input.className   = 'equipos-busqueda';
  input.addEventListener('input', e => { busqueda = e.target.value.toLowerCase(); renderEquipos(); });

  const select = document.createElement('select');
  select.className = 'fixture-filtro__select';
  select.innerHTML = '<option value="">Todos los grupos</option>';
  obtenerListaDeGrupos().forEach(g => {
    const opt = document.createElement('option');
    opt.value = g; opt.textContent = `Grupo ${g}`;
    if (g === grupoFiltro) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', e => { grupoFiltro = e.target.value; renderEquipos(); });

  controles.appendChild(input);
  controles.appendChild(select);
  contenedor.appendChild(controles);

  // ── Filtrar ───────────────────────────────────────────────
  const filtrados = equipos.filter(e => {
    const matchGrupo  = !grupoFiltro || e.grupo === grupoFiltro;
    const matchNombre = !busqueda || e.nombre.toLowerCase().includes(busqueda) || e.nombreCorto.toLowerCase().includes(busqueda);
    return matchGrupo && matchNombre;
  });

  if (filtrados.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'mensaje-vacio';
    msg.textContent = 'No se encontraron equipos.';
    contenedor.appendChild(msg);
    return;
  }

  // ── Grid ─────────────────────────────────────────────────
  const grid = document.createElement('div');
  grid.className = 'grid-equipos__items';

  filtrados.forEach(equipo => {
    const card = document.createElement('article');
    card.className = 'tarjeta-equipo';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Ver información de ${equipo.nombre}`);

    card.innerHTML = `
      <span class="tarjeta-equipo__grupo">Grupo ${equipo.grupo}</span>
      <img class="tarjeta-equipo__escudo" src="${equipo.escudo}" alt="Bandera de ${equipo.nombre}" loading="lazy" />
      <h3 class="tarjeta-equipo__nombre">${equipo.nombre}</h3>
      <p class="tarjeta-equipo__confederacion">${equipo.confederacion}</p>
    `;

    const abrir = () => mostrarModalEquipo(equipo);
    card.addEventListener('click', abrir);
    card.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' '){e.preventDefault();abrir();} });
    grid.appendChild(card);
  });

  contenedor.appendChild(grid);
}

// ── Modal de equipo ───────────────────────────────────────────
function mostrarModalEquipo(equipo) {
  const overlay   = document.getElementById('modal-overlay');
  const contenido = document.getElementById('modal-contenido');
  if (!overlay || !contenido) return;

  const wiki = equipo.wiki ?? {};
  const jugadores = wiki.jugadoresDestacados ?? [];
  const anios = wiki.aniosCampeon?.length ? wiki.aniosCampeon.join(', ') : '—';
  const resumen = wiki.resumenHistorico ?? 'Sin información disponible.';

  contenido.innerHTML = `
    <button id="cerrar-modal" class="modal-cerrar" aria-label="Cerrar">✕</button>
    <div class="modal-equipo__header">
      <img class="modal-equipo__escudo" src="${equipo.escudo}" alt="${equipo.nombre}" />
      <div>
        <h2 id="modal-titulo" class="modal-equipo__nombre">${equipo.nombre}</h2>
        <p class="modal-equipo__meta">${equipo.confederacion} · Grupo ${equipo.grupo} · FIFA #${equipo.rankingFifa ?? '—'}</p>
      </div>
    </div>

    <p class="modal-equipo__resumen">${resumen}</p>

    <div class="modal-equipo__stats">
      <div class="modal-stat">
        <span class="modal-stat__valor">${wiki.mundialesGanados ?? 0}</span>
        <span class="modal-stat__label">Mundiales ganados</span>
      </div>
      <div class="modal-stat">
        <span class="modal-stat__valor">${anios}</span>
        <span class="modal-stat__label">Años campeón</span>
      </div>
      <div class="modal-stat">
        <span class="modal-stat__valor">${wiki.mejorResultado ?? '—'}</span>
        <span class="modal-stat__label">Mejor resultado</span>
      </div>
    </div>

    <div class="modal-equipo__seccion">
      <h3 class="modal-equipo__subtitulo">Director Técnico</h3>
      <p>${wiki.directorTecnico?.nombre ?? '—'}
        <span class="modal-equipo__meta"> (${wiki.directorTecnico?.nacionalidad ?? '—'})</span>
      </p>
    </div>

    ${jugadores.length ? `
    <div class="modal-equipo__seccion">
      <h3 class="modal-equipo__subtitulo">Jugadores destacados</h3>
      <ul class="modal-equipo__jugadores">
        ${jugadores.map(j => `
          <li class="modal-jugador">
            <span class="modal-jugador__nombre">${j.nombre}</span>
            <span class="modal-jugador__posicion">${j.posicion}</span>
          </li>`).join('')}
      </ul>
    </div>` : ''}
  `;

  overlay.removeAttribute('hidden');
  document.getElementById('cerrar-modal')?.focus();

  const cerrar = () => overlay.setAttribute('hidden', '');
  document.getElementById('cerrar-modal').addEventListener('click', cerrar);
  overlay.addEventListener('click', e => { if (e.target === overlay) cerrar(); });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') { cerrar(); document.removeEventListener('keydown', onEsc); }
  });
}