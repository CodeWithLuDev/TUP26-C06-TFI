/**
 * equipos.js — Datos de los 32 equipos del Mundial Qatar 2022
 * Cada equipo incluye: id, nombre, bandera (emoji), grupo y selección
 */

const EQUIPOS = [
    // Grupo A
    { id: 'QAT', nombre: 'Qatar',        bandera: '🇶🇦', grupo: 'A', confederacion: 'AFC' },
    { id: 'ECU', nombre: 'Ecuador',      bandera: '🇪🇨', grupo: 'A', confederacion: 'CONMEBOL' },
    { id: 'SEN', nombre: 'Senegal',      bandera: '🇸🇳', grupo: 'A', confederacion: 'CAF' },
    { id: 'NED', nombre: 'Países Bajos', bandera: '🇳🇱', grupo: 'A', confederacion: 'UEFA' },
  
    // Grupo B
    { id: 'ENG', nombre: 'Inglaterra',   bandera: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', grupo: 'B', confederacion: 'UEFA' },
    { id: 'IRN', nombre: 'Irán',         bandera: '🇮🇷', grupo: 'B', confederacion: 'AFC' },
    { id: 'USA', nombre: 'Estados Unidos',bandera:'🇺🇸', grupo: 'B', confederacion: 'CONCACAF' },
    { id: 'WAL', nombre: 'Gales',        bandera: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', grupo: 'B', confederacion: 'UEFA' },
  
    // Grupo C
    { id: 'ARG', nombre: 'Argentina',    bandera: '🇦🇷', grupo: 'C', confederacion: 'CONMEBOL' },
    { id: 'KSA', nombre: 'Arabia Saudita',bandera:'🇸🇦', grupo: 'C', confederacion: 'AFC' },
    { id: 'MEX', nombre: 'México',       bandera: '🇲🇽', grupo: 'C', confederacion: 'CONCACAF' },
    { id: 'POL', nombre: 'Polonia',      bandera: '🇵🇱', grupo: 'C', confederacion: 'UEFA' },
  
    // Grupo D
    { id: 'FRA', nombre: 'Francia',      bandera: '🇫🇷', grupo: 'D', confederacion: 'UEFA' },
    { id: 'AUS', nombre: 'Australia',    bandera: '🇦🇺', grupo: 'D', confederacion: 'AFC' },
    { id: 'DEN', nombre: 'Dinamarca',    bandera: '🇩🇰', grupo: 'D', confederacion: 'UEFA' },
    { id: 'TUN', nombre: 'Túnez',        bandera: '🇹🇳', grupo: 'D', confederacion: 'CAF' },
  
    // Grupo E
    { id: 'ESP', nombre: 'España',       bandera: '🇪🇸', grupo: 'E', confederacion: 'UEFA' },
    { id: 'CRC', nombre: 'Costa Rica',   bandera: '🇨🇷', grupo: 'E', confederacion: 'CONCACAF' },
    { id: 'GER', nombre: 'Alemania',     bandera: '🇩🇪', grupo: 'E', confederacion: 'UEFA' },
    { id: 'JPN', nombre: 'Japón',        bandera: '🇯🇵', grupo: 'E', confederacion: 'AFC' },
  
    // Grupo F
    { id: 'BEL', nombre: 'Bélgica',      bandera: '🇧🇪', grupo: 'F', confederacion: 'UEFA' },
    { id: 'CAN', nombre: 'Canadá',       bandera: '🇨🇦', grupo: 'F', confederacion: 'CONCACAF' },
    { id: 'MAR', nombre: 'Marruecos',    bandera: '🇲🇦', grupo: 'F', confederacion: 'CAF' },
    { id: 'CRO', nombre: 'Croacia',      bandera: '🇭🇷', grupo: 'F', confederacion: 'UEFA' },
  
    // Grupo G
    { id: 'BRA', nombre: 'Brasil',       bandera: '🇧🇷', grupo: 'G', confederacion: 'CONMEBOL' },
    { id: 'SRB', nombre: 'Serbia',       bandera: '🇷🇸', grupo: 'G', confederacion: 'UEFA' },
    { id: 'SUI', nombre: 'Suiza',        bandera: '🇨🇭', grupo: 'G', confederacion: 'UEFA' },
    { id: 'CMR', nombre: 'Camerún',      bandera: '🇨🇲', grupo: 'G', confederacion: 'CAF' },
  
    // Grupo H
    { id: 'POR', nombre: 'Portugal',     bandera: '🇵🇹', grupo: 'H', confederacion: 'UEFA' },
    { id: 'GHA', nombre: 'Ghana',        bandera: '🇬🇭', grupo: 'H', confederacion: 'CAF' },
    { id: 'URU', nombre: 'Uruguay',      bandera: '🇺🇾', grupo: 'H', confederacion: 'CONMEBOL' },
    { id: 'KOR', nombre: 'Corea del Sur',bandera: '🇰🇷', grupo: 'H', confederacion: 'AFC' },
  ];
  
  /** Obtiene un equipo por su ID */
  function getEquipoPorId(id) {
    return EQUIPOS.find(e => e.id === id) || null;
  }
  
  /** Obtiene todos los equipos de un grupo */
  function getEquiposPorGrupo(grupo) {
    return EQUIPOS.filter(e => e.grupo === grupo);
  }
  
  /** Retorna la lista de grupos únicos */
  function getGrupos() {
    return [...new Set(EQUIPOS.map(e => e.grupo))].sort();
  }
  
  /** Mapeo rápido id → equipo */
  function getEquiposMap() {
    return EQUIPOS.reduce((map, eq) => {
      map[eq.id] = eq;
      return map;
    }, {});
  }
  