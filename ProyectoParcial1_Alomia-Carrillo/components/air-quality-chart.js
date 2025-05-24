class AirQualityChart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3000/calidad-aire');
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("Sin datos");

      this.render();
      this.renderChart(data);
    } catch (error) {
      console.error('Error al obtener datos para el gráfico:', error);
      this.shadowRoot.innerHTML = `<p>Error al cargar el gráfico.</p>`;
    }
  }

  render = () => {
    this.shadowRoot.innerHTML = `
      <style>
        canvas {
          max-width: 100%;
          margin-top: 20px;
        }
        h3 {
          font-family: Arial, sans-serif;
        }
      </style>
      <h3>Comparación de PM2.5 y PM10 por Ciudad</h3>
      <canvas id="airChart"></canvas>
    `;
  }

  renderChart = (data) => {
    const ctx = this.shadowRoot.querySelector('#airChart');

    const ciudades = data.map(d => d.ciudad);
    const pm25 = data.map(d => d.pm2_5);
    const pm10 = data.map(d => d.pm10);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ciudades,
        datasets: [
          {
            label: 'PM2.5 (µg/m³)',
            data: pm25,
            backgroundColor: '#4e79a7'
          },
          {
            label: 'PM10 (µg/m³)',
            data: pm10,
            backgroundColor: '#f28e2b'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Concentración (µg/m³)'
            }
          }
        }
      }
    });
  }
}

customElements.define('air-quality-chart', AirQualityChart);
