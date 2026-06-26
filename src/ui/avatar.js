const STORAGE_KEY = "player-fotos";

function getFotosMap() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}

function setFotosMap(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function fotoJugadorUrl(equipoId, dorsal) {
  const map = getFotosMap();
  return map[`${equipoId}-${dorsal}`] || null;
}

export function guardarFotoJugador(equipoId, dorsal, dataUrl) {
  const map = getFotosMap();
  map[`${equipoId}-${dorsal}`] = dataUrl;
  setFotosMap(map);
}

export function eliminarFotoJugador(equipoId, dorsal) {
  const map = getFotosMap();
  delete map[`${equipoId}-${dorsal}`];
  setFotosMap(map);
}

export function generarAvatarSVG(dorsal, colorBase) {
  const hue = parseInt(colorBase.replace("#", ""), 16) % 360;
  const c1 = `hsl(${hue}, 65%, 48%)`;
  const c2 = `hsl(${(hue + 30) % 360}, 60%, 38%)`;
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="${c1}" stroke="rgba(255,255,255,.2)" stroke-width="1.5"/>
      <circle cx="32" cy="32" r="24" fill="${c2}" opacity=".3"/>
      <circle cx="21" cy="25" r="3.2" fill="rgba(255,255,255,.85)"/>
      <circle cx="43" cy="25" r="3.2" fill="rgba(255,255,255,.85)"/>
      <ellipse cx="32" cy="31" rx="3" ry="2" fill="rgba(255,255,255,.12)"/>
      <path d="M 22 35 Q 32 44 42 35" stroke="rgba(255,255,255,.65)" fill="none" stroke-width="2" stroke-linecap="round"/>
      <text x="32" y="56" text-anchor="middle" fill="white" font-size="11" font-weight="800" font-family="sans-serif">${dorsal}</text>
    </svg>
  `)}`;
}

export function obtenerSrcAvatar(equipoId, dorsal, colorBase, fotoUrl) {
  const foto = fotoJugadorUrl(equipoId, dorsal);
  if (foto) return foto;
  if (fotoUrl) return fotoUrl;
  return generarAvatarSVG(dorsal, colorBase);
}

const PALETA = [
  "#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#0277bd","#00838f",
  "#00695c","#2e7d32","#558b2f","#9e9d24","#f9a825","#ff8f00","#ef6c00","#d84315",
  "#4e342e","#37474f","#5d4037","#3e2723","#c2185b","#7b1fa2","#303f9f","#1976d2",
  "#0097a7","#00796b","#388e3c","#689f38","#fbc02d","#f57c00","#e64a19","#795548",
];

export function colorEquipo(equipoId) {
  let hash = 0;
  for (let i = 0; i < equipoId.length; i++) {
    hash = ((hash << 5) - hash) + equipoId.charCodeAt(i);
    hash |= 0;
  }
  return PALETA[Math.abs(hash) % PALETA.length];
}
