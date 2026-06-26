/**
 * main.js — Punto de entrada y ensamblado general de la aplicación
 */

document.addEventListener('DOMContentLoaded', () => {
  inicializarStorage();
  Toast.init();

  Nav.init({
    equipos:      renderizarPaginaEquipos,
    grupos:       renderizarPaginaGrupos,
    fixture:      renderizarPaginaFixture,
    playoffs:     renderizarPaginaBracket,
    estadisticas: renderizarPaginaEstadisticas,
  });

  configurarEventListeners();

  setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    Nav.irA('equipos');
  }, 700);
});

function configurarEventListeners() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const p = link.dataset.page;
      if (p) Nav.irA(p);
    });
  });

  document.getElementById('btn-reset-data')?.addEventListener('click', () => {
    if (confirm('⚠️ ¿Borrar TODOS los resultados, estadísticas y el bracket? Esta acción es irreversible.')) {
      resetearTodoLosDatos();
      // Recargar para volver a la pantalla de bienvenida
      window.location.reload();
    }
  });

  // Modal partido grupos
  document.getElementById('modal-partido-close')?.addEventListener('click', () => Modal.close('modal-partido'));
  document.getElementById('btn-cerrar-modal-partido')?.addEventListener('click', () => Modal.close('modal-partido'));
  document.getElementById('btn-guardar-resultado')?.addEventListener('click', intentarGuardarResultado);
  document.getElementById('btn-borrar-resultado')?.addEventListener('click', borrarResultadoActivo);

  // Modal confirmación
  document.getElementById('modal-confirm-cancel')?.addEventListener('click', () => Modal.close('modal-confirm'));
  document.getElementById('btn-confirm-cancel')?.addEventListener('click', () => Modal.close('modal-confirm'));

  // Modal playoff
  document.getElementById('modal-playoff-close')?.addEventListener('click', () => Modal.close('modal-playoff'));
  document.getElementById('btn-cerrar-modal-playoff')?.addEventListener('click', () => Modal.close('modal-playoff'));
  document.getElementById('btn-guardar-playoff')?.addEventListener('click', guardarResultadoPlayoff);
  document.getElementById('btn-borrar-playoff')?.addEventListener('click', borrarResultadoPlayoffActivo);
}

/* ── Página Equipos ── */
let _filtroEquipos = 'todos';

function renderizarPaginaEquipos() {
  const resultados = getTodosLosResultados();
  const bracket    = getPlayoffs();
  const stats      = calcularEstadisticasTorneo(resultados, bracket);

  renderizar('equipos-summary', `
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-card-icon icon-primary">🌍</div>
        <div><div class="summary-card-value">${EQUIPOS.length}</div><div class="summary-card-label">Equipos</div></div>
      </div>
      <div class="summary-card">
        <div class="summary-card-icon icon-accent">⚽</div>
        <div><div class="summary-card-value">${stats.partidosJugados}</div><div class="summary-card-label">Partidos jugados</div></div>
      </div>
      <div class="summary-card">
        <div class="summary-card-icon icon-success">🥅</div>
        <div><div class="summary-card-value">${stats.golesTotal}</div><div class="summary-card-label">Goles totales</div></div>
      </div>
      <div class="summary-card">
        <div class="summary-card-icon icon-warning">📊</div>
        <div><div class="summary-card-value">${stats.gruposCompletos}/8</div><div class="summary-card-label">Grupos completos</div></div>
      </div>
    </div>
  `);

  renderizarFiltroEquipos(_filtroEquipos);
  renderizarEquiposFiltrados(_filtroEquipos, resultados);
}

function renderizarFiltroEquipos(activo) {
  const grupos = getGrupos();
  renderizar('equipos-filtro', `
    <div class="filter-bar">
      <span class="filter-label">Grupo:</span>
      <button class="filter-btn ${activo==='todos'?'active':''}" onclick="filtrarEquipos('todos')">Todos</button>
      ${grupos.map(g => `<button class="filter-btn ${activo===g?'active':''}" onclick="filtrarEquipos('${g}')">Grupo ${g}</button>`).join('')}
    </div>
  `);
}

function filtrarEquipos(filtro) {
  _filtroEquipos = filtro;
  renderizarFiltroEquipos(filtro);
  renderizarEquiposFiltrados(filtro, getTodosLosResultados());
}

function renderizarEquiposFiltrados(filtro, resultados) {
  const equipos = filtro === 'todos' ? EQUIPOS : EQUIPOS.filter(e => e.grupo === filtro);
  renderizar('equipos-grid', `
    <div class="teams-grid">
      ${equipos.map(eq => renderizarTarjetaEquipo(eq, resultados)).join('')}
    </div>
  `);
}

function renderizarTarjetaEquipo(equipo, resultados) {
  const partidos = getPartidosPorGrupo(equipo.grupo);
  const tabla    = calcularTablaGrupo(equipo.grupo, partidos, resultados);
  const posicion = tabla.findIndex(f => f.equipo.id === equipo.id) + 1;
  const completo = grupoCompleto(equipo.grupo, partidos, resultados);
  const stats    = tabla.find(f => f.equipo.id === equipo.id);

  let posLabel = '';
  if (completo && posicion > 0) {
    if (posicion === 1)      posLabel = '<span class="badge badge-success" style="margin-top:4px">1° ✓</span>';
    else if (posicion === 2) posLabel = '<span class="badge badge-accent"  style="margin-top:4px">2° ✓</span>';
    else                     posLabel = '<span class="badge badge-neutral" style="margin-top:4px">Eliminado</span>';
  }

  return `
    <div class="team-card" onclick="Nav.irA('grupos')" title="Ver Grupo ${equipo.grupo}">
      <div class="team-flag">${equipo.bandera}</div>
      <div class="team-name">${escapeHtml(equipo.nombre)}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:var(--space-2);margin-top:var(--space-2)">
        <span class="team-group-badge">${equipo.grupo}</span>
        ${stats ? `<span style="font-size:var(--text-xs);color:var(--color-text-muted)">${stats.pts} pts</span>` : ''}
      </div>
      ${posLabel}
    </div>`;
}

/* ── Página Estadísticas ── */
function renderizarPaginaEstadisticas() {
  const resultados   = getTodosLosResultados();
  const bracket      = getPlayoffs();
  const stats        = calcularEstadisticasTorneo(resultados, bracket);
  const goleadores   = getRankingGoleadores(getTodosGoleadores());
  const asistidores  = getRankingAsistidores(getTodosAsistidores());
  const equipoGoles  = getRankingGolesPorEquipo(resultados);

  renderizar('stats-summary', `
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-card-icon icon-primary">⚽</div>
        <div><div class="summary-card-value">${stats.golesTotal}</div><div class="summary-card-label">Goles totales</div></div>
      </div>
      <div class="summary-card">
        <div class="summary-card-icon icon-accent">📊</div>
        <div><div class="summary-card-value">${stats.promedioGoles}</div><div class="summary-card-label">Promedio x partido</div></div>
      </div>
      <div class="summary-card">
        <div class="summary-card-icon icon-success">🏟️</div>
        <div><div class="summary-card-value">${stats.partidosJugados}</div><div class="summary-card-label">Partidos jugados</div></div>
      </div>
      <div class="summary-card">
        <div class="summary-card-icon icon-warning">🥇</div>
        <div><div class="summary-card-value">${goleadores[0]?.goles||0}</div>
        <div class="summary-card-label">${goleadores[0]?escapeHtml(goleadores[0].jugador):'Líder goleador'}</div></div>
      </div>
    </div>
  `);

  renderizarRankingGoleadores(goleadores);
  renderizarRankingAsistidores(asistidores);
  renderizarRankingEquipos(equipoGoles);
}

function _rankingItem(item, i, valor) {
  return `
    <div class="stat-rank-item">
      <div class="stat-rank-pos ${claseRanking(i+1)}">${i<3?iconoPosicion(i+1):i+1}</div>
      <span class="stat-rank-flag">${item.equipoData?.bandera||'🏳️'}</span>
      <div class="stat-rank-info">
        <div class="stat-rank-name">${escapeHtml(item.jugador)}</div>
        <div class="stat-rank-team">${escapeHtml(item.equipoData?.nombre||item.equipo)}</div>
      </div>
      <div class="stat-rank-value">${valor}</div>
    </div>`;
}

function _emptyState(icon, title, desc) {
  return `<div class="empty-state" style="padding:var(--space-8)">
    <div class="empty-state-icon">${icon}</div>
    <div class="empty-state-title">${title}</div>
    <div class="empty-state-desc">${desc}</div>
  </div>`;
}

function renderizarRankingGoleadores(ranking) {
  renderizar('stats-goleadores', `
    <div class="stat-card">
      <div class="stat-card-header"><span class="stat-card-icon">⚽</span><span class="stat-card-title">Top Goleadores</span></div>
      ${ranking.length===0
        ? _emptyState('⚽','Sin goleadores','Ingresá resultados con goleadores para ver el ranking.')
        : ranking.slice(0,10).map((g,i) => _rankingItem(g,i,g.goles)).join('')
      }
    </div>`);
}

function renderizarRankingAsistidores(ranking) {
  renderizar('stats-asistidores', `
    <div class="stat-card">
      <div class="stat-card-header"><span class="stat-card-icon">🎯</span><span class="stat-card-title">Top Asistidores</span></div>
      ${ranking.length===0
        ? _emptyState('🎯','Sin asistidores','Ingresá asistencias al cargar resultados.')
        : ranking.slice(0,10).map((a,i) => _rankingItem(a,i,a.asistencias)).join('')
      }
    </div>`);
}

function renderizarRankingEquipos(ranking) {
  renderizar('stats-equipos', `
    <div class="stat-card" style="grid-column:1/-1">
      <div class="stat-card-header"><span class="stat-card-icon">🏳️</span><span class="stat-card-title">Goles por Equipo</span></div>
      ${ranking.length===0
        ? _emptyState('📊','Sin datos','Cargá resultados para ver estadísticas por equipo.')
        : `<div style="padding:var(--space-4);display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:var(--space-2)">
            ${ranking.slice(0,16).map(e => `
              <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-2) var(--space-3);border-radius:var(--radius-md);background:var(--color-surface-alt)">
                <span style="font-size:1.25rem">${e.equipo.bandera}</span>
                <span style="flex:1;font-size:var(--text-sm);font-weight:var(--weight-medium)">${escapeHtml(e.equipo.nombre)}</span>
                <span style="font-weight:var(--weight-bold);color:var(--color-primary)">${e.goles} ⚽</span>
              </div>`).join('')}
          </div>`
      }
    </div>`);
}


/* ============================================================
   PANTALLA DE BIENVENIDA
   ============================================================ */

/**
 * Lee el nombre guardado en localStorage.
 * Si ya existe, saltea la pantalla de bienvenida directamente.
 */
function iniciarBienvenida() {
  const nombreGuardado = localStorage.getItem('mundial_usuario');

  if (nombreGuardado) {
    // Ya ingresó antes: ocultar welcome y mostrar app directamente
    document.getElementById('welcome-screen').style.display = 'none';
    mostrarNombreEnNavbar(nombreGuardado);
    return;
  }

  // Primera vez: mostrar pantalla de bienvenida
  // Permitir ingresar con Enter
  const input = document.getElementById('welcome-name-input');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') ingresarAlFixture();
    });
    // Foco automático
    setTimeout(() => input.focus(), 400);
  }
}

/**
 * Valida el nombre, guarda en localStorage y entra a la app.
 * Llamada desde el botón "Ingresar" y desde el evento Enter.
 */
function ingresarAlFixture() {
  const input     = document.getElementById('welcome-name-input');
  const errorMsg  = document.getElementById('welcome-error');
  const nombre    = input ? input.value.trim() : '';

  // Validación
  if (!nombre) {
    input.classList.add('input-error');
    errorMsg.classList.add('visible');
    input.focus();
    // Quitar el estado de error al escribir
    input.addEventListener('input', () => {
      input.classList.remove('input-error');
      errorMsg.classList.remove('visible');
    }, { once: true });
    return;
  }

  // Guardar nombre
  localStorage.setItem('mundial_usuario', nombre);

  // Animación de salida
  const welcomeScreen = document.getElementById('welcome-screen');
  welcomeScreen.classList.add('leaving');

  // Mostrar nombre en navbar
  mostrarNombreEnNavbar(nombre);

  // Esperar que termine la animación y remover
  setTimeout(() => {
    welcomeScreen.style.display = 'none';
  }, 500);
}

/**
 * Muestra el avatar e inicial del usuario en la navbar.
 * @param {string} nombre
 */
function mostrarNombreEnNavbar(nombre) {
  const navUser   = document.getElementById('navbar-user');
  const avatar    = document.getElementById('navbar-user-avatar');
  const nameLabel = document.getElementById('navbar-user-name');

  if (!navUser) return;

  const inicial = nombre.charAt(0).toUpperCase();
  avatar.textContent    = inicial;
  nameLabel.textContent = nombre;
  navUser.style.display = 'flex';
}

function cerrarSesion() {
  if (!confirm('¿Querés cerrar sesión? Los resultados no se borrarán.')) return;
  localStorage.removeItem('mundial_usuario');
  window.location.reload();
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
  iniciarBienvenida();
});