import { EQUIPOS_MAP } from "../data/equipos.js";
import { esPartidoEnVivo, formatearFechaHora } from "./grupos.js";

const GANADORES = [
  { year: "1930", campeon: "Uruguay", final: "4–2 vs Argentina", sede: "Uruguay" },
  { year: "1934", campeon: "Italia", final: "2–1 vs Checoslovaquia", sede: "Italia" },
  { year: "1938", campeon: "Italia", final: "4–2 vs Hungría", sede: "Francia" },
  { year: "1950", campeon: "Uruguay", final: "2–1 vs Brasil", sede: "Brasil" },
  { year: "1954", campeon: "Alemania Federal", final: "3–2 vs Hungría", sede: "Suiza" },
  { year: "1958", campeon: "Brasil", final: "5–2 vs Suecia", sede: "Suecia" },
  { year: "1962", campeon: "Brasil", final: "3–1 vs Checoslovaquia", sede: "Chile" },
  { year: "1966", campeon: "Inglaterra", final: "4–2 vs Alemania Federal", sede: "Inglaterra" },
  { year: "1970", campeon: "Brasil", final: "4–1 vs Italia", sede: "México" },
  { year: "1974", campeon: "Alemania Federal", final: "2–1 vs Países Bajos", sede: "Alemania" },
  { year: "1978", campeon: "Argentina", final: "3–1 vs Países Bajos", sede: "Argentina" },
  { year: "1982", campeon: "Italia", final: "3–1 vs Alemania Federal", sede: "España" },
  { year: "1986", campeon: "Argentina", final: "3–2 vs Alemania Federal", sede: "México" },
  { year: "1990", campeon: "Alemania Federal", final: "1–0 vs Argentina", sede: "Italia" },
  { year: "1994", campeon: "Brasil", final: "0–0 (3–2 p.) vs Italia", sede: "EE. UU." },
  { year: "1998", campeon: "Francia", final: "3–0 vs Brasil", sede: "Francia" },
  { year: "2002", campeon: "Brasil", final: "2–0 vs Alemania", sede: "Corea/Japón" },
  { year: "2006", campeon: "Italia", final: "1–1 (5–3 p.) vs Francia", sede: "Alemania" },
  { year: "2010", campeon: "España", final: "1–0 vs Países Bajos", sede: "Sudáfrica" },
  { year: "2014", campeon: "Alemania", final: "1–0 vs Argentina", sede: "Brasil" },
  { year: "2018", campeon: "Francia", final: "4–2 vs Croacia", sede: "Rusia" },
  { year: "2022", campeon: "Argentina", final: "3–3 (4–2 p.) vs Francia", sede: "Qatar" },
];

const MAXIMOS_GOLEADORES = [
  { pos: 1, nombre: "Miroslav Klose", pais: "Alemania", goles: 16, mundiales: "2002, 2006, 2010, 2014", bandera: "de.png" },
  { pos: 2, nombre: "Ronaldo Nazário", pais: "Brasil", goles: 15, mundiales: "1994, 1998, 2002, 2006", bandera: "br.png" },
  { pos: 3, nombre: "Gerd Müller", pais: "Alemania", goles: 14, mundiales: "1970, 1974", bandera: "de.png" },
  { pos: 4, nombre: "Just Fontaine", pais: "Francia", goles: 13, mundiales: "1958", bandera: "fr.png" },
  { pos: 5, nombre: "Lionel Messi", pais: "Argentina", goles: 13, mundiales: "2006–2022", bandera: "ar.png" },
  { pos: 6, nombre: "Pelé", pais: "Brasil", goles: 12, mundiales: "1958, 1962, 1966, 1970", bandera: "br.png" },
  { pos: 7, nombre: "Kylian Mbappé", pais: "Francia", goles: 12, mundiales: "2018, 2022", bandera: "fr.png" },
  { pos: 8, nombre: "Sándor Kocsis", pais: "Hungría", goles: 11, mundiales: "1954", bandera: "hu.png" },
  { pos: 9, nombre: "Jürgen Klinsmann", pais: "Alemania", goles: 11, mundiales: "1990, 1994, 1998", bandera: "de.png" },
  { pos: 10, nombre: "Helmut Rahn", pais: "Alemania", goles: 10, mundiales: "1954, 1958", bandera: "de.png" },
];

export function renderizarInicio(contenedor, partidosMap) {
  const championActual = GANADORES.find(g => g.year === "2022");
  const top3 = MAXIMOS_GOLEADORES.slice(0, 3);

  // Partidos del dia de hoy
  const hoy = new Date();
  const hoyStr = hoy.getFullYear() + "-" + String(hoy.getMonth()+1).padStart(2,"0") + "-" + String(hoy.getDate()).padStart(2,"0");
  const partidosHoy = Object.values(partidosMap || {})
    .filter(p => p.localId && p.visitanteId && p.fechaHora?.startsWith(hoyStr))
    .slice(0, 12);

  contenedor.innerHTML = `
    <div class="inicio-grid">

      <!-- Hero -->
      <div class="inicio-hero">
        <div class="inicio-hero-bg"></div>
        <div class="inicio-hero-content">
          <h1 class="inicio-hero-titulo">Mundial 2026</h1>
          <p class="inicio-hero-sub">United States · Canada · Mexico</p>
          <p class="inicio-hero-desc">48 selecciones · 12 grupos · 32avos de final · Un solo sueño</p>
        </div>
      </div>

      <!-- Partidos del dia -->
      <div class="inicio-card partidos-card ${partidosHoy.some(esPartidoEnVivo) ? "con-vivo" : ""}">
        <h2 class="inicio-card-titulo">Partidos de hoy</h2>
        <div class="inicio-partidos-lista">
          ${partidosHoy.map(p => {
            const local = EQUIPOS_MAP[p.localId];
            const visitante = EQUIPOS_MAP[p.visitanteId];
            const enVivo = esPartidoEnVivo(p);
            const r = p.resultado;
            return `
              <div class="inicio-partido-fila ${enVivo ? "vivo" : r ? "jugado" : "pendiente"}">
                <span class="ip-equipos">
                  <img src="img/${local?.bandera || ""}" class="bandera-img" alt="">
                  ${local?.nombre || p.localId}
                  <strong class="ip-marcador">${r ? r.golesLocal + "–" + r.golesVisitante : "vs"}</strong>
                  ${visitante?.nombre || p.visitanteId}
                  <img src="img/${visitante?.bandera || ""}" class="bandera-img" alt="">
                </span>
                <span class="ip-fecha">${formatearFechaHora(p.fechaHora)}</span>
                ${enVivo ? '<span class="vivo-badge">EN VIVO</span>' : ""}
              </div>
            `;
          }).join("")}
          ${partidosHoy.length === 0 ? '<p class="stats-vacio">No hay partidos programados para hoy</p>' : ""}
        </div>
      </div>

      <!-- Campeón actual -->
      <div class="inicio-card campeon-card">
        <div class="campeon-overlay"></div>
        <h2 class="inicio-card-titulo">Campeón vigente</h2>
        <div class="campeon-body">
          <img src="img/ar.png" alt="Argentina" class="campeon-bandera">
          <span class="campeon-nombre">Argentina</span>
          <span class="campeon-detalle">Campeón Mundial 2022</span>
          <span class="campeon-final">${championActual.final}</span>
        </div>
      </div>

      <!-- Formato 2026 -->
      <div class="inicio-card formato-card">
        <h2 class="inicio-card-titulo">Nuevo formato 2026</h2>
        <div class="formato-grid">
          <div class="formato-item">
            <span class="formato-num">48</span>
            <span class="formato-label">Selecciones</span>
          </div>
          <div class="formato-item">
            <span class="formato-num">12</span>
            <span class="formato-label">Grupos</span>
          </div>
          <div class="formato-item">
            <span class="formato-num">2</span>
            <span class="formato-label">Clasifican por grupo</span>
          </div>
          <div class="formato-item">
            <span class="formato-num">8</span>
            <span class="formato-label">Mejores terceros</span>
          </div>
          <div class="formato-item">
            <span class="formato-num">104</span>
            <span class="formato-label">Partidos totales</span>
          </div>
          <div class="formato-item">
            <span class="formato-num">3</span>
            <span class="formato-label">Países sede</span>
          </div>
        </div>
        <div class="formato-ronda">
          <div class="fronda-item">F. Grupos</div>
          <div class="fronda-flecha">→</div>
          <div class="fronda-item">32avos</div>
          <div class="fronda-flecha">→</div>
          <div class="fronda-item">16avos</div>
          <div class="fronda-flecha">→</div>
          <div class="fronda-item">Cuartos</div>
          <div class="fronda-flecha">→</div>
          <div class="fronda-item">Semis</div>
          <div class="fronda-flecha">→</div>
          <div class="fronda-item final-item">Final</div>
        </div>
      </div>

      <!-- Sedes -->
      <div class="inicio-card sedes-card full-width">
        <h2 class="inicio-card-titulo">Países anfitriones</h2>
        <div class="sedes-grid">
          <div class="sede-item">
            <span class="sede-bandera">🇺🇸</span>
            <span class="sede-nombre">Estados Unidos</span>
            <span class="sede-estadios">11 estadios</span>
          </div>
          <div class="sede-item">
            <span class="sede-bandera">🇲🇽</span>
            <span class="sede-nombre">México</span>
            <span class="sede-estadios">3 estadios</span>
          </div>
          <div class="sede-item">
            <span class="sede-bandera">🇨🇦</span>
            <span class="sede-nombre">Canadá</span>
            <span class="sede-estadios">2 estadios</span>
          </div>
        </div>
        <div class="sedes-nota">Por primera vez 3 países organizan un Mundial</div>
      </div>

      <!-- Historia -->
      <div class="inicio-card historia-card full-width">
        <h2 class="inicio-card-titulo">Historia de los Mundiales</h2>
        <p class="historia-intro">Desde 1930, la Copa del Mundo ha sido el evento deportivo más grande del planeta. 22 ediciones, 8 campeones distintos y momentos que quedaron grabados en la memoria colectiva.</p>
        <div class="historia-timeline">
          ${GANADORES.map(g => `
            <div class="historia-item">
              <div class="historia-dot"></div>
              <span class="historia-year">${g.year}</span>
              <span class="historia-campeon">${g.campeon}</span>
              <span class="historia-sede">${g.sede}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Máximos goleadores -->
      <div class="inicio-card goleadores-card full-width">
        <h2 class="inicio-card-titulo">Máximos goleadores históricos</h2>
        <div class="goleadores-top3">
          ${top3.map(g => `
            <div class="goleador-topItem">
              <div class="goleador-medalla">${g.pos}</div>
              <div class="goleador-avatar" style="background:linear-gradient(135deg,var(--c-primary),#e5b82a)">
                <span class="goleador-inicial">${g.nombre.charAt(0)}</span>
              </div>
              <span class="goleador-nombre">${g.nombre}</span>
              <span class="goleador-pais">
                <img src="img/${g.bandera}" class="bandera-img" alt=""> ${g.pais}
              </span>
              <span class="goleador-goles">${g.goles} goles</span>
            </div>
          `).join("")}
        </div>
        <div class="goleadores-lista">
          ${MAXIMOS_GOLEADORES.slice(3).map(g => `
            <div class="goleador-row">
              <span class="goleador-pos">${g.pos}</span>
              <div class="goleador-avatar-sm">
                <span class="goleador-inicial-sm">${g.nombre.charAt(0)}</span>
              </div>
              <span class="goleador-nombre">${g.nombre}</span>
              <img src="img/${g.bandera}" class="bandera-img" alt="">
              <span class="goleador-goles">${g.goles}</span>
            </div>
          `).join("")}
        </div>
      </div>

    </div>
  `;
}
