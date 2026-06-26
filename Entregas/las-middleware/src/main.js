const ESTADO_KEY = 'fixtureMundialEstado';

let partidos = [];
let navegacionActual = 'equipos';

function init() {
  cargarEstado();
  sincronizarPlayoffs();
  configurarNavegacion();
  renderizarVistaActual();
}

function cargarEstado() {
  const guardado = localStorage.getItem(ESTADO_KEY);
  if (guardado) {
    const datos = JSON.parse(guardado);
    partidos = reconstruirPartidos(datos);
  } else {
    partidos = JSON.parse(JSON.stringify(partidosBase));
  }
}

function reconstruirPartidos(datos) {
  return datos.map(p => ({
    ...p,
    resultado: p.resultado ? {
      ...p.resultado,
      goles: p.resultado.goles || []
    } : null
  }));
}

function guardarEstado() {
  localStorage.setItem(ESTADO_KEY, JSON.stringify(partidos));
}

function sincronizarPlayoffs() {
  const actualizados = actualizarLlaves(partidos);
  actualizados.forEach(p => {
    if (p.fase !== 'grupos') {
      const original = partidos.find(o => o.id === p.id);
      if (original) {
        original.local = p.local;
        original.visitante = p.visitante;
      }
    }
  });
}

function configurarNavegacion() {
  const nav = document.querySelector('nav');
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-btn');
    if (!btn) return;

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    navegacionActual = btn.dataset.seccion;
    renderizarVistaActual();
  });
}

function renderizarVistaActual() {
  const main = document.querySelector('#contenido-principal');
  main.innerHTML = '';

  switch (navegacionActual) {
    case 'equipos':
      renderizarEquipos(main);
      break;
    case 'grupos':
      renderizarGrupos(partidos, main);
      break;
    case 'bracket':
      renderizarBracket(actualizarLlaves(partidos), main);
      break;
    case 'fixture':
      renderizarFixture(partidos, main, () => {
        guardarEstado();
        sincronizarPlayoffs();
        renderizarVistaActual();
      });
      break;
    case 'estadisticas':
      renderizarEstadisticas(main);
      break;
  }
}

function renderizarEquipos(contenedor) {
  contenedor.innerHTML = '';
  const section = document.createElement('div');
  section.className = 'equipos-page';

  const titulo = document.createElement('h2');
  titulo.textContent = 'Equipos Participantes';
  section.appendChild(titulo);

  gruposDisponibles.forEach(grupo => {
    const bloque = document.createElement('div');
    bloque.className = 'grupo-equipos';

    const h3 = document.createElement('h3');
    h3.textContent = `Grupo ${grupo}`;
    bloque.appendChild(h3);

    const lista = document.createElement('div');
    lista.className = 'equipos-grid';

    obtenerEquiposPorGrupo(grupo).forEach(eq => {
      const card = document.createElement('div');
      card.className = 'equipo-card';
      card.innerHTML = `
        <span class="bandera-grande">${eq.bandera}</span>
        <span class="equipo-nombre">${eq.nombre}</span>
        <span class="equipo-grupo">Grupo ${eq.grupo}</span>
      `;
      lista.appendChild(card);
    });

    bloque.appendChild(lista);
    section.appendChild(bloque);
  });

  contenedor.appendChild(section);
}

function renderizarEstadisticas(contenedor) {
  contenedor.innerHTML = '';
  const section = document.createElement('div');
  section.className = 'estadisticas-page';

  const titulo = document.createElement('h2');
  titulo.textContent = 'Estadísticas del Torneo';
  section.appendChild(titulo);

  const columns = document.createElement('div');
  columns.className = 'estadisticas-columnas';

  const goleadores = calcularGoleadores(partidos);
  const asistencias = calcularAsistidores(partidos);

  const boxGoles = document.createElement('div');
  boxGoles.className = 'estadisticas-box';
  boxGoles.innerHTML = '<h3>Goleadores</h3>';
  const tablaGoles = document.createElement('table');
  tablaGoles.className = 'tabla-estadisticas';
  tablaGoles.innerHTML = `
    <thead><tr><th>#</th><th>Jugador</th><th>Equipo</th><th>Goles</th></tr></thead>
    <tbody>
      ${goleadores.length === 0 ? '<tr><td colspan="4">No hay goles registrados</td></tr>' :
        goleadores.map((g, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${g.jugador}</td>
            <td>${obtenerEquipoPorId(g.equipo) ? obtenerEquipoPorId(g.equipo).bandera + ' ' + obtenerEquipoPorId(g.equipo).nombre : g.equipo}</td>
            <td class="num">${g.goles}</td>
          </tr>
        `).join('')
      }
    </tbody>
  `;
  boxGoles.appendChild(tablaGoles);
  columns.appendChild(boxGoles);

  const boxAsistencias = document.createElement('div');
  boxAsistencias.className = 'estadisticas-box';
  boxAsistencias.innerHTML = '<h3>Asistidores</h3>';
  const tablaAsistencias = document.createElement('table');
  tablaAsistencias.className = 'tabla-estadisticas';
  tablaAsistencias.innerHTML = `
    <thead><tr><th>#</th><th>Jugador</th><th>Equipo</th><th>Asistencias</th></tr></thead>
    <tbody>
      ${asistencias.length === 0 ? '<tr><td colspan="4">No hay asistencias registradas</td></tr>' :
        asistencias.map((a, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${a.jugador}</td>
            <td>${obtenerEquipoPorId(a.equipo) ? obtenerEquipoPorId(a.equipo).bandera + ' ' + obtenerEquipoPorId(a.equipo).nombre : a.equipo}</td>
            <td class="num">${a.asistencias}</td>
          </tr>
        `).join('')
      }
    </tbody>
  `;
  boxAsistencias.appendChild(tablaAsistencias);
  columns.appendChild(boxAsistencias);

  section.appendChild(columns);
  contenedor.appendChild(section);
}

document.addEventListener('DOMContentLoaded', init);
