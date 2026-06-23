# ⚽ Fixture Interactivo — Copa Mundial FIFA 2026

**Materia:** Programación III · Tecnicatura en Programación  
**Entrega:** 28 de Junio de 2026  
**Ponderación:** 40% de la nota final

---

## 👥 Integrante

| Nombre | Legajo |
|---|---|
| Juarez Kevin Alexis | 63905 |

---

## 📋 Descripción general

Aplicación web interactiva tipo SPA (Single Page Application) para gestionar y visualizar el fixture completo de la **Copa Mundial FIFA 2026** (48 equipos, 12 grupos, 104 partidos), desde la fase de grupos hasta la gran final.

El sistema fue construido completamente en el cliente, sin backend. Toda la lógica de negocio —cálculo de puntos, desempates, generación de brackets— vive en módulos independientes bajo `src/logic/`, separada de la capa visual.

### Funcionalidades principales

- **Pantalla de inicio** con últimos resultados cargados y próximos partidos, ordenados por relevancia de ronda
- **Fase de grupos** con tablas de posiciones que se recalculan automáticamente al cargar cada resultado, aplicando criterios de desempate FIFA
- **Bracket eliminatorio** completo: Dieciseisavos → Octavos → Cuartos → Semifinales → Final + Tercer Puesto, con propagación automática de ganadores
- **Panel de administración** (rol admin) para cargar resultados, registrar goles con autor, minuto y asistencia
- **Top de goleadores y asistidores** actualizado en tiempo real
- **Sistema de usuarios** con autenticación local y roles (usuario / admin)
- **Predicciones** por partido, disponibles para usuarios registrados
- **Sección de noticias** y sedes oficiales del torneo (EE.UU., Canadá, México)
- **Generación aleatoria** del torneo completo para pruebas rápidas
- **Exportación e importación** del estado del torneo en formato JSON
- **Persistencia** total mediante `localStorage`: los datos sobreviven a recargas y cierres de pestaña

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.x | Framework de UI y manejo de estado (Context API + hooks) |
| Vite | 8.x | Bundler y servidor de desarrollo |
| React Router DOM | 7.x | Navegación entre páginas (SPA) |
| country-flag-icons | 1.6.x | Banderas de países por código ISO 3166-1 Alpha-2 |
| CSS plano (archivos por módulo) | — | Estilos separados por componente y página |
| localStorage | API nativa del browser | Persistencia de partidos, usuarios y sesión activa |

> No se utilizan dependencias de backend ni bases de datos externas. Toda la lógica corre en el cliente.

---

## 🚀 Instalación y ejecución

### Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior

```bash
# Verificar versiones
node -v
npm -v
```

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd fixture-mundial

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

### Build para producción

```bash
npm run build    # genera la carpeta dist/
npm run preview  # sirve el build localmente para verificar
```

---

## 👤 Acceso y roles

El sistema distingue dos roles de usuario:

| Rol | Cómo obtenerlo | Acceso extra |
|---|---|---|
| **Usuario** | Registrarse con cualquier correo | Predicciones por partido |
| **Administrador** | Registrarse con `admin@mundial.com` | Panel Admin completo |

Desde el **Panel Admin** se pueden:
- Cargar resultados de cualquier partido (fase de grupos y eliminatorias)
- Registrar goles indicando jugador, minuto y asistencia
- Editar o borrar resultados ya cargados
- Reiniciar el torneo o generar uno completo con datos aleatorios (útil para pruebas)
- Exportar el estado actual a JSON e importar torneos guardados previamente

---

## 📁 Estructura del proyecto

```
fixture-mundial/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── assets/               # Imágenes estáticas (logo, hero)
    ├── components/
    │   ├── Bracket.jsx       # Bracket eliminatorio visual (usado en Grupos)
    │   ├── Footer.jsx        # Pie de página
    │   ├── Header.jsx        # Navegación principal y autenticación
    │   ├── Intro.jsx         # Pantalla de introducción animada (se muestra una sola vez)
    │   ├── ModalNoticia.jsx  # Modal de vista rápida para noticias
    │   └── ModalPredecir.jsx # Modal de predicción de resultados
    ├── context/
    │   ├── TorneoContext.jsx # Estado global del torneo: partidos, resultados, playoffs
    │   ├── AuthContext.jsx   # Estado global de autenticación y usuarios
    │   ├── NoticiasContext.jsx
    │   └── PrediccionesContext.jsx
    ├── data/
    │   ├── equipos.js        # 48 equipos con nombre, código ISO y grupo asignado
    │   ├── partidos.js       # Calendario completo de fase de grupos con fechas y horarios
    │   └── sedes.js          # Sedes y estadios oficiales del torneo
    ├── logic/
    │   ├── posiciones.js     # Cálculo de tablas de posiciones y criterios de desempate FIFA
    │   ├── playoffs.js       # Generación de rondas eliminatorias y clasificación de terceros
    │   └── estadisticas.js   # Cálculo de rankings de goleadores y asistidores
    ├── pages/
    │   ├── Inicio.jsx        # Últimos resultados, próximos partidos y sedes
    │   ├── Grupos.jsx        # Fase de grupos: fixture por grupo y tablas de posiciones
    │   ├── Playoffs.jsx      # Bracket eliminatorio: Dieciseisavos a Final
    │   ├── Equipos.jsx       # Lista de los 48 equipos organizados por grupo
    │   ├── Noticias.jsx      # Feed de noticias del torneo
    │   ├── NoticiaDetalle.jsx
    │   ├── PanelAdmin.jsx    # Panel de carga de resultados (solo administradores)
    │   └── Predicciones.jsx  # Predicciones del usuario logueado
    ├── styles/               # Archivos CSS separados por componente y página
    ├── App.jsx               # Enrutamiento principal (React Router)
    └── main.jsx              # Punto de entrada de la aplicación
```

---

## ⚙️ Decisiones de diseño y técnicas relevantes

### Separación estricta entre lógica y presentación

Toda la lógica del torneo vive en `src/logic/` y opera sobre datos planos (arrays y objetos), sin ninguna referencia a React. Los componentes consumen esos resultados pero no calculan nada por su cuenta. Esto permite testear la lógica de forma completamente independiente de la interfaz.

### Estado global con Context API

Se utilizan tres contextos independientes (`TorneoContext`, `AuthContext`, `NoticiasContext`, `PrediccionesContext`) en lugar de un único store global. Cada dominio maneja su propio estado aislado, lo que reduce re-renders innecesarios y hace más predecible el flujo de datos.

### Criterios de desempate FIFA implementados en orden reglamentario

La función `calcularPosiciones()` en `posiciones.js` aplica los siguientes criterios en cascada:
1. Puntos totales
2. Diferencia de goles
3. Goles a favor
4. Resultado del enfrentamiento directo entre los equipos empatados
5. Diferencia de goles en el enfrentamiento directo
6. Orden alfabético como criterio final determinístico

### Formato oficial Mundial 2026

48 equipos en 12 grupos de 4. Clasifican los 2 primeros de cada grupo (24) más los 8 mejores terceros = 32 clasificados. La fase eliminatoria va de Dieciseisavos (16 partidos) a Final, más el partido por el Tercer Puesto. Total: 104 partidos.

La función `generarRondaDe32()` en `playoffs.js` aplica el cruce oficial: los 12 primeros quedan emparejados exactamente una vez con los 12 segundos (cruces 1°A vs 2°B, 1°C vs 2°D, etc.), y los 8 mejores terceros se cruzan entre sí para garantizar matemáticamente que los 32 clasificados sean todos distintos sin repetición en el bracket.

### Generación reactiva del bracket

Cada vez que se carga un resultado de una ronda eliminatoria, `TorneoContext` recalcula automáticamente si todos los partidos de esa ronda ya tienen ganador. Si es así, genera los partidos de la siguiente ronda y los agrega al estado. Si se borra o modifica un resultado, todas las rondas posteriores se eliminan para evitar inconsistencias.

### Persistencia con localStorage

Los resultados cargados se guardan automáticamente bajo la clave `mundial2026_partidos` cada vez que el estado del torneo cambia. Los datos sobreviven a recargas, cierres de pestaña y reinicios del navegador. La sesión del usuario activo también persiste entre visitas.

### Funcionalidades extra implementadas

- **Predicciones por partido:** los usuarios registrados pueden predecir el resultado de cualquier partido antes de que se cargue el resultado real.
- **Generación aleatoria del torneo:** el administrador puede simular un torneo completo con resultados aleatorios en un solo clic, incluyendo goles, asistencias y penales cuando corresponde.
- **Exportación e importación JSON:** el estado completo del torneo puede exportarse como archivo `.json` e importarse en otra sesión o dispositivo.
- **Últimos 5 resultados por equipo:** en la página de Grupos, cada fila de la tabla muestra los últimos 5 resultados del equipo (W/D/L) con íconos de color.
- **Pantalla de introducción animada:** se muestra una sola vez por sesión al primer ingreso.

---

## 🗺️ Rutas disponibles

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio: últimos resultados y próximos partidos | Público |
| `/grupos` | Fase de grupos: fixture y tablas de posiciones | Público |
| `/playoffs` | Bracket eliminatorio completo | Público |
| `/equipos` | Lista de los 48 equipos por grupo | Público |
| `/noticias` | Noticias del torneo | Público |
| `/noticias/:slug` | Detalle de una noticia | Público |
| `/predicciones` | Predicciones del usuario logueado | Requiere login |
| `/admin` | Panel de carga de resultados | Solo administrador |

---

## ⚠️ Pendiente / Mejoras futuras

- Conversión automática de horarios a la zona horaria local del usuario
- Partido por el Tercer Puesto visible en el bracket principal
- Estadísticas extendidas: tarjetas, minutos jugados por equipo

---

*Tecnicatura en Programación · Materia: Programación III · Entrega: 28 de Junio de 2026*