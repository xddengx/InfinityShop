/* Clients view of the storefront. User is able to view all selling 
products and buy a product.If user buys a product, the amount will 
be deducted from their Spirals Cash. *This works, but the actual 
text is not refreshed until user logs out and logs back in.
*/

var csrfToken;
var spirals;

// update spiral cash
const BuyProduct = (e) =>{
    // get the price of the product
    var ownerId = e.target.id;
    var price = e.target.parentNode.id;
    var productId = e.target.parentNode.parentNode.id;

    let param = `price=${price}&ownerId=${ownerId}&_csrf=${csrfToken}`;
    let productIdParam = `prodId=${productId}&_csrf=${csrfToken}`;

    // also checks to see if the products owner id is the current logged in user
    sendAjax('PUT', '/updateSpirals', param, function(){
        getSpiralsStorefront();  // update the text/amount displayed

        // if product was bought successfully create clone of product and change ownerId
        sendAjax('PUT', '/updateOwner', productIdParam, function(){
            console.dir('successful');

            sendAjax('DELETE', '/deleteProduct', productIdParam, function(){
                console.dir('successful');
                location.reload();  // TODO: extra- refreshes a different way. setInterval?
            });
        })

        return false;
    });
}

// show all products 
const ProductsList = function(props){
    // no products exist 
    if(props.products.length === 0){
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
    const productsNodes = props.products.map(function(products) {
        return(
            <div className="productCard" key={products._id} id={products._id} className="buyProduct">
                <div><img className="theProductImage" src= {products.productImage}alt="" /> </div>
                <div id={products.price}>
                    <button id={products.owner} className="buyButton" type ="button" onClick={(e)=> BuyProduct(e)}>Buy</button>
                    <h3 className="buyProductName"> {products.name} </h3>
                    <h4 className="productDescription"> {products.description} </h4>
                    <h3 className="productPrice"> ${products.price} </h3>
                    <h3 class="ownerIdProduct" id={products.owner}></h3>
                </div>
            </div>
        );
    });

    return(
        <div className="productsList">
            {productsNodes}
        </div>
    );
};

// Countdown for the Sitewide sale - currently counting down to Christmas
const SiteSale = function(obj){
    return(
        <div id = "splashContainer">
            <div class = "content">
                <h1 class = "msgBlock"> CHRISTMAS SALE COUNTDOWN!</h1>
                <div class = "time" id = "clockCont">
                    <div>
                        <span class = "days"> {obj.saleTime.days} </span>
                        <div class = "caption">Days</div>
                    </div>
                    <div>
                        <span class = "hours"> {obj.saleTime.hours} </span>
                        <div class = "caption">Hours</div>
                    </div>
                    <div>
                        <span class = "minutes"> {obj.saleTime.minutes} </span>
                        <div class = "caption">Minutes</div>
                    </div>
                    <div>
                        <span class = "seconds"> {obj.saleTime.seconds} </span>
                        <div class = "caption">Seconds</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// calculating the remaining time and displaying
const getRemainingTime = () =>{
    requestAnimationFrame(getRemainingTime);

    sendAjax('GET', '/getRemainingTime', null, (result) =>{
        ReactDOM.render(
            <SiteSale saleTime = {result} />, document.querySelector('#saleCont')
        );

        // if time remaining reaches 0. stop the countdown
        if(result.sale <= 0){
            cancelAnimationFrame(updateClock);
            days.innerHTML = 0;
            hours.innerHTML = 0;
            minutes.innerHTML = 0;
            seconds.innerHTML = 0;
        }
    });
}

// display the user's Spiral Cash in the nav bar.
const SpiralsCash = function(obj){
    spirals = obj.spiral;
    return (
        <div className="money">
            <a href="/gameCenter">Spiral Cash: $ {obj.spiral}</a>
        </div>
    );

}

const getSpiralsStorefront = () => {
    sendAjax('GET', '/getSpirals', null, (data) => {
        ReactDOM.render(
            <SpiralsCash spiral={data} />, document.querySelector("#spiralsStorefront")
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
const setupAllProducts = function(csrf){
    // products attribute is empty for now, because we don't have data yet. But
    // it will at least get the HTML onto the page while we wait for the server
    ReactDOM.render(
        <ProductsList products={[]} csrf={csrf} />, document.querySelector("#allProducts")
    );

    ReactDOM.render(
        <SpiralsCash spiral={spirals} />, document.querySelector('#spiralsStorefront')
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