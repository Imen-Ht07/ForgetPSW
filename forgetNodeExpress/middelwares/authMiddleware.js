const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant. Accès refusé.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajouter les données utilisateur à la requête
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide. Accès refusé.' });
  }
};

module.exports = authMiddleware;
