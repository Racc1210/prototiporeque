document.getElementById("formRegistro").addEventListener("submit", function(e) {
  e.preventDefault(); // Evitar envío real

  // Obtener valores
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const contraseña = document.getElementById("contraseña").value;
  const confirmarPass = document.getElementById("confirmarPass").value;

  // Resetear mensajes de error
  document.querySelectorAll(".error-message").forEach(el => el.textContent = "");

  // Validaciones
  let isValid = true;

  // 1. Nombre no vacío
  if (nombre === "") {
    document.getElementById("errorNombre").textContent = "Nombre es obligatorio";
    isValid = false;
  }

  // 2. Correo válido
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    document.getElementById("errorCorreo").textContent = "Correo inválido";
    isValid = false;
  }

  // 3. Contraseña segura (mínimo 6 caracteres)
  if (contraseña.length < 6) {
    document.getElementById("errorPass").textContent = "Mínimo 6 caracteres";
    isValid = false;
  }

  // 4. Contraseñas coinciden
  if (contraseña !== confirmarPass) {
    document.getElementById("errorConfirmar").textContent = "Las contraseñas no coinciden";
    isValid = false;
  }

  // Si todo es válido, simular registro exitoso
  if (isValid) {
    alert("¡Registro exitoso! (simulado). Redirigiendo a verificación...");
    localStorage.setItem("usuarioTemporal", JSON.stringify({ nombre, correo }));
    window.location.href = "verificar-correo.html"; // Redirigir a siguiente pantalla
  }
});