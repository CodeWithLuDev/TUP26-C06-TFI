/**
 * Punto de entrada principal. Versión rediseñada.
 */
import { renderFixture }       from './ui/fixture.js';
import { renderGrupos }        from './ui/grupos.js';
import { initScoreForm }       from './ui/scoreForm.js';
import { renderEstadisticas }  from './ui/renderEstadisticas.js';
import { initBracket }         from './ui/bracket.js';
import { renderEquipos }       from './ui/renderEquipos.js';
import { renderProde }         from './ui/prode.js';
import { initReset }           from './ui/reset.js';
import { initSimulador }       from './ui/simulador.js';
import { renderWikiEstadios }  from './ui/wikiEstadios.js';
import { renderDashboard }     from './ui/dashboard.js';

// ── Navegación SPA principal ──────────────────────────────────
const navLinks  = document.querySelectorAll('.nav-principal__link');
const vistas    = document.querySelectorAll('.vista');
const navToggle = document.querySelector('.nav-toggle');
const nav       = document.querySelector('.nav-principal');
const anuncios  = document.getElementById('anuncios');

function mostrarVista(viewId) {
  vistas.forEach(s => s.classList.remove('vista--activa'));
  navLinks.forEach(l => {
    l.classList.remove('nav-principal__link--activo');
    l.removeAttribute('aria-current');
  });
  const dest = document.querySelector(`.vista[data-view="${viewId}"]`);
  if (dest) { dest.classList.add('vista--activa'); dest.focus({ preventScroll: true }); }
  const link = document.querySelector(`.nav-principal__link[data-view="${viewId}"]`);
  if (link) { link.classList.add('nav-principal__link--activo'); link.setAttribute('aria-current','page'); }
  if (anuncios) anuncios.textContent = `Vista: ${viewId}`;
  cerrarMenuMobile();
}

navLinks.forEach(l => l.addEventListener('click', () => { if (l.dataset.view) mostrarVista(l.dataset.view); }));

// Logo navega al dashboard de inicio
document.querySelector('.logo')?.addEventListener('click', e => {
  e.preventDefault();
  renderDashboard();
  mostrarVista('inicio');
});

// ── Menú mobile ───────────────────────────────────────────────
function abrirMenuMobile()  { nav.classList.add('nav-principal--abierto');    navToggle.setAttribute('aria-expanded','true');  navToggle.querySelector('span').textContent='✕'; }
function cerrarMenuMobile() { nav.classList.remove('nav-principal--abierto'); navToggle.setAttribute('aria-expanded','false'); navToggle.querySelector('span').textContent='☰'; }

navToggle?.addEventListener('click', () => nav.classList.contains('nav-principal--abierto') ? cerrarMenuMobile() : abrirMenuMobile());
document.addEventListener('click', e => { if (nav.classList.contains('nav-principal--abierto') && !nav.contains(e.target) && !navToggle?.contains(e.target)) cerrarMenuMobile(); });
document.addEventListener('keydown', e => { if (e.key==='Escape') cerrarMenuMobile(); });

// ── Pestañas internas ─────────────────────────────────────────
function initPestanasInternas() {
  document.querySelectorAll('.pestanas-internas').forEach(grupo => {
    grupo.querySelectorAll('.pestana-interna').forEach(btn => {
      btn.addEventListener('click', () => {
        const panelId = btn.dataset.pestana;
        const seccion = btn.closest('.vista, section');

        // Desactivar todas las pestañas del grupo
        grupo.querySelectorAll('.pestana-interna').forEach(b => {
          b.classList.remove('pestana-interna--activa');
          b.setAttribute('aria-selected', 'false');
        });

        // Ocultar todos los paneles del mismo contexto
        seccion.querySelectorAll('.panel-pestana').forEach(p => p.classList.remove('panel-pestana--activo'));

        // Activar pestaña y panel seleccionados
        btn.classList.add('pestana-interna--activa');
        btn.setAttribute('aria-selected', 'true');
        const panel = document.getElementById(panelId);
        if (panel) panel.classList.add('panel-pestana--activo');
      });
    });
  });
}

// ── Grupos también en vista eliminatorias ─────────────────────
function renderGruposElim() {
  // Renderizar grupos en el contenedor de la vista eliminatorias
  const contenedorOriginal = document.getElementById('contenedor-tablas-grupos');
  const contenedorElim     = document.getElementById('contenedor-grupos-elim');
  if (!contenedorElim) return;

  // Clonar el contenido ya renderizado de grupos
  if (contenedorOriginal && contenedorOriginal.innerHTML) {
    contenedorElim.innerHTML = contenedorOriginal.innerHTML;
  }
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPestanasInternas();
  renderDashboard();
  renderEquipos();
  renderGrupos();
  renderFixture();
  initScoreForm();
  renderEstadisticas();
  initBracket();
  renderProde();
  initReset();
  initSimulador();
  renderWikiEstadios();

  // Sincronizar grupos en eliminatorias al hacer clic en esa pestaña
  document.querySelector('[data-view="eliminatorias"]')?.addEventListener('click', () => {
    setTimeout(renderGruposElim, 50);
  });
});

// Memoria de pestañas: Guardar la pestaña al hacer click
document.querySelectorAll('.nav-link, .menu-item').forEach(boton => {
  boton.addEventListener('click', function() {
    // Guarda el ID o target de la pestaña a la que entraste
    localStorage.setItem('pestaña_activa', this.getAttribute('data-target') || this.id);
  });
});

// Al recargar la página, volver a abrir esa pestaña
window.addEventListener('DOMContentLoaded', () => {
  const ultimaPestaña = localStorage.getItem('pestaña_activa');
  if (ultimaPestaña) {
    const boton = document.querySelector(`[data-target="${ultimaPestaña}"], #${ultimaPestaña}`);
    if (boton) boton.click();
  }
});

// Guardar la pestaña actual usando el Hash de la URL
window.addEventListener('hashchange', () => {
  localStorage.setItem('ultima_pestana_tfi', window.location.hash);
});

// Al recargar, forzar a ir a la última pestaña guardada
window.addEventListener('DOMContentLoaded', () => {
  const ultima = localStorage.getItem('ultima_pestana_tfi');
  if (ultima && ultima !== window.location.hash) {
    window.location.hash = ultima;
  }
});