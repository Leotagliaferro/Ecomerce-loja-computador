// Sistema de Gerenciamento de Produtos
class ProdutosManager {
    constructor() {
        // ⚠️ CORREÇÃO CRÍTICA: Aponta diretamente para o script de listagem
        this.API_LISTAGEM = 'http://localhost/ecommerce/backend/listar_produtos.php'; 
        
        this.produtos = [];
        this.categorias = [];
        this.init();
    }

    init() {
        this.carregarProdutos();
        this.carregarCategorias(); // Se a listagem de categorias for necessária
        this.configurarEventListeners();
    }

    configurarEventListeners() {
        // ... (Seu código de listeners para filtros) ...
        const searchInput = document.getElementById('searchInput');
        const categoriaFilter = document.getElementById('categoriaFilter');
        const precoMin = document.getElementById('precoMin');
        const precoMax = document.getElementById('precoMax');
        const ordenarSelect = document.getElementById('ordenarSelect');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.aplicarFiltros());
        }

        if (categoriaFilter) {
            categoriaFilter.addEventListener('change', () => this.aplicarFiltros());
        }

        if (precoMin) {
            precoMin.addEventListener('input', () => this.aplicarFiltros());
        }

        if (precoMax) {
            precoMax.addEventListener('input', () => this.aplicarFiltros());
        }

        if (ordenarSelect) {
            ordenarSelect.addEventListener('change', () => this.aplicarFiltros());
        }

        const limparFiltrosBtn = document.getElementById('limparFiltros');
        if (limparFiltrosBtn) {
            limparFiltrosBtn.addEventListener('click', () => this.limparFiltros());
        }
    }

    async carregarProdutos() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'block';

        try {
            // CORREÇÃO: Chama o script PHP diretamente
            const response = await fetch(this.API_LISTAGEM);
            const data = await response.json();
            
            // Verifica se há erro no JSON retornado
            if (data.erro) {
                console.error('Erro no backend ao carregar produtos:', data.details);
                this.produtos = this.getProdutosDefault();
            } else {
                this.produtos = data.data || [];
            }
            
            // Fallback para dados padrão se o DB estiver vazio ou der erro
            if (this.produtos.length === 0) {
                 // **Comente ou remova a linha abaixo** se não quiser que dados fake apareçam:
                this.produtos = this.getProdutosDefault(); 
            }
            
            this.renderizarProdutos();
            this.atualizarEstatisticas();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            this.produtos = this.getProdutosDefault();
            this.renderizarProdutos();
            this.atualizarEstatisticas();
        } finally {
            if (loading) loading.style.display = 'none';
        }
    }

    async carregarCategorias() {
        // ATENÇÃO: Se suas categorias estiverem na tabela 'categorias', 
        // crie um script PHP para listá-las (ex: backend/listar_categorias.php)
        const CATEGORIAS_API = 'http://localhost/ecommerce/backend/listar_categorias.php';
        
        try {
            const response = await fetch(CATEGORIAS_API);
            const data = await response.json();
            
            if (data.erro) {
                console.error('Erro ao carregar categorias do backend:', data.details);
                this.categorias = this.getCategoriasDefault();
            } else {
                this.categorias = data.data || [];
            }
            
            if (this.categorias.length === 0) {
                this.categorias = this.getCategoriasDefault();
            }

            this.preencherFiltroCategorias();
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            this.categorias = this.getCategoriasDefault();
            this.preencherFiltroCategorias();
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
                    <img src="uploads/${produto.imagem}" alt="${produto.nome}" class="produto-imagem" 
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
                        <div class="produto-marca">${produto.marca} • ${produto.modelo}</div>
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

    aplicarFiltros() {
        const busca = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const categoria = document.getElementById('categoriaFilter')?.value || '';
        const precoMin = parseFloat(document.getElementById('precoMin')?.value || 0);
        const precoMax = parseFloat(document.getElementById('precoMax')?.value || Infinity);
        const ordenar = document.getElementById('ordenarSelect')?.value || 'nome';

        let produtosFiltrados = this.produtos.filter(produto => {
            // Filtro de busca
            const matchBusca = !busca || 
                produto.nome.toLowerCase().includes(busca) ||
                produto.descricao.toLowerCase().includes(busca) ||
                produto.categoria.toLowerCase().includes(busca) ||
                (produto.marca || '').toLowerCase().includes(busca) ||
                (produto.modelo || '').toLowerCase().includes(busca);

            // Filtro de categoria
            const matchCategoria = !categoria || produto.categoria === categoria;

            // Filtro de preço
            const matchPreco = produto.preco >= precoMin && produto.preco <= precoMax;

            return matchBusca && matchCategoria && matchPreco;
        });

        // Ordenar produtos
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
        const filtros = ['searchInput', 'categoriaFilter', 'precoMin', 'precoMax', 'ordenarSelect'];
        
        filtros.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.value = elemento.tagName === 'SELECT' ? '' : 
                    (id.includes('preco') ? '' : elemento.value);
            }
        });

        this.aplicarFiltros();
        this.mostrarNotificacao('Filtros limpos!');
    }

    preencherFiltroCategorias() {
        const select = document.getElementById('categoriaFilter');
        if (!select) return;

        select.innerHTML = '<option value="">Todas as Categorias</option>' +
            this.categorias.map(categoria => 
                `<option value="${categoria.nome}">${categoria.nome}</option>`
            ).join('');
    }

    getBadgeClass(produto) {
        if (produto.estoque <= 5) return 'badge-danger';
        if (produto.estoque <= 10) return 'badge-warning';
        if (produto.preco > 2000) return 'badge-premium';
        return 'badge-success';
    }

    getBadgeText(produto) {
        if (produto.estoque <= 5) return 'Últimas!';
        if (produto.estoque <= 10) return 'Acabando';
        if (produto.preco > 2000) return 'Premium';
        return 'Disponível';
    }

    adicionarAoCarrinho(produtoId) {
        const produto = this.produtos.find(p => p.id === produtoId);
        if (!produto) {
            this.mostrarNotificacao('Produto não encontrado!', 'error');
            return;
        }

        // Verificar estoque
        if (produto.estoque <= 0) {
            this.mostrarNotificacao('Produto sem estoque!', 'warning');
            return;
        }

        // Adicionar ao carrinho (simplificado)
        let carrinho = JSON.parse(localStorage.getItem('techhub_carrinho') || '[]');
        const itemExistente = carrinho.find(item => item.id === produtoId);
            
        if (itemExistente) {
            if (itemExistente.quantidade < produto.estoque) {
                itemExistente.quantidade += 1;
            } else {
                this.mostrarNotificacao('Quantidade máxima disponível!', 'warning');
                return;
            }
        } else {
            carrinho.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                quantidade: 1
            });
        }
            
        localStorage.setItem('techhub_carrinho', JSON.stringify(carrinho));
        this.atualizarContadorCarrinho();

        this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
    }

    comprarAgora(produtoId) {
        this.adicionarAoCarrinho(produtoId);
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1000);
    }

    atualizarContadorCarrinho() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            let carrinho = JSON.parse(localStorage.getItem('techhub_carrinho') || '[]');
            const total = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
            cartCount.textContent = total;
            cartCount.style.display = total > 0 ? 'flex' : 'none';
        }
    }

    atualizarEstatisticas() {
        // ... (Seu código de atualização de estatísticas) ...
        const statsContainer = document.getElementById('estatisticas');
        if (!statsContainer) return;

        const totalProdutos = this.produtos.length;
        const totalCategorias = new Set(this.produtos.map(p => p.categoria)).size;
        const produtosEstoqueBaixo = this.produtos.filter(p => p.estoque <= 5).length;
        const valorTotal = this.produtos.reduce((sum, p) => sum + (p.preco * (p.estoque || 0)), 0);

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-boxes"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-number">${totalProdutos}</span>
                    <span class="stat-label">Total de Produtos</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-tags"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-number">${totalCategorias}</span>
                    <span class="stat-label">Categorias</span>
                </div>
            </div>
            
            <div class="stat-card warning">
                <div class="stat-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-number">${produtosEstoqueBaixo}</span>
                    <span class="stat-label">Estoque Baixo</span>
                </div>
            </div>
            
            <div class="stat-card success">
                <div class="stat-icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-number">R$ ${this.formatarPreco(valorTotal)}</span>
                    <span class="stat-label">Valor Total</span>
                </div>
            </div>
        `;
    }

    mostrarNotificacao(mensagem, tipo = 'success') {
        // ... (Seu código de notificação) ...
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        toast.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${mensagem}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Adicionar estilos (apenas se não existirem)
        const styleId = 'toast-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* CSS Básico para Notificação */
                .toast {
                    position: fixed; top: 20px; right: 20px;
                    background: ${tipo === 'success' ? '#4CAF50' : (tipo === 'warning' ? '#ff9800' : '#f44336')};
                    color: white; padding: 10px 15px; border-radius: 5px;
                    display: flex; align-items: center; gap: 10px; z-index: 3000;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    animation: slideInRight 0.3s forwards;
                }
                @keyframes slideInRight {
                    from { right: -300px; opacity: 0; }
                    to { right: 20px; opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; } to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remover toast após 3 segundos
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    formatarPreco(preco) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(preco);
    }

    // ... (Seus métodos getProdutosDefault e getCategoriasDefault) ...
    getProdutosDefault() {
        return [
            {
                id: '1', nome: 'Produto de Exemplo', descricao: 'Se o DB falhar, aparece este.',
                preco: 100.00, categoria: 'Default', imagem: 'https://via.placeholder.com/300x200?text=Exemplo',
                estoque: 10, marca: 'Tech', modelo: 'V1'
            }
        ];
    }

    getCategoriasDefault() {
        return [
            { id: '1', nome: 'Default', descricao: 'Categoria Padrão', imagem: '' }
        ];
    }
}

// Instância global
let produtosManager;

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    produtosManager = new ProdutosManager();
});