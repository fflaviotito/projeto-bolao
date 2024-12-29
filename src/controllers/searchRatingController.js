//========== Importações iniciais ==========
const connection = require('../database'); // Conexão com o banco de dados

//========== Função para os dados para monstar a classificação ==========
const getDataToClassify = async(req, res) => {
    try {
        const [rating] = await connection.promise().query(
            `SELECT 
                t.id AS team_id,
                t.name AS team_name,
            COUNT(CASE WHEN m.home_team_id = t.id AND m.home_score > m.away_score THEN 1
                WHEN m.away_team_id = t.id AND m.away_score > m.home_score THEN 1 END) AS wins,
            COUNT(CASE WHEN m.home_team_id = t.id AND m.home_score = m.away_score THEN 1
                WHEN m.away_team_id = t.id AND m.away_score = m.home_score THEN 1 END) AS draws,
            COUNT(CASE WHEN m.home_team_id = t.id AND m.home_score < m.away_score THEN 1
                WHEN m.away_team_id = t.id AND m.away_score < m.home_score THEN 1 END) AS losses,
            SUM(CASE WHEN m.home_team_id = t.id THEN m.home_score
                WHEN m.away_team_id = t.id THEN m.away_score ELSE 0 END) AS goals_scored,
            SUM(CASE WHEN m.home_team_id = t.id THEN m.away_score
                WHEN m.away_team_id = t.id THEN m.home_score ELSE 0 END) AS goals_conceded,
            (SUM(CASE WHEN m.home_team_id = t.id THEN m.home_score
                WHEN m.away_team_id = t.id THEN m.away_score ELSE 0 END) -
            SUM(CASE WHEN m.home_team_id = t.id THEN m.away_score
                WHEN m.away_team_id = t.id THEN m.home_score ELSE 0 END)) AS goal_difference,
            (3 * COUNT(CASE WHEN m.home_team_id = t.id AND m.home_score > m.away_score THEN 1
                WHEN m.away_team_id = t.id AND m.away_score > m.home_score THEN 1 END) +
            COUNT(CASE WHEN m.home_team_id = t.id AND m.home_score = m.away_score THEN 1
                WHEN m.away_team_id = t.id AND m.away_score = m.home_score THEN 1 END)) AS points,
            COUNT(DISTINCT m.id) AS games_played
            FROM 
                teams t
            LEFT JOIN 
                matches m ON t.id = m.home_team_id OR t.id = m.away_team_id
            GROUP BY 
                t.id
            ORDER BY 
                points DESC, 
                wins DESC, 
                goal_difference DESC, 
                goals_scored DESC;
                `);
            res.json(rating);
    } catch (error) {
        console.error('Erro ao buscar informações:', error.message);
        res.status(500).json({ error: 'Erro ao buscar informações' });
    }
};

module.exports = getDataToClassify;