const models = require('../models');

const { UserAccount } = models;

const createPage = (req, res) => res.render('storeFront', { csrfToken: req.csrfToken() });

// get all the products from db
const getAllProducts = (request, response) => {
  const res = response;

  return UserAccount.UserProductsModel.findProducts((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
// console.dir(docs.length);
// for(let i = 0; i < docs.length; i++){
//   console.dir(docs[i].price - (docs[i].price * .15));
// }
// docs[i].price = docs[i].price - (docs[i].price * .15));
    return res.json({ products: docs });
  });
};

// get the user's spirals from db
const getSpirals = (request, response) => {
  const req = request;
  const res = response;
  console.dir(req.session.account);

  const spiralsJSON = {
    spirals: req.session.account.spirals,
  };

  res.json(spiralsJSON);
};

module.exports.createPage = createPage;
module.exports.getAllProducts = getAllProducts;
module.exports.getSpirals = getSpirals;
