document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  console.log(
  "Usuarios actuales:",
  (window.usuarios || []).map(u => `Correo: ${u.correo}, Contraseña: ${u.contraseña}`)
);

  // Obtener valores
  const correo = document.getElementById("correo").value.trim();
  const contraseña = document.getElementById("contraseña").value;

  // Resetear mensajes de error
  document.getElementById("errorCorreo").textContent = "";
  document.getElementById("errorPass").textContent = "";

  // Validaciones básicas
  let isValid = true;

  // 1. Correo no vacío y con formato válido
  if (!correo) {
    document.getElementById("errorCorreo").textContent = "Correo es obligatorio";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    document.getElementById("errorCorreo").textContent = "Correo inválido";
    isValid = false;
  }

  // 2. Contraseña no vacía
  if (!contraseña) {
    document.getElementById("errorPass").textContent = "Contraseña es obligatoria";
    isValid = false;
  }

  // Si las validaciones pasan, simular login
  if (isValid) {
  // Usar el array global de usuarios
  const usuarios = window.usuarios || [];
  const usuario = usuarios.find(u => u.correo === correo && u.contraseña === contraseña);

  if (usuario) {
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    localStorage.setItem("userRole", usuario.rol);
    alert("¡Inicio de sesión exitoso!");
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("errorPass").textContent = "Correo o contraseña incorrectos";
  }
}
});