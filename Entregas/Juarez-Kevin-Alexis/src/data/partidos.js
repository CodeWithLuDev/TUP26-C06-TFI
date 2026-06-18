export const partidos = [
  // GRUPO A
  { id: 1, grupo: 'A', fase: 'Grupo A', local: 'México', localId: 1, codigoLocal: 'MX', visitante: 'Uruguay', visitanteId: 2, codigoVisitante: 'UY', fecha: '2026-06-11', horaUTC: '2026-06-11T23:00:00Z', resultado: null, goles: [] },
  { id: 2, grupo: 'A', fase: 'Grupo A', local: 'Bélgica', localId: 3, codigoLocal: 'BE', visitante: 'Argelia', visitanteId: 4, codigoVisitante: 'DZ', fecha: '2026-06-11', horaUTC: '2026-06-12T02:00:00Z', resultado: null, goles: [] },
  { id: 3, grupo: 'A', fase: 'Grupo A', local: 'México', localId: 1, codigoLocal: 'MX', visitante: 'Argelia', visitanteId: 4, codigoVisitante: 'DZ', fecha: '2026-06-15', horaUTC: '2026-06-15T23:00:00Z', resultado: null, goles: [] },
  { id: 4, grupo: 'A', fase: 'Grupo A', local: 'Uruguay', localId: 2, codigoLocal: 'UY', visitante: 'Bélgica', visitanteId: 3, codigoVisitante: 'BE', fecha: '2026-06-15', horaUTC: '2026-06-16T02:00:00Z', resultado: null, goles: [] },
  { id: 5, grupo: 'A', fase: 'Grupo A', local: 'Uruguay', localId: 2, codigoLocal: 'UY', visitante: 'Argelia', visitanteId: 4, codigoVisitante: 'DZ', fecha: '2026-06-19', horaUTC: '2026-06-19T22:00:00Z', resultado: null, goles: [] },
  { id: 6, grupo: 'A', fase: 'Grupo A', local: 'México', localId: 1, codigoLocal: 'MX', visitante: 'Bélgica', visitanteId: 3, codigoVisitante: 'BE', fecha: '2026-06-19', horaUTC: '2026-06-19T22:00:00Z', resultado: null, goles: [] },

  // GRUPO B
  { id: 7, grupo: 'B', fase: 'Grupo B', local: 'Argentina', localId: 5, codigoLocal: 'AR', visitante: 'Chile', visitanteId: 6, codigoVisitante: 'CL', fecha: '2026-06-12', horaUTC: '2026-06-13T00:00:00Z', resultado: {"local":3,"visitante":0}, goles: [{"jugador":"Messi","equipo":"Argentina","minuto":15,"asistencia":"Di María"},{"jugador":"Messi","equipo":"Argentina","minuto":45,"asistencia":"Álvarez"},{"jugador":"Álvarez","equipo":"Argentina","minuto":78,"asistencia":"Messi"}], fechaFin: '2026-06-13T02:00:00Z' },
  { id: 8, grupo: 'B', fase: 'Grupo B', local: 'Croacia', localId: 7, codigoLocal: 'HR', visitante: 'Marruecos', visitanteId: 8, codigoVisitante: 'MA', fecha: '2026-06-12', horaUTC: '2026-06-12T20:00:00Z', resultado: {"local":0,"visitante":0}, goles: [], fechaFin: '2026-06-12T22:00:00Z' },
  { id: 9, grupo: 'B', fase: 'Grupo B', local: 'Argentina', localId: 5, codigoLocal: 'AR', visitante: 'Croacia', visitanteId: 7, codigoVisitante: 'HR', fecha: '2026-06-16', horaUTC: '2026-06-16T23:00:00Z', resultado: null, goles: [] },
  { id: 10, grupo: 'B', fase: 'Grupo B', local: 'Marruecos', localId: 8, codigoLocal: 'MA', visitante: 'Chile', visitanteId: 6, codigoVisitante: 'CL', fecha: '2026-06-16', horaUTC: '2026-06-17T02:00:00Z', resultado: null, goles: [] },
  { id: 11, grupo: 'B', fase: 'Grupo B', local: 'Argentina', localId: 5, codigoLocal: 'AR', visitante: 'Marruecos', visitanteId: 8, codigoVisitante: 'MA', fecha: '2026-06-20', horaUTC: '2026-06-20T22:00:00Z', resultado: null, goles: [] },
  { id: 12, grupo: 'B', fase: 'Grupo B', local: 'Chile', localId: 6, codigoLocal: 'CL', visitante: 'Croacia', visitanteId: 7, codigoVisitante: 'HR', fecha: '2026-06-20', horaUTC: '2026-06-20T22:00:00Z', resultado: null, goles: [] },

  // GRUPO C
  { id: 13, grupo: 'C', fase: 'Grupo C', local: 'Brasil', localId: 9, codigoLocal: 'BR', visitante: 'Colombia', visitanteId: 10, codigoVisitante: 'CO', fecha: '2026-06-13', horaUTC: '2026-06-13T23:00:00Z', resultado: {"local":2,"visitante":1}, goles: [{"jugador":"Vinicius","equipo":"Brasil","minuto":22,"asistencia":"Rodrygo"},{"jugador":"James","equipo":"Colombia","minuto":55,"asistencia":"Díaz"},{"jugador":"Rodrygo","equipo":"Brasil","minuto":88,"asistencia":null}], fechaFin: '2026-06-14T01:00:00Z' },
  { id: 14, grupo: 'C', fase: 'Grupo C', local: 'Alemania', localId: 11, codigoLocal: 'DE', visitante: 'Japón', visitanteId: 12, codigoVisitante: 'JP', fecha: '2026-06-13', horaUTC: '2026-06-13T20:00:00Z', resultado: null, goles: [] },
  { id: 15, grupo: 'C', fase: 'Grupo C', local: 'Brasil', localId: 9, codigoLocal: 'BR', visitante: 'Alemania', visitanteId: 11, codigoVisitante: 'DE', fecha: '2026-06-17', horaUTC: '2026-06-17T23:00:00Z', resultado: null, goles: [] },
  { id: 16, grupo: 'C', fase: 'Grupo C', local: 'Japón', localId: 12, codigoLocal: 'JP', visitante: 'Colombia', visitanteId: 10, codigoVisitante: 'CO', fecha: '2026-06-17', horaUTC: '2026-06-18T02:00:00Z', resultado: null, goles: [] },
  { id: 17, grupo: 'C', fase: 'Grupo C', local: 'Brasil', localId: 9, codigoLocal: 'BR', visitante: 'Japón', visitanteId: 12, codigoVisitante: 'JP', fecha: '2026-06-21', horaUTC: '2026-06-21T22:00:00Z', resultado: null, goles: [] },
  { id: 18, grupo: 'C', fase: 'Grupo C', local: 'Colombia', localId: 10, codigoLocal: 'CO', visitante: 'Alemania', visitanteId: 11, codigoVisitante: 'DE', fecha: '2026-06-21', horaUTC: '2026-06-21T22:00:00Z', resultado: null, goles: [] },

  // GRUPO D
  { id: 19, grupo: 'D', fase: 'Grupo D', local: 'Francia', localId: 13, codigoLocal: 'FR', visitante: 'Senegal', visitanteId: 15, codigoVisitante: 'SN', fecha: '2026-06-13', horaUTC: '2026-06-14T02:00:00Z', resultado: null, goles: [] },
  { id: 20, grupo: 'D', fase: 'Grupo D', local: 'Portugal', localId: 14, codigoLocal: 'PT', visitante: 'Ecuador', visitanteId: 16, codigoVisitante: 'EC', fecha: '2026-06-14', horaUTC: '2026-06-14T20:00:00Z', resultado: null, goles: [] },
  { id: 21, grupo: 'D', fase: 'Grupo D', local: 'Francia', localId: 13, codigoLocal: 'FR', visitante: 'Ecuador', visitanteId: 16, codigoVisitante: 'EC', fecha: '2026-06-18', horaUTC: '2026-06-18T23:00:00Z', resultado: null, goles: [] },
  { id: 22, grupo: 'D', fase: 'Grupo D', local: 'Senegal', localId: 15, codigoLocal: 'SN', visitante: 'Portugal', visitanteId: 14, codigoVisitante: 'PT', fecha: '2026-06-18', horaUTC: '2026-06-19T02:00:00Z', resultado: null, goles: [] },
  { id: 23, grupo: 'D', fase: 'Grupo D', local: 'Francia', localId: 13, codigoLocal: 'FR', visitante: 'Portugal', visitanteId: 14, codigoVisitante: 'PT', fecha: '2026-06-22', horaUTC: '2026-06-22T22:00:00Z', resultado: null, goles: [] },
  { id: 24, grupo: 'D', fase: 'Grupo D', local: 'Ecuador', localId: 16, codigoLocal: 'EC', visitante: 'Senegal', visitanteId: 15, codigoVisitante: 'SN', fecha: '2026-06-22', horaUTC: '2026-06-22T22:00:00Z', resultado: null, goles: [] },

  // GRUPO E
  { id: 25, grupo: 'E', fase: 'Grupo E', local: 'España', localId: 17, codigoLocal: 'ES', visitante: 'Australia', visitanteId: 20, codigoVisitante: 'AU', fecha: '2026-06-14', horaUTC: '2026-06-14T23:00:00Z', resultado: null, goles: [] },
  { id: 26, grupo: 'E', fase: 'Grupo E', local: 'Inglaterra', localId: 18, codigoLocal: 'GB', visitante: 'Países Bajos', visitanteId: 19, codigoVisitante: 'NL', fecha: '2026-06-15', horaUTC: '2026-06-15T02:00:00Z', resultado: null, goles: [] },
  { id: 27, grupo: 'E', fase: 'Grupo E', local: 'España', localId: 17, codigoLocal: 'ES', visitante: 'Inglaterra', visitanteId: 18, codigoVisitante: 'GB', fecha: '2026-06-19', horaUTC: '2026-06-19T23:00:00Z', resultado: null, goles: [] },
  { id: 28, grupo: 'E', fase: 'Grupo E', local: 'Australia', localId: 20, codigoLocal: 'AU', visitante: 'Países Bajos', visitanteId: 19, codigoVisitante: 'NL', fecha: '2026-06-20', horaUTC: '2026-06-20T02:00:00Z', resultado: null, goles: [] },
  { id: 29, grupo: 'E', fase: 'Grupo E', local: 'España', localId: 17, codigoLocal: 'ES', visitante: 'Países Bajos', visitanteId: 19, codigoVisitante: 'NL', fecha: '2026-06-23', horaUTC: '2026-06-23T22:00:00Z', resultado: null, goles: [] },
  { id: 30, grupo: 'E', fase: 'Grupo E', local: 'Australia', localId: 20, codigoLocal: 'AU', visitante: 'Inglaterra', visitanteId: 18, codigoVisitante: 'GB', fecha: '2026-06-23', horaUTC: '2026-06-23T22:00:00Z', resultado: null, goles: [] },

  // GRUPO F
  { id: 31, grupo: 'F', fase: 'Grupo F', local: 'Estados Unidos', localId: 21, codigoLocal: 'US', visitante: 'Polonia', visitanteId: 23, codigoVisitante: 'PL', fecha: '2026-06-15', horaUTC: '2026-06-15T20:00:00Z', resultado: null, goles: [] },
  { id: 32, grupo: 'F', fase: 'Grupo F', local: 'Canadá', localId: 22, codigoLocal: 'CA', visitante: 'Arabia Saudita', visitanteId: 24, codigoVisitante: 'SA', fecha: '2026-06-15', horaUTC: '2026-06-16T00:00:00Z', resultado: null, goles: [] },
  { id: 33, grupo: 'F', fase: 'Grupo F', local: 'Estados Unidos', localId: 21, codigoLocal: 'US', visitante: 'Arabia Saudita', visitanteId: 24, codigoVisitante: 'SA', fecha: '2026-06-19', horaUTC: '2026-06-20T00:00:00Z', resultado: null, goles: [] },
  { id: 34, grupo: 'F', fase: 'Grupo F', local: 'Polonia', localId: 23, codigoLocal: 'PL', visitante: 'Canadá', visitanteId: 22, codigoVisitante: 'CA', fecha: '2026-06-20', horaUTC: '2026-06-20T20:00:00Z', resultado: null, goles: [] },
  { id: 35, grupo: 'F', fase: 'Grupo F', local: 'Estados Unidos', localId: 21, codigoLocal: 'US', visitante: 'Canadá', visitanteId: 22, codigoVisitante: 'CA', fecha: '2026-06-23', horaUTC: '2026-06-23T22:00:00Z', resultado: null, goles: [] },
  { id: 36, grupo: 'F', fase: 'Grupo F', local: 'Arabia Saudita', localId: 24, codigoLocal: 'SA', visitante: 'Polonia', visitanteId: 23, codigoVisitante: 'PL', fecha: '2026-06-23', horaUTC: '2026-06-23T22:00:00Z', resultado: null, goles: [] },

  // GRUPO G
  { id: 37, grupo: 'G', fase: 'Grupo G', local: 'Portugal', localId: 25, codigoLocal: 'PT', visitante: 'Corea del Sur', visitanteId: 28, codigoVisitante: 'KR', fecha: '2026-06-16', horaUTC: '2026-06-16T20:00:00Z', resultado: null, goles: [] },
  { id: 38, grupo: 'G', fase: 'Grupo G', local: 'Ghana', localId: 26, codigoLocal: 'GH', visitante: 'Uruguay', visitanteId: 27, codigoVisitante: 'UY', fecha: '2026-06-16', horaUTC: '2026-06-17T00:00:00Z', resultado: null, goles: [] },
  { id: 39, grupo: 'G', fase: 'Grupo G', local: 'Portugal', localId: 25, codigoLocal: 'PT', visitante: 'Ghana', visitanteId: 26, codigoVisitante: 'GH', fecha: '2026-06-20', horaUTC: '2026-06-20T23:00:00Z', resultado: null, goles: [] },
  { id: 40, grupo: 'G', fase: 'Grupo G', local: 'Corea del Sur', localId: 28, codigoLocal: 'KR', visitante: 'Uruguay', visitanteId: 27, codigoVisitante: 'UY', fecha: '2026-06-21', horaUTC: '2026-06-21T02:00:00Z', resultado: null, goles: [] },
  { id: 41, grupo: 'G', fase: 'Grupo G', local: 'Portugal', localId: 25, codigoLocal: 'PT', visitante: 'Uruguay', visitanteId: 27, codigoVisitante: 'UY', fecha: '2026-06-24', horaUTC: '2026-06-24T22:00:00Z', resultado: null, goles: [] },
  { id: 42, grupo: 'G', fase: 'Grupo G', local: 'Ghana', localId: 26, codigoLocal: 'GH', visitante: 'Corea del Sur', visitanteId: 28, codigoVisitante: 'KR', fecha: '2026-06-24', horaUTC: '2026-06-24T22:00:00Z', resultado: null, goles: [] },

  // GRUPO H
  { id: 43, grupo: 'H', fase: 'Grupo H', local: 'Italia', localId: 29, codigoLocal: 'IT', visitante: 'Nigeria', visitanteId: 30, codigoVisitante: 'NG', fecha: '2026-06-16', horaUTC: '2026-06-17T02:00:00Z', resultado: null, goles: [] },
  { id: 44, grupo: 'H', fase: 'Grupo H', local: 'Irán', localId: 31, codigoLocal: 'IR', visitante: 'Turquía', visitanteId: 32, codigoVisitante: 'TR', fecha: '2026-06-17', horaUTC: '2026-06-17T20:00:00Z', resultado: null, goles: [] },
  { id: 45, grupo: 'H', fase: 'Grupo H', local: 'Italia', localId: 29, codigoLocal: 'IT', visitante: 'Irán', visitanteId: 31, codigoVisitante: 'IR', fecha: '2026-06-21', horaUTC: '2026-06-21T20:00:00Z', resultado: null, goles: [] },
  { id: 46, grupo: 'H', fase: 'Grupo H', local: 'Turquía', localId: 32, codigoLocal: 'TR', visitante: 'Nigeria', visitanteId: 30, codigoVisitante: 'NG', fecha: '2026-06-21', horaUTC: '2026-06-22T00:00:00Z', resultado: null, goles: [] },
  { id: 47, grupo: 'H', fase: 'Grupo H', local: 'Italia', localId: 29, codigoLocal: 'IT', visitante: 'Turquía', visitanteId: 32, codigoVisitante: 'TR', fecha: '2026-06-25', horaUTC: '2026-06-25T22:00:00Z', resultado: null, goles: [] },
  { id: 48, grupo: 'H', fase: 'Grupo H', local: 'Nigeria', localId: 30, codigoLocal: 'NG', visitante: 'Irán', visitanteId: 31, codigoVisitante: 'IR', fecha: '2026-06-25', horaUTC: '2026-06-25T22:00:00Z', resultado: null, goles: [] },
]
