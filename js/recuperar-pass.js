document.getElementById("formRecuperar").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const correo = document.getElementById("correo").value.trim();
  document.getElementById("errorCorreo").textContent = "";
  const correoconfirmar = "davidcg2508@gmail.com";

  // Validar formato de correo
  if (!correo) {
    document.getElementById("errorCorreo").textContent = "Correo es obligatorio";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    document.getElementById("errorCorreo").textContent = "Correo inválido";
    return;
  }

  if (correo !== correoconfirmar) {
    document.getElementById("errorCorreo").textContent = "Correo no registrado";
    return;
  }
  
  // Simular envío de código (en un sistema real, se enviaría por email)
  alert(`Se envió un código de verificación a ${correo}. Usa "123456" para pruebas.`);
  
  // Guardar correo para usarlo en la siguiente pantalla
  localStorage.setItem("correoRecuperacion", correo);
  
  // Redirigir a la pantalla de verificación
  window.location.href = "verificar-codigo-pass.html";
});