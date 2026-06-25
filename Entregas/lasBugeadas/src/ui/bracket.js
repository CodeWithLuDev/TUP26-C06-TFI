/**
 * bracket.js — Renderizado del bracket de eliminación directa
 */

let _bracketActual = null;
let _partidoPlayoffActivo = null;

function renderizarPaginaBracket() {
  const resultados = getTodosLosResultados();
  const puedeJugar = puedeIniciarPlayoffs(resultados);
  const playoffsGuardados = getPlayoffs();

  _bracketActual = generarBracket(resultados, playoffsGuardados);
  guardarPlayoffs(_bracketActual);

  renderizarBannerPlayoff(puedeJugar, _bracketActual);
  renderizarBracketVisual(_bracketActual);
}

function renderizarBannerPlayoff(puedeJugar, bracket) {
  const campeon = bracket?.final?.[0]?.ganador;
  let html = '';

  if (campeon) {
    html = `
      <div class="playoff-status-banner" style="background:var(--gradient-gold)">
        <span class="playoff-status-icon">🏆</span>
        <div class="playoff-status-text">
          <h3 style="color:var(--color-secondary-dark)">¡Campeón del Mundial!</h3>
          <p style="color:rgba(0,0,0,0.6)">${campeon.bandera} <strong>${escapeHtml(campeon.nombre)}</strong> es el campeón del torneo</p>
        </div>
      </div>`;
  } else if (!puedeJugar) {
    html = `
      <div class="playoff-status-banner">
        <span class="playoff-status-icon">⏳</span>
        <div class="playoff-status-text">
          <h3>Fase de Grupos en curso</h3>
          <p>Completá todos los partidos de grupos para desbloquear los playoffs</p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="Nav.irA('grupos')" style="margin-left:auto;flex-shrink:0">Ver grupos →</button>
      </div>`;
  } else {
    html = `
      <div class="playoff-status-banner">
        <span class="playoff-status-icon">🔥</span>
        <div class="playoff-status-text">
          <h3>Playoffs en curso</h3>
          <p>Hacé clic en cualquier partido para ingresar el resultado</p>
        </div>
      </div>`;
  }

  renderizar('playoff-banner', html);
}

function renderizarBracketVisual(bracket) {
  const rondas = [
    { clave: 'octavos',     label: 'Octavos' },
    { clave: 'cuartos',     label: 'Cuartos' },
    { clave: 'semifinales', label: 'Semifinales' },
    { clave: 'final',       label: 'Final' },
  ];

  const html = `
    <div class="bracket-container">
      <div class="bracket">
        ${rondas.map(r => renderizarRondaBracket(r.clave, r.label, bracket)).join('')}
      </div>
    </div>
    <div style="margin-top:var(--space-8)">
      <h3 class="section-title"><span class="title-icon">🥉</span>Tercer Puesto</h3>
      <div style="max-width:480px">
        ${(bracket.tercerPuesto||[]).map((p,i) => renderizarTarjetaMatchBracket(p,'tercerPuesto',i)).join('')}
      </div>
    </div>`;

  renderizar('bracket-visual', html);
}

function renderizarRondaBracket(rondaClave, label, bracket) {
  const partidos = bracket[rondaClave] || [];
  return `
    <div class="bracket-round">
      <div class="bracket-round-header">${label}</div>
      <div class="bracket-matches">
        ${partidos.map((p,i) => renderizarTarjetaMatchBracket(p, rondaClave, i)).join('')}
      </div>
    </div>`;
}

function renderizarTarjetaMatchBracket(partido, ronda, indice) {
  const clicable = partido.local && partido.visitante;
  const res = partido.resultado;
  const equL = partido.local;
  const equV = partido.visitante;

  const claseL = res && partido.ganador?.id === equL?.id ? 'winner' : (equL ? '' : 'tbd');
  const claseV = res && partido.ganador?.id === equV?.id ? 'winner' : (equV ? '' : 'tbd');

  const penL = res?.tipoResultado === 'penales' ? ` <small style="font-size:10px">(${res.golesLocalPenales})</small>` : '';
  const penV = res?.tipoResultado === 'penales' ? ` <small style="font-size:10px">(${res.golesVisitantePenales})</small>` : '';

  return `
    <div class="bracket-match" style="margin-bottom:var(--space-3)">
      <div class="bracket-match-card" ${clicable ? `onclick="abrirModalPartidoPlayoff('${ronda}',${indice})" style="cursor:pointer"` : ''}>
        <div class="bracket-team ${claseL}">
          <span class="bracket-team-flag">${equL ? equL.bandera : ''}</span>
          <span class="bracket-team-name">${equL ? escapeHtml(equL.nombre) : 'Por definir'}</span>
          <span class="bracket-team-score">${res !== null ? res.gl : ''}${penL}</span>
        </div>
        <div class="bracket-team ${claseV}">
          <span class="bracket-team-flag">${equV ? equV.bandera : ''}</span>
          <span class="bracket-team-name">${equV ? escapeHtml(equV.nombre) : 'Por definir'}</span>
          <span class="bracket-team-score">${res !== null ? res.gv : ''}${penV}</span>
        </div>
      </div>
      <div style="text-align:center;margin-top:4px;font-size:var(--text-xs);color:var(--color-text-muted)">
        ${partido.fecha ? formatearFechaCorta(partido.fecha) : ''}
        ${res?.tipoResultado === 'penales' ? '<span class="result-type-badge" style="margin-left:4px">PEN</span>' : ''}
        ${res?.tipoResultado === 'extratime' ? '<span class="result-type-badge" style="margin-left:4px">ET</span>' : ''}
      </div>
    </div>`;
}

function abrirModalPartidoPlayoff(ronda, indice) {
  if (!_bracketActual) return;
  const partido = _bracketActual[ronda]?.[indice];
  if (!partido || !partido.local || !partido.visitante) {
    Toast.warning('Partido bloqueado', 'Completá los partidos de la ronda anterior primero.');
    return;
  }

  _partidoPlayoffActivo = { ronda, indice, partido };
  const equL = partido.local;
  const equV = partido.visitante;
  const res  = partido.resultado;

  const html = `
    <div class="match-detail-header">
      <div class="match-meta" style="margin-bottom:var(--space-3)">
        <span class="badge badge-accent">${etiquetaRonda(ronda)}</span>
        ${partido.fecha ? `<span class="match-meta-item">📅 ${formatearFecha(partido.fecha)}</span>` : ''}
        ${partido.estadio ? `<span class="match-meta-item">🏟️ ${partido.estadio}</span>` : ''}
      </div>
      <div class="match-detail-teams">
        <div class="match-detail-team">
          <div class="match-detail-flag">${equL.bandera}</div>
          <div class="match-detail-name">${escapeHtml(equL.nombre)}</div>
        </div>
        <div class="match-detail-vs">VS</div>
        <div class="match-detail-team">
          <div class="match-detail-flag">${equV.bandera}</div>
          <div class="match-detail-name">${escapeHtml(equV.nombre)}</div>
        </div>
      </div>
    </div>
    ${res ? `<div class="alert alert-info" style="margin-bottom:var(--space-4)">
      <span class="alert-icon">ℹ️</span>
      <span>Resultado actual: <strong>${equL.nombre} ${res.gl}–${res.gv} ${equV.nombre}</strong>
      ${res.tipoResultado==='penales' ? ` (Pen: ${res.golesLocalPenales}–${res.golesVisitantePenales})` : ''}</span>
    </div>` : ''}
    <div class="score-inputs">
      <div class="score-team-box">
        <div class="score-team-flag">${equL.bandera}</div>
        <div class="score-team-name">${escapeHtml(equL.nombre)}</div>
        <input type="number" id="playoff-goles-local" class="score-input" min="0" max="99" value="${res?.gl??''}" placeholder="0"/>
      </div>
      <div class="score-vs-center"><span>−</span></div>
      <div class="score-team-box">
        <div class="score-team-flag">${equV.bandera}</div>
        <div class="score-team-name">${escapeHtml(equV.nombre)}</div>
        <input type="number" id="playoff-goles-visitante" class="score-input" min="0" max="99" value="${res?.gv??''}" placeholder="0"/>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:var(--space-4)">
      <label class="form-label">En caso de empate, definición:</label>
      <select class="form-select" id="playoff-tipo-resultado">
        <option value="regular">Ganador en tiempo regular</option>
        <option value="extratime" ${res?.tipoResultado==='extratime'?'selected':''}>Tiempo extra (prórroga)</option>
        <option value="penales" ${res?.tipoResultado==='penales'?'selected':''}>Tanda de penales</option>
      </select>
    </div>
    <div id="playoff-penales-section" ${res?.tipoResultado==='penales'?'':'style="display:none"'}>
      <div class="divider"></div>
      <p style="font-size:var(--text-sm);font-weight:var(--weight-semibold);margin-bottom:var(--space-3)">🥅 Resultado en penales:</p>
      <div class="score-inputs" style="max-width:300px;margin:0 auto">
        <div class="score-team-box">
          <div class="score-team-name">${escapeHtml(equL.nombre)}</div>
          <input type="number" id="playoff-pen-local" class="score-input" min="0" max="20" value="${res?.golesLocalPenales??''}" placeholder="0"/>
        </div>
        <div class="score-vs-center"><span>−</span></div>
        <div class="score-team-box">
          <div class="score-team-name">${escapeHtml(equV.nombre)}</div>
          <input type="number" id="playoff-pen-visitante" class="score-input" min="0" max="20" value="${res?.golesVisitantePenales??''}" placeholder="0"/>
        </div>
      </div>
    </div>`;

  document.getElementById('modal-playoff-body').innerHTML = html;
  document.getElementById('modal-playoff-title').textContent = `${etiquetaRonda(ronda)}: ${equL.nombre} vs ${equV.nombre}`;

  document.getElementById('playoff-tipo-resultado').addEventListener('change', function() {
    const sec = document.getElementById('playoff-penales-section');
    if (sec) sec.style.display = this.value === 'penales' ? '' : 'none';
  });

  const btnBorrar = document.getElementById('btn-borrar-playoff');
  if (btnBorrar) btnBorrar.style.display = res ? 'flex' : 'none';

  Modal.open('modal-playoff');
}

function guardarResultadoPlayoff() {
  if (!_partidoPlayoffActivo || !_bracketActual) return;

  const { ronda, indice } = _partidoPlayoffActivo;
  const gl = parseInt(document.getElementById('playoff-goles-local').value, 10);
  const gv = parseInt(document.getElementById('playoff-goles-visitante').value, 10);

  if (isNaN(gl) || isNaN(gv) || gl < 0 || gv < 0) {
    Toast.warning('Resultado inválido', 'Ingresá goles válidos para ambos equipos.');
    return;
  }

  const tipoResultado = document.getElementById('playoff-tipo-resultado').value;
  let penL = null, penV = null;

  if (tipoResultado === 'penales') {
    if (gl !== gv) { Toast.warning('Inválido', 'Para penales el resultado regular debe ser empate.'); return; }
    penL = parseInt(document.getElementById('playoff-pen-local').value,10)||0;
    penV = parseInt(document.getElementById('playoff-pen-visitante').value,10)||0;
    if (penL === penV) { Toast.warning('Penales inválidos','Debe haber un ganador en penales.'); return; }
  }

  const nuevoBracket = JSON.parse(JSON.stringify(_bracketActual));
  const partido = nuevoBracket[ronda][indice];
  const resultado = { gl, gv, tipoResultado, golesLocalPenales: penL, golesVisitantePenales: penV };

  let ganador, perdedor;
  if (gl > gv) {
    ganador = partido.local; perdedor = partido.visitante;
  } else if (gl < gv) {
    ganador = partido.visitante; perdedor = partido.local;
  } else if (tipoResultado === 'penales') {
    ganador  = penL > penV ? partido.local : partido.visitante;
    perdedor = ganador === partido.local ? partido.visitante : partido.local;
  } else {
    ganador = partido.local; perdedor = partido.visitante;
  }

  nuevoBracket[ronda][indice].resultado = resultado;
  nuevoBracket[ronda][indice].ganador   = ganador;
  nuevoBracket[ronda][indice].perdedor  = perdedor;

  _bracketActual = propagarGanadorEnBracket(nuevoBracket, ronda, indice, ganador, perdedor);
  guardarPlayoffs(_bracketActual);

  Modal.close('modal-playoff');
  Toast.success('Resultado guardado ✅', `${partido.local.nombre} ${gl}–${gv} ${partido.visitante.nombre}`);
  renderizarPaginaBracket();
}

function propagarGanadorEnBracket(bracket, ronda, indice, ganador, perdedor) {
  const mapa = { octavos: 'cuartos', cuartos: 'semifinales' };

  if (ronda === 'semifinales') {
    if (indice === 0) {
      if (bracket.final[0])        bracket.final[0].local        = ganador;
      if (bracket.tercerPuesto[0]) bracket.tercerPuesto[0].local = perdedor;
    } else {
      if (bracket.final[0])        bracket.final[0].visitante        = ganador;
      if (bracket.tercerPuesto[0]) bracket.tercerPuesto[0].visitante = perdedor;
    }
    if (bracket.final[0]) { bracket.final[0].resultado=null; bracket.final[0].ganador=null; }
    return bracket;
  }

  const sig = mapa[ronda];
  if (!sig) return bracket;

  const slot   = Math.floor(indice / 2);
  const esLoc  = indice % 2 === 0;

  if (bracket[sig]?.[slot]) {
    if (esLoc) bracket[sig][slot].local     = ganador;
    else       bracket[sig][slot].visitante = ganador;
    bracket[sig][slot].resultado = null;
    bracket[sig][slot].ganador   = null;
    bracket[sig][slot].perdedor  = null;
  }
  return bracket;
}

function borrarResultadoPlayoffActivo() {
  if (!_partidoPlayoffActivo || !_bracketActual) return;
  const { ronda, indice } = _partidoPlayoffActivo;
  const nuevoBracket = JSON.parse(JSON.stringify(_bracketActual));

  nuevoBracket[ronda][indice].resultado = null;
  nuevoBracket[ronda][indice].ganador   = null;
  nuevoBracket[ronda][indice].perdedor  = null;

  limpiarRondasPosteriores(nuevoBracket, ronda, indice);

  _bracketActual = nuevoBracket;
  guardarPlayoffs(_bracketActual);
  Modal.close('modal-playoff');
  Toast.info('Resultado borrado','Las rondas posteriores fueron actualizadas.');
  renderizarPaginaBracket();
}

function limpiarRondasPosteriores(bracket, ronda, indice) {
  const mapa = { octavos: 'cuartos', cuartos: 'semifinales', semifinales: 'final' };
  let sig  = mapa[ronda];
  let slot = Math.floor(indice / 2);
  let esL  = indice % 2 === 0;

  while (sig && bracket[sig]?.[slot]) {
    const p = bracket[sig][slot];
    if (esL) p.local = null; else p.visitante = null;
    p.resultado = null; p.ganador = null; p.perdedor = null;
    const nextSig = mapa[sig];
    esL  = slot % 2 === 0;
    slot = Math.floor(slot / 2);
    sig  = nextSig;
  }

  if (ronda === 'semifinales' && bracket.tercerPuesto?.[0]) {
    if (indice === 0) bracket.tercerPuesto[0].local     = null;
    else              bracket.tercerPuesto[0].visitante = null;
    bracket.tercerPuesto[0].resultado = null;
    bracket.tercerPuesto[0].ganador   = null;
  }
}
