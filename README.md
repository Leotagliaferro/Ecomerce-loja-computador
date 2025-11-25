# 🖥️ TechHub - E-commerce de Peças de Computador

## 📋 Visão Geral

TechHub é um sistema completo de e-commerce desenvolvido especialmente para venda de peças de computador e hardware. O sistema oferece uma experiência moderna e intuitiva com design responsivo, suporte multi-idioma (português), e funcionalidades avançadas de gerenciamento.

## 🎯 Objetivos

- Facilitar a compra de peças de computador online
- Oferecer uma interface moderna e intuitiva
- Gerenciar produtos, pedidos e clientes eficientemente
- Proporcionar uma experiência de compra completa e segura
- Monitorar vendas e estoque em tempo real

## ✨ Principais Funcionalidades

### 🛍️ Loja Virtual
- **Catálogo de Produtos**: Visualização completa com filtros por categoria, marca e preço
- **Carrinho de Compras**: Sistema completo com gestão de quantidades e cálculo de frete
- **Checkout**: Processo completo com validação de dados e múltiplas formas de pagamento
- **Busca Avançada**: Pesquisa por produtos com filtros dinâmicos
- **Design Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Tema Escuro**: Interface moderna com tema escuro profissional

### 📊 Painel Administrativo
- **Dashboard Completo**: Visualização de vendas, estatísticas e gráficos interativos
- **Gerenciamento de Produtos**: CRUD completo com controle de estoque
- **Gestão de Pedidos**: Acompanhamento completo do ciclo de vendas
- **Controle de Clientes**: Gerenciamento de informações e histórico de compras
- **Análises e Relatórios**: Gráficos de vendas, categorias e performance
- **Controle de Estoque**: Alertas de baixo estoque e gestão de inventário

### 💳 Formas de Pagamento
- **Cartão de Crédito**: Parcelamento em até 10x sem juros
- **Boleto Bancário**: Com desconto de 5%
- **PIX**: Com desconto de 10%

### 🚚 Frete e Entrega
- **Cálculo por Região**: Sistema inteligente baseado em CEP
- **Frete Grátis**: Para determinadas regiões
- **Prazos de Entrega**: Estimativas precisas por região

## 📁 Estrutura do Projeto

```
TechHub/
├── index.html              # Página principal da loja
├── produto.html            # Página individual de produto
├── carrinho.html           # Página do carrinho de compras
├── checkout.html           # Página de checkout/pagamento
├── admin.html              # Painel administrativo completo
├── css/
│   ├── style.css          # Estilos principais do site
│   └── admin.css          # Estilos específicos do painel admin
├── js/
│   ├── app.js             # JavaScript principal da loja
│   ├── carrinho.js        # Sistema de carrinho de compras
│   ├── produtos.js        # Gerenciamento de produtos
│   └── admin.js           # JavaScript do painel administrativo
└── README.md              # Documentação do projeto
```

## 🗂️ Banco de Dados

### Tabelas Principais

#### 🔧 Produtos
- **Campos**: id, nome, descrição, categoria, marca, preço, estoque, imagem_url, especificações, status
- **Categorias**: processors, graphics, memory, storage, motherboard, power_supply, cooling, cases
- **Marcas**: Intel, AMD, NVIDIA, Kingston, Corsair, Samsung, WD, Gigabyte, ASUS, MSI, Cooler Master, Seasonic

#### 📦 Pedidos
- **Campos**: id, cliente_nome, cliente_email, endereco_entrega, itens, valor_total, metodo_pagamento, status
- **Status**: pending, processing, shipped, delivered, cancelled
- **Pagamento**: credit_card, boleto, pix, debit_card

#### 👥 Clientes
- **Campos**: id, nome, email, telefone, cpf, endereco, status, total_gasto, numero_pedidos

## 🚀 Como Usar

### 📦 Instalação e Configuração

#### 1. Pré-requisitos
- **XAMPP**: Certifique-se de ter o XAMPP instalado.
- **Pasta do Projeto**: Este projeto deve estar na pasta `htdocs` do XAMPP (ex: `C:\xampp\htdocs\ecomerce`).

#### 2. Configuração do Banco de Dados
1. Abra o **XAMPP Control Panel** e inicie os módulos **Apache** e **MySQL**.
2. Acesse [http://localhost/phpmyadmin](http://localhost/phpmyadmin) no seu navegador.
3. Crie um novo banco de dados chamado `ecommerce`.
4. Clique na aba **Importar**, selecione o arquivo `setup.sql` localizado na raiz do projeto e clique em **Executar**.
   - Isso criará a tabela de usuários necessária para o login.

#### 3. Executando o Projeto
1. Com o Apache e MySQL rodando, acesse:
   - **[http://localhost/ecomerce](http://localhost/ecomerce)**

#### 4. Credenciais de Teste
- **Email**: `teste@techhub.com`
- **Senha**: `123456`

### 🌐 Acesso às Páginas

#### Loja Virtual
- **Home**: `index.html`
- **Produto Individual**: `produto.html?id={id_produto}`
- **Carrinho**: `carrinho.html`
- **Checkout**: `checkout.html`

#### Painel Administrativo
- **Dashboard**: `admin.html` (seção padrão)
- **Produtos**: `admin.html` → seção Produtos
- **Pedidos**: `admin.html` → seção Pedidos
- **Clientes**: `admin.html` → seção Clientes
- **Estoque**: `admin.html` → seção Estoque

### 🔐 Acesso Admin
- **Usuário**: Administrador
- **Função**: Gerente
- **Acesso**: Direto pela página admin.html

## 🎨 Design e Interface

### Paleta de Cores
- **Primária**: #2563eb (Azul)
- **Secundária**: #64748b (Cinza)
- **Sucesso**: #10b981 (Verde)
- **Aviso**: #f59e0b (Laranja)
- **Perigo**: #ef4444 (Vermelho)
- **Fundo Escuro**: #0f172a
- **Fundo Card**: #1e293b

### Tipografia
- **Fonte Principal**: Inter (Google Fonts)
- **Ícones**: Font Awesome 6.4.0

## 📊 Funcionalidades Avançadas

### 🛒 Carrinho de Compras
- Adicionar/remover produtos
- Alterar quantidades
- Aplicar cupons de desconto
- Cálculo automático de frete
- Sistema de favoritos

### 💰 Sistema de Descontos
- Cupons promocionais
- Descontos por método de pagamento
- Frete grátis por região

### 📈 Dashboard Administrativo
- Vendas totais e por período
- Gráficos de vendas por mês
- Análise de categorias mais vendidas
- Controle de estoque com alertas
- Gestão de status de pedidos

### 🔍 Filtros e Busca
- Filtros por categoria
- Filtros por marca
- Filtros por faixa de preço
- Busca por nome e descrição
- Ordenação por relevância/preço

## 📱 Responsividade

### Desktop (1200px+)
- Layout completo com sidebar
- Todas as funcionalidades disponíveis
- Dashboard com gráficos completos

### Tablet (768px - 1199px)
- Layout adaptado com menu hambúrguer
- Cards reorganizados
- Tabelas com scroll horizontal

### Mobile (até 767px)
- Interface otimizada para toque
- Menu lateral em drawer
- Formulários em coluna única
- Botões ampliados para fácil acesso

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com variáveis
- **JavaScript ES6+**: Funcionalidades interativas
- **Chart.js**: Gráficos e visualizações
- **Font Awesome**: Ícones vetoriais

### APIs e Serviços
- **RESTful API**: Comunicação com banco de dados
- **LocalStorage**: Armazenamento local do carrinho
- **ViaCEP**: Consulta de endereços por CEP

## 🔧 Configurações e Personalização

### Cores e Temas
Edite as variáveis CSS em `css/style.css`:
```css
:root {
    --primary-color: #2563eb;
    --dark-bg: #0f172a;
    --dark-card: #1e293b;
}
```

### Produtos e Categorias
Os produtos podem ser gerenciados através do painel administrativo ou adicionados diretamente no banco de dados.

### Métodos de Pagamento
Configure os métodos de pagamento e descontos em `js/carrinho.js`:
```javascript
const metodosPagamento = {
    cartao: { desconto: 0, parcelas: 10 },
    boleto: { desconto: 0.05, label: '5%' },
    pix: { desconto: 0.10, label: '10%' }
};
```

## 🚨 Manutenção e Suporte

### Atualizações
- Mantenha os arquivos JavaScript e CSS atualizados
- Verifique regularmente a disponibilidade de APIs externas
- Faça backup do banco de dados periodicamente

### Performance
- Otimize imagens antes de adicionar produtos
- Limpe o LocalStorage periodicamente
- Monitore o tamanho do carrinho para evitar overflow

### Segurança
- Valide todos os dados de entrada
- Implemente medidas de segurança no backend
- Use HTTPS para transmissão de dados sensíveis

## 📈 Melhorias Futuras Recomendadas

### Funcionalidades
- [ ] Sistema de avaliações e comentários
- [ ] Comparação entre produtos
- [ ] Histórico de navegação
- [ ] Recomendações personalizadas
- [ ] Programa de fidelidade
- [ ] Integração com redes sociais

### Técnico
- [ ] Implementação de PWA (Progressive Web App)
- [ ] Otimização de performance com lazy loading
- [ ] Implementação de SEO dinâmico
- [ ] Sistema de cache para melhor performance
- [ ] Internacionalização completa (i18n)

## 📞 Suporte

Para dúvidas e suporte técnico:
- **E-mail**: contato@techhub.com
- **Telefone**: (11) 9999-9999
- **Horário**: Seg-Sex: 9h-18h

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e comerciais. Todos os direitos reservados à TechHub.

---

**Última Atualização**: Janeiro 2024
**Versão**: 1.0.0
**Status**: Completo e Operacional 🟢