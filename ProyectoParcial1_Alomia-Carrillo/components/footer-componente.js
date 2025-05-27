// Definición de un Web Component personalizado para el pie de página
class FooterComponente extends HTMLElement {
  constructor() {
    super();
    // Se adjunta un Shadow DOM aislado para encapsular el estilo y el contenido del componente
    this.attachShadow({ mode: 'open' });
  }

  // Método que se llama automáticamente cuando el componente se agrega al DOM
  connectedCallback() {
    this.render(); // Renderiza el contenido del componente
  }

  // Método que define el HTML y CSS que se mostrará dentro del Shadow DOM
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background-color: #333;         /* Fondo oscuro */
          color: #fff;                    /* Texto blanco */
          padding: 20px 15px;             /* Espaciado interior */
          text-align: center;             /* Centra el texto */
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .footer-content {
          max-width: 800px;               /* Ancho máximo del contenido */
          margin: 0 auto;                 /* Centrado horizontal */
        }

        .footer-content p {
          margin: 5px 0;
          font-size: 0.95rem;
        }

        .footer-content a {
          color: #90e0ef;                 /* Color celeste para enlaces */
          text-decoration: none;
        }

        .footer-content a:hover {
          text-decoration: underline;     /* Subrayado al pasar el mouse */
        }

        /* Estilos responsivos para pantallas pequeñas */
        @media (max-width: 480px) {
          .footer-content p {
            font-size: 0.85rem;
          }
        }
      </style>

      <!-- Contenido del pie de página -->
      <footer>
        <div class="footer-content">
          <p>&copy; 2025 AirGuard. Todos los derechos reservados.</p>
          <p>Desarrollado por <a href="https://tusitio.com" target="_blank">Alomia-Carrillo</a></p>
        </div>
      </footer>
    `;
  }
}

// Verifica si el componente ya ha sido registrado, para evitar errores en recargas o múltiples definiciones
if (!customElements.get('footer-componente')) {
  customElements.define('footer-componente', FooterComponente);
}
