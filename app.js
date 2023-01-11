require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require("path");


//Connexion à la base de données MongoDB
const DB_name = process.env.DB_name;
const DB_user = process.env.DB_user;
const DB_password = process.env.DB_password;
const uri =
    `mongodb+srv://${DB_user}:${DB_password}@cluster0.aizc3nu.mongodb.net/${DB_name}?retryWrites=true&w=majority`;
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


//Appel du framework Express
const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));


//Configuration des headers pour les requêtes
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});


//Configuration des routes communes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;