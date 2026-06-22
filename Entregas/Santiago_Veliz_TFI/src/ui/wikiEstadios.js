/**
 * /src/ui/wikiEstadios.js
 * Renderiza la vista de Estadios con sedes destacadas y grilla del resto.
 */
import { estadios } from '../data/estadios.js';

export function renderWikiEstadios() {
  const contenedor = document.getElementById('contenedor-wiki-estadios');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // ── 3 sedes destacadas ────────────────────────────────────
  const destacados = [
    { id: 'azteca',  badge: '🏟️ Partido Inaugural' },
    { id: 'metlife', badge: '🏆 Final'              },
    { id: 'sofi',    badge: '⚡ Semifinal'           },
  ];

  const secDestacados = document.createElement('div');
  secDestacados.innerHTML = '<h2 class="estadios-seccion__titulo">Sedes principales</h2>';
  const gridDestacados = document.createElement('div');
  gridDestacados.className = 'estadios-destacados';

  destacados.forEach(({ id, badge }) => {
    const e = estadios.find(est => est.id === id);
    if (!e) return;

    const card = document.createElement('div');
    card.className = 'estadio-destacado';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Ver ficha de ${e.nombre}`);

    card.innerHTML = `
      <img class="estadio-destacado__img" src="${e.imagen}" alt="${e.nombre}"
        loading="lazy" onerror="this.style.display='none'" />
      <div class="estadio-destacado__overlay">
        <span class="estadio-destacado__badge">${badge}</span>
        <p class="estadio-destacado__nombre">${e.nombre}</p>
        <p class="estadio-destacado__ciudad">${e.ciudad} · ${e.pais}</p>
      </div>
    `;

    const abrir = () => mostrarModalEstadio(e);
    card.addEventListener('click', abrir);
    card.addEventListener('keydown', ev => { if (ev.key==='Enter'||ev.key===' '){ev.preventDefault();abrir();} });
    gridDestacados.appendChild(card);
  });

  secDestacados.appendChild(gridDestacados);
  contenedor.appendChild(secDestacados);

  // ── Resto agrupadas por país ──────────────────────────────
  const resto = estadios.filter(e => !destacados.map(d=>d.id).includes(e.id));
  const porPais = resto.reduce((acc, e) => {
    if (!acc[e.pais]) acc[e.pais] = [];
    acc[e.pais].push(e);
    return acc;
  }, {});

  const secResto = document.createElement('div');
  secResto.innerHTML = '<h2 class="estadios-seccion__titulo">Todas las sedes</h2>';

  Object.entries(porPais).forEach(([pais, lista]) => {
    const grupo = document.createElement('div');
    grupo.className = 'estadios-seccion';

    const tit = document.createElement('h3');
    tit.className = 'estadios-seccion__titulo';
    tit.style.fontSize = '0.85rem';
    tit.textContent = pais;
    grupo.appendChild(tit);

    const grid = document.createElement('div');
    grid.className = 'estadios-grid';

    lista.forEach(e => {
      const card = document.createElement('article');
      card.className = 'estadio-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Ver ficha de ${e.nombre}`);
      card.innerHTML = `
        <div class="estadio-card__imagen-wrapper">
          <img class="estadio-card__imagen" src="${e.imagen}" alt="${e.nombre}"
            loading="lazy" onerror="this.style.display='none'" />
          <span class="estadio-card__pais">${e.pais}</span>
        </div>
        <div class="estadio-card__cuerpo">
          <h3 class="estadio-card__nombre">${e.nombre}</h3>
          <p class="estadio-card__ciudad">${e.ciudad}</p>
          <div class="estadio-card__datos">
            <span class="estadio-dato">
              <span>👥</span>
              <span class="estadio-dato__valor">${e.capacidad.toLocaleString('es-AR')}</span>
            </span>
            <span class="estadio-dato">
              <span>📅</span>
              <span class="estadio-dato__valor">${e.inaugurado}</span>
            </span>
          </div>
        </div>
      `;
      const abrir = () => mostrarModalEstadio(e);
      card.addEventListener('click', abrir);
      card.addEventListener('keydown', ev => { if (ev.key==='Enter'||ev.key===' '){ev.preventDefault();abrir();} });
      grid.appendChild(card);
    });

    grupo.appendChild(grid);
    secResto.appendChild(grupo);
  });

  contenedor.appendChild(secResto);
}

// ── Modal de detalle ──────────────────────────────────────────
function mostrarModalEstadio(e) {
  const overlay   = document.getElementById('modal-overlay');
  const contenido = document.getElementById('modal-contenido');
  if (!overlay || !contenido) return;

  const mapsUrl = `https://www.google.com/maps?q=${e.coordenadas.lat},${e.coordenadas.lng}`;

  contenido.innerHTML = `
    <button id="cerrar-modal" class="modal-cerrar" aria-label="Cerrar">✕</button>
    <div class="modal-estadio">
      <img class="modal-estadio__imagen" src="${e.imagen}" alt="${e.nombre}"
        onerror="this.style.display='none'" />
      <div class="modal-estadio__header">
        <h2 id="modal-titulo" class="modal-equipo__nombre">${e.nombre}</h2>
        <p class="modal-equipo__meta">${e.ciudad} · ${e.pais}</p>
      </div>
      <p class="modal-equipo__resumen">${e.descripcion}</p>
      <div class="modal-equipo__stats">
        <div class="modal-stat">
          <span class="modal-stat__valor">${e.capacidad.toLocaleString('es-AR')}</span>
          <span class="modal-stat__label">Capacidad</span>
        </div>
        <div class="modal-stat">
          <span class="modal-stat__valor">${e.inaugurado}</span>
          <span class="modal-stat__label">Inaugurado</span>
        </div>
        <div class="modal-stat">
          <span class="modal-stat__valor">${e.superficie}</span>
          <span class="modal-stat__label">Superficie</span>
        </div>
      </div>
      <div class="modal-equipo__seccion">
        <h3 class="modal-equipo__subtitulo">Rol en el torneo</h3>
        <p>${e.partidos}</p>
      </div>
      <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="boton--maps">
        📍 Ver en Google Maps
      </a>
    </div>
  `;

  overlay.removeAttribute('hidden');
  document.getElementById('cerrar-modal')?.focus();

  const cerrar = () => overlay.setAttribute('hidden', '');
  document.getElementById('cerrar-modal').addEventListener('click', cerrar);
  overlay.addEventListener('click', ev => { if (ev.target===overlay) cerrar(); });
  document.addEventListener('keydown', function onEsc(ev) {
    if (ev.key==='Escape') { cerrar(); document.removeEventListener('keydown', onEsc); }
  });
}