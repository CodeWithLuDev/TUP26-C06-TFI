import { EQUIPOS_MAP } from "../data/equipos.js";
import { construirBracket, obtenerGanador } from "../logic/playoffs.js";
import { formatearFechaHora, esPartidoEnVivo } from "./grupos.js";

const FASES_ORDEN = ["r32", "r16", "qf", "sf", "final"];
const FASES_LABELS = {
  r32: "32avos de Final",
  r16: "Octavos de Final",
  qf:  "Cuartos de Final",
  sf:  "Semifinales",
  final: "Final",
};

export function renderizarBracket(contenedor, partidosMap) {
  const bracket = construirBracket(partidosMap);
  const porFase = {};
  for (const fase of FASES_ORDEN) {
    porFase[fase] = Object.values(bracket).filter(p => p.fase === fase);
  }
  const tercero = bracket["M103"];

  contenedor.innerHTML = `
    <div class="bracket-container">
      ${FASES_ORDEN.map(fase => renderizarColumnaFase(fase, porFase[fase])).join("")}
    </div>
    <div class="tercer-puesto">
      <h3>Tercer Puesto</h3>
      ${renderizarTarjetaPartido(tercero)}
    </div>
  `;
}

function renderizarColumnaFase(fase, partidos) {
  return `
    <div class="bracket-fase" data-fase="${fase}">
      <h3 class="fase-titulo">${FASES_LABELS[fase]}</h3>
      <div class="bracket-partidos">
        ${(partidos || []).map(p => renderizarTarjetaPartido(p)).join("")}
      </div>
    </div>
  `;
}

function renderizarTarjetaPartido(partido) {
  if (!partido) return '<div class="bracket-partido vacio">Por definir</div>';
  const local     = partido.localId     ? EQUIPOS_MAP[partido.localId]     : null;
  const visitante = partido.visitanteId ? EQUIPOS_MAP[partido.visitanteId] : null;
  const ganadorId = obtenerGanador(partido);
  const fecha     = partido.fechaHora ? formatearFechaHora(partido.fechaHora) : "";

  const renderEquipo = (equipo, id, esLocal) => {
    if (!equipo) return '<div class="bracket-equipo indefinido">Por clasificar</div>';
    const esGanador  = ganadorId === id;
    const esPerdedor = ganadorId && ganadorId !== id;
    const goles = partido.resultado
      ? (esLocal ? partido.resultado.golesLocal : partido.resultado.golesVisitante)
      : "";
    return `
      <div class="bracket-equipo ${esGanador ? "ganador" : ""} ${esPerdedor ? "perdedor" : ""}">
        <span class="bracket-bandera"><img src="img/${equipo.bandera}" class="bandera-img" alt="${equipo.nombre}"></span>
        <span class="bracket-nombre">${equipo.nombre}</span>
        <span class="bracket-goles">${goles !== "" ? goles : ""}</span>
      </div>
    `;
  };

  const definidoPorLabel = partido.resultado?.definidoPor && partido.resultado.definidoPor !== "normal"
    ? `<div class="definido-por">(${partido.resultado.definidoPor === "penales" ? "Penales" : "Prórroga"})</div>`
    : "";

  const enVivo = esPartidoEnVivo(partido);

  return `
    <div class="bracket-partido ${partido.resultado ? "jugado" : (enVivo ? "en-vivo" : "pendiente")}"
         data-partido-id="${partido.id}">
      <div class="bracket-fecha">${fecha}${enVivo ? ' <span class="vivo-badge">EN VIVO</span>' : ""}</div>
      ${renderEquipo(local, partido.localId, true)}
      <div class="bracket-vs">vs</div>
      ${renderEquipo(visitante, partido.visitanteId, false)}
      ${definidoPorLabel}
    </div>
  `;
}
