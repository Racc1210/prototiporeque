// Código correcto (simulado)
const codigoCorrecto = "123456";
let intentos = 0;
console.log(
  "Usuarios actuales:",
  (window.usuarios || []).map(u => `Correo: ${u.correo}, Contraseña: ${u.contraseña}`)
);

// Obtener el correo guardado en el registro
const usuarioTemporal = JSON.parse(localStorage.getItem("usuarioTemporal"));
if (!usuarioTemporal) {
  window.location.href = "registro.html"; // Si no hay datos, redirige al registro
}

// Validar código al enviar el formulario
document.getElementById("formVerificacion").addEventListener("submit", function(e) {
  e.preventDefault();
  // Unir los valores de los 6 inputs
  const codigoIngresado =
    document.getElementById("codigo1").value.trim() +
    document.getElementById("codigo2").value.trim() +
    document.getElementById("codigo3").value.trim() +
    document.getElementById("codigo4").value.trim() +
    document.getElementById("codigo5").value.trim() +
    document.getElementById("codigo6").value.trim();

  if (codigoIngresado === codigoCorrecto) {
    alert("¡Correo verificado! Redirigiendo al dashboard...");
    localStorage.setItem("usuarioVerificado", "true");
    window.location.href = "index.html";
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

// Mover foco automáticamente entre inputs de código
const inputs = Array.from(document.querySelectorAll('.codigo-input'));
inputs.forEach((input, idx) => {
  input.addEventListener('input', (e) => {
    if (input.value.length === 1 && idx < inputs.length - 1) {
      inputs[idx + 1].focus();
    }
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && input.value === '' && idx > 0) {
      inputs[idx - 1].focus();
    }
  });
});