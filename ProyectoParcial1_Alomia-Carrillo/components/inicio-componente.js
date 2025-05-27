// Definición de un Web Component personalizado para la sección de inicio o bienvenida
class InicioComponente extends HTMLElement {
  constructor() {
    super();
    // Se crea un Shadow DOM abierto para encapsular el contenido y estilos del componente
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  // Este método se ejecuta cuando el componente se agrega al DOM
  connectedCallback() {
    this.render(); // Se llama a la función que renderiza el contenido HTML
  }

  // Método para insertar el HTML y estilos dentro del Shadow DOM
  render() {
    this.shadow.innerHTML = `
      <style>
        /* Contenedor principal de la bienvenida */
        .bienvenida {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px 25px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #e0f7e9, #c2f0d2); /* Gradiente verde claro */
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Sombra suave */
          color: #1b4332; /* Texto verde oscuro */
          text-align: center;
          transition: transform 0.3s ease;
        }

        /* Efecto al pasar el mouse por el contenedor */
        .bienvenida:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        h2 {
          font-weight: 700;
          font-size: 2.2rem;
          margin-bottom: 15px;
          letter-spacing: 1.2px;
          color: #2d6a4f;
        }

        p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 25px;
          color: #40916c;
        }

        img {
          max-width: 220px;
          margin: 0 auto;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        img:hover {
          transform: scale(1.05); /* Aumenta el tamaño al pasar el mouse */
        }

        /* Estilos responsivos para pantallas pequeñas */
        @media (max-width: 480px) {
          .bienvenida {
            padding: 20px 15px;
          }

          h2 {
            font-size: 1.7rem;
          }

          p {
            font-size: 1rem;
          }

          img {
            max-width: 160px;
          }
        }
      </style>

      <!-- Contenido visible del componente -->
      <div class="bienvenida">
        <h2>Bienvenido a AirGuard</h2>
        <p>Monitorea la calidad del aire de forma educativa, visual e interactiva.</p>
        <img src="https://cdn-icons-png.flaticon.com/512/4285/4285457.png" alt="Calidad del Aire">
      </div>
    `;
  }
}

// Se registra el componente solo si no ha sido definido antes
if (!customElements.get('inicio-componente')) {
  customElements.define('inicio-componente', InicioComponente);
}
