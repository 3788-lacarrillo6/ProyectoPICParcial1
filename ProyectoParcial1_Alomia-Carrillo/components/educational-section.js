class EducationalSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.articulos = [
      {
        titulo: "¿Qué es el PM2.5?",
        descripcion: "Las partículas PM2.5 son extremadamente pequeñas y pueden penetrar profundamente en los pulmones, causando problemas respiratorios graves.",
        imagen: "https://cdn-icons-png.flaticon.com/512/706/706164.png"
      },
      {
        titulo: "Efectos del ozono en la salud",
        descripcion: "La exposición al ozono troposférico puede irritar los pulmones y reducir la función pulmonar, especialmente en personas con asma.",
        imagen: "https://cdn-icons-png.flaticon.com/512/4295/4295337.png"
      },
      {
        titulo: "Consejos para protegerte del aire contaminado",
        descripcion: "Evita ejercitarte al aire libre en horas pico, mantén puertas cerradas y usa filtros HEPA si es posible.",
        imagen: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
      }
    ];
  }

  connectedCallback() {
    this.render();
  }

  render = () => {
  const style = `
    <style>
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      .contenedor {
        max-width: 1000px;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        text-align: center;
        font-family: Arial, sans-serif;
      }

      h3 {
        margin-bottom: 20px;
        font-size: 1.6rem;
        color: #222;
      }

      .educativo {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }

      .card {
        background: #fff;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .card:hover {
        transform: translateY(-5px);
      }

      .card img {
        width: 50px;
        height: 50px;
        margin-bottom: 10px;
      }

      .card h4 {
        margin: 0 0 8px 0;
        font-size: 1.1rem;
        color: #333;
      }

      .card p {
        color: #555;
        font-size: 0.95rem;
      }
    </style>
  `;

  const contenido = this.articulos.map(a => `
    <div class="card">
      <img src="${a.imagen}" alt="Icono">
      <h4>${a.titulo}</h4>
      <p>${a.descripcion}</p>
    </div>
  `).join('');

  this.shadowRoot.innerHTML = `
    ${style}
    <div class="contenedor">
      <h3>Sección Educativa</h3>
      <div class="educativo">
        ${contenido}
      </div>
    </div>
  `;
}

}

customElements.define('educational-section', EducationalSection);
