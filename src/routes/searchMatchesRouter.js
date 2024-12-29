//========== Importações, constantes e variáveis iniciais ==========
const express = require('express');
const searchMatchesRouter = express.Router();
const searchMatchesController = require('../controllers/searchMatchesController.js');  // Importando o controlador

//========== Rota para buscar as partidas corresponde a rodada no banco de dados ==========
searchMatchesRouter.get('/matches/:round', searchMatchesController);

module.exports = searchMatchesRouter;