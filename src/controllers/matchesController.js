//========== Importações iniciais ==========
const axios = require('axios'); // Importa o axios para comunicação via API-Football
const connection = require('../database'); // Conexão com o banco de dados
const dotenv = require('dotenv'); // Importa as variáveis do arquivo .env


//========== Carrega as variáveis importadas do .env ==========
dotenv.config();


//========== Função para buscar os dados das partidas na API ==========
const fetchMatchesFromAPI = async () => {
    try {
        // Realizando a requisição GET para a API externa
        const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
            params: {
                league: 71,
                season: 2022,
            },
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-rapidapi-key': process.env.API_FOOTBALL_KEY
            }
        });

         // Retorna os dados obtidos da API
        return response.data;
    } catch (error) {
        console.error('Erro ao obter os dados das partidas:', error.message);
        throw new Error('Erro ao buscar partidas na API: ' + error.message);
    };
};


//========== Função para inserir ou atualizar os dados das partidas no banco de dados ==========
const insertMatches = async(extractedMatches) => {
    let tableLeaguesID;
    let tableTeamsHomeID;
    let tableTeamsAwayID;

    // Tratamento de erro para consultas ao banco de dados
    try {
        // Verificando o ID próprio da liga
        const [rowsLeague] = await connection.promise().query('SELECT id FROM leagues WHERE api_league_id = ?', extractedMatches[0].league_id);
        if (rowsLeague.length > 0) {
            tableLeaguesID = rowsLeague[0].id;
            console.log('ID próprio da liga: ', tableLeaguesID);
        };
    } catch (error) {
        console.error('Erro ao consultar informações do banco de dados:', error.message);
    };

    // Tratamento de erro para inserção ou atualização de informações no banco de dados
    try {
        for (const match of extractedMatches) {
            // Verificando o ID próprio do time mandante
            const [rowsTeamHome] = await connection.promise().query('SELECT id FROM teams WHERE api_team_id = ?', match.home_team_id);
            if (rowsTeamHome.length > 0) {
                tableTeamsHomeID = rowsTeamHome[0].id;
                console.log('ID próprio do time mandante: ', tableTeamsHomeID);
            };

            // Verificando o ID próprio do time visitante
            const [rowsTeamAway] = await connection.promise().query('SELECT id FROM teams WHERE api_team_id = ?', match.away_team_id);
            if (rowsTeamAway.length > 0) {
                tableTeamsAwayID = rowsTeamAway[0].id;
                console.log('ID próprio do time mandante: ', tableTeamsAwayID);
            };

            // Query para inserir ou atualizar a partida
            const query = `
                INSERT INTO matches 
                    (api_match_id,
                    league_id,
                    home_team_id,
                    away_team_id,
                    rounds,
                    data_time,
                    stadium,
                    home_score,
                    away_score)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    league_id = VALUES(league_id),
                    home_team_id = VALUES(home_team_id),
                    away_team_id = VALUES(away_team_id),
                    rounds = VALUES(rounds),
                    data_time = VALUES(data_time),
                    stadium = VALUES(stadium),
                    home_score = VALUES(home_score),
                    away_score = VALUES(away_score)
            `;

            // Executa a query para inserir ou atualizar a partida
            await connection.promise().query(query, [
                match.id,
                tableLeaguesID,
                tableTeamsHomeID,
                tableTeamsAwayID,
                match.rounds,
                match.data_time,
                match.stadium,
                match.home_score,
                match.away_score
            ]);
        }
    } catch (error) {
        console.error("Erro ao adicionar ou atualizar a partida:", error);
    };
};


//========== Função chamada pelo Routes ==========
const updateMatches = async(req, res) => {
    try {
        const matchesData = await fetchMatchesFromAPI(); // Chama a função que busca os dados da liga na API

        if (!matchesData || !matchesData.response || matchesData.response.length === 0) {
        return res.status(500).json({ message: 'Nenhum dado encontrado para as partidas.' });
        };

        // Extraindo as informações necessárias da API
        const extractedMatches = matchesData.response.map(match => ({
            id: match.fixture.id, // ID do fixture
            league_id: match.league.id,  // ID da liga
            home_team_id: match.teams.home.id, // ID do time da casa
            away_team_id: match.teams.away.id, // ID do time visitante
            rounds: match.league.round.split(' ')[3], // Número da rodada (extraído do texto "Regular Season - X")
            data_time: match.fixture.date, // Data da partida
            stadium: match.fixture.venue.name, // Nome do estádio
            home_score: match.goals.home, // Resultado do time da casa
            away_score: match.goals.away  // Resultado do time visitante
        }));
    
        await insertMatches(extractedMatches); // Chama a função que insere ou atualiza as partidas no banco de dados

        res.status(200).json({ message: 'Liga atualizada com sucesso!' }); // Responde ao cliente com uma mensagem de sucesso
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar dados das partidas.', error: error.message });
    };
};

module.exports = updateMatches;