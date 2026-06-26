function renderizarGrupos(partidos, contenedor) {
  contenedor.innerHTML = '';
  const gruposContainer = document.createElement('div');
  gruposContainer.className = 'grupos-container';

  gruposDisponibles.forEach(grupo => {
    const posiciones = calcularPosiciones(grupo, partidos);
    const grupoDiv = document.createElement('div');
    grupoDiv.className = 'grupo-card';

    const header = document.createElement('h3');
    header.className = 'grupo-titulo';
    header.textContent = `Grupo ${grupo}`;
    grupoDiv.appendChild(header);

    const tabla = document.createElement('table');
    tabla.className = 'tabla-posiciones';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>#</th>
        <th>Equipo</th>
        <th>PJ</th>
        <th>PG</th>
        <th>PE</th>
        <th>PP</th>
        <th>GF</th>
        <th>GC</th>
        <th>DG</th>
        <th>PTS</th>
      </tr>
    `;
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    posiciones.forEach((eq, i) => {
      const tr = document.createElement('tr');
      const clasificado = i < 2;
      if (clasificado) tr.className = 'clasificado';
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td class="equipo-cell"><span class="bandera">${eq.bandera}</span> ${eq.nombre}</td>
        <td>${eq.pj}</td>
        <td>${eq.pg}</td>
        <td>${eq.pe}</td>
        <td>${eq.pp}</td>
        <td>${eq.gf}</td>
        <td>${eq.gc}</td>
        <td>${eq.dg}</td>
        <td class="pts">${eq.pts}</td>
      `;
      tbody.appendChild(tr);
    });
    tabla.appendChild(tbody);
    grupoDiv.appendChild(tabla);
    gruposContainer.appendChild(grupoDiv);
  });

  contenedor.appendChild(gruposContainer);
}
