const connection = require('../database'); // Importa a conexão com o banco de dados

const registerUser = async (req, res) => {
    // Extrai os dados do corpo da requisição
    const { name, formattedDate, email, password } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!name || !formattedDate || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    try {
        // Insere o novo usuário no banco de dados
        const query = 'INSERT INTO users (name, birth_date, email, password) VALUES (?, ?, ?, ?)';
        await connection.execute(query, [name, formattedDate, email, password]);

        // Retorna sucesso
        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        // Retorna um erro genérico de servidor
        return res.status(500).json({ message: "Erro no servidor. Tente novamente mais tarde." });
    }
};

module.exports = registerUser;