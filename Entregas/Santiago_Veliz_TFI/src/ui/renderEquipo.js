/**
 * /src/ui/renderEquipos.js
 * Puebla #grid-equipos con las tarjetas de los 48 equipos,
 * usando el <template id="plantilla-tarjeta-equipo"> del HTML.
 * Incluye filtro por grupo y buscador por nombre.
 */
import { equipos, obtenerListaDeGrupos } from '../data/equipos.js';

let grupoFiltro = '';
let busqueda    = '';

export function renderEquipos() {
  const contenedor = document.getElementById('grid-equipos');
  const template   = document.getElementById('plantilla-tarjeta-equipo');
  if (!contenedor || !template) return;

  contenedor.innerHTML = '';

  // ── Controles de filtro ──────────────────────────────────
  const controles = document.createElement('div');
  controles.className = 'equipos-controles';

  // Buscador
  const input = document.createElement('input');
  input.type        = 'text';
  input.placeholder = 'Buscar equipo…';
  input.value       = busqueda;
  input.className   = 'equipos-busqueda';
  input.setAttribute('aria-label', 'Buscar equipo por nombre');
  input.addEventListener('input', e => {
    busqueda = e.target.value.toLowerCase();
    renderEquipos();
  });

  // Select de grupo
  const select = document.createElement('select');
  select.className = 'fixture-filtro__select';
  select.setAttribute('aria-label', 'Filtrar por grupo');
  select.innerHTML = '<option value="">Todos los grupos</option>';
  obtenerListaDeGrupos().forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = `Grupo ${g}`;
    if (g === grupoFiltro) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', e => {
    grupoFiltro = e.target.value;
    renderEquipos();
  });

  controles.appendChild(input);
  controles.appendChild(select);
  contenedor.appendChild(controles);

  // ── Filtrar equipos ──────────────────────────────────────
  const filtrados = equipos.filter(e => {
    const matchGrupo  = !grupoFiltro || e.grupo === grupoFiltro;
    const matchNombre = !busqueda   || e.nombre.toLowerCase().includes(busqueda)
                                    || e.nombreCorto.toLowerCase().includes(busqueda);
    return matchGrupo && matchNombre;
  });

  if (filtrados.length === 0) {
    const msg = document.createElement('p');
    msg.className   = 'mensaje-vacio';
    msg.textContent = 'No se encontraron equipos con ese filtro.';
    contenedor.appendChild(msg);
    return;
  }

  // ── Grid de tarjetas ─────────────────────────────────────
  const grid = document.createElement('div');
  grid.className = 'grid-equipos__items';

  filtrados.forEach(equipo => {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.tarjeta-equipo__grupo').textContent       = `Grupo ${equipo.grupo}`;
    clone.querySelector('.tarjeta-equipo__nombre').textContent      = equipo.nombre;
    clone.querySelector('.tarjeta-equipo__confederacion').textContent = equipo.confederacion;

    const img = clone.querySelector('.tarjeta-equipo__escudo');
    img.src     = equipo.escudo;
    img.alt     = `Bandera de ${equipo.nombre}`;
    img.loading = 'lazy';

    grid.appendChild(clone);
  });

  contenedor.appendChild(grid);
}