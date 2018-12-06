const models = require('../models');

const { UserAccount } = models;
const { Account } = models;

// search user's account. and get user's products via their id.
const orderPage = (req, res) => {
  UserAccount.UserProductsModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('orderHistory', { csrfToken: req.csrfToken(), products: docs });
  });
};

const getSpirals = (request, response) => {
  const req = request;
  const res = response;
  return Account.AccountModel.findByUsername(
    req.session.account.username, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }
      // console.dir(docs);
      return res.json(docs.spirals);
    },
  );
};

// Order History
const getOrders = (request, response) => {
  const req = request;
  const res = response;

  return UserAccount.BoughtProductModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ orders: docs });
  });
};

module.exports.orderPage = orderPage;
module.exports.getOrders = getOrders;
module.exports.getSpirals = getSpirals;
