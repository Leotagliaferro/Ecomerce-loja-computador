class ComponentsManager {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadHeader();
        await this.loadFooter();
        this.highlightActiveMenu();
        this.initHeaderEvents();
    }

    async loadHeader() {
        const headerContainer = document.getElementById('header-container');
        if (!headerContainer) return;

        const headerHTML = `
        <header class="header">
            <nav class="navbar container">
                <div class="nav-container">
                    <a href="index.html" class="logo">
                        <i class="fas fa-microchip"></i>
                        TechHub
                    </a>
                    <div class="nav-links" id="navLinks">
                        <a href="index.html" class="nav-link">Início</a>
                        <a href="produtos.html" class="nav-link">Produtos</a>
                        <a href="carrinho.html" class="nav-link">Carrinho</a>
                        <a href="contato.html" class="nav-link">Contato</a>
                    </div>
                    <div class="nav-icons">
                        <div class="search-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <div class="user-icon" id="userIcon">
                            <i class="fas fa-user"></i>
                            <div class="user-dropdown" id="userDropdown">
                                <a href="login.html" id="loginLink" class="login-btn">Entrar / Cadastrar</a>
                                <div id="userMenu" style="display: none;">
                                    <a href="perfil.html">Meu Perfil</a>
                                    <a href="#" id="logoutBtn">Sair</a>
                                </div>
                            </div>
                        </div>
                        <div class="cart-icon" id="cartIcon">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-count" id="cartCount">0</span>
                        </div>
                        <div class="mobile-menu-toggle" id="mobileMenuToggle">
                            <i class="fas fa-bars"></i>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        `;

        headerContainer.innerHTML = headerHTML;
        this.checkLoginStatus();
    }

    async loadFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (!footerContainer) return;

        const footerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>TechHub</h4>
                    <p>Sua loja especializada em peças de computador com as melhores marcas e preços do mercado.</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Categorias</h4>
                    <ul>
                        <li><a href="produtos.html?cat=Processadores">Processadores</a></li>
                        <li><a href="produtos.html?cat=Placas de Vídeo">Placas de Vídeo</a></li>
                        <li><a href="produtos.html?cat=Memória RAM">Memória RAM</a></li>
                        <li><a href="produtos.html?cat=Armazenamento">Armazenamento</a></li>
                        <li><a href="produtos.html?cat=Placas-mãe">Placas-mãe</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Institucional</h4>
                    <ul>
                        <li><a href="#">Política de Privacidade</a></li>
                        <li><a href="#">Termos de Uso</a></li>
                        <li><a href="#">Trocas e Devoluções</a></li>
                        <li><a href="contato.html">Fale Conosco</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Atendimento</h4>
                    <ul>
                        <li><i class="fas fa-phone"></i> (11) 9999-9999</li>
                        <li><i class="fas fa-envelope"></i> contato@techhub.com</li>
                        <li><i class="fas fa-clock"></i> Seg-Sex: 9h-18h</li>
                        <li><i class="fas fa-map-marker-alt"></i> São Paulo - SP</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 TechHub. Todos os direitos reservados.</p>
            </div>
        </div>
        `;

        footerContainer.innerHTML = footerHTML;
    }

    highlightActiveMenu() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav-link');

        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    initHeaderEvents() {
        
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navLinks = document.getElementById('navLinks');

        if (mobileMenuToggle && navLinks) {
            mobileMenuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }

       
        const userIcon = document.getElementById('userIcon');
        const userDropdown = document.getElementById('userDropdown');

        if (userIcon && userDropdown) {
            userIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                userDropdown.classList.remove('active');
            });
        }

       
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        
        this.updateCartCount();
    }

    checkLoginStatus() {
        const user = JSON.parse(localStorage.getItem('techhub_user'));
        const loginLink = document.getElementById('loginLink');
        const userMenu = document.getElementById('userMenu');

        if (user && loginLink && userMenu) {
            loginLink.style.display = 'none';
            userMenu.style.display = 'block';
            
        }
    }

    logout() {
        localStorage.removeItem('techhub_user');
        window.location.reload();
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const carrinho = JSON.parse(localStorage.getItem('techhub_carrinho') || '[]');
            const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
            cartCount.textContent = total;
            cartCount.style.display = total > 0 ? 'flex' : 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.componentsManager = new ComponentsManager();
});
