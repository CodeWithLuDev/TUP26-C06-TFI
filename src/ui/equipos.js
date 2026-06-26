/**
 * equipos.js (UI)
 * Renderizado de la pantalla principal con lista de todos los equipos participantes
 * y pantalla completa por equipo con jugadores convocados con foto (avatar SVG).
 */

import { EQUIPOS, GRUPOS, EQUIPOS_MAP } from "../data/equipos.js";
import { generarPlantel } from "../data/jugadores.js";
import { obtenerFormacion } from "../data/formaciones.js";
import { obtenerSrcAvatar, guardarFotoJugador, eliminarFotoJugador, fotoJugadorUrl, generarAvatarSVG, colorEquipo } from "./avatar.js";

let equipoActual = null;

export function renderizarEquipos(contenedor) {
  if (equipoActual) {
    renderizarEquipoDetalle(contenedor, equipoActual);
    return;
  }
  contenedor.innerHTML = `
    <div class="equipos-header">
      <h2>Equipos Participantes</h2>
      <p class="equipos-subtitulo">48 selecciones · 12 grupos · 11 convocados por equipo</p>
    </div>
    <div class="equipos-grid">
      ${GRUPOS.map(letra => renderizarGrupoEquipos(letra)).join("")}
    </div>
  `;

  contenedor.querySelectorAll(".equipos-item").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.equipoId;
      if (!id) return;
      equipoActual = id;
      renderizarEquipoDetalle(contenedor, id);
    });
  });
}

function renderizarGrupoEquipos(letra) {
  const equipos = EQUIPOS.filter(e => e.grupo === letra);
  return `
    <div class="equipos-grupo-card">
      <h3 class="equipos-grupo-titulo">Grupo ${letra}</h3>
      <div class="equipos-lista">
        ${equipos.map(e => `
          <div class="equipos-item" data-equipo-id="${e.id}">
            <img src="img/${e.bandera}" class="bandera-img" alt="${e.nombre}">
            <span class="equipos-nombre">${e.nombre}</span>
            <span class="equipos-expand-hint">→</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderizarEquipoDetalle(contenedor, equipoId) {
  const equipo = EQUIPOS_MAP[equipoId];
  if (!equipo) return;
  const jugadores = generarPlantel(equipoId, obtenerFormacion(equipoId));
  const grupo = GRUPOS.find(g => EQUIPOS.filter(e => e.grupo === g).some(e => e.id === equipoId));
  const formacion = obtenerFormacion(equipoId);
  const color = colorEquipo(equipoId);
  const titulares = jugadores.filter(j => j.titular);
  const suplentes = jugadores.filter(j => !j.titular);

  const renderJugador = (j) => {
    const src = obtenerSrcAvatar(equipoId, j.dorsal, color, j.foto);
    return `
      <div class="plantel-jugador">
        <div class="plantel-avatar">
          <img src="${src}" alt="${j.nombreCompleto}" class="plantel-foto" id="foto-${equipoId}-${j.dorsal}">
          <button class="plantel-foto-btn" data-equipo="${equipoId}" data-dorsal="${j.dorsal}" title="Cambiar foto">📷</button>
        </div>
        <span class="plantel-nombre">${j.nombreCompleto}</span>
        <span class="plantel-pos">${j.posicion}</span>
        <span class="plantel-dorsal">#${j.dorsal}</span>
      </div>
    `;
  };

  contenedor.innerHTML = `
    <div class="equipo-detalle">
      <button class="equipo-detalle-back" id="btn-volver-equipos">← Volver a equipos</button>

      <div class="equipo-detalle-header">
        <img src="img/${equipo.bandera}" class="equipo-detalle-bandera" alt="${equipo.nombre}">
        <div class="equipo-detalle-info">
          <h2 class="equipo-detalle-nombre">${equipo.nombre}</h2>
          <span class="equipo-detalle-meta">Grupo ${grupo} · ${formacion.label} · ${jugadores.length} convocados</span>
        </div>
      </div>

      <h3 class="plantel-subtitulo">Titulares</h3>
      <div class="plantel-grid">${titulares.map(renderJugador).join("")}</div>

      <h3 class="plantel-subtitulo suplentes">🔄 Suplentes</h3>
      <div class="plantel-grid">${suplentes.map(renderJugador).join("")}</div>
    </div>
  `;

  document.getElementById("btn-volver-equipos").addEventListener("click", () => {
    equipoActual = null;
    renderizarEquipos(contenedor);
  });

  contenedor.querySelectorAll(".plantel-foto-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const eq = btn.dataset.equipo;
      const dor = btn.dataset.dorsal;
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.addEventListener("change", () => {
        const archivo = input.files?.[0];
        if (!archivo) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          guardarFotoJugador(eq, dor, ev.target.result);
          const img = document.getElementById(`foto-${eq}-${dor}`);
          if (img) img.src = ev.target.result;
        };
        reader.readAsDataURL(archivo);
      });
      input.click();
    });
  });

  contenedor.querySelectorAll(".plantel-avatar").forEach(av => {
    av.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const eq = av.querySelector(".plantel-foto-btn")?.dataset.equipo;
      const dor = av.querySelector(".plantel-foto-btn")?.dataset.dorsal;
      if (eq && dor && fotoJugadorUrl(eq, dor)) {
        if (confirm("¿Eliminar la foto de este jugador?")) {
          eliminarFotoJugador(eq, dor);
          const img = document.getElementById(`foto-${eq}-${dor}`);
          const jug = jugadores.find(j => j.dorsal === dor);
          if (img) img.src = jug?.foto || generarAvatarSVG(dor, colorEquipo(eq));
        }
      }
    });
  });
}
