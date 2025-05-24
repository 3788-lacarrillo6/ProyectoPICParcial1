class MainMenu extends HTMLElement {
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
        header {
          background: linear-gradient(to right, #4facfe, #00f2fe);
          color: white;
          padding: 1rem;
          font-family: 'Arial', sans-serif;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
        }
        nav a {
          margin-left: 15px;
          color: white;
          text-decoration: none;
          font-weight: 500;
        }
      </style>
      <header>
        <div class="logo">AirGuard</div>
        <nav>
          <a href="#" onclick="cargarComponente('inicio-componente')">Inicio</a>
          <a href="#" onclick="cargarComponente('educational-section')">Educar</a>
          <a href="#">Login</a>
        </nav>
      </header>
    `;
  }
}

customElements.define('main-menu', MainMenu);
