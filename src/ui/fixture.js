import { EQUIPOS_MAP } from "../data/equipos.js";
import { ESTADIOS } from "../data/estadios.js";
import { store } from "../store.js";
import { generarJugadorId } from "../logic/estadisticas.js";
import { formatearFechaHora, esPartidoEnVivo } from "./grupos.js";
import { construirBracket } from "../logic/playoffs.js";
import { renderizarFormacion } from "./formacion.js";

let partidoSeleccionadoId = null;

export function renderizarFixture(contenedor, partidosMap) {
  const bracket = construirBracket(partidosMap);
  const todosLosPartidos = { ...partidosMap };
  for (const [id, p] of Object.entries(bracket)) {
    if (todosLosPartidos[id]) {
      todosLosPartidos[id] = { ...todosLosPartidos[id], ...p };
    }
  }

  const fases = ["grupos", "r32", "r16", "qf", "sf", "final", "tercero"];
  const fasesConPartidos = fases.filter(f =>
    Object.values(todosLosPartidos).some(p => p.fase === f)
  );

  contenedor.innerHTML = `
    <div class="fixture-layout">
      <div class="fixture-lista">
        ${fasesConPartidos.map(fase =>
          renderizarSeccionFase(fase, todosLosPartidos)
        ).join("")}
      </div>
      <div class="fixture-panel" id="panel-resultado">
        <div class="panel-placeholder">
          Seleccioná un partido para cargar o editar su resultado
        </div>
      </div>
    </div>
  `;

  if (partidoSeleccionadoId && todosLosPartidos[partidoSeleccionadoId]) {
    abrirPanelResultado(todosLosPartidos[partidoSeleccionadoId]);
  }

  contenedor.querySelectorAll(".fixture-partido").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.partidoId;
      const partido = todosLosPartidos[id];
      if (!partido) return;
      if (!partido.localId || !partido.visitanteId) {
        mostrarMensajePanel("Este partido aún no tiene equipos asignados (esperando clasificados).");
        return;
      }
      partidoSeleccionadoId = id;
      contenedor.querySelectorAll(".fixture-partido").forEach(e => e.classList.remove("activo"));
      el.classList.add("activo");
      abrirPanelResultado(partido);
    });
  });
}

const FASE_LABELS = {
  grupos: "Fase de Grupos",
  r32: "32avos de Final",
  r16: "Octavos de Final",
  qf: "Cuartos de Final",
  sf: "Semifinales",
  final: "Final",
  tercero: "Tercer Puesto",
};

function renderizarSeccionFase(fase, partidosMap) {
  const partidos = Object.values(partidosMap)
    .filter(p => p.fase === fase)
    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

  return `
    <div class="fixture-seccion">
      <h3 class="fixture-fase-titulo">${FASE_LABELS[fase] || fase}</h3>
      ${partidos.map(p => renderizarFilaPartido(p)).join("")}
    </div>
  `;
}

function renderizarFilaPartido(partido) {
  const local     = partido.localId     ? EQUIPOS_MAP[partido.localId]     : null;
  const visitante = partido.visitanteId ? EQUIPOS_MAP[partido.visitanteId] : null;
  const fecha     = partido.fechaHora ? formatearFechaHora(partido.fechaHora) : "Fecha por confirmar";
  const r         = partido.resultado;
  const sinEquipos = !partido.localId || !partido.visitanteId;

  const nombreLocal     = local?.nombre     || partido.localId     || "Por clasificar";
  const nombreVisitante = visitante?.nombre || partido.visitanteId || "Por clasificar";
  const bandLocal     = local?.bandera     ? `<img src="img/${local.bandera}" class="bandera-img" alt="">` : "";
  const bandVisitante = visitante?.bandera ? `<img src="img/${visitante.bandera}" class="bandera-img" alt="">` : "";

  const enVivo = esPartidoEnVivo(partido);

  return `
    <div class="fixture-partido ${r ? "jugado" : (enVivo ? "en-vivo" : "pendiente")} ${sinEquipos ? "sin-equipos" : ""}"
         data-partido-id="${partido.id}">
      <span class="fp-fecha">${fecha}</span>
      <span class="fp-equipos">
        ${bandLocal} ${nombreLocal}
        <strong class="fp-marcador">${r ? r.golesLocal + " – " + r.golesVisitante : "vs"}</strong>
        ${nombreVisitante} ${bandVisitante}
      </span>
      ${r ? '<span class="fp-estado jugado-badge">✓</span>'
        : enVivo ? '<span class="fp-estado vivo-badge">EN VIVO</span>'
        : '<span class="fp-estado pendiente-badge">•</span>'}
    </div>
  `;
}

function abrirPanelResultado(partido) {
  const panel = document.getElementById("panel-resultado");
  if (!panel) return;
  const r = partido.resultado;
  const local     = EQUIPOS_MAP[partido.localId];
  const visitante = EQUIPOS_MAP[partido.visitanteId];
  const esPlayoff = partido.fase !== "grupos";

  panel.innerHTML = `
    <div class="panel-header">
      <h3>Cargar Resultado</h3>
      <div class="panel-partido-info">
        <img src="img/${local?.bandera || ""}" class="bandera-img" alt=""> ${local?.nombre || partido.localId}
        vs
        ${visitante?.nombre || partido.visitanteId} <img src="img/${visitante?.bandera || ""}" class="bandera-img" alt="">
      </div>
      <div class="panel-fecha">${partido.fechaHora ? formatearFechaHora(partido.fechaHora) : ""}</div>
    </div>

    ${renderizarEstadio(partido.estadio)}

    ${renderizarAlineaciones(partido)}

    ${renderizarPrediccion(partido, r)}

    <div class="panel-marcador">
      <div class="marcador-equipo">
        <label>${local?.nombre || "Local"}</label>
        <input type="number" id="goles-local" min="0" max="30"
               value="${r ? r.golesLocal : 0}" class="input-goles">
      </div>
      <div class="marcador-separador">–</div>
      <div class="marcador-equipo">
        <label>${visitante?.nombre || "Visitante"}</label>
        <input type="number" id="goles-visitante" min="0" max="30"
               value="${r ? r.golesVisitante : 0}" class="input-goles">
      </div>
    </div>

    ${esPlayoff ? `
      <div class="panel-definicion">
        <label>Definición:</label>
        <select id="definido-por">
          <option value="normal"    ${(!r || r.definidoPor === "normal")    ? "selected" : ""}>90 minutos</option>
          <option value="extratime" ${r?.definidoPor === "extratime" ? "selected" : ""}>Tiempo extra</option>
          <option value="penales"   ${r?.definidoPor === "penales"   ? "selected" : ""}>Penales</option>
        </select>
      </div>
    ` : ""}

    <div class="panel-goles-seccion">
      <div class="panel-goles-header">
        <span>Detalle de goles</span>
        <button class="btn-agregar-gol" id="btn-add-gol">+ Agregar gol</button>
      </div>
      <div id="lista-goles">
        ${(r?.goles || []).map((g, i) => renderizarFormGol(g, i, partido)).join("")}
      </div>
    </div>

    <div class="panel-tarjetas">
      <div class="panel-tarjetas-header">
        <span>🟨 Tarjetas</span>
        <button class="btn-agregar-tarjeta" id="btn-add-tarjeta">+ Agregar tarjeta</button>
      </div>
      <div id="lista-tarjetas">
        ${(r?.tarjetasLista || []).map((t, i) => renderizarFormTarjeta(t, i, partido)).join("")}
      </div>
    </div>

    <div class="panel-acciones">
      <button class="btn-confirmar" id="btn-confirmar">✓ Confirmar resultado</button>
      ${r ? '<button class="btn-borrar" id="btn-borrar">✕ Borrar resultado</button>' : ""}
    </div>
  `;

  let golesTemp = r ? [...r.goles] : [];
  let tarjetasTemp = r ? [...(r.tarjetasLista || [])] : [];

  const renderLista = () => {
    document.getElementById("lista-goles").innerHTML =
      golesTemp.map((g, i) => renderizarFormGol(g, i, partido)).join("");
  attachGolListeners();
  attachTarjetaListeners();
  };

  const renderListaTarjetas = () => {
    document.getElementById("lista-tarjetas").innerHTML =
      tarjetasTemp.map((t, i) => renderizarFormTarjeta(t, i, partido)).join("");
    attachTarjetaListeners();
  };

  const attachGolListeners = () => {
    panel.querySelectorAll(".gol-item").forEach((el, i) => {
      el.querySelector(".gol-equipo")?.addEventListener("change", e => {
        golesTemp[i] = { ...golesTemp[i], equipoId: e.target.value };
      });
      el.querySelector(".gol-jugador")?.addEventListener("input", e => {
        const nombre = e.target.value;
        golesTemp[i] = {
          ...golesTemp[i],
          jugadorNombre: nombre,
          jugadorId: generarJugadorId(nombre, golesTemp[i].equipoId || partido.localId),
        };
      });
      el.querySelector(".gol-minuto")?.addEventListener("input", e => {
        golesTemp[i] = { ...golesTemp[i], minuto: Number(e.target.value) };
      });
      el.querySelector(".gol-asistencia")?.addEventListener("input", e => {
        const nombre = e.target.value;
        golesTemp[i] = {
          ...golesTemp[i],
          asistenciaJugadorNombre: nombre,
          asistenciaJugadorId: nombre
            ? generarJugadorId(nombre, golesTemp[i].equipoId || partido.localId)
            : null,
        };
      });
      el.querySelector(".btn-eliminar-gol")?.addEventListener("click", () => {
        golesTemp.splice(i, 1);
        renderLista();
      });
    });
  };

  const attachTarjetaListeners = () => {
    panel.querySelectorAll(".tarjeta-item").forEach((el, i) => {
      el.querySelector(".tarjeta-equipo")?.addEventListener("change", e => {
        tarjetasTemp[i] = { ...tarjetasTemp[i], equipoId: e.target.value };
      });
      el.querySelector(".tarjeta-jugador")?.addEventListener("input", e => {
        tarjetasTemp[i] = { ...tarjetasTemp[i], jugadorNombre: e.target.value };
      });
      el.querySelector(".tarjeta-tipo")?.addEventListener("change", e => {
        tarjetasTemp[i] = { ...tarjetasTemp[i], tipo: e.target.value };
      });
      el.querySelector(".tarjeta-minuto")?.addEventListener("input", e => {
        tarjetasTemp[i] = { ...tarjetasTemp[i], minuto: Number(e.target.value) };
      });
      el.querySelector(".btn-eliminar-tarjeta")?.addEventListener("click", () => {
        tarjetasTemp.splice(i, 1);
        renderListaTarjetas();
      });
    });
  };

  attachGolListeners();

  // Click para expandir/colapsar info del estadio
  const estCard = panel.querySelector(".panel-estadio");
  if (estCard) {
    estCard.addEventListener("click", (e) => {
      e.stopPropagation();
      const detalles = estCard.querySelector(".estadio-detalles");
      const hint = estCard.querySelector(".estadio-expand-hint");
      if (detalles) {
        const abierto = !detalles.classList.contains("oculto");
        detalles.classList.toggle("oculto");
        hint.textContent = abierto ? "▼ Ver más" : "▲ Ver menos";
        estCard.classList.toggle("expandido", !abierto);
      }
    });
  }

  document.getElementById("btn-add-gol")?.addEventListener("click", () => {
    golesTemp.push({
      jugadorId: "",
      jugadorNombre: "",
      equipoId: partido.localId,
      minuto: 0,
      esPenal: false,
      asistenciaJugadorId: null,
      asistenciaJugadorNombre: null,
    });
    renderLista();
  });

  document.getElementById("btn-add-tarjeta")?.addEventListener("click", () => {
    tarjetasTemp.push({
      jugadorNombre: "",
      equipoId: partido.localId,
      tipo: "amarilla",
      minuto: 0,
    });
    renderListaTarjetas();
  });

  document.getElementById("btn-confirmar")?.addEventListener("click", () => {
    const golesLocal     = Number(document.getElementById("goles-local").value);
    const golesVisitante = Number(document.getElementById("goles-visitante").value);
    const definidoPor    = document.getElementById("definido-por")?.value || "normal";

    if (isNaN(golesLocal) || isNaN(golesVisitante)) {
      alert("Ingresá valores válidos para los goles.");
      return;
    }
    if (golesLocal < 0 || golesVisitante < 0) {
      alert("Los goles no pueden ser negativos.");
      return;
    }

    try {
      store.dispatch("CARGAR_RESULTADO", {
        partidoId:      partido.id,
        localId:        partido.localId,
        visitanteId:    partido.visitanteId,
        golesLocal,
        golesVisitante,
        definidoPor,
        goles:          golesTemp,
        tarjetasLista:  tarjetasTemp,
      });
    } catch (e) {
      alert("Error al guardar: " + e.message);
    }
  });

  document.getElementById("btn-borrar")?.addEventListener("click", () => {
    if (confirm("¿Borrar el resultado de este partido?")) {
      store.dispatch("BORRAR_RESULTADO", { partidoId: partido.id });
    }
  });

  document.getElementById("btn-guardar-pred")?.addEventListener("click", () => {
    const gl = Number(document.getElementById("pred-local")?.value);
    const gv = Number(document.getElementById("pred-visitante")?.value);
    if (isNaN(gl) || isNaN(gv)) {
      alert("Ingresá un resultado válido para tu pronóstico.");
      return;
    }
    if (gl < 0 || gv < 0) {
      alert("Los goles no pueden ser negativos.");
      return;
    }
    store.dispatch("PREDECIR", {
      partidoId: partido.id,
      localGoles: gl,
      visitanteGoles: gv,
    });
    abrirPanelResultado(partido);
  });
}

function imagenEstadio(wikiPage) {
  const decoded = wikiPage
    .replace(/%27/g, "'")
    .replace(/%26/g, "&")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")");
  return `img/stadiums/${decoded}.jpg`;
}

function renderizarEstadio(nombre) {
  if (!nombre) return "";
  const est = ESTADIOS[nombre];
  if (!est) return `<div class="panel-estadio"><span class="estadio-nombre">${nombre}</span></div>`;
  const imgSrc = imagenEstadio(est.wikiPage);
  const mundiales = est.mundialesPrevios.length > 0
    ? est.mundialesPrevios.join(", ")
    : "Primer mundial";
  return `
    <div class="panel-estadio" data-estadio="${nombre}">
      <img src="${imgSrc}" alt="${est.nombre}" class="estadio-imagen"
           onerror="this.style.display='none'">
      <div class="estadio-info">
        <span class="estadio-nombre">${est.nombre}</span>
        <span class="estadio-detalle">${est.ciudad}</span>
        <span class="estadio-detalle">Capacidad: ${est.capacidad}</span>
        <span class="estadio-detalle">Inauguración: ${est.inauguracion}</span>
        <span class="estadio-mundiales"> ${mundiales}</span>
        <span class="estadio-expand-hint">▼ Ver más</span>
      </div>
      <div class="estadio-detalles oculto">
        <p class="estadio-descripcion">${est.descripcion}</p>
        <div class="estadio-seccion">
          <span class="estadio-seccion-titulo"> Equipo local</span>
          <span>${est.equipoLocal}</span>
        </div>
        <div class="estadio-seccion">
          <span class="estadio-seccion-titulo"> Eventos importantes</span>
          <ul class="estadio-lista">
            ${est.eventosImportantes.map(e => `<li>${e}</li>`).join("")}
          </ul>
        </div>
        <div class="estadio-seccion">
          <span class="estadio-seccion-titulo"> Datos curiosos</span>
          <ul class="estadio-lista">
            ${est.datosCuriosos.map(d => `<li>${d}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderizarAlineaciones(partido) {
  if (!partido.localId || !partido.visitanteId) return "";
  const local = EQUIPOS_MAP[partido.localId];
  const visitante = EQUIPOS_MAP[partido.visitanteId];
  return `
    <div class="panel-alineaciones">
      <span class="alineaciones-header">Posibles titulares</span>
      <div class="alineaciones-grid">
        <div class="formacion-col">${renderizarFormacion(partido.localId)}</div>
        <div class="formacion-col">${renderizarFormacion(partido.visitanteId)}</div>
      </div>
    </div>
  `;
}

function renderizarPrediccion(partido, resultado) {
  if (!partido.localId || !partido.visitanteId) return "";
  const state = store.getState();
  const prediccion = state.predicciones?.[partido.id];

  if (resultado) {
    // Partido jugado – mostrar si acertó
    if (!prediccion) return "";
    const correcto = prediccion.localGoles === resultado.golesLocal &&
                     prediccion.visitanteGoles === resultado.golesVisitante;
    const p = calcularPuntosPrediccion(prediccion, resultado);
    return `
      <div class="panel-prediccion ${correcto ? "acertada" : "fallada"}">
        <span class="pred-titulo">Tu predicción</span>
        <span class="pred-marcador">${prediccion.localGoles} – ${prediccion.visitanteGoles}</span>
        <span class="pred-resultado">${resultado.golesLocal} – ${resultado.golesVisitante}</span>
        <span class="pred-puntos">${p > 0 ? "+" + p + " pts" : "0 pts"}</span>
        <span class="pred-emoji">${correcto ? "🎯" : "❌"}</span>
      </div>
    `;
  }

  // Partido sin jugar – formulario de predicción (solo hasta 1 min antes del inicio)
  if (partido.fechaHora) {
    const ahora = new Date();
    const inicio = new Date(partido.fechaHora);
    const diffMin = (inicio - ahora) / 60000;
    if (diffMin <= 1) return ""; // predicción cerrada
  }
  const local  = EQUIPOS_MAP[partido.localId];
  const visitante = EQUIPOS_MAP[partido.visitanteId];
  return `
    <div class="panel-prediccion form">
      <span class="pred-titulo"> Tu pronóstico</span>
      <div class="pred-inputs">
        <div class="pred-equipo">
          <img src="img/${local?.bandera || ""}" class="bandera-img" alt="">
          <input type="number" id="pred-local" class="input-goles" min="0" max="15"
                 value="${prediccion?.localGoles ?? ""}" placeholder="?">
        </div>
        <span class="pred-vs">–</span>
        <div class="pred-equipo">
          <input type="number" id="pred-visitante" class="input-goles" min="0" max="15"
                 value="${prediccion?.visitanteGoles ?? ""}" placeholder="?">
          <img src="img/${visitante?.bandera || ""}" class="bandera-img" alt="">
        </div>
        <button class="btn-prediccion" id="btn-guardar-pred">${prediccion ? "Actualizar" : "Predecir"}</button>
      </div>
    </div>
  `;
}

function calcularPuntosPrediccion(pred, res) {
  if (!pred || !res) return 0;
  const pg = pred.localGoles, pv = pred.visitanteGoles;
  const rg = res.golesLocal, rv = res.golesVisitante;
  if (pg === rg && pv === rv) return 5;
  const predDif = pg - pv, resDif = rg - rv;
  if (predDif === resDif) return 4;
  if (Math.sign(predDif) === Math.sign(resDif)) return 3;
  return 0;
}

function renderizarFormGol(gol, index, partido) {
  const local     = EQUIPOS_MAP[partido.localId];
  const visitante = EQUIPOS_MAP[partido.visitanteId];

  return `
    <div class="gol-item" data-gol-index="${index}">
      <select class="gol-equipo">
        <option value="${partido.localId}"     ${gol.equipoId === partido.localId     ? "selected" : ""}>
          <img src="img/${local?.bandera || ""}" class="bandera-img" alt=""> ${local?.nombre || partido.localId}
        </option>
        <option value="${partido.visitanteId}" ${gol.equipoId === partido.visitanteId ? "selected" : ""}>
          <img src="img/${visitante?.bandera || ""}" class="bandera-img" alt=""> ${visitante?.nombre || partido.visitanteId}
        </option>
      </select>
      <input class="gol-jugador" type="text" placeholder="Jugador" value="${gol.jugadorNombre || ""}">
      <input class="gol-minuto" type="number" placeholder="Min" min="1" max="120" value="${gol.minuto || ""}">
      <input class="gol-asistencia" type="text" placeholder="Asistencia (opcional)" value="${gol.asistenciaJugadorNombre || ""}">
      <button class="btn-eliminar-gol" title="Eliminar este gol">✕</button>
    </div>
  `;
}

function renderizarFormTarjeta(tarjeta, index, partido) {
  const local     = EQUIPOS_MAP[partido.localId];
  const visitante = EQUIPOS_MAP[partido.visitanteId];

  return `
    <div class="tarjeta-item" data-tarjeta-index="${index}">
      <select class="tarjeta-equipo">
        <option value="${partido.localId}"     ${tarjeta.equipoId === partido.localId     ? "selected" : ""}>
          <img src="img/${local?.bandera || ""}" class="bandera-img" alt=""> ${local?.nombre || partido.localId}
        </option>
        <option value="${partido.visitanteId}" ${tarjeta.equipoId === partido.visitanteId ? "selected" : ""}>
          <img src="img/${visitante?.bandera || ""}" class="bandera-img" alt=""> ${visitante?.nombre || partido.visitanteId}
        </option>
      </select>
      <input class="tarjeta-jugador" type="text" placeholder="Jugador" value="${tarjeta.jugadorNombre || ""}">
      <select class="tarjeta-tipo">
        <option value="amarilla" ${tarjeta.tipo === "amarilla" ? "selected" : ""}>🟨 Amarilla</option>
        <option value="roja"     ${tarjeta.tipo === "roja"     ? "selected" : ""}>🟥 Roja</option>
      </select>
      <input class="tarjeta-minuto" type="number" placeholder="Min" min="1" max="120" value="${tarjeta.minuto || ""}">
      <button class="btn-eliminar-tarjeta" title="Eliminar esta tarjeta">✕</button>
    </div>
  `;
}

function mostrarMensajePanel(mensaje) {
  const panel = document.getElementById("panel-resultado");
  if (panel) {
    panel.innerHTML = `<div class="panel-placeholder">${mensaje}</div>`;
  }
}
