// Definición de un Web Component personalizado llamado AirQualityChart
class AirQualityChart extends HTMLElement {
  constructor() {
    super();
    // Crea un shadow DOM encapsulado
    this.attachShadow({ mode: 'open' });
  }

  // Método que se ejecuta cuando el componente se agrega al DOM
  connectedCallback() {
    this.fetchData(); // Inicia la obtención de datos desde la API simulada
  }

  // Método asíncrono para obtener los datos del mock API
  fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3000/calidad-aire'); // Realiza la solicitud
      const data = await res.json(); // Convierte la respuesta a JSON
      if (!Array.isArray(data) || data.length === 0) throw new Error("Sin datos"); // Valida que haya datos

      this.render(); // Renderiza la estructura inicial
      this.renderChart(data); // Genera el gráfico con los datos obtenidos
    } catch (error) {
      // En caso de error, muestra un mensaje en el shadow DOM
      console.error('Error al obtener datos para el gráfico:', error);
      this.shadowRoot.innerHTML = `<p>Error al cargar el gráfico.</p>`;
    }
  }

  // Método que construye el HTML y CSS del componente
  render = () => {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .chart-container {
          text-align: center;
          max-width: 800px;
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h3 {
          font-family: Arial, sans-serif;
          margin-top: 0;
        }

        canvas {
          width: 100% !important;
          height: auto !important;
          margin-top: 20px;
        }
      </style>

      <div class="chart-container">
        <h3>Comparación de PM2.5 y PM10 por Ciudad</h3>
        <canvas id="airChart"></canvas>
      </div>
    `;
  }

  // Método que crea y configura el gráfico usando Chart.js
  renderChart = (data) => {
    const ctx = this.shadowRoot.querySelector('#airChart'); // Obtiene el canvas

    // Extrae los datos de ciudades y concentraciones de contaminantes
    const ciudades = data.map(d => d.ciudad);
    const pm25 = data.map(d => d.pm2_5);
    const pm10 = data.map(d => d.pm10);

    // Crea un gráfico de barras con dos datasets: PM2.5 y PM10
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ciudades, // Etiquetas del eje X
        datasets: [
          {
            label: 'PM2.5 (µg/m³)',
            data: pm25,
            backgroundColor: '#4e79a7' // Color para PM2.5
          },
          {
            label: 'PM10 (µg/m³)',
            data: pm10,
            backgroundColor: '#f28e2b' // Color para PM10
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true, // Comienza el eje Y desde cero
            title: {
              display: true,
              text: 'Concentración (µg/m³)' // Etiqueta del eje Y
            }
          }
        }
      }
    });
  }
}

// Registra el Web Component para poder usar <air-quality-chart></air-quality-chart> en HTML
customElements.define('air-quality-chart', AirQualityChart);
