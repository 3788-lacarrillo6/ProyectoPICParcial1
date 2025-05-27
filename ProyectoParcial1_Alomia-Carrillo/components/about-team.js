class AboutTeam extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Crea un shadow DOM encapsulado
  }

  connectedCallback() {
    this.render(); // Se ejecuta cuando el componente es agregado al DOM
  }

  render() {
    // Estilos del componente encapsulados en el shadow DOM
    const style = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: auto;
          background-color: #f4f6f8;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        h2 {
          text-align: center;
          color: #333;
        }

        .team {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          margin-top: 20px;
        }

        .member {
          background: #ffffff;
          border-radius: 10px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          width: 180px;
          text-align: center;
        }

        .member h4 {
          margin: 8px 0 4px;
          color: #007bff;
        }

        .member p {
          margin: 0;
          font-size: 0.9rem;
          color: #555;
        }
      </style>
    `;

    // Lista de integrantes del equipo con sus respectivos roles
    const teamMembers = [
      { nombre: "Johan Alomia", rol: "Desarrollador Frontend" },
      { nombre: "Luis Carrillo", rol: "Diseñadora UI/UX" },
    ];

    // Genera el HTML de cada miembro del equipo
    const membersHTML = teamMembers.map(member => `
      <div class="member">
        <h4>${member.nombre}</h4>
        <p>${member.rol}</p>
      </div>
    `).join('');

    // Inserta el HTML final y estilos en el shadow DOM
    this.shadowRoot.innerHTML = `
      ${style}
      <section>
        <h2>Acerca del Proyecto</h2>
        <div class="team">
          ${membersHTML}
        </div>
      </section>
    `;
  }
}

// Define el nuevo elemento personalizado <about-team>
customElements.define('about-team', AboutTeam);
