const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  // every request will have a session object that manages user's sessions and session variables
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'The username and password do not match' });
    }

    // storing variables/data. attaching all fields from toAPI to session for tracking
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/userAccount' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // check if all fields are filled out
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // check if passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // generate a new encrypted password hash and salt. these will be stored in the db
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      spirals: 50000,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      // attach account data from toAPI and save the data in a session
      req.session.account = Account.AccountModel.toAPI(newAccount);

      res.json({ redirect: '/userAccount' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.oldPass = `${req.body.oldPass}`;
  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  // check if users filled out all fields
  if (!req.body.username || !req.body.oldPass || !req.body.newPass || !req.body.newPass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // check if both new password match
  if (req.body.newPass !== req.body.newPass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // check if user entered their username and old password correctly (is this found in the database)
  return Account.AccountModel.authenticate(req.body.username, req.body.oldPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'The username and password do not match a record in our system' });
    }

    // search for user's account
    return Account.AccountModel.updatePassword(req.body.username, (error, doc) => {
      if (error) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      // save their account in a variable
      const newInfo = doc;

      // update their password and hash it
      return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
        newInfo.password = hash;
        newInfo.salt = salt;

        const savePromise = newInfo.save();

        savePromise.then(() => {
          // req.session.account = Account.AccountModel.toAPI(newInfo);

          res.json({
            redirect: '/login',
          });
        });

        savePromise.catch((errPromise) => {
          console.log(errPromise);
          return res.status(400).json({ error: 'An error occured' });
        });
      });
    });
  });
};

// Function is used when user buys a product from the storefront
const updateSpirals = (req, res) => Account.AccountModel.findByUsername(
  req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    // make calculations on the server side so users cant manipulate changes
    const productPrice = req.body.price;
    const userSpirals = docs;

    // ensure user has sufficient funds to buy a product
    // if(docs.spirals > productPrice){
    const newTotal = docs.spirals - productPrice;
    userSpirals.spirals = newTotal;

    const savePromise = userSpirals.save();

    savePromise.then(() => res.json({
      spirals: userSpirals.spirals,
    }));

    // throws error if insufficient funds
    savePromise.catch((error) => {
      console.dir(error);
      if (error) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });

    //
    // if user has sufficient funds
    // if(docs.spirals > productPrice){
    //   const newTotal = docs.spirals - productPrice;
    //   userSpirals.spirals = newTotal;
  
    //   const savePromise = userSpirals.save();
  
    //   savePromise.then(() => res.json({
    //     spirals: userSpirals.spirals,
    //   }));
  
    //   // throws error if insufficient funds
    //   savePromise.catch((error) => {
    //     console.dir(error);
    //     if (error) {
    //       return res.status(400).json({ error: 'Insufficient funds' });
    //     }
  
    //     return res.status(400).json({ error: 'An error occured' });
    //   });
    // }

    return savePromise;
  },
);

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.changePassword = changePassword;
module.exports.updateSpirals = updateSpirals;
module.exports.getToken = getToken;
