// Variáveis Globais
const openNavButton = document.getElementsByClassName('header__menu-btn')[0];
const closeNavButton = document.getElementsByClassName('nav__close-btn')[0];
const nav = document.getElementsByClassName('nav')[0];
const linkNav = document.getElementsByClassName('nav__link');
const currentPage = window.location.pathname.split("/").pop();

activeMenuItem();

// Função para abrir o menu de navegação
function openNav() {
    // Criar elemento HTML
    const newDiv = document.createElement('div');

    // Adicionar os devidos atributos ao elemento
    newDiv.classList.add('nav__overlay');

    // Adicionar o elemento ao body do HTML
    document.body.prepend(newDiv);
    console.log('Elemento criado com sucesso!');

    // Expandir o menu lateral
    nav.classList.add('nav--open');


    // Fechar o menu em caso de clique no overlay
    newDiv.addEventListener('click', () => {
        closeNav();
    });
}


// Função para fechar o menu de navegação
function closeNav() {
    // Recolher o menu lateral
    nav.classList.remove('nav--open');

    // Apagar elemento HTML
    const element = document.getElementsByClassName('nav__overlay')[0];
    element.remove();
    console.log('Elemento removido com sucesso!');
}


// Função para destacar a página no menu de navegação
function activeMenuItem() {
    for (let c = 0; c < linkNav.length; c++) {
        let href =  linkNav[c].getAttribute('href');
        // Remove a class de todos os itens do menu
        linkNav[c].classList.remove('nav__link-active');

        // Adiciona a class ao item do menu correspondente a página
        if (href === currentPage) {
            linkNav[c].classList.add('nav__link-active');
        };
    };
    console.log('Item no menu selecionado com sucesso!')
}


// Evento para abrir o menu de navegação
openNavButton.addEventListener('click', () => {
    openNav();
});


// Evento para fechar o menu de navegação
closeNavButton.addEventListener('click', () => {
    closeNav();
});