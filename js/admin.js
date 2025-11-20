// Admin Dashboard JavaScript - Corrigido para PHP/MySQL
class AdminDashboard {
    constructor() {
        // ⚠️ ATENÇÃO: Mude 'nome-da-sua-pasta' para o nome exato da pasta do seu projeto no htdocs
        // Exemplo: se seu projeto está em C:/xampp/htdocs/meu-ecommerce, use:
        this.apiBase = 'http://localhost/ecomerce/backend'; 
        
        this.currentSection = 'dashboard';
        this.charts = {};
        this.data = {
            products: [],
            orders: [],
            customers: [],
            categories: [],
            brands: []
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.setupCharts();
        this.setupSidebarToggle();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-link').dataset.section;
                this.switchSection(section);
            });
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filters
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) categoryFilter.addEventListener('change', () => this.filterProducts());

        const brandFilter = document.getElementById('brandFilter');
        if (brandFilter) brandFilter.addEventListener('change', () => this.filterProducts());

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) statusFilter.addEventListener('change', () => this.filterProducts());

        const orderStatusFilter = document.getElementById('orderStatusFilter');
        if (orderStatusFilter) orderStatusFilter.addEventListener('change', () => this.filterOrders());

        // Product form (CORRIGIDO PARA USAR O NOVO HANDLER)
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));
        }

        // Modals
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) addProductBtn.addEventListener('click', () => this.openProductModal());

        const closeProductModal = document.getElementById('closeProductModal');
        if (closeProductModal) closeProductModal.addEventListener('click', () => this.closeProductModal());

        const cancelProduct = document.getElementById('cancelProduct');
        if (cancelProduct) cancelProduct.addEventListener('click', () => this.closeProductModal());

        // Fullscreen & Logout
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.toggle('collapsed');
                this.updateCharts();
            });
        }
    }

    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.toggle('mobile-open');
            });
        }

        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !mobileMenuToggle.contains(e.target) &&
                sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
            }
        });
    }

    switchSection(section) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(section)?.classList.add('active');

        this.updatePageTitle(section);
        this.currentSection = section;
        this.loadSectionData(section);
    }

    updatePageTitle(section) {
        const titles = {
            dashboard: { title: 'Dashboard', subtitle: 'Visão geral do sistema' },
            products: { title: 'Produtos', subtitle: 'Gerencie seus produtos' },
            orders: { title: 'Pedidos', subtitle: 'Gerencie os pedidos' },
            customers: { title: 'Clientes', subtitle: 'Gerencie os clientes' },
            stock: { title: 'Estoque', subtitle: 'Controle de estoque' }
        };
        const titleInfo = titles[section] || { title: 'Painel', subtitle: 'Visão geral' };
        document.getElementById('pageTitle').textContent = titleInfo.title;
        document.getElementById('pageSubtitle').textContent = titleInfo.subtitle;
    }

    async loadInitialData() {
        this.showLoading();
        try {
            // Carrega dados iniciais (assumindo que existem arquivos PHP para listar esses dados)
            // Se você ainda não criou o listar_pedidos.php, isso vai dar erro, mas não vai quebrar o site todo
            await Promise.allSettled([
                this.loadDashboardData(),
                this.loadProducts(),
                // this.loadOrders(), // Descomente quando tiver o PHP pronto
                // this.loadCustomers() // Descomente quando tiver o PHP pronto
            ]);
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
        } finally {
            this.hideLoading();
        }
    }

    async loadDashboardData() {
        try {
            // Exemplo: listar_dashboard.php
            const response = await fetch(`${this.apiBase}/dashboard_stats.php`);
            if(!response.ok) return; // Ignora se o arquivo não existir ainda
            
            const data = await response.json();
            // Atualiza UI com dados do PHP...
        } catch (error) {
            console.warn('Dashboard API ainda não implementada no PHP.');
        }
    }

    setupCharts() {
        // Configuração dos gráficos (mantida igual, mas requer dados reais)
        const salesCtx = document.getElementById('salesChart');
        if (salesCtx) {
            this.charts.sales = new Chart(salesCtx, {
                type: 'line',
                data: { labels: [], datasets: [{ label: 'Vendas', data: [], borderColor: '#2563eb', tension: 0.4 }] },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }

    updateCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') chart.resize();
        });
    }

    // --- FUNÇÕES DE PRODUTOS (CORRIGIDAS) ---

    async loadProducts() {
        try {
            // ⚠️ IMPORTANTE: Você precisa criar um arquivo 'listar_produtos.php' no seu backend
            // que faça "SELECT * FROM produtos" e retorne um JSON.
            const response = await fetch(`${this.apiBase}/listar_produtos.php`);
            
            if (!response.ok) throw new Error('Erro ao buscar produtos');

            const data = await response.json();
            // O PHP deve retornar algo como: { data: [...] } ou apenas [...]
            this.data.products = Array.isArray(data) ? data : (data.data || []); 
            
            this.renderProductsTable();
            this.updateStockOverview();
        } catch (error) {
            console.error('Erro carregando produtos:', error);
        }
    }

    renderProductsTable() {
        const tbody = document.getElementById('productsBody');
        if (!tbody) return;

        // Caminho base para as imagens (ajuste conforme sua pasta de uploads)
        const uploadsPath = 'http://localhost/ecomerce/uploads/';

        tbody.innerHTML = this.data.products.map(product => `
            <tr>
                <td><input type="checkbox" class="product-checkbox" value="${product.id}"></td>
                <td>
                    <img src="${product.imagem ? uploadsPath + product.imagem : 'https://via.placeholder.com/40x40'}" 
                         alt="${product.nome}" class="product-image" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                </td>
                <td>
                    <div class="product-info">
                        <div class="product-name">${product.nome}</div>
                    </div>
                </td>
                <td>${product.categoria || 'N/A'}</td>
                <td>${product.marca || 'N/A'}</td>
                <td>R$ ${this.formatCurrency(product.preco || 0)}</td>
                <td>
                    <span class="stock-badge ${this.getStockStatus(product.estoque, product.estoque_minimo).class}">
                        ${product.estoque || 0}
                    </span>
                </td>
                <td>
                    <div class="actions">
                        <button class="btn-secondary btn-sm" onclick="admin.editProduct('${product.id}')" title="Editar"><i class="fas fa-edit"></i></button>
                        <button class="btn-danger btn-sm" onclick="admin.deleteProduct('${product.id}')" title="Excluir"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getStockStatus(current, minimum) {
        if (current <= 0) return { class: 'danger', label: 'Sem estoque' };
        if (current <= (minimum || 5)) return { class: 'warning', label: 'Estoque baixo' };
        return { class: 'success', label: 'Estoque OK' };
    }

    updateStockOverview() {
        const stockOk = this.data.products.filter(p => p.estoque > (p.estoque_minimo || 5)).length;
        const stockLow = this.data.products.filter(p => p.estoque <= (p.estoque_minimo || 5) && p.estoque > 0).length;
        const stockOut = this.data.products.filter(p => p.estoque <= 0).length;

        document.getElementById('stockOkCount').textContent = stockOk;
        document.getElementById('stockLowCount').textContent = stockLow;
        document.getElementById('stockOutCount').textContent = stockOut;
    }

    // --- FORMULÁRIO DE PRODUTOS (AQUI ESTÁ A GRANDE CORREÇÃO) ---

    openProductModal(productId = null) {
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        const form = document.getElementById('productForm');
        
        if (productId) {
            title.textContent = 'Editar Produto';
            // Adicione um input hidden para o ID se estiver editando
            let idInput = document.getElementById('editProductId');
            if (!idInput) {
                idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.id = 'editProductId';
                idInput.name = 'id'; // Para o PHP saber qual editar
                form.appendChild(idInput);
            }
            idInput.value = productId;
            this.loadProductData(productId);
        } else {
            title.textContent = 'Adicionar Produto';
            form.reset();
            // Remove o ID se existir
            const idInput = document.getElementById('editProductId');
            if (idInput) idInput.remove();
        }
        
        modal.classList.add('active');
    }

    closeProductModal() {
        const modal = document.getElementById('productModal');
        modal.classList.remove('active');
    }

    async loadProductData(productId) {
        try {
            // Ajuste para URL PHP com parâmetro
            const response = await fetch(`${this.apiBase}/obter_produto.php?id=${productId}`);
            const product = await response.json();
            
            // Preenche o formulário. IMPORTANTE: Os IDs do HTML devem existir
            if(document.getElementById('productName')) document.getElementById('productName').value = product.nome || '';
            if(document.getElementById('productCategory')) document.getElementById('productCategory').value = product.categoria || '';
            if(document.getElementById('productPrice')) document.getElementById('productPrice').value = product.preco || '';
            if(document.getElementById('productStock')) document.getElementById('productStock').value = product.estoque || '';
            if(document.getElementById('productDescription')) document.getElementById('productDescription').value = product.descricao || '';
            
        } catch (error) {
            console.error('Erro carregando dados do produto:', error);
        }
    }

    // 🔥 AQUI A CORREÇÃO PRINCIPAL PARA FUNCIONAR COM SEU PHP 🔥
    async handleProductSubmit(event) {
        event.preventDefault();
        
        // 1. Usa FormData para capturar inputs E arquivos
        // ATENÇÃO: No HTML, seus inputs PRECISAM ter o atributo name="" (ex: name="nome", name="imagem")
        const formData = new FormData(event.target);
        const form = event.target;

        // Verifica se é edição ou novo (baseado no input hidden que criamos no openProductModal)
        const isEdit = document.getElementById('editProductId') !== null;
        const scriptPHP = isEdit ? 'editar_produto.php' : 'salvarProduto.php';

        try {
            this.showLoading();
            
            const response = await fetch(`${this.apiBase}/${scriptPHP}`, {
                method: 'POST',
                body: formData // Envia o objeto FormData direto. NÃO adicione Content-Type header.
            });

            // Tenta ler JSON
            const result = await response.json();

            if (response.ok && (result.sucesso || result.message)) {
                this.showNotification('Produto salvo com sucesso!', 'success');
                this.closeProductModal();
                this.loadProducts(); // Recarrega a tabela
            } else {
                throw new Error(result.erro || 'Falha ao salvar produto');
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            this.showNotification('Erro ao salvar: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;
        
        try {
            this.showLoading();
            
            // Envia via POST ou DELETE (PHP puro lida melhor com POST ou GET com parametros)
            // Aqui usando fetch com método DELETE, mas apontando para um arquivo PHP
            const response = await fetch(`${this.apiBase}/excluir_produto.php?id=${productId}`, {
                method: 'DELETE' 
            });

            const result = await response.json();

            if (response.ok && result.sucesso) {
                this.showNotification('Produto excluído!', 'success');
                this.loadProducts();
            } else {
                throw new Error(result.erro || 'Falha ao excluir');
            }
        } catch (error) {
            console.error('Erro ao excluir:', error);
            this.showNotification('Erro ao excluir', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // --- UTILITÁRIOS ---

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    showLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) loading.style.display = 'flex';
    }

    hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) loading.style.display = 'none';
    }

    showNotification(message, type = 'info') {
        alert(`${type.toUpperCase()}: ${message}`); // Simples alert, você pode melhorar depois
    }
    
    loadSectionData(section) {
        switch (section) {
            case 'products': this.loadProducts(); break;
            case 'dashboard': this.loadDashboardData(); break;
            // Adicione os outros cases conforme criar os arquivos PHP
        }
    }
    
    // Funções placeholders para não quebrar o código se forem chamadas
    filterProducts() { console.log('Filtro ainda não implementado no PHP'); }
    filterOrders() { console.log('Filtro ainda não implementado no PHP'); }
}

// Inicializa
const admin = new AdminDashboard();
// Torna global para ser acessado pelos botões onclick no HTML
window.admin = admin;