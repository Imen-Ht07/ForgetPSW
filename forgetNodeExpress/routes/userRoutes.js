const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middelwares/authMiddleware'); 

// Authentification
router.post('/register', userController.register);
router.post('/login', userController.login);

// Gestion des utilisateurs (routes protégées)
router.get('/getAllUsers', authMiddleware, userController.getAllUsers);
router.put('/updateUser/:id', authMiddleware, userController.updateUser);
router.delete('/deleteUser/:id', authMiddleware, userController.deleteUser);

// Gestion des mots de passe
router.post('/forgot-password', userController.forgotpsw);
router.post('/reset-password/:userId/:token', userController.resetpsw);

module.exports = router;
