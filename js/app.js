
class TechHub {
    constructor() {
        this.apiBase = 'backend';
        this.carrinho = this.carregarCarrinho();
        this.produtos = [];
        this.categorias = [];
        this.init();
    }

    init() {
        this.configurarEventListeners();
        this.carregarCategorias();
        this.carregarProdutos();
        this.atualizarContadorCarrinho();
        this.checkLoginStatus();
    }

    checkLoginStatus() {
        const user = JSON.parse(localStorage.getItem('techhub_user'));
        const navActions = document.querySelector('.nav-actions');

        if (user && navActions) {
         
            const existingBtn = navActions.querySelector('.login-btn');
            if (existingBtn) existingBtn.remove();

            
            if (navActions.querySelector('.user-menu')) return;

           
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <button class="user-btn" onclick="techHub.toggleUserMenu()">
                    <i class="fas fa-user-circle"></i>
                    <span>${user.nome.split(' ')[0]}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-user"></i> Minha Conta
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-box"></i> Meus Pedidos
                    </a>
                    ${user.email === 'admin@techhub.com' ? `
                    <a href="admin.html" class="dropdown-item">
                        <i class="fas fa-cog"></i> Painel Admin
                    </a>
                    ` : ''}
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" onclick="techHub.logout()">
                        <i class="fas fa-sign-out-alt"></i> Sair
                    </a>
                </div>
            `;

            
            const cartIcon = navActions.querySelector('.cart-icon');
            navActions.insertBefore(userMenu, cartIcon);
        } else if (navActions) {
            
            if (!navActions.querySelector('.login-btn') && !navActions.querySelector('.user-menu')) {
                const loginBtn = document.createElement('a');
                loginBtn.href = 'login.html';
                loginBtn.className = 'nav-link login-btn';
                loginBtn.innerHTML = '<i class="fas fa-user"></i> Entrar';
                loginBtn.style.marginRight = '1rem';

                const cartIcon = navActions.querySelector('.cart-icon');
                navActions.insertBefore(loginBtn, cartIcon);
            }
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    logout() {
        localStorage.removeItem('techhub_user');
        window.location.reload();
    }

    configurarEventListeners() {
        
        const cartIcon = document.getElementById('cartIcon');
        const cartFloat = document.getElementById('cartFloat');
        const closeCart = document.getElementById('closeCart');

        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                cartFloat.classList.add('active');
                this.atualizarCarrinhoFloat();
            });
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartFloat.classList.remove('active');
            });
        }

       
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

       
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.assinarNewsletter(e.target);
            });
        }

       
        document.addEventListener('click', (e) => {
            const userMenu = document.querySelector('.user-menu');
            const dropdown = document.getElementById('userDropdown');
            if (userMenu && dropdown && !userMenu.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    async carregarCategorias() {
        try {
            const response = await fetch(`${this.apiBase}/listar_categorias.php`);
            const data = await response.json();
            this.categorias = (data.data && !data.erro) ? data.data : this.getCategoriasDefault();
            this.renderizarCategorias();
            this.preencherFiltroCategorias();
        } catch (error) {
            console.warn('Usando categorias padrão devido a erro:', error);
            this.categorias = this.getCategoriasDefault();
            this.renderizarCategorias();
            this.preencherFiltroCategorias();
        }
    }

    async carregarProdutos() {
      
        try {
            const response = await fetch(`${this.apiBase}/listar_produtos.php`);
            const data = await response.json();
            let produtosBackend = (data.data && !data.erro) ? data.data : [];

            
            const produtosCustom = this.getProdutosCustomizados();

            
            if (produtosBackend.length === 0) {
                produtosBackend = this.getProdutosDefault();
            }

            this.produtos = [...produtosCustom, ...produtosBackend];

           
            if (document.getElementById('produtosGrid')) {
                
                if (!window.produtosManager) {
                    this.renderizarProdutos();
                }
            }
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            this.produtos = [...this.getProdutosCustomizados(), ...this.getProdutosDefault()];
        }
    }

    getProdutosCustomizados() {
        return JSON.parse(localStorage.getItem('techhub_custom_products') || '[]');
    }

    renderizarCategorias() {
        const container = document.getElementById('categoriasGrid');
        if (!container) return;

        container.innerHTML = this.categorias.map(categoria => `
            <div class="categoria-card" onclick="techHub.filtrarPorCategoria('${categoria.nome}')">
                <div class="categoria-icon">
                    <i class="${this.getIconeCategoria(categoria.nome)}"></i>
                </div>
                <h3 class="categoria-nome">${categoria.nome}</h3>
                <p class="categoria-desc">${categoria.descricao || 'Explore nossa seleção'}</p>
            </div>
        `).join('');
    }

    renderizarProdutos(produtos = this.produtos) {
       
        const container = document.getElementById('produtosGrid');
        if (!container) return;

       
    }

    preencherFiltroCategorias() {
        const select = document.getElementById('categoriaFilter');
        if (!select) return;

        
        if (select.options.length > 1) return;

        select.innerHTML = '<option value="">Todas as Categorias</option>' +
            this.categorias.map(categoria =>
                `<option value="${categoria.nome}">${categoria.nome}</option>`
            ).join('');
    }

    filtrarPorCategoria(categoria) {
       
        window.location.href = `index.html#produtos`;
        
        setTimeout(() => {
            const select = document.getElementById('categoriaFilter');
            if (select) {
                select.value = categoria;
                select.dispatchEvent(new Event('change'));
            }
        }, 500);
    }

    
    adicionarAoCarrinho(produtoId) {
        
        let produto = this.produtos.find(p => p.id == produtoId);

        
        if (!produto) {
            const allProducts = [...this.getProdutosCustomizados(), ...this.getProdutosDefault()];
            produto = allProducts.find(p => p.id == produtoId);
        }

        if (!produto) {
            this.mostrarNotificacao('Produto não encontrado!', 'error');
            return;
        }

        const itemExistente = this.carrinho.find(item => item.id == produtoId);

        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            this.carrinho.push({
                id: produto.id,
                nome: produto.nome,
                preco: parseFloat(produto.preco),
                imagem: produto.imagem,
                quantidade: 1
            });
        }

        this.salvarCarrinho();
        this.atualizarContadorCarrinho();
        this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);

        // Atualizar carrinho flutuante se estiver aberto
        const cartFloat = document.getElementById('cartFloat');
        if (cartFloat && cartFloat.classList.contains('active')) {
            this.atualizarCarrinhoFloat();
        }
    }

    removerDoCarrinho(produtoId) {
        this.carrinho = this.carrinho.filter(item => item.id != produtoId);
        this.salvarCarrinho();
        this.atualizarContadorCarrinho();
        this.atualizarCarrinhoFloat();
    }

    atualizarQuantidade(produtoId, quantidade) {
        const item = this.carrinho.find(item => item.id == produtoId);
        if (item) {
            if (quantidade <= 0) {
                this.removerDoCarrinho(produtoId);
            } else {
                item.quantidade = quantidade;
                this.salvarCarrinho();
                this.atualizarContadorCarrinho();
                this.atualizarCarrinhoFloat();
            }
        }
    }

    limparCarrinho() {
        this.carrinho = [];
        this.salvarCarrinho();
        this.atualizarContadorCarrinho();
    }

    salvarCarrinho() {
        localStorage.setItem('techhub_carrinho', JSON.stringify(this.carrinho));
    }

    carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('techhub_carrinho');
        return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    }

    atualizarContadorCarrinho() {
        const count = this.carrinho.reduce((total, item) => total + item.quantidade, 0);
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    atualizarCarrinhoFloat() {
        const container = document.getElementById('cartFloatItems');
        const cartTotal = document.getElementById('cartTotal');

        if (!container) return;

        if (this.carrinho.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                </div>
            `;
            if (cartTotal) cartTotal.textContent = '0,00';
            return;
        }

        container.innerHTML = this.carrinho.map(item => `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}" class="cart-item-imagem" onerror="this.src='https://via.placeholder.com/80x80?text=Item'">
                <div class="cart-item-info">
                    <div class="cart-item-nome">${item.nome}</div>
                    <div class="cart-item-preco">R$ ${this.formatarPreco(item.preco)}</div>
                    <div class="cart-item-quantidade">
                        <button onclick="techHub.atualizarQuantidade('${item.id}', ${item.quantidade - 1})">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="techHub.atualizarQuantidade('${item.id}', ${item.quantidade + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="techHub.removerDoCarrinho('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        const total = this.carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        if (cartTotal) cartTotal.textContent = this.formatarPreco(total);
    }

    // Utilitários
    formatarPreco(preco) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(preco);
    }

    getIconeCategoria(categoria) {
        const icones = {
            'Processadores': 'fas fa-microchip',
            'Placas de Vídeo': 'fas fa-display',
            'Memória RAM': 'fas fa-memory',
            'Armazenamento': 'fas fa-hdd',
            'Placas-mãe': 'fas fa-circuit-board',
            'Fontes': 'fas fa-plug',
            'Gabinetes': 'fas fa-server',
            'Coolers': 'fas fa-fan',
            'Periféricos': 'fas fa-keyboard'
        };
        return icones[categoria] || 'fas fa-box';
    }

    getBadgeProduto(produto) {
        if (produto.estoque <= 5) return 'Últimas!';
        if (produto.preco > 3000) return 'Premium';
        if (produto.novo) return 'Novo';
        return 'Oferta';
    }

    mostrarNotificacao(mensagem, tipo = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        toast.innerHTML = `
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${mensagem}</span>
        `;

        document.body.appendChild(toast);

        
        if (!document.querySelector('style[data-toast]')) {
            const style = document.createElement('style');
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--success-color, #22c55e);
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    z-index: 3000;
                    animation: slideInRight 0.3s ease-out;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .toast.error { background: var(--danger-color, #ef4444); }
                .toast.info { background: var(--primary-color, #2563eb); }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            style.setAttribute('data-toast', 'true');
            document.head.appendChild(style);
        }

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Dados padrão
    getCategoriasDefault() {
        return [
            { id: '1', nome: 'Processadores', descricao: 'CPUs de alta performance' },
            { id: '2', nome: 'Placas de Vídeo', descricao: 'GPUs para gaming e trabalho' },
            { id: '3', nome: 'Memória RAM', descricao: 'Memórias DDR4 e DDR5' },
            { id: '4', nome: 'Armazenamento', descricao: 'SSDs e HDs' },
            { id: '5', nome: 'Placas-mãe', descricao: 'Motherboards' },
            { id: '6', nome: 'Gabinetes', descricao: 'Cases e Torres' },
            { id: '7', nome: 'Fontes', descricao: 'PSUs' }
        ];
    }

    getProdutosDefault() {
        return [
            {
                id: '1',
                nome: 'Intel Core i9-13900K',
                descricao: 'Processador de 24 núcleos para máxima performance',
                preco: 3499.99,
                categoria: 'Processadores',
                imagem: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddbb56?auto=format&fit=crop&q=80&w=800',
                estoque: 15,
                marca: 'Intel',
                modelo: 'i9-13900K'
            },
            {
                id: '2',
                nome: 'NVIDIA RTX 4080',
                descricao: 'Placa de vídeo de última geração para 4K gaming',
                preco: 8999.99,
                categoria: 'Placas de Vídeo',
                imagem: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800',
                estoque: 8,
                marca: 'NVIDIA',
                modelo: 'RTX 4080'
            },
            {
                id: '3',
                nome: 'Corsair Vengeance 32GB',
                descricao: 'Kit memória DDR5 5600MHz RGB',
                preco: 1299.99,
                categoria: 'Memória RAM',
                imagem: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800',
                estoque: 25,
                marca: 'Corsair',
                modelo: 'Vengeance RGB'
            },
            {
                id: '4',
                nome: 'Samsung 980 PRO 1TB',
                descricao: 'SSD NVMe PCIe 4.0 ultra rápido',
                preco: 799.99,
                categoria: 'Armazenamento',
                imagem: 'https://images.unsplash.com/photo-1628557044797-f21a17b96c89?auto=format&fit=crop&q=80&w=800',
                estoque: 30,
                marca: 'Samsung',
                modelo: '980 PRO'
            },
            {
                id: '5',
                nome: 'ASUS ROG Strix Z790-E',
                descricao: 'Placa-mãe premium para Intel 13ª geração',
                preco: 2499.99,
                categoria: 'Placas-mãe',
                imagem: 'https://images.unsplash.com/photo-1555618568-9b196579532d?auto=format&fit=crop&q=80&w=800',
                estoque: 12,
                marca: 'ASUS',
                modelo: 'ROG Strix Z790-E'
            },
            {
                id: '6',
                nome: 'AMD Ryzen 9 7950X',
                descricao: 'Processador de 16 núcleos para creators',
                preco: 3299.99,
                categoria: 'Processadores',
                imagem: 'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&q=80&w=800',
                estoque: 10,
                marca: 'AMD',
                modelo: 'Ryzen 9 7950X'
            }
        ];
    }
}

// Inicializar o sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.techHub = new TechHub();
});