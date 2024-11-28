const express = require('express');
const signupRouter = express.Router();
const signupController = require('../controllers/signupController');  // Importando o controlador

// Rota de cadastro de usuário
signupRouter.post('/register', signupController);

module.exports = signupRouter;