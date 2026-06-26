import { COLORES_POS, obtenerFormacion } from "../data/formaciones.js";
import { generarPlantel } from "../data/jugadores.js";
import { EQUIPOS_MAP } from "../data/equipos.js";

const ROW_TO_Y = { 1: 8, 2: 25, 3: 50, 4: 74, 5: 92 };

export function renderizarFormacion(equipoId) {
  if (!equipoId) return "";
  const formacion = obtenerFormacion(equipoId);
  const plantelCompleto = generarPlantel(equipoId, formacion);
  const titulares = plantelCompleto.filter(j => j.titular);
  const equipo = EQUIPOS_MAP[equipoId];
  const nombreEquipo = equipo?.nombre || equipoId;

  return `
    <div class="formacion-wrapper">
      <div class="formacion-header">
        <span class="formacion-label">${formacion.label}</span>
        <span class="formacion-equipo-nombre">${nombreEquipo}</span>
      </div>
      <div class="formacion-cancha">
        <div class="cancha-area-grande cancha-superior"></div>
        <div class="cancha-area-chica cancha-superior"></div>
        <div class="cancha-medio"></div>
        <div class="cancha-circulo"></div>
        <div class="cancha-area-chica cancha-inferior"></div>
        <div class="cancha-area-grande cancha-inferior"></div>

        ${titulares.map((p, i) => {
          const pos = formacion.posiciones[i];
          const y = ROW_TO_Y[pos.row];
          const col = COLORES_POS[pos.key] || { bg: "#999", text: "#fff" };
          return `
            <div class="formacion-jugador" style="left:${pos.x}%;top:${y}%">
              <div class="fj-circulo" style="background:${col.bg};color:${col.text}">
                <span class="fj-dorsal">${p.dorsal}</span>
              </div>
              <span class="fj-pos">${pos.key}</span>
              <span class="fj-nombre">${p.nombreCompleto.split(" ")[0]}</span>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}
