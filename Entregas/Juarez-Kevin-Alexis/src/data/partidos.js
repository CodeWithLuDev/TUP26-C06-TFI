export const partidos = [
  {
    id: 1,
    fase: 'Grupo A',
    local: 'México',
    codigoLocal: 'MX',
    visitante: 'Uruguay',
    codigoVisitante: 'UY',
    fecha: '2026-06-11',
    hora: '18:00',
    zona: 'UTC-6',
    horaUTC: '2026-06-11T00:00:00Z',
    resultado: null,
    goles: []
  },
  {
    id: 2,
    fase: 'Grupo B',
    local: 'Argentina',
    codigoLocal: 'AR',
    visitante: 'Chile',
    codigoVisitante: 'CL',
    fecha: '2026-06-12',
    hora: '21:00',
    zona: 'UTC-3',
    horaUTC: '2026-06-13T00:00:00Z',
    resultado: { local: 3, visitante: 0 },
    goles: [
      { jugador: 'Messi', equipo: 'Argentina', minuto: 15, asistencia: 'Di María' },
      { jugador: 'Messi', equipo: 'Argentina', minuto: 45, asistencia: 'Álvarez' },
      { jugador: 'Álvarez', equipo: 'Argentina', minuto: 78, asistencia: 'Messi' }
    ],
    fechaFin: '2026-06-13T02:00:00Z'
  },
  {
    id: 3,
    fase: 'Grupo A',
    local: 'Estados Unidos',
    codigoLocal: 'US',
    visitante: 'Canadá',
    codigoVisitante: 'CA',
    fecha: '2026-06-12',
    hora: '15:00',
    zona: 'UTC-5',
    horaUTC: '2026-06-12T20:00:00Z',
    resultado: { local: 1, visitante: 1 },
    goles: [
      { jugador: 'Pulisic', equipo: 'Estados Unidos', minuto: 33, asistencia: 'Reyna' },
      { jugador: 'David', equipo: 'Canadá', minuto: 67, asistencia: 'Buchanan' }
    ],
    fechaFin: '2026-06-12T22:00:00Z'
  },
  {
    id: 4,
    fase: 'Grupo C',
    local: 'Brasil',
    codigoLocal: 'BR',
    visitante: 'Colombia',
    codigoVisitante: 'CO',
    fecha: '2026-06-13',
    hora: '20:00',
    zona: 'UTC-3',
    horaUTC: '2026-06-13T23:00:00Z',
    resultado: { local: 2, visitante: 1 },
    goles: [
      { jugador: 'Vinicius', equipo: 'Brasil', minuto: 22, asistencia: 'Rodrygo' },
      { jugador: 'James', equipo: 'Colombia', minuto: 55, asistencia: 'Díaz' },
      { jugador: 'Rodrygo', equipo: 'Brasil', minuto: 88, asistencia: null }
    ],
    fechaFin: '2026-06-13T01:00:00Z'
  },
  {
    id: 5,
    fase: 'Grupo B',
    local: 'España',
    codigoLocal: 'ES',
    visitante: 'Alemania',
    codigoVisitante: 'DE',
    fecha: '2026-06-14',
    hora: '17:00',
    zona: 'UTC+2',
    horaUTC: '2026-06-14T15:00:00Z',
    resultado: null,
    goles: []
  }
]