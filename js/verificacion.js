// Simulación: Código generado aleatoriamente (para pruebas usa "123456")
const codigoCorrecto = "123456"; 
let intentos = 0;

// Obtener el correo guardado en el registro

// Validar código al enviar el formulario
document.getElementById("formVerificacion").addEventListener("submit", function(e) {
  e.preventDefault();
  const codigoIngresado = document.getElementById("codigo").value.trim();
  
  if (codigoIngresado === codigoCorrecto) {
    alert("¡Correo verificado! Redirigiendo al dashboard...");
    localStorage.setItem("usuarioVerificado", "true");
    window.location.href = "dashboard.html";
  } else {
    intentos++;
    document.getElementById("errorCodigo").textContent = `Código incorrecto (Intento ${intentos}/3)`;
    if (intentos >= 3) {
      alert("Límite de intentos alcanzado. Serás redirigido al registro.");
      window.location.href = "registro.html";
    }
  }
});

// Reenviar código (simulación)
document.getElementById("btnReenviar").addEventListener("click", function() {
  alert(`Código reenviado a ${usuarioTemporal.correo}. Usa "${codigoCorrecto}" para pruebas.`);
});