## 👥 Integrante

| Nombre | Legajo |
|Juarez Kevin Alexis|63905|
| *(completar)* | *(completar)* |

---


# ⚽ Fixture Interactivo — Copa Mundial FIFA 2026

Aplicación web interactiva para gestionar y visualizar el fixture completo del Mundial 2026, desde la fase de grupos hasta la gran final, con actualización dinámica de resultados, tablas de posiciones y estadísticas en tiempo real.

---

## 📋 Descripción general

El sistema permite simular un torneo de 48 equipos divididos en 12 grupos, con un total de 104 partidos. Incluye:

- Pantalla de inicio animada con últimos resultados y próximos partidos
- Fase de grupos con tablas de posiciones que se recalculan automáticamente
- Bracket eliminatorio (Dieciseisavos → Octavos → Cuartos → Semis → Final + 3er Puesto) con propagación automática de ganadores
- Panel de administración para cargar resultados, goles y asistencias
- Top de goleadores y asistidores actualizado en tiempo real
- Sistema de usuarios con autenticación local (roles: usuario / admin)
- Sección de noticias y sedes oficiales del torneo
- Persistencia de datos mediante `localStorage`

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.x | Framework de UI / manejo de estado |
| Vite | 5.x | Bundler y servidor de desarrollo |
| React Router DOM | 6.x | Navegación entre páginas (SPA) |
| country-flag-icons | última | Renderizado de banderas por código ISO |
| CSS Modules (archivos separados) | — | Estilos por componente/página |
| localStorage | API nativa | Persistencia de partidos, usuarios y sesión |

> No se utilizan dependencias de backend. Toda la lógica corre en el cliente.

---

## 🚀 Instalación y ejecución

### Requisitos previos

- Node.js **18 o superior**
- npm **9 o superior**

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

La aplicación estará disponible en `http://localhost:5173`

### Build para producción

```bash
npm run build
npm run preview
```

---

## 👤 Acceso al Panel de Administración

El sistema distingue dos roles:

| Rol | Cómo obtenerlo |
|---|---|
| **Usuario** | Registrarse con cualquier correo |
| **Administrador** | Registrarse con el correo `admin@mundial.com` |

Desde el Panel Admin (visible solo para administradores) se pueden cargar resultados, registrar goles con sus autores y asistencias, y configurar fecha/hora de próximos partidos.

---

## 📁 Estructura del proyecto

```
src/
├── assets/               # Imágenes estáticas (logo, hero)
├── components/
│   ├── Bracket.jsx       # Componente del bracket eliminatorio visual
│   ├── Footer.jsx        # Pie de página
│   ├── Header.jsx        # Navegación y sistema de autenticación
│   ├── Intro.jsx         # Pantalla de introducción animada
│   └── ModalNoticia.jsx  # Modal de vista rápida de noticias
├── context/
│   ├── AuthContext.jsx   # Estado global de autenticación de usuarios
│   ├── NoticiasContext.jsx # Estado global de noticias
│   └── TorneoContext.jsx # Estado global del torneo (partidos, resultados, playoffs)
├── data/
│   ├── equipos.js        # 48 equipos con nombre, código ISO y grupo
│   ├── partidos.js       # Calendario completo de fase de grupos con fechas/horas
│   └── sedes.js          # Sedes y estadios oficiales (USA, Canadá, México)
├── logic/
│   ├── estadisticas.js   # Cálculo de goleadores y asistidores
│   ├── playoffs.js       # Generación de rondas eliminatorias y clasificación de terceros
│   └── posiciones.js     # Cálculo de tablas de posiciones y criterios de desempate FIFA
├── pages/
│   ├── Inicio.jsx        # Página principal: últimos resultados, próximos partidos, sedes
│   ├── Grupos.jsx        # Fase de grupos: fixture y tablas de posiciones
│   ├── Equipos.jsx       # Lista de los 48 equipos organizados por grupo
│   ├── Noticias.jsx      # Feed de noticias del torneo
│   ├── NoticiaDetalle.jsx# Vista individual de noticia
│   └── PanelAdmin.jsx    # Panel de carga de resultados (solo administradores)
├── styles/               # Archivos CSS separados por componente/página
├── App.jsx               # Enrutamiento principal
└── main.jsx              # Punto de entrada de la aplicación
```

---

## ⚙️ Decisiones de diseño y técnicas relevantes

### Lógica separada de la interfaz
Toda la lógica del torneo (cálculo de posiciones, desempates, generación de brackets) vive en `src/logic/`. Los componentes consumen esos resultados pero no calculan nada por su cuenta. Esto cumple el principio de separación de responsabilidades y facilita el testing de la lógica de forma independiente.

### Estado global con Context API
Se utilizan tres contextos independientes (`TorneoContext`, `AuthContext`, `NoticiasContext`) en lugar de un único store global, para mantener cada dominio aislado y evitar re-renders innecesarios.

### Criterios de desempate FIFA implementados
La función `calcularPosiciones()` en `posiciones.js` aplica los criterios reglamentarios en orden:
1. Puntos
2. Diferencia de goles
3. Goles a favor
4. Resultado del enfrentamiento directo
5. Diferencia de goles en el enfrentamiento directo

### Formato oficial del Mundial 2026
48 equipos · 12 grupos de 4 · clasifican 1°, 2° y los 8 mejores terceros → 32 clasificados a la fase eliminatoria. La generación de la Ronda de 32 (dieciseisavos) es automática al completarse la fase de grupos, respetando el cruce oficial por grupo.

### Persistencia con localStorage
Los resultados cargados se guardan automáticamente en `localStorage` bajo la clave `mundial2026_partidos`, por lo que los datos sobreviven a recargas de página. La sesión del usuario también persiste entre visitas.

### Animaciones y UX
- Fondo con animación de zoom suave (Ken Burns) para dinamismo visual
- Hover con escala en cards de partidos, sedes y equipos
- Orden de últimos resultados priorizado por importancia de ronda (Final → 3er Puesto → Semis → Cuartos → etc.)
- Pantalla de introducción animada al primer ingreso

---

## 🗺️ Rutas disponibles

| Ruta | Página |
|---|---|
| `/` | Inicio: últimos resultados y próximos partidos |
| `/grupos` | Fase de grupos: fixture y tablas de posiciones |
| `/equipos` | Lista de los 48 equipos |
| `/noticias` | Noticias del torneo |
| `/noticias/:slug` | Detalle de una noticia |
| `/admin` | Panel de administración *(solo admin)* |

---



*Tecnicatura en Programación · Programación III · Entrega: 28 de Junio de 2026*
