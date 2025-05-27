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
          width: 220px;
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(145deg, #e6eef5, #ffffff);
          border-right: 1px solid #ccc;
          box-shadow: inset 8px 8px 16px #cfd6dc,
                      inset -8px -8px 16px #ffffff;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          animation: fadeIn 0.6s ease;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        li {
          margin-bottom: 18px;
          opacity: 0;
          transform: translateX(-20px);
          animation: slideIn 0.4s ease forwards;
        }

        li:nth-child(1) { animation-delay: 0.1s; }
        li:nth-child(2) { animation-delay: 0.2s; }
        li:nth-child(3) { animation-delay: 0.3s; }
        li:nth-child(4) { animation-delay: 0.4s; }
        li:nth-child(5) { animation-delay: 0.5s; }

        button {
          background: #e6eef5;
          border: none;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 1rem;
          color: #333;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 6px 6px 12px #cfd6dc,
                      -6px -6px 12px #ffffff;
        }

        button:hover {
          color: #007bff;
          transform: scale(1.03);
        }

        li.active button {
          background: linear-gradient(145deg, #d0e1f9, #f0f8ff);
          color: #007bff;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
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
          <li><button data-target="air-quality-dashboard">Dashboard</button></li>
          <li><button data-target="air-quality-chart">Gráfico</button></li>
          <li><button data-target="user-recommendations">Recomendaciones</button></li>
          <li><button data-target="educational-section">Sección Educativa</button></li>
          <li><button data-target="data-crud">CRUD</button></li>
        </ul>
      </aside>
    `;

    // Lógica de activación
    const buttons = this.shadowRoot.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.target;
        if (typeof cargarComponente === 'function') {
          cargarComponente(target);
        }

        // Actualizar clase activa
        this.shadowRoot.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        button.parentElement.classList.add('active');
      });
    });
  }
}

customElements.define('nav-sidebar', NavSidebar);
