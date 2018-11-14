const controllers = require('./controllers');
const mid = require('./middleware');

// connect routes
const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getProducts', mid.requiresLogin, controllers.UserAccount.getProducts);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/userAccount', mid.requiresLogin, controllers.UserAccount.makerPage);
  app.post('/userAccount', mid.requiresLogin, controllers.UserAccount.makeProduct);
  app.delete('/deleteProduct', mid.requiresLogin, controllers.UserAccount.deleteProduct);
  app.put('/updateProduct', mid.requiresLogin, controllers.UserAccount.updateProduct);
  app.get('/storefront', controllers.Storefront.createPage);
  app.get('/storefront', controllers.Storefront.getAllProducts);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
