// Servicio simulado para filtrar tareas por usuario
window.misTareasService = (function() {
  function obtenerMisTareas(usuario) {
    const tareas = window.tareaService.obtenerTareas();
    if (!usuario) return tareas;
    return tareas.filter(t => t.nombre.toLowerCase().includes(usuario.toLowerCase()));
  }
  return {
    obtenerMisTareas
  };
})();
