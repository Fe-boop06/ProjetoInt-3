// Alternar entre as abas de Login e Cadastro
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        this.classList.add('active');
        document.getElementById(this.dataset.tab).classList.add('active');
    });
});

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username && password) {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            });

            if (response.ok) {
                window.location.href = '/pokedex'; // Redireciona para a Pokédex
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Erro no login');
            }
        } catch (error) {
            alert('Erro ao conectar ao servidor');
        }
    } else {
        alert('Preencha todos os campos.');
    }
});

// Validação do Formulário de Cadastro
document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (username && password && confirmPassword) {
        if (password === confirmPassword) {
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
                });

                if (response.ok) {
                    alert('Cadastro bem-sucedido! Faça login para continuar.');
                    document.querySelector('.tab-button[data-tab="login"]').click();
                } else {
                    const errorData = await response.json();
                    alert(errorData.detail || 'Erro no cadastro');
                }
            } catch (error) {
                alert('Erro ao conectar ao servidor');
            }
        } else {
            alert('As senhas não coincidem.');
        }
    } else {
        alert('Preencha todos os campos.');
    }
});