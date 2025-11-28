// Sistema de Gerenciamento de Produtos
class ProdutosManager {
    constructor() {
        this.produtos = [];
        this.init();
    }

    init() {
        
        if (window.techHub) {
            this.carregarProdutos();
        } else {
            
            setTimeout(() => this.init(), 100);
        }
        this.configurarEventListeners();
    }

    configurarEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const categoriaFilter = document.getElementById('categoriaFilter');
        const ordenarSelect = document.getElementById('ordenarSelect');
        const limparFiltrosBtn = document.getElementById('limparFiltros');

        if (searchInput) searchInput.addEventListener('input', () => this.aplicarFiltros());
        if (categoriaFilter) categoriaFilter.addEventListener('change', () => this.aplicarFiltros());
        if (ordenarSelect) ordenarSelect.addEventListener('change', () => this.aplicarFiltros());
        if (limparFiltrosBtn) limparFiltrosBtn.addEventListener('click', () => this.limparFiltros());
    }

    async carregarProdutos() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'block';

        try {
            
            await window.techHub.carregarProdutos();
            this.produtos = window.techHub.produtos;

            this.renderizarProdutos();
            this.preencherFiltroCategorias();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        } finally {
            if (loading) loading.style.display = 'none';
        }
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
                    <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem" 
                        onerror="this.src='https://via.placeholder.com/300x300?text=Produto'">
                    <div class="produto-overlay">
                        <a href="produto.html?id=${produto.id}" class="btn-overlay">
                            <i class="fas fa-eye"></i>
                        </a>
                        <button class="btn-overlay" onclick="techHub.adicionarAoCarrinho('${produto.id}')">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                    <span class="produto-badge ${this.getBadgeClass(produto)}">${techHub.getBadgeProduto(produto)}</span>
                </div>
                
                <div class="produto-info">
                    <div class="produto-header">
                        <span class="produto-categoria">${produto.categoria}</span>
                    </div>
                    
                    <h3 class="produto-nome">${produto.nome}</h3>
                    <p class="produto-desc">${produto.descricao}</p>
                    
                    <div class="produto-detalhes">
                        <div class="produto-marca">${produto.marca || 'TechHub'}</div>
                        <div class="produto-estoque">
                            <i class="fas fa-box"></i>
                            ${produto.estoque} un.
                        </div>
                    </div>
                    
                    <div class="produto-preco-container">
                        <div class="produto-preco">
                            R$ ${techHub.formatarPreco(produto.preco)}
                        </div>
                        <div class="produto-parcelamento">
                            10x de R$ ${techHub.formatarPreco(produto.preco / 10)}
                        </div>
                    </div>
                    
                    <div class="produto-actions">
                        <a href="produto.html?id=${produto.id}" class="btn-secondary">
                            <i class="fas fa-eye"></i> Detalhes
                        </a>
                        <button class="btn-primary" onclick="techHub.adicionarAoCarrinho('${produto.id}')">
                            <i class="fas fa-shopping-bag"></i> Comprar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    aplicarFiltros() {
        const busca = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const categoria = document.getElementById('categoriaFilter')?.value || '';
        const ordenar = document.getElementById('ordenarSelect')?.value || 'nome';

        let produtosFiltrados = this.produtos.filter(produto => {
            const matchBusca = !busca ||
                produto.nome.toLowerCase().includes(busca) ||
                produto.descricao.toLowerCase().includes(busca) ||
                produto.categoria.toLowerCase().includes(busca) ||
                (produto.marca || '').toLowerCase().includes(busca);

            const matchCategoria = !categoria || produto.categoria === categoria;

            return matchBusca && matchCategoria;
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
            case 'mais_vendidos':
                produtosFiltrados.sort((a, b) => (b.vendas || 0) - (a.vendas || 0));
                break;
        }

        this.renderizarProdutos(produtosFiltrados);
    }

    limparFiltros() {
        const inputs = ['searchInput', 'categoriaFilter', 'ordenarSelect'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        this.aplicarFiltros();
        techHub.mostrarNotificacao('Filtros limpos!', 'info');
    }

    preencherFiltroCategorias() {
        
   
    }

    getBadgeClass(produto) {
        if (produto.estoque <= 5) return 'badge-danger';
        if (produto.preco > 3000) return 'badge-premium';
        if (produto.novo) return 'badge-success';
        return 'badge-warning';
    }
}

// Inicializar
let produtosManager;
document.addEventListener('DOMContentLoaded', () => {
    produtosManager = new ProdutosManager();
});
