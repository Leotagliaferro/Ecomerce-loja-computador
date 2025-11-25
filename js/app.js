// Sistema de E-commerce TechHub
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
            // Remove existing login button if any
            const existingBtn = navActions.querySelector('.login-btn');
            if (existingBtn) existingBtn.remove();

            // Add user menu
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
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" onclick="techHub.logout()">
                        <i class="fas fa-sign-out-alt"></i> Sair
                    </a>
                </div>
            `;

            // Insert before cart icon
            const cartIcon = navActions.querySelector('.cart-icon');
            navActions.insertBefore(userMenu, cartIcon);
        } else if (navActions) {
            // Add login button if not logged in
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
        // Carrinho flutuante
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

        // Menu mobile
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Newsletter
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.assinarNewsletter(e.target);
            });
        }

        // Filtros
        const searchInput = document.getElementById('searchInput');
        const categoriaFilter = document.getElementById('categoriaFilter');
        const ordenarSelect = document.getElementById('ordenarSelect');

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filtrarProdutos();
            });
        }

        if (categoriaFilter) {
            categoriaFilter.addEventListener('change', () => {
                this.filtrarProdutos();
            });
        }

        if (ordenarSelect) {
            ordenarSelect.addEventListener('change', () => {
                this.ordenarProdutos();
            });
        }
    }

    async carregarCategorias() {
        try {
            const response = await fetch(`${this.apiBase}/categorias`);
            const data = await response.json();
            this.categorias = data.data || [];
            this.renderizarCategorias();
            this.preencherFiltroCategorias();
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            this.categorias = this.getCategoriasDefault();
            this.renderizarCategorias();
            this.preencherFiltroCategorias();
        }
    }

    async carregarProdutos() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'block';

        try {
            const response = await fetch(`${this.apiBase}/listar_produtos.php`);
            const data = await response.json();
            this.produtos = data.data || [];

            if (this.produtos.length === 0) {
                this.produtos = this.getProdutosDefault();
            }

            this.renderizarProdutos();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            this.produtos = this.getProdutosDefault();
            this.renderizarProdutos();
        } finally {
            if (loading) loading.style.display = 'none';
        }
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
                <p class="categoria-desc">${categoria.descricao}</p>
            </div>
        `).join('');
    }

    renderizarProdutos(produtos = this.produtos) {
        const container = document.getElementById('produtosGrid');
        const emptyState = document.getElementById('emptyState');

        if (!container) return;

        if (produtos.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        container.innerHTML = produtos.map(produto => `
            <div class="produto-card fade-in">
                <div class="produto-badge">${this.getBadgeProduto(produto)}</div>
                <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Produto'">
                <div class="produto-info">
                    <span class="produto-categoria">${produto.categoria}</span>
                    <h3 class="produto-nome">${produto.nome}</h3>
                    <p class="produto-desc">${produto.descricao}</p>
                    <div class="produto-preco">
                        R$ ${this.formatarPreco(produto.preco)}
                        <span class="parcela">ou 10x de R$ ${this.formatarPreco(produto.preco / 10)}</span>
                    </div>
                    <div class="produto-actions">
                        <a href="produto.html?id=${produto.id}" class="btn-secondary">
                            <i class="fas fa-eye"></i>
                        </a>
                        <button class="btn-primary" onclick="techHub.adicionarAoCarrinho('${produto.id}')">
                            <i class="fas fa-cart-plus"></i> Comprar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    preencherFiltroCategorias() {
        const select = document.getElementById('categoriaFilter');
        if (!select) return;

        select.innerHTML = '<option value="">Todas as Categorias</option>' +
            this.categorias.map(categoria =>
                `<option value="${categoria.nome}">${categoria.nome}</option>`
            ).join('');
    }

    filtrarProdutos() {
        const busca = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const categoria = document.getElementById('categoriaFilter')?.value || '';

        let produtosFiltrados = this.produtos;

        if (busca) {
            produtosFiltrados = produtosFiltrados.filter(produto =>
                produto.nome.toLowerCase().includes(busca) ||
                produto.descricao.toLowerCase().includes(busca) ||
                produto.categoria.toLowerCase().includes(busca)
            );
        }

        if (categoria) {
            produtosFiltrados = produtosFiltrados.filter(produto =>
                produto.categoria === categoria
            );
        }

        this.renderizarProdutos(produtosFiltrados);
    }

    ordenarProdutos() {
        const ordenar = document.getElementById('ordenarSelect')?.value || 'nome';
        let produtosOrdenados = [...this.produtos];

        switch (ordenar) {
            case 'preco_menor':
                produtosOrdenados.sort((a, b) => a.preco - b.preco);
                break;
            case 'preco_maior':
                produtosOrdenados.sort((a, b) => b.preco - a.preco);
                break;
            case 'nome':
                produtosOrdenados.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case 'mais_vendidos':
                // Implementar lógica de mais vendidos
                produtosOrdenados.sort((a, b) => (b.vendas || 0) - (a.vendas || 0));
                break;
        }

        this.renderizarProdutos(produtosOrdenados);
    }

    filtrarPorCategoria(categoria) {
        const select = document.getElementById('categoriaFilter');
        if (select) {
            select.value = categoria;
            this.filtrarProdutos();
        }
    }

    // Sistema de Carrinho
    adicionarAoCarrinho(produtoId) {
        const produto = this.produtos.find(p => p.id === produtoId);
        if (!produto) {
            alert('Produto não encontrado!');
            return;
        }

        const itemExistente = this.carrinho.find(item => item.id === produtoId);

        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            this.carrinho.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                quantidade: 1
            });
        }

        this.salvarCarrinho();
        this.atualizarContadorCarrinho();
        this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);

        // Atualizar carrinho flutuante se estiver aberto
        const cartFloat = document.getElementById('cartFloat');
        if (cartFloat.classList.contains('active')) {
            this.atualizarCarrinhoFloat();
        }
    }

    removerDoCarrinho(produtoId) {
        this.carrinho = this.carrinho.filter(item => item.id !== produtoId);
        this.salvarCarrinho();
        this.atualizarContadorCarrinho();
        this.atualizarCarrinhoFloat();
    }

    atualizarQuantidade(produtoId, quantidade) {
        const item = this.carrinho.find(item => item.id === produtoId);
        if (item) {
            if (quantidade <= 0) {
                this.removerDoCarrinho(produtoId);
            } else {
                item.quantidade = quantidade;
                this.salvarCarrinho();
                this.atualizarContadorCarrinho();
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
                <img src="${item.imagem}" alt="${item.nome}" class="cart-item-imagem">
                <div class="cart-item-info">
                    <div class="cart-item-nome">${item.nome}</div>
                    <div class="cart-item-preco">R$ ${this.formatarPreco(item.preco)}</div>
                    <div class="cart-item-quantidade">
                        <button onclick="techHub.atualizarQuantidade('${item.id}', ${item.quantidade - 1})">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="techHub.atualizarQuantidade('${item.id}', ${item.quantidade + 1})">+</button>
                    </div>
                </div>
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
            'Coolers': 'fas fa-fan'
        };
        return icones[categoria] || 'fas fa-microchip';
    }

    getBadgeProduto(produto) {
        // Lógica para determinar o badge do produto
        if (produto.estoque <= 5) return 'Últimas!';
        if (produto.preco > 2000) return 'Premium';
        return 'Novo';
    }

    mostrarNotificacao(mensagem) {
        // Criar notificação toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${mensagem}</span>
        `;

        document.body.appendChild(toast);

        // Adicionar estilos para o toast
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 3000;
                animation: slideInRight 0.3s ease-out;
                box-shadow: var(--shadow-lg);
            }
            
            .toast i {
                font-size: 1.25rem;
            }
        `;

        if (!document.querySelector('style[data-toast]')) {
            style.setAttribute('data-toast', 'true');
            document.head.appendChild(style);
        }

        // Remover toast após 3 segundos
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    assinarNewsletter(form) {
        const email = form.querySelector('input[type="email"]').value;

        // Simular envio do email
        const button = form.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Enviando...';
        button.disabled = true;

        setTimeout(() => {
            this.mostrarNotificacao('Obrigado por assinar nossa newsletter!');
            form.reset();
            button.textContent = originalText;
            button.disabled = false;
        }, 1500);
    }

    // Dados padrão caso a API não esteja disponível
    getCategoriasDefault() {
        return [
            { id: '1', nome: 'Processadores', descricao: 'CPUs de alta performance', imagem: '' },
            { id: '2', nome: 'Placas de Vídeo', descricao: 'GPUs para gaming e trabalho', imagem: '' },
            { id: '3', nome: 'Memória RAM', descricao: 'Memórias DDR4 e DDR5', imagem: '' },
            { id: '4', nome: 'Armazenamento', descricao: 'SSDs e HDs', imagem: '' },
            { id: '5', nome: 'Placas-mãe', descricao: 'Motherboards', imagem: '' }
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
                imagem: 'https://via.placeholder.com/300x200?text=Intel+i9',
                estoque: 15,
                especificacoes: '24 núcleos, 32 threads, 5.8GHz',
                marca: 'Intel',
                modelo: 'i9-13900K'
            },
            {
                id: '2',
                nome: 'NVIDIA RTX 4080',
                descricao: 'Placa de vídeo de última geração para 4K gaming',
                preco: 8999.99,
                categoria: 'Placas de Vídeo',
                imagem: 'https://via.placeholder.com/300x200?text=RTX+4080',
                estoque: 8,
                especificacoes: '16GB GDDR6X, Ray Tracing, DLSS 3',
                marca: 'NVIDIA',
                modelo: 'RTX 4080'
            },
            {
                id: '3',
                nome: 'Corsair Vengeance 32GB',
                descricao: 'Kit memória DDR5 5600MHz RGB',
                preco: 1299.99,
                categoria: 'Memória RAM',
                imagem: 'https://via.placeholder.com/300x200?text=Corsair+RAM',
                estoque: 25,
                especificacoes: '32GB (2x16GB), DDR5, 5600MHz, RGB',
                marca: 'Corsair',
                modelo: 'Vengeance RGB'
            },
            {
                id: '4',
                nome: 'Samsung 980 PRO 1TB',
                descricao: 'SSD NVMe PCIe 4.0 ultra rápido',
                preco: 799.99,
                categoria: 'Armazenamento',
                imagem: 'https://via.placeholder.com/300x200?text=Samsung+980+PRO',
                estoque: 30,
                especificacoes: '1TB, NVMe, PCIe 4.0, 7000MB/s',
                marca: 'Samsung',
                modelo: '980 PRO'
            },
            {
                id: '5',
                nome: 'ASUS ROG Strix Z790-E',
                descricao: 'Placa-mãe premium para Intel 13ª geração',
                preco: 2499.99,
                categoria: 'Placas-mãe',
                imagem: 'https://via.placeholder.com/300x200?text=ASUS+ROG',
                estoque: 12,
                especificacoes: 'Socket LGA1700, DDR5, WiFi 6E',
                marca: 'ASUS',
                modelo: 'ROG Strix Z790-E'
            },
            {
                id: '6',
                nome: 'AMD Ryzen 9 7950X',
                descricao: 'Processador de 16 núcleos para creators',
                preco: 3299.99,
                categoria: 'Processadores',
                imagem: 'https://via.placeholder.com/300x200?text=Ryzen+9',
                estoque: 10,
                especificacoes: '16 núcleos, 32 threads, 5.7GHz',
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