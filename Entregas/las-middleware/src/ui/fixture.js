let partidoSeleccionado = null;

function renderizarFixture(partidos, contenedor, onResultadoGuardado) {
  contenedor.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'fixture-container';

  const filtros = document.createElement('div');
  filtros.className = 'fixture-filtros';
  filtros.innerHTML = `
    <button class="filtro-btn activo" data-filtro="todos">Todos</button>
    <button class="filtro-btn" data-filtro="grupos">Fase de Grupos</button>
    <button class="filtro-btn" data-filtro="r32">Dieciseisavos</button>
    <button class="filtro-btn" data-filtro="r16">Octavos</button>
    <button class="filtro-btn" data-filtro="qf">Cuartos</button>
    <button class="filtro-btn" data-filtro="sf">Semifinales</button>
    <button class="filtro-btn" data-filtro="final">Final</button>
  `;
  container.appendChild(filtros);

  const acciones = document.createElement('div');
  acciones.className = 'fixture-acciones';
  acciones.innerHTML = `<button class="btn-simular" id="btn-simular-todo">🎲 Simular resultados al azar</button>`;
  container.appendChild(acciones);

  const listaPartidos = document.createElement('div');
  listaPartidos.className = 'fixture-lista';
  container.appendChild(listaPartidos);

  contenedor.appendChild(container);

  const filtroBtns = filtros.querySelectorAll('.filtro-btn');
  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtroBtns.forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      renderizarListaPartidos(partidos, listaPartidos, btn.dataset.filtro, onResultadoGuardado);
    });
  });

  const btnSimular = document.getElementById('btn-simular-todo');
  if (btnSimular) {
    btnSimular.addEventListener('click', () => {
      if (!confirm('¿Generar resultados al azar para TODOS los partidos sin resultado?')) return;
      simularResultadosFaseGrupos(partidos);
      sincronizarPlayoffs();
      simularResultadosKO(partidos);
      onResultadoGuardado();
    });
  }

  renderizarListaPartidos(partidos, listaPartidos, 'todos', onResultadoGuardado);
}

function renderizarListaPartidos(partidos, contenedor, filtro, onResultadoGuardado) {
  contenedor.innerHTML = '';

  let filtrados = partidos;
  if (filtro !== 'todos') {
    if (filtro === 'grupos') filtrados = partidos.filter(p => p.fase === 'grupos');
    else filtrados = partidos.filter(p => p.fase === filtro);
  }

  const agrupados = agruparPorJornadaOFase(filtrados);

  agrupados.forEach(grupo => {
    const bloque = document.createElement('div');
    bloque.className = 'fixture-bloque';

    const titulo = document.createElement('h4');
    titulo.className = 'fixture-bloque-titulo';
    titulo.textContent = grupo.titulo;
    bloque.appendChild(titulo);

    grupo.partidos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'fixture-partido';
      if (p === partidoSeleccionado) card.classList.add('seleccionado');

      const local = p.local ? obtenerEquipoPorId(p.local) : null;
      const visitante = p.visitante ? obtenerEquipoPorId(p.visitante) : null;

      const localNombre = local ? `${local.bandera} ${local.nombre}` : '---';
      const visitNombre = visitante ? `${visitante.bandera} ${visitante.nombre}` : '---';

      const disponible = p.local && p.visitante;
      const tieneResultado = p.resultado && p.resultado.golesLocal !== null;

      card.innerHTML = `
        <div class="partido-info">
          <span class="partido-fecha">${formatearFecha(p.fecha)} ${p.hora}</span>
          ${p.ronda ? `<span class="partido-ronda">${p.ronda}</span>` : ''}
          ${p.grupo ? `<span class="partido-ronda">Grupo ${p.grupo}</span>` : ''}
        </div>
        <div class="partido-marcador ${!disponible ? 'no-disponible' : ''}">
          <div class="partido-equipo">${localNombre}</div>
          <div class="partido-vs">
            ${tieneResultado ? `<span class="resultado-final">${p.resultado.golesLocal} - ${p.resultado.golesVisitante}</span>` : '<span class="vs">VS</span>'}
          </div>
          <div class="partido-equipo">${visitNombre}</div>
        </div>
        ${disponible && !tieneResultado ? '<button class="btn-cargar-resultado">Cargar Resultado</button>' : ''}
        ${tieneResultado ? '<button class="btn-editar-resultado">Editar</button>' : ''}
      `;

      if (disponible && !tieneResultado) {
        card.querySelector('.btn-cargar-resultado').addEventListener('click', () => {
          partidoSeleccionado = p;
          mostrarModalResultado(p, onResultadoGuardado);
          renderizarListaPartidos(partidos, contenedor, filtro, onResultadoGuardado);
        });
      }

      if (tieneResultado) {
        card.querySelector('.btn-editar-resultado').addEventListener('click', () => {
          partidoSeleccionado = p;
          mostrarModalResultado(p, onResultadoGuardado, true);
          renderizarListaPartidos(partidos, contenedor, filtro, onResultadoGuardado);
        });
      }

      bloque.appendChild(card);
    });
    contenedor.appendChild(bloque);
  });
}

function agruparPorJornadaOFase(partidos) {
  const grupos = [];
  const gruposMap = {};

  partidos.forEach(p => {
    let key;
    if (p.fase === 'grupos') {
      key = `Grupo ${p.grupo} - Jornada ${p.jornada}`;
    } else {
      key = p.ronda || p.fase;
    }

    if (!gruposMap[key]) {
      gruposMap[key] = { titulo: key, partidos: [] };
      grupos.push(gruposMap[key]);
    }
    gruposMap[key].partidos.push(p);
  });

  return grupos;
}

function mostrarModalResultado(partido, onResultadoGuardado, editando = false) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-resultado';

  const modal = document.createElement('div');
  modal.className = 'modal';

  const local = obtenerEquipoPorId(partido.local);
  const visitante = obtenerEquipoPorId(partido.visitante);

  const esEliminatoria = partido.fase !== 'grupos';

  modal.innerHTML = `
    <h3>${editando ? 'Editar' : 'Cargar'} Resultado</h3>
    <div class="modal-partido">
      <div class="modal-equipo">${local.bandera} ${local.nombre}</div>
      <div class="modal-marcador-input">
        <input type="number" id="goles-local" min="0" max="99" value="${editando && partido.resultado ? partido.resultado.golesLocal : 0}">
        <span>-</span>
        <input type="number" id="goles-visitante" min="0" max="99" value="${editando && partido.resultado ? partido.resultado.golesVisitante : 0}">
      </div>
      <div class="modal-equipo">${visitante.bandera} ${visitante.nombre}</div>
    </div>
    ${esEliminatoria ? `
      <div class="modal-penales" id="penales-section" style="display:none">
        <h4>Penales (si aplica)</h4>
        <div class="modal-marcador-input">
          <input type="number" id="penales-local" min="0" max="99" value="${editando && partido.resultado && partido.resultado.penalesLocal !== undefined ? partido.resultado.penalesLocal : 0}">
          <span>-</span>
          <input type="number" id="penales-visitante" min="0" max="99" value="${editando && partido.resultado && partido.resultado.penalesVisitante !== undefined ? partido.resultado.penalesVisitante : 0}">
        </div>
      </div>
    ` : ''}
    <div class="modal-goles">
      <h4>Goles del partido</h4>
      <div id="goles-lista"></div>
      <button class="btn-agregar-gol" id="btn-agregar-gol">+ Agregar gol</button>
    </div>
    <div class="modal-acciones">
      <button class="btn-cancelar" id="btn-cancelar-modal">Cancelar</button>
      <button class="btn-guardar" id="btn-guardar-resultado">${editando ? 'Actualizar' : 'Guardar'} Resultado</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  if (esEliminatoria) {
    const golesLoc = modal.querySelector('#goles-local');
    const golesVis = modal.querySelector('#goles-visitante');
    const penalesSection = modal.querySelector('#penales-section');

    function verificarEmpate() {
      const gl = parseInt(golesLoc.value) || 0;
      const gv = parseInt(golesVis.value) || 0;
      penalesSection.style.display = (gl === gv) ? 'block' : 'none';
    }

    golesLoc.addEventListener('input', verificarEmpate);
    golesVis.addEventListener('input', verificarEmpate);
    verificarEmpate();
  }

  let golesTemp = [];

  if (editando && partido.resultado && partido.resultado.goles) {
    golesTemp = [...partido.resultado.goles];
    renderizarGolesTemp(golesTemp, partido);
  }

  function renderizarGolesTemp(goles, p) {
    const lista = modal.querySelector('#goles-lista');
    lista.innerHTML = '';
    goles.forEach((g, i) => {
      const div = document.createElement('div');
      div.className = 'gol-item';
      div.innerHTML = `
        <span>${g.minuto ? g.minuto + "'" : ''} - ${g.jugador || 'Sin nombre'} ${g.equipo === p.local ? `(${local.bandera})` : `(${visitante.bandera})`} ${g.asistencia ? `(Asist: ${g.asistencia})` : ''}</span>
        <button class="btn-eliminar-gol" data-index="${i}">✕</button>
      `;
      lista.appendChild(div);
    });

    lista.querySelectorAll('.btn-eliminar-gol').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        golesTemp.splice(idx, 1);
        renderizarGolesTemp(golesTemp, p);
      });
    });
  }

  modal.querySelector('#btn-agregar-gol').addEventListener('click', () => {
    const gl = parseInt(modal.querySelector('#goles-local').value) || 0;
    const gv = parseInt(modal.querySelector('#goles-visitante').value) || 0;

    const formGol = document.createElement('div');
    formGol.className = 'gol-form';
    formGol.innerHTML = `
      <select id="gol-equipo">
        <option value="${partido.local}">${local.nombre}</option>
        <option value="${partido.visitante}">${visitante.nombre}</option>
      </select>
      <input type="text" id="gol-jugador" placeholder="Nombre del goleador">
      <input type="number" id="gol-minuto" placeholder="Minuto" min="1" max="120">
      <input type="text" id="gol-asistencia" placeholder="Asistencia (opcional)">
      <button class="btn-agregar" id="btn-confirmar-gol">Agregar</button>
    `;
    modal.querySelector('#goles-lista').appendChild(formGol);

    formGol.querySelector('#btn-confirmar-gol').addEventListener('click', () => {
      const equipo = formGol.querySelector('#gol-equipo').value;
      const jugador = formGol.querySelector('#gol-jugador').value.trim();
      const minuto = formGol.querySelector('#gol-minuto').value;
      const asistencia = formGol.querySelector('#gol-asistencia').value.trim();

      if (!jugador) return;

      golesTemp.push({
        equipo,
        jugador,
        minuto: minuto ? parseInt(minuto) : null,
        asistencia: asistencia || null
      });

      formGol.remove();
      renderizarGolesTemp(golesTemp, partido);
    });
  });

  modal.querySelector('#btn-cancelar-modal').addEventListener('click', () => {
    overlay.remove();
  });

  modal.querySelector('#btn-guardar-resultado').addEventListener('click', () => {
    const golesLocal = parseInt(modal.querySelector('#goles-local').value) || 0;
    const golesVisitante = parseInt(modal.querySelector('#goles-visitante').value) || 0;

    const resultado = {
      golesLocal,
      golesVisitante,
      goles: golesTemp
    };

    if (esEliminatoria && golesLocal === golesVisitante) {
      resultado.penalesLocal = parseInt(modal.querySelector('#penales-local').value) || 0;
      resultado.penalesVisitante = parseInt(modal.querySelector('#penales-visitante').value) || 0;
    }

    partido.resultado = resultado;
    onResultadoGuardado();
    overlay.remove();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function golRandom() {
  const r = Math.random();
  if (r < 0.25) return 0;
  if (r < 0.50) return 1;
  if (r < 0.75) return 2;
  if (r < 0.90) return 3;
  return 4;
}

function simularResultadosFaseGrupos(partidos) {
  const nombres = [
    'L. Martínez', 'Messi', 'C. Ronaldo', 'Mbappé', 'Haaland', 'Kane', 'Neymar',
    'Vinícius Jr.', 'Salah', 'Lewandowski', 'De Bruyne', 'Griezmann', 'Musiala',
    'Bellingham', 'Yamal', 'Wirtz', 'Álvarez', 'Richarlison', 'Gakpo', 'Fernández'
  ];
  const asistentes = [
    'De Bruyne', 'Messi', 'Kimmich', 'Bellingham', 'Vinícius Jr.', 'Griezmann',
    'Musiala', 'Hakimi', 'Fernández', 'Pedri', 'Gnabry', 'Davies', 'Theo Hernández',
    'T. Alexander-Arnold', 'Di María', 'Raphinha', 'Mbappé', 'Salah', 'Kane', 'Yamal'
  ];

  partidos.filter(p => p.fase === 'grupos' && !p.resultado).forEach(p => {
    const gl = golRandom();
    const gv = golRandom();
    const goles = [];
    for (let i = 0; i < gl; i++) goles.push({ equipo: p.local, jugador: nombres[Math.floor(Math.random() * nombres.length)], minuto: Math.floor(Math.random() * 90) + 1, asistencia: Math.random() > 0.4 ? asistentes[Math.floor(Math.random() * asistentes.length)] : null });
    for (let i = 0; i < gv; i++) goles.push({ equipo: p.visitante, jugador: nombres[Math.floor(Math.random() * nombres.length)], minuto: Math.floor(Math.random() * 90) + 1, asistencia: Math.random() > 0.4 ? asistentes[Math.floor(Math.random() * asistentes.length)] : null });
    p.resultado = { golesLocal: gl, golesVisitante: gv, goles };
  });
}

function simularResultadosKO(partidos) {
  const nombres = [
    'L. Martínez', 'Messi', 'C. Ronaldo', 'Mbappé', 'Haaland', 'Kane', 'Neymar',
    'Vinícius Jr.', 'Salah', 'Lewandowski', 'De Bruyne', 'Griezmann', 'Musiala',
    'Bellingham', 'Yamal', 'Wirtz', 'Álvarez', 'Richarlison', 'Gakpo', 'Fernández'
  ];
  const asistentes = [
    'De Bruyne', 'Messi', 'Kimmich', 'Bellingham', 'Vinícius Jr.', 'Griezmann',
    'Musiala', 'Hakimi', 'Fernández', 'Pedri', 'Gnabry', 'Davies', 'Theo Hernández',
    'T. Alexander-Arnold', 'Di María', 'Raphinha', 'Mbappé', 'Salah', 'Kane', 'Yamal'
  ];

  partidos.filter(p => p.fase !== 'grupos' && !p.resultado && p.local && p.visitante).forEach(p => {
    const gl = golRandom();
    const gv = golRandom();
    const goles = [];
    for (let i = 0; i < gl; i++) goles.push({ equipo: p.local, jugador: nombres[Math.floor(Math.random() * nombres.length)], minuto: Math.floor(Math.random() * 120) + 1, asistencia: Math.random() > 0.4 ? asistentes[Math.floor(Math.random() * asistentes.length)] : null });
    for (let i = 0; i < gv; i++) goles.push({ equipo: p.visitante, jugador: nombres[Math.floor(Math.random() * nombres.length)], minuto: Math.floor(Math.random() * 120) + 1, asistencia: Math.random() > 0.4 ? asistentes[Math.floor(Math.random() * asistentes.length)] : null });

    if (gl === gv) {
      let pl = Math.floor(Math.random() * 5) + 3;
      let pv = Math.floor(Math.random() * 5) + 2;
      while (pv === pl) pv = Math.floor(Math.random() * 5) + 2;
      p.resultado = { golesLocal: gl, golesVisitante: gv, goles, penalesLocal: pl, penalesVisitante: pv };
    } else {
      p.resultado = { golesLocal: gl, golesVisitante: gv, goles };
    }
  });
}
