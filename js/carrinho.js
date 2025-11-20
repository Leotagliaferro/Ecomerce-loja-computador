// Sistema de Carrinho de Compras
class Carrinho {
    constructor() {
        this.itens = this.carregarCarrinho();
        this.init();
    }

    init() {
        this.configurarEventListeners();
        this.renderizarCarrinho();
        this.atualizarResumo();
    }

    configurarEventListeners() {
        // Botão de limpar carrinho
        const limparCarrinhoBtn = document.getElementById('limparCarrinho');
        if (limparCarrinhoBtn) {
            limparCarrinhoBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja limpar o carrinho?')) {
                    this.limparCarrinho();
                }
            });
        }

        // Botão de finalizar compra
        const finalizarCompraBtn = document.getElementById('finalizarCompra');
        if (finalizarCompraBtn) {
            finalizarCompraBtn.addEventListener('click', () => {
                this.finalizarCompra();
            });
        }

        // Botão de continuar comprando
        const continuarComprandoBtn = document.getElementById('continuarComprando');
        if (continuarComprandoBtn) {
            continuarComprandoBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }

    adicionarItem(produto, quantidade = 1) {
        const itemExistente = this.itens.find(item => item.id === produto.id);
        
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            this.itens.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                quantidade: quantidade,
                estoque: produto.estoque || 999
            });
        }
        
        this.salvarCarrinho();
        this.renderizarCarrinho();
        this.atualizarResumo();
        this.atualizarContadorGlobal();
        this.mostrarNotificacao('Produto adicionado ao carrinho!');
    }

    removerItem(produtoId) {
        this.itens = this.itens.filter(item => item.id !== produtoId);
        this.salvarCarrinho();
        this.renderizarCarrinho();
        this.atualizarResumo();
        this.atualizarContadorGlobal();
    }

    atualizarQuantidade(produtoId, novaQuantidade) {
        const item = this.itens.find(item => item.id === produtoId);
        
        if (item) {
            if (novaQuantidade <= 0) {
                this.removerItem(produtoId);
            } else if (novaQuantidade > item.estoque) {
                alert(`Quantidade máxima disponível: ${item.estoque}`);
                return false;
            } else {
                item.quantidade = novaQuantidade;
                this.salvarCarrinho();
                this.renderizarCarrinho();
                this.atualizarResumo();
                this.atualizarContadorGlobal();
            }
        }
        
        return true;
    }

    limparCarrinho() {
        this.itens = [];
        this.salvarCarrinho();
        this.renderizarCarrinho();
        this.atualizarResumo();
        this.atualizarContadorGlobal();
    }

    calcularTotal() {
        return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    calcularTotalItens() {
        return this.itens.reduce((total, item) => total + item.quantidade, 0);
    }

    calcularDesconto(cupom = '') {
        // Sistema simples de cupons
        const cupons = {
            'TECHHUB10': 0.10, // 10% de desconto
            'PRIMEIRACOMPRA': 0.15, // 15% para primeira compra
            'BLACKFRIDAY': 0.20, // 20% Black Friday
            'VIP': 0.25 // 25% para clientes VIP
        };

        const descontoPercentual = cupons[cupom.toUpperCase()] || 0;
        const total = this.calcularTotal();
        
        return {
            desconto: total * descontoPercentual,
            percentual: descontoPercentual * 100,
            valido: descontoPercentual > 0
        };
    }

    calcularFrete(cep = '') {
        // Sistema simples de cálculo de frete
        if (!cep) return { valor: 0, tipo: 'Retirada', prazo: 0 };
        
        const regiao = cep.substring(0, 1); // Primeiro dígito do CEP
        
        switch (regiao) {
            case '0':
            case '1': // São Paulo e regiões próximas
                return { valor: 15.90, tipo: 'Expresso', prazo: 1 };
            case '2':
            case '3': // Rio de Janeiro e regiões próximas
                return { valor: 19.90, tipo: 'Expresso', prazo: 2 };
            case '4':
            case '5': // Regiões Norte/Nordeste
                return { valor: 29.90, tipo: 'Standard', prazo: 5 };
            default: // Outras regiões
                return { valor: 39.90, tipo: 'Standard', prazo: 7 };
        }
    }

    renderizarCarrinho() {
        const container = document.getElementById('carrinhoItems');
        const emptyState = document.getElementById('carrinhoVazio');
        
        if (!container) return;

        if (this.itens.length === 0) {
            container.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
                emptyState.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>Seu carrinho está vazio</h3>
                        <p>Adicione produtos para começar a comprar</p>
                        <a href="index.html" class="btn-primary">
                            <i class="fas fa-arrow-left"></i> Continuar Comprando
                        </a>
                    </div>
                `;
            }
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        container.innerHTML = this.itens.map(item => `
            <div class="cart-item">
                <div class="cart-item-imagem">
                    <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='https://via.placeholder.com/100x100?text=Produto'">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-nome">${item.nome}</h4>
                    <p class="cart-item-preco">R$ ${this.formatarPreco(item.preco)}</p>
                    <p class="cart-item-estoque">Disponível: ${item.estoque}</p>
                    <div class="cart-item-actions">
                        <div class="quantidade-control">
                            <button class="btn-quantidade" onclick="carrinho.atualizarQuantidade('${item.id}', ${item.quantidade - 1})">-</button>
                            <input type="number" value="${item.quantidade}" min="1" max="${item.estoque}" 
                                   onchange="carrinho.atualizarQuantidade('${item.id}', parseInt(this.value))"
                                   class="quantidade-input">
                            <button class="btn-quantidade" onclick="carrinho.atualizarQuantidade('${item.id}', ${item.quantidade + 1})">+</button>
                        </div>
                        <button class="btn-remover" onclick="carrinho.removerItem('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-subtotal">
                    <span class="subtotal-label">Subtotal</span>
                    <span class="subtotal-valor">R$ ${this.formatarPreco(item.preco * item.quantidade)}</span>
                </div>
            </div>
        `).join('');
    }

    atualizarResumo() {
        const subtotal = this.calcularTotal();
        const totalItens = this.calcularTotalItens();
        
        // Pegar cupom e CEP dos inputs se existirem
        const cupom = document.getElementById('cupomDesconto')?.value || '';
        const cep = document.getElementById('cepFrete')?.value || '';
        
        const descontoInfo = this.calcularDesconto(cupom);
        const freteInfo = this.calcularFrete(cep);
        
        const desconto = descontoInfo.desconto;
        const frete = freteInfo.valor;
        const total = subtotal - desconto + frete;

        // Atualizar resumo do carrinho
        const resumoContainer = document.getElementById('carrinhoResumo');
        if (resumoContainer) {
            resumoContainer.innerHTML = `
                <div class="resumo-header">
                    <h3>Resumo do Pedido</h3>
                </div>
                
                <div class="resumo-itens">
                    <div class="resumo-item">
                        <span>Itens (${totalItens})</span>
                        <span>R$ ${this.formatarPreco(subtotal)}</span>
                    </div>
                    
                    ${desconto > 0 ? `
                        <div class="resumo-item desconto">
                            <span>Desconto ${cupom ? `(${descontoInfo.percentual}%)` : ''}</span>
                            <span>- R$ ${this.formatarPreco(desconto)}</span>
                        </div>
                    ` : ''}
                    
                    <div class="resumo-item">
                        <span>Frete (${freteInfo.tipo})</span>
                        <span>${frete > 0 ? 'R$ ' + this.formatarPreco(frete) : 'Grátis'}</span>
                    </div>
                    
                    <div class="resumo-item frete-prazo">
                        <span>Prazo estimado</span>
                        <span>${freteInfo.prazo} ${freteInfo.prazo === 1 ? 'dia' : 'dias'}</span>
                    </div>
                </div>
                
                <div class="resumo-total">
                    <span>Total</span>
                    <span>R$ ${this.formatarPreco(total)}</span>
                </div>
                
                <div class="resumo-actions">
                    <button class="btn-primary" onclick="carrinho.finalizarCompra()">
                        <i class="fas fa-credit-card"></i> Finalizar Compra
                    </button>
                    <button class="btn-secondary" onclick="carrinho.continuarComprando()">
                        <i class="fas fa-arrow-left"></i> Continuar Comprando
                    </button>
                </div>
            `;
        }

        // Atualizar resumo flutuante
        const resumoFloat = document.getElementById('carrinhoResumoFloat');
        if (resumoFloat) {
            resumoFloat.innerHTML = `
                <div class="resumo-float-total">
                    <span>Total (${totalItens} itens)</span>
                    <span>R$ ${this.formatarPreco(total)}</span>
                </div>
            `;
        }

        // Atualizar botão de finalizar compra
        const finalizarBtn = document.getElementById('finalizarCompra');
        if (finalizarBtn) {
            finalizarBtn.disabled = this.itens.length === 0;
        }
    }

    aplicarCupom() {
        const cupomInput = document.getElementById('cupomDesconto');
        const cupom = cupomInput?.value || '';
        
        if (!cupom) {
            alert('Digite um cupom de desconto');
            return;
        }
        
        const descontoInfo = this.calcularDesconto(cupom);
        
        if (descontoInfo.valido) {
            this.mostrarNotificacao(`Cupom aplicado! ${descontoInfo.percentual}% de desconto`);
            this.atualizarResumo();
        } else {
            alert('Cupom inválido ou expirado');
        }
    }

    calcularFreteInput() {
        const cepInput = document.getElementById('cepFrete');
        const cep = cepInput?.value || '';
        
        if (!cep) {
            alert('Digite seu CEP');
            return;
        }
        
        if (!/^[0-9]{5}-?[0-9]{3}$/.test(cep)) {
            alert('CEP inválido');
            return;
        }
        
        this.atualizarResumo();
        this.mostrarNotificacao('Frete calculado com sucesso!');
    }

    finalizarCompra() {
        if (this.itens.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        // Redirecionar para página de checkout
        window.location.href = 'checkout.html';
    }

    continuarComprando() {
        window.location.href = 'index.html';
    }

    salvarCarrinho() {
        localStorage.setItem('techhub_carrinho', JSON.stringify(this.itens));
    }

    carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('techhub_carrinho');
        return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    }

    atualizarContadorGlobal() {
        // Atualizar contador do header
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const total = this.calcularTotalItens();
            cartCount.textContent = total;
            cartCount.style.display = total > 0 ? 'flex' : 'none';
        }
    }

    mostrarNotificacao(mensagem, tipo = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        toast.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
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
            
            .toast.warning {
                background: var(--warning-color);
            }
            
            .toast.error {
                background: var(--danger-color);
            }
            
            .toast i {
                font-size: 1.25rem;
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
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

    formatarPreco(preco) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(preco);
    }
}

// Instância global do carrinho
let carrinho;

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    carrinho = new Carrinho();
    
    // Configurar eventos adicionais específicos da página do carrinho
    const cupomBtn = document.getElementById('aplicarCupom');
    if (cupomBtn) {
        cupomBtn.addEventListener('click', () => carrinho.aplicarCupom());
    }
    
    const calcularFreteBtn = document.getElementById('calcularFrete');
    if (calcularFreteBtn) {
        calcularFreteBtn.addEventListener('click', () => carrinho.calcularFreteInput());
    }
});