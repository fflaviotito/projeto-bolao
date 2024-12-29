//========== Adicionando script do nav ao header do HTML ==========
const newScript = document.createElement('script');
newScript.src = '../script/default-nav.js';
document.head.appendChild(newScript);


//========== Importações, constantes e variáveis iniciais ==========
const roundDropdown = document.getElementById('rodada'); // Select com as opções das rodadas
const prevButton = document.getElementsByClassName('prev')[0]; // Botão de rodada anterior
const nextButton = document.getElementsByClassName('next')[0]; // Botão de próxima rodada
const matchInfo = document.querySelectorAll('.match-info'); // Div (bloco) de informações das partidas
const matchTeams = document.querySelectorAll('.match-teams'); // Div (bloco) de confornto e resultado das partidas


//========== Função para buscar partidas no banco de dados ==========
const fetchMatches = async(round) => {
    try {
        const response = await fetch(`http://localhost:3000/matches/${round}`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar partidas');
        };

        const matches = await response.json();
        updateMatchesList(matches);
    } catch (error) {
        console.error('Erro: ', error.message);
    };
};


//========== Função para atualizar as partidas no HTML ==========
const updateMatchesList = (matches) => {
    matchInfo.forEach((div, index) => {
        const dateObj = new Date(matches[index].data_time);
        const localDate = dateObj.toLocaleDateString('pt-BR');
        const localTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const spans = div.querySelectorAll('span');

        spans[0].textContent = matches[index].stadium;
        spans[1].textContent = localDate;
        spans[2].textContent = localTime;
    });

    matchTeams.forEach((div, index) => {
        const spans = div.querySelectorAll('span');
        const imgs = div.querySelectorAll('img');

        spans[0].textContent = matches[index].home_team_name;
        spans[0].setAttribute('data-name', matches[index].home_team_name);
        spans[0].setAttribute('data-abbr', matches[index].home_team_short_name);
        imgs[0].src = matches[index].home_team_logo_url
        spans[1].textContent = matches[index].home_score;
        spans[3].textContent = matches[index].away_score;
        imgs[1].src = matches[index].away_team_logo_url
        spans[4].textContent = matches[index].away_team_name;
        spans[4].setAttribute('data-name', matches[index].away_team_name);
        spans[4].setAttribute('data-abbr', matches[index].away_team_short_name);
    });
    adjustTeamNames();
};


//========== Função para alterar o nome dos times entre completo e abreviado ==========
function adjustTeamNames() {
    const screenWidth = window.innerWidth;
    const teamElements = document.querySelectorAll('.match-teams__team');

    teamElements.forEach(element => {
        if (screenWidth < 550 || screenWidth >= 1200) {
            element.textContent = element.getAttribute('data-abbr');
        } else {
            element.textContent = element.getAttribute('data-name');
        };
    });
};


//========== Evento de clique no botão para rodada anterior ==========
prevButton.addEventListener('click', () => {
    const currentRound = parseInt(roundDropdown.value, 10);
    if (currentRound > 1) {
        roundDropdown.value = currentRound - 1;
        fetchMatches(roundDropdown.value);
    };
});


//========== Evento de clique para mudança de rodada no dropdown ==========
roundDropdown.addEventListener('change', (e) => {
    const selectedRound = e.target.value;
    fetchMatches(selectedRound);
});


//========== Evento de clique no botão para próxima rodada ==========
nextButton.addEventListener('click', () => {
    const currentRound = parseInt(roundDropdown.value, 10);
    if (currentRound < 38) {
        roundDropdown.value = currentRound + 1;
        fetchMatches(roundDropdown.value);
    };
});


//========== Evento para ações de responsividade ==========
window.addEventListener('resize', () => {
    adjustTeamNames()
});


//========== Evento inicial ao carregar a página ==========
fetchMatches(roundDropdown.value);
adjustTeamNames();