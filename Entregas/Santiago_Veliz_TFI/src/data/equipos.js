/**
 * ============================================================================
 * /src/data/equipos.js
 * ============================================================================
 * Este archivo es nuestra "base de datos" inicial de equipos, en forma de
 * un simple array de objetos JavaScript. No depende de ningún otro módulo:
 * es la fuente de la verdad sobre qué equipos existen, a qué grupo
 * pertenecen y qué información histórica ("wiki") tienen.
 *
 * ¿Quién va a usar este archivo?
 *   - /src/ui/grupos.js      -> para dibujar el escudo/nombre en cada tabla
 *   - /src/logic/posiciones.js -> para inicializar la tabla de posiciones
 *   - /src/ui/bracket.js     -> para mostrar los equipos en la llave
 *   - La vista "Wiki de equipos" -> usa directamente el campo `wiki`
 *
 * IMPORTANTE (aclaración académica):
 * Los datos de historia, mundiales y director técnico (DT) fueron
 * verificados como reales al momento de escribir este archivo (junio 2026,
 * previo/durante el Mundial 2026). El campo `grupo` de cada equipo es
 * FICTICIO (lo definimos nosotros para el simulador) y no corresponde al
 * sorteo real del torneo. Antes de una entrega final, revisar si hace
 * falta actualizar el ranking FIFA o el cuerpo técnico vigente.
 *
 * NOTA SOBRE EL CAMPO "escudo":
 * En vez de usar el escudo oficial de cada federación (que podría tener
 * derechos de imagen/marca registrada), usamos la BANDERA del país como
 * referencia visual, servida desde flagcdn.com (gratuito y de uso libre).
 * Si en el futuro se necesita el escudo real, alcanza con reemplazar esta
 * URL por la del escudo correspondiente.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ARRAY PRINCIPAL DE EQUIPOS
// Usamos "export const" (exportación nombrada) para que otros archivos
// puedan importar específicamente esta variable así:
//   import { equipos } from '../data/equipos.js';
// ----------------------------------------------------------------------------
export const equipos = [
  // ==========================================================================
  // EQUIPO 1: ARGENTINA
  // ==========================================================================
  {
    // Identificador único e inmutable del equipo. Lo usamos como "clave"
    // en vez del nombre completo, porque el nombre podría repetirse o
    // tener tildes/espacios que compliquen comparaciones o IDs de HTML.
    id: "arg",

    nombre: "Argentina",
    nombreCorto: "ARG", // útil para mostrar en espacios chicos (ej. el bracket)
    confederacion: "CONMEBOL",

    // Grupo FICTICIO definido por nosotros para este simulador académico.
    grupo: "A",

    // Bandera usada como referencia visual del equipo (ver nota arriba).
    escudo: "https://flagcdn.com/w320/ar.png",

    // Colores institucionales, pensados para usarlos en el diseño (por
    // ejemplo, en el borde superior de la tarjeta de equipo o en el bracket).
    colores: {
      principal: "#75AADB", // celeste
      secundario: "#FFFFFF", // blanco
    },

    // Ranking FIFA ilustrativo (ajustar con el valor oficial si se necesita
    // precisión exacta al momento de la entrega).
    rankingFifa: 1,

    /**
     * estadisticasTorneo
     * ---------------------------------------------------------------------
     * Este objeto representa el ESTADO ACTUAL del equipo DENTRO de este
     * torneo (no su historia). Arranca todo en cero porque todavía no se
     * jugó ningún partido.
     *
     * Lógica matemática que se aplicará más adelante en
     * /src/logic/posiciones.js (regla FIFA estándar de puntaje):
     *   - Victoria (PG)  -> suma 3 puntos
     *   - Empate   (PE)  -> suma 1 punto
     *   - Derrota  (PP)  -> suma 0 puntos
     *   - Diferencia de gol (DG) = Goles a Favor (GF) - Goles en Contra (GC)
     *   - Se usa para definir posiciones cuando dos o más equipos empatan
     *     en puntos (a mayor DG, mejor posición).
     *
     * Estos valores NO se guardan "a mano": se recalculan automáticamente
     * cada vez que se carga un resultado nuevo, recorriendo TODOS los
     * partidos jugados por el equipo (ver /src/logic/posiciones.js cuando
     * lo creemos). Los dejamos inicializados en 0 acá como estado por
     * defecto / valor de reseteo.
     */
    estadisticasTorneo: {
      puntos: 0,
      partidosJugados: 0,
      partidosGanados: 0,
      partidosEmpatados: 0,
      partidosPerdidos: 0,
      golesFavor: 0,
      golesContra: 0,
      diferenciaGoles: 0,
    },

    /**
     * wiki
     * ---------------------------------------------------------------------
     * Información histórica/enciclopédica del equipo, totalmente
     * independiente de este torneo ficticio. Acá vive todo lo que va a
     * mostrar la sección "Wiki de Equipos".
     */
    wiki: {
      resumenHistorico:
        "Una de las selecciones más laureadas de Sudamérica. Tricampeona " +
        "del mundo, reconocida por su pasión futbolera y por haber sido " +
        "cuna de figuras históricas como Diego Maradona y Lionel Messi.",

      mundialesGanados: 3,
      aniosCampeon: [1978, 1986, 2022],

      // Útil para equipos que todavía no ganaron un mundial (ver México más
      // abajo); en este caso lo dejamos como dato complementario.
      mejorResultado: "Campeón del Mundo",

      directorTecnico: {
        nombre: "Lionel Scaloni",
        nacionalidad: "Argentina",
      },

      // Algunos jugadores destacados de la actualidad/historia reciente,
      // para mostrar en la ficha de la wiki.
      jugadoresDestacados: [
        { nombre: "Lionel Messi", posicion: "Delantero" },
        { nombre: "Julián Álvarez", posicion: "Delantero" },
        { nombre: "Emiliano Martínez", posicion: "Arquero" },
      ],

      // Referencia al estadio "emblemático" del equipo en su país (NO es la
      // sede del torneo). Vamos a usar este id para conectar con un futuro
      // /src/data/estadios.js (todavía no creado).
      estadioLocalId: "monumental",
    },
  },

  // ==========================================================================
  // EQUIPO 2: MÉXICO
  // ==========================================================================
  {
    id: "mex",
    nombre: "México",
    nombreCorto: "MEX",
    confederacion: "CONCACAF",
    grupo: "A", // mismo grupo ficticio que Argentina, solo para el demo

    escudo: "https://flagcdn.com/w320/mx.png",

    colores: {
      principal: "#006847", // verde
      secundario: "#FFFFFF",
    },

    rankingFifa: 12,

    // Mismo patrón que el equipo anterior: arranca en cero, se recalcula solo.
    estadisticasTorneo: {
      puntos: 0,
      partidosJugados: 0,
      partidosGanados: 0,
      partidosEmpatados: 0,
      partidosPerdidos: 0,
      golesFavor: 0,
      golesContra: 0,
      diferenciaGoles: 0,
    },

    wiki: {
      resumenHistorico:
        "Selección anfitriona del Mundial en tres ediciones (1970, 1986 y " +
        "2026), respaldada por una de las hinchadas más numerosas y " +
        "fervientes del fútbol mundial.",

      mundialesGanados: 0,
      aniosCampeon: [],
      mejorResultado: "Cuartos de final (1970 y 1986)",

      directorTecnico: {
        nombre: "Javier Aguirre",
        nacionalidad: "México",
      },

      jugadoresDestacados: [
        { nombre: "Guillermo Ochoa", posicion: "Arquero" },
        { nombre: "Raúl Jiménez", posicion: "Delantero" },
        { nombre: "Edson Álvarez", posicion: "Mediocampista" },
      ],

      estadioLocalId: "azteca",
    },
  },

  // ==========================================================================
  // EQUIPO 3: FRANCIA
  // ==========================================================================
  {
    id: "fra",
    nombre: "Francia",
    nombreCorto: "FRA",
    confederacion: "UEFA",
    grupo: "B",

    escudo: "https://flagcdn.com/w320/fr.png",

    colores: {
      principal: "#0055A4", // azul
      secundario: "#EF4135", // rojo
    },

    rankingFifa: 2,

    estadisticasTorneo: {
      puntos: 0,
      partidosJugados: 0,
      partidosGanados: 0,
      partidosEmpatados: 0,
      partidosPerdidos: 0,
      golesFavor: 0,
      golesContra: 0,
      diferenciaGoles: 0,
    },

    wiki: {
      resumenHistorico:
        "Potencia europea bicampeona del mundo, reconocida por su " +
        "capacidad de renovación generacional y por contar con una de las " +
        "canteras de talento más prolíficas del continente.",

      mundialesGanados: 2,
      aniosCampeon: [1998, 2018],
      mejorResultado: "Campeón del Mundo",

      directorTecnico: {
        nombre: "Didier Deschamps",
        nacionalidad: "Francia",
      },

      jugadoresDestacados: [
        { nombre: "Kylian Mbappé", posicion: "Delantero" },
        { nombre: "Ousmane Dembélé", posicion: "Delantero" },
        { nombre: "Aurélien Tchouaméni", posicion: "Mediocampista" },
      ],

      estadioLocalId: "saint-denis",
    },
  },

  // ==========================================================================
  // EQUIPO 4: ESPAÑA
  // ==========================================================================
  {
    id: "esp",
    nombre: "España",
    nombreCorto: "ESP",
    confederacion: "UEFA",
    grupo: "B",

    escudo: "https://flagcdn.com/w320/es.png",

    colores: {
      principal: "#AA151B", // rojo
      secundario: "#F1BF00", // amarillo
    },

    rankingFifa: 4,

    estadisticasTorneo: {
      puntos: 0,
      partidosJugados: 0,
      partidosGanados: 0,
      partidosEmpatados: 0,
      partidosPerdidos: 0,
      golesFavor: 0,
      golesContra: 0,
      diferenciaGoles: 0,
    },

    wiki: {
      resumenHistorico:
        "Campeona del mundo en 2010 y referente del fútbol de posesión " +
        "conocido como 'tiki-taka', con una notable generación de relevo " +
        "surgida tras el título de la Eurocopa 2024.",

      mundialesGanados: 1,
      aniosCampeon: [2010],
      mejorResultado: "Campeón del Mundo",

      directorTecnico: {
        nombre: "Luis de la Fuente",
        nacionalidad: "España",
      },

      jugadoresDestacados: [
        { nombre: "Lamine Yamal", posicion: "Delantero" },
        { nombre: "Pedri", posicion: "Mediocampista" },
        { nombre: "Unai Simón", posicion: "Arquero" },
      ],

      estadioLocalId: "santiago-bernabeu",
    },
  },

  // ==========================================================================
  // TODO: agregar más equipos hasta completar 4 equipos por grupo (formato
  // clásico de fase de grupos), por ejemplo agregando 2 equipos más a cada
  // uno de los grupos "A" y "B" definidos arriba.
  // ==========================================================================
];

/**
 * obtenerEquipoPorId(id)
 * ----------------------------------------------------------------------------
 * Función auxiliar para buscar UN equipo puntual dentro del array, a partir
 * de su `id` único (ej: "arg"). Centralizar esta búsqueda en una función
 * evita que cada módulo (grupos.js, fixture.js, bracket.js, etc.) tenga que
 * repetir su propio `.find(...)`, lo cual sería menos mantenible.
 *
 * @param {string} id - Identificador único del equipo (ej: "arg", "mex").
 * @returns {Object|undefined} El objeto del equipo encontrado, o
 *                              `undefined` si no existe ningún equipo con
 *                              ese id.
 *
 * Ejemplo de uso en otro archivo:
 *   import { obtenerEquipoPorId } from '../data/equipos.js';
 *   const argentina = obtenerEquipoPorId('arg');
 */
export function obtenerEquipoPorId(id) {
  // Array.prototype.find recorre el array y devuelve el PRIMER elemento
  // que cumpla la condición (acá, que el id coincida). Si no encuentra
  // ninguno, devuelve undefined automáticamente.
  return equipos.find((equipo) => equipo.id === id);
}

/**
 * obtenerEquiposPorGrupo(grupo)
 * ----------------------------------------------------------------------------
 * Función auxiliar que filtra y devuelve solo los equipos que pertenecen
 * a un grupo determinado (ej: todos los equipos del grupo "A"). La va a
 * necesitar principalmente /src/ui/grupos.js para armar una tabla de
 * posiciones por cada grupo.
 *
 * @param {string} grupo - Letra del grupo a buscar (ej: "A", "B").
 * @returns {Object[]} Un nuevo array con los equipos de ese grupo
 *                      (array vacío si no hay ninguno).
 *
 * Ejemplo de uso en otro archivo:
 *   import { obtenerEquiposPorGrupo } from '../data/equipos.js';
 *   const equiposGrupoA = obtenerEquiposPorGrupo('A');
 */
export function obtenerEquiposPorGrupo(grupo) {
  // Array.prototype.filter devuelve un NUEVO array con todos los elementos
  // que cumplan la condición (a diferencia de find, que devuelve solo uno).
  return equipos.filter((equipo) => equipo.grupo === grupo);
}

/**
 * obtenerListaDeGrupos()
 * ----------------------------------------------------------------------------
 * Recorre todos los equipos y devuelve la lista de grupos que existen,
 * sin duplicados y ordenada alfabéticamente (ej: ["A", "B"]). Sirve para
 * que /src/ui/grupos.js sepa cuántas tablas tiene que dibujar sin tener
 * que "hardcodear" las letras de los grupos a mano.
 *
 * @returns {string[]} Array con las letras de grupo, sin repetidos.
 */
export function obtenerListaDeGrupos() {
  // 1) equipos.map(...) transforma el array de equipos en un array de
  //    letras de grupo, por ejemplo: ["A", "A", "B", "B"]
  // 2) new Set(...) elimina los valores duplicados automáticamente,
  //    porque un Set no puede contener dos veces el mismo valor.
  // 3) [...set] (spread operator) convierte ese Set de nuevo en un array
  //    normal para poder usar .sort() sobre él.
  const gruposUnicos = [...new Set(equipos.map((equipo) => equipo.grupo))];

  // Ordenamos alfabéticamente para que las tablas siempre aparezcan en el
  // mismo orden (A, B, C...) sin importar el orden en que se cargaron los
  // equipos en el array.
  return gruposUnicos.sort();
}