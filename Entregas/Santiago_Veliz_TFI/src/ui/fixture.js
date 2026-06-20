/**
 * Módulo de Interfaz: Fixture
 * Renderiza la lista de partidos en el DOM utilizando el template HTML.
 */
import { partidos } from '../data/partidos.js';
import { equipos } from '../data/equipos.js';

export function renderFixture() {
    const contenedor = document.getElementById('contenedor-fixture');
    const template = document.getElementById('template-partido');
    
    if (!contenedor || !template) return;
    
    contenedor.innerHTML = ''; // Limpiamos antes de renderizar
    
    partidos.forEach(partido => {
        // Buscamos los datos completos de cada equipo
        const local = equipos.find(e => e.id === partido.equipoLocal);
        const visitante = equipos.find(e => e.id === partido.equipoVisitante);
        
        if(!local || !visitante) return;

        // Clonamos el template
        const clone = template.content.cloneNode(true);
        
        // Rellenamos datos (ajustar selectores según el HTML exacto generado)
        clone.querySelector('.local-nombre').textContent = local.nombre;
        clone.querySelector('.visitante-nombre').textContent = visitante.nombre;
        
        const resultadoStr = partido.estado === 'jugado' 
            ? `${partido.golesLocal} - ${partido.golesVisitante}` 
            : 'VS';
            
        clone.querySelector('.resultado-marcador').textContent = resultadoStr;
        
        contenedor.appendChild(clone);
    });
}