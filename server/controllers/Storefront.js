// const models = require('../models');

// const UserAccount = models.UserAccount;

// const createPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });
// const getAllProducts = (request, response) => {
//   const req = request;
//   const res = response;

//   return UserAccount.UserProductsModel.findProducts(req.session.account._id, (err, docs) => {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({ error: 'An error occured' });
//     }

//     return res.json({ products: docs });
//   });
// };

// module.exports.createPage = createPage;
// module.exports.getAllProducts = getAllProducts;
