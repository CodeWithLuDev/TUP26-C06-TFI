function renderizarBracket(partidos, contenedor) {
  contenedor.innerHTML = '';
  const bracket = document.createElement('div');
  bracket.className = 'bracket-container';

  const fases = [
    { key: 'r32', titulo: 'Dieciseisavos' },
    { key: 'r16', titulo: 'Octavos de Final' },
    { key: 'qf', titulo: 'Cuartos de Final' },
    { key: 'sf', titulo: 'Semifinales' },
    { key: 'final', titulo: 'Final' }
  ];

  fases.forEach(fase => {
    const partidosFase = partidos.filter(p => p.fase === fase.key);
    if (partidosFase.length === 0) return;

    const columna = document.createElement('div');
    columna.className = 'bracket-columna';

    const titulo = document.createElement('h3');
    titulo.className = 'bracket-titulo';
    titulo.textContent = fase.titulo;
    columna.appendChild(titulo);

    partidosFase.forEach(p => {
      const match = document.createElement('div');
      match.className = 'bracket-match';
      match.dataset.matchId = p.id;

      const localEq = p.local ? obtenerEquipoPorId(p.local) : null;
      const visitEq = p.visitante ? obtenerEquipoPorId(p.visitante) : null;

      const localNombre = localEq ? `${localEq.bandera} ${localEq.nombre}` : '---';
      const visitNombre = visitEq ? `${visitEq.bandera} ${visitEq.nombre}` : '---';

      let ganadorLocal = false;
      let ganadorVisitante = false;

      if (p.resultado) {
        const gl = p.resultado.golesLocal;
        const gv = p.resultado.golesVisitante;

        if (p.resultado.penalesLocal !== undefined && p.resultado.penalesLocal !== null && gl === gv) {
          if (p.resultado.penalesLocal > p.resultado.penalesVisitante) ganadorLocal = true;
          else ganadorVisitante = true;
        } else if (gl > gv) {
          ganadorLocal = true;
        } else if (gv > gl) {
          ganadorVisitante = true;
        }
      }

      match.innerHTML = `
        ${p.fecha ? `<div class="match-fecha">${formatearFecha(p.fecha)} ${p.hora}</div>` : ''}
        <div class="match-equipo ${ganadorLocal ? 'ganador' : ''}">
          <span class="match-nombre">${localNombre}</span>
          ${p.resultado ? `<span class="match-goles">${p.resultado.golesLocal}</span>` : ''}
        </div>
        <div class="match-equipo ${ganadorVisitante ? 'ganador' : ''}">
          <span class="match-nombre">${visitNombre}</span>
          ${p.resultado ? `<span class="match-goles">${p.resultado.golesVisitante}</span>` : ''}
        </div>
        ${p.resultado && p.resultado.penalesLocal !== undefined ? `<div class="match-penales">${p.resultado.penalesLocal}-${p.resultado.penalesVisitante} pen.</div>` : ''}
      `;

      columna.appendChild(match);
    });

    bracket.appendChild(columna);
  });

  const tp = partidos.filter(p => p.fase === 'tp');
  if (tp.length > 0) {
    const columna = document.createElement('div');
    columna.className = 'bracket-columna';
    const titulo = document.createElement('h3');
    titulo.className = 'bracket-titulo tercer-puesto';
    titulo.textContent = 'Tercer Puesto';
    columna.appendChild(titulo);

    tp.forEach(p => {
      const match = document.createElement('div');
      match.className = 'bracket-match';
      const localEq = p.local ? obtenerEquipoPorId(p.local) : null;
      const visitEq = p.visitante ? obtenerEquipoPorId(p.visitante) : null;
      const localNombre = localEq ? `${localEq.bandera} ${localEq.nombre}` : '---';
      const visitNombre = visitEq ? `${visitEq.bandera} ${visitEq.nombre}` : '---';

      let ganadorLocal = false, ganadorVisitante = false;
      if (p.resultado) {
        if ((p.resultado.golesLocal || 0) > (p.resultado.golesVisitante || 0)) ganadorLocal = true;
        else if ((p.resultado.golesVisitante || 0) > (p.resultado.golesLocal || 0)) ganadorVisitante = true;
      }

      match.innerHTML = `
        <div class="match-equipo ${ganadorLocal ? 'ganador' : ''}"><span>${localNombre}</span>${p.resultado ? `<span>${p.resultado.golesLocal}</span>` : ''}</div>
        <div class="match-equipo ${ganadorVisitante ? 'ganador' : ''}"><span>${visitNombre}</span>${p.resultado ? `<span>${p.resultado.golesVisitante}</span>` : ''}</div>
      `;
      columna.appendChild(match);
    });
    bracket.appendChild(columna);
  }

  contenedor.appendChild(bracket);
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const [y, m, d] = fechaStr.split('-');
  return `${d}/${m}/${y}`;
}
