document.addEventListener('DOMContentLoaded', () => {
  construirMenuLateral();
  initCarousel();
  
  window.actividades = [
    {
      id: 1,
      titulo: 'Entrenamiento Matutino',
      descripcion: 'Sesión de ejercicio al aire libre en el parque central.',
      limite: 10,
      ubicacion: { lat: 9.998, lng: -83.753 },
      fecha: '2025-06-12',
      hora: '08:00 AM - 09:00 AM'
    },
    {
      id: 2,
      titulo: 'Clase de Yoga',
      descripcion: 'Clase de yoga para mejorar la flexibilidad y la concentración.',
      limite: 15,
      ubicacion: { lat: 9.7489, lng: -83.7534 },
      fecha: '2025-06-12',
      hora: '10:00 AM - 11:00 AM'
    },
    {
      id: 3,
      titulo: 'Competencia de Ciclismo',
      descripcion: 'Carrera de bicicletas para poner a prueba tu resistencia.',
      limite: 20,
      ubicacion: { lat: 9.9, lng: -84.000 },
      fecha: '2025-06-20',
      hora: '07:30 AM - 09:20 AM'
    }
  ];

  // Variable para controlar inscritos por actividad.
  let inscritosPorActividad = new Map();
  actividades.forEach(activity => {
    inscritosPorActividad.set(activity.id, 0);
  });

  const btnGenerarActividad = document.getElementById('generateActivity');
  const crearActividadContainer = document.getElementById('crearActividadContainer');
  const formActividad = document.getElementById('formActividad');
  const listaActividadesContainer = document.getElementById('listaActividadesContainer');
  const listaActividades = document.getElementById('listaActividades');
  const filtroBusqueda = document.getElementById('filtroBusqueda');

  document.getElementById('filtroBusqueda').addEventListener('input', renderUserListaActividades);
  document.getElementById('filtroCategoria').addEventListener('change', renderUserListaActividades);
  document.getElementById('filtroEstado').addEventListener('change', renderUserListaActividades);
  document.getElementById('filtroFecha').addEventListener('change', renderUserListaActividades);
  document.getElementById('filtroUbicacion').addEventListener('input', renderUserListaActividades);


  let actividadesInscritas = [
  {
    id: 2,
    titulo: 'Clase de Yoga',
    fecha: '2025-06-16',
    hora: '07:30',
    ubicacion: 'Centro Comunal',
    estado: 'confirmado'
  },
  {
    id: 3,
    titulo: 'Competencia de Ciclismo',
    fecha: '2025-06-18',
    hora: '08:00',
    ubicacion: 'Circuito Deportivo',
    estado: 'confirmado'
  },
  {
    id: 101,
    titulo: 'Maratón Nocturno',
    fecha: '2025-06-20',
    hora: '18:00',
    ubicacion: 'Centro de la Ciudad',
    estado: 'confirmado'
  }
];

// Función para renderizar el calendario con actividades inscritas
function renderCalendarioActividades() {
  const calendarioContainer = document.getElementById('calendarioActividades');
  if (!calendarioContainer) return;
  
  calendarioContainer.innerHTML = '';
  
  if (actividadesInscritas.length === 0) {
    calendarioContainer.innerHTML = '<p style="text-align: center; color: #999; font-style: italic;">No tienes actividades programadas</p>';
    return;
  }
  
  // Agrupar actividades por fecha
  const actividadesPorFecha = actividadesInscritas.reduce((grupos, actividad) => {
    const fecha = actividad.fecha;
    if (!grupos[fecha]) {
      grupos[fecha] = [];
    }
    grupos[fecha].push(actividad);
    return grupos;
  }, {});
  
  // Ordenar fechas
  const fechasOrdenadas = Object.keys(actividadesPorFecha).sort();
  
  fechasOrdenadas.forEach(fecha => {
    const fechaFormateada = formatearFecha(fecha);
    const dayGroup = document.createElement('div');
    dayGroup.className = 'calendar-day-group';
    
    const fechaHeader = document.createElement('h3');
    fechaHeader.className = 'calendar-date-header';
    fechaHeader.innerHTML = `<i class="fas fa-calendar-day"></i> ${fechaFormateada}`;
    dayGroup.appendChild(fechaHeader);
    
    actividadesPorFecha[fecha].forEach(actividad => {
      const actividadCard = document.createElement('div');
      actividadCard.className = `calendar-activity-card estado-${actividad.estado}`;
      actividadCard.innerHTML = `
        <div class="calendar-activity-info">
          <div class="calendar-activity-main">
            <h4><i class="fas fa-dumbbell"></i> ${actividad.titulo}</h4>
            <div class="calendar-activity-details">
              <span class="calendar-time"><i class="fas fa-clock"></i> ${actividad.hora}</span>
              <span class="calendar-location"><i class="fas fa-map-marker-alt"></i> ${actividad.ubicacion}</span>
              <span class="calendar-status status-${actividad.estado}">
                ${actividad.estado === 'confirmado' ? 'Confirmado' : 'Pendiente'}
              </span>
            </div>
          </div>
          <div class="calendar-activity-actions">
            <button class="btn-ver-detalle-calendario" onclick="mostrarDetalleActividadCalendario(${actividad.id})">
              <i class="fas fa-eye"></i> Ver
            </button>
            <button class="btn-desinscribir-calendario" onclick="confirmarDesinscripcion(${actividad.id})">
              <i class="fas fa-times"></i> Salir
            </button>
          </div>
        </div>
      `;
      dayGroup.appendChild(actividadCard);
    });
    
    calendarioContainer.appendChild(dayGroup);
  });
}

// Función para formatear fecha
function formatearFecha(fechaStr) {
  const fecha = new Date(fechaStr + 'T00:00:00');
  const opciones = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return fecha.toLocaleDateString('es-ES', opciones);
}

// Función global para mostrar detalle de actividad desde calendario
window.mostrarDetalleActividadCalendario = function(actividadId) {
  const actividadInscrita = actividadesInscritas.find(act => act.id === actividadId);
  if (!actividadInscrita) return;
  
  // Buscar la actividad completa en la lista principal
  let actividadCompleta = actividades.find(act => act.id === actividadId);
  if (!actividadCompleta) {
    actividadCompleta = actividadesPendientesMod.find(act => act.id === actividadId);
  }
  
  hideAllViews();
  document.getElementById('detalleActividadCalendarioContainer').style.display = 'block';
  
  // Rellenar información básica
  document.getElementById('calActTitulo').textContent = actividadInscrita.titulo;
  document.getElementById('calActFecha').textContent = formatearFecha(actividadInscrita.fecha);
  document.getElementById('calActHora').textContent = actividadInscrita.hora;
  document.getElementById('calActUbicacion').textContent = actividadInscrita.ubicacion;
  document.getElementById('calActEstado').textContent = actividadInscrita.estado === 'confirmado' ? 'Confirmado' : 'Pendiente de confirmación';
  
  // Si encontramos la actividad completa, mostrar más detalles
  if (actividadCompleta) {
    document.getElementById('calActDescripcion').textContent = actividadCompleta.descripcion;
    document.getElementById('calActLimite').textContent = actividadCompleta.limite;
    
    // Inicializar mapa si existe ubicación
    if (actividadCompleta.ubicacion) {
      if (window.calendarioActividadMap) {
        window.calendarioActividadMap.remove();
      }
      window.calendarioActividadMap = L.map('calendarioActividadMapa').setView([actividadCompleta.ubicacion.lat, actividadCompleta.ubicacion.lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(window.calendarioActividadMap);
      L.marker([actividadCompleta.ubicacion.lat, actividadCompleta.ubicacion.lng]).addTo(window.calendarioActividadMap);
    }
  } else {
    document.getElementById('calActDescripcion').textContent = 'Información no disponible';
    document.getElementById('calActLimite').textContent = 'No especificado';
  }
  
  // Configurar botones
  document.getElementById('btnDesinscribirseDetalle').onclick = () => confirmarDesinscripcion(actividadId);
  document.getElementById('btnVolverCalendario').onclick = () => {
    hideAllViews();
    document.getElementById('calendarContainer').style.display = 'block';
    renderCalendarioActividades();
  };
};

// Función global para confirmar desinscripción
window.confirmarDesinscripcion = function(actividadId) {
  const actividad = actividadesInscritas.find(act => act.id === actividadId);
  if (!actividad) return;
  
  document.getElementById('modalDesinscripcion').style.display = 'block';
  document.getElementById('desinscripcionActividadTitulo').textContent = actividad.titulo;
  document.getElementById('desinscripcionActividadFecha').textContent = `${formatearFecha(actividad.fecha)} a las ${actividad.hora}`;
  document.getElementById('desinscripcionActividadUbicacion').textContent = actividad.ubicacion;
  
  document.getElementById('btnConfirmarDesinscripcion').onclick = () => procesarDesinscripcion(actividadId);
  document.getElementById('btnCancelarDesinscripcion').onclick = () => {
    document.getElementById('modalDesinscripcion').style.display = 'none';
  };
};



  let usuarios = [
  {
    id: 1,
    nombre: 'Juan Carlos Pérez',
    email: 'juan.perez@email.com',
    rol: 'user',
    fechaRegistro: '2025-01-15',
    ultimoAcceso: '2025-06-12'
  },
  {
    id: 2,
    nombre: 'María Elena González',
    email: 'maria.gonzalez@email.com',
    rol: 'moderator',
    fechaRegistro: '2025-02-20',
    ultimoAcceso: '2025-06-11'
  },
  {
    id: 3,
    nombre: 'Carlos Eduardo Ramírez',
    email: 'carlos.ramirez@email.com',
    rol: 'user',
    fechaRegistro: '2025-03-10',
    ultimoAcceso: '2025-06-10'
  },
  {
    id: 4,
    nombre: 'Ana Sofia Jiménez',
    email: 'ana.jimenez@email.com',
    rol: 'moderator',
    fechaRegistro: '2025-01-05',
    ultimoAcceso: '2025-06-12'
  },
  {
    id: 5,
    nombre: 'Roberto Luis Vargas',
    email: 'roberto.vargas@email.com',
    rol: 'user',
    fechaRegistro: '2025-04-18',
    ultimoAcceso: '2025-06-09'
  },
  {
    id: 6,
    nombre: 'Patricia Morales Castro',
    email: 'patricia.morales@email.com',
    rol: 'user',
    fechaRegistro: '2025-05-02',
    ultimoAcceso: '2025-06-11'
  }
];

// ...existing code...
function renderGestionActividadesAdmin() {
  const actividadesContainer = document.getElementById('actividadesAdminLista');
  const busquedaInput = document.getElementById('busquedaActividades');
  const filtroCategoria = document.getElementById('filtroCategoria');
  const filtroEstado = document.getElementById('filtroEstado');
  const filtroFecha = document.getElementById('filtroFecha');
  const filtroUbicacion = document.getElementById('filtroUbicacion');
  
  if (!actividadesContainer) return;
  
  const textoBusqueda = busquedaInput ? busquedaInput.value.toLowerCase() : '';
  const categoriaSeleccionada = filtroCategoria ? filtroCategoria.value : '';
  const estadoSeleccionado = filtroEstado ? filtroEstado.value : '';
  const fechaSeleccionada = filtroFecha ? filtroFecha.value : '';
  const ubicacionTexto = filtroUbicacion ? filtroUbicacion.value.toLowerCase() : '';
  
  actividadesContainer.innerHTML = '';
  
  // Combinar todas las actividades con información adicional
  const todasActividades = [
    ...actividades.map(act => ({
      ...act,
      categoria: 'deportiva',
      estado: 'Aceptada',
      fecha: '2025-06-15',
      ubicacionTexto: 'Parque Central'
    })),
    ...actividadesPendientesMod.map(act => ({
      ...act,
      categoria: 'recreativa',
      estado: 'En Evaluación',
      fecha: act.fechaSolicitud,
      ubicacionTexto: 'Ubicación pendiente'
    }))
  ];
  
  const actividadesFiltradas = todasActividades.filter(actividad => {
    const cumpleTexto = actividad.titulo.toLowerCase().includes(textoBusqueda) ||
                       actividad.descripcion.toLowerCase().includes(textoBusqueda);
    const cumpleCategoria = !categoriaSeleccionada || actividad.categoria === categoriaSeleccionada;
    const cumpleEstado = !estadoSeleccionado || actividad.estado === estadoSeleccionado;
    const cumpleFecha = !fechaSeleccionada || actividad.fecha === fechaSeleccionada;
    const cumpleUbicacion = !ubicacionTexto || actividad.ubicacionTexto.toLowerCase().includes(ubicacionTexto);
    
    return cumpleTexto && cumpleCategoria && cumpleEstado && cumpleFecha && cumpleUbicacion;
  });
  
  if (actividadesFiltradas.length === 0) {
    actividadesContainer.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No se encontraron actividades</p>';
    return;
  }
  
  actividadesFiltradas.forEach(actividad => {
    const card = document.createElement('div');
    card.className = 'actividad-admin-card';
    card.innerHTML = `
      <div class="actividad-admin-header">
        <div class="actividad-admin-info">
          <h3><i class="fas fa-calendar-alt"></i> ${actividad.titulo}</h3>
          <span class="actividad-categoria categoria-${actividad.categoria}">${getCategoriaLabel(actividad.categoria)}</span>
        </div>
        <span class="actividad-estado estado-${actividad.estado.replace(' ', '-').toLowerCase()}">${actividad.estado}</span>
      </div>
      <div class="actividad-admin-detalles">
        <p><strong><i class="fas fa-align-left"></i> Descripción:</strong> ${actividad.descripcion.substring(0, 100)}${actividad.descripcion.length > 100 ? '...' : ''}</p>
        <p><strong><i class="fas fa-users"></i> Límite:</strong> ${actividad.limite} participantes</p>
        <p><strong><i class="fas fa-calendar"></i> Fecha:</strong> ${actividad.fecha}</p>
        <p><strong><i class="fas fa-map-marker-alt"></i> Ubicación:</strong> ${actividad.ubicacionTexto}</p>
        ${actividad.solicitante ? `<p><strong><i class="fas fa-user"></i> Solicitante:</strong> ${actividad.solicitante}</p>` : ''}
      </div>
      <div class="actividad-admin-acciones">
        <button class="btn-ver-actividad" onclick="mostrarDetalleActividadAdmin(${actividad.id})">
          <i class="fas fa-eye"></i> Ver Detalle
        </button>
        <button class="btn-eliminar-actividad" onclick="confirmarEliminarActividad(${actividad.id})">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `;
    actividadesContainer.appendChild(card);
  });
}

function getCategoriaLabel(categoria) {
  const categorias = {
    'deportiva': 'Deportiva',
    'recreativa': 'Recreativa',
    'cultural': 'Cultural',
    'educativa': 'Educativa'
  };
  return categorias[categoria] || categoria;
}

function renderUserListaActividades() {
  const busqueda = document.getElementById('filtroBusqueda').value.toLowerCase();
  const categoria = document.getElementById('filtroCategoria').value;
  const estado = document.getElementById('filtroEstado').value;
  const fecha = document.getElementById('filtroFecha').value;
  const ubicacion = document.getElementById('filtroUbicacion').value.toLowerCase();

  const listaActividades = document.getElementById('listaActividades');
  listaActividades.innerHTML = '';

  // Filtrar actividades con base en los filtros
  const actividadesFiltradas = window.actividades.filter(act => {
    const matchBusqueda = act.titulo.toLowerCase().includes(busqueda) ||
                          act.descripcion.toLowerCase().includes(busqueda);
    const matchCategoria = categoria === "" || (act.categoria && act.categoria === categoria);
    const matchEstado = estado === "" || (act.estado && act.estado === estado);
    const matchFecha = fecha === "" || act.fecha === fecha;
    const actUbicacion = act.ubicacion ? `${act.ubicacion.lat},${act.ubicacion.lng}` : "";
    const matchUbicacion = ubicacion === "" || actUbicacion.toLowerCase().includes(ubicacion);
    return matchBusqueda && matchCategoria && matchEstado && matchFecha && matchUbicacion;
  });

  if (actividadesFiltradas.length === 0) {
    listaActividades.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No se encontraron actividades</p>';
    return;
  }

  actividadesFiltradas.forEach(act => {
    const card = document.createElement('div');
    card.className = 'user-activity-card';

    card.innerHTML = `
      <div class="detalle-content" style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
        <div class="detalle-info">
          <div class="info-group">
            <label><i class="fas fa-calendar"></i> Fecha:</label>
            <span>${act.fecha || '-'}</span>
          </div>
          <div class="info-group">
            <label><i class="fas fa-clock"></i> Hora:</label>
            <span>${act.hora || '-'}</span>
          </div>
          <div class="info-group">
            <label><i class="fas fa-map-marker-alt"></i> Ubicación:</label>
            <span>${act.ubicacion ? `${act.ubicacion.lat.toFixed(4)}, ${act.ubicacion.lng.toFixed(4)}` : '-'}</span>
          </div>
          <div class="info-group">
            <label><i class="fas fa-align-left"></i> Descripción:</label>
            <p>${act.descripcion}</p>
          </div>
          <div class="info-group">
            <label><i class="fas fa-users"></i> Límite de participantes:</label>
            <span>${act.limite || '-'}</span>
          </div>
        </div>
        <div class="user-activity-actions" style="display: flex; flex-direction: column; gap: 10px; align-items: flex-end;">
          <button class="btn-ver-detalle">
            <i class="fas fa-eye"></i> Ver Detalle
          </button>
        </div>
      </div>
    `;

    card.querySelector('.btn-ver-detalle').addEventListener('click', function(e) {
      e.stopPropagation();
      mostrarDetalleActividad(act.id);
    });

    listaActividades.appendChild(card);
  });
}



// Función global para mostrar detalle de actividad (admin)
window.mostrarDetalleActividadAdmin = function(actividadId) {
  // Buscar en ambas listas
  let actividad = actividades.find(act => act.id === actividadId);
  if (!actividad) {
    actividad = actividadesPendientesMod.find(act => act.id === actividadId);
  }
  
  if (!actividad) return;
  
  hideAllViews();
  document.getElementById('detalleActividadAdminContainer').style.display = 'block';
  
  document.getElementById('adminActTitulo').textContent = actividad.titulo;
  document.getElementById('adminActDescripcion').textContent = actividad.descripcion;
  document.getElementById('adminActLimite').textContent = actividad.limite;
  document.getElementById('adminActFecha').textContent = actividad.fecha || actividad.fechaSolicitud || '2025-06-15';
  
  if (actividad.solicitante) {
    document.getElementById('adminActSolicitante').textContent = actividad.solicitante;
    document.getElementById('solicitanteGroup').style.display = 'block';
  } else {
    document.getElementById('solicitanteGroup').style.display = 'none';
  }
  
  // Inicializar mapa
  if (window.adminActividadMap) {
    window.adminActividadMap.remove();
  }
  window.adminActividadMap = L.map('adminActividadMapa').setView([actividad.ubicacion.lat, actividad.ubicacion.lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(window.adminActividadMap);
  L.marker([actividad.ubicacion.lat, actividad.ubicacion.lng]).addTo(window.adminActividadMap);
  
  document.getElementById('btnVolverGestionActividades').onclick = () => {
    hideAllViews();
    document.getElementById('gestionActividadesAdminContainer').style.display = 'block';
    renderGestionActividadesAdmin();
  };
};

// Función global para confirmar eliminación de actividad
window.confirmarEliminarActividad = function(actividadId) {
  // Buscar en ambas listas
  let actividad = actividades.find(act => act.id === actividadId);
  let esPendiente = false;
  
  if (!actividad) {
    actividad = actividadesPendientesMod.find(act => act.id === actividadId);
    esPendiente = true;
  }
  
  if (!actividad) return;
  
  document.getElementById('modalEliminarActividad').style.display = 'block';
  document.getElementById('eliminarActividadTitulo').textContent = actividad.titulo;
  document.getElementById('eliminarActividadDescripcion').textContent = actividad.descripcion.substring(0, 100) + '...';
  
  const inscritosTexto = esPendiente ? 'Sin inscripciones aún' : `${inscritosPorActividad.get(actividadId) || 0} personas inscritas`;
  document.getElementById('eliminarActividadInscritos').textContent = inscritosTexto;
  
  document.getElementById('btnConfirmarEliminacionActividad').onclick = () => eliminarActividad(actividadId, esPendiente);
  document.getElementById('btnCancelarEliminacionActividad').onclick = () => {
    document.getElementById('modalEliminarActividad').style.display = 'none';
  };
};

function eliminarActividad(actividadId, esPendiente) {
  let actividad;
  
  if (esPendiente) {
    actividad = actividadesPendientesMod.find(act => act.id === actividadId);
    actividadesPendientesMod = actividadesPendientesMod.filter(act => act.id !== actividadId);
  } else {
    actividad = actividades.find(act => act.id === actividadId);
    actividades = actividades.filter(act => act.id !== actividadId);
    inscritosPorActividad.delete(actividadId);
  }
  
  if (actividad) {
    const tipoActividad = esPendiente ? 'pendiente' : 'aprobada';
    alert(`Actividad "${actividad.titulo}" eliminada exitosamente.\nSe eliminaron todas las inscripciones asociadas.`);
    
    document.getElementById('modalEliminarActividad').style.display = 'none';
    renderGestionActividadesAdmin();
  }
}

// Event listeners para filtros
document.addEventListener('DOMContentLoaded', () => {
  // ...existing code...
  
  setTimeout(() => {
    const elementos = [
      'busquedaActividades',
      'filtroCategoria', 
      'filtroEstado',
      'filtroFecha',
      'filtroUbicacion'
    ];
    
    elementos.forEach(elementId => {
      const elemento = document.getElementById(elementId);
      if (elemento) {
        elemento.addEventListener('input', () => {
          renderGestionActividadesAdmin();
        });
        elemento.addEventListener('change', () => {
          renderGestionActividadesAdmin();
        });
      }
    });
  }, 100);
});

// Funciones para gestión de usuarios
function renderGestionUsuarios() {
  const usuariosContainer = document.getElementById('usuariosLista');
  const busquedaInput = document.getElementById('busquedaUsuarios');
  
  if (!usuariosContainer) return;
  
  const filtro = busquedaInput ? busquedaInput.value.toLowerCase() : '';
  
  usuariosContainer.innerHTML = '';
  
  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(filtro) ||
    usuario.email.toLowerCase().includes(filtro) ||
    usuario.rol.toLowerCase().includes(filtro)
  );
  
  if (usuariosFiltrados.length === 0) {
    usuariosContainer.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No se encontraron usuarios</p>';
    return;
  }
  
  usuariosFiltrados.forEach(usuario => {
    const card = document.createElement('div');
    card.className = 'usuario-card';
    card.innerHTML = `
      <div class="usuario-header">
        <div class="usuario-info">
          <h3><i class="fas fa-user"></i> ${usuario.nombre}</h3>
          <span class="usuario-email">${usuario.email}</span>
        </div>
        <span class="usuario-rol rol-${usuario.rol}">${getRolLabel(usuario.rol)}</span>
      </div>
      <div class="usuario-detalles">
        <p><strong><i class="fas fa-calendar-plus"></i> Registro:</strong> ${usuario.fechaRegistro}</p>
        <p><strong><i class="fas fa-clock"></i> Último acceso:</strong> ${usuario.ultimoAcceso}</p>
      </div>
      <div class="usuario-acciones">
        <button class="btn-modificar-usuario" onclick="mostrarModalModificarUsuario(${usuario.id})">
          <i class="fas fa-edit"></i> Modificar
        </button>
        <button class="btn-eliminar-usuario" onclick="confirmarEliminarUsuario(${usuario.id})">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `;
    usuariosContainer.appendChild(card);
  });
}

function getRolLabel(rol) {
  const roles = {
    'user': 'Usuario',
    'moderator': 'Moderador',
    'admin': 'Administrador'
  };
  return roles[rol] || rol;
}

// Función global para mostrar modal de modificar usuario
window.mostrarModalModificarUsuario = function(usuarioId) {
  const usuario = usuarios.find(u => u.id === usuarioId);
  if (!usuario) return;
  
  document.getElementById('modalModificarUsuario').style.display = 'block';
  document.getElementById('modificarUsuarioNombre').textContent = usuario.nombre;
  document.getElementById('modificarUsuarioEmail').textContent = usuario.email;
  document.getElementById('nuevoRolUsuario').value = usuario.rol;
  
  document.getElementById('btnConfirmarModificacion').onclick = () => modificarUsuario(usuarioId);
  document.getElementById('btnCancelarModificacion').onclick = () => {
    document.getElementById('modalModificarUsuario').style.display = 'none';
  };
};

function modificarUsuario(usuarioId) {
  const usuario = usuarios.find(u => u.id === usuarioId);
  const nuevoRol = document.getElementById('nuevoRolUsuario').value;
  
  if (usuario) {
    const rolAnterior = getRolLabel(usuario.rol);
    usuario.rol = nuevoRol;
    const rolNuevo = getRolLabel(nuevoRol);
    
    alert(`Usuario ${usuario.nombre} modificado exitosamente.\nRol anterior: ${rolAnterior}\nRol nuevo: ${rolNuevo}`);
    
    document.getElementById('modalModificarUsuario').style.display = 'none';
    renderGestionUsuarios();
  }
}

// Función global para confirmar eliminación de usuario
window.confirmarEliminarUsuario = function(usuarioId) {
  const usuario = usuarios.find(u => u.id === usuarioId);
  if (!usuario) return;
  
  document.getElementById('modalEliminarUsuario').style.display = 'block';
  document.getElementById('eliminarUsuarioNombre').textContent = usuario.nombre;
  document.getElementById('eliminarUsuarioEmail').textContent = usuario.email;
  
  document.getElementById('btnConfirmarEliminacion').onclick = () => eliminarUsuario(usuarioId);
  document.getElementById('btnCancelarEliminacion').onclick = () => {
    document.getElementById('modalEliminarUsuario').style.display = 'none';
  };
};

function eliminarUsuario(usuarioId) {
  const usuario = usuarios.find(u => u.id === usuarioId);
  
  if (usuario) {
    usuarios = usuarios.filter(u => u.id !== usuarioId);
    alert(`Usuario ${usuario.nombre} eliminado exitosamente.\nToda su información asociada ha sido removida del sistema.`);
    
    document.getElementById('modalEliminarUsuario').style.display = 'none';
    renderGestionUsuarios();
  }
}

// Event listener para búsqueda de usuarios
document.addEventListener('DOMContentLoaded', () => {
  // ...existing code...
  
  // Agregar event listener para búsqueda después de que se cargue el DOM
  setTimeout(() => {
    const busquedaUsuarios = document.getElementById('busquedaUsuarios');
    if (busquedaUsuarios) {
      busquedaUsuarios.addEventListener('input', () => {
        renderGestionUsuarios();
      });
    }
  }, 100);
});


  let solicitudesModerador = [
  {
    id: 201,
    nombre: 'Ana María Jiménez',
    email: 'ana.jimenez@email.com',
    telefono: '8765-4321',
    cedula: '1-1234-5678',
    motivo: 'Tengo experiencia organizando eventos deportivos en mi comunidad y me gustaría ayudar a moderar las actividades para asegurar que sean seguras y divertidas para todos.',
    fechaSolicitud: '2025-06-10',
    estado: 'pendiente'
  },
  {
    id: 202,
    nombre: 'Carlos Eduardo Ramírez',
    email: 'carlos.ramirez@email.com',
    telefono: '+506 8888-9999',
    cedula: '2-2345-6789',
    motivo: 'Soy entrenador personal certificado y quiero contribuir revisando actividades físicas para garantizar que cumplan con estándares de seguridad.',
    fechaSolicitud: '2025-06-11',
    estado: 'pendiente'
  },
  {
    id: 203,
    nombre: 'María Fernanda González',
    email: 'mf.gonzalez@email.com',
    telefono: '8555-1234',
    cedula: '1-3456-7890',
    motivo: 'Como fisioterapeuta, puedo aportar conocimiento sobre prevención de lesiones y evaluar la seguridad de las actividades propuestas.',
    fechaSolicitud: '2025-06-12',
    estado: 'pendiente'
  }
];

// ...existing code...

// Agregar estas funciones para manejar solicitudes de moderador:
function renderSolicitudesModerador() {
  const solicitudesContainer = document.getElementById('solicitudesModerador');
  if (!solicitudesContainer) return;
  
  solicitudesContainer.innerHTML = '';
  
  const pendientes = solicitudesModerador.filter(s => s.estado === 'pendiente');
  
  if (pendientes.length === 0) {
    solicitudesContainer.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No hay solicitudes pendientes de moderador</p>';
    return;
  }
  
  pendientes.forEach(solicitud => {
    const card = document.createElement('div');
    card.className = 'solicitud-moderador-card';
    card.innerHTML = `
      <div class="solicitud-header">
        <h3><i class="fas fa-user"></i> ${solicitud.nombre}</h3>
        <span class="fecha-solicitud">Solicitado: ${solicitud.fechaSolicitud}</span>
      </div>
      <div class="solicitud-info">
        <p><strong><i class="fas fa-envelope"></i> Email:</strong> ${solicitud.email}</p>
        <p><strong><i class="fas fa-phone"></i> Teléfono:</strong> ${solicitud.telefono}</p>
        <p><strong><i class="fas fa-id-card"></i> Cédula:</strong> ${solicitud.cedula}</p>
        <p><strong><i class="fas fa-comment"></i> Motivo:</strong> ${solicitud.motivo.substring(0, 120)}${solicitud.motivo.length > 120 ? '...' : ''}</p>
      </div>
      <div class="solicitud-acciones">
        <button class="btn-revisar-solicitud" onclick="mostrarDetalleSolicitud(${solicitud.id})">
          <i class="fas fa-eye"></i> Revisar
        </button>
      </div>
    `;
    solicitudesContainer.appendChild(card);
  });
}

// Función global para mostrar detalle de solicitud
window.mostrarDetalleSolicitud = function(solicitudId) {
  const solicitud = solicitudesModerador.find(s => s.id === solicitudId);
  if (!solicitud) return;
  
  hideAllViews();
  document.getElementById('detalleSolicitudContainer').style.display = 'block';
  
  document.getElementById('solNombre').textContent = solicitud.nombre;
  document.getElementById('solEmail').textContent = solicitud.email;
  document.getElementById('solTelefono').textContent = solicitud.telefono;
  document.getElementById('solCedula').textContent = solicitud.cedula;
  document.getElementById('solFecha').textContent = solicitud.fechaSolicitud;
  document.getElementById('solMotivo').textContent = solicitud.motivo;
  
  // Configurar botones
  document.getElementById('btnAceptarSolicitud').onclick = () => aceptarSolicitudModerador(solicitudId);
  document.getElementById('btnRechazarSolicitud').onclick = () => mostrarFormularioRechazoSolicitud(solicitudId);
  document.getElementById('btnVolverSolicitudes').onclick = () => {
    hideAllViews();
    document.getElementById('revisarSolicitudesContainer').style.display = 'block';
    renderSolicitudesModerador();
  };
};

function aceptarSolicitudModerador(solicitudId) {
  const solicitud = solicitudesModerador.find(s => s.id === solicitudId);
  if (solicitud) {
    solicitud.estado = 'aprobada';
    alert(`Solicitud de ${solicitud.nombre} aprobada. El usuario ahora es moderador.`);
    hideAllViews();
    document.getElementById('revisarSolicitudesContainer').style.display = 'block';
    renderSolicitudesModerador();
  }
}

function mostrarFormularioRechazoSolicitud(solicitudId) {
  document.getElementById('formularioRechazoSolicitud').style.display = 'block';
  document.getElementById('motivoRechazoSolicitud').value = '';
  
  document.getElementById('btnEnviarRechazoSolicitud').onclick = () => {
    const motivo = document.getElementById('motivoRechazoSolicitud').value.trim();
    if (motivo.length < 10) {
      alert('Por favor proporciona un motivo detallado (mínimo 10 caracteres).');
      return;
    }
    rechazarSolicitudModerador(solicitudId, motivo);
  };
  
  document.getElementById('btnCancelarRechazoSolicitud').onclick = () => {
    document.getElementById('formularioRechazoSolicitud').style.display = 'none';
  };
}

function rechazarSolicitudModerador(solicitudId, motivo) {
  const solicitud = solicitudesModerador.find(s => s.id === solicitudId);
  if (solicitud) {
    solicitud.estado = 'rechazada';
    alert(`Solicitud de ${solicitud.nombre} rechazada. Motivo: "${motivo}"`);
    document.getElementById('formularioRechazoSolicitud').style.display = 'none';
    hideAllViews();
    document.getElementById('revisarSolicitudesContainer').style.display = 'block';
    renderSolicitudesModerador();
  }
}

  let actividadesPendientesMod = [
  {
    id: 101,
    titulo: 'Maratón Nocturno',
    descripcion: 'Carrera nocturna por las calles del centro de la ciudad con iluminación especial.',
    limite: 50,
    ubicacion: { lat: 9.9281, lng: -83.9132 },
    solicitante: 'María González',
    fechaSolicitud: '2025-06-10'
  },
  {
    id: 102,
    titulo: 'Torneo de Volleyball Playero',
    descripcion: 'Competencia de volleyball en la playa con equipos de toda la provincia.',
    limite: 32,
    ubicacion: { lat: 9.7489, lng: -83.7534 },
    solicitante: 'Carlos Ramírez',
    fechaSolicitud: '2025-06-11'
  },
  {
    id: 103,
    titulo: 'Clase de Aqua Aeróbicos',
    descripcion: 'Sesión de ejercicios acuáticos para todas las edades en piscina olímpica.',
    limite: 25,
    ubicacion: { lat: 9.8500, lng: -83.8000 },
    solicitante: 'Ana Jiménez',
    fechaSolicitud: '2025-06-12'
  }
];


// Agregar estas funciones antes del cierre del DOMContentLoaded:
function renderActividadesPendientes() {
  const actividadesPendientes = document.getElementById('actividadesPendientes');
  if (!actividadesPendientes) return;
  
  actividadesPendientes.innerHTML = '';
  
  if (actividadesPendientesMod.length === 0) {
    actividadesPendientes.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No hay actividades pendientes de moderación</p>';
    return;
  }
  
  actividadesPendientesMod.forEach(actividad => {
    const card = document.createElement('div');
    card.className = 'actividad-pendiente-card';
    card.innerHTML = `
      <div class="actividad-header">
        <h3>${actividad.titulo}</h3>
        <span class="fecha-solicitud">Solicitado: ${actividad.fechaSolicitud}</span>
      </div>
      <div class="actividad-info">
        <p><strong>Solicitante:</strong> ${actividad.solicitante}</p>
        <p><strong>Límite:</strong> ${actividad.limite} participantes</p>
        <p><strong>Descripción:</strong> ${actividad.descripcion.substring(0, 100)}${actividad.descripcion.length > 100 ? '...' : ''}</p>
      </div>
      <div class="actividad-acciones">
        <button class="btn-revisar" onclick="mostrarDetalleModeracion(${actividad.id})">
          <i class="fas fa-eye"></i> Revisar
        </button>
      </div>
    `;
    actividadesPendientes.appendChild(card);
  });
}

// Hacer las funciones globales para que funcionen con onclick
window.mostrarDetalleModeracion = function(actividadId) {
  const actividad = actividadesPendientesMod.find(act => act.id === actividadId);
  if (!actividad) return;
  
  hideAllViews();
  document.getElementById('detalleModeracionContainer').style.display = 'block';
  
  document.getElementById('modTitulo').textContent = actividad.titulo;
  document.getElementById('modDescripcion').textContent = actividad.descripcion;
  document.getElementById('modSolicitante').textContent = actividad.solicitante;
  document.getElementById('modLimite').textContent = actividad.limite;
  document.getElementById('modFecha').textContent = actividad.fechaSolicitud;
  
  // Inicializar mapa de moderación
  if (window.moderacionMap) {
    window.moderacionMap.remove();
  }
  window.moderacionMap = L.map('moderacionMapa').setView([actividad.ubicacion.lat, actividad.ubicacion.lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(window.moderacionMap);
  L.marker([actividad.ubicacion.lat, actividad.ubicacion.lng]).addTo(window.moderacionMap);
  
  // Configurar botones
  document.getElementById('btnAceptarActividad').onclick = () => aceptarActividad(actividadId);
  document.getElementById('btnRechazarActividad').onclick = () => mostrarFormularioRechazo(actividadId);
  document.getElementById('btnVolverModeracion').onclick = () => {
    hideAllViews();
    document.getElementById('moderarActividadesContainer').style.display = 'block';
    renderActividadesPendientes();
  };
};

function aceptarActividad(actividadId) {
  const actividad = actividadesPendientesMod.find(act => act.id === actividadId);
  if (actividad) {
    // Agregar a la lista de actividades aprobadas
    actividades.push({
      id: actividad.id,
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      limite: actividad.limite,
      ubicacion: actividad.ubicacion
    });
    inscritosPorActividad.set(actividad.id, 0);
    
    // Remover de pendientes
    actividadesPendientesMod = actividadesPendientesMod.filter(act => act.id !== actividadId);
    
    alert('Actividad aprobada exitosamente.');
    hideAllViews();
    document.getElementById('moderarActividadesContainer').style.display = 'block';
    renderActividadesPendientes();
  }
}



function mostrarFormularioRechazo(actividadId) {
  document.getElementById('formularioRechazo').style.display = 'block';
  document.getElementById('motivoRechazo').value = '';
  
  document.getElementById('btnEnviarRechazo').onclick = () => {
    const motivo = document.getElementById('motivoRechazo').value.trim();
    if (motivo.length < 10) {
      alert('Por favor proporciona un motivo detallado (mínimo 10 caracteres).');
      return;
    }
    rechazarActividad(actividadId, motivo);
  };
  
  document.getElementById('btnCancelarRechazo').onclick = () => {
    document.getElementById('formularioRechazo').style.display = 'none';
  };
}

function rechazarActividad(actividadId, motivo) {
  // Remover de pendientes
  actividadesPendientesMod = actividadesPendientesMod.filter(act => act.id !== actividadId);
  
  alert(`Actividad rechazada. Motivo enviado al solicitante: "${motivo}"`);
  document.getElementById('formularioRechazo').style.display = 'none';
  hideAllViews();
  document.getElementById('moderarActividadesContainer').style.display = 'block';
  renderActividadesPendientes();
}

 function construirMenuLateral() {
  const sidebar = document.getElementById('sidebar');
  const role = localStorage.getItem('userRole');

  let menuHTML = `
    <a href="#" id="btnInicio"><i class="fas fa-home"></i> Inicio</a>
  `;

  if (role === 'user' || role === 'moderator') {
    menuHTML +=  `
    <a href="#" id="btnCalendario"><i class="fas fa-calendar-alt"></i> Mi calendario</a>
    <a href="#" id="btnListaActividades"><i class="fas fa-tasks"></i> Lista de actividades</a>
    `;
  }

  if (role === 'user') {
    menuHTML += `<a href="#" id="btnSolicitudModerador"><i class="fas fa-user-plus"></i> Solicitar ser moderador</a>`;
  }

  if (role === 'moderator') {
    menuHTML += `<a href="#" id="btnModerarActividades"><i class="fas fa-user-check"></i> Moderar actividades</a>`;
  }

  if (role === 'admin') {
    menuHTML += `
      <a href="#" id="btnGestionUsuarios"><i class="fas fa-user-shield"></i> Gestión de usuarios</a>
      <a href="#" id="btnListaActividadesAdmin"><i class="fas fa-tasks"></i> Lista de actividades</a>
      <a href="#" id= "btnRevisarSolicitudesModerador"><i class="fas fa-user-check"></i> Solicitudes Moderador</a>
    `;
  }

  sidebar.innerHTML = menuHTML;

  // Reasignar eventos a los botones si es necesario
  document.getElementById('btnInicio')?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    document.getElementById('dashboardView').style.display = 'block';
    document.getElementById('sidebar').classList.remove('show');
    initCarousel();
  });

  document.getElementById('btnCalendario')?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    document.getElementById('calendarContainer').style.display = 'block';
    renderCalendarioActividades();
    document.getElementById('sidebar').classList.remove('show');
});

  document.getElementById('btnListaActividades')?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    document.getElementById('listaActividadesContainer').style.display = 'block';
    renderUserListaActividades();
    document.getElementById('sidebar').classList.remove('show');
  });

  // Agregar evento para moderadores
  document.getElementById('btnModerarActividades')?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews(); 
    document.getElementById('moderarActividadesContainer').style.display = 'block';
    renderActividadesPendientes();
    document.getElementById('sidebar').classList.remove('show');
  });


  // Agregar evento para gestión de usuarios (solo admin)
  document.getElementById('btnGestionUsuarios')?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    document.getElementById('gestionUsuariosContainer').style.display = 'block';
    renderGestionUsuarios();
    document.getElementById('sidebar').classList.remove('show');
  });

  // Agregar evento para revisar solicitudes de moderador (solo admin)
  document.getElementById('btnRevisarSolicitudesModerador')?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    document.getElementById('revisarSolicitudesContainer').style.display = 'block';
    renderSolicitudesModerador();
    document.getElementById('sidebar').classList.remove('show');
    
  });

  document.getElementById('btnListaActividadesAdmin')?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    document.getElementById('gestionActividadesAdminContainer').style.display = 'block';
    renderGestionActividadesAdmin();
    document.getElementById('sidebar').classList.remove('show');
});
  
}


  let map;
  let marker;
  function initMap() {
    map = L.map('map').setView([9.7489, -83.7534], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', function(e) {
      if (marker) map.removeLayer(marker);
      marker = L.marker(e.latlng).addTo(map);
    });
  }


  btnGenerarActividad?.addEventListener('click', () => {
    hideAllViews();
    crearActividadContainer.style.display = 'block';
    initMap();
  });




  formActividad?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!marker) {
      alert('Por favor selecciona una ubicación en el mapa antes de guardar la actividad.');
      return;
    }

    const nuevaActividad = {
      id: Date.now(),
      titulo: document.getElementById('tituloActividad').value,
      descripcion: document.getElementById('descripcionActividad').value,
      limite: parseInt(document.getElementById('limiteParticipantes').value),
      ubicacion: marker ? marker.getLatLng() : null
    };
    actividades.push(nuevaActividad);
    inscritosPorActividad.set(nuevaActividad.id, 0);
    alert('Actividad guardada con éxito.');
    formActividad.reset();
    crearActividadContainer.style.display = 'none';
    document.getElementById('dashboardView').style.display = 'block';
  });

  filtroBusqueda?.addEventListener('input', () => {
    renderListaActividades();
  });


  function mostrarDetalleActividad(actividadId) {
  const act = window.actividades.find(a => a.id === actividadId);
  if (!act) return;

  hideAllViews();
  const detalleContainer = document.getElementById('actividadDetalleContainer');
  detalleContainer.style.display = 'block';

  // Verificar si el usuario está inscrito y obtener el número de inscritos
  const estaInscrito = actividadesInscritas.some(a => a.id === actividadId);
  const inscritosActuales = inscritosPorActividad.get(act.id) || 0;

  const contenedorAcciones = document.querySelector('.detalle-acciones');
  contenedorAcciones.innerHTML = '';

  // Actualizar la información
  document.getElementById('detalleTitulo').textContent = act.titulo;
  document.getElementById('detalleFecha').textContent = act.fecha || 'No especificada';
  document.getElementById('detalleHora').textContent = act.hora || 'No especificada';
  document.getElementById('detalleUbicacion').textContent = 
    act.ubicacion ? `${act.ubicacion.lat.toFixed(4)}, ${act.ubicacion.lng.toFixed(4)}` : 'No especificada';
  document.getElementById('detalleCupo').textContent = 
    `${inscritosActuales}/${act.limite} inscritos`;
  document.getElementById('detalleDescripcion').textContent = act.descripcion;

  // Configurar el mapa
  if (act.ubicacion && act.ubicacion.lat && act.ubicacion.lng) {
    if (window.detalleMap) {
      window.detalleMap.remove();
    }
    window.detalleMap = L.map('detalleMapa').setView([act.ubicacion.lat, act.ubicacion.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(window.detalleMap);
    L.marker([act.ubicacion.lat, act.ubicacion.lng]).addTo(window.detalleMap);
  }

  // Añadir botón de acción principal (inscribirse/desinscribirse)
  if (estaInscrito) {
    const btnDesinscribirse = document.createElement('button');
    btnDesinscribirse.className = 'btn-accion-principal btn-desinscribirse';
    btnDesinscribirse.innerHTML = '<i class="fas fa-user-minus"></i> Desinscribirme';
    btnDesinscribirse.onclick = () => mostrarModalDesinscripcion(act.id);
    contenedorAcciones.appendChild(btnDesinscribirse);
  } else if (inscritosActuales >= act.limite) {
    const btnLleno = document.createElement('button');
    btnLleno.className = 'btn-accion-principal';
    btnLleno.disabled = true;
    btnLleno.innerHTML = '<i class="fas fa-users-slash"></i> Cupo lleno';
    contenedorAcciones.appendChild(btnLleno);
  } else {
    const btnInscribirse = document.createElement('button');
    btnInscribirse.className = 'btn-accion-principal';
    btnInscribirse.innerHTML = '<i class="fas fa-user-plus"></i> Inscribirse';
    btnInscribirse.onclick = () => inscribirseEnActividad(act.id);
    contenedorAcciones.appendChild(btnInscribirse);
  }
}

function inscribirseEnActividad(actividadId) {
  const actividad = window.actividades.find(act => act.id === actividadId);
  if (!actividad) return;

  const inscritosActuales = inscritosPorActividad.get(actividadId) || 0;
  
  if (inscritosActuales >= actividad.limite) {
    alert('Lo sentimos, esta actividad ya está llena.');
    return;
  }

  // Incrementar el contador de inscritos
  inscritosPorActividad.set(actividadId, inscritosActuales + 1);
  
  // Agregar a actividades inscritas
  actividadesInscritas.push({
    id: actividadId,
    titulo: actividad.titulo,
    fecha: actividad.fecha,
    hora: actividad.hora,
    ubicacion: actividad.ubicacion ? `${actividad.ubicacion.lat.toFixed(4)}, ${actividad.ubicacion.lng.toFixed(4)}` : 'No especificada',
    estado: 'confirmado'
  });

  // Mostrar mensaje de éxito
  const toast = document.createElement('div');
  toast.className = 'toast-success';
  toast.innerHTML = `
    <i class="fas fa-check-circle"></i>
    Te has inscrito exitosamente en "${actividad.titulo}"
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);

  // Actualizar la vista de detalle
  mostrarDetalleActividad(actividadId);
}

window.volverALista = function() {
  hideAllViews();
  document.getElementById('listaActividadesContainer').style.display = 'block';
  renderUserListaActividades();
};

// Actualizar la función de confirmarDesinscripcion
window.confirmarDesinscripcion = function(actividadId) {
  const actividad = actividadesInscritas.find(act => act.id === actividadId);
  if (!actividad) return;
  
  if (confirm(`¿Estás seguro que deseas desinscribirte de "${actividad.titulo}"?`)) {
    // Remover de actividades inscritas
    actividadesInscritas = actividadesInscritas.filter(act => act.id !== actividadId);
    
    // Decrementar contador de inscritos
    if (inscritosPorActividad.has(actividadId)) {
      const inscritosActuales = inscritosPorActividad.get(actividadId);
      inscritosPorActividad.set(actividadId, Math.max(0, inscritosActuales - 1));
    }
    
    // Mostrar mensaje de éxito con toast
    const toast = document.createElement('div');
    toast.className = 'toast-success';
    toast.innerHTML = `
      <i class="fas fa-check-circle"></i>
      Te has desinscrito exitosamente de "${actividad.titulo}"
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);

    // Actualizar la vista de detalle
    mostrarDetalleActividad(actividadId);
  }
};



  // ───────── Función para ocultar todas las vistas (elementos con la clase "view") ─────────
  function hideAllViews() {
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
      view.style.display = 'none';
    });
  }

  // ───────── Función para inicializar/reinicializar el carrusel ─────────
  function initCarousel() {
  const wrapper = document.getElementById('carouselWrapper');
  const slides = Array.from(wrapper.children);
  const dots = document.querySelectorAll('.carousel-dot');
  let currentIndex = 1;

  function renderSlides() {
    wrapper.innerHTML = '';
    slides.forEach(slide => slide.classList.remove('center'));

    // Ordenamos: slide anterior, actual y siguiente
    const ordered = [
      slides[(currentIndex - 1 + slides.length) % slides.length],
      slides[currentIndex],
      slides[(currentIndex + 1) % slides.length]
    ];

    ordered.forEach((slide, idx) => {
      wrapper.appendChild(slide);
      requestAnimationFrame(() => {
        slide.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        if (idx === 1) {
          slide.style.opacity = '1';
          slide.style.transform = 'scale(1)';
          slide.classList.add('center');
        } else {
          slide.style.opacity = '0.4';
          slide.style.transform = 'scale(0.9)';
        }
      });

      // Verificar si este slide es el del calendario (usando el alt de la imagen)
      const img = slide.querySelector("img");
      if (img && img.alt.trim().toLowerCase().includes("calendario")) {
        // Asignar el listener de doble clic (solo una vez) para mostrar el calendario del carrusel
        if (!img.dataset.dblclickBound) {
          img.addEventListener("dblclick", function (e) {
            e.stopPropagation();
            renderCarouselCalendar();
          });
          img.dataset.dblclickBound = "true";
        }
      }

      if (img && img.alt.trim().toLowerCase().includes("principal")) {
        if (!img.dataset.clickBound) {
          img.addEventListener("dblclick", function(e) {
            e.stopPropagation();
            mostrarActividadDestacada();
          });
          img.dataset.clickBound = "true";
        }
      }
      if (img && img.alt.trim().toLowerCase().includes('redes')) {
        if (!img.dataset.clickBound) {
          img.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            mostrarRedesSociales();
          });
          img.dataset.clickBound = 'true';
        }
    }

      
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
      dot.addEventListener('click', () => {
        currentIndex = index;
        renderSlides();
      });
    });
  }

  // Flechas de navegación del carrusel
  document.querySelector('.arrow.arrow-left')?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    renderSlides();
  });
  document.querySelector('.arrow.arrow-right')?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    renderSlides();
  });

  renderSlides();
}

  // ───────── Toggle del Sidebar ─────────
  const menuToggle = document.getElementById('menuToggle');
  menuToggle.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('show');
  });

  // ───────── Menú de Usuario ─────────
  const userIcon = document.getElementById('userIcon');
  const userMenu = document.getElementById('userMenu');
  userIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu.style.display = (userMenu.style.display === 'block') ? 'none' : 'block';
  });
  document.addEventListener('click', () => {
    userMenu.style.display = 'none';
  });

  // ───────── Lógica de Cerrar Sesión ─────────
  const logoutLink = document.getElementById('logoutLink');
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Has cerrado sesión.');
    window.location.href = 'index.html';
  });

  const btnSolicitudModerador = document.getElementById('btnSolicitudModerador');
  const solicitudContainer = document.getElementById('solicitudModeradorContainer');
  const formSolicitud = document.getElementById('formSolicitudModerador');
  const errorSolicitud = document.getElementById('errorSolicitud');

  btnSolicitudModerador?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    solicitudContainer.style.display = 'block';
  });

  formSolicitud?.addEventListener('submit', (e) => {
  e.preventDefault();
  const telefono = document.getElementById('telefono').value.trim();
  const cedula = document.getElementById('cedula').value.trim();
  const motivo = document.getElementById('motivo').value.trim();

  const telRegex = /^(\+506)?[ ]?(\d{4}-\d{4}|\d{8})$/;
  const cedulaRegex = /^\d{1,2}-\d{4}-\d{4}$/;

  if (!telRegex.test(telefono)) {
    errorSolicitud.textContent = "Formato de teléfono inválido. Ej: 8888-8888 o +506 8888-8888";
    errorSolicitud.style.display = "block";
    return;
  }

  if (!cedulaRegex.test(cedula)) {
    errorSolicitud.textContent = "Formato de cédula inválido. Ej: 1-0345-0789";
    errorSolicitud.style.display = "block";
    return;
  }

  if (motivo.length < 10) {
    errorSolicitud.textContent = "Por favor detalla tu motivo (mínimo 10 caracteres).";
    errorSolicitud.style.display = "block";
    return;
  }

  errorSolicitud.style.display = "none";
  alert("Tu solicitud ha sido enviada correctamente.");
  formSolicitudModerador.reset();
  document.getElementById('dashboardView').style.display = 'block';
  document.getElementById('solicitudModeradorContainer').style.display = 'none';
});



  // ───────── Funciones para la Vista de Perfil ─────────
  const viewProfileLink = document.getElementById('viewProfile');
  const dashboardView = document.getElementById('dashboardView');
  const profileContainer = document.getElementById('profileContainer');
  const backToDashBtn = document.getElementById('backToDash');
  const btnCambiarPass = document.getElementById('btnCambiarPass');
  const btnGuardarCambios = document.getElementById('btnGuardarCambios');
  const mensajeGuardado = document.getElementById('mensajeGuardado');

  viewProfileLink.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    profileContainer.style.display = 'block';
  });

  btnCambiarPass?.addEventListener('click', () => {
    window.location.href = 'recuperar-pass.html';
  });

  btnGuardarCambios?.addEventListener('click', () => {
    mensajeGuardado.style.display = 'block';
    setTimeout(() => {
      mensajeGuardado.style.display = 'none';
    }, 3000);
  });

  let carouselCurrentDate = new Date();

function renderCarouselMonthlyCalendar(date) {
  const calendarGrid = document.querySelector('#carouselCalendarContainer .carousel-calendar-grid');
  if (!calendarGrid) {
    console.error("No se encontró '.carousel-calendar-grid' en #carouselCalendarContainer");
    return;
  }
  calendarGrid.innerHTML = '';

  const monthYearLabel = document.getElementById('carouselCalendarMonthYear');
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  monthYearLabel.textContent = monthNames[date.getMonth()] + ' ' + date.getFullYear();

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const startingDay = firstDay.getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  for (let i = 0; i < startingDay; i++) {
    const blankCell = document.createElement('div');
    blankCell.classList.add('day');
    calendarGrid.appendChild(blankCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');

    const dayNumber = document.createElement('div');
    dayNumber.classList.add('day-number');
    dayNumber.textContent = day;
    dayCell.appendChild(dayNumber);

    const dayStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Filtra las actividades para este día usando window.actividades (asegúrate de que esté definido globalmente)
    const eventsForDay = window.actividades.filter(activity => activity.fecha === dayStr);
    // Dentro del bucle que crea las celdas para cada día…
    if (eventsForDay.length > 0) {
      const indicator = document.createElement('div');
      indicator.classList.add('event-indicator');
      dayCell.appendChild(indicator);
    }

    
    // Listener para mostrar el modal de actividades si se hace click (opcional)
    dayCell.addEventListener('click', () => {
      showActivitiesForDay(dayStr, eventsForDay);
    });

    calendarGrid.appendChild(dayCell);
  }
}

function obtenerActividadDestacada() {
  if (!window.actividades || window.actividades.length === 0) {
    return null;
  }

  const ahora = new Date();
  const actividadesFuturas = window.actividades
    .filter(act => new Date(act.fecha) >= ahora)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return actividadesFuturas[0] || window.actividades[0];
}

// Función para mostrar la actividad destacada
function mostrarActividadDestacada() {
  const actividadDestacada = obtenerActividadDestacada();
  if (actividadDestacada) {
    mostrarDetalleActividad(actividadDestacada.id);
  } else {
    alert('No hay actividades disponibles para mostrar.');
  }
}


function showActivitiesForDay(dayStr, events) {
  // Cerrar modal existente si lo hay
  const existingModal = document.querySelector('.day-activities-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Crear el contenedor modal
  const modal = document.createElement('div');
  modal.classList.add('day-activities-modal');
  modal.innerHTML = `
    <div class="day-activities-content">
      <span class="close-button">&times;</span>
      <h2>Actividades para ${dayStr}</h2>
      <div class="activities-list"></div>
    </div>
  `;
  
  const listDiv = modal.querySelector('.activities-list');
  if (events.length === 0) {
    listDiv.innerHTML = "<p>No hay actividades para este día.</p>";
  } else {
    events.forEach(activity => {
      const evDiv = document.createElement('div');
      evDiv.classList.add('activity-item');
      evDiv.innerHTML = `
        <h3>${activity.titulo}</h3>
        <p><i class="fas fa-clock"></i> ${activity.hora}</p>
        <button class="btn-ver-detalle-calendario">
          <i class="fas fa-eye"></i> Ver Detalle
        </button>
      `;

      // Agregar evento click al botón de ver detalle
      evDiv.querySelector('.btn-ver-detalle-calendario').addEventListener('click', () => {
        modal.remove(); // Cerrar el modal de actividades
        mostrarDetalleActividad(activity.id); // Mostrar el detalle de la actividad
      });

      listDiv.appendChild(evDiv);
    });
  }
  
  // Cerrar el modal al pulsar en la "X"
  modal.querySelector(".close-button").addEventListener("click", () => {
    modal.remove();
  });
  
  document.body.appendChild(modal);
}

function renderCarouselCalendar() {
  hideAllViews();
  const container = document.getElementById('carouselCalendarContainer');
  container.style.display = 'block';
  renderCarouselMonthlyCalendar(carouselCurrentDate);
}

function mostrarModalDesinscripcion(actividadId) {
  const actividad = actividades.find(act => act.id === actividadId);
  if (!actividad) return;
  
  const modal = document.getElementById('modalDesinscripcion');
  
  // Actualizar la información en el modal
  document.getElementById('desinscripcionActividadTitulo').textContent = actividad.titulo;
  document.getElementById('desinscripcionActividadFecha').textContent = actividad.fecha || 'No especificada';
  document.getElementById('desinscripcionActividadHora').textContent = actividad.hora || 'No especificada';
  document.getElementById('desinscripcionActividadUbicacion').textContent = 
    actividad.ubicacion ? `${actividad.ubicacion.lat.toFixed(4)}, ${actividad.ubicacion.lng.toFixed(4)}` : 'No especificada';

  // Mostrar el modal
  modal.style.display = 'flex';

  // Configurar botones
  document.getElementById('btnConfirmarDesinscripcion').onclick = () => {
    procesarDesinscripcion(actividadId);
    modal.style.display = 'none';
  };

  document.getElementById('btnCancelarDesinscripcion').onclick = () => {
    modal.style.display = 'none';
  };
}

// Función para procesar la desinscripción
function procesarDesinscripcion(actividadId) {
  const actividad = window.actividades.find(act => act.id === actividadId);
  if (!actividad) return;

  // Remover de actividades inscritas
  actividadesInscritas = actividadesInscritas.filter(act => act.id !== actividadId);
  
  // Decrementar contador de inscritos
  if (inscritosPorActividad.has(actividadId)) {
    const inscritosActuales = inscritosPorActividad.get(actividadId);
    inscritosPorActividad.set(actividadId, Math.max(0, inscritosActuales - 1));
  }

  // Mostrar mensaje de éxito con toast
  const toast = document.createElement('div');
  toast.className = 'toast-success';
  toast.innerHTML = `
    <i class="fas fa-check-circle"></i>
    Te has desinscrito exitosamente de "${actividad.titulo}"
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);

  // Actualizar la vista de detalle inmediatamente
  mostrarDetalleActividad(actividadId);
}

const comunidades = [
  {
    nombre: "Club Deportivo Limón",
    tipo: "Club Multideportivo",
    logo: "imagenes/club-limon.jpg",
    descripcion: "Principal club deportivo de la zona, organizando eventos y actividades para toda la comunidad.",
    redes: {
      facebook: "https://facebook.com/clublimon",
      instagram: "https://instagram.com/clublimon",
      whatsapp: "https://wa.me/50688888888"
    }
  },
  {
    nombre: "Runners Caribe",
    tipo: "Comunidad de Corredores",
    logo: "imagenes/runners-caribe.jpg",
    descripcion: "Grupo de entusiastas del running que organizan carreras y entrenamientos semanales.",
    redes: {
      facebook: "https://facebook.com/runnerscaribe",
      instagram: "https://instagram.com/runnerscaribe",
      twitter: "https://twitter.com/runnerscaribe"
    }
  },
  {
    nombre: "Yoga en la Playa",
    tipo: "Comunidad de Yoga",
    logo: "imagenes/yoga-playa.jpg",
    descripcion: "Clases de yoga al aire libre y meditación frente al mar. \n \n",
    redes: {
      instagram: "https://instagram.com/yogaplaya",
      whatsapp: "https://wa.me/50699999999",
      youtube: "https://youtube.com/yogaplaya"
    }
  }
];

function mostrarRedesSociales() {
  hideAllViews();
  document.getElementById('redesSocialesContainer').style.display = 'block';
  renderizarComunidades();
}

function renderizarComunidades() {
  const grid = document.getElementById('comunidadesGrid');
  grid.innerHTML = '';

  comunidades.forEach(comunidad => {
    const card = document.createElement('div');
    card.className = 'comunidad-card';

    const redesSocialesHTML = Object.entries(comunidad.redes)
      .map(([red, url]) => {
        const etiquetas = {
          facebook: '    Síguenos en Facebook',
          instagram: '   Síguenos en Instagram',
          twitter: '     Síguenos en Twitter',
          youtube: '     Suscríbete en YouTube',
          whatsapp: '    Contáctanos por WhatsApp'
        };

        const iconos = {
          facebook: 'fa-brands fa-facebook',
          instagram: 'fa-brands fa-instagram',
          twitter: 'fa-brands fa-twitter',
          youtube: 'fa-brands fa-youtube',
          whatsapp: 'fa-brands fa-whatsapp'
        };

        return `
          <a href="${url}" target="_blank" class="red-social-link ${red}">
            <i class="${iconos[red]}"></i>
            ${etiquetas[red]}
          </a>
        `;
      }).join('');

    card.innerHTML = `
      <div class="comunidad-header">
        <div class="comunidad-info">
          <h3>${comunidad.nombre}</h3>
          <span class="comunidad-tipo">${comunidad.tipo}</span>
        </div>
      </div>
      <p class="comunidad-descripcion">${comunidad.descripcion}</p>
      <div class="redes-sociales-lista">
        ${redesSocialesHTML}
      </div>
    `;

    grid.appendChild(card);
  });
}

});
