import { teams } from './data/equipos.js';
import { initialMatches } from './data/partidos.js';
import { initialPlayoffMatches, propagateBracket } from './logic/playoffs.js';
import { calculateGroupTable } from './logic/posiciones.js';
import { calculateTopScorers, calculateTopAssists } from './logic/estadisticas.js';
import { renderGroupsView } from './ui/grupos.js';
import { renderFixtureView } from './ui/fixture.js';
import { renderBracketView } from './ui/bracket.js';
import { ScoreForm } from './ui/scoreForm.js';

// Clave para almacenamiento local
const LOCAL_STORAGE_KEY = 'tfi_mundial_2026_state';

class App {
  constructor() {
    this.groupMatches = [];
    this.playoffMatches = [];
    this.activeTab = 'groups-view';
    this.scoreForm = null;
  }

  start() {
    this.loadState();
    
    // Inicializar el controlador del formulario de carga
    this.scoreForm = new ScoreForm((matchId, scoreData) => this.saveMatchResult(matchId, scoreData));
    this.scoreForm.init();

    this.bindEvents();
    this.render();
  }

  /**
   * Carga el estado del torneo desde LocalStorage o inicia uno nuevo.
   */
  loadState() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.groupMatches = parsed.groupMatches || [];
        this.playoffMatches = parsed.playoffMatches || [];
        
        // Robustez: verificar si se cargaron listas vacías por error
        if (this.groupMatches.length === 0 || this.playoffMatches.length === 0) {
          this.initNewState();
        }
      } catch (e) {
        console.error("Error al parsear LocalStorage. Reiniciando estado...", e);
        this.initNewState();
      }
    } else {
      this.initNewState();
    }
  }

  initNewState() {
    // Clonar profundamente los datos iniciales
    this.groupMatches = JSON.parse(JSON.stringify(initialMatches));
    this.playoffMatches = JSON.parse(JSON.stringify(initialPlayoffMatches));
    this.saveState();
  }

  saveState() {
    const state = {
      groupMatches: this.groupMatches,
      playoffMatches: this.playoffMatches
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }

  bindEvents() {
    // Manejo de Navegación por pestañas
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.getAttribute('data-target');
        this.activeTab = target;

        // Cambiar visibilidad de secciones
        const sections = document.querySelectorAll('.view-section');
        sections.forEach(sec => {
          if (sec.id === target) {
            sec.classList.add('active');
          } else {
            sec.classList.remove('active');
          }
        });

        this.render();
      });
    });

    // Evento del botón Reiniciar
    document.getElementById('reset-tournament-btn').addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres reiniciar todos los resultados del Mundial? Esta acción no se puede deshacer.')) {
        this.initNewState();
        this.render();
      }
    });
  }

  /**
   * Guarda el resultado cargado por el modal y recalcula el torneo.
   */
  saveMatchResult(matchId, scoreData) {
    let match = null;

    if (matchId <= 48) {
      // Fase de grupos
      match = this.groupMatches.find(m => m.id === matchId);
    } else {
      // Playoffs
      match = this.playoffMatches.find(m => m.id === matchId);
    }

    if (match) {
      match.homeScore = scoreData.homeScore;
      match.awayScore = scoreData.awayScore;
      match.homePenalties = scoreData.homePenalties;
      match.awayPenalties = scoreData.awayPenalties;
      match.scorers = scoreData.scorers;
      match.assists = scoreData.assists;

      this.saveState();
      this.render();
    }
  }

  /**
   * Recalcula posiciones, propaga llaves y dibuja la interfaz.
   */
  render() {
    // 1. Recalcular las posiciones de cada grupo para alimentar el bracket
    const groupTables = {};
    const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    groupNames.forEach(g => {
      groupTables[g] = calculateGroupTable(g, teams, this.groupMatches);
    });

    // 2. Propagar resultados en cascada para armar/actualizar brackets
    propagateBracket(this.playoffMatches, groupTables, this.groupMatches);
    
    // Guardar el estado propagado por si cambiaron clasificados
    this.saveState();

    // 3. Renderizar la vista activa
    const mainContainer = document.getElementById(this.activeTab);
    if (this.activeTab === 'groups-view') {
      renderGroupsView(mainContainer, teams, this.groupMatches);
    } else if (this.activeTab === 'fixture-view') {
      renderFixtureView(mainContainer, this.groupMatches, (m) => this.scoreForm.open(m));
    } else if (this.activeTab === 'bracket-view') {
      renderBracketView(mainContainer, this.playoffMatches, (m) => this.scoreForm.open(m));
    }

    // 4. Actualizar Estadísticas Laterales (Goleadores y Asistidores)
    this.renderStatsSidebar();
  }

  renderStatsSidebar() {
    const scorersContainer = document.getElementById('top-scorers-list');
    const assistsContainer = document.getElementById('top-assists-list');

    const topScorers = calculateTopScorers(this.groupMatches, this.playoffMatches);
    const topAssists = calculateTopAssists(this.groupMatches, this.playoffMatches);

    // Renderizar Goleadores
    if (topScorers.length === 0) {
      scorersContainer.innerHTML = '<div class="stats-empty">No hay goles registrados.</div>';
    } else {
      scorersContainer.innerHTML = topScorers.map((item, index) => {
        const teamObj = teams.find(t => t.id === item.team);
        const flag = teamObj ? teamObj.flag : '';
        const teamName = teamObj ? teamObj.name : item.team;
        
        // Medalla para los 3 primeros
        let medal = '';
        if (index === 0) medal = '🥇 ';
        else if (index === 1) medal = '🥈 ';
        else if (index === 2) medal = '🥉 ';

        return `
          <div class="stats-item">
            <div class="stats-player-info">
              <span class="stats-player-name">${medal}${item.player}</span>
              <span class="stats-player-team">${flag ? `<img src="${flag}" class="flag-img" alt="${teamName}">` : ''} ${teamName}</span>
            </div>
            <span class="stats-count">${item.count} ${item.count === 1 ? 'gol' : 'goles'}</span>
          </div>
        `;
      }).join('');
    }

    // Renderizar Asistidores
    if (topAssists.length === 0) {
      assistsContainer.innerHTML = '<div class="stats-empty">No hay asistencias registradas.</div>';
    } else {
      assistsContainer.innerHTML = topAssists.map((item, index) => {
        const teamObj = teams.find(t => t.id === item.team);
        const flag = teamObj ? teamObj.flag : '';
        const teamName = teamObj ? teamObj.name : item.team;

        let medal = '';
        if (index === 0) medal = '🥇 ';
        else if (index === 1) medal = '🥈 ';
        else if (index === 2) medal = '🥉 ';

        return `
          <div class="stats-item">
            <div class="stats-player-info">
              <span class="stats-player-name">${medal}${item.player}</span>
              <span class="stats-player-team">${flag ? `<img src="${flag}" class="flag-img" alt="${teamName}">` : ''} ${teamName}</span>
            </div>
            <span class="stats-count">${item.count} ${item.count === 1 ? 'asist.' : 'asist.'}</span>
          </div>
        `;
      }).join('');
    }
  }
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.start();
});
