//========== Importações, constantes e variáveis iniciais ==========
const express = require('express');
const teamsRouter = express.Router();
const teamsController = require('../controllers/teamsController.js');  // Importando o controlador

//========== Rota de cadastro ou atualização de times ==========
teamsRouter.get('/api/update-teams', teamsController);

module.exports = teamsRouter;