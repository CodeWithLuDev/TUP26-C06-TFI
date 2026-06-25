/**
 * ui.js — Utilidades de interfaz: toasts, modales, helpers DOM
 */

/** ── Toast Notifications ── */
const Toast = {
    _container: null,
  
    init() {
      this._container = document.getElementById('toast-container');
    },
  
    show(title, message = '', type = 'info', duration = 4000) {
      if (!this._container) return;
  
      const icons = {
        success: '✅',
        warning: '⚠️',
        danger:  '❌',
        info:    'ℹ️',
      };
  
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <div class="toast-content">
          <div class="toast-title">${escapeHtml(title)}</div>
          ${message ? `<div class="toast-message">${escapeHtml(message)}</div>` : ''}
        </div>
        <button class="btn-ghost btn-icon" onclick="this.parentElement.remove()" style="margin-left:auto;flex-shrink:0;font-size:1rem;width:24px;height:24px;">✕</button>
      `;
  
      this._container.appendChild(toast);
  
      setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },
  
    success(title, message)  { this.show(title, message, 'success'); },
    warning(title, message)  { this.show(title, message, 'warning'); },
    error(title, message)    { this.show(title, message, 'danger'); },
    info(title, message)     { this.show(title, message, 'info'); },
  };
  
  /** ── Modal Manager ── */
  const Modal = {
    _stack: [],
  
    open(id) {
      const overlay = document.getElementById(id);
      if (!overlay) return;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      this._stack.push(id);
  
      // Cerrar con Escape
      const handler = (e) => {
        if (e.key === 'Escape') { this.close(id); document.removeEventListener('keydown', handler); }
      };
      document.addEventListener('keydown', handler);
  
      // Cerrar al click en overlay
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close(id);
      }, { once: true });
    },
  
    close(id) {
      const overlay = document.getElementById(id);
      if (!overlay) return;
      overlay.classList.remove('open');
      this._stack = this._stack.filter(s => s !== id);
      if (this._stack.length === 0) document.body.style.overflow = '';
    },
  
    closeAll() {
      this._stack.forEach(id => {
        const overlay = document.getElementById(id);
        if (overlay) overlay.classList.remove('open');
      });
      this._stack = [];
      document.body.style.overflow = '';
    },
  };
  
  /** ── Navigation ── */
  const Nav = {
    _paginas: {},
    _activa: null,
  
    init(paginas) {
      this._paginas = paginas;
    },
  
    irA(nombrePagina) {
      if (this._activa === nombrePagina) return;
  
      // Desactivar página actual
      if (this._activa) {
        const pageEl = document.getElementById(`page-${this._activa}`);
        if (pageEl) pageEl.classList.remove('active');
      }
  
      // Activar nueva página
      const nuevaPage = document.getElementById(`page-${nombrePagina}`);
      if (nuevaPage) {
        nuevaPage.classList.add('active');
        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  
      this._activa = nombrePagina;
  
      // Actualizar nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === nombrePagina);
      });
  
      // Callback de render
      if (this._paginas[nombrePagina]) {
        this._paginas[nombrePagina]();
      }
    },
  };
  
  /** ── Helpers DOM ── */
  
  /** Escapa HTML para prevenir XSS */
  function escapeHtml(str) {
    if (typeof str !== 'string') return String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  /** Renderiza contenido en un elemento por ID */
  function renderizar(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  
  /** Muestra/oculta un elemento */
  function mostrar(id, mostrar = true) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', !mostrar);
  }
  
  /** Añade clase activa a botón y la quita de sus hermanos */
  function setActivo(btn, selector) {
    document.querySelectorAll(selector).forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }
  
  /** Crea un badge de estado para un partido */
  function badgeEstadoPartido(resultado) {
    if (!resultado || !resultado.jugado) {
      return `<span class="badge badge-neutral">Pendiente</span>`;
    }
    return `<span class="badge badge-success">Jugado</span>`;
  }
  
  /** Formatea el resultado de un partido de grupos */
  function formatResultadoGrupo(resultado) {
    if (!resultado || !resultado.jugado) return 'vs';
    return `${resultado.golesLocal} - ${resultado.golesVisitante}`;
  }
  
  /** Formatea el resultado de un partido de playoff */
  function formatResultadoPlayoff(resultado) {
    if (!resultado) return 'vs';
    let base = `${resultado.gl} - ${resultado.gv}`;
    if (resultado.tipoResultado === 'penales') {
      base += ` <span class="result-type-badge">PEN</span>`;
    } else if (resultado.tipoResultado === 'extratime') {
      base += ` <span class="result-type-badge">ET</span>`;
    }
    return base;
  }
  
  /** Genera clases de posición para la tabla */
  function clasePosicion(posicion, grupoCompleto) {
    if (!grupoCompleto) return '';
    if (posicion === 1) return 'qualifier-1';
    if (posicion === 2) return 'qualifier-2';
    return 'eliminated';
  }
  
  /** Ícono de tendencia de resultado */
  function iconoResultado(golesLocal, golesVisitante, esLocal) {
    if (golesLocal === golesVisitante) return '🟡';
    if (esLocal && golesLocal > golesVisitante) return '🟢';
    if (!esLocal && golesVisitante > golesLocal) return '🟢';
    return '🔴';
  }
  
  /** Formatea número con signo para diferencia de goles */
  function formatDG(dg) {
    if (dg > 0) return `+${dg}`;
    return String(dg);
  }
  
  /** Anima un número contador */
  function animarContador(elemento, valor, duracion = 600) {
    const inicio = 0;
    const pasos  = 30;
    const incremento = valor / pasos;
    let actual = inicio;
    let paso   = 0;
  
    const timer = setInterval(() => {
      paso++;
      actual = Math.round(inicio + incremento * paso);
      if (elemento) elemento.textContent = actual;
      if (paso >= pasos) {
        clearInterval(timer);
        if (elemento) elemento.textContent = valor;
      }
    }, duracion / pasos);
  }
  
  /** Posición con ícono de medalla */
  function iconoPosicion(pos) {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return pos;
  }
  
  /** Clase CSS para posición de ranking */
  function claseRanking(pos) {
    if (pos === 1) return 'rank-1';
    if (pos === 2) return 'rank-2';
    if (pos === 3) return 'rank-3';
    return 'rank-other';
  }
  