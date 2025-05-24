class AirQualityDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.fetchAirData();
  }

  fetchAirData = async () => {
    try {
      const res = await fetch('http://localhost:3000/calidad-aire');
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) throw new Error("Sin datos");

      this.render(data);
    } catch (error) {
      console.error('Error al obtener datos del mock API:', error);
      this.shadowRoot.innerHTML = `<p>Error al cargar datos simulados del aire.</p>`;
    }
  }

  render = (data) => {
    const style = `
      <style>
        .dashboard {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          font-family: Arial, sans-serif;
        }
        .location-card {
          background: white;
          padding: 16px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          width: 260px;
        }
        .location-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        .stat {
          margin-bottom: 6px;
          font-size: 14px;
          color: #444;
        }
        .stat span {
          font-weight: bold;
          float: right;
        }
      </style>
    `;

    const cards = data.map(loc => `
      <div class="location-card">
        <div class="location-title">${loc.ciudad}, ${loc.pais}</div>
        <div class="stat">PM2.5: <span>${loc.pm2_5}</span></div>
        <div class="stat">PM10: <span>${loc.pm10}</span></div>
        <div class="stat">CO: <span>${loc.co}</span></div>
        <div class="stat">O₃: <span>${loc.o3}</span></div>
        <div class="stat">NO₂: <span>${loc.no2}</span></div>
      </div>
    `).join('');

    this.shadowRoot.innerHTML = `
      ${style}
      <h3>Calidad del Aire por Ciudad (Mock API)</h3>
      <div class="dashboard">
        ${cards}
      </div>
    `;
  }
}

customElements.define('air-quality-dashboard', AirQualityDashboard);
