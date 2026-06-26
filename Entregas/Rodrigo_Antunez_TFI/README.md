# Fixture del Mundial 2026 — Real-Time Tracker ⚽

Un **Fixture Interactivo en Tiempo Real** para la Copa del Mundo de Fútbol 2026. Esta aplicación es una Single Page Application (SPA) premium de alto rendimiento diseñada para gestionar todo el transcurso del torneo, desde la fase de grupos hasta la gran final, recalculando todos los resultados en tiempo real y persistiendo los datos de manera automática.

---

<p align="center">
  <img src="preview.png" alt="Fixture del Mundial 2026 Preview" width="100%" style="border-radius: 10px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);" />
</p>

---

## Integrante del Proyecto
* **Nombre:** José Rodrigo Antúnez
* **Legajo:** 63788
* **Materia:** Programación III (Tecnicatura en Programación)
* **Modalidad:** Individual

---

## Stack Tecnológico y Versiones

A continuación se detallan las tecnologías clave utilizadas para construir este proyecto de forma limpia y moderna, sin dependencias pesadas:

* **Node.js**: `v24.15.0`
* **Vite**: `^5.0.0` (Servidor de desarrollo ultra rápido)
* **HTML5**: Estructura semántica para la SPA.
* **CSS3 (Vanilla)**: Diseño moderno, responsivo con temática oscura (dark mode deportivo), glassmorphism, gradientes suaves y microanimaciones de interfaz.
* **JavaScript (ES Modules)**: Lógica modular moderna sin frameworks pesados.

---

## Características Principales

* **Lista de Equipos**: Vista interactiva de las 32 selecciones organizadas en una grilla premium con banderas reales.
* **Fase de Grupos Dinámica**: Tablas de posiciones interactivas que recalculan instantáneamente los puntos, partidos jugados/ganados/empatados/perdidos, diferencia de gol, goles a favor y aplican de forma estricta los criterios oficiales de desempate de la FIFA.
* **Bracket de Fase Eliminatoria (Playoffs)**: Árbol interactivo que conecta desde octavos de final hasta la gran final (y tercer puesto), propagando ganadores automáticamente.
* **Fixture Interactivo con Penales**: Carga rápida de marcadores con soporte de definición por penales en caso de empates en fases eliminatorias.
* **Estadísticas de Goleadores y Asistidores**: Actualización instantánea en la barra lateral conforme se registran los eventos de goles y asistencias en cada partido.
* **Conversión Automática de Zona Horaria**: Los partidos se configuran en formato UTC y la aplicación los convierte dinámicamente a la zona horaria del usuario local.
* **Reproductor de Música Integrado**: Un reproductor flotante e interactivo que reproduce canciones icónicas del Mundial (como *Waka Waka* de Shakira en español y *Wavin' Flag* de K'Naan) y éxitos elegidos (*Balada* de Gusttavo Lima y *Ai Se Eu Te Pego* de Michel Teló) consumiendo archivos MP3 directamente desde repositorios públicos.
* **Persistencia con LocalStorage**: Todo el progreso del mundial, los marcadores cargados y los datos ingresados se guardan de forma persistente en tu navegador.

---

## Guía de Ejecución Rápida (Windows)

### Opción 1: Ejecución Automática (Doble Clic)
1. Descarga o clona el repositorio.
2. Ve a la carpeta del proyecto (`Entregas/Rodrigo_Antunez_TFI`).
3. Haz doble clic en el archivo **`iniciar.bat`**.
   * *Este script automatizado instalará las dependencias necesarias (`npm install`), iniciará el servidor de desarrollo en la terminal y abrirá la aplicación en tu navegador web.*

### Opción 2: Ejecución Manual en Terminal
Si prefieres correrlo tú mismo desde una consola:
1. Abre tu terminal en la carpeta del proyecto.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo con Vite:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:5173/](http://localhost:5173/) en tu navegador.

---

## Decisiones de Diseño y Arquitectura

1. **Arquitectura Limpia (Separación de Responsabilidades)**:
   * `src/data/`: Datos estáticos iniciales de los 32 equipos y el calendario completo del Mundial 2026.
   * `src/logic/`: Funciones puras para el cálculo de posiciones de grupos, desempates FIFA y propagación de eliminatorias.
   * `src/ui/`: Módulos de renderizado dinámico del DOM para cada sección.
   * `src/main.js`: Controlador principal (orquestador) del flujo de datos, persistencia en storage y eventos.

2. **Propagación en Cascada Segura**:
   Al modificar el resultado de un partido de fase de grupos que altere los clasificados a playoffs, el fixture recalcula dinámicamente a los rivales y limpia de forma segura cualquier marcador futuro para prevenir inconsistencias lógicas en el bracket.

3. **Optimización de Entrada de Datos**:
   Formulario intuitivo y rápido para ingresar marcadores, goleadores y asistentes de manera ágil sin recargar la página.

4. **Reproductor de Audio Robusto**:
   El reproductor flotante consume audio a través de la API estándar de JavaScript `new Audio()`. Se implementó un controlador de errores (`error` event listener) para que, en caso de fallo de red al consumir un MP3 desde repositorios externos, el reproductor avance automáticamente a la siguiente canción sin interrumpir la experiencia del usuario.
