// Game Center
const gameCenterPage = (req, res) => res.render('gameCenter', { csrfToken: req.csrfToken() });

// get user's spiral cash
const getSpirals = (request, response) => {
  const req = request;
  const res = response;

  const spiralsJSON = {
    spirals: req.session.account.spirals,
  };

  res.json(spiralsJSON);
};

module.exports.gameCenterPage = gameCenterPage;
module.exports.getSpirals = getSpirals;
