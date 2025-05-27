
const contenedor = document.getElementById('contenedor-principal');

const rutasComponentes = {
  'inicio-componente': 'components/inicio-componente.js',
  'air-quality-dashboard': 'components/air-quality-dashboard.js',
  'air-quality-chart': 'components/air-quality-chart.js',
  'user-recommendations': 'components/user-recommendations.js',
  'data-crud': 'components/data-crud.js',
  'educational-section': 'components/educational-section.js'
};

window.cargarComponente = (nombre) => {
  const ruta = rutasComponentes[nombre];
  if (!ruta) {
    contenedor.innerHTML = `<h2>Componente no encontrado: ${nombre}</h2>`;
    return;
  }

  // Verifica si ya fue cargado
  if (customElements.get(nombre)) {
    contenedor.innerHTML = `<${nombre}></${nombre}>`;
    return;
  }

  // Carga el script dinámicamente
  const script = document.createElement('script');
  script.src = ruta;
  script.onload = () => {
    contenedor.innerHTML = `<${nombre}></${nombre}>`;
  };
  script.onerror = () => {
    contenedor.innerHTML = `<h2>Error al cargar el componente.</h2>`;
  };

  document.body.appendChild(script);
};

// Carga inicial
window.addEventListener('DOMContentLoaded', () => {
  window.cargarComponente('inicio-componente');
});
