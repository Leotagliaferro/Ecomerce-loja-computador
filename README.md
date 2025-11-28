# 🚀 TechHub E-commerce System

Bem-vindo ao **TechHub**, um sistema de e-commerce completo desenvolvido com PHP, MySQL e JavaScript. Este documento fornece todas as orientações necessárias para configurar, rodar e modificar o sistema.

## 📋 Pré-requisitos

Para rodar este projeto, você precisará de um ambiente de servidor local. Recomendamos o **XAMPP**:

*   **XAMPP** (com Apache e MySQL) - [Download aqui](https://www.apachefriends.org/pt_br/index.html)

## ⚙️ Instalação e Configuração

Siga os passos abaixo para colocar o sistema no ar:

1.  **Clone ou Baixe o Projeto**
    *   Coloque a pasta do projeto (ex: `ecomerce`) dentro do diretório `htdocs` do seu XAMPP (geralmente em `C:\xampp\htdocs\`).

2.  **Inicie os Serviços**
    *   Abra o **XAMPP Control Panel**.
    *   Inicie os módulos **Apache** e **MySQL** (clique em "Start").

3.  **Configuração do Banco de Dados**
    *   O sistema possui um script de configuração automática.
    *   Acesse no seu navegador: `http://localhost/ecomerce/setup_database.php`
    *   Se tudo der certo, você verá uma mensagem de sucesso e as tabelas serão criadas automaticamente.

    > **Nota:** O script tentará conectar ao MySQL com usuário `root` e senha vazia (padrão do XAMPP). Se sua configuração for diferente, edite o arquivo `backend/db.php` e `setup_database.php`.

## 🚀 Como Usar

Após a configuração, acesse a página inicial:
👉 `http://localhost/ecomerce/index.html`


### Contas de Teste
O sistema já vem com usuários pré-configurados para teste:

*   **Administrador:**
    *   Email: `admin@techhub.com`
    *   Senha: `password`
*   **Usuário Comum:**
    *   Email: `teste@techhub.com`
    *   Senha: `123456`

## 🔗 Links Rápidos
Aqui estão os links diretos para as principais páginas do sistema:

*   **🏠 Home**: [http://localhost/ecomerce/index.html](http://localhost/ecomerce/index.html)
*   **🛍️ Produtos**: [http://localhost/ecomerce/produtos.html](http://localhost/ecomerce/produtos.html)
*   **🛒 Carrinho**: [http://localhost/ecomerce/carrinho.html](http://localhost/ecomerce/carrinho.html)
*   **💳 Checkout**: [http://localhost/ecomerce/checkout.html](http://localhost/ecomerce/checkout.html)
*   **👤 Login**: [http://localhost/ecomerce/login.html](http://localhost/ecomerce/login.html)
*   **⚙️ Admin**: [http://localhost/ecomerce/admin.html](http://localhost/ecomerce/admin.html)
*   **📞 Contato**: [http://localhost/ecomerce/contato.html](http://localhost/ecomerce/contato.html)
*   **ℹ️ Sobre**: [http://localhost/ecomerce/sobre.html](http://localhost/ecomerce/sobre.html)
*   **🛠️ Setup Banco**: [http://localhost/ecomerce/setup_database.php](http://localhost/ecomerce/setup_database.php)


## 📂 Estrutura do Projeto

Para ajudar você a "mexer" no sistema, aqui está o mapa dos arquivos principais:

### 🎨 Frontend (Interface)
*   **`index.html`**: Página inicial com vitrine de produtos.
*   **`login.html` / `registro.php`**: Páginas de autenticação.
*   **`carrinho.html`**: Visualização do carrinho de compras.
*   **`css/`**: Contém os arquivos de estilo (CSS).
*   **`js/`**: Scripts JavaScript.
    *   `app.js`: Lógica principal (carrinho, renderização, eventos).
    *   `api.js`: Centraliza todas as chamadas para o backend (fetch).

### 🧠 Backend (Lógica e Dados)
Os arquivos PHP ficam na pasta `backend/` e na raiz (alguns legados):

*   **`backend/db.php`**: Arquivo de conexão com o banco de dados. **Mexa aqui se precisar mudar a senha do banco.**
*   **`backend/listar_produtos.php`**: API que retorna os produtos do banco (JSON).
*   **`backend/login.php`**: Processa o login do usuário.
*   **`backend/processar_pedido.php`**: Recebe o pedido finalizado.
*   **`setup.sql`**: Arquivo SQL com a estrutura do banco e dados iniciais.

## 🛠️ Dicas para Desenvolvimento

1.  **Adicionar Novos Produtos:**
    *   Você pode inserir diretamente no banco de dados (tabela `produtos`) ou usar a interface de admin (se implementada).
    *   Alternativamente, edite o arquivo `setup.sql` e rode o `setup_database.php` novamente (cuidado, isso pode resetar o banco!).

2.  **Alterar o Layout:**
    *   Edite os arquivos na pasta `css/`. O sistema usa variáveis CSS para cores, facilitando a troca de temas.

3.  **Depuração:**
    *   Se algo não funcionar, abra o **Console do Desenvolvedor** (F12) no navegador para ver erros de JavaScript.
    *   Verifique a aba **Network** (Rede) para ver se as requisições para os arquivos `.php` estão retornando 200 OK.

---
*Desenvolvido para fins educacionais e de teste.*
