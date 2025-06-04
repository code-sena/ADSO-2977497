// Servicio simulado para gestión de tareas
window.tareaService = (function() {
  let tareas = [];

  function agregarTarea({ codigo, nombre, descripcion, estado, fechaInicio, fechaFin, categoria }) {
    if (tareas.some(t => t.codigo === codigo)) {
      return { error: 'Tarea duplicada.' };
    }
    tareas.push({ codigo, nombre, descripcion, estado, fechaInicio, fechaFin, categoria });
    return {};
  }

  function eliminarTarea(index) {
    tareas.splice(index, 1);
  }

  function obtenerTareas() {
    return tareas;
  }

  return {
    agregarTarea,
    eliminarTarea,
    obtenerTareas
  };
})();
