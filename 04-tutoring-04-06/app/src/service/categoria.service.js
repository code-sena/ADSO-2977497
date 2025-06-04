// Servicio simulado para gestión de categorías
window.categoriaService = (function() {
  let categorias = [];

  function agregarCategoria({ codigo, nombre, descripcion, estado }) {
    if (categorias.some(cat => cat.codigo === codigo)) {
      return { error: 'Categoría duplicada.' };
    }
    categorias.push({ codigo, nombre, descripcion, estado });
    return {};
  }

  function eliminarCategoria(index) {
    categorias.splice(index, 1);
  }

  function obtenerCategorias() {
    return categorias;
  }

  return {
    agregarCategoria,
    eliminarCategoria,
    obtenerCategorias
  };
})();
