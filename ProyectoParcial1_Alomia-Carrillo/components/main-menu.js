// Definición de un Web Component para el menú principal de navegación
class MainMenu extends HTMLElement {
  constructor() {
    super();
    // Se crea un Shadow DOM abierto para encapsular los estilos y el contenido
    this.attachShadow({ mode: 'open' });
  }

  // Este método se ejecuta automáticamente cuando el componente se conecta al DOM
  connectedCallback() {
    this.render(); // Se invoca el método para renderizar el componente
  }

  // Renderiza el HTML y CSS dentro del Shadow DOM
  render = () => {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        header {
          background: linear-gradient(135deg, #6f94b4, #4f9fa3); /* Gradiente azul-verde */
          color: white;
          padding: 1rem 2rem;
          font-family: 'Segoe UI', 'Arial', sans-serif;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: #fff;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }

        nav a {
          margin-left: 24px;
          color: #f0f0f0;
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          position: relative;
          transition: color 0.3s ease;
        }

        /* Línea decorativa animada bajo los enlaces al pasar el mouse */
        nav a::after {
          content: '';
          position: absolute;
          width: 0%;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #ffffff;
          transition: width 0.3s ease;
        }

        nav a:hover {
          color: #ffffff;
        }

        nav a:hover::after {
          width: 100%;
        }

        /* Adaptación para dispositivos móviles */
        @media (max-width: 768px) {
          header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          nav a {
            margin-left: 0;
            margin-right: 15px;
          }
        }
      </style>

      <header>
        <div class="logo">AirGuard</div>
        <nav>
          <!-- Llama a una función externa para cambiar de componente -->
          <a href="#" onclick="cargarComponente('inicio-componente')">Inicio</a>
          <a href="#" onclick="cargarComponente('educational-section')">Educar</a>
          <a href="#" onclick="cargarComponente('about-team')">Acercade</a>
          <a href="#">Login</a>
        </nav>
      </header>
    `;
  }
}

// Se registra el componente personalizado con el nombre 'main-menu'
customElements.define('main-menu', MainMenu);
