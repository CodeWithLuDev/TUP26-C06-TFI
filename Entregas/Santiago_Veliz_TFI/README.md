# 🏆 FIFA World Cup 2026™ - Simulador y Fixture Interactivo

Una aplicación web (Single Page Application) diseñada para simular, gestionar y visualizar de forma interactiva la Copa Mundial de la FIFA 2026. El sistema permite administrar todo el transcurso del torneo, desde la fase de grupos hasta la generación dinámica del bracket eliminatorio, con persistencia de datos y herramientas de simulación.

---

<p align="center">
  <img src="preview.jpg" alt="Mundial 2026 Preview" width="100%" style="border-radius: 10px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);" />
</p>

---

## 👨‍💻 Integrante del Proyecto
* **Nombre:** Santiago Emmanuel Veliz
* **Legajo:** 63785
* **Materia:** Programación III (Tecnicatura en Programación)
* **Modalidad:** Individual

---

## 🛠️ Stack Tecnológico

El proyecto fue desarrollado priorizando código limpio, rendimiento y modularidad, sin depender de frameworks pesados:

* **HTML5:** Estructura semántica de la SPA.
* **CSS3 (Vanilla):** Diseño responsivo y moderno, animaciones de interfaz (como el banner de campeón) y manejo de estado visual.
* **JavaScript (ES6+):** Lógica de negocio estructurada a través de ES Modules (`import`/`export`), manipulación dinámica del DOM y manejo de eventos.
* **LocalStorage API:** Motor de base de datos en el cliente para la persistencia del torneo.

---

## ✨ Características Principales

* **Fase de Grupos y Fixture:** Visualización de las 32 selecciones y carga interactiva de resultados con validación de datos.
* **Fase Eliminatoria Dinámica (Bracket):** Árbol del torneo que se genera automáticamente basándose en los clasificados de los grupos, propagando a los ganadores desde Dieciseisavos hasta la Final.
* **Simulador Aleatorio Integrado:** Algoritmo que permite simular de forma automática todos los partidos pendientes del torneo (con probabilidades realistas de goles) para testear el bracket y coronar un campeón instantáneamente.
* **Wiki de Equipos y Sedes:** Fichas informativas detalladas de cada selección y visualización de los estadios del torneo con enlaces directos de geolocalización en **Google Maps**.
* **Buscadores en Tiempo Real:** Filtros dinámicos integrados en la grilla de equipos y en las tablas de estadísticas (Goleadores y Asistidores) para encontrar información sin recargar la página.
* **Animaciones de Estado:** Banner especial dinámico que se dispara en pantalla completa al registrarse el resultado del partido final.
* **Persistencia y Reseteo Seguro:** El progreso se guarda automáticamente en el navegador. Incluye un mecanismo de "Reseteo" que purga el LocalStorage y devuelve la aplicación a su estado de fábrica de forma segura.

---

## 🏗️ Arquitectura del Proyecto

El código fuente está dividido lógicamente para separar la interfaz de los datos y las reglas de negocio:

* `src/data/`: Fuentes de datos estáticas (JSON/JS objects) de equipos, estadios y el cronograma de partidos.
* `src/logic/`: Lógica matemática del torneo (cálculo de tablas de posiciones, algoritmos de goleadores/asistidores y manejo del bracket eliminatorio).
* `src/ui/`: Módulos encargados exclusivamente del renderizado en el DOM, modales y captura de eventos de usuario (ej. `renderEquipos.js`, `bracket.js`, `simulador.js`).

---

## 🚀 Guía de Ejecución

Al ser un proyecto desarrollado en Vanilla JavaScript y ES Modules, no requiere compilación previa.

1. Clonar o descargar el repositorio en tu máquina local.
2. Abrir la carpeta del proyecto en tu editor de código (ej. Visual Studio Code).
3. Iniciar un servidor local. Se recomienda usar la extensión **Live Server**:
   * Haz clic derecho sobre el archivo `index.html` y selecciona *"Open with Live Server"*.
4. La aplicación se abrirá automáticamente en tu navegador por defecto (usualmente en `http://localhost:3000` o `http://127.0.0.1:5500`).