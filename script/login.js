// Variáveis globais
const changeForm = document.querySelectorAll('.change-form'); //Buttons para mudar o formulário
const containerLoginForm = document.getElementsByClassName('container-form')[0]; //Container do formulário de cadastro
const containerSignupForm = document.getElementsByClassName('container-form')[1]; //Container do formulário de login
const iconPassword = document.querySelectorAll('.fa-lock'); //Icones dos inputs de senha
const inputPassword = document.querySelectorAll('.password'); //Inputs do tipo senha
const signupForm = document.getElementById('form-signup'); //Formulário de cadastro
const signupName = document.getElementById('signup-name'); //Input do nome completo do formulário de cadastro
const signupDate = document.getElementById('signup-date'); //Input da data de nascimento do formulário de cadastro
const signupEmail = document.getElementById('signup-email'); //Input do email do formulário de cadastro
const signupPassword = document.getElementById('signup-password'); //Input da senha do formulário de cadastro
const signupConfirmPassword = document.getElementById('signup-confirm-password'); //Input da confirmação da senha do formulário de cadastro
const loginForm = document.getElementById('form-login'); //Formulário de login
const loginEmail = document.getElementById('login-email'); //Input do email do formulário de login
const loginPassword = document.getElementById('login-password'); //Input da senha do formulário de login

//Altera visualização entre fromulários de login e cadastro
changeForm.forEach(function(event) {
    event.addEventListener('click', function() {
        containerLoginForm.classList.toggle('off');
        containerSignupForm.classList.toggle('off');
    });
});

//Formata o input de nome completo do cadastro
signupName.addEventListener('input', function () {
    this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
});

//Validar o input de nome completo do cadastro
signupName.addEventListener('blur', function () {
    const name = this.value.trim();
    if (name.length <= 3 || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name)) {
        //Caso o input tenha menos de 4 caracteres
        signupName.classList.remove('correct-input');
        signupName.classList.add('incorrect-input');
    } else {
        //Caso o input tenha 4+ caracteres
        signupName.classList.remove('incorrect-input');
        signupName.classList.add('correct-input');
    };
});

//Formatar o input de data de nascimento do cadastro
signupDate.addEventListener('input', function () {
    let value = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (value.length > 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length > 5) {
        value = value.slice(0, 5) + "/" + value.slice(5);
    }
    this.value = value.slice(0, 10); // Limita a 10 caracteres
});

//Validar quantidade de caracteres do input de data de nascimento do cadastro
signupDate.addEventListener('blur', function () {
    const valueInput = this.value.trim();
    if (valueInput.length < 10) {
        //Caso o input tenha menos de 10 caracteres
        signupDate.classList.remove('correct-input');
        signupDate.classList.add('incorrect-input');
    } else {
        //Caso o input tenha 10 caracteres
        validateBirthDate(valueInput); //Executa a function para validar a data
    };
});

//Function para validar o input de data de nascimento do cadastro (Data válida e idade mínima)
function validateBirthDate(dateStr) {
    const today = new Date(); // Data e horas atuais
    const dayToday = today.getDate(); // Obtém o dia do mês (1-31)
    const monthToday = today.getMonth() + 1; // Obtém o mês (0-11) e adiciona 1, já que janeiro é 0
    const yearToday = today.getFullYear(); // Obtém o ano completo (ex.: 2024)

    const [day, month, year] = dateStr.split("/").map(Number); 
    
    //Data válida
    if (day < 0 || day > 31 ||
        month < 0 || month > 12 ||
        year < yearToday-100 || year > yearToday) {
            signupDate.classList.add('incorrect-input');
            return;
    };

    if (month == 4 || month == 6 || month == 9 || month == 11) {
        if (day == 31) {
            signupDate.classList.add('incorrect-input');
            return;
        };
    } else if (month == 2) {
        if(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
            if(day > 29) {
                signupDate.classList.add('incorrect-input');
                return;
            }
        } else if (day > 28) {
            signupDate.classList.add('incorrect-input');
            return; 
        };
    };

    //Idade mínima
    if (yearToday - year < 18) {
        signupDate.classList.add('incorrect-input');
        return;
    };

    if (yearToday - year == 18) {
        if (monthToday < month) {
            signupDate.classList.add('incorrect-input');
            return;
        } else 

        if (monthToday == month) {
            if (dayToday < day) {
                signupDate.classList.add('incorrect-input');
                return;
            };
        };
    };
    signupDate.classList.remove('incorrect-input');
    signupDate.classList.add('correct-input');
};

//Formatar o input de e-mail do cadastro
signupEmail.addEventListener('input', () => {
    signupEmail.value = signupEmail.value.trim().toLowerCase();
});

//Validar o input de e-mail do cadastro
signupEmail.addEventListener('blur', function () {
    const emailValue = signupEmail.value;
    signupEmail.classList.remove('correct-input');

    // Campo vazio
    if (!emailValue) {
        signupEmail.classList.add('incorrect-input');
        return;
    }
    
    // Formato inválido
    if (!isValidEmail(emailValue)) {
        signupEmail.classList.add('incorrect-input');
        return;
    }

    signupEmail.classList.remove('incorrect-input');
    signupEmail.classList.add('correct-input');
});

//Function para validar o formato do input de e-mail do cadastro
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

//Formatar o input de senha do cadastro (Não aceitar espaços)
signupPassword.addEventListener("input", () => {
    signupPassword.value = signupPassword.value.replace(/\s/g, "");
});

//Validar o input de senha do cadastro
signupPassword.addEventListener('blur', function () {
    // Regex para validar a senha
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    const passwordValue = signupPassword.value;
    signupPassword.classList.remove('correct-input');

    if (!passwordValue) {
        signupPassword.classList.add('incorrect-input');
        return;
    };
    
    if (!passwordRegex.test(passwordValue)) {
        signupPassword.classList.add('incorrect-input');
        return;
    };

    signupPassword.classList.remove('incorrect-input');
    signupPassword.classList.add('correct-input');

    //Formatando o campo de confirmação de senha
    if (signupConfirmPassword.value != signupPassword.value) {
        signupConfirmPassword.classList.remove('correct-input');
        signupConfirmPassword.classList.add('incorrect-input');
        return;
    } else {
        signupConfirmPassword.classList.remove('incorrect-input');
        signupConfirmPassword.classList.add('correct-input');
    };
});

//Identifica o index do ícone clicado e altera o type do input correspondente entre text e password
iconPassword.forEach((item, index) => {
    item.addEventListener('click', () => {
        iconPassword[index].classList.toggle('fa-unlock');
        const type = inputPassword[index].type === 'password' ? 'text' : 'password';
        inputPassword[index].type = type;
    });
});

//Formatar o input de confirmar senha do cadastro (Não aceitar espaços)
signupConfirmPassword.addEventListener("input", () => {
    signupConfirmPassword.value = signupConfirmPassword.value.replace(/\s/g, "");
});

//Validar o input de confirmar senha do cadastro
signupConfirmPassword.addEventListener('input', function () {
    signupConfirmPassword.classList.remove('correct-input');
    // Regex para validar a senha
    if (signupConfirmPassword.value != signupPassword.value) {
        signupConfirmPassword.classList.add('incorrect-input');
        return;
    }
    signupConfirmPassword.classList.remove('incorrect-input');
    signupConfirmPassword.classList.add('correct-input');
});

//Evento de envio do formulário de cadastro, caso exista algum campo sem validação
signupForm.addEventListener("submit", async function (event) {
    // Seleciona todos os inputs dentro do formulário
    const inputs = this.querySelectorAll("input");

    // Verifica se todos os inputs possuem a classe "correct-input"
    const allCorrect = Array.from(inputs).every(input => input.classList.contains("correct-input"));

    // Impede o envio se algum input não tiver a classe "correct-input"
    if (!allCorrect) {
        event.preventDefault(); // Impede o envio do formulário
        alert("Por favor, corrija os campos destacados em vermelho!");
        return;
    };

    event.preventDefault();  // Evita o comportamento padrão do formulário (recarregar a página)

    // Coleta os valores dos inputs
    const name = signupName.value.trim();
    const birth_date = signupDate.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();

    //Formatando a data para aaaa-mm-dd
    const [day, month, year] = birth_date.split("/");
    const formattedDate = `${year}-${month}-${day}`;
    
    // Criando o objeto com os dados
    const formData = {
        name,
        formattedDate,
        email,
        password
    };

    try {
        // Envio dos dados para o backend via POST
        const response = await fetch('http://127.0.0.1:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', //Definindo o tipo de conteúdo
            },
            body: JSON.stringify(formData), //Envia os dados no formato JSON
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            const errorData = await response.json();
            alert('Erro: ' + errorData.message);
        } else {
            const data = await response.json();
            alert(data.message);  // Exibe a mensagem de sucesso do backend
            window.location.reload();
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        alert('Erro ao enviar os dados. Tente novamente mais tarde.');
    }
});    

//Formatar o input de e-mail do login
loginEmail.addEventListener('input', () => {
    loginEmail.value = loginEmail.value.trim().toLowerCase();
});

//Formatar o input de senha do login (Não aceitar espaços)
loginPassword.addEventListener("input", () => {
    loginPassword.value = loginPassword.value.replace(/\s/g, "");
});

//Impede o envio do formulário de login, caso exista algum campo sem validação
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();  // Evita o comportamento padrão do formulário (recarregar a página)
    
    const emailValue = loginEmail.value;
    const passwordValue = loginPassword.value;
    let hasError = false;

    //Campo de email ou senha vazio
    if (!emailValue || !passwordValue) {
        hasError = true;
    };
    
    //Formato de email inválido
    if (!isValidEmail(emailValue)) {
        hasError = true;
    };

    //Impede o envio do formulário se houver erro
    if(hasError) {
        alert("Preencha todos os campos com informações válidas!");
        loginEmail.value = "";
        loginPassword.value = "";
        return;
    };

    //========== Capturando dados do formulário ==========
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    const formData = {
        email,
        password
    };


    //========== Tratamento de erros ==========
    try {
        //========== Envio dos dados para o backend via POST ==========
        const response = await fetch('http://127.0.0.1:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', //Definindo o tipo de conteúdo
            },
            body: JSON.stringify(formData), //Envia os dados no formato JSON
        });


        //========== Verifica se a resposta foi bem-sucedida ==========
        if (!response.ok) {
            const errorData = await response.json();
            alert('Erro: ' + errorData.message);
        } else {
            const data = await response.json();
            alert(data.message);  // Exibe a mensagem de sucesso do backend
            window.location.reload();
        }

    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        alert('Erro ao enviar os dados. Tente novamente mais tarde.');
    }
});