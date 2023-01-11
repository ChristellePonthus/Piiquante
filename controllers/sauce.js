const Sauce = require("../models/Sauce");
const fs = require('fs');

//Récupération de l'id de la sauce sélectionnée
function getSauceById(req, res) {
    return Sauce.findOne({ _id: req.params.id })
}


//Suppression de l'image existante en cas de modification d'image ou de suppression de la sauce
function deleteImage(sauce, req, res) {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, (err => {
        if (err) console.log(err);
    }));
}


//Affichage de toutes les sauces
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};


//Affichage de la sauce sélectionnée
exports.getOneSauce = (req, res) => {
    getSauceById(req, res)
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(500).json({ error }));
};


//Création d'une sauce
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLikes: [],
        usersDislikes: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};


//Modification d'une sauce
exports.modifySauce = (req, res) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject.userId;
    getSauceById(req, res)
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({ message: "Non autorisé !" });
            } else {
                const imageSauce = sauce.imageUrl.split('/images/')[1];
                //Si modification de l'image, suppression de l'image précédente
                if (req.file && req.file.filename !== imageSauce) {
                    deleteImage(sauce, req, res);
                }
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};


//Suppression d'une sauce
exports.deleteSauce = (req, res) => {
    getSauceById(req, res)
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(401).json({ message: "Non autorisé !" });
            } else {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(401).json({ error }));
                deleteImage(sauce, req, res);
            }
        })
        .catch(error => res.status(500).json({ error }));
};


//Fonction pour les likes - dislikes
exports.likeSauce = (req, res) => {
    const {userId, like} = req.body;
    if (![0, -1, 1].includes(like)) return res.status(400).json({ message: "Bad Request"});
    getSauceById(req, res)
        .then((sauce) => updateVote(sauce, like, userId))
        .then(saveSauce => saveSauce.save())
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(500).json({ error }));
};

//Mise à jour du vote Like/Dislike
function updateVote(sauce, like, userId, res) {
    if (like === 1 || like === -1) return incrementeVote(sauce, userId, like);
    return resetVote(sauce, userId, res);
}

//Ajout du vote
function incrementeVote(sauce, userId, like) {
    //Récupération des tableaux usersLiked et usersDisliked
    const { usersLiked, usersDisliked } = sauce;

    //Ajout de l'id utilisateur dans le tableau correspondant
    const votersArray = like === 1 ? usersLiked : usersDisliked;
    if (votersArray.includes(userId)) return sauce;
    votersArray.push(userId);

    //Incrémentation du compteur Like ou Dislike correspondant
    like === 1 ? ++sauce.likes : ++sauce.dislikes;
    return sauce;
}

//Annulation du vote
function resetVote(sauce, userId, res) {
    //Récupération des tableaux usersLiked et usersDisliked
    const { usersLiked, usersDisliked } = sauce;

    //Message d'erreur si l'utilisateur peut liker ET disliker
    if ([usersLiked, usersDisliked].every(arr => arr.includes(userId)))
        return Promise.reject({ message: "User seems to have voted both ways!" });

    //Message d'erreur si l'utilisateur n'a pas voté
    if (![usersLiked, usersDisliked].some(arr => arr.includes(userId)))
        return Promise.reject({ message: "User seems to not have voted!" });

    //Retrait de l'id de l'utilisateur du tableau à modifier
    if (usersLiked.includes(userId)) {
        --sauce.likes;
        sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId)
    } else {
        --sauce.dislikes;
        sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
    }

    return sauce;
}