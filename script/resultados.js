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
const classificationTable = document.querySelectorAll('.classification-table__body tr') // Corpo da tabela de classificação


//========== Função para buscar informações da classificação ==========
const searchRating = async() => {
    try {
        const response = await fetch('http://localhost:3000/search-rating');

        if (!response.ok) {
            throw new Error('Erro ao buscar informações para atualizar a claissicação');
        }

        const rating = await response.json();
        updateRating(rating);
    } catch (error) {
        console.error('Erro: ', error.message);
    }
};


//========== Função para atualizar a classificação no HTML ==========
const updateRating = (rating) => {
    classificationTable.forEach((tbody, index) => {
        const tds = tbody.querySelectorAll('td');
        
        tds[1].textContent = rating[index].team_name;
        tds[3].textContent = rating[index].points;
        tds[4].textContent = rating[index].games_played;
        tds[5].textContent = rating[index].wins;
        tds[6].textContent = rating[index].draws;
        tds[7].textContent = rating[index].losses;
        tds[8].textContent = rating[index].goals_scored;
        tds[9].textContent = rating[index].goals_conceded;
        tds[10].textContent = rating[index].goal_difference;
    });
};


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
    // Atualizar as informações da partida
    matchInfo.forEach((div, index) => {
        const dateObj = new Date(matches[index].data_time);
        const localDate = dateObj.toLocaleDateString('pt-BR');
        const localTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const spans = div.querySelectorAll('span');

        spans[0].textContent = matches[index].stadium;
        spans[1].textContent = localDate;
        spans[2].textContent = localTime;
    });

    // Atualizar os confrontos e resultados da partida
    matchTeams.forEach((div, index) => {
        const spans = div.querySelectorAll('span');
        const imgs = div.querySelectorAll('img');

        spans[0].textContent = matches[index].home_team_name;
        spans[0].setAttribute('data-name', matches[index].home_team_name);
        spans[0].setAttribute('data-abbr', matches[index].home_team_short_name);
        spans[0].setAttribute('title', matches[index].home_team_name);
        imgs[0].src = matches[index].home_team_logo_url
        imgs[0].alt = `Escudo do ${matches[index].home_team_name}`
        imgs[0].title = matches[index].home_team_name;
        spans[1].textContent = matches[index].home_score;
        spans[3].textContent = matches[index].away_score;
        imgs[1].src = matches[index].away_team_logo_url
        imgs[1].alt = `Escudo do ${matches[index].away_team_name}`
        imgs[1].title = matches[index].away_team_name;
        spans[4].textContent = matches[index].away_team_name;
        spans[4].setAttribute('data-name', matches[index].away_team_name);
        spans[4].setAttribute('data-abbr', matches[index].away_team_short_name);
        spans[4].setAttribute('title', matches[index].away_team_name);
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
searchRating();