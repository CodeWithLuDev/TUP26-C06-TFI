import { useState } from 'react';
import type { JugadorDestacado } from '../types';

const jugadores: JugadorDestacado[] = [
  { nombre: 'Lionel Messi', edad: 38, posicion: 'Delantero', equipo: 'Inter Miami', pais: 'Argentina', paisId: 'arg', goles: 8, asistencias: 5, imagen: '/assets/jugadores/messi.jpg', descripcion: 'El mejor jugador del mundo. Capitán de la selección argentina y campeón del mundo 2022.' },
  { nombre: 'Cristiano Ronaldo', edad: 41, posicion: 'Delantero', equipo: 'Al Nassr', pais: 'Portugal', paisId: 'por', goles: 6, asistencias: 2, imagen: '/assets/jugadores/cristiano.jpg', descripcion: 'Leyenda viva del fútbol. Máximo goleador histórico de la selección portuguesa.' },
  { nombre: 'Erling Haaland', edad: 25, posicion: 'Delantero', equipo: 'Manchester City', pais: 'Noruega', paisId: 'nor', goles: 7, asistencias: 2, imagen: '/assets/jugadores/haaland.jpg', descripcion: 'Goleador nórdico. Potencia física y olfato de gol incomparables.' },
  { nombre: 'Vinícius Jr.', edad: 25, posicion: 'Extremo', equipo: 'Real Madrid', pais: 'Brasil', paisId: 'bra', goles: 5, asistencias: 6, imagen: '/assets/jugadores/vinicius.jpg', descripcion: 'Regate y velocidad. La estrella brasileña más desequilibrante.' },
  { nombre: 'Jude Bellingham', edad: 22, posicion: 'Centrocampista', equipo: 'Real Madrid', pais: 'Inglaterra', paisId: 'eng', goles: 4, asistencias: 4, imagen: '/assets/jugadores/bellingham.jpg', descripcion: 'Talento precoz. Lidera el mediocampo con madurez asombrosa.' },
  { nombre: 'Harry Kane', edad: 32, posicion: 'Delantero', equipo: 'Bayern Múnich', pais: 'Inglaterra', paisId: 'eng', goles: 6, asistencias: 1, imagen: '/assets/jugadores/harrykane.jpg', descripcion: 'Referente inglés. Definición precisa y juego de espaldas.' },
  { nombre: 'Emiliano "Dibu" Martínez', edad: 33, posicion: 'Arquero', equipo: 'Aston Villa', pais: 'Argentina', paisId: 'arg', goles: 0, asistencias: 0, imagen: '/assets/jugadores/dibumartinez.jpg', descripcion: 'Arquero legendario. Figura en los penales y campeón del mundo 2022.' },
  { nombre: 'Antoine Griezmann', edad: 34, posicion: 'Delantero', equipo: 'Atlético Madrid', pais: 'Francia', paisId: 'fra', goles: 3, asistencias: 4, imagen: '/assets/jugadores/griezmann.jpg', descripcion: 'Versatilidad ofensiva. Corazón de la selección francesa.' },
  { nombre: 'Son Heung-min', edad: 33, posicion: 'Extremo', equipo: 'Tottenham Hotspur', pais: 'Corea del Sur', paisId: 'kor', goles: 5, asistencias: 3, imagen: '/assets/jugadores/sonheung.jpg', descripcion: 'Capitán coreano. Velocidad letal y pegada precisa con ambas piernas.' },
];

export default function JugadoresDestacados() {
  const [selected, setSelected] = useState<JugadorDestacado | null>(null);

  return (
    <div className="jugadores-page">
      <h2>Jugadores Destacados</h2>
      <p className="jugadores-subtitulo">Las estrellas que brillan en el Mundial 2026</p>

      <div className="jugadores-grid">
        {jugadores.map((j, i) => (
          <div
            key={i}
            className={`jugador-card ${selected?.nombre === j.nombre ? 'activo' : ''}`}
            onClick={() => setSelected(selected?.nombre === j.nombre ? null : j)}
          >
            <div className="jugador-img-wrapper">
              <div className="jugador-img" style={{ backgroundImage: `url(${j.imagen})` }} />
              <div className="jugador-pais">
                <img src={`/assets/flags/${j.paisId}.png`} alt={j.pais} />
              </div>
            </div>
            <div className="jugador-info">
              <h3>{j.nombre}</h3>
              <span className="jugador-posicion">{j.posicion}</span>
              <div className="jugador-estats">
                <div className="jugador-stat">
                  <span className="stat-num">{j.goles}</span>
                  <span className="stat-label">Goles</span>
                </div>
                <div className="jugador-stat">
                  <span className="stat-num">{j.asistencias}</span>
                  <span className="stat-label">Asist</span>
                </div>
                <div className="jugador-stat">
                  <span className="stat-num">{j.edad}</span>
                  <span className="stat-label">Edad</span>
                </div>
              </div>
            </div>
            {selected?.nombre === j.nombre && (
              <div className="jugador-detalle">
                <p>{j.descripcion}</p>
                <div className="jugador-detalle-info">
                  <span><strong>Equipo:</strong> {j.equipo}</span>
                  <span><strong>País:</strong> {j.pais}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
