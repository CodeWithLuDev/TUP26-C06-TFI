/**
 * Módulo de Partidos
 * Contiene el array con los datos iniciales de los encuentros.
 * Algunos tienen estado 'jugado' (con resultados), otros 'pendiente'.
 */
export const partidos = [
    {
        id: 1,
        grupo: 'A',
        equipoLocal: 'arg', // ID coincidente con equipos.js
        equipoVisitante: 'mex',
        golesLocal: 2,
        golesVisitante: 0,
        estado: 'jugado'
    },
    {
        id: 2,
        grupo: 'A',
        equipoLocal: 'fra',
        equipoVisitante: 'esp',
        golesLocal: 1,
        golesVisitante: 1,
        estado: 'jugado'
    },
    {
        id: 3,
        grupo: 'A',
        equipoLocal: 'arg',
        equipoVisitante: 'fra',
        golesLocal: null,
        golesVisitante: null,
        estado: 'pendiente'
    },
    {
        id: 4,
        grupo: 'A',
        equipoLocal: 'esp',
        equipoVisitante: 'mex',
        golesLocal: null,
        golesVisitante: null,
        estado: 'pendiente'
    }
];