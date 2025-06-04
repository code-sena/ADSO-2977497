// Servicio simulado para gestión de clientes
window.clienteService = (function() {
  let clientes = [];

  function generarUsuario(nombre, apellidos) {
    return (nombre[0] + apellidos).toLowerCase();
  }
  function generarContrasena() {
    return Math.random().toString(36).slice(-8);
  }

  function agregarCliente({ tipoDoc, nombre, apellidos, edad, correo }) {
    if (clientes.some(c => c.tipoDoc === tipoDoc && c.nombre === nombre && c.apellidos === apellidos)) {
      return { error: 'Cliente duplicado.' };
    }
    const usuario = generarUsuario(nombre, apellidos);
    const contrasena = generarContrasena();
    clientes.push({ tipoDoc, nombre, apellidos, edad, correo, usuario, contrasena });
    return { usuario, contrasena };
  }

  function eliminarCliente(index) {
    clientes.splice(index, 1);
  }

  function obtenerClientes() {
    return clientes;
  }

  return {
    agregarCliente,
    eliminarCliente,
    obtenerClientes
  };
})();
