const express = require('express');
const loginRouter = express.Router();
const loginController = require('../controllers/loginController.js');  // Importando o controlador


//========== Rota de cadastro de usuário ==========
loginRouter.post('/login', loginController);

module.exports = loginRouter;