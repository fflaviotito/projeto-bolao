const mysql = require('mysql2'); //Importando a biblioteca do MySQL
require('dotenv').config(); //Carregando as variáveis do arquivo .env

//Cria a conexão com o banco de dados
const connection = mysql.createConnection({
    host: process.env.DB_HOST, //Passando o valor de host do banco de dados definido no .env
    user: process.env.DB_USER, //Passando o valor de user do banco de dados definido no .env
    password: process.env.DB_PASSWORD, //Passando o valor de senha do banco de dados definido no .env
    database: process.env.DB_NAME //Passando o valor de nome do banco de dados definido no .env
});

//Conecta ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err); //Logar no console o erro de conexão
        return;
    }

    console.log('Conexão com o banco de dados bem sucedida!'); //Sinalizar caso a conexão seja bem sucedida
});

module.exports = connection; //Exporta a conexão com o banco de dados