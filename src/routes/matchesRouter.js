//========== Importações, constantes e variáveis iniciais ==========
const express = require('express');
const matchesRouter = express.Router();
const matchesController = require('../controllers/matchesController.js');  // Importando o controlador

//========== Rota de cadastro ou atualização de ligas ==========
matchesRouter.get('/api/update-matches', matchesController);

module.exports = matchesRouter;