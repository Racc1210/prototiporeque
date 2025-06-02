document.getElementById("formNuevaPass").addEventListener("submit", function(e) {
  e.preventDefault();
  
  // Obtener valores
  const nuevaPass = document.getElementById("nuevaPass").value;
  const confirmarPass = document.getElementById("confirmarPass").value;

  // Resetear mensajes de error
  document.getElementById("errorNuevaPass").textContent = "";
  document.getElementById("errorConfirmarPass").textContent = "";

  // Validaciones
  let isValid = true;

  // 1. Contraseña segura (mínimo 6 caracteres)
  if (nuevaPass.length < 6) {
    document.getElementById("errorNuevaPass").textContent = "Mínimo 6 caracteres";
    isValid = false;
  }

  // 2. Contraseñas coinciden
  if (nuevaPass !== confirmarPass) {
    document.getElementById("errorConfirmarPass").textContent = "Las contraseñas no coinciden";
    isValid = false;
  }

  // Si todo es válido, simular cambio exitoso
  if (isValid) {
    // En un sistema real, aquí se enviaría la nueva contraseña al backend
    alert("¡Contraseña actualizada con éxito! Serás redirigido al login.");
    localStorage.removeItem("correoRecuperacion"); // Limpiar datos temporales
    window.location.href = "index.html"; // Redirigir al login
  }
});