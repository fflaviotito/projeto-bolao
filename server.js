const express = require('express'); //Importa o framework express
const dotenv = require('dotenv'); //Importa as variáveis do arquivo .env
const cors = require('cors'); //Importa o pacite cors
const signupRouter = require('./src/routes/signupRouter'); //Importa as rotas de cadastro de usuário

dotenv.config(); //Carrega as variáveis importadas do .env

const app = express(); //Cria uma instância do servidor express
app.use(express.json()); // Middleware para analisar o corpo das requisições como JSON

//Configura as restições de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Permite requisições do Live Server
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type'], // Cabeçalhos permitidos
}));

//ROTAS
app.use(signupRouter); //Usa a rota de cadastro de usuário

//Rota simples de teste
app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

//Inicia o servidor na porta definida no arquivo .env
app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});