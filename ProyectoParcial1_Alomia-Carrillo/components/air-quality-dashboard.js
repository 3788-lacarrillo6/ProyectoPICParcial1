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

  getColorClass(value, thresholds) {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.moderate) return 'moderate';
    return 'bad';
  }

 render = (data) => {
  const style = `
    <style>
      .dashboard {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        font-family: 'Segoe UI', sans-serif;
        background: #e0e5ec;
        padding: 50px;
        border-radius: 20px;
        box-shadow: inset 8px 8px 16px #c5cbd4, inset -8px -8px 16px #f5faff;
        justify-content: center;
      }

      h3 {
        font-size: 24px;
        margin: 0 0 30px 0;
        text-align: center;
        width: 100%;
        color: #333;
      }

      .location-card {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 6px 6px 12px #c3c8d0, -6px -6px 12px #ffffff;
        width: 260px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        animation: fadeIn 0.6s ease forwards;
        opacity: 0;
      }

      .location-card:hover {
        transform: translateY(-5px);
        box-shadow: 6px 12px 20px rgba(0, 0, 0, 0.1);
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      .location-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: #2c3e50;
      }

      .stat {
        font-size: 14px;
        color: #555;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .stat span {
        font-weight: bold;
      }

      .good {
        color: #2ecc71;
      }

      .moderate {
        color: #f1c40f;
      }

      .bad {
        color: #e74c3c;
      }

      @media (max-width: 600px) {
        .dashboard {
          padding: 20px;
        }

        .location-card {
          width: 100%;
        }
      }
    </style>
  `;

  const cards = data.map(loc => `
    <div class="location-card">
      <div class="location-title">${loc.ciudad}, ${loc.pais}</div>
      <div class="stat">PM2.5: <span class="${this.getColorClass(loc.pm2_5, { good: 12, moderate: 35 })}">${loc.pm2_5}</span></div>
      <div class="stat">PM10: <span class="${this.getColorClass(loc.pm10, { good: 20, moderate: 50 })}">${loc.pm10}</span></div>
      <div class="stat">CO: <span class="${this.getColorClass(loc.co, { good: 0.5, moderate: 1 })}">${loc.co}</span></div>
      <div class="stat">O₃: <span class="${this.getColorClass(loc.o3, { good: 0.03, moderate: 0.07 })}">${loc.o3}</span></div>
      <div class="stat">NO₂: <span class="${this.getColorClass(loc.no2, { good: 0.02, moderate: 0.05 })}">${loc.no2}</span></div>
    </div>
  `).join('');

  this.shadowRoot.innerHTML = `
    ${style}
    <h3>🌍 Calidad del Aire por Ciudad</h3>
    <div class="dashboard">
      ${cards}
    </div>
  `;
}

}

customElements.define('air-quality-dashboard', AirQualityDashboard);
