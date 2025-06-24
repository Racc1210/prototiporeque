document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("formNuevaPass");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nuevaPass = document.getElementById("nuevaPass").value;
    const confirmarPass = document.getElementById("confirmarPass").value;

    document.getElementById("errorNuevaPass").textContent = "";
    document.getElementById("errorConfirmarPass").textContent = "";

    let isValid = true;

    if (nuevaPass.length < 6) {
      document.getElementById("errorNuevaPass").textContent = "Mínimo 6 caracteres";
      isValid = false;
    }
    if (nuevaPass !== confirmarPass) {
      document.getElementById("errorConfirmarPass").textContent = "Las contraseñas no coinciden";
      isValid = false;
    }

    // Obtener el correo del usuario que está cambiando la contraseña
    const correo = localStorage.getItem("correoRecuperacion");

    if (isValid && correo) {
      // Buscar y actualizar la contraseña en el array global
      const usuarios = window.usuarios || [];
      const usuario = usuarios.find(u => u.correo === correo);
      if (usuario) {
        usuario.contraseña = nuevaPass;

        // Guardar el array actualizado en localStorage
        localStorage.setItem("usuarios", JSON.stringify(window.usuarios));

        // Mostrar usuarios actuales en consola (solo para pruebas)
        console.log(
          "Usuarios actuales:",
          window.usuarios.map(u => `Correo: ${u.correo}, Contraseña: ${u.contraseña}`)
        );

        alert("¡Contraseña actualizada con éxito! Serás redirigido al login.");
        localStorage.removeItem("correoRecuperacion");
        window.location.href = "index.html";
      } else {
        alert("No se encontró el usuario para actualizar la contraseña.");
      }
    }
  });
});