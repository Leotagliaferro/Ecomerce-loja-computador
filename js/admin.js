
class AdminPanel {
    constructor() {
        this.form = document.getElementById('produtoForm');
        this.tableBody = document.getElementById('produtosTableBody');
        this.init();
    }

    init() {
        this.renderizarTabela();

        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.adicionarProduto();
            });
        }
    }

    adicionarProduto() {
        const nome = document.getElementById('nome').value;
        const preco = parseFloat(document.getElementById('preco').value);
        const categoria = document.getElementById('categoria').value;
        const imagem = document.getElementById('imagem').value;
        const estoque = parseInt(document.getElementById('estoque').value);
        const descricao = document.getElementById('descricao').value;

        const novoProduto = {
            id: 'custom_' + Date.now(), 
            nome,
            preco,
            categoria,
            imagem,
            estoque,
            descricao,
            novo: true,
            marca: 'Custom',
            modelo: 'Edition'
        };

     
        const produtos = this.getProdutosCustomizados();
        produtos.push(novoProduto);

       
        localStorage.setItem('techhub_custom_products', JSON.stringify(produtos));

       
        techHub.mostrarNotificacao('Produto adicionado com sucesso!');
        this.form.reset();
        this.renderizarTabela();
    }

    removerProduto(id) {
        if (!confirm('Tem certeza que deseja remover este produto?')) return;

        let produtos = this.getProdutosCustomizados();
        produtos = produtos.filter(p => p.id !== id);

        localStorage.setItem('techhub_custom_products', JSON.stringify(produtos));
        this.renderizarTabela();
        techHub.mostrarNotificacao('Produto removido!', 'info');
    }

    getProdutosCustomizados() {
        return JSON.parse(localStorage.getItem('techhub_custom_products') || '[]');
    }

    renderizarTabela() {
        const produtos = this.getProdutosCustomizados();

        if (produtos.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                        Nenhum produto cadastrado manualmente.
                    </td>
                </tr>
            `;
            return;
        }

        this.tableBody.innerHTML = produtos.map(produto => `
            <tr>
                <td>
                    <img src="${produto.imagem}" class="preview-image" onerror="this.src='https://via.placeholder.com/50?text=Err'">
                </td>
                <td>
                    <strong>${produto.nome}</strong><br>
                    <small style="color: var(--text-muted)">${produto.categoria}</small>
                </td>
                <td>R$ ${techHub.formatarPreco(produto.preco)}</td>
                <td>${produto.estoque}</td>
                <td>
                    <button class="action-btn" onclick="adminPanel.removerProduto('${produto.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}


let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});
