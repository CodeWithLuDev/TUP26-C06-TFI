/**
 * /src/ui/fixture.js
 * Renderiza partidos con formulario inline al hacer click.
 */
import { partidos } from '../data/partidos.js';
import { equipos }  from '../data/equipos.js';

let grupoActivo  = null;
let estadoActivo = 'todos';

export function renderFixture() {
  const contenedor = document.getElementById('contenedor-fixture');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // ── Filtros ───────────────────────────────────────────────
  const grupos = [...new Set(partidos.map(p => p.grupo))].sort();
  const barra  = document.createElement('div');
  barra.className = 'fixture-filtros';

  const selGrupo = document.createElement('select');
  selGrupo.className = 'fixture-filtro__select';
  selGrupo.innerHTML = '<option value="">Todos los grupos</option>';
  grupos.forEach(g => {
    const o = document.createElement('option');
    o.value = g; o.textContent = `Grupo ${g}`;
    if (g === grupoActivo) o.selected = true;
    selGrupo.appendChild(o);
  });
  selGrupo.addEventListener('change', e => { grupoActivo = e.target.value || null; renderFixture(); });

  const selEstado = document.createElement('select');
  selEstado.className = 'fixture-filtro__select';
  selEstado.innerHTML = `
    <option value="todos"     ${estadoActivo==='todos'?'selected':''}>Todos</option>
    <option value="pendiente" ${estadoActivo==='pendiente'?'selected':''}>Pendientes</option>
    <option value="jugado"    ${estadoActivo==='jugado'?'selected':''}>Jugados</option>
  `;
  selEstado.addEventListener('change', e => { estadoActivo = e.target.value; renderFixture(); });

  barra.appendChild(selGrupo);
  barra.appendChild(selEstado);
  contenedor.appendChild(barra);

  // ── Lista ─────────────────────────────────────────────────
  const lista = document.createElement('div');
  lista.className = 'fixture-lista__items';
  lista.setAttribute('aria-live', 'polite');

  const filtrados = partidos.filter(p => {
    const mG = !grupoActivo || p.grupo === grupoActivo;
    const mE = estadoActivo === 'todos' || p.estado === estadoActivo;
    return mG && mE;
  });

  if (filtrados.length === 0) {
    lista.innerHTML = '<p class="mensaje-vacio">No hay partidos que coincidan con el filtro.</p>';
    contenedor.appendChild(lista);
    return;
  }

  const porGrupo = filtrados.reduce((acc, p) => {
    if (!acc[p.grupo]) acc[p.grupo] = [];
    acc[p.grupo].push(p);
    return acc;
  }, {});

  Object.entries(porGrupo).sort().forEach(([grupo, pts]) => {
    const enc = document.createElement('h3');
    enc.className = 'fixture-grupo__titulo';
    enc.textContent = `Grupo ${grupo}`;
    lista.appendChild(enc);

    pts.forEach(partido => {
      const local     = equipos.find(e => e.id === partido.equipoLocal);
      const visitante = equipos.find(e => e.id === partido.equipoVisitante);
      if (!local || !visitante) return;

      const jugado = partido.estado === 'jugado';

      const card = document.createElement('div');
      card.className = `partido-card ${jugado ? 'partido-card--jugado' : 'partido-card--pendiente'}`;
      card.dataset.partidoId = partido.id;

      card.innerHTML = `
        <div class="partido-card__equipo">
          <img class="partido-card__escudo" src="${local.escudo}" alt="${local.nombre}" loading="lazy" />
          <span>${local.nombre}</span>
        </div>
        <div class="partido-card__marcador ${jugado ? '' : 'partido-card__marcador--pendiente'}">
          ${jugado ? `${partido.golesLocal} – ${partido.golesVisitante}` : 'VS'}
        </div>
        <div class="partido-card__equipo partido-card__equipo--visitante">
          <img class="partido-card__escudo" src="${visitante.escudo}" alt="${visitante.nombre}" loading="lazy" />
          <span>${visitante.nombre}</span>
        </div>
      `;

      // Click en partido pendiente → abrir form inline
      if (!jugado) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => abrirFormInline(partido, local, visitante));
      }

      lista.appendChild(card);
    });
  });

  contenedor.appendChild(lista);
}

// ── Formulario inline ─────────────────────────────────────────
function abrirFormInline(partido, local, visitante) {
  const overlay = document.getElementById('form-inline-overlay');
  const titulo  = document.getElementById('form-inline-titulo');
  const inputId = document.getElementById('select-partido');
  const labelL  = document.getElementById('label-local');
  const labelV  = document.getElementById('label-visitante');
  const form    = document.getElementById('formulario-resultado');

  if (!overlay || !form) return;

  titulo.textContent  = `${local.nombre} vs ${visitante.nombre}`;
  labelL.textContent  = local.nombre;
  labelV.textContent  = visitante.nombre;
  inputId.value       = partido.id;

  form.elements['golesLocal'].value     = '';
  form.elements['golesVisitante'].value = '';
  form.elements['goleadores'].value     = '';
  form.elements['asistidores'].value    = '';

  overlay.removeAttribute('hidden');

  document.getElementById('cerrar-form-inline')?.addEventListener('click', cerrarFormInline, { once: true });
  overlay.addEventListener('click', e => { if (e.target === overlay) cerrarFormInline(); }, { once: true });
}

export function cerrarFormInline() {
  const overlay = document.getElementById('form-inline-overlay');
  if (overlay) overlay.setAttribute('hidden', '');
}