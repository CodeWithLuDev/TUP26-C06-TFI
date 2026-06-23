/**
 * Simula aleatoriamente todos los partidos pendientes,
 * recalcula posiciones y arma el bracket hasta el campeón.
 */
import { partidos }            from '../data/partidos.js';
import { equipos }             from '../data/equipos.js';
import { calcularPosiciones, ordenarTabla } from '../logic/posiciones.js';
import { renderFixture }       from './fixture.js';
import { renderGrupos }        from './grupos.js';
import { renderEstadisticas }  from './renderEstadisticas.js';
import { renderProde }         from './prode.js';
import { guardarBracket, bracketInicial } from '../logic/playoffs.js';
import { renderBracket }       from './bracket.js';
import { mostrarBannerCampeon } from './campeon.js';
import { poblarSelectPartidos } from './scoreForm.js';

// ── Helpers ───────────────────────────────────────────────────

function golesAleatorios() {
  // Distribución realista: mayoría de partidos 0-3 goles por equipo
  const pesos = [0,0,0,1,1,1,1,2,2,2,2,3,3,3,4,4,5];
  const gl = pesos[Math.floor(Math.random() * pesos.length)];
  const gv = pesos[Math.floor(Math.random() * pesos.length)];
  return { gl, gv };
}

function simularFaseGrupos() {
  partidos.forEach(p => {
    if (p.estado !== 'pendiente') return;
    const { gl, gv } = golesAleatorios();
    p.estado         = 'jugado';
    p.golesLocal     = gl;
    p.golesVisitante = gv;
    p.goleadores     = [];
    p.asistidores    = [];
  });
}

function obtenerClasificados() {
  const grupos = [...new Set(equipos.map(e => e.grupo))].sort();
  const primeros  = [];
  const segundos  = [];
  const terceros  = [];

  grupos.forEach(grupo => {
    const equiposGrupo  = equipos.filter(e => e.grupo === grupo);
    const partidosGrupo = partidos.filter(p => p.grupo === grupo);
    const tabla = ordenarTabla(calcularPosiciones(partidosGrupo, equiposGrupo));

    if (tabla[0]) primeros.push({ ...tabla[0], grupo });
    if (tabla[1]) segundos.push({ ...tabla[1], grupo });
    if (tabla[2]) terceros.push({ ...tabla[2], grupo });
  });

  // 8 mejores terceros por pts → dg → gf
  const mejoresTerceros = terceros
    .sort((a,b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf)
    .slice(0, 8);

  return { primeros, segundos, mejoresTerceros };
}

function armarEquipo(obj) {
  return {
    id:     obj?.id     ?? null,
    nombre: obj?.nombre ?? 'Por definir',
    escudo: obj?.escudo ?? null,
  };
}

function simularCruce(local, visitante) {
  let { gl, gv } = golesAleatorios();
  // En eliminatorias no puede haber empate
  while (gl === gv) { const r = golesAleatorios(); gl = r.gl; gv = r.gv; }
  return {
    local:         armarEquipo(local),
    visitante:     armarEquipo(visitante),
    golesLocal:    gl,
    golesVisitante: gv,
    estado:        'jugado',
  };
}

function ganadorDeCruce(cruce) {
  return cruce.golesLocal > cruce.golesVisitante ? cruce.local : cruce.visitante;
}

function simularRonda(cruces) {
  const simulados = cruces.map(c => {
    if (c.estado === 'jugado') return c;
    return simularCruce(c.local, c.visitante);
  });
  return simulados;
}

function armarSiguienteRonda(crucesSimulados) {
  const ganadores = crucesSimulados.map(ganadorDeCruce);
  const cruces = [];
  for (let i = 0; i < ganadores.length; i += 2) {
    cruces.push(simularCruce(ganadores[i], ganadores[i+1]));
  }
  return cruces;
}

// ── Función principal ─────────────────────────────────────────

export function simularRestoDelMundial() {
  const confirmado = window.confirm(
    '⚽ ¿Simular aleatoriamente todos los partidos pendientes hasta el campeón?'
  );
  if (!confirmado) return;

  // 1. Simular fase de grupos
  simularFaseGrupos();

  // 2. Obtener clasificados
  const { primeros, segundos, mejoresTerceros } = obtenerClasificados();

  // 3. Armar Dieciseisavos (16 cruces)
  // Cruce: 1°A vs 2°B, 1°C vs 2°D, etc. + 8 mejores terceros
  const dieciseisavos = [];
  const grupos = [...new Set(equipos.map(e => e.grupo))].sort();

  for (let i = 0; i < grupos.length; i += 2) {
    const g1 = grupos[i];
    const g2 = grupos[i+1];
    const p1 = primeros.find(e => e.grupo === g1);
    const p2 = primeros.find(e => e.grupo === g2);
    const s1 = segundos.find(e => e.grupo === g1);
    const s2 = segundos.find(e => e.grupo === g2);
    dieciseisavos.push(simularCruce(p1, s2));
    dieciseisavos.push(simularCruce(p2, s1));
  }
  // Completar con mejores terceros si faltan cruces
  let idx = 0;
  while (dieciseisavos.length < 16) {
    dieciseisavos.push(simularCruce(mejoresTerceros[idx] ?? null, null));
    idx++;
  }

  // 4. Simular rondas sucesivas
  const octavos   = armarSiguienteRonda(dieciseisavos); // 8 cruces
  const cuartos   = armarSiguienteRonda(octavos);       // 4 cruces
  const semis     = armarSiguienteRonda(cuartos);       // 2 cruces

  // 3er puesto: perdedores de semis
  const perdedorSemi1 = semis[0].golesLocal > semis[0].golesVisitante
    ? semis[0].visitante : semis[0].local;
  const perdedorSemi2 = semis[1].golesLocal > semis[1].golesVisitante
    ? semis[1].visitante : semis[1].local;
  const tercerPuesto = [simularCruce(perdedorSemi1, perdedorSemi2)];

  const final = armarSiguienteRonda(semis); // 1 cruce

  // 5. Construir bracket completo
  const bracket = {
    Octavos:      dieciseisavos,
    Cuartos:      octavos,
    Semis:        cuartos,
    Final:        semis,
    tercerPuesto,
  };

  guardarBracket(bracket);

  // 6. Actualizar todas las vistas
  renderFixture();
  renderGrupos();
  renderEstadisticas();
  renderProde();
  renderBracket();
  poblarSelectPartidos();

  // 7. Mostrar campeón
  const cruceFinal  = final[0];
  const campeon     = ganadorDeCruce(cruceFinal);
  mostrarBannerCampeon(campeon);
}

// ── Init del botón ────────────────────────────────────────────
export function initSimulador() {
  const btn = document.getElementById('btn-simular');
  if (!btn) return;
  btn.addEventListener('click', simularRestoDelMundial);
}