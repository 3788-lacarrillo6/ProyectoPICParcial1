class FooterComponente extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background-color: #333;
          color: #fff;
          padding: 20px 15px;
          text-align: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .footer-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .footer-content p {
          margin: 5px 0;
          font-size: 0.95rem;
        }

        .footer-content a {
          color: #90e0ef;
          text-decoration: none;
        }

        .footer-content a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .footer-content p {
            font-size: 0.85rem;
          }
        }
      </style>

      <footer>
        <div class="footer-content">
          <p>&copy; 2025 AirGuard. Todos los derechos reservados.</p>
          <p>Desarrollado por <a href="https://tusitio.com" target="_blank">TuNombre</a></p>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get('footer-componente')) {
  customElements.define('footer-componente', FooterComponente);
}
