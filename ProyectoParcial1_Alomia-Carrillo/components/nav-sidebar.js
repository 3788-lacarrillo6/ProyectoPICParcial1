class NavSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render = () => {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        aside {
          width: 200px;
          min-height: 100vh;
          background-color: #f7f9fb;
          border-right: 1px solid #ccc;
          padding: 20px;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          transition: transform 0.3s ease, width 0.3s ease;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          margin-bottom: 15px;
        }

        button {
          background: none;
          border: none;
          color: #333;
          font-size: 1rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        button:hover {
          color: #007bff;
        }

        @media (max-width: 768px) {
  aside {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ccc;
  }
}

      </style>

      <aside>
        <ul>
           <li><button onclick="cargarComponente('inicio-componente')">Inicio</button></li>
          <li><button onclick="cargarComponente('air-quality-dashboard')">Dashboard</button></li>
          <li><button onclick="cargarComponente('air-quality-chart')">Gráfico</button></li>
          <li><button onclick="cargarComponente('user-recommendations')">Recomendaciones</button></li>
          <li><button onclick="cargarComponente('educational-section')">Sección Educativa</button></li>
          <li><button onclick="cargarComponente('data-crud')">CRUD</button></li>
        </ul>
      </aside>
    `;
  }
}

customElements.define('nav-sidebar', NavSidebar);
