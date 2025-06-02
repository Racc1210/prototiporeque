document.addEventListener('DOMContentLoaded', () => {
  initCarousel();


  let actividades = [];
  let map, marker;
  let detalleMap, detalleMarker;
  let inscritosPorActividad = new Map();

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

   btnListaActividades?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    listaActividadesContainer.style.display = 'block';
    renderListaActividades();
    document.getElementById('sidebar').classList.remove('show');
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
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (!carouselWrapper) return;
    const slides = document.querySelectorAll('.featured');
    const dots = document.querySelectorAll('.carousel-dot');
    const leftArrow = document.querySelector('.arrow.arrow-left');
    const rightArrow = document.querySelector('.arrow.arrow-right');
    let currentIndex = 0;
    
    function goToSlide(index) {
      slides[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center'
      });
    }
    
    // Asignar eventos a cada dot
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
    });
    
    // Eventos para las flechas
    leftArrow.addEventListener('click', () => {
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    });
    
    rightArrow.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        goToSlide(currentIndex + 1);
      }
    });
    
    // IntersectionObserver para detectar cuál slide se ve y actualizar los dots
    const observerOptions = {
      root: carouselWrapper,
      threshold: 0.5
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          currentIndex = Array.from(slides).indexOf(entry.target);
          dots.forEach(dot => dot.classList.remove('active'));
          if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
          }
        }
      });
    }, observerOptions);
    
    slides.forEach(slide => {
      observer.observe(slide);
    });
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

  // ───────── Botón "Inicio" en el menú lateral ─────────
  const btnInicio = document.getElementById('btnInicio');
  btnInicio.addEventListener('click', (e) => {
    e.preventDefault();
    // Primero se ocultan todas las vistas
    hideAllViews();
    // Se muestra el dashboard
    document.getElementById('dashboardView').style.display = 'block';
    // Se ocultan explícitamente las vistas de perfil y calendario
    document.getElementById('profileContainer').style.display = 'none';
    document.getElementById('calendarContainer').style.display = 'none';
    // Contraer el sidebar
    document.getElementById('sidebar').classList.remove('show');
    // Reinicializamos el carrusel después de mostrar el dashboard
    initCarousel();
  });

  // ───────── Botón "Mi Calendario" en el menú lateral ─────────
  const btnCalendario = document.getElementById('btnCalendario');
  btnCalendario.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllViews();
    document.getElementById('calendarContainer').style.display = 'block';
    document.getElementById('sidebar').classList.remove('show');
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
