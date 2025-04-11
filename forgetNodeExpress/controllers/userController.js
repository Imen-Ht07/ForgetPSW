const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const ResetToken = require('../models/resetpsw');
const bcrypt = require('bcryptjs');
//
const moment = require('moment');

// Configuration du transporteur pour l'envoi d'emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cadrinistage@gmail.com',
    pass: 'uwdy jene jbmt dmiz', // Remplacez par votre mot de passe d'application
  },
});

// Fonction pour envoyer un email de réinitialisation
const sendResetEmail = async (user, resetLink) => {
  const mailOptions = {
    from: 'cadrinistage@gmail.com',
    to: user.email,
    subject: 'Réinitialisation de votre mot de passe',
    text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
  };
  
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation.');
  }
};

// Fonction pour générer un token de réinitialisation
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Fonction de gestion de la demande de réinitialisation
exports.forgotpsw = async (req, res) => {
  const { email } = req.body;

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Aucun utilisateur trouvé avec cet email.' });
    }

    // Chercher un token existant pour cet utilisateur
    let token = await ResetToken.findOne({ userId: user._id });

    if (!token) {
      // Créer un nouveau token si aucun token n'existe
      token = new ResetToken({
        userId: user._id,
        token: generateResetToken(),
        expiresAt: moment().add(1, 'hour').toDate()  // Token valable pendant 1 heure
      });
      await token.save();
    }

    // Construire le lien de réinitialisation
    const resetLink = `http://localhost:4200/reset-password/${user._id}/${token.token}`;
    await sendResetEmail(user, resetLink);

    res.status(200).json({ msg: 'Un email de réinitialisation a été envoyé.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erreur du serveur. Veuillez réessayer plus tard.' });
  }
};



// Fonction de gestion de la réinitialisation du mot de passe
exports.resetpsw = async (req, res) => {
  try {
    // Trouver l'utilisateur par ID
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ msg: 'Lien invalide ou expiré' });
    }

    // Vérifier si le token existe et correspond à l'utilisateur
    const token = await ResetToken.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).json({ msg: 'Lien invalide ou expiré' });
    }

    // Vérification de l'expiration du token
    if (moment().isAfter(token.expiresAt)) {
      return res.status(400).json({ msg: 'Le token a expiré' });
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = hashedPassword;
    await user.save();

    // Supprimer le token de réinitialisation après utilisation
    await ResetToken.deleteOne({ _id: token._id });

    // Renvoi d'une réponse JSON avec succès
    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Une erreur est survenue' });
  }
};


//-----------------------------------
// Inscription
exports.register = async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Lire tous les utilisateurs (accès libre)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Récupérer tous les utilisateurs
    res.json(users); // Retourner la liste des utilisateurs
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error }); // Gestion des erreurs
  }
};

// Mettre à jour un utilisateur (disponible pour les administrateurs ou l’utilisateur lui-même)
exports.updateUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret_key');

    // Vérification que l'utilisateur est admin ou le propriétaire du compte
    if (decodedToken.role !== 'admin' && decodedToken.userId !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Supprimer un utilisateur (accès réservé aux administrateurs)
exports.deleteUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret_key');

    if (decodedToken.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
