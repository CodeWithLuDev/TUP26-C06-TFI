import { store }                from "./store.js";
import { renderizarInicio }     from "./ui/inicio.js";
import { renderizarEquipos }    from "./ui/equipos.js";
import { renderizarGrupos }     from "./ui/grupos.js";
import { renderizarBracket }    from "./ui/bracket.js";
import { renderizarFixture }    from "./ui/fixture.js";
import { renderizarEstadisticas } from "./ui/estadisticas.js";

const contenedores = {
  inicio:       document.getElementById("seccion-inicio"),
  equipos:      document.getElementById("seccion-equipos"),
  grupos:       document.getElementById("seccion-grupos"),
  bracket:      document.getElementById("seccion-bracket"),
  fixture:      document.getElementById("seccion-fixture"),
  estadisticas: document.getElementById("seccion-estadisticas"),
};
const tabs = document.querySelectorAll("[data-tab]");

let vistaActiva = "inicio";

function activarTab(nombre) {
  vistaActiva = nombre;
  tabs.forEach(t => t.classList.toggle("activa", t.dataset.tab === nombre));
  Object.entries(contenedores).forEach(([id, el]) => {
    if (el) el.classList.toggle("oculto", id !== nombre);
  });
  renderVista();
}

function renderVista() {
  const { partidos } = store.getState();
  const c = contenedores[vistaActiva];
  if (!c) return;
  switch (vistaActiva) {
    case "inicio":       renderizarInicio(c, partidos);         break;
    case "equipos":      renderizarEquipos(c);                break;
    case "grupos":       renderizarGrupos(c, partidos);       break;
    case "bracket":      renderizarBracket(c, partidos);      break;
    case "fixture":      renderizarFixture(c, partidos);      break;
    case "estadisticas": renderizarEstadisticas(c, partidos); break;
  }
}

store.subscribe(() => renderVista());

tabs.forEach(tab => {
  tab.addEventListener("click", () => activarTab(tab.dataset.tab));
});

const btnReset = document.getElementById("btn-reset");
if (btnReset) {
  btnReset.addEventListener("click", () => {
    if (confirm("¿Borrar TODOS los resultados y empezar de cero?")) {
      store.resetCompleto();
      renderVista();
    }
  });
}

// ── Reproductor con playlist ────────────────────────────────────────────────────
const PLAYLIST = [
  { src: "audio/tema2.mp3", nombre: "La Scaloneta" },
  { src: "audio/tema3.mp3", nombre: "Muchachos" },
  { src: "audio/tema4.mp3", nombre: "Palmito - La Cuarta Estrella" },
  { src: "audio/tema5.mp3", nombre: "Shakira - Dai Dai (MV)" },
  { src: "audio/tema6.mp3", nombre: "Shakira - Dai Dai (Audio)" },
  { src: "audio/tema7.mp3", nombre: "Shakira - Dai Dai (Video)" },
  { src: "audio/tema8.mp3", nombre: "Messi - Último Baile" },
  { src: "audio/tema9.mp3", nombre: "Wake me Up - WM 2026" },
];

let indiceActual = 0;

const audio       = document.getElementById("player-audio");
const playerBar   = document.getElementById("player-bar");
const playerTrack = document.getElementById("player-track");
const playerPlay  = document.getElementById("player-play");
const playerPrev  = document.getElementById("player-prev");
const playerNext  = document.getElementById("player-next");
const playerRew   = document.getElementById("player-rewind");
const playerFwd   = document.getElementById("player-forward");
const playerProg  = document.getElementById("player-progress");
const playerTime  = document.getElementById("player-time");
const playerVol   = document.getElementById("player-volume");
const playerClose = document.getElementById("player-close");

function cargarCancion(index) {
  indiceActual = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
  const cancion = PLAYLIST[indiceActual];
  audio.src = cancion.src;
  audio.load();
  playerTrack.textContent = cancion.nombre;
}

function reproducirCancion(index) {
  cargarCancion(index);
  audio.play().catch(e => console.warn("Error al reproducir:", e));
}

playerBar?.classList.remove("oculto");

// Overlay de bienvenida
const overlay = document.getElementById("welcome-overlay");
if (overlay && audio) {
  audio.volume = playerVol?.value || 0.5;
  cargarCancion(0);

  function ocultarOverlay() {
    if (overlay.classList.contains("hiding")) return;
    overlay.classList.add("hiding");
    audio.currentTime = 0;
    audio.play().then(() => {
      playerPlay.textContent = "⏸";
    }).catch(e => console.warn("No se pudo reproducir audio:", e));
    setTimeout(() => { overlay.style.display = "none"; }, 2500);
  }

  overlay.addEventListener("click", ocultarOverlay);
} else if (overlay) {
  overlay.style.display = "none";
}

// Controles del reproductor
let draggingProg = false;

audio.addEventListener("timeupdate", () => {
  if (!draggingProg && audio.duration) {
    playerProg.value = (audio.currentTime / audio.duration) * 100;
    playerTime.textContent = formatearTiempo(audio.currentTime);
  }
});

audio.addEventListener("ended", () => {
  reproducirCancion(indiceActual + 1);
});

playerProg.addEventListener("input", () => { draggingProg = true; });
playerProg.addEventListener("change", () => {
  if (audio.duration) {
    audio.currentTime = (playerProg.value / 100) * audio.duration;
  }
  draggingProg = false;
});

playerPlay.addEventListener("click", () => {
  if (audio.paused) {
    if (!audio.src) cargarCancion(indiceActual);
    audio.play().then(() => {
      playerPlay.textContent = "⏸";
    }).catch(e => console.warn(e));
  } else {
    audio.pause();
    playerPlay.textContent = "▶";
  }
});

audio.addEventListener("play", () => {
  playerPlay.textContent = "⏸";
  if (playerBar?.classList.contains("oculto")) playerBar.classList.remove("oculto");
  playerTrack.textContent = PLAYLIST[indiceActual]?.nombre || playerTrack.textContent;
});
audio.addEventListener("pause", () => { playerPlay.textContent = "▶"; });

playerPrev.addEventListener("click", () => reproducirCancion(indiceActual - 1));
playerNext.addEventListener("click", () => reproducirCancion(indiceActual + 1));

playerRew.addEventListener("click", () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

playerFwd.addEventListener("click", () => {
  if (audio.duration) {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  }
});

playerVol.addEventListener("input", () => { audio.volume = playerVol.value; });

playerClose.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
  playerBar.classList.add("oculto");
});

function formatearTiempo(s) {
  const m = Math.floor(s / 60);
  const seg = Math.floor(s % 60);
  return m + ":" + (seg < 10 ? "0" : "") + seg;
}

// ── Auto‑refresh para estado EN VIVO ────────────────────────────────────────────
setInterval(() => {
  const { partidos } = store.getState();
  const hayVivo = Object.values(partidos).some(p =>
    p.fechaHora && !p.resultado &&
    Date.now() >= new Date(p.fechaHora).getTime() &&
    Date.now() <= new Date(p.fechaHora).getTime() + 105 * 60 * 1000
  );
  if (hayVivo) renderVista();
}, 30000);

// ── Inicialización ─────────────────────────────────────────────────────────────
activarTab(vistaActiva);
