//========== Importações, constantes e variáveis iniciais ==========
const express = require('express');
const leaguesRouter = express.Router();
const leaguesController = require('../controllers/leaguesController.js');  // Importando o controlador

//========== Rota de cadastro ou atualização de ligas ==========
leaguesRouter.get('/api/update-leagues', leaguesController);

module.exports = leaguesRouter;