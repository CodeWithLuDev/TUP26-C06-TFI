/**
 * /src/ui/grupos.js
 * Renderiza las tablas de posiciones en grilla.
 */
import { equipos }   from '../data/equipos.js';
import { partidos }  from '../data/partidos.js';
import { calcularPosiciones, ordenarTabla } from '../logic/posiciones.js';

export function renderGrupos() {
  // Renderiza en ambos contenedores (tabla posiciones + eliminatorias)
  ['contenedor-tablas-grupos', 'contenedor-grupos-elim'].forEach(id => {
    const contenedor = document.getElementById(id);
    if (!contenedor) return;
    contenedor.innerHTML = '';

    const grupos = [...new Set(equipos.map(e => e.grupo))].sort();
    const grid = document.createElement('div');
    grid.className = 'grupos-grid';

    grupos.forEach(grupo => {
      const equiposGrupo  = equipos.filter(e => e.grupo === grupo);
      const partidosGrupo = partidos.filter(p => p.grupo === grupo);
      const tabla = ordenarTabla(calcularPosiciones(partidosGrupo, equiposGrupo));

      const panel = document.createElement('div');
      panel.className = 'grupo-panel';

      const titulo = document.createElement('div');
      titulo.className = 'grupo-panel__titulo';
      titulo.textContent = `Grupo ${grupo}`;
      panel.appendChild(titulo);

      const table = document.createElement('table');
      table.className = 'tabla-datos';
      table.innerHTML = `
        <thead>
          <tr>
            <th>Equipo</th>
            <th title="Puntos">Pts</th>
            <th title="Partidos Jugados">PJ</th>
            <th title="Partidos Ganados">PG</th>
            <th title="Partidos Empatados">PE</th>
            <th title="Partidos Perdidos">PP</th>
            <th title="Goles a Favor">GF</th>
            <th title="Goles en Contra">GC</th>
            <th title="Diferencia de Goles">DIF</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const tbody = table.querySelector('tbody');
      tabla.forEach(eq => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div class="celda-equipo">
              <img class="celda-equipo__escudo" src="${eq.escudo}" alt="${eq.nombre}" loading="lazy" />
              <span class="celda-equipo__nombre">${eq.nombre}</span>
            </div>
          </td>
          <td class="pts">${eq.pts}</td>
          <td>${eq.pj}</td>
          <td>${eq.pg}</td>
          <td>${eq.pe}</td>
          <td>${eq.pp}</td>
          <td>${eq.gf}</td>
          <td>${eq.gc}</td>
          <td>${eq.dg >= 0 ? '+'+eq.dg : eq.dg}</td>
        `;
        tbody.appendChild(tr);
      });

      panel.appendChild(table);
      grid.appendChild(panel);
    });

    contenedor.appendChild(grid);
  });
}