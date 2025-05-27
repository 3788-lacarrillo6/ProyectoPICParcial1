class AppLayout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  toggleNavbar() {
    const nav = this.shadowRoot.querySelector('nav');
    nav.classList.toggle('show');
  }


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
          display: none;
        }

        /* Mobile view */
        @media (max-width: 768px) {
          nav {
            position: absolute;
            top: 1px;
            left: 0;
            height: calc(100% - 60px);
            transform: translateX(-100%);
            width: 180px;
            z-index: 50;
          }

          nav.show {
            transform: translateX(0);
          }

          button.toggle-btn {
            display: block;
            top: 598px;
            left: 10px;
            background: linear-gradient(to right, #4facfe, #00f2fe);
          }
        }

              </style>

              <header>
                <slot name="main-menu"></slot>
              </header>

              <button class="toggle-btn" id="toggleBtn">☰</button>

              <div class="main-area">
                <nav id="sidebar">
                  <slot name="sidebar"></slot>
                </nav>
                <main>
                  <slot name="content"></slot>
                </main>
              </div>
    `;

    this.shadowRoot.getElementById('toggleBtn').addEventListener('click', this.toggleNavbar);
  }
}

customElements.define('app-layout', AppLayout);
