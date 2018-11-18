// Game Center: currently just renders the page

const models = require('../models');

const UserAccount = models.UserAccount;

const gameCenterPage = (req, res) => res.render('gameCenter', { csrfToken: req.csrfToken() });

const getSpirals = (request, response) => {
  const req = request;
  const res = response;
  console.dir(req.session.account);

  const spiralsJSON = {
    spirals: req.session.account.spirals,
  };

  res.json(spiralsJSON);
};

module.exports.gameCenterPage = gameCenterPage;
module.exports.getSpirals = getSpirals;