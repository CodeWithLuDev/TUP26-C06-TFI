import { useState, useEffect } from 'react';
import Equipos from './components/Equipos';
import Grupos from './components/Grupos';
import Bracket from './components/Bracket';
import Fixture from './components/Fixture';
import Estadisticas from './components/Estadisticas';
import JugadoresDestacados from './components/JugadoresDestacados';
import Predicciones from './components/Predicciones';
import Calendario from './components/Calendario';
import './App.css';

type Seccion = 'equipos' | 'grupos' | 'bracket' | 'fixture' | 'estadisticas' | 'jugadores' | 'predicciones' | 'calendario';

const navItems: { key: Seccion; label: string; icon: string }[] = [
  { key: 'calendario', label: 'Calendario', icon: '📅' },
  { key: 'equipos', label: 'Equipos', icon: '🏳️' },
  { key: 'grupos', label: 'Fase de Grupos', icon: '📊' },
  { key: 'bracket', label: 'Eliminación', icon: '🏆' },
  { key: 'fixture', label: 'Cargar Resultados', icon: '⚽' },
  { key: 'predicciones', label: 'Predicciones', icon: '🔮' },
  { key: 'estadisticas', label: 'Estadísticas', icon: '📈' },
  { key: 'jugadores', label: 'Jugadores', icon: '⭐' },
];

export default function App() {
  const [seccion, setSeccion] = useState<Seccion>('equipos');
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved !== null ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const renderSeccion = () => {
    switch (seccion) {
      case 'equipos': return <Equipos />;
      case 'grupos': return <Grupos />;
      case 'bracket': return <Bracket />;
      case 'fixture': return <Fixture />;
      case 'estadisticas': return <Estadisticas />;
      case 'jugadores': return <JugadoresDestacados />;
      case 'predicciones': return <Predicciones />;
      case 'calendario': return <Calendario />;
    }
  };

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <h1><span className="header-icon">🏆</span> Mundial 2026</h1>
          <p className="subtitulo">EE.UU. · México · Canadá — Fixture interactivo</p>
        </div>
        <button className="theme-toggle" onClick={() => setDark(d => !d)} aria-label="Cambiar tema">
          {dark ? '☀️' : '🌙'}
        </button>
      </header>

      <nav>
        {navItems.map(item => (
          <button
            key={item.key}
            className={`nav-btn ${seccion === item.key ? 'activo' : ''}`}
            onClick={() => setSeccion(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <main id="contenido-principal">
        {renderSeccion()}
      </main>

      <footer>
        <p>Programación III — Brandan Tamara — Mercado Sofia</p>
      </footer>
    </div>
  );
}
