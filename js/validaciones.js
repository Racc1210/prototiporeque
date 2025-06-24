document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("formRegistro");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Obtener valores de los campos
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contraseña = document.getElementById("contraseña").value;
    const confirmarPass = document.getElementById("confirmarPass").value;

    // Limpiar mensajes de error
    document.getElementById("errorNombre").textContent = "";
    document.getElementById("errorCorreo").textContent = "";
    document.getElementById("errorPass").textContent = "";
    document.getElementById("errorConfirmar").textContent = "";

    let isValid = true;

    // Validaciones básicas
    if (nombre.length < 3) {
      document.getElementById("errorNombre").textContent = "Nombre muy corto";
      isValid = false;
    }
    if (!correo.includes("@") || !correo.includes(".")) {
      document.getElementById("errorCorreo").textContent = "Correo inválido";
      isValid = false;
    }
    if (contraseña.length < 6) {
      document.getElementById("errorPass").textContent = "Mínimo 6 caracteres";
      isValid = false;
    }
    if (contraseña !== confirmarPass) {
      document.getElementById("errorConfirmar").textContent = "Las contraseñas no coinciden";
      isValid = false;
    }

    // Verificar si el correo ya existe
    const usuarios = window.usuarios || [];
    if (usuarios.some(u => u.correo === correo)) {
      document.getElementById("errorCorreo").textContent = "El correo ya está registrado";
      isValid = false;
    }

    if (isValid) {
      // Agregar usuario al array global
      window.usuarios.push({
        nombre,
        correo,
        contraseña,
        rol: "user"
      });

      // Guardar en localStorage para persistencia entre páginas
      localStorage.setItem("usuarios", JSON.stringify(window.usuarios));

      // Mostrar usuarios actuales en consola (solo para pruebas)
      console.log(
        "Usuarios actuales:",
        window.usuarios.map(u => `Correo: ${u.correo}, Contraseña: ${u.contraseña}`)
      );

      alert("¡Registro exitoso!");
      window.location.href = "verificar-correo.html";
    }
  });
});