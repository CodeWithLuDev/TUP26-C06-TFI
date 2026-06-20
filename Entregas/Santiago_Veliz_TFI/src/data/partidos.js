/**
 * Módulo de Partidos
 * Contiene el array con los datos iniciales de los encuentros.
 * Algunos tienen estado 'jugado' (con resultados), otros 'pendiente'.
 */
export const partidos = [
    {
        id: 1,
        grupo: 'A',
        equipoLocal: 'ARG', // ID coincidente con equipos.js
        equipoVisitante: 'MEX',
        golesLocal: 2,
        golesVisitante: 0,
        estado: 'jugado'
    },
    {
        id: 2,
        grupo: 'A',
        equipoLocal: 'FRA',
        equipoVisitante: 'ESP',
        golesLocal: 1,
        golesVisitante: 1,
        estado: 'jugado'
    },
    {
        id: 3,
        grupo: 'A',
        equipoLocal: 'ARG',
        equipoVisitante: 'FRA',
        golesLocal: null,
        golesVisitante: null,
        estado: 'pendiente'
    },
    {
        id: 4,
        grupo: 'A',
        equipoLocal: 'ESP',
        equipoVisitante: 'MEX',
        golesLocal: null,
        golesVisitante: null,
        estado: 'pendiente'
    }
];