/**
 * fixture.js — Renderizado e interacción del fixture de partidos
 * Gestiona la carga de resultados, goleadores y asistidores
 */

let _partidoActivo    = null; // Partido seleccionado actualmente
let _goleadoresTemp   = [];   // Goleadores del partido en edición
let _asistidoresTemp  = [];   // Asistidores del partido en edición
let _modoFiltro       = 'todos'; // 'todos' | 'A'..'H' | 'pendientes' | 'jugados'

/** ── Renderizado principal ── */
function renderizarPaginaFixture() {
  const resultados = getTodosLosResultados();
  renderizarFiltros();
  renderizarListaPartidos(resultados);
}

/** Renderiza los botones de filtro */
function renderizarFiltros() {
  const grupos = getGrupos();
  const html = `
    <div class="filter-bar" id="fixture-filtros">
      <span class="filter-label">Filtrar:</span>
      <button class="filter-btn ${_modoFiltro === 'todos' ? 'active' : ''}"
        onclick="cambiarFiltroFixture('todos', this)">Todos</button>
      <button class="filter-btn ${_modoFiltro === 'pendientes' ? 'active' : ''}"
        onclick="cambiarFiltroFixture('pendientes', this)">⏳ Pendientes</button>
      <button class="filter-btn ${_modoFiltro === 'jugados' ? 'active' : ''}"
        onclick="cambiarFiltroFixture('jugados', this)">✅ Jugados</button>
      ${grupos.map(g => `
        <button class="filter-btn ${_modoFiltro === g ? 'active' : ''}"
          onclick="cambiarFiltroFixture('${g}', this)">Grupo ${g}</button>
      `).join('')}
    </div>
  `;
  renderizar('fixture-filtros-container', html);
}

function cambiarFiltroFixture(filtro, btn) {
  _modoFiltro = filtro;
  renderizarFiltros();
  renderizarListaPartidos(getTodosLosResultados());
}

/** Renderiza la lista de partidos agrupada por fecha */
function renderizarListaPartidos(resultados) {
  let partidos = [...PARTIDOS_GRUPOS];

  // Aplicar filtro
  if (_modoFiltro !== 'todos' && _modoFiltro !== 'pendientes' && _modoFiltro !== 'jugados') {
    partidos = partidos.filter(p => p.grupo === _modoFiltro);
  } else if (_modoFiltro === 'pendientes') {
    partidos = partidos.filter(p => !resultados[p.id]?.jugado);
  } else if (_modoFiltro === 'jugados') {
    partidos = partidos.filter(p => resultados[p.id]?.jugado);
  }

  if (partidos.length === 0) {
    renderizar('fixture-lista', `
      <div class="empty-state">
        <div class="empty-state-icon">⚽</div>
        <div class="empty-state-title">Sin partidos</div>
        <div class="empty-state-desc">No hay partidos que coincidan con el filtro seleccionado.</div>
      </div>
    `);
    return;
  }

  // Agrupar por fecha
  const porFecha = {};
  partidos.forEach(p => {
    if (!porFecha[p.fecha]) porFecha[p.fecha] = [];
    porFecha[p.fecha].push(p);
  });

  const html = Object.entries(porFecha)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, pts]) => renderizarSeccionFecha(fecha, pts, resultados))
    .join('');

  renderizar('fixture-lista', html);
}

/** Renderiza una sección de fecha con sus partidos */
function renderizarSeccionFecha(fecha, partidos, resultados) {
  const fechaFormateada = formatearFecha(fecha);
  const jugados = partidos.filter(p => resultados[p.id]?.jugado).length;

  return `
    <div class="fixture-section">
      <div class="fixture-section-header">
        <span class="fixture-date-label">📅 ${fechaFormateada}</span>
        <span class="fixture-round-label">${jugados}/${partidos.length} jugados</span>
      </div>
      <div class="match-cards-list">
        ${partidos.map(p => renderizarTarjetaPartido(p, resultados)).join('')}
      </div>
    </div>
  `;
}

/** Renderiza la tarjeta de un partido */
function renderizarTarjetaPartido(partido, resultados) {
  const resultado  = resultados[partido.id];
  const equipoL    = getEquipoPorId(partido.local);
  const equipoV    = getEquipoPorId(partido.visitante);
  const jugado     = resultado?.jugado || false;

  const claseCard  = jugado ? 'match-card played' : 'match-card';
  const scoreCentro = jugado
    ? `<div class="match-score-display">
        <span style="font-size:var(--text-2xl);font-weight:var(--weight-black);color:var(--color-text)">${resultado.golesLocal}</span>
        <span class="score-sep">-</span>
        <span style="font-size:var(--text-2xl);font-weight:var(--weight-black);color:var(--color-text)">${resultado.golesVisitante}</span>
       </div>`
    : `<div class="match-vs">VS</div>`;

  return `
    <div class="${claseCard}" onclick="abrirModalPartido('${partido.id}')">
      <!-- Equipo Local -->
      <div class="match-team">
        <span class="match-team-flag">${equipoL?.bandera || '🏳️'}</span>
        <div class="match-team-info">
          <div class="match-team-name">${escapeHtml(equipoL?.nombre || partido.local)}</div>
        </div>
      </div>

      <!-- Centro -->
      <div class="match-center">
        <div class="match-time">⏰ ${partido.hora}</div>
        ${scoreCentro}
        <span class="badge badge-neutral match-group-badge">Grupo ${partido.grupo}</span>
        ${badgeEstadoPartido(resultado)}
      </div>

      <!-- Equipo Visitante -->
      <div class="match-team away">
        <span class="match-team-flag">${equipoV?.bandera || '🏳️'}</span>
        <div class="match-team-info">
          <div class="match-team-name">${escapeHtml(equipoV?.nombre || partido.visitante)}</div>
        </div>
      </div>
    </div>
  `;
}

/** ── Modal de carga de resultado ── */
function abrirModalPartido(partidoId) {
  const partido    = getPartidoPorId(partidoId);
  if (!partido) return;

  const resultado  = getResultado(partidoId);
  const equipoL    = getEquipoPorId(partido.local);
  const equipoV    = getEquipoPorId(partido.visitante);
  const jugado     = resultado?.jugado || false;

  _partidoActivo   = partido;
  _goleadoresTemp  = getTodosGoleadores()[partidoId]  || [{ jugador: '', equipo: partido.local, goles: 1 }];
  _asistidoresTemp = getTodosAsistidores()[partidoId] || [{ jugador: '', equipo: partido.local, asistencias: 1 }];

  // Construir modal
  const contenidoModal = `
    <div class="match-detail-header">
      <div class="match-meta" style="margin-bottom:var(--space-3)">
        <span class="match-meta-item">📅 ${formatearFecha(partido.fecha)}</span>
        <span class="match-meta-item">⏰ ${partido.hora} (${ZONA_HORARIA})</span>
        <span class="match-meta-item">🏟️ ${partido.estadio}</span>
        <span class="badge badge-primary">Grupo ${partido.grupo}</span>
      </div>

      <div class="match-detail-teams">
        <div class="match-detail-team">
          <div class="match-detail-flag">${equipoL?.bandera || '🏳️'}</div>
          <div class="match-detail-name">${escapeHtml(equipoL?.nombre || partido.local)}</div>
        </div>
        <div class="match-detail-vs">VS</div>
        <div class="match-detail-team">
          <div class="match-detail-flag">${equipoV?.bandera || '🏳️'}</div>
          <div class="match-detail-name">${escapeHtml(equipoV?.nombre || partido.visitante)}</div>
        </div>
      </div>
    </div>

    ${jugado ? renderizarAlertaJugado(resultado) : ''}

    <!-- Inputs de goles -->
    <div class="score-inputs">
      <div class="score-team-box">
        <div class="score-team-flag">${equipoL?.bandera || '🏳️'}</div>
        <div class="score-team-name">${escapeHtml(equipoL?.nombre || '')}</div>
        <input
          type="number"
          id="goles-local"
          class="score-input"
          min="0" max="99"
          value="${resultado?.golesLocal ?? ''}"
          placeholder="0"
        />
      </div>
      <div class="score-vs-center">
        <span>−</span>
      </div>
      <div class="score-team-box">
        <div class="score-team-flag">${equipoV?.bandera || '🏳️'}</div>
        <div class="score-team-name">${escapeHtml(equipoV?.nombre || '')}</div>
        <input
          type="number"
          id="goles-visitante"
          class="score-input"
          min="0" max="99"
          value="${resultado?.golesVisitante ?? ''}"
          placeholder="0"
        />
      </div>
    </div>

    <!-- Sección de goleadores y asistidores -->
    <div class="scorer-inputs">
      <div class="scorer-inputs-title">⚽ Goleadores del partido</div>
      <div id="goleadores-list">
        ${renderizarEntradasGoleadores(partido)}
      </div>
      <button class="btn btn-ghost btn-sm mt-4" onclick="agregarEntradaGoleador()">
        + Agregar goleador
      </button>
    </div>

    <div class="scorer-inputs" style="margin-top:var(--space-4)">
      <div class="scorer-inputs-title">🎯 Asistidores del partido</div>
      <div id="asistidores-list">
        ${renderizarEntradasAsistidores(partido)}
      </div>
      <button class="btn btn-ghost btn-sm mt-4" onclick="agregarEntradaAsistidor()">
        + Agregar asistidor
      </button>
    </div>
  `;

  document.getElementById('modal-partido-body').innerHTML = contenidoModal;
  document.getElementById('modal-partido-title').textContent =
    `${equipoL?.nombre} vs ${equipoV?.nombre}`;

  // Botón de guardar
  const btnGuardar = document.getElementById('btn-guardar-resultado');
  btnGuardar.textContent = jugado ? '✏️ Actualizar resultado' : '✅ Guardar resultado';

  // Botón de borrar
  const btnBorrar = document.getElementById('btn-borrar-resultado');
  btnBorrar.style.display = jugado ? 'flex' : 'none';

  Modal.open('modal-partido');
}

function renderizarAlertaJugado(resultado) {
  return `
    <div class="alert alert-info" style="margin-bottom:var(--space-4)">
      <span class="alert-icon">ℹ️</span>
      <span>Este partido ya tiene resultado guardado (${resultado.golesLocal} - ${resultado.golesVisitante}). Podés actualizarlo o borrarlo.</span>
    </div>
  `;
}

/** Renderiza las entradas de goleadores */
function renderizarEntradasGoleadores(partido) {
  if (_goleadoresTemp.length === 0) {
    _goleadoresTemp = [{ jugador: '', equipo: partido.local, goles: 1 }];
  }

  return _goleadoresTemp.map((g, i) => `
    <div class="scorer-entry" id="gol-entry-${i}">
      <div class="form-group">
        <label class="form-label">Jugador</label>
        <input type="text" class="form-input"
          placeholder="Nombre del goleador"
          value="${escapeHtml(g.jugador || '')}"
          onchange="actualizarGoleador(${i}, 'jugador', this.value)"
        />
      </div>
      <div class="form-group">
        <label class="form-label">Equipo</label>
        <select class="form-select" onchange="actualizarGoleador(${i}, 'equipo', this.value)">
          <option value="${partido.local}"
            ${g.equipo === partido.local ? 'selected' : ''}>
            ${getEquipoPorId(partido.local)?.bandera} ${escapeHtml(getEquipoPorId(partido.local)?.nombre || '')}
          </option>
          <option value="${partido.visitante}"
            ${g.equipo === partido.visitante ? 'selected' : ''}>
            ${getEquipoPorId(partido.visitante)?.bandera} ${escapeHtml(getEquipoPorId(partido.visitante)?.nombre || '')}
          </option>
        </select>
      </div>
      <button class="btn btn-ghost btn-sm btn-icon"
        onclick="quitarGoleador(${i})"
        title="Quitar"
        style="align-self:flex-end;color:var(--color-danger);">✕</button>
    </div>
  `).join('');
}

/** Renderiza las entradas de asistidores */
function renderizarEntradasAsistidores(partido) {
  return _asistidoresTemp.map((a, i) => `
    <div class="scorer-entry" id="asi-entry-${i}">
      <div class="form-group">
        <label class="form-label">Jugador</label>
        <input type="text" class="form-input"
          placeholder="Nombre del asistidor"
          value="${escapeHtml(a.jugador || '')}"
          onchange="actualizarAsistidor(${i}, 'jugador', this.value)"
        />
      </div>
      <div class="form-group">
        <label class="form-label">Equipo</label>
        <select class="form-select" onchange="actualizarAsistidor(${i}, 'equipo', this.value)">
          <option value="${partido.local}"
            ${a.equipo === partido.local ? 'selected' : ''}>
            ${getEquipoPorId(partido.local)?.bandera} ${escapeHtml(getEquipoPorId(partido.local)?.nombre || '')}
          </option>
          <option value="${partido.visitante}"
            ${a.equipo === partido.visitante ? 'selected' : ''}>
            ${getEquipoPorId(partido.visitante)?.bandera} ${escapeHtml(getEquipoPorId(partido.visitante)?.nombre || '')}
          </option>
        </select>
      </div>
      <button class="btn btn-ghost btn-sm btn-icon"
        onclick="quitarAsistidor(${i})"
        title="Quitar"
        style="align-self:flex-end;color:var(--color-danger);">✕</button>
    </div>
  `).join('');
}

/** ── Acciones de goleadores/asistidores ── */
function agregarEntradaGoleador() {
  if (!_partidoActivo) return;
  _goleadoresTemp.push({ jugador: '', equipo: _partidoActivo.local, goles: 1 });
  document.getElementById('goleadores-list').innerHTML = renderizarEntradasGoleadores(_partidoActivo);
}

function quitarGoleador(idx) {
  _goleadoresTemp.splice(idx, 1);
  if (!_partidoActivo) return;
  document.getElementById('goleadores-list').innerHTML = renderizarEntradasGoleadores(_partidoActivo);
}

function actualizarGoleador(idx, campo, valor) {
  if (_goleadoresTemp[idx]) _goleadoresTemp[idx][campo] = valor;
}

function agregarEntradaAsistidor() {
  if (!_partidoActivo) return;
  _asistidoresTemp.push({ jugador: '', equipo: _partidoActivo.local, asistencias: 1 });
  document.getElementById('asistidores-list').innerHTML = renderizarEntradasAsistidores(_partidoActivo);
}

function quitarAsistidor(idx) {
  _asistidoresTemp.splice(idx, 1);
  if (!_partidoActivo) return;
  document.getElementById('asistidores-list').innerHTML = renderizarEntradasAsistidores(_partidoActivo);
}

function actualizarAsistidor(idx, campo, valor) {
  if (_asistidoresTemp[idx]) _asistidoresTemp[idx][campo] = valor;
}

/** ── Guardar resultado ── */
function intentarGuardarResultado() {
  if (!_partidoActivo) return;

  const inputLocal = document.getElementById('goles-local');
  const inputVisit = document.getElementById('goles-visitante');

  const gl = parseInt(inputLocal.value, 10);
  const gv = parseInt(inputVisit.value, 10);

  // Validaciones
  if (isNaN(gl) || isNaN(gv) || gl < 0 || gv < 0) {
    Toast.warning('Resultado inválido', 'Ingresá un número de goles válido para ambos equipos.');
    inputLocal.focus();
    return;
  }

  if (gl > 99 || gv > 99) {
    Toast.warning('Resultado inválido', 'El número de goles no puede superar 99.');
    return;
  }

  // Construir preview para confirmación
  const equipoL = getEquipoPorId(_partidoActivo.local);
  const equipoV = getEquipoPorId(_partidoActivo.visitante);
  const resultadoExistente = getResultado(_partidoActivo.id);

  const contenidoConfirm = `
    <div class="confirm-icon">${resultadoExistente?.jugado ? '✏️' : '✅'}</div>
    <p class="confirm-message">
      ${resultadoExistente?.jugado
        ? 'Estás por <strong>actualizar</strong> el resultado de este partido.'
        : 'Confirmá el resultado del partido:'}
    </p>
    <div class="confirm-score-preview">
      <div class="confirm-score-team">
        <span class="confirm-score-flag">${equipoL?.bandera}</span>
        <span class="confirm-score-name">${escapeHtml(equipoL?.nombre || '')}</span>
        <span class="confirm-score-goals">${gl}</span>
      </div>
      <span class="confirm-score-sep">−</span>
      <div class="confirm-score-team">
        <span class="confirm-score-flag">${equipoV?.bandera}</span>
        <span class="confirm-score-name">${escapeHtml(equipoV?.nombre || '')}</span>
        <span class="confirm-score-goals">${gv}</span>
      </div>
    </div>
    <p style="text-align:center;font-size:var(--text-xs);color:var(--color-text-muted)">
      Esta acción actualizará la tabla de posiciones automáticamente.
    </p>
  `;

  document.getElementById('modal-confirm-body').innerHTML = contenidoConfirm;
  document.getElementById('btn-confirm-ok').onclick = () => confirmarGuardarResultado(gl, gv);
  Modal.open('modal-confirm');
}

function confirmarGuardarResultado(gl, gv) {
  if (!_partidoActivo) return;

  // Guardar resultado
  guardarResultado(_partidoActivo.id, {
    golesLocal:      gl,
    golesVisitante:  gv,
    jugado:          true,
    tipoResultado:   'regular',
  });

  // Guardar goleadores (filtrar los que tienen nombre)
  const goleadoresValidos = _goleadoresTemp.filter(g => g.jugador.trim());
  guardarGoleadores(_partidoActivo.id, goleadoresValidos);

  // Guardar asistidores (filtrar los que tienen nombre)
  const asistidoresValidos = _asistidoresTemp.filter(a => a.jugador.trim());
  guardarAsistidores(_partidoActivo.id, asistidoresValidos);

  Modal.closeAll();

  // Feedback
  const equipoL = getEquipoPorId(_partidoActivo.local);
  const equipoV = getEquipoPorId(_partidoActivo.visitante);
  Toast.success(
    'Resultado guardado ✅',
    `${equipoL?.nombre} ${gl} - ${gv} ${equipoV?.nombre}`
  );

  // Re-renderizar
  renderizarPaginaFixture();
}

/** ── Borrar resultado ── */
function borrarResultadoActivo() {
  if (!_partidoActivo) return;

  const contenidoConfirm = `
    <div class="confirm-icon">🗑️</div>
    <p class="confirm-message">
      ¿Estás seguro de que querés <strong>borrar</strong> el resultado de este partido?<br>
      <span style="color:var(--color-danger)">Esta acción no se puede deshacer.</span>
    </p>
  `;

  document.getElementById('modal-confirm-body').innerHTML = contenidoConfirm;
  document.getElementById('btn-confirm-ok').onclick = () => {
    borrarResultado(_partidoActivo.id);
    guardarGoleadores(_partidoActivo.id, []);
    guardarAsistidores(_partidoActivo.id, []);
    Modal.closeAll();
    Toast.info('Resultado borrado', 'La tabla de posiciones se actualizó.');
    renderizarPaginaFixture();
  };
  Modal.open('modal-confirm');
}
