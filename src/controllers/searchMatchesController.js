//========== Importações iniciais ==========
const connection = require('../database'); // Conexão com o banco de dados


// Função para buscar partidas por rodada
const getMatchesByRound = async (req, res) => {
    const { round } = req.params;

    try {
        const [matches] = await connection.promise().query(
        `SELECT
            matches.data_time,
            matches.stadium,
            matches.home_score,
            matches.away_score,
            home_team.name AS home_team_name,
            away_team.name AS away_team_name,
             home_team.logo_url AS home_team_logo_url,
            away_team.logo_url AS away_team_logo_url,
            home_team.short_name AS home_team_short_name,
            away_team.short_name AS away_team_short_name
        FROM
            matches
        INNER JOIN
            teams AS home_team ON matches.home_team_id = home_team.id
        INNER JOIN
            teams AS away_team ON matches.away_team_id = away_team.id
        WHERE
        matches.rounds = ?;`, [round]
        );

        res.json(matches);
        console.log(matches);
    } catch (error) {
        console.error('Erro ao buscar partidas:', error.message);
        res.status(500).json({ error: 'Erro ao buscar partidas' });
    };
};

module.exports = getMatchesByRound;