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
    var price = e.target.parentNode.id;
    var productId = e.target.parentNode.parentNode.id;
    console.dir(productId);

    let param = `price=${price}&_csrf=${csrfToken}`;
    let productIdParam = `prodId=${productId}&_csrf=${csrfToken}`;

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
    });

    //TODO: transfer product to new owner
    //TODO: remove element from page

    return false;
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
                    <button id="buyButton" type ="button" onClick={(e)=> BuyProduct(e)}>Buy</button>
                    <h3 className="buyProductName"> {products.name} </h3>
                    <h4 className="productDescription"> {products.description} </h4>
                    <h3 className="productPrice"> ${products.price} </h3>
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

// display the user's Spiral Cash in the nav bar.
const SpiralsCash = function(obj){
    console.dir(obj);
    spirals = obj.spiral;
    return (
        <div className="money">
            <a href="/gameCenter">Spiral Cash: $ {obj.spiral}</a>
        </div>
    );

}

const getSpiralsStorefront = () => {
    sendAjax('GET', '/getSpirals', null, (data) => {
        // console.dir(data);
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

$(document).ready(function(){
    // console.dir(window.location.pathname);
    // getTokenStore();
    // loadAllProductsFromServer();
});