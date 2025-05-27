class AirQualityDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.allData = [];
    this.selectedCities = new Set();
  }

  connectedCallback() {
    this.loadChartScript().then(() => this.fetchAirData());
  }

  async loadChartScript() {
    return new Promise((resolve, reject) => {
      const existing = this.shadowRoot.querySelector('script[src*="chart.js"]');
      
      if (existing) return resolve();

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = resolve;
      script.onerror = reject;
      this.shadowRoot.appendChild(script);
    });
  }

  async fetchAirData() {
    try {
      const res = await fetch('http://localhost:3000/calidad-aire');
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("Sin datos");

      this.allData = data;
      // Inicialmente seleccionar todas las ciudades
      const cities = [...new Set(data.map(d => d.ciudad))];
      this.selectedCities = new Set(cities);
      this.render();
    } catch (error) {
      console.error('Error al obtener datos del mock API:', error);
      this.shadowRoot.innerHTML = `<p>Error al cargar datos simulados del aire.</p>`;
    }
  }

  getFilteredData() {
    return this.allData.filter(d => this.selectedCities.has(d.ciudad));
  }

  onCityToggle(ciudad, isChecked) {
    if (isChecked) {
      this.selectedCities.add(ciudad);
    } else {
      this.selectedCities.delete(ciudad);
    }
    this.updateCharts();
  }

  selectAllCities() {
    const cities = [...new Set(this.allData.map(d => d.ciudad))];
    this.selectedCities = new Set(cities);
    this.updateCheckboxes();
    this.updateCharts();
  }

  deselectAllCities() {
    this.selectedCities.clear();
    this.updateCheckboxes();
    this.updateCharts();
  }

  updateCheckboxes() {
    const checkboxes = this.shadowRoot.querySelectorAll('.city-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = this.selectedCities.has(checkbox.dataset.city);
    });
  }

  updateCharts() {
    const data = this.getFilteredData();
    const chartsContainer = this.shadowRoot.querySelector('.charts-container');
    
    if (data.length === 0) {
      chartsContainer.innerHTML = '<p style="text-align: center; color: #666; font-size: 18px; padding: 40px;">Selecciona al menos una ciudad para ver los gráficos</p>';
      return;
    }

    // Agrupar por ciudad
    const grouped = data.reduce((acc, d) => {
      if (!acc[d.ciudad]) acc[d.ciudad] = [];
      acc[d.ciudad].push(d);
      return acc;
    }, {});

    // Crear tarjetas con gráficas y círculos de calidad
    const cards = Object.entries(grouped).map(([ciudad, registros], i) => {
      const { pais } = registros[0];
      
      // Calcular promedios para los círculos
      const avgPM25 = registros.reduce((acc, r) => acc + r.pm2_5, 0) / registros.length;
      const avgPM10 = registros.reduce((acc, r) => acc + r.pm10, 0) / registros.length;
      const avgCO = registros.reduce((acc, r) => acc + r.co, 0) / registros.length;
      const avgO3 = registros.reduce((acc, r) => acc + r.o3, 0) / registros.length;
      const avgNO2 = registros.reduce((acc, r) => acc + r.no2, 0) / registros.length;
      
      // Calcular índice de calidad (0-100, donde 100 es lo peor)
      const maxPM25 = 100; // Valor máximo esperado para PM2.5
      const maxPM10 = 150; // Valor máximo esperado para PM10
      const qualityIndex = Math.min(100, ((avgPM25 / maxPM25) + (avgPM10 / maxPM10)) * 50);
      
      // Calcular índice de contaminación general
      const contaminationIndex = Math.min(100, (avgPM25 + avgPM10 + avgCO + avgO3 + avgNO2) / 5);
      
      const getQualityClass = (index) => {
        if (index < 25) return 'quality-good';
        if (index < 50) return 'quality-moderate';
        if (index < 75) return 'quality-unhealthy';
        return 'quality-dangerous';
      };

      const getQualityText = (index) => {
        if (index < 25) return 'Buena';
        if (index < 50) return 'Moderada';
        if (index < 75) return 'Mala';
        return 'Peligrosa';
      };

      return `
        <div class="card">
          <div class="card-header">
            <div class="title">${ciudad}, ${pais}</div>
            <div class="quality-circles">
              <div class="circle">
                <svg viewBox="0 0 36 36">
                  <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="circle-progress ${getQualityClass(qualityIndex)}" 
                        stroke-dasharray="${(100 - qualityIndex) * 0.79}, 100" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div class="circle-text ${getQualityClass(qualityIndex)}">
                  <div>${Math.round(100 - qualityIndex)}%</div>
                  <div class="circle-label">Calidad</div>
                </div>
              </div>
              <div class="circle">
                <svg viewBox="0 0 36 36">
                  <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="circle-progress ${getQualityClass(contaminationIndex)}" 
                        stroke-dasharray="${contaminationIndex * 0.79}, 100" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div class="circle-text ${getQualityClass(contaminationIndex)}">
                  <div>${Math.round(contaminationIndex)}%</div>
                  <div class="circle-label">Contam.</div>
                </div>
              </div>
            </div>
          </div>
          <canvas id="chart-${i}" width="300" height="200"></canvas>
        </div>
      `;
    }).join('');

    chartsContainer.innerHTML = `<div class="grid">${cards}</div>`;
    this.drawCharts(grouped);
  }

  render() {
    const data = this.allData;
    const style = `
      <style>
        :host {
          font-family: 'Segoe UI', sans-serif;
          display: block;
          padding: 20px;
          background: #f4f6f8;
        }

        h2 {
          font-size: 24px;
          margin-bottom: 16px;
          color: #333;
        }

        h3 {
          font-size: 20px;
          margin-bottom: 12px;
          color: #444;
        }

        .stats {
          margin-bottom: 32px;
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .stats-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .stats-header h2 {
          margin-bottom: 8px;
        }

        .stats-period {
          color: #666;
          font-size: 14px;
          font-style: italic;
        }

        .highlight-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .highlight-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 12px;
          border-left: 4px solid;
          background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%);
        }

        .highlight-card.best {
          border-left-color: #4caf50;
          background: linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.05) 100%);
        }

        .highlight-card.worst {
          border-left-color: #f44336;
          background: linear-gradient(135deg, rgba(244,67,54,0.1) 0%, rgba(244,67,54,0.05) 100%);
        }

        .highlight-card.summary {
          border-left-color: #2196f3;
          background: linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0.05) 100%);
        }

        .highlight-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .highlight-content {
          flex: 1;
        }

        .highlight-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .highlight-city {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 2px;
        }

        .highlight-country {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .highlight-value {
          font-size: 14px;
          font-weight: 500;
          color: #444;
        }

        .highlight-big-number {
          font-size: 28px;
          font-weight: 700;
          color: #2196f3;
          line-height: 1;
        }

        .highlight-subtitle {
          font-size: 12px;
          color: #666;
        }

        .cities-ranking {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
        }

        .cities-ranking h3 {
          margin-bottom: 16px;
          color: #333;
        }

        .ranking-grid {
          display: grid;
          gap: 8px;
        }

        .ranking-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }

        .ranking-item:hover {
          transform: translateX(4px);
        }

        .ranking-position {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 60px;
        }

        .position-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
        }

        .ranking-info {
          flex: 1;
        }

        .ranking-city {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .ranking-country {
          font-size: 12px;
          color: #666;
        }

        .ranking-value {
          text-align: right;
        }

        .city-selector {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .city-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background: #2196f3;
          color: white;
        }

        .btn-primary:hover {
          background: #1976d2;
        }

        .btn-secondary {
          background: #f5f5f5;
          color: #666;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
        }

        .cities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .city-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .city-option:hover {
          background: #f5f5f5;
        }

        .city-checkbox {
          cursor: pointer;
        }

        .city-label {
          cursor: pointer;
          font-size: 14px;
          color: #444;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }

        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 20px;
          transition: transform 0.2s ease;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .title {
          font-size: 18px;
          font-weight: 600;
          color: #444;
          flex: 1;
        }

        .quality-circles {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .circle {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .circle svg {
          transform: rotate(-90deg);
          width: 100%;
          height: 100%;
        }

        .circle-bg {
          fill: none;
          stroke: #e0e0e0;
          stroke-width: 4;
        }

        .circle-progress {
          fill: none;
          stroke-width: 4;
          stroke-linecap: round;
          transition: stroke-dasharray 0.5s ease;
        }

        .circle-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          font-size: 10px;
          font-weight: 600;
        }

        .circle-label {
          font-size: 8px;
          color: #666;
          margin-top: 2px;
        }

        .quality-good { stroke: #4caf50; color: #4caf50; }
        .quality-moderate { stroke: #ffeb3b; color: #f57f17; }
        .quality-unhealthy { stroke: #ff9800; color: #ff9800; }
        .quality-dangerous { stroke: #f44336; color: #f44336; }

        .alert {
          font-weight: bold;
          color: white;
          padding: 2px 8px;
          border-radius: 8px;
        }

        .verde { background: #4caf50; }
        .amarillo { background: #ffeb3b; color: black; }
        .naranja { background: #ff9800; }
        .rojo { background: #f44336; }
      </style>
    `;

    // Agrupar por ciudad para estadísticas
    const grouped = data.reduce((acc, d) => {
      if (!acc[d.ciudad]) acc[d.ciudad] = [];
      acc[d.ciudad].push(d);
      return acc;
    }, {});

    // Calcular promedios por ciudad
    const cityStats = Object.entries(grouped).map(([ciudad, registros]) => {
      const prom = (key) => registros.reduce((acc, r) => acc + r[key], 0) / registros.length;
      const avg_pm = prom('pm2_5') + prom('pm10') + prom('co') + prom('o3') + prom('no2');
      return {
        ciudad,
        pais: registros[0].pais,
        avg_pm2_5: prom('pm2_5'),
        avg_pm10: prom('pm10'),
        avg_co: prom('co'),
        avg_o3: prom('o3'),
        avg_no2: prom('no2'),
        total_avg: avg_pm
      };
    });

    const mejor = cityStats.reduce((a, b) => (a.total_avg < b.total_avg ? a : b));
    const peor = cityStats.reduce((a, b) => (a.total_avg > b.total_avg ? a : b));

    const alertLevel = (pm25) => {
      if (pm25 < 12) return 'verde';
      if (pm25 < 35) return 'amarillo';
      if (pm25 < 55) return 'naranja';
      return 'rojo';
    };

    // Obtener todas las ciudades únicas
    const allCities = [...new Set(data.map(d => d.ciudad))].sort();

    // Estadísticas principales
    const resumenHTML = `
      <div class="stats">
        <div class="stats-header">
          <h2>📊 Resumen de Calidad del Aire</h2>
          <div class="stats-period">Datos de los últimos 7 días</div>
        </div>
        
        <div class="highlight-cards">
          <div class="highlight-card best">
            <div class="highlight-icon">🌟</div>
            <div class="highlight-content">
              <div class="highlight-title">Mejor Calidad</div>
              <div class="highlight-city">${mejor.ciudad}</div>
              <div class="highlight-country">${mejor.pais}</div>
              <div class="highlight-value">${mejor.avg_pm2_5.toFixed(1)} µg/m³ PM2.5</div>
            </div>
          </div>
          
          <div class="highlight-card worst">
            <div class="highlight-icon">⚠️</div>
            <div class="highlight-content">
              <div class="highlight-title">Requiere Atención</div>
              <div class="highlight-city">${peor.ciudad}</div>
              <div class="highlight-country">${peor.pais}</div>
              <div class="highlight-value">${peor.avg_pm2_5.toFixed(1)} µg/m³ PM2.5</div>
            </div>
          </div>
          
          <div class="highlight-card summary">
            <div class="highlight-icon">🌍</div>
            <div class="highlight-content">
              <div class="highlight-title">Ciudades Monitoreadas</div>
              <div class="highlight-big-number">${cityStats.length}</div>
              <div class="highlight-subtitle">Ubicaciones activas</div>
            </div>
          </div>
        </div>

        <div class="cities-ranking">
          <h3>🏆 Ranking de Ciudades por PM2.5</h3>
          <div class="ranking-grid">
            ${cityStats
              .sort((a, b) => a.avg_pm2_5 - b.avg_pm2_5)
              .map((stat, index) => `
                <div class="ranking-item">
                  <div class="ranking-position">
                    <span class="position-number">${index + 1}</span>
                    ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                  </div>
                  <div class="ranking-info">
                    <div class="ranking-city">${stat.ciudad}</div>
                    <div class="ranking-country">${stat.pais}</div>
                  </div>
                  <div class="ranking-value">
                    <span class="alert ${alertLevel(stat.avg_pm2_5)}">
                      ${stat.avg_pm2_5.toFixed(1)} µg/m³
                    </span>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>
      </div>
    `;

    // Selector de ciudades
    const citySelectorHTML = `
      <div class="city-selector">
        <h3>Seleccionar Ciudades</h3>
        <div class="city-controls">
          <button class="btn btn-primary" id="select-all">Seleccionar Todas</button>
          <button class="btn btn-secondary" id="deselect-all">Deseleccionar Todas</button>
        </div>
        <div class="cities-grid">
          ${allCities.map(ciudad => {
            const pais = data.find(d => d.ciudad === ciudad)?.pais || '';
            return `
              <div class="city-option">
                <input type="checkbox" class="city-checkbox" id="city-${ciudad}" data-city="${ciudad}" checked>
                <label class="city-label" for="city-${ciudad}">${ciudad}, ${pais}</label>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = `
      ${style}
      ${resumenHTML}
      ${citySelectorHTML}
      <div class="charts-container"></div>
    `;

    // Agregar event listeners
    this.shadowRoot.getElementById('select-all').addEventListener('click', () => this.selectAllCities());
    this.shadowRoot.getElementById('deselect-all').addEventListener('click', () => this.deselectAllCities());
    
    this.shadowRoot.querySelectorAll('.city-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        this.onCityToggle(e.target.dataset.city, e.target.checked);
      });
    });

    // Renderizar gráficos iniciales
    this.updateCharts();
  }

  drawCharts(groupedData) {
    Object.entries(groupedData).forEach(([ciudad, registros], index) => {
      registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      const labels = registros.map(r => r.fecha);
      const datasets = ['pm2_5', 'pm10', 'co', 'o3', 'no2'].map((key, i) => ({
        label: key.toUpperCase(),
        data: registros.map(r => r[key]),
        borderColor: ['#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#f44336'][i],
        backgroundColor: 'transparent',
        tension: 0.4,
        fill: false,
        pointRadius: 3
      }));

      const ctx = this.shadowRoot.getElementById(`chart-${index}`);
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: { labels, datasets },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
              y: { beginAtZero: true },
              x: { ticks: { maxRotation: 45, minRotation: 45 } }
            }
          }
        });
      }
    });
  }
}

customElements.define('air-quality-dashboard', AirQualityDashboard);