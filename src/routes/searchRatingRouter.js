//========== Importações, constantes e variáveis iniciais ==========
const express = require('express');
const searchRatingRouter = express.Router();
const searchRatingController = require('../controllers/searchRatingController.js');  // Importando o controlador

//========== Rota para buscar as partidas corresponde a rodada no banco de dados ==========
searchRatingRouter.get('/matches/:round', searchRatingController);

module.exports = searchRatingRouter;