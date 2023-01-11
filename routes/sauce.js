const express = require('express');
const router = express.Router();


//Appel du middleware pour sécuriser les routes du parcours sauce
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


//Appel des fonctions du contrôleur
const saucesCtrl = require('../controllers/sauce');


//Configuration du parcours sauce
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, multer, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);


module.exports = router;