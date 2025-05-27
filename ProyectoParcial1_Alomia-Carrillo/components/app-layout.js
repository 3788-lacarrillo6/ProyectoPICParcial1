// Definición de un Web Component personalizado para un layout general de aplicación
class AppLayout extends HTMLElement {
  constructor() {
    super();
    // Crea un shadow DOM encapsulado para aislar estilos y estructura
    this.attachShadow({ mode: 'open' });

    // Asegura que el método toggleNavbar mantenga el contexto correcto al ejecutarse
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  // Se ejecuta cuando el componente se inserta en el DOM
  connectedCallback() {
    this.render(); // Llama a render para construir el HTML y estilos
  }

  // Función que muestra/oculta el menú lateral (nav) en pantallas pequeñas
  toggleNavbar() {
    const nav = this.shadowRoot.querySelector('nav');
    nav.classList.toggle('show'); // Alterna la clase `show` para animar el menú lateral
  }

  // Método que define la estructura y estilo del componente
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          margin: 0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          font-family: sans-serif;
          position: relative;
        }

        header {
          background-color: #333;
          color: white;
          padding: 0rem;
          z-index: 10;
        }

        .main-area {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        nav {
          background: #eee;
          width: 200px;
          padding: 0rem;
          transition: transform 0.3s ease;
        }

        main {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
        }

        button.toggle-btn {
          position: absolute;
          top: 70px;
          left: 10px;
          background-color: #444;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          z-index: 100;
          display: none; /* Oculto por defecto, se muestra solo en móviles */
        }

        /* Estilos responsivos para pantallas pequeñas */
        @media (max-width: 768px) {
          nav {
            position: absolute;
            top: 1px;
            left: 0;
            height: calc(100% - 60px);
            transform: translateX(-100%); /* Oculta el nav fuera de la pantalla */
            width: 180px;
            z-index: 50;
          }

          nav.show {
            transform: translateX(0); /* Muestra el nav al aplicar la clase show */
          }

          button.toggle-btn {
            display: block; /* Muestra el botón hamburguesa */
            top: 598px;
            left: 10px;
            background: linear-gradient(to right, #4facfe, #00f2fe);
          }
        }
      </style>

      <!-- Cabecera con slot para insertar un menú principal -->
      <header>
        <slot name="main-menu"></slot>
      </header>

      <!-- Botón hamburguesa para mostrar el menú en dispositivos móviles -->
      <button class="toggle-btn" id="toggleBtn">☰</button>

      <!-- Área principal que contiene el nav (menú lateral) y el contenido -->
      <div class="main-area">
        <nav id="sidebar">
          <slot name="sidebar"></slot> <!-- Slot para insertar el contenido del menú lateral -->
        </nav>
        <main>
          <slot name="content"></slot> <!-- Slot para insertar el contenido principal -->
        </main>
      </div>
    `;

    // Agrega el evento al botón para mostrar/ocultar el menú lateral
    this.shadowRoot.getElementById('toggleBtn').addEventListener('click', this.toggleNavbar);
  }
}

// Registra el componente personalizado <app-layout>
customElements.define('app-layout', AppLayout);
