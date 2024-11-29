const bcrypt = require('bcrypt'); // Importa o bcrypt para hashing de senhas
const connection = require('../database'); // Importa a conexão com o banco de dados

const registerUser = async (req, res) => {
    //========== Extrai os dados do corpo da requisição ==========
    const { name, formattedDate, email, password } = req.body;


    //========== Verifica se todos os campos obrigatórios foram fornecidos ==========
    if (!name || !formattedDate || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    //========== Tratamento de Erro ==========
    try {
        //========== Verifica se o email já é cadastrado ==========
        const checkEmailQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';

        const [results] = await connection.promise().query(checkEmailQuery, [email]);
        const count = results[0].count;
        
        if (count > 0) {
            return res.status(400).json({ message: 'E-mail já cadastrado.' });
        }


        //========== Hash da senha ==========
        const hashedPassword = await bcrypt.hash(password, 10);


        //========== Insere o novo usuário no banco de dados ==========
        const query = 'INSERT INTO users (name, birth_date, email, password) VALUES (?, ?, ?, ?)';
        await connection.execute(query, [name, formattedDate, email, hashedPassword]);

        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).json({ message: "Erro no servidor. Tente novamente mais tarde." });
    }
};

module.exports = registerUser;