/**
 * /src/ui/campeon.js
 * ─────────────────────────────────────────────────────────────
 * Muestra un banner animado con el campeón del mundo cuando
 * se carga el resultado de la Final del bracket.
 * Llamar desde bracket.js tras registrar el resultado de la Final.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Muestra el banner de campeón.
 * @param {{ nombre: string, escudo: string|null }} equipo
 */
export function mostrarBannerCampeon(equipo) {
  // Evitar duplicados
  let banner = document.getElementById('banner-campeon');
  if (banner) banner.remove();

  banner = document.createElement('div');
  banner.id = 'banner-campeon';
  banner.className = 'banner-campeon';
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'assertive');

  banner.innerHTML = `
    <div class="banner-campeon__fondo" aria-hidden="true"></div>
    <div class="banner-campeon__contenido">
      <p class="banner-campeon__etiqueta">🏆 ¡Campeón del Mundo!</p>
      ${equipo.escudo
        ? `<img class="banner-campeon__escudo" src="${equipo.escudo}" alt="Escudo de ${equipo.nombre}" />`
        : '<span class="banner-campeon__placeholder">🏳️</span>'
      }
      <h2 class="banner-campeon__nombre">${equipo.nombre}</h2>
      <p class="banner-campeon__subtitulo">FIFA World Cup 2026™ Simulator</p>
      <button id="cerrar-banner-campeon" class="banner-campeon__cerrar" aria-label="Cerrar banner de campeón">
        Cerrar ✕
      </button>
    </div>
  `;

  document.body.appendChild(banner);

  // Forzar reflow para que la animación CSS se dispare
  requestAnimationFrame(() => banner.classList.add('banner-campeon--visible'));

  document.getElementById('cerrar-banner-campeon')
    .addEventListener('click', ocultarBannerCampeon);
}

export function ocultarBannerCampeon() {
  const banner = document.getElementById('banner-campeon');
  if (!banner) return;
  banner.classList.remove('banner-campeon--visible');
  setTimeout(() => banner.remove(), 400);
}