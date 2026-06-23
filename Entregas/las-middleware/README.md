# ⚽ Mundial 2026 — Predicciones & Fixture Tracker

**Programación III** — Tecnicatura en Programación

Una aplicación web interactiva para seguir el Mundial 2026 (EE.UU., México, Canadá): consultá el fixture, resultados en tiempo real, tablas de grupos, bracket eliminatorio, estadísticas de jugadores y pronosticá los resultados de los partidos.

---

## Integrantes

- **Brandan Tamara**
- **Mercado Sofia**

---

## Herramientas utilizadas

| Herramienta | Descripción |
|-------------|-------------|
| **React 19 + TypeScript** | Frontend moderno con componentes reutilizables, tipado estático y Vite como bundler |
| **FastAPI + Python 3.12** | Backend RESTful con documentación automática (Swagger) |
| **SQLite** | Base de datos embebida, liviana y sin configuración |
| **SQLAlchemy** | ORM para la interacción con la base de datos desde Python |
| **Chart.js + react-chartjs-2** | Gráficos estadísticos interactivos (goleadores, asistencias, rendimiento) |
| **Vite** | Herramienta de build ultrarrápida para el frontend |
| **LocalStorage** | Persistencia de predicciones y tema visual en el navegador |
| **CSS Variables** | Sistema de temas dark/light sin librerías externas |

---

## Estructura del proyecto

```
fixture-mundial/
├── README.md
├── index.html                     # App vanilla (versión original)
├── src/                           # Frontend vanilla (original)
│   ├── data/                      # Datos de equipos y partidos
│   ├── logic/                     # Lógica de posiciones, playoffs, estadísticas
│   ├── ui/                        # Renderizado de componentes UI
│   └── main.js                    # Estado global y orquestación
├── styles/
│   └── main.css
├── backend/                       # API REST FastAPI
│   ├── main.py                    # Punto de entrada del servidor
│   ├── database.py                # Configuración de SQLite + SQLAlchemy
│   ├── models.py                  # Modelos de datos (Partido, Equipo, etc.)
│   ├── schemas.py                 # Esquemas Pydantic para validación
│   ├── seed.py                    # Seed con 40 partidos de grupo con resultados
│   ├── auth.py                    # Autenticación básica
│   ├── routers/                   # Routers de la API
│   ├── logic/                     # Lógica de negocio del backend
│   └── mundial.db                 # Base de datos SQLite
└── frontend-react/               # Frontend React + TypeScript
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── public/
    │   └── assets/
    │       ├── flags/             # 47 banderas PNG (flagcdn.com)
    │       └── jugadores/         # Imágenes de jugadores destacados
    ├── src/
    │   ├── main.tsx               # Entry point de React
    │   ├── App.tsx                # Root component con layout, navbar, routing
    │   ├── App.css                # Estilos globales, temas, animaciones
    │   ├── index.css              # Estilos base
    │   ├── api/                   # Cliente HTTP para la API
    │   ├── types/                 # Tipos TypeScript compartidos
    │   └── components/
    │       ├── Equipos.tsx        # Parrilla de selecciones con banderas
    │       ├── Grupos.tsx         # Tablas de posiciones por grupo
    │       ├── Fixture.tsx        # Calendario de partidos con filtros
    │       ├── Bracket.tsx        # Árbol eliminatorio interactivo
    │       ├── Estadisticas.tsx   # Gráficos de goleadores y asistencias
    │       ├── Predicciones.tsx   # Pronósticos, puntuación y carga de resultados
    │       ├── JugadoresDestacados.tsx  # Tarjetas de jugadores estrella
    │       └── Calendario.tsx     # Vista general del torneo
    └── start-dev.bat              # Script para iniciar backend + frontend
```


---

## Funciones de la aplicación

### 🏟️ Equipos (`Equipos.tsx`)
- Vista general de las 48 selecciones del Mundial 2026
- Cada equipo muestra su bandera, nombre y grupo
- Diseño responsive con grid adaptativo

### 📊 Grupos (`Grupos.tsx`)
- Tablas de posiciones de los 12 grupos (A–L)
- Columnas: #, Equipo, PJ, PG, PE, PP, GF, GC, DG, PTS
- Ordenamiento automático por puntos, diferencia de gol, goles a favor
- 1° y 2° resaltados como clasificados a la fase eliminatoria

### 🗓️ Fixture (`Fixture.tsx`)
- Lista completa de partidos con filtros por fase (Grupos, R32, R16, Cuartos, Semis, Tercer puesto, Final)
- Cada partido muestra banderas, nombres de equipos, fecha y resultado
- Botón para ver detalle en un modal interactivo

### 🏆 Bracket (`Bracket.tsx`)
- Árbol eliminatorio completo desde Dieciseisavos (R32) hasta la Final
- Las llaves se actualizan automáticamente al cargar resultados
- Diseño responsive con columnas adaptables

### 📈 Estadísticas (`Estadisticas.tsx`)
- Gráfico de barras de goleadores del torneo (Chart.js)
- Gráfico de anillos de asistencias
- Datos en tiempo real según los resultados cargados

### ⭐ Jugadores Destacados (`JugadoresDestacados.tsx`)
- Tarjetas con foto, nombre, edad, posición, club, país y estadísticas
- 9 jugadores estrella: Messi, Cristiano Ronaldo, Haaland, Vinícius Jr., Bellingham, Harry Kane, Dibu Martínez, Griezmann, Son Heung-min
- Diseño visual con hover effects y glassmorphism

### 🎯 Predicciones (`Predicciones.tsx`)
- Pronosticá el resultado de partidos pendientes (local y visitante)
- **Sistema de puntuación:** 10 pts por resultado exacto, 5 pts por acertar ganador/empate
- Barra de progreso con puntaje acumulado
- Resultados guardados vs tu pronóstico con badges (+10 pts, +5 pts)
- **Cargar resultado real:** formulario para ingresar resultado oficial y enviarlo al backend vía API
- 🎲 **Botón "Sugerir resultados"** con animación de dado giratorio — genera resultados aleatorios (0–3 goles) para todos los pendientes
- ⚽ **Animación de entrada:** pelota que se acerca y desaparece al abrir la sección (3 segundos)
- Persistencia en localStorage

### 📅 Calendario (`Calendario.tsx`)
- Vista resumida con tarjetas de cada fase del torneo
- Fechas, cantidad de partidos y equipos participantes

### 🎨 Tema oscuro/claro
- Toggle en el navbar con icono de sol/luna
- Preferencia guardada en localStorage
- CSS custom properties para transiciones suaves

---

## Instalación y ejecución

### Requisitos
- Node.js 18+
- Python 3.12+
- npm

### Pasos

```bash
# 1. Backend
cd backend
pip install -r ../requirements.txt
python -m uvicorn main:app --reload --port 8000

# 2. Frontend React
cd frontend-react
npm install
npm run dev
```

O usando el script incluido:
```
start-dev.bat
```

Luego abrir `http://localhost:5173`

---
