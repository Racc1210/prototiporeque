document.addEventListener('DOMContentLoaded', () => {
  construirMenuLateral();
  initCarousel();
  
  let actividades = [
  {
    id: 1,
    titulo: 'Entrenamiento Matutino',
    descripcion: 'Sesión de ejercicio al aire libre en el parque central.',
    limite: 10,
    ubicacion: { lat: 9.998, lng: -83.753 }
  },
  {
    id: 2,
    titulo: 'Clase de Yoga',
    descripcion: 'Clase de yoga para mejorar la flexibilidad y la concentración.',
    limite: 15,
    ubicacion: { lat: 9.7489, lng: -83.7534 }
  },
  {
    id: 3,
    titulo: 'Competencia de Ciclismo',
    descripcion: 'Carrera de bicicletas para poner a prueba tu resistencia.',
    limite: 20,
    ubicacion: { lat: 9.900, lng: -84.000 }
  }
];
  let map, marker;
  let detalleMap, detalleMarker;
  let inscritosPorActividad = new Map();

  actividades.forEach((act) => {
  inscritosPorActividad.set(act.id, 0);
  });

  const btnGenerarActividad = document.getElementById('generateActivity');
  const crearActividadContainer = document.getElementById('crearActividadContainer');
  const formActividad = document.getElementById('formActividad');
  const listaActividadesContainer = document.getElementById('listaActividadesContainer');
  const listaActividades = document.getElementById('listaActividades');
  const filtroBusqueda = document.getElementById('filtroBusqueda');
  const btnListaActividades = document.getElementById('btnListaActividades');

  const contenedorDetalle = document.getElementById('actividadDetalleContainer');
  const tituloDetalle = document.getElementById('detalleTitulo');
  const descripcionDetalle = document.getElementById('detalleDescripcion');
  const inscritosDetalle = document.getElementById('detalleInscritos');
  const btnInscribirse = document.getElementById('btnInscribirse');
  const btnVolverLista = document.getElementById('btnVolverLista');



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
      <a href="#" id= "btnRevisarSolicitudesModerador"><i class="fas fa-cogs"></i> Configuración</a>
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
    document.getElementById('sidebar').classList.remove('show');
  });

  document.getElementById('btnListaActividades')?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    document.getElementById('listaActividadesContainer').style.display = 'block';
    renderListaActividades();
    document.getElementById('sidebar').classList.remove('show');
  });
}



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

  btnVolverLista?.addEventListener('click', () => {
    hideAllViews();
    listaActividadesContainer.style.display = 'block';
    renderListaActividades();
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

  function renderListaActividades() {
    const filtro = filtroBusqueda.value.toLowerCase();
    listaActividades.innerHTML = '';
    actividades.filter(act => act.titulo.toLowerCase().includes(filtro) || act.descripcion.toLowerCase().includes(filtro))
      .forEach(act => {
        const card = document.createElement('div');
        card.className = 'actividad-card';
        card.innerHTML = `
          <h3>${act.titulo}</h3>
          <p>${act.descripcion}</p>
          <p><strong>Límite:</strong> ${act.limite}</p>
          <p><strong>Ubicación:</strong> ${act.ubicacion ? `${act.ubicacion.lat.toFixed(4)}, ${act.ubicacion.lng.toFixed(4)}` : 'No definida'}</p>
        `;
        card.addEventListener('click', () => mostrarDetalleActividad(act));
        listaActividades.appendChild(card);
      });
  }

  function mostrarDetalleActividad(actividad) {
    if (!contenedorDetalle || !tituloDetalle || !descripcionDetalle || !inscritosDetalle || !btnInscribirse) return;

    hideAllViews();
    contenedorDetalle.style.display = 'block';
    tituloDetalle.textContent = actividad.titulo;
    descripcionDetalle.textContent = actividad.descripcion;
    inscritosDetalle.textContent = `${inscritosPorActividad.get(actividad.id)} de ${actividad.limite} personas inscritas`;

    if (detalleMap) detalleMap.remove();
    detalleMap = L.map('detalleMapa').setView([actividad.ubicacion.lat, actividad.ubicacion.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(detalleMap);
    detalleMarker = L.marker([actividad.ubicacion.lat, actividad.ubicacion.lng]).addTo(detalleMap);

    btnInscribirse.onclick = () => {
      let inscritos = inscritosPorActividad.get(actividad.id);
      if (inscritos < actividad.limite) {
        inscritosPorActividad.set(actividad.id, inscritos + 1);
        inscritosDetalle.textContent = `${inscritos + 1} de ${actividad.limite} personas inscritas`;
        alert('Te has inscrito exitosamente.');
      } else {
        alert('La actividad ya alcanzó el límite de participantes.');
      }
    };
  }

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

      const ordered = [
        slides[(currentIndex - 1 + slides.length) % slides.length],
        slides[currentIndex],
        slides[(currentIndex + 1) % slides.length]
      ];

      ordered.forEach(slide => {
        wrapper.appendChild(slide);
      });

      requestAnimationFrame(() => {
        ordered.forEach((slide, i) => {
          slide.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
          slide.style.opacity = i === 1 ? '1' : '0.4';
          slide.style.transform = i === 1 ? 'scale(1)' : 'scale(0.9)';
          if (i === 1) slide.classList.add('center');
        });
      });

      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    }

    document.querySelector('.arrow-left').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      renderSlides();
    });

    document.querySelector('.arrow-right').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      renderSlides();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        renderSlides();
      });
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

  // Botón "Volver al Dashboard" en la vista de Perfil
  backToDashBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    dashboardView.style.display = 'block';
    initCarousel();
  });

});
