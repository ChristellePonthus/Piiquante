const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//Données utilisateur à envoyer au serveur
const userSchema = new mongoose.Schema({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true }
});


//Vérification que l'email ne soit utilisé que pour un seul compte
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);