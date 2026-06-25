/**
 * grupos.js — Renderizado de la página de fase de grupos
 */

/** Renderiza la página completa de grupos */
function renderizarPaginaGrupos() {
    const resultados = getTodosLosResultados();
    const grupos     = getGrupos();
    const html       = grupos.map(g => renderizarTarjetaGrupo(g, resultados)).join('');
    renderizar('grupos-grid', html);
  }
  
  /** Renderiza la tarjeta de un grupo con su tabla de posiciones */
  function renderizarTarjetaGrupo(grupo, resultados) {
    const partidos = getPartidosPorGrupo(grupo);
    const tabla    = calcularTablaGrupo(grupo, partidos, resultados);
    const completo = grupoCompleto(grupo, partidos, resultados);
    const jugados  = partidos.filter(p => resultados[p.id]?.jugado).length;
  
    return `
      <div class="group-card">
        <div class="group-card-header">
          <div class="group-label">
            <div class="group-letter">${grupo}</div>
            <div>
              <div class="group-name">Grupo ${grupo}</div>
              <div class="group-matches-count">${jugados}/${partidos.length} partidos</div>
            </div>
          </div>
          ${completo ? '<span class="badge badge-success">Completo ✓</span>' : ''}
        </div>
  
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:32px">#</th>
                <th>Equipo</th>
                <th class="text-center">PJ</th>
                <th class="text-center">PG</th>
                <th class="text-center">PE</th>
                <th class="text-center">PP</th>
                <th class="text-center">GF</th>
                <th class="text-center">GC</th>
                <th class="text-center">DG</th>
                <th class="text-center">PTS</th>
              </tr>
            </thead>
            <tbody>
              ${tabla.map((fila, i) => renderizarFilaTabla(fila, i + 1, completo)).join('')}
            </tbody>
          </table>
        </div>
  
        <div class="card-footer" style="display:flex;gap:var(--space-4);font-size:var(--text-xs);color:var(--color-text-muted);">
          <span>🟢 Clasifica a Octavos</span>
          <span>🔵 2do Clasifica</span>
        </div>
      </div>
    `;
  }
  
  /** Renderiza una fila de la tabla de posiciones */
  function renderizarFilaTabla(fila, posicion, completo) {
    const eq  = fila.equipo;
    const cls = clasePosicion(posicion, completo);
  
    return `
      <tr class="${cls}">
        <td class="rank-cell">${posicion}</td>
        <td>
          <div class="table-team-cell">
            <span class="table-team-flag">${eq.bandera}</span>
            <span class="table-team-name">${escapeHtml(eq.nombre)}</span>
          </div>
        </td>
        <td class="text-center">${fila.pj}</td>
        <td class="text-center">${fila.pg}</td>
        <td class="text-center">${fila.pe}</td>
        <td class="text-center">${fila.pp}</td>
        <td class="text-center">${fila.gf}</td>
        <td class="text-center">${fila.gc}</td>
        <td class="text-center">${formatDG(fila.dg)}</td>
        <td class="text-center pts-cell">${fila.pts}</td>
      </tr>
    `;
  }
  