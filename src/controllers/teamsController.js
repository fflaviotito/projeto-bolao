//========== Importações iniciais ==========
const axios = require('axios'); // Importa o axios para comunicação via API-Football
const connection = require('../database'); // Conexão com o banco de dados


//========== Função para buscar os dados da API ==========
const fetchTeamsFromAPI = async () => {
    try {
        // Realizando a requisição GET para a API externa
        const response = await axios.get('https://v3.football.api-sports.io/teams', {
            params: {
                league: 71, // ID da liga do Campeonato Brasileiro
                season: 2022, // Você pode alterar para o ano da temporada atual
              },
              headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-rapidapi-key': '9de40dc219484f173fd913e6e9ea3649' // Substitua com sua chave de API real
              }
        });
        
        // Retorna os dados obtidos da API
        return response.data;
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter os dados dos times', error: error.message });
    };
};


//========== Função para inserir os dados no banco de dados ==========
 const insertTeamsDatabase = async (teams) => {
    try {
        for (const teamObj of teams) {
            const team = teamObj.team;
            const logoUrl = team.logo;

           // Query para inserir ou atualizar os times
           const query = `
                INSERT INTO teams (api_team_id, name, short_name, logo_url)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                short_name = VALUES(short_name),
                logo_url = VALUES(logo_url)
            `;
            
            // Executa a query com os valores do time
            await connection.promise().query(query, [
                team.id,
                team.name,
                team.code,
                logoUrl
            ]);
        };
    } catch (error) {
        throw new Error('Erro ao inserir ou atualizar os times no banco de dados: ' + error.message);
    };
 };


//========== Função chamada pelo Routes ==========
const updateTeams = async(req, res) => {
    try {
        const teamsData = await fetchTeamsFromAPI(); // Chama a função para buscar dados da API

        if (!teamsData || !teamsData.response) {
            return res.status(500).json({ message: 'Nenhum dado encontrado na API.' });
        }

        const teams = teamsData.response;

        await insertTeamsDatabase(teams); // Chama para inserir os dados no banco de dados

        res.status(200).json({ message: 'Times atualizados com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar dados dos times.'});
    };
};

module.exports = updateTeams;