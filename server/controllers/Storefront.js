const models = require('../models');

const UserAccount = models.UserAccount;

const createPage = (req, res) => res.render('storeFront', { csrfToken: req.csrfToken() });

const getAllProducts = (request, response) => {
  const req = request;
  const res = response;

  return UserAccount.UserProductsModel.findProducts(req, res,(err, docs) => {
    console.dir(docs);
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ products: docs });
  });
};

module.exports.createPage = createPage;
module.exports.getAllProducts = getAllProducts;
