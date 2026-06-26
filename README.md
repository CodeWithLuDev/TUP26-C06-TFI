# Mundial 2026 — Fixture en Tiempo Real

Trabajo Final Integrador — Programación III | Tecnicatura en Programación

## Descripción

Aplicación web vanilla (HTML + CSS + JS puro, sin frameworks) que permite gestionar y visualizar el fixture completo del Mundial 2026 (USA, México, Canadá), con 48 selecciones, 12 grupos y un formato expandido que incluye 32avos de final, desde la fase de grupos hasta la gran final. Incluye:

- **Lista de equipos participantes** con banderas y grupos (pantalla principal)
- **Carga de resultados** con registro de goles, jugadores y asistencias
- **Tablas de posiciones** con algoritmo FIFA completo (puntos, DG, GF, enfrentamiento directo)
- **Clasificación de mejores terceros** (8 de 12 grupos avanzan a 32avos)
- **Bracket de playoffs** con 32avos, octavos, cuartos, semis, final y tercer puesto
- **Rankings de goleadores y asistidores** en tiempo real
- **Persistencia en localStorage**: los datos no se pierden al recargar

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| HTML5 | — | Estructura semántica |
| CSS3 | — | Estilos, variables, Grid/Flexbox |
| JavaScript | ES2022 (ES Modules) | Lógica y DOM |
| localStorage | API nativa | Persistencia de datos |

Sin dependencias externas. Sin bundler. Sin instalación.

## Estructura del proyecto

```
Fixture Mundial/
├── index.html
├── README.md
├── styles/
│   └── main.css
└── src/
    ├── data/
    │   ├── equipos.js      ← 48 equipos, 12 grupos
    │   └── partidos.js     ← Calendario 72 grupos + 32 eliminatorias
    ├── logic/
    │   ├── posiciones.js   ← Algoritmo FIFA + mejores terceros
    │   ├── playoffs.js     ← Bracket R32, R16, QF, SF, Final
    │   └── estadisticas.js ← Goleadores y asistidores
    ├── ui/
    │   ├── equipos.js
    │   ├── grupos.js
    │   ├── bracket.js
    │   ├── fixture.js
    │   └── estadisticas.js
    ├── store.js
    └── main.js
```

## Instalación y ejecución

### Opción A — Servidor HTTP local (recomendada)

Los ES Modules requieren un servidor HTTP (no funcionan con `file://`).

**Con Python:**
```bash
cd "Fixture Mundial"
python -m http.server 8080
# Abrir http://localhost:8080
```

**Con Node.js:**
```bash
cd "Fixture Mundial"
npx serve .
```

**Con VS Code:** Extensión _Live Server_ → "Go Live".

## Cómo usar la aplicación

1. **Equipos (tab por defecto):** Vista general de las 48 selecciones organizadas por grupo.
2. **Fixture:** Seleccioná un partido de la lista izquierda. Se abre el panel de carga a la derecha.
3. **Ingresá los goles** local y visitante con los inputs numéricos.
4. **Opcional:** Agregá el detalle de cada gol (jugador, minuto, asistencia) con el botón "+ Agregar gol".
5. Para playoffs, seleccioná si el partido se definió en 90 min, tiempo extra o penales.
6. Hacé clic en **✓ Confirmar resultado**. Las tablas, el bracket y los rankings se actualizan de forma inmediata.
7. Para editar un resultado ya cargado, seleccioná el partido (aparecerá marcado con ✓), modificá los valores y confirmá de nuevo.
8. Para borrar un resultado: **✕ Borrar resultado** en el panel.

## Criterios de desempate FIFA implementados

1. Mayor cantidad de puntos
2. Mayor diferencia de goles en el grupo
3. Mayor cantidad de goles a favor en el grupo
4. *(Solo si 2 equipos empatados)* Mayor puntos en enfrentamiento directo
5. *(Solo si 2 equipos empatados)* Mayor diferencia de goles en enfrentamiento directo
6. *(Solo si 2 equipos empatados)* Mayor goles a favor en enfrentamiento directo
7. Para 3+ empatados: se aplican los criterios 1-6 dentro del subgrupo empatado
8. Sorteo (orden alfabético por código de equipo como fallback)

Para la **clasificación de mejores terceros**: puntos, DG, GF.

## Formato del Mundial 2026

- **48 equipos** divididos en **12 grupos de 4**
- Avanzan: los **2 primeros de cada grupo** (24) + los **8 mejores terceros**
- **32avos de final** → Octavos → Cuartos → Semis → Final (+ Tercer puesto)
- 104 partidos en total
- Sedes: Estados Unidos, México y Canadá (16 ciudades)

## Decisiones de diseño

- **ES Modules nativos sin bundler:** Sin instalación, cualquier navegador moderno lo corre.
- **Patrón Observer (store + suscriptores):** Estado centralizado, todas las vistas sincronizadas.
- **Render completo por sección:** Simple de razonar, suficientemente performante para 104 partidos.
- **Zona horaria UTC-3:** Horarios en ISO 8601 con offset, convertidos a zona local del navegador.
- **localStorage con merge inteligente:** Calendario base + estado guardado, permite actualizaciones.

## Integrantes

| Nombre | Legajo |
|---|---|
| *(Completar)* | *(Completar)* |

---

*Programación III · Tecnicatura en Programación · Mundial 2026*
