/**
 * ─────────────────────────────────────────────────────────────
 * Lógica pura: recorre los partidos jugados y acumula goles y
 * asistencias por jugador.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Construye un ranking de jugadores a partir de un campo de array
 * presente en cada partido jugado (ej: 'goleadores' o 'asistidores').
 *
 * @param {Array}  listaPartidos - Array completo de partidos.
 * @param {string} campo         - Nombre del campo a acumular.
 * @returns {Array<{nombre: string, cantidad: number}>} Ordenado desc.
 */
export function calcularRanking(listaPartidos, campo) {
  const mapa = new Map(); // nombre → cantidad

  listaPartidos
    .filter(p => p.estado === 'jugado' && Array.isArray(p[campo]))
    .forEach(p => {
      p[campo].forEach(nombre => {
        if (!nombre) return;
        mapa.set(nombre, (mapa.get(nombre) ?? 0) + 1);
      });
    });

  return [...mapa.entries()]
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

/**
 * Devuelve el ranking de goleadores.
 * @param {Array} listaPartidos
 * @returns {Array<{nombre: string, cantidad: number}>}
 */
export function calcularGoleadores(listaPartidos) {
  return calcularRanking(listaPartidos, 'goleadores');
}

/**
 * Devuelve el ranking de asistidores.
 * @param {Array} listaPartidos
 * @returns {Array<{nombre: string, cantidad: number}>}
 */
export function calcularAsistidores(listaPartidos) {
  return calcularRanking(listaPartidos, 'asistidores');
}