//========== Importações iniciais ==========
const express = require('express'); // Importa o framework express
const dotenv = require('dotenv'); // Importa as variáveis do arquivo .env
const cors = require('cors'); // Importa o pacite cors
const signupRouter = require('./src/routes/signupRouter'); // Importa as rotas de cadastro de usuário
const loginRouter = require('./src/routes/loginRouter'); // Importa as rotas de login de usuário
const teamsRouter = require('./src/routes/teamsRouter'); // Importa as rotas de atualização dos times no banco de dados
const leaguesRouter = require('./src/routes/leaguesRouter'); // Importa as rotas de atualização das ligas no banco de dados
const matchesRouter = require('./src/routes/matchesRouter'); // Importa as rotas de atualização das partidas no banco de dados
const searchMatchesRouter = require('./src/routes/searchMatchesRouter'); // Importa as rotas de consulta das partidas no banco de dados
const searchRatingRouter = require('./src/controllers/searchRatingController'); // Importa as rotas de consulta ao banco de dados para classificação


//========== Carrega as variáveis importadas do .env ==========
dotenv.config();


//========== Configurações do servidor ==========
const app = express(); //Cria uma instância do servidor express
app.use(express.json()); // Middleware para analisar o corpo das requisições como JSON


//========== Configura as restições de CORS ==========
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Permite requisições do Live Server
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type'], // Cabeçalhos permitidos
}));


// ========== Rotas ==========
app.use(signupRouter); // Usa a rota de cadastro de usuário
app.use(loginRouter); // Usa a rota de login de usuário
app.use(teamsRouter); // Usa a rota de consulta times da API
app.use(leaguesRouter); // Usa a rota de consulta ligas da API
app.use(matchesRouter); //Usa a rota de consulta partidas da API
app.use(searchMatchesRouter); // Usa a rota de consulta partidas do banco de dados
app.use(searchRatingRouter); // Usa a rota de consulta ao banco de dados para montar a classificação


//========== Rota simples de teste ==========
app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});


//========== Inicia o servidor na porta definida no arquivo .env ==========
app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});