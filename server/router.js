const controllers = require('./controllers');
const mid = require('./middleware');

// connect routes
const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getSpirals', mid.requiresSecure, controllers.UserAccount.getSpirals);
  app.get('/getProducts', mid.requiresLogin, controllers.UserAccount.getProducts);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.put('/changePassword', mid.requiresSecure, controllers.Account.changePassword);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/userAccount', mid.requiresLogin, controllers.UserAccount.makerPage);
  app.post('/userAccount', mid.requiresLogin, controllers.UserAccount.makeProduct);
  app.delete('/deleteProduct', mid.requiresLogin, controllers.UserAccount.deleteProduct);
  app.put('/updateProduct', mid.requiresLogin, controllers.UserAccount.updateProduct);
  app.get('/getAllProducts', controllers.Storefront.getAllProducts);
  app.get('/orderHistory', mid.requiresLogin, controllers.OrderHistory.orderPage);
  app.get('/orders', mid.requiresLogin, controllers.OrderHistory.getOrders);
  app.get('/storefront', mid.requiresLogin, controllers.Storefront.createPage);
  // app.put('/getProductSeller', mid.requiresLogin, controllers.Storefront.getProductSeller);
  app.put('/updateSpirals', controllers.Account.updateSpirals);
  app.put('/updateSpiralsWon', controllers.Account.updateSpiralsWon);
  app.put('/updateOwner', controllers.UserAccount.cloneProduct);
  app.get('/gameCenter', mid.requiresLogin, controllers.GameCenter.gameCenterPage);
  app.get('/getDRStatus', mid.requiresLogin, controllers.Account.getDRStatus);
  app.get('/getNextDay', mid.requiresLogin, controllers.Account.getNextDay);
  app.put('/updateDRStatus', mid.requiresLogin, controllers.Account.updateDRStatus);
  app.get('/getRemainingTime', mid.requiresLogin, controllers.UserAccount.getRemainingTime);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', mid.requiresSecure, controllers.Account.loginPage); // for now
};

module.exports = router;
