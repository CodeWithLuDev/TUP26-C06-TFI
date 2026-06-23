import { partidos } from '../data/partidos.js';
import { equipos }  from '../data/equipos.js';

let grupoActivo  = null;
let estadoActivo = 'todos';

function guardarPartidos() {
  localStorage.setItem('mundial_partidos', JSON.stringify(partidos));
}

function simularResultados() {
  partidos.filter(p => p.estado === 'pendiente').forEach(p => {
    p.golesLocal     = Math.floor(Math.random() * 5);
    p.golesVisitante = Math.floor(Math.random() * 5);
    p.estado         = 'jugado';
    p.goleadores     = []; 
    p.asistidores    = []; 
  });
  guardarPartidos();
  window.location.reload(); 
}

function restablecerFixture() {
  // ESTO BORRA ABSOLUTAMENTE TODO: Fixture, Estadísticas, Prode, TODO.
  localStorage.clear();
  window.location.reload(); 
}

export function renderFixture() {
  const contenedor = document.getElementById('contenedor-fixture');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  const barraAcciones = document.createElement('div');
  barraAcciones.className = 'fixture-acciones';
  barraAcciones.style.marginBottom = '15px';
  barraAcciones.innerHTML = `
    <button id="btn-restablecer-fixture" class="boton boton--peligro" style="margin-right: 10px;">🔄 Restablecer Fixture</button>
    <button id="btn-aleatorio-fixture" class="boton boton--primario">🎲 Resultados Aleatorios</button>
  `;
  contenedor.appendChild(barraAcciones);

  document.getElementById('btn-restablecer-fixture').addEventListener('click', restablecerFixture);
  document.getElementById('btn-aleatorio-fixture').addEventListener('click', simularResultados);

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

  const lista = document.createElement('div');
  lista.className = 'fixture-lista__items';

  const filtrados = partidos.filter(p => {
    const mG = !grupoActivo || p.grupo === grupoActivo;
    const mE = estadoActivo === 'todos' || p.estado === estadoActivo;
    return mG && mE;
  });

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
      card.innerHTML = `
        <div class="partido-card__equipo">
          <img class="partido-card__escudo" src="${local.escudo}" alt="" loading="lazy" />
          <span>${local.nombre}</span>
        </div>
        <div class="partido-card__marcador ${jugado ? '' : 'partido-card__marcador--pendiente'}">
          ${jugado ? `${partido.golesLocal} – ${partido.golesVisitante}` : 'VS'}
        </div>
        <div class="partido-card__equipo partido-card__equipo--visitante">
          <img class="partido-card__escudo" src="${visitante.escudo}" alt="" loading="lazy" />
          <span>${visitante.nombre}</span>
        </div>
      `;
      
      if (!jugado) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => abrirFormInline(partido, local, visitante));
      }

      lista.appendChild(card);
    });
  });

  contenedor.appendChild(lista);
}

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

  form.elements['golesLocal'].value     = partido.golesLocal ?? '';
  form.elements['golesVisitante'].value = partido.golesVisitante ?? '';
  form.elements['goleadores'].value     = (partido.goleadores || []).join(', ');
  form.elements['asistidores'].value    = (partido.asistidores || []).join(', ');

  overlay.removeAttribute('hidden');

  form.onsubmit = function(e) {
    e.preventDefault();
    const gl = parseInt(form.elements['golesLocal'].value, 10);
    const gv = parseInt(form.elements['golesVisitante'].value, 10);
    
    const golStr = form.elements['goleadores']?.value || '';
    const asisStr = form.elements['asistidores']?.value || '';
    
    const idx = partidos.findIndex(p => p.id === partido.id);
    if(idx !== -1) {
      partidos[idx].golesLocal = gl;
      partidos[idx].golesVisitante = gv;
      partidos[idx].estado = 'jugado';
      partidos[idx].goleadores = golStr ? golStr.split(',').map(s=>s.trim()) : [];
      partidos[idx].asistidores = asisStr ? asisStr.split(',').map(s=>s.trim()) : [];
      
      guardarPartidos();  
      window.location.reload(); 
    }
  };

  document.getElementById('cerrar-form-inline')?.addEventListener('click', cerrarFormInline, { once: true });
  overlay.addEventListener('click', e => { if (e.target === overlay) cerrarFormInline(); }, { once: true });
}

export function cerrarFormInline() {
  const overlay = document.getElementById('form-inline-overlay');
  if (overlay) overlay.setAttribute('hidden', '');
}