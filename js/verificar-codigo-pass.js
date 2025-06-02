// Código correcto (simulado)
const CODIGO_CORRECTO = "123456";
let intentos = 0;

// Obtener correo guardado en el paso anterior
const correo = localStorage.getItem("correoRecuperacion");
if (!correo) {
  window.location.href = "recuperar-pass.html"; // Si no hay correo, redirigir
}

// Validar código
document.getElementById("formVerificarCodigo").addEventListener("submit", function(e) {
  e.preventDefault();
  const codigoIngresado = document.getElementById("codigo").value.trim();
  
  if (codigoIngresado === CODIGO_CORRECTO) {
    // Redirigir a la pantalla de nueva contraseña
    window.location.href = "nueva-pass.html";
  } else {
    intentos++;
    document.getElementById("errorCodigo").textContent = `Código incorrecto (Intento ${intentos}/3)`;
    
    // Bloquear después de 3 intentos
    if (intentos >= 3) {
      alert("Límite de intentos alcanzado. Serás redirigido.");
      window.location.href = "recuperar-pass.html";
    }
  }
});

// Reenviar código (simulación)
document.getElementById("btnReenviar").addEventListener("click", function() {
  alert(`Código reenviado a ${correo}. Usa "${CODIGO_CORRECTO}" para pruebas.`);
});