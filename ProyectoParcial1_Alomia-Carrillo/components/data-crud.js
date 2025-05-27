class DataCrud extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.recomendaciones = [];
    this.editandoId = null;
  }

  connectedCallback() {
    this.cargarDesdeStorage();
    this.render();
  }

  cargarDesdeStorage = () => {
    const almacenadas = localStorage.getItem('recomendaciones');
    this.recomendaciones = almacenadas ? JSON.parse(almacenadas) : [
      { id: 1, texto: "Usar mascarilla en días con mala calidad del aire" },
      { id: 2, texto: "Evitar actividades físicas al aire libre en horas pico" }
    ];
  }

  guardarEnStorage = () => {
    localStorage.setItem('recomendaciones', JSON.stringify(this.recomendaciones));
  }

  agregarRecomendacion = (texto) => {
    const nueva = {
      id: Date.now(),
      texto
    };
    this.recomendaciones.push(nueva);
    this.guardarEnStorage();
    this.render();
  }

  editarRecomendacion = (id) => {
    const recomendacion = this.recomendaciones.find(r => r.id === id);
    if (recomendacion) {
      this.shadowRoot.querySelector('#recomendacion-input').value = recomendacion.texto;
      this.editandoId = id;
    }
  }

  guardarRecomendacion = () => {
    const input = this.shadowRoot.querySelector('#recomendacion-input');
    const texto = input.value.trim();
    if (!texto) return;

    if (this.editandoId) {
      const index = this.recomendaciones.findIndex(r => r.id === this.editandoId);
      if (index !== -1) this.recomendaciones[index].texto = texto;
      this.editandoId = null;
    } else {
      this.agregarRecomendacion(texto);
    }

    input.value = "";
    this.guardarEnStorage();
    this.render();
  }

  eliminarRecomendacion = (id) => {
    this.recomendaciones = this.recomendaciones.filter(r => r.id !== id);
    this.guardarEnStorage();
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

      .container {
        font-family: Arial, sans-serif;
        background: #f9f9f9;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        width: 100%;
        box-sizing: border-box;
        text-align: center;
      }

      h3 {
        margin-bottom: 15px;
        color: #222;
      }

      input {
        padding: 8px;
        width: 70%;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      button {
        padding: 8px 12px;
        margin-top: 10px;
        border: none;
        background-color: #007bff;
        color: white;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background-color: #0056b3;
      }

      ul {
        list-style: none;
        padding: 0;
        margin-top: 20px;
        text-align: left;
      }

      li {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .actions button {
        margin-left: 10px;
        background: #e0e0e0;
        color: #333;
      }

      .actions button:hover {
        background: #ccc;
      }
    </style>
  `;

  const lista = this.recomendaciones.map(r => `
    <li>
      ${r.texto}
      <span class="actions">
        <button onclick="this.getRootNode().host.editarRecomendacion(${r.id})">✏️</button>
        <button onclick="this.getRootNode().host.eliminarRecomendacion(${r.id})">🗑️</button>
      </span>
    </li>
  `).join('');

  this.shadowRoot.innerHTML = `
    ${style}
    <div class="container">
      <h3>Recomendaciones de Protección</h3>
      <input type="text" id="recomendacion-input" placeholder="Escribe una recomendación..." />
      <button onclick="this.getRootNode().host.guardarRecomendacion()">Guardar</button>

      <ul>
        ${lista}
      </ul>
    </div>
  `;
}

}

customElements.define('data-crud', DataCrud);

