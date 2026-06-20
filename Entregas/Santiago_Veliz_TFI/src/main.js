/**
 * Punto de entrada principal de la aplicación.
 * Orquesta el renderizado inicial y el manejo de eventos globales.
 */
import { renderFixture } from './ui/fixture.js';
import { renderGrupos } from './ui/grupos.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar vistas
    renderFixture();
    renderGrupos();
    
    // Aquí luego agregaremos la lógica para cambiar entre pestañas/secciones
});