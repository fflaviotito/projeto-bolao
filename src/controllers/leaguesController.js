//========== Importações iniciais ==========
const axios = require('axios'); // Importa o axios para comunicação via API-Football
const connection = require('../database'); // Conexão com o banco de dados
const dotenv = require('dotenv'); // Importa as variáveis do arquivo .env


//========== Carrega as variáveis importadas do .env ==========
dotenv.config();


//========== Função para buscar os dados da liga na API ==========
const fetchLeagueFromAPI = async () => {
    try {
        // Realizando a requisição GET para a API externa
        const response = await axios.get('https://v3.football.api-sports.io/leagues', {
            params: {
                id: 71,
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
        throw new Error('Erro ao obter os dados da liga da API: ' + error.message);
    }
};


//========== Função para inserir ou atualizar os dados da liga no banco ==========
const insertLeague = async (leagueData) => {
    try {
        // Extraindo as informações necessárias da API
        const league = {
            id: leagueData.response[0].league.id,
            name: leagueData.response[0].league.name,
            country: leagueData.response[0].country.name,
            season: leagueData.response[0].seasons[0].year,
            logoUrl: leagueData.response[0].league.logo,
        };

        // Query para inserir ou atualizar as ligas
        const query = `
        INSERT INTO leagues (api_league_id, name, country, season, logo_url)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            country = VALUES(country),
            season = VALUES(season),
            logo_url = VALUES(logo_url)
        `;

        // Executa a query com os valores da liga
        await connection.promise().query(query, [
            league.id,
            league.name,
            league.country,
            league.season,
            league.logoUrl
        ]);

        console.log(`Liga "${league.name}" inserida ou atualizada com sucesso.`);
    } catch (error) {
        console.error('Erro ao inserir ou atualizar a liga no banco de dados:', error.message);
        throw error;
    };
};


//========== Função chamada pelo Routes ==========
const updateLeague = async (req, res) => {
    try {
        const leagueData = await fetchLeagueFromAPI(); // Chama a função que busca os dados da liga na API

        if (!leagueData || !leagueData.response || leagueData.response.length === 0) {
            return res.status(500).json({ message: 'Nenhum dado encontrado para a liga.' });
        };

        await insertLeague(leagueData); // Chama a função que insere ou atualiza a liga no banco de dados

        res.status(200).json({ message: 'Liga atualizada com sucesso!' }); // Responde ao cliente com uma mensagem de sucesso
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar dados da liga.', error: error.message });
    }
};

module.exports = updateLeague;