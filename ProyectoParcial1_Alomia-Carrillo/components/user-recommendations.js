class UserRecommendations extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Crea un shadow DOM encapsulado
    this.recomendaciones = []; // Inicializa el array de recomendaciones
  }

  connectedCallback() {
    this.cargarRecomendaciones(); // Carga las recomendaciones (desde localStorage o valores por defecto)
    this.render(); // Renderiza el contenido del componente
  }

  cargarRecomendaciones = () => {
    const data = localStorage.getItem('recomendaciones'); // Intenta obtener datos guardados
    this.recomendaciones = data
      ? JSON.parse(data) // Si hay datos en localStorage, los parsea
      : [
          // Si no hay datos, usa recomendaciones predeterminadas
          { id: 1, texto: "Usar mascarilla en días con mala calidad del aire" },
          { id: 2, texto: "Evitar actividades físicas al aire libre en horas pico" },
          { id: 3, texto: "Mantener ventanas cerradas durante altas concentraciones de PM" }
        ];
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

        .recomendaciones {
          font-family: Arial, sans-serif;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 100%;
          box-sizing: border-box;
          text-align: left;
        }

        ul {
          padding-left: 20px; /* Sangría para la lista */
        }

        li {
          margin-bottom: 8px; /* Espacio entre recomendaciones */
        }

        h3 {
          margin-bottom: 10px;
          font-size: 1.4rem;
          color: #333;
        }
      </style>
    `;

    // Genera la lista de recomendaciones como elementos <li>
    const lista = this.recomendaciones.map(r => `<li>${r.texto}</li>`).join('');

    // Inserta el estilo y el contenido HTML al shadowRoot
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

// Registra el componente personalizado
customElements.define('user-recommendations', UserRecommendations);
