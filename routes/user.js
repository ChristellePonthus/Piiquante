const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');


//Configuration du parcours utilisateur
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;