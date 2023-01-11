const jwt = require('jsonwebtoken');

//Configuration du token pour l'authentification utilisateur
module.exports = (req, res, next) => {
  try {
      //Récupération du token dans le header "Authorization", après l'espace qui suit "Bearer"
      const token = req.headers.authorization.split(' ')[1];

      //Décodage du token afin de vérifier s'il est valide
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

      //Extraction de l'id utilisateur afin de l'ajouter aux requêtes
      const userId = decodedToken.userId;
      req.auth = { userId: userId };
      next();
  } catch (error) { res.status(401).json({ error }); }
};