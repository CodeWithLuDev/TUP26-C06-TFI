/**
 * /src/ui/wikiEstadios.js
 * Renderiza las fichas de estadios en #contenedor-wiki-estadios
 * con modal de detalle al hacer clic.
 */
import { estadios } from '../data/estadios.js';

export function renderWikiEstadios() {
  const contenedor = document.getElementById('contenedor-wiki-estadios');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // Agrupar por país
  const porPais = estadios.reduce((acc, e) => {
    if (!acc[e.pais]) acc[e.pais] = [];
    acc[e.pais].push(e);
    return acc;
  }, {});

  Object.entries(porPais).forEach(([pais, lista]) => {
    const seccion = document.createElement('div');
    seccion.className = 'estadios-seccion';

    const titulo = document.createElement('h2');
    titulo.className   = 'estadios-seccion__titulo';
    titulo.textContent = pais;
    seccion.appendChild(titulo);

    const grid = document.createElement('div');
    grid.className = 'estadios-grid';

    lista.forEach(estadio => {
      grid.appendChild(crearCardEstadio(estadio));
    });

    seccion.appendChild(grid);
    contenedor.appendChild(seccion);
  });
}

// ── Tarjeta ───────────────────────────────────────────────────

function crearCardEstadio(estadio) {
  const card = document.createElement('article');
  card.className = 'estadio-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Ver ficha de ${estadio.nombre}`);

  card.innerHTML = `
    <div class="estadio-card__imagen-wrapper">
      <img
        class="estadio-card__imagen"
        src="${estadio.imagen}"
        alt="${estadio.nombre}"
        loading="lazy"
        onerror="this.style.display='none'"
      />
      <span class="estadio-card__pais">${estadio.pais}</span>
    </div>
    <div class="estadio-card__cuerpo">
      <h3 class="estadio-card__nombre">${estadio.nombre}</h3>
      <p class="estadio-card__ciudad">${estadio.ciudad}</p>
      <div class="estadio-card__datos">
        <span class="estadio-dato">
          <span class="estadio-dato__icono">👥</span>
          <span class="estadio-dato__valor">${estadio.capacidad.toLocaleString('es-AR')}</span>
        </span>
        <span class="estadio-dato">
          <span class="estadio-dato__icono">📅</span>
          <span class="estadio-dato__valor">${estadio.inaugurado}</span>
        </span>
      </div>
    </div>
  `;

  const abrir = () => mostrarModalEstadio(estadio);
  card.addEventListener('click', abrir);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); }
  });

  return card;
}

// ── Modal ─────────────────────────────────────────────────────

function mostrarModalEstadio(estadio) {
  const overlay   = document.getElementById('modal-overlay');
  const contenido = document.getElementById('modal-contenido');
  if (!overlay || !contenido) return;

  contenido.innerHTML = `
    <button id="cerrar-modal" class="modal-cerrar" aria-label="Cerrar ficha de ${estadio.nombre}">✕</button>
    <div class="modal-estadio">
      <img
        class="modal-estadio__imagen"
        src="${estadio.imagen}"
        alt="${estadio.nombre}"
        onerror="this.style.display='none'"
      />
      <div class="modal-estadio__header">
        <h2 id="modal-titulo" class="modal-equipo__nombre">${estadio.nombre}</h2>
        <p class="modal-equipo__meta">${estadio.ciudad} · ${estadio.pais}</p>
      </div>
      <p class="modal-equipo__resumen">${estadio.descripcion}</p>
      <div class="modal-equipo__stats">
        <div class="modal-stat">
          <span class="modal-stat__valor">${estadio.capacidad.toLocaleString('es-AR')}</span>
          <span class="modal-stat__label">Capacidad</span>
        </div>
        <div class="modal-stat">
          <span class="modal-stat__valor">${estadio.inaugurado}</span>
          <span class="modal-stat__label">Inaugurado</span>
        </div>
        <div class="modal-stat">
          <span class="modal-stat__valor">${estadio.superficie}</span>
          <span class="modal-stat__label">Superficie</span>
        </div>
      </div>
      <div class="modal-equipo__seccion">
        <h3 class="modal-equipo__subtitulo">Rol en el torneo</h3>
        <p>${estadio.partidos}</p>
      </div>
    </div>
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