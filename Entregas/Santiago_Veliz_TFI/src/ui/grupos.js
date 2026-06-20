/**
 * Módulo de Interfaz: Grupos
 * Renderiza las tablas de posiciones dinámicas agrupando los equipos.
 */
import { equipos } from '../data/equipos.js';
import { partidos } from '../data/partidos.js';
import { calcularPosiciones, ordenarTabla } from '../logic/posiciones.js';

export function renderGrupos() {
    const contenedor = document.getElementById('contenedor-tablas-grupos');
    const templateFila = document.getElementById('template-fila-tabla');
    
    if (!contenedor || !templateFila) return;
    
    // 1. Calculamos y ordenamos usando la lógica de negocio
    const tablaCalculada = calcularPosiciones(partidos, equipos);
    const tablaOrdenada = ordenarTabla(tablaCalculada);
    
    // 2. Agrupamos por letra de grupo (A, B, C...)
    const grupos = {};
    tablaOrdenada.forEach(eq => {
        if (!grupos[eq.grupo]) grupos[eq.grupo] = [];
        grupos[eq.grupo].push(eq);
    });
    
    contenedor.innerHTML = '';
    
    // 3. Renderizamos cada tabla
    for (const [nombreGrupo, equiposGrupo] of Object.entries(grupos)) {
        const tablaHTML = document.createElement('table');
        tablaHTML.className = 'tabla-posiciones';
        tablaHTML.innerHTML = `
            <thead>
                <tr><th colspan="9">Grupo ${nombreGrupo}</th></tr>
                <tr><th>Equipo</th><th>Pts</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DIF</th></tr>
            </thead>
            <tbody></tbody>
        `;
        
        const tbody = tablaHTML.querySelector('tbody');
        
        equiposGrupo.forEach(eq => {
            const clone = templateFila.content.cloneNode(true);
            const celdas = clone.querySelectorAll('td');
            
            // Asignamos valores a los <td> del template
            celdas[0].textContent = eq.nombre;
            celdas[1].textContent = eq.pts;
            celdas[2].textContent = eq.pj;
            celdas[3].textContent = eq.pg;
            celdas[4].textContent = eq.pe;
            celdas[5].textContent = eq.pp;
            celdas[6].textContent = eq.gf;
            celdas[7].textContent = eq.gc;
            celdas[8].textContent = eq.dg;
            
            tbody.appendChild(clone);
        });
        
        contenedor.appendChild(tablaHTML);
    }
}