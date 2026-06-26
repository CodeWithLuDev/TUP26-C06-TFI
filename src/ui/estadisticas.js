import { EQUIPOS_MAP } from "../data/equipos.js";
import { calcularGoleadores, calcularAsistidores, calcularTarjetas } from "../logic/estadisticas.js";
import { store } from "../store.js";

export function renderizarEstadisticas(contenedor, partidosMap) {
  const goleadores = calcularGoleadores(partidosMap, EQUIPOS_MAP);
  const asistidores = calcularAsistidores(partidosMap, EQUIPOS_MAP);
  const { jugadores: tarjetasJugadores, equipos: tarjetasEquipos } = calcularTarjetas(partidosMap, EQUIPOS_MAP);
  const { predicciones } = store.getState();

  const totalPuntos = Object.entries(predicciones || {}).reduce((sum, [pid, pred]) => {
    const res = partidosMap[pid]?.resultado;
    if (!res) return sum;
    const pg = pred.localGoles, pv = pred.visitanteGoles;
    const rg = res.golesLocal, rv = res.golesVisitante;
    if (pg === rg && pv === rv) return sum + 5;
    if (pg - pv === rg - rv) return sum + 4;
    if (Math.sign(pg - pv) === Math.sign(rg - rv)) return sum + 3;
    return sum;
  }, 0);

  const aciertos = Object.entries(predicciones || {}).filter(([pid, pred]) => {
    const res = partidosMap[pid]?.resultado;
    return res && pred.localGoles === res.golesLocal && pred.visitanteGoles === res.golesVisitante;
  }).length;

  const totalPredichos = Object.entries(predicciones || {}).filter(([pid]) => {
    return partidosMap[pid]?.resultado;
  }).length;

  contenedor.innerHTML = `
    <div class="stats-grid">
      <div class="stats-seccion">
        <h3> Tus predicciones</h3>
        ${totalPredichos === 0
          ? '<p class="stats-vacio">No hay predicciones evaluadas todavía.</p>'
          : `
            <div class="pred-resumen">
              <div class="pred-stat">
                <span class="pred-stat-valor">${totalPuntos}</span>
                <span class="pred-stat-label">Puntos totales</span>
              </div>
              <div class="pred-stat">
                <span class="pred-stat-valor">${aciertos}/${totalPredichos}</span>
                <span class="pred-stat-label">Aciertos</span>
              </div>
              <div class="pred-stat">
                <span class="pred-stat-valor">${totalPredichos > 0 ? Math.round(aciertos/totalPredichos*100) : 0}%</span>
                <span class="pred-stat-label">Precisión</span>
              </div>
            </div>
          `}
      </div>
      <div class="stats-seccion">
        <h3>Goleadores</h3>
        ${goleadores.length === 0
          ? '<p class="stats-vacio">No hay goles cargados todavía.</p>'
          : renderizarRanking(goleadores, "goles")}
      </div>
      <div class="stats-seccion">
        <h3>Asistidores</h3>
        ${asistidores.length === 0
          ? '<p class="stats-vacio">No hay asistencias cargadas todavía.</p>'
          : renderizarRanking(asistidores, "asistencias")}
      </div>
      <div class="stats-seccion">
        <h3>Tarjetas - Jugadores</h3>
        ${tarjetasJugadores.length === 0
          ? '<p class="stats-vacio">No hay tarjetas cargadas todavía.</p>'
          : renderizarTarjetasJugadores(tarjetasJugadores)}
      </div>
      <div class="stats-seccion">
        <h3>Tarjetas - Equipos</h3>
        ${tarjetasEquipos.length === 0
          ? '<p class="stats-vacio">No hay tarjetas cargadas todavía.</p>'
          : renderizarTarjetasEquipos(tarjetasEquipos)}
      </div>
    </div>
  `;
}

function renderizarRanking(lista, campo) {
  return `<ol class="ranking-lista">
    ${lista.map((item, i) => `
      <li class="ranking-fila">
        <span class="ranking-pos">${i + 1}</span>
        <span class="ranking-bandera"><img src="img/${item.equipoBandera || ""}" class="bandera-img" alt=""></span>
        <span class="ranking-info">
          <span class="ranking-jugador">${item.jugadorNombre}</span>
          <span class="ranking-equipo">${item.equipoNombre || ""}</span>
        </span>
        <span class="ranking-valor">${item[campo]}</span>
      </li>
    `).join("")}
  </ol>`;
}

function renderizarTarjetasJugadores(lista) {
  return `<ol class="ranking-lista">
    ${lista.map((item, i) => `
      <li class="ranking-fila">
        <span class="ranking-pos">${i + 1}</span>
        <span class="ranking-bandera"><img src="img/${item.equipoBandera || ""}" class="bandera-img" alt=""></span>
        <span class="ranking-info">
          <span class="ranking-jugador">${item.jugadorNombre}</span>
          <span class="ranking-equipo">${item.equipoNombre || ""}</span>
        </span>
        <span class="tarjetas-badge">
          ${item.amarillas > 0 ? `<span class="badge-amarilla">${item.amarillas} 🟨</span>` : ""}
          ${item.rojas > 0 ? `<span class="badge-roja">${item.rojas} 🟥</span>` : ""}
        </span>
      </li>
    `).join("")}
  </ol>`;
}

function renderizarTarjetasEquipos(lista) {
  const ordenado = lista.sort((a, b) => (b.rojas + b.amarillas) - (a.rojas + a.amarillas));
  return `<ol class="ranking-lista">
    ${ordenado.map((item, i) => `
      <li class="ranking-fila">
        <span class="ranking-pos">${i + 1}</span>
        <span class="ranking-bandera"><img src="img/${item.equipoBandera || ""}" class="bandera-img" alt=""></span>
        <span class="ranking-info">
          <span class="ranking-jugador">${item.equipoNombre}</span>
          <span class="ranking-equipo">Total</span>
        </span>
        <span class="tarjetas-badge">
          ${item.amarillas > 0 ? `<span class="badge-amarilla">${item.amarillas} 🟨</span>` : ""}
          ${item.rojas > 0 ? `<span class="badge-roja">${item.rojas} 🟥</span>` : ""}
        </span>
      </li>
    `).join("")}
  </ol>`;
}
