class UserRecommendations extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.recomendaciones = [];
  }

  connectedCallback() {
    this.cargarRecomendaciones();
    this.render();
  }

  cargarRecomendaciones = () => {
    const data = localStorage.getItem('recomendaciones');
    this.recomendaciones = data
      ? JSON.parse(data)
      : [
          { id: 1, texto: "Usar mascarilla en días con mala calidad del aire" },
          { id: 2, texto: "Evitar actividades físicas al aire libre en horas pico" },
          { id: 3, texto: "Mantener ventanas cerradas durante altas concentraciones de PM" }
        ];
  }

  render = () => {
    const style = `
      <style>
        .recomendaciones {
          font-family: Arial, sans-serif;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 10px;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 8px;
        }
        h3 {
          margin-bottom: 10px;
          font-size: 1.2rem;
          color: #333;
        }
      </style>
    `;

    const lista = this.recomendaciones.map(r => `<li>${r.texto}</li>`).join('');

    this.shadowRoot.innerHTML = `
      ${style}
      <div class="recomendaciones">
        <h3>Recomendaciones para protegerte</h3>
        <ul>
          ${lista}
        </ul>
      </div>
    `;
  }
}

customElements.define('user-recommendations', UserRecommendations);
