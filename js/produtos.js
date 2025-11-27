// Sistema de Gerenciamento de Produtos
class ProdutosManager {
    constructor() {
        this.API_LISTAGEM = 'backend/listar_produtos.php';
        this.produtos = [];
        this.categorias = [];
        this.init();
    }

    init() {
        this.carregarProdutos();
        this.carregarCategorias();
        this.configurarEventListeners();
    }

    configurarEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const categoriaFilter = document.getElementById('categoriaFilter');
        const precoMin = document.getElementById('precoMin');
        const precoMax = document.getElementById('precoMax');
        const ordenarSelect = document.getElementById('ordenarSelect');
        const limparFiltrosBtn = document.getElementById('limparFiltros');

        if (searchInput) searchInput.addEventListener('input', () => this.aplicarFiltros());
        if (categoriaFilter) categoriaFilter.addEventListener('change', () => this.aplicarFiltros());
        if (precoMin) precoMin.addEventListener('input', () => this.aplicarFiltros());
        if (precoMax) precoMax.addEventListener('input', () => this.aplicarFiltros());
        if (ordenarSelect) ordenarSelect.addEventListener('change', () => this.aplicarFiltros());
        if (limparFiltrosBtn) limparFiltrosBtn.addEventListener('click', () => this.limparFiltros());
    }

    async carregarProdutos() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'block';

        try {
            // Tenta carregar do backend
            const response = await fetch(this.API_LISTAGEM);
            const data = await response.json();

            // Se o backend retornar poucos produtos (ex: só o default) ou der erro, usa os estáticos
            // A pedido do usuário, vamos priorizar os dados estáticos para "popular" a loja
            const produtosBackend = (data.data && !data.erro) ? data.data : [];
            const produtosEstaticos = this.getProdutosEstaticos();

            // Combina os produtos, dando preferência aos estáticos para garantir a vitrine cheia
            // Se houver IDs duplicados, o backend vence (ou poderíamos fazer o contrário)
            // Aqui, vamos simplesmente usar os estáticos se o backend tiver menos de 2 produtos (o que indica que só tem o default ou está vazio)
            if (produtosBackend.length < 2) {
                console.log('Usando produtos estáticos para popular a loja.');
                this.produtos = produtosEstaticos;
            } else {
                this.produtos = produtosBackend;
            }

        } catch (error) {
            console.error('Erro ao conectar com backend, usando dados estáticos:', error);
            this.produtos = this.getProdutosEstaticos();
        } finally {
            if (loading) loading.style.display = 'none';
            this.renderizarProdutos();
            this.atualizarEstatisticas();

            // Sempre extrair categorias dos produtos atuais para garantir que o filtro funcione
            this.extrairCategoriasDosProdutos();
        }
    }

    async carregarCategorias() {
        const CATEGORIAS_API = 'backend/listar_categorias.php';
        try {
            const response = await fetch(CATEGORIAS_API);
            const data = await response.json();
            if (!data.erro && data.data && data.data.length > 0) {
                this.categorias = data.data;
                this.preencherFiltroCategorias();
            }
        } catch (error) {
            console.warn('Erro ao carregar categorias, serão extraídas dos produtos.');
        }
    }

    extrairCategoriasDosProdutos() {
        const categoriasUnicas = [...new Set(this.produtos.map(p => p.categoria))];
        this.categorias = categoriasUnicas.map((nome, index) => ({ id: index + 1, nome }));
        this.preencherFiltroCategorias();
    }

    renderizarProdutos(produtos = this.produtos) {
        const container = document.getElementById('produtosGrid');
        const emptyState = document.getElementById('emptyState');
        const resultCount = document.getElementById('resultCount');

        if (!container) return;

        if (produtos.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            if (resultCount) resultCount.textContent = '0 produtos encontrados';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (resultCount) resultCount.textContent = `${produtos.length} produto${produtos.length !== 1 ? 's' : ''} encontrado${produtos.length !== 1 ? 's' : ''}`;

        container.innerHTML = produtos.map(produto => `
            <div class="produto-card fade-in">
                <div class="produto-imagem-container">
                    <img src="${this.getImagemProduto(produto)}" alt="${produto.nome}" class="produto-imagem" 
                        onerror="this.src='https://via.placeholder.com/300x200?text=Produto'">
                    <div class="produto-overlay">
                        <a href="produto.html?id=${produto.id}" class="btn-overlay">
                            <i class="fas fa-eye"></i>
                        </a>
                        <button class="btn-overlay" onclick="produtosManager.adicionarAoCarrinho('${produto.id}')">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="produto-info">
                    <div class="produto-header">
                        <span class="produto-categoria">${produto.categoria}</span>
                        <span class="produto-badge ${this.getBadgeClass(produto)}">${this.getBadgeText(produto)}</span>
                    </div>
                    
                    <h3 class="produto-nome">${produto.nome}</h3>
                    <p class="produto-desc">${produto.descricao}</p>
                    
                    <div class="produto-detalhes">
                        <div class="produto-marca">${produto.marca || 'TechHub'} • ${produto.modelo || 'Standard'}</div>
                        <div class="produto-estoque">
                            <i class="fas fa-box"></i>
                            ${produto.estoque} unidades
                        </div>
                    </div>
                    
                    <div class="produto-preco-container">
                        <div class="produto-preco">
                            R$ ${this.formatarPreco(produto.preco)}
                        </div>
                        <div class="produto-parcelamento">
                            ou 10x de R$ ${this.formatarPreco(produto.preco / 10)}
                        </div>
                    </div>
                    
                    <div class="produto-actions">
                        <a href="produto.html?id=${produto.id}" class="btn-primary">
                            <i class="fas fa-eye"></i> Ver Detalhes
                        </a>
                        <button class="btn-secondary" onclick="produtosManager.comprarAgora('${produto.id}')">
                            <i class="fas fa-bolt"></i> Comprar Agora
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getImagemProduto(produto) {
        
        if (produto.imagem && (produto.imagem.startsWith('http') || produto.imagem.startsWith('data:'))) {
            return produto.imagem;
        }
     
        return `uploads/${produto.imagem}`;
    }

    aplicarFiltros() {
        const busca = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const categoria = document.getElementById('categoriaFilter')?.value || '';
        const precoMin = parseFloat(document.getElementById('precoMin')?.value || 0);
        const precoMax = parseFloat(document.getElementById('precoMax')?.value || Infinity);
        const ordenar = document.getElementById('ordenarSelect')?.value || 'nome';

        let produtosFiltrados = this.produtos.filter(produto => {
            const matchBusca = !busca ||
                produto.nome.toLowerCase().includes(busca) ||
                produto.descricao.toLowerCase().includes(busca) ||
                produto.categoria.toLowerCase().includes(busca) ||
                (produto.marca || '').toLowerCase().includes(busca) ||
                (produto.modelo || '').toLowerCase().includes(busca);

            const matchCategoria = !categoria || produto.categoria === categoria;
            const matchPreco = produto.preco >= precoMin && (precoMax === Infinity || produto.preco <= precoMax);

            return matchBusca && matchCategoria && matchPreco;
        });

        // Ordenar
        switch (ordenar) {
            case 'preco_menor':
                produtosFiltrados.sort((a, b) => a.preco - b.preco);
                break;
            case 'preco_maior':
                produtosFiltrados.sort((a, b) => b.preco - a.preco);
                break;
            case 'nome':
                produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case 'estoque':
                produtosFiltrados.sort((a, b) => b.estoque - a.estoque);
                break;
            case 'mais_vendidos':
                produtosFiltrados.sort((a, b) => (b.vendas || 0) - (a.vendas || 0));
                break;
        }

        this.renderizarProdutos(produtosFiltrados);
    }

    limparFiltros() {
        const inputs = ['searchInput', 'categoriaFilter', 'precoMin', 'precoMax', 'ordenarSelect'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        this.aplicarFiltros();
        this.mostrarNotificacao('Filtros limpos!', 'info');
    }

    preencherFiltroCategorias() {
        const select = document.getElementById('categoriaFilter');
        if (!select) return;

        select.innerHTML = '<option value="">Todas as Categorias</option>' +
            this.categorias.map(cat => `<option value="${cat.nome}">${cat.nome}</option>`).join('');
    }

    getBadgeClass(produto) {
        if (produto.estoque <= 5) return 'badge-danger';
        if (produto.estoque <= 10) return 'badge-warning';
        if (produto.preco > 3000) return 'badge-premium';
        return 'badge-success';
    }

    getBadgeText(produto) {
        if (produto.estoque <= 5) return 'Últimas!';
        if (produto.estoque <= 10) return 'Acabando';
        if (produto.preco > 3000) return 'Premium';
        return 'Disponível';
    }

    adicionarAoCarrinho(produtoId) {
        const produto = this.produtos.find(p => p.id == produtoId); // == para aceitar string/number
        if (!produto) {
            this.mostrarNotificacao('Produto não encontrado!', 'error');
            return;
        }

        if (produto.estoque <= 0) {
            this.mostrarNotificacao('Produto sem estoque!', 'warning');
            return;
        }

        let carrinho = JSON.parse(localStorage.getItem('techhub_carrinho') || '[]');
        const itemExistente = carrinho.find(item => item.id == produtoId);

        if (itemExistente) {
            if (itemExistente.quantidade < produto.estoque) {
                itemExistente.quantidade += 1;
            } else {
                this.mostrarNotificacao('Quantidade máxima atingida!', 'warning');
                return;
            }
        } else {
            carrinho.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: this.getImagemProduto(produto),
                quantidade: 1
            });
        }

        localStorage.setItem('techhub_carrinho', JSON.stringify(carrinho));
        this.atualizarContadorCarrinho();
        this.mostrarNotificacao(`${produto.nome} adicionado!`);
    }

    comprarAgora(produtoId) {
        this.adicionarAoCarrinho(produtoId);
        setTimeout(() => window.location.href = 'checkout.html', 500);
    }

    atualizarContadorCarrinho() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const carrinho = JSON.parse(localStorage.getItem('techhub_carrinho') || '[]');
            const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
            cartCount.textContent = total;
            cartCount.style.display = total > 0 ? 'flex' : 'none';
        }
    }

    atualizarEstatisticas() {
        const statsContainer = document.getElementById('estatisticas');
        if (!statsContainer) return;
        // Lógica de estatísticas (opcional para a página de produtos)
    }

    mostrarNotificacao(mensagem, tipo = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        toast.innerHTML = `<i class="fas fa-${tipo === 'success' ? 'check-circle' : 'info-circle'}"></i><span>${mensagem}</span>`;
        document.body.appendChild(toast);

        // Estilos inline para garantir que funcione
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: ${tipo === 'success' ? '#10B981' : (tipo === 'error' ? '#EF4444' : '#3B82F6')};
            color: white; padding: 1rem; border-radius: 8px;
            display: flex; align-items: center; gap: 0.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    formatarPreco(preco) {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(preco);
    }

    getProdutosEstaticos() {
        return [
            {
                id: 1,
                nome: 'Processador Intel Core i9-13900K',
                descricao: '24 núcleos, 32 threads, até 5.8GHz. O processador definitivo para jogos e criação.',
                preco: 3899.90,
                categoria: 'Processadores',
                imagem: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddbb56?auto=format&fit=crop&q=80&w=800',
                estoque: 15,
                marca: 'Intel',
                modelo: 'i9-13900K'
            },
            {
                id: 2,
                nome: 'Placa de Vídeo RTX 4090 ROG Strix',
                descricao: '24GB GDDR6X, Ray Tracing, DLSS 3.0. Desempenho extremo para 4K.',
                preco: 14999.00,
                categoria: 'Placas de Vídeo',
                imagem: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800',
                estoque: 3,
                marca: 'ASUS',
                modelo: 'ROG Strix'
            },
            {
                id: 3,
                nome: 'Memória RAM Corsair Dominator 32GB',
                descricao: 'DDR5 6000MHz RGB. Performance e estilo para seu setup.',
                preco: 1299.90,
                categoria: 'Memória RAM',
                imagem: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800',
                estoque: 25,
                marca: 'Corsair',
                modelo: 'Dominator Platinum'
            },
            {
                id: 4,
                nome: 'SSD NVMe Samsung 990 PRO 2TB',
                descricao: 'Leitura até 7450MB/s. Velocidade insana para carregar tudo instantaneamente.',
                preco: 1599.00,
                categoria: 'Armazenamento',
                imagem: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800',
                estoque: 40,
                marca: 'Samsung',
                modelo: '990 PRO'
            },
            {
                id: 5,
                nome: 'Placa Mãe Z790 Aorus Master',
                descricao: 'Suporte a DDR5, PCIe 5.0, Wi-Fi 6E. A base perfeita para seu PC high-end.',
                preco: 4599.90,
                categoria: 'Placas-mãe',
                imagem: 'https://images.unsplash.com/photo-1555618568-9b196579532d?auto=format&fit=crop&q=80&w=800',
                estoque: 8,
                marca: 'Gigabyte',
                modelo: 'Aorus Master'
            },
            {
                id: 6,
                nome: 'Processador AMD Ryzen 9 7950X3D',
                descricao: '16 núcleos, Cache 3D V-Cache. O rei dos jogos.',
                preco: 4299.00,
                categoria: 'Processadores',
                imagem: 'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&q=80&w=800',
                estoque: 12,
                marca: 'AMD',
                modelo: 'Ryzen 9'
            },
            {
                id: 7,
                nome: 'Gabinete Lian Li O11 Dynamic Evo',
                descricao: 'Design modular, vidro temperado, fluxo de ar otimizado.',
                preco: 1199.90,
                categoria: 'Gabinetes',
                imagem: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800',
                estoque: 20,
                marca: 'Lian Li',
                modelo: 'O11 Dynamic'
            },
            {
                id: 8,
                nome: 'Fonte Corsair RM1000x Shift',
                descricao: '1000W 80 Plus Gold, Full Modular, padrão ATX 3.0.',
                preco: 1399.90,
                categoria: 'Fontes',
                imagem: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800',
                estoque: 18,
                marca: 'Corsair',
                modelo: 'RM1000x'
            },
            
        ];
    }
}

// Inicializar
let produtosManager;
document.addEventListener('DOMContentLoaded', () => {
    produtosManager = new ProdutosManager();
});
