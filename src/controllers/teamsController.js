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
                season: 2024, // Você pode alterar para o ano da temporada atual
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


//========== Função chamada pelo Routes ==========
const updateTeams = async(req, res) => {
    try {
        const teams = await fetchTeamsFromAPI(); // Chama a função para buscar dados da API
        res.json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar dados dos times.'});
    };
};

module.exports = updateTeams;