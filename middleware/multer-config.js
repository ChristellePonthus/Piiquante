const multer = require('multer');

//Définition des extensions
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
}
const storage = multer.diskStorage({
    //Sélection du dossier où les images doivent être enregistrées
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    //Configuration du nom de l'image
    filename: (req, file, callback) => {
        let name = file.originalname.split(' ').join('_');
        name = file.originalname.split('.').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});


module.exports = multer({ storage }).single('image');