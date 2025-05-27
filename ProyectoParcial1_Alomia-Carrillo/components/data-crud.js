// Definición de un Web Component personalizado para CRUD de recomendaciones
class DataCrud extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Crea un shadow DOM aislado
    this.recomendaciones = []; // Lista de recomendaciones
    this.editandoId = null; // ID de la recomendación en edición, si hay alguna
  }

  // Se ejecuta cuando el componente se monta en el DOM
  connectedCallback() {
    this.cargarDesdeStorage(); // Carga datos desde localStorage
    this.render();             // Renderiza la interfaz
  }

  // Carga las recomendaciones guardadas o crea unas por defecto si no existen
  cargarDesdeStorage = () => {
    const almacenadas = localStorage.getItem('recomendaciones');
    this.recomendaciones = almacenadas ? JSON.parse(almacenadas) : [
      { id: 1, texto: "Usar mascarilla en días con mala calidad del aire" },
      { id: 2, texto: "Evitar actividades físicas al aire libre en horas pico" }
    ];
  }

  // Guarda las recomendaciones actuales en localStorage
  guardarEnStorage = () => {
    localStorage.setItem('recomendaciones', JSON.stringify(this.recomendaciones));
  }

  // Agrega una nueva recomendación a la lista
  agregarRecomendacion = (texto) => {
    const nueva = {
      id: Date.now(), // Genera un ID único usando la hora actual
      texto
    };
    this.recomendaciones.push(nueva);
    this.guardarEnStorage(); // Actualiza el almacenamiento
    this.render();           // Vuelve a renderizar la interfaz
  }

  // Carga una recomendación en el input para ser editada
  editarRecomendacion = (id) => {
    const recomendacion = this.recomendaciones.find(r => r.id === id);
    if (recomendacion) {
      this.shadowRoot.querySelector('#recomendacion-input').value = recomendacion.texto;
      this.editandoId = id; // Marca que estamos editando esta recomendación
    }
  }

  // Guarda la recomendación editada o una nueva si no se está editando ninguna
  guardarRecomendacion = () => {
    const input = this.shadowRoot.querySelector('#recomendacion-input');
    const texto = input.value.trim();
    if (!texto) return; // Ignora si el input está vacío

    if (this.editandoId) {
      // Actualiza una recomendación existente
      const index = this.recomendaciones.findIndex(r => r.id === this.editandoId);
      if (index !== -1) this.recomendaciones[index].texto = texto;
      this.editandoId = null;
    } else {
      // Crea una nueva recomendación
      this.agregarRecomendacion(texto);
    }

    input.value = "";         // Limpia el campo de entrada
    this.guardarEnStorage();  // Guarda cambios
    this.render();            // Re-renderiza
  }

  // Elimina una recomendación por su ID
  eliminarRecomendacion = (id) => {
    this.recomendaciones = this.recomendaciones.filter(r => r.id !== id);
    this.guardarEnStorage(); // Guarda la lista actualizada
    this.render();           // Re-renderiza
  }

  // Renderiza la interfaz del componente con HTML y CSS encapsulados
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

    // Genera el HTML de la lista de recomendaciones
    const lista = this.recomendaciones.map(r => `
      <li>
        ${r.texto}
        <span class="actions">
          <button onclick="this.getRootNode().host.editarRecomendacion(${r.id})">✏️</button>
          <button onclick="this.getRootNode().host.eliminarRecomendacion(${r.id})">🗑️</button>
        </span>
      </li>
    `).join('');

    // Inserta todo en el Shadow DOM
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

// Registra el componente personalizado <data-crud>
customElements.define('data-crud', DataCrud);
