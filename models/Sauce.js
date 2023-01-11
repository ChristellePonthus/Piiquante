const mongoose = require('mongoose');


//Données de la sauce à envoyer au serveur
const sauceSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // id MongoDB de l'utilisateur qui a créé la sauce
    name : { type: String, required: true }, // Nom de la sauce
    manufacturer : { type: String, required: true }, // Fabricant de la sauce
    description : { type: String, required: true }, // Description de la sauce
    mainPepper : { type: String, required: true }, // Principal ingrédient épicé de la sauce
    imageUrl : { type: String, required: true }, // URL de l'image de la sauce téléchargée par l'utilisateur
    heat : { type: Number, required: true }, // Nombre entre 1 et 10 décrivant la sauce
    likes : { type: Number, required: true }, // Nombre d'utilisateurs qui aiment (= likent) la sauce
    dislikes : { type: Number, required: true }, // Nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
    usersLiked : [ "String <userId>" ], // Tableau des ids des utilisateurs qui ont aimé (= liked) la sauce
    usersDisliked : [ "String <userId>" ] // Tableau des ids des utilisateurs qui n'ont pas aimé (= disliked) la sauce
});


module.exports = mongoose.model('Sauce', sauceSchema);