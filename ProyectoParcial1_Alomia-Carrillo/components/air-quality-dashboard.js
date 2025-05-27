class AirQualityDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.allData = [];//Array donde de almacena los datos de la api
    this.selectedCity = 'Todas';
  }

  connectedCallback() {
    this.fetchAirData();//llama a la funcion para obtener los datos
  }


  async fetchAirData() {
    try {
      const res = await fetch('http://localhost:3000/calidad-aire');
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) throw new Error("Sin datos");

      this.allData = data;//guarda en los datos en el array allData
      this.render();//llama al render 
    } catch (error) {
      console.error('Error al obtener datos del mock API:', error);
      this.shadowRoot.innerHTML = `<p>Error al cargar datos simulados del aire.</p>`;
    }
  }

  //Funcion la cual agrupo los datos por ciudad ya que en el 
  //mock api los datos estan mezclados
  getGroupedData() {
    return this.allData.reduce((acc, d) => {
      //si no existe la ciudad en el acumulador crea
      if (!acc[d.ciudad]) acc[d.ciudad] = [];
      //agrega el dato a la ciudad correspondiente
      acc[d.ciudad].push(d);
      return acc;
    }, {});
  }

  //Funcion que asigna el estilo segun la calidad del aire resivida
  getQualityClass(index) {
    if (index < 25) return 'quality-good';
    if (index < 50) return 'quality-moderate';
    if (index < 75) return 'quality-unhealthy';
    return 'quality-dangerous';
  }

  //funcion que manipula la seleccion de la ciudad
  handleCityChange(event) {
    this.selectedCity = event.target.value;
    this.render();

    // Reiniciar animación
    setTimeout(() => {
      // Elimina la clase de animación para reiniciarla
      this.shadowRoot.querySelectorAll('.card').forEach(el => {
        el.classList.remove('fade-in');//se elimina la clase fade-in
        void el.offsetWidth;
        el.classList.add('fade-in');//se vuelve a agregar la clase fade-in
      });
    }, 10);//retardo de 10ms para reiniciar la animacion
  }

  render() {
    const grouped = this.getGroupedData();//objeto dondse se guardaron las ciudades
    const cities = Object.keys(grouped);//lista de las ciudades
    const selected = this.selectedCity//ciudad seleccionada


    const filteredEntries = selected === 'Todas'
      ? Object.entries(grouped)//devuelve todas las ciudades
      : Object.entries(grouped).filter(([ciudad]) => ciudad === selected);//filtra las ciudades por la seleccionada

    const style = `
      <style>
        :host {
          font-family: 'Segoe UI', sans-serif;
          display: block;
          padding: 20px;
          background: #f4f6f8;
        }

        select {
          margin-bottom: 20px;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
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
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .title {
          font-size: 18px;
          font-weight: 600;
          color: #444;
          margin-bottom: 12px;
          text-align: center;
        }

        .circle {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 10px auto;
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
          font-size: 12px;
          font-weight: bold;
        }

        .circle-label {
          font-size: 10px;
          color: #666;
        }

        .quality-good { stroke: #4caf50; color: #4caf50; }
        .quality-moderate { stroke: #ffeb3b; color: #f57f17; }
        .quality-unhealthy { stroke: #ff9800; color: #ff9800; }
        .quality-dangerous { stroke: #f44336; color: #f44336; }

        canvas {
          display: block;
          max-width: 100%;
          margin-top: 20px;
        }
      </style>
    `;

    const comboBox = `
      <label for="citySelect">Ciudad:</label>
      <select id="citySelect">
        <option value="Todas">Todas</option>
        ${cities.map(city => `<option value="${city}" ${city === selected ? 'selected' : ''}>${city}</option>`).join('')}
      </select>
    `;

    //Crea las tarjetas para cada ciudad
    const cards = filteredEntries.map(([ciudad, registros], i) => {
      // 1. Extracción y cálculo de datos por ciudad

      // Obtiene el país de la primera entrada
      const { pais } = registros[0];
      // Calcula promedios de PM2.5 y PM10
      const avgPM25 = registros.reduce((acc, r) => acc + r.pm2_5, 0) / registros.length;
      const avgPM10 = registros.reduce((acc, r) => acc + r.pm10, 0) / registros.length;

      //Definicion de los valores máximos para PM2.5 y PM10
      const maxPM25 = 100;
      const maxPM10 = 150;

      //Una métrica que combina PM2.5 y PM10, escalada para estar entre 0 y 100.
      const qualityIndex = Math.min(100, ((avgPM25 / maxPM25) + (avgPM10 / maxPM10)) * 50);
      
      // 3. Determinación de la clase CSS de calidad y el valor de calidad
      const qualityClass = this.getQualityClass(qualityIndex);
      const qualityValue = Math.round(100 - qualityIndex);


  // 4. Generación de un ID único para el elemento canvas
  // Reemplaza espacios en el nombre de la ciudad con guiones para un ID válido.
      const canvasId = `chart-${i}-${ciudad.replace(/\s+/g, '-')}`;

       // 5. Retorna la estructura HTML de la tarjeta
      return `
        <div class="card fade-in">
          <div class="title">${ciudad}, ${pais}</div>
          <div class="circle">
            <svg viewBox="0 0 36 36">
              <path class="circle-bg" d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle-progress ${qualityClass}" stroke-dasharray="${(100 - qualityIndex) * 0.79}, 100"
                d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="circle-text ${qualityClass}">
              <div>${qualityValue}%</div>
              <div class="circle-label">Calidad</div>
            </div>
          </div>
          <canvas id="${canvasId}" height="150"></canvas>
        </div>
      `;
    }).join('');

    // Renderiza el contenido en el shadow DOM
    this.shadowRoot.innerHTML = `
      ${style}
      ${comboBox}
      <div class="grid">${cards}</div>
    `;

    // Agrega el evento de cambio al select
    //Cuando el usuario cambia la ciudad en el combo, 
    // se llama a handleCityChange() que actualiza selectedCity y vuelve a ejecutar render()
    this.shadowRoot.querySelector('#citySelect').addEventListener('change', this.handleCityChange.bind(this));

    // Render chart for each ciudad
    filteredEntries.forEach(([ciudad, registros], i) => {
      // 1. Genera el ID único del canvas
      const canvasId = `chart-${i}-${ciudad.replace(/\s+/g, '-')}`;
      const ctx = this.shadowRoot.getElementById(canvasId);

      if (ctx) {
        // 4. Prepara los datos para el gráfico
        // Las etiquetas X del gráfico serán las fechas de los registros, 
        // o 'Día' si no hay fecha.
        const labels = registros.map(r => r.fecha || 'Día');
        // 5. Crea una nueva instancia de Chart.js
        new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              // Conjunto de datos para PM2.5
              {
                label: 'PM2.5',
                data: registros.map(r => r.pm2_5),// Valores de PM2.5 para el eje Y
                borderColor: '#4caf50',
                fill: false,
                tension: 0.3
              },
              // Conjunto de datos para PM10
              {
                label: 'PM10',
                data: registros.map(r => r.pm10),// Valores de PM10 para el eje Y
                borderColor: '#2196f3',
                fill: false,
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,// El gráfico se ajusta al tamaño de su contenedor
            plugins: {
              legend: {
                display: true,// Muestra la leyenda (PM2.5, PM10)
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    });
  }
}

customElements.define('air-quality-dashboard', AirQualityDashboard);
