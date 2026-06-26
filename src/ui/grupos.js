/**
 * grupos.js
 * Renderizado reactivo de la fase de grupos: tablas de posiciones y partidos.
 */

import { EQUIPOS, EQUIPOS_MAP, GRUPOS } from "../data/equipos.js";
import { ordenarTabla } from "../logic/posiciones.js";

export function renderizarGrupos(contenedor, partidosMap) {
  contenedor.innerHTML = GRUPOS.map(letra =>
    renderizarGrupo(letra, partidosMap)
  ).join("");
}

function renderizarGrupo(letra, partidosMap) {
  const equiposGrupo = EQUIPOS
    .filter(e => e.grupo === letra)
    .map(e => e.id);

  const partidos = Object.values(partidosMap)
    .filter(p => p.grupo === letra)
    .sort((a, b) => a.ronda - b.ronda);

  const tabla = ordenarTabla(equiposGrupo, partidos);

  return `
    <div class="grupo-card" id="grupo-${letra}">
      <h2 class="grupo-titulo">Grupo ${letra}</h2>
      <table class="tabla-posiciones">
        <thead>
          <tr>
            <th>#</th>
            <th class="col-equipo">Equipo</th>
            <th title="Partidos Jugados">PJ</th>
            <th title="Ganados">PG</th>
            <th title="Empatados">PE</th>
            <th title="Perdidos">PP</th>
            <th title="Goles a Favor">GF</th>
            <th title="Goles en Contra">GC</th>
            <th title="Diferencia de Goles">DG</th>
            <th title="Puntos" class="col-pts">PTS</th>
          </tr>
        </thead>
        <tbody>
          ${tabla.map((stats, i) => renderizarFilaTabla(stats, i)).join("")}
        </tbody>
      </table>
      ${renderizarUltimosPartidos(equiposGrupo, partidosMap)}
      <div class="partidos-grupo">
        ${partidos.map(p => renderizarPartidoGrupo(p)).join("")}
      </div>
    </div>
  `;
}

function renderizarUltimosPartidos(equiposIds, partidosMap) {
  const total = Object.values(partidosMap);
  return `<div class="ultimos-partidos">
    <h3 class="ultimos-titulo">Últimos 5 resultados</h3>
    ${equiposIds.map(id => {
      const eq = EQUIPOS_MAP[id];
      const partidosEquipo = total
        .filter(p => p.resultado && (p.localId === id || p.visitanteId === id))
        .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))
        .slice(0, 5);
      if (partidosEquipo.length === 0) return "";
      return `
        <div class="ultimos-fila">
          <span class="ultimos-equipo">
            <img src="img/${eq?.bandera || ""}" class="bandera-img" alt=""> ${eq?.nombre || id}
          </span>
          <span class="ultimos-bolitas">
            ${partidosEquipo.map(p => {
              const r = p.resultado;
              const golesFiltrados = r.goles.filter(g => g.equipoId === p.localId && !g.esPenal).length;
              const golesFiltradosV = r.goles.filter(g => g.equipoId === p.visitanteId && !g.esPenal).length;
              // Si hay goles detallados, usar filtrados (sin penales); si no, usar totales
              const gLocal = r.goles.length > 0 ? golesFiltrados : r.golesLocal;
              const gVisit = r.goles.length > 0 ? golesFiltradosV : r.golesVisitante;
              const golesEq = id === p.localId ? gLocal : gVisit;
              const golesContra = id === p.localId ? gVisit : gLocal;
              const ganado = golesEq > golesContra;
              const perdido = golesEq < golesContra;
              const empate = golesEq === golesContra;
              return `<span class="ultimo-bolita ${ganado ? "ganado" : perdido ? "perdido" : "empate"}" title="${p.localId} ${r.golesLocal}-${r.golesVisitante} ${p.visitanteId}">${golesEq}-${golesContra}</span>`;
            }).join("")}
          </span>
        </div>
      `;
    }).join("")}
  </div>`;
}

function renderizarFilaTabla(stats, posicion) {
  const equipo = EQUIPOS_MAP[stats.equipoId];
  const esPrimero  = posicion === 0;
  const esSegundo  = posicion === 1;
  const claseFilas = esPrimero ? "clasifica primero" : esSegundo ? "clasifica segundo" : "";
  const dg = stats.dg >= 0 ? "+" + stats.dg : "" + stats.dg;

  return `
    <tr class="${claseFilas}" data-equipo="${stats.equipoId}">
      <td class="col-pos">${posicion + 1}</td>
      <td class="col-equipo">
        <img src="img/${equipo?.bandera || ""}" class="bandera-img" alt="${equipo?.nombre || ""}">
        <span class="nombre-equipo">${equipo?.nombre || stats.equipoId}</span>
      </td>
      <td>${stats.pj}</td>
      <td>${stats.pg}</td>
      <td>${stats.pe}</td>
      <td>${stats.pp}</td>
      <td>${stats.gf}</td>
      <td>${stats.gc}</td>
      <td>${dg}</td>
      <td class="col-pts"><strong>${stats.pts}</strong></td>
    </tr>
  `;
}

function renderizarPartidoGrupo(partido) {
  const local     = EQUIPOS_MAP[partido.localId];
  const visitante = EQUIPOS_MAP[partido.visitanteId];
  const fecha     = formatearFechaHora(partido.fechaHora);
  const resultado = partido.resultado;
  const enVivo    = esPartidoEnVivo(partido);

  return `
    <div class="partido-fila ${resultado ? "jugado" : (enVivo ? "en-vivo" : "pendiente")}"
         data-partido-id="${partido.id}">
      <div class="partido-fecha">${fecha} ${enVivo ? '<span class="vivo-badge">EN VIVO</span>' : ""}</div>
      <div class="partido-equipos">
        <span class="equipo-local">
          <img src="img/${local?.bandera || ""}" class="bandera-img" alt=""> ${local?.nombre || partido.localId}
        </span>
        <span class="marcador ${resultado ? "con-resultado" : ""}">
          ${resultado
            ? resultado.golesLocal + " \u2013 " + resultado.golesVisitante
            : "vs"}
        </span>
        <span class="equipo-visitante">
          ${visitante?.nombre || partido.visitanteId} <img src="img/${visitante?.bandera || ""}" class="bandera-img" alt="">
        </span>
      </div>
      <div class="partido-estadio">${partido.estadio}</div>
    </div>
  `;
}

/**
 * Formatea una fecha ISO a hora de Argentina (UTC‑3).
 */
export function formatearFechaHora(isoString) {
  const fecha = new Date(isoString);
  return fecha.toLocaleString("es-AR", {
    weekday: "short",
    day:     "numeric",
    month:   "short",
    hour:    "2-digit",
    minute:  "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
    timeZoneName: "short",
  });
}

export function esPartidoEnVivo(partido) {
  if (!partido?.fechaHora || partido.resultado) return false;
  const ahora      = Date.now();
  const inicio     = new Date(partido.fechaHora).getTime();
  const duracion   = 105 * 60 * 1000; // 90 min + 15 descanso
  return ahora >= inicio && ahora <= inicio + duracion;
}
