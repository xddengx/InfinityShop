var csrfToken;
var spirals;

// update spiral cash
const BuyProduct = (e) => {
  // get the price of the product
  var ownerId = e.target.id;
  var price = e.target.parentNode.id;
  var productId = e.target.parentNode.parentNode.id;

  let param = `price=${price}&ownerId=${ownerId}&_csrf=${csrfToken}`;
  let productIdParam = `prodId=${productId}&_csrf=${csrfToken}`;

  // also checks to see if the products owner id is the current logged in user
  sendAjax('PUT', '/updateSpirals', param, function () {
    getSpiralsStorefront();  // update the text/amount displayed

    // if product was bought successfully create clone of product and change ownerId
    sendAjax('PUT', '/updateOwner', productIdParam, function () {
      console.dir('successful');

      sendAjax('DELETE', '/deleteProduct', productIdParam, function () {
        console.dir('successful');
        location.reload();  // TODO: extra- refreshes a different way. setInterval?
      });
    })

    return false;
  });
}

// show all products 
const ProductsList = function (props) {
  // no products exist 
  if (props.products.length === 0) {
    return (
      <div className="productsList">
        <h3 className="emptyProducts">All items are sold out!</h3>
      </div>
    );
  }

  // map function to create UI for EACH product stored
  // every product will generate a product Div and add it to productNodes
  // advantage is that we can update the sate of this component via Ajax.
  // everytimes the state updates, the page will immediately creates the UI and shows the updates
  const productsNodes = props.products.map(function (products) {
    return (
      <div className="productCard" key={products._id} id={products._id} className="buyProduct">
        <div><img className="theProductImage" src={products.productImage} alt="" /> </div>
        <div id={products.price} className="prodInfo">
          <button id={products.owner} className="buyButton" type="button" onClick={(e) => BuyProduct(e)}>Buy</button>
          <h3 className="buyProductName"> {products.name} </h3>
          <p className="productDescription"> {products.description} </p>
          <h3 className="productPrice"> ${products.price} </h3>
          <h3 class="ownerIdProduct" id={products.owner}></h3>
        </div>
      </div>
    );
  });

  return (
    <div className="productsList">
      {productsNodes}
    </div>
  );
};

// Countdown for the Sitewide sale - currently counting down to Christmas
const SiteSale = function (obj) {
  return (
    <div id="splashContainer">
      <div class="content">
        <h1 class="msgBlock"> SALE</h1>
        <div class="time" id="clockCont">
          <div>
            <span id="theDays" class="days"> {obj.saleTime.days} </span>
            <div class="caption">Days</div>
          </div>
          <div>
            <span id="theHours" class="hours"> {obj.saleTime.hours} </span>
            <div class="caption">Hours</div>
          </div>
          <div>
            <span id="theMinutes" class="minutes"> {obj.saleTime.minutes} </span>
            <div class="caption">Minutes</div>
          </div>
          <div>
            <span id="theSeconds" class="seconds"> {obj.saleTime.seconds} </span>
            <div class="caption">Seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const calculateTime = (result) => {
  // Sale Day
  const saleDay = new Date('2029, 2, 17');
  // Time difference from Current Time to Sale Day
  const time = Date.parse(saleDay) - Date.parse(new Date());
  // convert the time (in millisecs) to days, hours, minutes, seconds
  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((time / 1000 / 60) % 60);
  const seconds = Math.floor((time / 1000) % 60);

  return {
    sale: saleDay, time, days, hours, minutes, seconds,
  };

};

const showTheClock = (result) => {
  let theResult = calculateTime(result);
  ReactDOM.render(
    <SiteSale saleTime={theResult} />, document.querySelector('#saleCont')
  );

  requestAnimationFrame(showTheClock);
}


// calculating the remaining time and display
const getRemainingTime = () => {

  sendAjax('GET', '/getRemainingTime', null, (result) => {
    ReactDOM.render(
      <SiteSale saleTime={result} />, document.querySelector('#saleCont')
    );
    console.log(result);

    // if time remaining reaches 0. stop the countdown
    if (result.time <= 0) {
      document.querySelector('#theDays').textContent = 0
      document.querySelector('#theHours').textContent = 0
      document.querySelector('#theMinutes').textContent = 0
      document.querySelector('#theSeconds').textContent = 0
      return;
    } else {
      showTheClock(result.time);
    }
  });
}

// display the user's Spiral Cash in the nav bar.
const SpiralsCash = function (obj) {
  spirals = obj.spiral;
  return (
    <div className="money">
      <p>Infinity Coins: {obj.spiral}</p>
    </div>
  );

}

const getSpiralsStorefront = () => {
  sendAjax('GET', '/getSpirals', null, (data) => {
    ReactDOM.render(
      <SpiralsCash spiral={data} />, document.querySelector("#infinityCoins")
    );
  });
};

// load all products from server
const loadAllProductsFromServer = () => {
  sendAjax('GET', '/getAllProducts', null, (data) => {
    ReactDOM.render(
      <ProductsList products={data.products} csrf={csrfToken} />, document.querySelector("#allProducts")
    );
  });
};

// set up for rendering the products and spirals
const setupAllProducts = function (csrf) {
  // products attribute is empty for now, because we don't have data yet. But
  // it will at least get the HTML onto the page while we wait for the server
  ReactDOM.render(
    <ProductsList products={[]} csrf={csrf} />, document.querySelector("#allProducts")
  );

  ReactDOM.render(
    <SpiralsCash spiral={spirals} />, document.querySelector('#infinityCoins')
  );

  loadAllProductsFromServer();
  getSpiralsStorefront();
};


// allows us to get new CSRF token for new submissions
const getTokenStore = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupAllProducts(result.csrfToken);
    csrfToken = result.csrfToken;
  });
};