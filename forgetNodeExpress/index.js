const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// Configurer CORS pour permettre les requêtes depuis localhost:4200 (front-end)
app.use(cors({
  origin: 'http://localhost:4200',  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],  
}));

// Import des routes utilisateurs
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
//appel a database.js 
require('./database');
// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
