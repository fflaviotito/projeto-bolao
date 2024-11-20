// Variáveis globais
const changeForm = document.querySelectorAll('.change-form'); //Buttons para mudar o formulário
const containerLoginForm = document.getElementsByClassName('container-form')[0]; //Container do formulário de cadastro
const containerSingupForm = document.getElementsByClassName('container-form')[1]; //Container do formulário de login
const iconPassword = document.querySelectorAll('.fa-lock'); //Icones dos inputs de senha
const inputPassword = document.querySelectorAll('.password'); //Inputs do tipo senha
const singupForm = document.getElementById('form-singup'); //Formulário de cadastro
const singupName = document.getElementById('singup-name'); //Input do nome completo do formulário de cadastro
const singupDate = document.getElementById('singup-date'); //Input da data de nascimento do formulário de cadastro
const singupEmail = document.getElementById('singup-email'); //Input do email do formulário de cadastro
const singupPassword = document.getElementById('singup-password'); //Input da senha do formulário de cadastro
const singupConfirmPassword = document.getElementById('singup-confirm-password'); //Input da confirmação da senha do formulário de cadastro
const loginForm = document.getElementById('form-login'); //Formulário de login
const loginEmail = document.getElementById('login-email'); //Input do email do formulário de login
const loginPassword = document.getElementById('login-password'); //Input da senha do formulário de login

//Altera visualização entre fromulários de login e cadastro
changeForm.forEach(function(event) {
    event.addEventListener('click', function() {
        containerLoginForm.classList.toggle('off');
        containerSingupForm.classList.toggle('off');
    });
});

//Formata o input de nome completo do cadastro
singupName.addEventListener('input', function () {
    this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
});

//Validar o input de nome completo do cadastro
singupName.addEventListener('blur', function () {
    const name = this.value.trim();
    if (name.length <= 3 || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name)) {
        //Caso o input tenha menos de 4 caracteres
        singupName.classList.remove('correct-input');
        singupName.classList.add('incorrect-input');
    } else {
        //Caso o input tenha 4+ caracteres
        singupName.classList.remove('incorrect-input');
        singupName.classList.add('correct-input');
    };
});

//Formatar o input de data de nascimento do cadastro
singupDate.addEventListener('input', function () {
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
singupDate.addEventListener('blur', function () {
    const valueInput = this.value.trim();
    if (valueInput.length < 10) {
        //Caso o input tenha menos de 10 caracteres
        singupDate.classList.remove('correct-input');
        singupDate.classList.add('incorrect-input');
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
            singupDate.classList.add('incorrect-input');
            return;
    };

    if (month == 4 || month == 6 || month == 9 || month == 11) {
        if (day == 31) {
            singupDate.classList.add('incorrect-input');
            return;
        };
    } else if (month == 2) {
        if(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
            if(day > 29) {
                singupDate.classList.add('incorrect-input');
                return;
            }
        } else if (day > 28) {
            singupDate.classList.add('incorrect-input');
            return; 
        };
    };

    //Idade mínima
    if (yearToday - year < 18) {
        singupDate.classList.add('incorrect-input');
        return;
    };

    if (yearToday - year == 18) {
        if (monthToday < month) {
            singupDate.classList.add('incorrect-input');
            return;
        } else 

        if (monthToday == month) {
            if (dayToday < day) {
                singupDate.classList.add('incorrect-input');
                return;
            };
        };
    };
    singupDate.classList.remove('incorrect-input');
    singupDate.classList.add('correct-input');
};

//Formatar o input de e-mail do cadastro
singupEmail.addEventListener('input', () => {
    singupEmail.value = singupEmail.value.trim().toLowerCase();
});

//Validar o input de e-mail do cadastro
singupEmail.addEventListener('blur', function () {
    const emailValue = singupEmail.value;
    singupEmail.classList.remove('correct-input');

    // Campo vazio
    if (!emailValue) {
        singupEmail.classList.add('incorrect-input');
        return;
    }
    
    // Formato inválido
    if (!isValidEmail(emailValue)) {
        singupEmail.classList.add('incorrect-input');
        return;
    }

    singupEmail.classList.remove('incorrect-input');
    singupEmail.classList.add('correct-input');
});

//Function para validar o formato do input de e-mail do cadastro
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

//Formatar o input de senha do cadastro (Não aceitar espaços)
singupPassword.addEventListener("input", () => {
    singupPassword.value = singupPassword.value.replace(/\s/g, "");
});

//Validar o input de senha do cadastro
singupPassword.addEventListener('blur', function () {
    // Regex para validar a senha
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    const passwordValue = singupPassword.value;
    singupPassword.classList.remove('correct-input');

    if (!passwordValue) {
        singupPassword.classList.add('incorrect-input');
        return;
    };
    
    if (!passwordRegex.test(passwordValue)) {
        singupPassword.classList.add('incorrect-input');
        return;
    };

    singupPassword.classList.remove('incorrect-input');
    singupPassword.classList.add('correct-input');

    //Formatando o campo de confirmação de senha
    if (singupConfirmPassword.value != singupPassword.value) {
        singupConfirmPassword.classList.add('incorrect-input');
        return;
    } else {
        singupConfirmPassword.classList.remove('incorrect-input');
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
singupConfirmPassword.addEventListener("input", () => {
    singupConfirmPassword.value = singupConfirmPassword.value.replace(/\s/g, "");
});

//Validar o input de confirmar senha do cadastro
singupConfirmPassword.addEventListener('blur', function () {
    singupConfirmPassword.classList.remove('correct-input');
    // Regex para validar a senha
    if (singupConfirmPassword.value != singupPassword.value) {
        singupConfirmPassword.classList.add('incorrect-input');
        return;
    }
    singupConfirmPassword.classList.remove('incorrect-input');
    singupConfirmPassword.classList.add('correct-input');
});

//Impede o envio do formulário de cadastro, caso exista algum campo sem validação
singupForm.addEventListener("submit", function (event) {
    // Seleciona todos os inputs dentro do formulário
    const inputs = this.querySelectorAll("input");

    // Verifica se todos os inputs possuem a classe "correct-input"
    const allCorrect = Array.from(inputs).every(input => input.classList.contains("correct-input"));

    // Impede o envio se algum input não tiver a classe "correct-input"
    if (!allCorrect) {
        event.preventDefault(); // Impede o envio do formulário
        alert("Por favor, corrija os campos destacados em vermelho!");
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
loginForm.addEventListener('submit', function(event) {
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
        event.preventDefault();
        loginEmail.value = "";
        loginPassword.value = "";
        alert("Preencha todos os campos com informações válidas!");
    };
});