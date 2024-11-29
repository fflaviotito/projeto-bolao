const bcrypt = require('bcrypt'); // Importa o bcrypt para comparar senhas
const connection = require('../database'); // Conexão com o banco de dados

const loginUser = async (req, res) => {
    //========== Extrai os dados do corpo da requisição ==========
    const { email, password } = req.body;


    //========== Verifica se todos os campos obrigatórios foram fornecidos ==========
    if (!email || !password) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    //========== Tratamento de Erro ==========
    try {
        //========== Busca o e-mail no banco de dados ==========
        const query = 'SELECT * FROM users WHERE email = ?';
        const [results] = await connection.promise().query(query, [email]);

        if (results.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        

        //========== Captura a senha do banco de dados ==========
        const user = results[0]; // O usuário encontrado
        const hashedPassword = user.password; // Senha armazenada no banco


        //========== Compara a senha fornecida com a senha armazenada ==========
        const isMatch = await bcrypt.compare(password, hashedPassword);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Senha incorreta." });
        }

        //========== Usuário autenticado com sucesso ==========
        return res.status(200).json({
            message: "Login realizado com sucesso.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        console.error("Erro ao realizar login:", error);
        return res.status(500).json({ message: "Erro no servidor. Tente novamente mais tarde." });
    }
};

module.exports = loginUser;