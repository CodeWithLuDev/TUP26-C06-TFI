/**
 * Punto de entrada principal de la aplicación.
 * Orquesta el renderizado inicial y el manejo de eventos globales.
 */
import { renderFixture } from './ui/fixture.js';
import { renderGrupos } from './ui/grupos.js';
import { initScoreForm } from './ui/scoreForm.js';
import { renderEstadisticas } from './ui/renderEstadisticas.js';

// ── Navegación SPA ────────────────────────────────────────────
const navLinks  = document.querySelectorAll('.nav-principal__link');
const vistas    = document.querySelectorAll('.vista');
const navToggle = document.querySelector('.nav-toggle');
const nav       = document.querySelector('.nav-principal');
const anuncios  = document.getElementById('anuncios');

/**
 * Muestra la vista cuyo data-view coincide con `viewId`
 * y actualiza el estado activo del botón de nav correspondiente.
 * @param {string} viewId
 */
function mostrarVista(viewId) {
  // Ocultar todas las vistas
  vistas.forEach(seccion => seccion.classList.remove('vista--activa'));

  // Quitar estado activo de todos los links
  navLinks.forEach(link => {
    link.classList.remove('nav-principal__link--activo');
    link.removeAttribute('aria-current');
  });

  // Activar la vista objetivo
  const vistaDestino = document.querySelector(`.vista[data-view="${viewId}"]`);
  if (vistaDestino) {
    vistaDestino.classList.add('vista--activa');
    vistaDestino.focus({ preventScroll: true });
  }

  // Activar el link correspondiente
  const linkActivo = document.querySelector(`.nav-principal__link[data-view="${viewId}"]`);
  if (linkActivo) {
    linkActivo.classList.add('nav-principal__link--activo');
    linkActivo.setAttribute('aria-current', 'page');
  }

  // Anunciar cambio de vista para lectores de pantalla
  if (anuncios) {
    anuncios.textContent = `Vista activa: ${viewId}`;
  }

  // Cerrar menú mobile si estuviese abierto
  cerrarMenuMobile();
}

// ── Delegar click en todos los botones de nav ─────────────────
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const viewId = link.dataset.view;
    if (viewId) mostrarVista(viewId);
  });
});

// ── Menú hamburguesa (mobile) ─────────────────────────────────
function abrirMenuMobile() {
  nav.classList.add('nav-principal--abierto');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.querySelector('span').textContent = '✕';
}

function cerrarMenuMobile() {
  nav.classList.remove('nav-principal--abierto');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.querySelector('span').textContent = '☰';
}

navToggle?.addEventListener('click', () => {
  const estaAbierto = nav.classList.contains('nav-principal--abierto');
  estaAbierto ? cerrarMenuMobile() : abrirMenuMobile();
});

// Cerrar menú mobile al hacer click fuera
document.addEventListener('click', (e) => {
  if (
    nav.classList.contains('nav-principal--abierto') &&
    !nav.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    cerrarMenuMobile();
  }
});

// Soporte de teclado: Escape cierra el menú mobile
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarMenuMobile();
});

// ── Inicialización ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderFixture();
  renderGrupos();
  initScoreForm();
  renderEstadisticas();
});