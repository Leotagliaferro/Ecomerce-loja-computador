
const API = {
    baseURL: '/backend',

   
    async request(endpoint, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(`${this.baseURL}/${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

   
    async login(email, senha) {
        return this.request('login.php', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });
    },

    async registro(dados) {
        return this.request('registro.php', {
            method: 'POST',
            body: JSON.stringify(dados)
        });
    },

    
    async listarProdutos(filtros = {}) {
        const params = new URLSearchParams();

        if (filtros.categoria) params.append('categoria', filtros.categoria);
        if (filtros.busca) params.append('busca', filtros.busca);
        if (filtros.ordenar) params.append('ordenar', filtros.ordenar);
        if (filtros.limite) params.append('limite', filtros.limite);

        const queryString = params.toString();
        const endpoint = queryString ? `listar_produtos.php?${queryString}` : 'listar_produtos.php';

        return this.request(endpoint, { method: 'GET' });
    },

    async buscarProduto(id) {
        return this.request(`produto.php?id=${id}`, { method: 'GET' });
    },

   
    async salvarProduto(produto) {
        return this.request('salvarProduto.php', {
            method: 'POST',
            body: JSON.stringify(produto)
        });
    },

   
    async processarPedido(pedido) {
        return this.request('processar_pedido.php', {
            method: 'POST',
            body: JSON.stringify(pedido)
        });
    }
};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
