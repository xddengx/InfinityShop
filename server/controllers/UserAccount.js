const models = require('../models');

const UserAccount = models.UserAccount;

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

// create the product
const makeProduct = (req, res) => {
  console.dir(req.body);
  if (!req.body.name || !req.body.price || !req.body.description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const productData = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    owner: req.session.account._id,
  };

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

const updateProduct = (req, res) =>{
  // console.dir(req.body.data);
  // find product id to update in the db
  return UserAccount.UserProductsModel.UpdateProductById(req.body.id, (err, doc) =>{
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    // console.dir(doc.name);
    // // the new information for the product
    const searchedProduct = doc;
    // console.dir(searchedProduct);

    //const updatedProduct = new UserAccount.UserProductsModel(updatedProductData);
    const savePromise = searchedProduct.save();

    savePromise.then(() => res.json({
      name: searchedProduct.name,
      price: searchedProduct.price,
      description: searchedProduct.description
    }));

    // console.dir(savePromise);

    return savePromise;
    // return res.json({
    //   name: searchedProduct.name,
    //   price: searchedProduct.price,
    //   description: searchedProduct.description
    // });
  });
}

const deleteProduct = (req, res) => {
  // body.data is the productId found
  UserAccount.UserProductsModel.DeleteProductId(req.body.data, (err) => {
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
