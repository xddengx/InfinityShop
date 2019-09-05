const mongoose = require('mongoose');
const models = require('../models');

const { UserAccount } = models;
const { Account } = models;

// search user's account. and get user's products via their id.
const makerPage = (req, res) => {
  UserAccount.UserProductsModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), products: docs });
  });
};

// get the user's spiral cash
const getSpirals = (request, response) => {
  const req = request;
  const res = response;
  return Account.AccountModel.findByUsername(
    req.session.account.username, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }
      return res.json(docs.spirals);
    },
  );
};

// calculate the remaning time until the next sale
const getRemainingTime = (req, res) => {
  // Sale Day
  const saleDay = new Date('October 31, 2019');
  // Time difference from Current Time to Sale Day
  const time = Date.parse(saleDay) - Date.parse(new Date());
  // convert the time (in millisecs) to days, hours, minutes, seconds
  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((time / 1000 / 60) % 60);
  const seconds = Math.floor((time / 1000) % 60);

  return res.json({
    sale: saleDay, time, days, hours, minutes, seconds,
  });
};

// create the product
const makeProduct = (req, res) => {
  if (!req.body.name || !req.body.price || !req.body.description || !req.body.productImage) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // new product's data
  const productData = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    productImage: req.body.productImage,
    owner: req.session.account._id,
  };

  // create the product
  const newProduct = new UserAccount.UserProductsModel(productData);

  const productPromise = newProduct.save();

  productPromise.then(() => res.json({ redirect: '/userAccount' }));

  productPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Product already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return productPromise;
};

// get products depending on who the user is
// search by id
const getProducts = (request, response) => {
  const req = request;
  const res = response;

  return UserAccount.UserProductsModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ products: docs });
  });
};

// update the chosen product via product id
const updateProduct = (req, res) => UserAccount.UserProductsModel.FindProductById(
  req.body.id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    // the new information for the product
    const searchedProduct = doc;
    searchedProduct.name = req.body.name;
    searchedProduct.price = req.body.price;
    searchedProduct.description = req.body.description;
    searchedProduct.productImage = req.body.productImage;

    // const updatedProduct = new UserAccount.UserProductsModel(updatedProductData);
    const savePromise = searchedProduct.save();


    savePromise.then(() => res.json({
      name: searchedProduct.name,
      price: searchedProduct.price,
      description: searchedProduct.description,
      image: searchedProduct.productImage,
    }));

    return savePromise;
  },
);

// clone product and update the owner
const cloneProduct = (req, res) => UserAccount.UserProductsModel.FindProductById(
  req.body.prodId, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    // cloning the product
    const prodCopydata = doc;
    prodCopydata._id = mongoose.Types.ObjectId();
    prodCopydata.owner = req.session.account._id;
    prodCopydata.isNew = true; // needed to create clone

    const prodCopy = new UserAccount.BoughtProductModel(prodCopydata);
    const savePromise = prodCopy.save();
    savePromise.then(() => res.json({ message: 'Successful' }));
    savePromise.catch((error) => {
      if (error) {
        return res.status(400).json({ error: 'Product already exists' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });

    return savePromise;
  },
);

// delete the chosen product via the product id
const deleteProduct = (req, res) => {
  UserAccount.UserProductsModel.DeleteProductId(req.body.prodId, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ successful: 'success' });
  });
};

module.exports.makerPage = makerPage;
module.exports.getProducts = getProducts;
module.exports.makeProduct = makeProduct;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;
module.exports.cloneProduct = cloneProduct;
module.exports.getSpirals = getSpirals;
module.exports.getRemainingTime = getRemainingTime;
