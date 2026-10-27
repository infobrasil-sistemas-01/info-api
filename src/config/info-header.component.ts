// Web Component unificado encapsulado em TypeScript para garantir disponibilidade imediata
// em qualquer ambiente (dev, build, Docker production) sem dependências de arquivos estáticos em disco.

export const INFO_HEADER_JS = `
class InfoApiHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['active-doc', 'current-version', 'versions', 'theme'];
  }

  connectedCallback() {
    const savedTheme = this.currentTheme;
    this.applyTheme(savedTheme, false);
    this.render();
    this.setupListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.shadowRoot) {
      this.render();
      this.setupListeners();
    }
  }

  get activeDoc() {
    return this.getAttribute('active-doc') || 'docs';
  }

  get currentVersion() {
    return this.getAttribute('current-version') || '';
  }

  get currentTheme() {
    try {
      return localStorage.getItem('infoapi-theme') || 'dark';
    } catch {
      return 'dark';
    }
  }

  get versions() {
    try {
      const raw = this.getAttribute('versions');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  applyTheme(theme, notify = true) {
    try {
      localStorage.setItem('infoapi-theme', theme);
    } catch (_) {}
    this.setAttribute('theme', theme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.classList.toggle('theme-dark', theme === 'dark');
      document.body.classList.toggle('theme-light', theme === 'light');
    }
    if (notify) {
      this.dispatchEvent(new CustomEvent('theme-changed', {
        detail: { theme },
        bubbles: true,
        composed: true
      }));
    }
  }

  render() {
    const activeDoc = this.activeDoc;
    const currentVersion = this.currentVersion;
    const versions = this.versions;
    const isDark = (this.getAttribute('theme') || this.currentTheme) !== 'light';

    const path = window.location.pathname;

    let versionOptionsHtml = '';
    if (versions && versions.length > 0) {
      versionOptionsHtml = \`
        <div class="version-wrapper">
          <label class="version-label" for="version-select">
            <svg class="icon-inline" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span>Versão:</span>
          </label>
          <select id="version-select" class="version-select">
            <option value="" \${!path.includes('/v') ? 'selected' : ''}>Principal (v\${currentVersion || 'Atual'})</option>
            \${versions
              .map((v) => {
                const isSelected = path.includes('/v' + v);
                return \`<option value="v\${v}" \${isSelected ? 'selected' : ''}>v\${v}</option>\`;
              })
              .join('')}
          </select>
        </div>
      \`;
    }

    this.shadowRoot.innerHTML = \`
      <style>
        :host {
          display: block;
          position: sticky;
          top: 0;
          z-index: 999999;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          --primary: #10b981;
          --primary-hover: #059669;
          --primary-glow: rgba(16, 185, 129, 0.25);
          --bg: #06110d;
          --card-bg: #0c1f18;
          --text: #f0fdf4;
          --text-muted: #94a3b8;
          --border: rgba(255, 255, 255, 0.08);
          --border-hover: rgba(16, 185, 129, 0.35);
          --glass: rgba(12, 31, 24, 0.95);
          width: 100%;
          box-sizing: border-box;
          transition: background 0.25s, color 0.25s;
        }

        :host([theme="light"]) {
          --primary: #059669;
          --primary-hover: #047857;
          --primary-glow: rgba(5, 150, 105, 0.2);
          --bg: #f8fafc;
          --card-bg: #ffffff;
          --text: #0f172a;
          --text-muted: #64748b;
          --border: rgba(0, 0, 0, 0.08);
          --border-hover: rgba(5, 150, 105, 0.35);
          --glass: rgba(255, 255, 255, 0.95);
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        header {
          width: 100%;
          background: var(--glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 0.65rem 1.5rem;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-inner {
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-shrink: 0;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--text);
          transition: opacity 0.2s;
        }

        .brand:hover {
          opacity: 0.85;
        }

        .brand-logo {
          height: 26px;
          width: auto;
          display: block;
        }

        :host([theme="light"]) .brand-logo {
          filter: invert(1);
        }

        .brand-text {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
        }

        .brand-text span {
          color: var(--primary);
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          list-style: none;
        }

        .nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--text);
          background: rgba(255, 255, 255, 0.05);
        }

        :host([theme="light"]) .nav-link:hover, :host([theme="light"]) .nav-link.active {
          background: rgba(0, 0, 0, 0.04);
        }

        .nav-link.active {
          color: var(--primary);
        }

        /* Dropdown */
        .dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 8px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 6px;
          min-width: 220px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transform: translateY(8px);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        :host([theme="light"]) .dropdown-menu {
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
        }

        .dropdown:hover .dropdown-menu,
        .dropdown.open .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          padding: 8px 12px;
          border-radius: 8px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.84rem;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.15s;
        }

        .dropdown-item:hover, .dropdown-item.active {
          color: var(--text);
          background: rgba(16, 185, 129, 0.12);
        }

        .dropdown-item strong {
          display: block;
          color: var(--text);
          font-size: 0.85rem;
        }

        .dropdown-item .desc {
          display: block;
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background-color: var(--primary);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px var(--primary);
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 12px var(--primary); }
        }

        /* Version Selector */
        .version-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 3px 8px;
        }

        :host([theme="light"]) .version-wrapper {
          background: rgba(0, 0, 0, 0.03);
        }

        .version-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.76rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .version-select {
          background: transparent;
          border: none;
          color: var(--primary);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }

        .version-select option {
          background: var(--card-bg);
          color: var(--text);
        }

        /* Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* Theme Toggle Button */
        .btn-theme-toggle {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 9px;
          padding: 7px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          width: 36px;
          height: 36px;
        }

        :host([theme="light"]) .btn-theme-toggle {
          background: rgba(0, 0, 0, 0.04);
        }

        .btn-theme-toggle:hover {
          color: var(--primary);
          border-color: var(--primary);
          background: rgba(16, 185, 129, 0.12);
        }

        .theme-icon-sun {
          display: \${isDark ? 'block' : 'none'};
        }

        .theme-icon-moon {
          display: \${isDark ? 'none' : 'block'};
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 9px;
          font-size: 0.84rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          white-space: nowrap;
        }

        .btn-primary {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 2px 10px var(--primary-glow);
        }

        .btn-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
        }

        .btn-outline {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          border: 1px solid var(--border);
        }

        .btn-outline:hover {
          background: rgba(16, 185, 129, 0.12);
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-1px);
        }

        :host([theme="light"]) .btn-outline {
          background: rgba(0, 0, 0, 0.04);
        }

        .btn-text-short {
          display: none;
        }

        .btn-hamburger {
          display: none;
          background: transparent;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
        }

        .btn-hamburger:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        /* Mobile Drawer */
        .mobile-drawer {
          display: none;
          position: fixed;
          top: 60px;
          left: 12px;
          right: 12px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          flex-direction: column;
          gap: 8px;
          z-index: 100000;
        }

        .mobile-drawer.active {
          display: flex;
        }

        .mobile-nav-link {
          color: var(--text);
          text-decoration: none;
          font-size: 0.9rem;
          padding: 10px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.02);
        }

        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: rgba(16, 185, 129, 0.12);
          color: var(--primary);
        }

        @media (max-width: 1400px) {
          .header-inner {
            gap: 0.85rem;
          }
          .nav-menu {
            gap: 0.65rem;
          }
          .nav-link {
            font-size: 0.82rem;
            padding: 5px 8px;
          }
          .btn {
            padding: 6px 11px;
            font-size: 0.82rem;
          }
          .btn-text-full {
            display: none;
          }
          .btn-text-short {
            display: inline;
          }
        }

        @media (max-width: 1240px) {
          .nav-menu {
            display: none;
          }
          .btn-hamburger {
            display: inline-flex;
          }
        }
      </style>

      <header>
        <div class="header-inner">
          <div class="brand-section">
            <a href="/" class="brand" title="InfoAPI Início">
              <img src="/integration/assets/logo-infoapi-white.png" alt="InfoAPI" class="brand-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="brand-text" style="display: none;">
                Info<span>API</span>
              </div>
            </a>
            \${versionOptionsHtml}
          </div>

          <!-- Desktop Nav -->
          <ul class="nav-menu">
            <li><a href="/" class="nav-link">Início</a></li>
            <li><a href="/#funcionalidades" class="nav-link">Funcionalidades</a></li>
            <li><a href="/#arquitetura" class="nav-link">Arquitetura</a></li>
            <li><a href="/#planos" class="nav-link">Planos</a></li>

            <!-- Dropdown Docs -->
            <li class="dropdown" id="docs-dropdown">
              <a href="javascript:void(0)" class="nav-link \${activeDoc === 'swagger' || activeDoc === 'scalar' ? 'active' : ''}">
                <span>Documentação</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </a>
              <div class="dropdown-menu">
                <a href="/docs" class="dropdown-item \${activeDoc === 'swagger' ? 'active' : ''}">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <div>
                    <strong>Swagger UI</strong>
                    <span class="desc">Interface de testes interativos</span>
                  </div>
                </a>
                <a href="/scalar" class="dropdown-item \${activeDoc === 'scalar' ? 'active' : ''}">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  <div>
                    <strong>Scalar Reference</strong>
                    <span class="desc">Documentação moderna de API</span>
                  </div>
                </a>
                <a href="/changelog" class="dropdown-item">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 14 14"></polyline>
                  </svg>
                  <div>
                    <strong>Changelog</strong>
                    <span class="desc">Histórico de versões da API</span>
                  </div>
                </a>
                <a href="/docs/postman" class="dropdown-item" download="infoapi-postman-collection.json">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <div>
                    <strong>Coleção Postman</strong>
                    <span class="desc">Download da coleção oficial</span>
                  </div>
                </a>
              </div>
            </li>

            <!-- Status -->
            <li>
              <a href="/status" class="nav-link" title="Disponibilidade dos Serviços">
                <span class="status-dot"></span>
                <span>Status</span>
              </a>
            </li>

            <!-- Portal do Cliente -->
            <li>
              <a href="/integration/client" class="nav-link" title="Área do Cliente">
                <span>Área do Cliente</span>
              </a>
            </li>
          </ul>

          <div class="header-actions">
            <!-- Botão Seletor de Tema Claro / Escuro (oculto no Swagger) -->
            \${activeDoc !== 'swagger' ? \`
            <button class="btn-theme-toggle" id="theme-toggle-btn" title="Alternar entre tema Claro e Escuro" aria-label="Alternar tema">
              <svg class="theme-icon-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <svg class="theme-icon-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
            \` : ''}

            <a href="/docs/postman" class="btn btn-outline" title="Baixar Postman Collection" download="infoapi-postman-collection.json">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span class="btn-text-full">Baixar Postman</span>
              <span class="btn-text-short">Postman</span>
            </a>

            <a href="/integration/form" class="btn btn-primary" title="Solicitar Credenciais">
              <span>Solicitar Acesso</span>
            </a>
            <button class="btn-hamburger" id="hamburger-btn" aria-label="Menu">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Drawer Mobile -->
      <div class="mobile-drawer" id="mobile-drawer">
        <a href="/" class="mobile-nav-link">Início</a>
        <a href="/#funcionalidades" class="mobile-nav-link">Funcionalidades</a>
        <a href="/#arquitetura" class="mobile-nav-link">Arquitetura</a>
        <a href="/#planos" class="mobile-nav-link">Planos</a>
        <a href="/docs" class="mobile-nav-link \${activeDoc === 'swagger' ? 'active' : ''}">Swagger UI</a>
        <a href="/scalar" class="mobile-nav-link \${activeDoc === 'scalar' ? 'active' : ''}">Scalar Reference</a>
        <a href="/changelog" class="mobile-nav-link">Changelog</a>
        <a href="/docs/postman" class="mobile-nav-link" download="infoapi-postman-collection.json">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Baixar Coleção Postman</span>
        </a>
        <a href="/status" class="mobile-nav-link">Status do Sistema</a>
        <a href="/integration/client" class="mobile-nav-link">Área do Cliente</a>
        \${activeDoc !== 'swagger' ? \`
        <button class="mobile-nav-link" id="mobile-theme-toggle" style="background: transparent; border: none; width: 100%; cursor: pointer;">
          <span>Alternar Tema (Claro / Escuro)</span>
        </button>
        \` : ''}
        <a href="/integration/form" class="btn btn-primary" style="margin-top: 8px;">Solicitar Acesso</a>
      </div>
    \`;
  }

  setupListeners() {
    const shadow = this.shadowRoot;
    const versionSelect = shadow.getElementById('version-select');
    const hamburgerBtn = shadow.getElementById('hamburger-btn');
    const mobileDrawer = shadow.getElementById('mobile-drawer');
    const docsDropdown = shadow.getElementById('docs-dropdown');
    const themeToggleBtn = shadow.getElementById('theme-toggle-btn');
    const mobileThemeToggle = shadow.getElementById('mobile-theme-toggle');

    if (versionSelect) {
      versionSelect.addEventListener('change', (e) => {
        const selectedVal = e.target.value;
        const baseRoute = this.activeDoc === 'scalar' ? '/scalar' : '/docs';
        if (!selectedVal) {
          window.location.href = baseRoute;
        } else {
          window.location.href = \`\${baseRoute}/\${selectedVal}\`;
        }
      });
    }

    if (hamburgerBtn && mobileDrawer) {
      hamburgerBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('active');
      });
    }

    if (docsDropdown) {
      docsDropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 1240) {
          docsDropdown.classList.toggle('open');
        }
      });
    }

    const toggleTheme = () => {
      const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(nextTheme);
      this.render();
      this.setupListeners();
    };

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggle) {
      mobileThemeToggle.addEventListener('click', toggleTheme);
    }
  }
}

if (!customElements.get('info-api-header')) {
  customElements.define('info-api-header', InfoApiHeader);
}
`;
