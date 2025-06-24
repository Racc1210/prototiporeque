const usuariosGuardados = localStorage.getItem("usuarios");
if (usuariosGuardados) {
  window.usuarios = JSON.parse(usuariosGuardados);
} else {
  window.usuarios = [
    { correo: "davidcg2508@gmail.com", contraseña: "abc123", rol: "user" },
    { correo: "roymarcastillo@gmail.com", contraseña: "abc123", rol: "moderator" },
    { correo: "admin@gmail.com", contraseña: "abc123", rol: "admin" }
  ];
}