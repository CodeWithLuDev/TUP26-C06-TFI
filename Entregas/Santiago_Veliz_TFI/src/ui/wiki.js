/**
 * ─────────────────────────────────────────────────────────────
 * Renderiza las fichas de equipos en #contenedor-wiki-equipos
 * y gestiona el modal de detalle al hacer clic en una tarjeta.
 * Contenedor: #contenedor-wiki-equipos (.wiki-grid)
 * Modal:      #modal-overlay / #modal-contenido
 * ─────────────────────────────────────────────────────────────
 */

import { equipos } from '../data/equipos.js';

// ── Render de la grilla ───────────────────────────────────────

export function renderWiki() {
  const contenedor = document.getElementById('contenedor-wiki-equipos');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // Ordenar por grupo y luego por nombre
  const ordenados = [...equipos].sort((a, b) =>
    a.grupo.localeCompare(b.grupo) || a.nombre.localeCompare(b.nombre)
  );

  ordenados.forEach(equipo => {
    const card = crearCardWiki(equipo);
    contenedor.appendChild(card);
  });
}

// ── Crear tarjeta ─────────────────────────────────────────────

function crearCardWiki(equipo) {
  const { wiki = {} } = equipo;
  const titulos = wiki.aniosCampeon?.length
    ? wiki.aniosCampeon.join(', ')
    : '—';

  const article = document.createElement('article');
  article.className = 'wiki-card';
  article.setAttribute('role', 'button');
  article.setAttribute('tabindex', '0');
  article.setAttribute('aria-label', `Ver ficha de ${equipo.nombre}`);

  article.innerHTML = `
    <div class="wiki-card__encabezado">
      <img
        class="wiki-card__escudo"
        src="${equipo.escudo}"
        alt="Bandera de ${equipo.nombre}"
        loading="lazy"
      />
      <span class="wiki-card__grupo">Grupo ${equipo.grupo}</span>
    </div>
    <div class="wiki-card__cuerpo">
      <h3 class="wiki-card__titulo">${equipo.nombre}</h3>
      <p class="wiki-card__confederacion">${equipo.confederacion}</p>
      <div class="wiki-card__datos">
        <span class="wiki-dato">
          <span class="wiki-dato__icono">🏆</span>
          <span class="wiki-dato__valor">${wiki.mundialesGanados ?? 0}</span>
          <span class="wiki-dato__label">mundiales</span>
        </span>
        <span class="wiki-dato">
          <span class="wiki-dato__icono">📅</span>
          <span class="wiki-dato__valor">${titulos}</span>
          <span class="wiki-dato__label">años</span>
        </span>
      </div>
      <p class="wiki-card__dt">
        <strong>DT:</strong> ${wiki.directorTecnico?.nombre ?? '—'}
      </p>
    </div>
  `;

  // Abrir modal al click o Enter/Space
  const abrirModal = () => mostrarModalEquipo(equipo);
  article.addEventListener('click', abrirModal);
  article.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirModal(); }
  });

  return article;
}

// ── Modal de detalle ──────────────────────────────────────────

function mostrarModalEquipo(equipo) {
  const overlay   = document.getElementById('modal-overlay');
  const contenido = document.getElementById('modal-contenido');
  if (!overlay || !contenido) return;

  const { wiki = {} } = equipo;
  const jugadores = wiki.jugadoresDestacados ?? [];

  contenido.innerHTML = `
    <button
      id="cerrar-modal"
      class="modal-cerrar"
      aria-label="Cerrar ficha de ${equipo.nombre}"
    >✕</button>

    <div class="modal-equipo">
      <div class="modal-equipo__header">
        <img
          class="modal-equipo__escudo"
          src="${equipo.escudo}"
          alt="Bandera de ${equipo.nombre}"
        />
        <div>
          <h2 id="modal-titulo" class="modal-equipo__nombre">${equipo.nombre}</h2>
          <p class="modal-equipo__meta">${equipo.confederacion} · Grupo ${equipo.grupo} · FIFA #${equipo.rankingFifa}</p>
        </div>
      </div>

      <p class="modal-equipo__resumen">${wiki.resumenHistorico ?? 'Sin información disponible.'}</p>

      <div class="modal-equipo__stats">
        <div class="modal-stat">
          <span class="modal-stat__valor">${wiki.mundialesGanados ?? 0}</span>
          <span class="modal-stat__label">Mundiales ganados</span>
        </div>
        <div class="modal-stat">
          <span class="modal-stat__valor">${wiki.aniosCampeon?.join(', ') || '—'}</span>
          <span class="modal-stat__label">Años campeón</span>
        </div>
        <div class="modal-stat">
          <span class="modal-stat__valor">${wiki.mejorResultado ?? '—'}</span>
          <span class="modal-stat__label">Mejor resultado</span>
        </div>
      </div>

      <div class="modal-equipo__seccion">
        <h3 class="modal-equipo__subtitulo">Director técnico</h3>
        <p>${wiki.directorTecnico?.nombre ?? '—'}
          <span class="modal-equipo__meta">(${wiki.directorTecnico?.nacionalidad ?? '—'})</span>
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
    </div>
  `;

  overlay.removeAttribute('hidden');
  document.getElementById('cerrar-modal')?.focus();

  // Cerrar al click en overlay o botón, y con Escape
  const cerrar = () => overlay.setAttribute('hidden', '');
  document.getElementById('cerrar-modal').addEventListener('click', cerrar);
  overlay.addEventListener('click', e => { if (e.target === overlay) cerrar(); });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') { cerrar(); document.removeEventListener('keydown', onEsc); }
  });
}