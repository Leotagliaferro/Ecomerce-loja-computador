document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginSenha').value;
            const button = loginForm.querySelector('button');
            const originalText = button.textContent;

            // Loading state
            button.textContent = 'Entrando...';
            button.disabled = true;

            try {
                const response = await fetch('backend/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (data.success) {
                    // Save user to localStorage
                    localStorage.setItem('techhub_user', JSON.stringify(data.user));

                    // Show success message
                    mostrarNotificacao('Login realizado com sucesso!', 'success');

                    // Redirect after delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    mostrarNotificacao(data.message || 'Erro ao realizar login', 'error');
                    button.textContent = originalText;
                    button.disabled = false;
                }
            } catch (error) {
                console.error('Erro:', error);
                mostrarNotificacao('Erro de conexão com o servidor', 'error');
                button.textContent = originalText;
                button.disabled = false;
            }
        });
    }

    // Register form handler
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('registerNome').value;
            const email = document.getElementById('registerEmail').value;
            const senha = document.getElementById('registerSenha').value;
            const confirmarSenha = document.getElementById('registerConfirmarSenha').value;
            const button = registerForm.querySelector('button');
            const originalText = button.textContent;

            // Validate passwords match
            if (senha !== confirmarSenha) {
                mostrarNotificacao('As senhas não coincidem', 'error');
                return;
            }

            // Loading state
            button.textContent = 'Cadastrando...';
            button.disabled = true;

            try {
                const response = await fetch('backend/registro.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, senha, confirmarSenha })
                });

                const data = await response.json();

                if (data.success) {
                    // Auto login after successful registration
                    localStorage.setItem('techhub_user', JSON.stringify(data.user));

                    mostrarNotificacao('Cadastro realizado com sucesso!', 'success');

                    // Redirect after delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    mostrarNotificacao(data.message || 'Erro ao realizar cadastro', 'error');
                    button.textContent = originalText;
                    button.disabled = false;
                }
            } catch (error) {
                console.error('Erro:', error);
                mostrarNotificacao('Erro de conexão com o servidor', 'error');
                button.textContent = originalText;
                button.disabled = false;
            }
        });
    }
});

// Tab switching function
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');

    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

function mostrarNotificacao(mensagem, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${mensagem}</span>
    `;

    document.body.appendChild(toast);

    // Ensure styles exist (if not loaded from style.css yet)
    if (!document.querySelector('style[data-toast]')) {
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success-color, #22c55e);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 3000;
                animation: slideInRight 0.3s ease-out;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }
            .toast.error {
                background: var(--danger-color, #ef4444);
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        style.setAttribute('data-toast', 'true');
        document.head.appendChild(style);
    }

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
