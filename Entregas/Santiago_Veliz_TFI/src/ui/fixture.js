/**
 * /src/ui/fixture.js
 * Renderiza la lista de partidos con filtro por grupo y estado.
 */
import { partidos } from '../data/partidos.js';
import { equipos }  from '../data/equipos.js';

// Grupo activo (null = todos)
let grupoActivo = null;
let estadoActivo = 'todos'; // 'todos' | 'pendiente' | 'jugado'

export function renderFixture() {
  const contenedor = document.getElementById('contenedor-fixture');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  // ── Barra de filtros ────────────────────────────────────
  const grupos = [...new Set(partidos.map(p => p.grupo))].sort();

  const barra = document.createElement('div');
  barra.className = 'fixture-filtros';
  barra.setAttribute('role', 'group');
  barra.setAttribute('aria-label', 'Filtrar partidos');

  // Filtro por grupo
  const selectGrupo = document.createElement('select');
  selectGrupo.className = 'fixture-filtro__select';
  selectGrupo.setAttribute('aria-label', 'Filtrar por grupo');
  selectGrupo.innerHTML = '<option value="">Todos los grupos</option>';
  grupos.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = `Grupo ${g}`;
    if (g === grupoActivo) opt.selected = true;
    selectGrupo.appendChild(opt);
  });
  selectGrupo.addEventListener('change', e => {
    grupoActivo = e.target.value || null;
    renderFixture();
  });

  // Filtro por estado
  const selectEstado = document.createElement('select');
  selectEstado.className = 'fixture-filtro__select';
  selectEstado.setAttribute('aria-label', 'Filtrar por estado');
  selectEstado.innerHTML = `
    <option value="todos"     ${estadoActivo === 'todos'     ? 'selected' : ''}>Todos</option>
    <option value="pendiente" ${estadoActivo === 'pendiente' ? 'selected' : ''}>Pendientes</option>
    <option value="jugado"    ${estadoActivo === 'jugado'    ? 'selected' : ''}>Jugados</option>
  `;
  selectEstado.addEventListener('change', e => {
    estadoActivo = e.target.value;
    renderFixture();
  });

  barra.appendChild(selectGrupo);
  barra.appendChild(selectEstado);
  contenedor.appendChild(barra);

  // ── Lista de partidos ────────────────────────────────────
  const lista = document.createElement('div');
  lista.className = 'fixture-lista__items';
  lista.setAttribute('aria-live', 'polite');

  const filtrados = partidos.filter(p => {
    const matchGrupo  = !grupoActivo || p.grupo === grupoActivo;
    const matchEstado = estadoActivo === 'todos' || p.estado === estadoActivo;
    return matchGrupo && matchEstado;
  });

  if (filtrados.length === 0) {
    lista.innerHTML = '<p class="mensaje-vacio">No hay partidos que coincidan con el filtro.</p>';
    contenedor.appendChild(lista);
    return;
  }

  // Agrupar por grupo para mostrar encabezados
  const porGrupo = filtrados.reduce((acc, p) => {
    if (!acc[p.grupo]) acc[p.grupo] = [];
    acc[p.grupo].push(p);
    return acc;
  }, {});

  Object.entries(porGrupo).sort().forEach(([grupo, partidos]) => {
    const encabezado = document.createElement('h3');
    encabezado.className = 'fixture-grupo__titulo';
    encabezado.textContent = `Grupo ${grupo}`;
    lista.appendChild(encabezado);

    partidos.forEach(partido => {
      const local     = equipos.find(e => e.id === partido.equipoLocal);
      const visitante = equipos.find(e => e.id === partido.equipoVisitante);
      if (!local || !visitante) return;

      const jugado = partido.estado === 'jugado';
      const card = document.createElement('div');
      card.className = `partido-card ${jugado ? 'partido-card--jugado' : 'partido-card--pendiente'}`;

      card.innerHTML = `
        <div class="partido-card__equipo">
          <img class="partido-card__escudo" src="${local.escudo}" alt="${local.nombre}" loading="lazy" />
          <span class="local-nombre">${local.nombre}</span>
        </div>
        <div class="partido-card__marcador ${jugado ? '' : 'partido-card__marcador--pendiente'}">
          <span class="resultado-marcador">
            ${jugado ? `${partido.golesLocal} – ${partido.golesVisitante}` : 'VS'}
          </span>
        </div>
        <div class="partido-card__equipo partido-card__equipo--visitante">
          <img class="partido-card__escudo" src="${visitante.escudo}" alt="${visitante.nombre}" loading="lazy" />
          <span class="visitante-nombre">${visitante.nombre}</span>
        </div>
      `;

      lista.appendChild(card);
    });
  });

  contenedor.appendChild(lista);
}