// Sistema de Produto Detalhado
class ProdutoDetalhe {
    constructor() {
        this.produto = null;
        this.produtosRelacionados = [];
        this.init();
    }

    init() {
        // Wait for TechHub
        if (window.techHub) {
            this.carregarProduto();
        } else {
            setTimeout(() => this.init(), 100);
        }
        this.configurarEventListeners();
    }

    configurarEventListeners() {
        // Event listeners specific to product page are handled here
        // Global ones like cart float are in app.js
    }

    async carregarProduto() {
        const urlParams = new URLSearchParams(window.location.search);
        const produtoId = urlParams.get('id');

        if (!produtoId) {
            this.mostrarErro('Produto não especificado');
            return;
        }

        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'flex';

        try {
            // Use TechHub to find the product (it handles backend + custom)
            // We might need to ensure TechHub has loaded products first
            if (techHub.produtos.length === 0) {
                await techHub.carregarProdutos();
            }

            this.produto = techHub.produtos.find(p => p.id == produtoId);

            if (this.produto) {
                this.renderizarProduto();
                this.carregarProdutosRelacionados();
            } else {
                this.mostrarErro('Produto não encontrado');
            }
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
            this.mostrarErro('Erro ao carregar informações do produto');
        } finally {
            if (loading) loading.style.display = 'none';
        }
    }

    async carregarProdutosRelacionados() {
        if (!this.produto) return;

        // Filter related products from TechHub's list
        this.produtosRelacionados = techHub.produtos.filter(p =>
            p.categoria === this.produto.categoria && p.id != this.produto.id
        ).slice(0, 4);

        this.renderizarProdutosRelacionados();
    }

    renderizarProduto() {
        if (!this.produto) return;

        const container = document.getElementById('produtoContainer');
        const breadcrumb = document.getElementById('breadcrumbProduto');

        // Update breadcrumb if exists
        if (breadcrumb) breadcrumb.textContent = this.produto.nome;

        // Ensure price is a number
        const preco = parseFloat(this.produto.preco);

        container.innerHTML = `
            <div class="produto-detalhe-grid fade-in">
                <!-- Imagens do Produto -->
                <div class="produto-imagens">
                    <div class="imagem-principal">
                        <img src="${this.produto.imagem}" alt="${this.produto.nome}" 
                             onerror="this.src='https://via.placeholder.com/500x500?text=Produto'">
                    </div>
                    <div class="imagens-thumbs" id="thumbsContainer">
                        <!-- Thumbnails generated dynamically -->
                    </div>
                </div>

                <!-- Informações do Produto -->
                <div class="produto-info-detalhe">
                    <div class="produto-header-detalhe">
                        <span class="produto-categoria-tag">${this.produto.categoria}</span>
                        <span class="produto-badge ${this.getBadgeClass()}">${this.getBadgeText()}</span>
                    </div>

                    <h1 class="produto-titulo">${this.produto.nome}</h1>
                    <p class="produto-subtitulo">${this.produto.marca || 'TechHub'} • ${this.produto.modelo || 'Standard'}</p>
                    
                    <div class="produto-avaliacao">
                        <div class="estrelas">
                            ${this.gerarEstrelas(4.5)}
                        </div>
                        <span class="avaliacao-texto">4.5 (128 avaliações)</span>
                    </div>

                    <div class="produto-preco-box">
                        <div class="produto-preco-principal">
                            <span class="preco-atual">R$ ${techHub.formatarPreco(preco)}</span>
                            <span class="parcelamento">ou 10x de R$ ${techHub.formatarPreco(preco / 10)} sem juros</span>
                        </div>
                        <div class="produto-economia">
                            <i class="fas fa-tag"></i>
                            <span>5% de desconto no PIX: R$ ${techHub.formatarPreco(preco * 0.95)}</span>
                        </div>
                    </div>

                    <div class="produto-estoque-status ${this.produto.estoque > 0 ? 'em-estoque' : 'sem-estoque'}">
                        <i class="fas ${this.produto.estoque > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        <span>${this.produto.estoque > 0 ? `${this.produto.estoque} unidades disponíveis` : 'Indisponível'}</span>
                    </div>

                    <div class="produto-descricao-curta">
                        <p>${this.produto.descricao}</p>
                    </div>

                    <div class="produto-actions-area">
                        <div class="quantidade-selector">
                            <button type="button" onclick="produtoDetalhe.alterarQuantidade(-1)">-</button>
                            <input type="number" id="quantidade" value="1" min="1" max="${this.produto.estoque}" readonly>
                            <button type="button" onclick="produtoDetalhe.alterarQuantidade(1)">+</button>
                        </div>

                        <div class="produto-buttons-row">
                            <button class="btn-add-cart" onclick="produtoDetalhe.adicionarAoCarrinho()">
                                <i class="fas fa-cart-plus"></i>
                                Adicionar
                            </button>
                            <button class="btn-buy-now" onclick="produtoDetalhe.comprarAgora()">
                                <i class="fas fa-bolt"></i>
                                Comprar
                            </button>
                        </div>
                    </div>

                    <div class="produto-frete-info">
                        <div class="frete-item">
                            <i class="fas fa-truck"></i>
                            <div>
                                <strong>Frete Grátis</strong>
                                <p>Para todo o Brasil em compras acima de R$ 500</p>
                            </div>
                        </div>
                        <div class="frete-item">
                            <i class="fas fa-shield-alt"></i>
                            <div>
                                <strong>Garantia Estendida</strong>
                                <p>12 meses de garantia direto com a loja</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Abas de Informações -->
            <div class="produto-abas-container">
                <div class="abas-header">
                    <button class="aba-btn active" onclick="produtoDetalhe.mudarAba('descricao')">Descrição</button>
                    <button class="aba-btn" onclick="produtoDetalhe.mudarAba('especificacoes')">Especificações</button>
                </div>
                
                <div class="abas-content">
                    <div id="aba-descricao" class="aba-content active">
                        <h3>Sobre o Produto</h3>
                        <p>${this.produto.descricao}</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                    
                    <div id="aba-especificacoes" class="aba-content">
                        <h3>Especificações Técnicas</h3>
                        <div class="especificacoes-list">
                            ${this.renderizarEspecificacoes()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.adicionarThumbnails();
    }

    renderizarEspecificacoes() {
        // If specs are a string, split them. If object, iterate.
        // For now assuming simple string or comma separated
        const specs = this.produto.especificacoes || 'Marca: ' + (this.produto.marca || 'TechHub') + ', Modelo: ' + (this.produto.modelo || 'Standard');
        const specList = specs.split(',').map(s => s.trim());

        return specList.map(spec => `
            <div class="spec-row">
                <span class="spec-name">${spec.split(':')[0] || 'Geral'}</span>
                <span class="spec-value">${spec.split(':')[1] || spec}</span>
            </div>
        `).join('');
    }

    adicionarThumbnails() {
        const thumbsContainer = document.getElementById('thumbsContainer');
        if (!thumbsContainer) return;

        // Add main image + placeholders
        thumbsContainer.innerHTML = `
            <img src="${this.produto.imagem}" class="thumb active" onclick="produtoDetalhe.mudarImagem(this.src, this)">
            <img src="https://via.placeholder.com/500x500?text=Vista+2" class="thumb" onclick="produtoDetalhe.mudarImagem(this.src, this)">
            <img src="https://via.placeholder.com/500x500?text=Vista+3" class="thumb" onclick="produtoDetalhe.mudarImagem(this.src, this)">
        `;
    }

    mudarImagem(src, el) {
        document.querySelector('.imagem-principal img').src = src;
        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
    }

    mudarAba(abaNome) {
        document.querySelectorAll('.aba-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.aba-content').forEach(content => content.classList.remove('active'));

        // Find button that triggered this (event.target might be unreliable if called programmatically, but ok here)
        const buttons = document.querySelectorAll('.aba-btn');
        buttons.forEach(b => {
            if (b.textContent.toLowerCase().includes(abaNome)) b.classList.add('active');
        });

        const aba = document.getElementById(`aba-${abaNome}`);
        if (aba) aba.classList.add('active');
    }

    alterarQuantidade(delta) {
        const input = document.getElementById('quantidade');
        let novaQtd = parseInt(input.value) + delta;
        if (novaQtd >= 1 && novaQtd <= this.produto.estoque) {
            input.value = novaQtd;
        }
    }

    adicionarAoCarrinho() {
        if (!this.produto) return;
        const qtd = parseInt(document.getElementById('quantidade').value);

        for (let i = 0; i < qtd; i++) {
            techHub.adicionarAoCarrinho(this.produto.id);
        }
    }

    comprarAgora() {
        this.adicionarAoCarrinho();
        setTimeout(() => window.location.href = 'checkout.html', 500);
    }

    renderizarProdutosRelacionados() {
        const container = document.getElementById('produtosRelacionados');
        if (!container || this.produtosRelacionados.length === 0) return;

        container.innerHTML = this.produtosRelacionados.map(produto => `
            <div class="produto-card fade-in">
                <div class="produto-imagem-container">
                    <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem" 
                        onerror="this.src='https://via.placeholder.com/300x300?text=Produto'">
                    <div class="produto-overlay">
                        <a href="produto.html?id=${produto.id}" class="btn-overlay">
                            <i class="fas fa-eye"></i>
                        </a>
                    </div>
                </div>
                <div class="produto-info">
                    <span class="produto-categoria">${produto.categoria}</span>
                    <h3 class="produto-nome">${produto.nome}</h3>
                    <div class="produto-preco">
                        R$ ${techHub.formatarPreco(produto.preco)}
                    </div>
                    <a href="produto.html?id=${produto.id}" class="btn-secondary">Ver Detalhes</a>
                </div>
            </div>
        `).join('');
    }

    mostrarErro(msg) {
        const container = document.getElementById('produtoContainer');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>${msg}</h3>
                    <a href="index.html" class="btn-primary">Voltar para a Loja</a>
                </div>
            `;
        }
    }

    getBadgeClass() {
        if (!this.produto) return '';
        if (this.produto.estoque <= 5) return 'badge-danger';
        if (this.produto.preco > 3000) return 'badge-premium';
        return 'badge-success';
    }

    getBadgeText() {
        if (!this.produto) return '';
        if (this.produto.estoque <= 5) return 'Últimas Unidades';
        if (this.produto.preco > 3000) return 'Premium';
        return 'Disponível';
    }

    gerarEstrelas(nota) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= nota) html += '<i class="fas fa-star"></i>';
            else if (i - 0.5 <= nota) html += '<i class="fas fa-star-half-alt"></i>';
            else html += '<i class="far fa-star"></i>';
        }
        return html;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.produtoDetalhe = new ProdutoDetalhe();
});
