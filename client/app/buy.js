var csrfToken;
var spirals;

// update spiral cash
const BuyProduct = (e) =>{
    let price = e.target.parentNode.id;
    let productBought = e.target.parentNode.parentNode.id;
    
    let totalSpirals = spirals - price;
    spirals = totalSpirals;

    //update
    let params = `spirals=${spirals}&_csrf=${csrfToken}`;

    // console.dir(e.target);
    

    sendAjax('PUT', '/updateSpirals', params, function(){

        getSpiralsStorefront();     //TODO: not updating 
        // location.reload();  
    });

    //TODO: transfer product to new owner
    //TODO: remove element from page

    return false;
}

const ProductsList = function(props){
    // console.dir(props);
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
    // everytimes the state updates, the page will immediately create UI and show the updates
    const productsNodes = props.products.map(function(products) {
        return(
            <div className="productCard" key={products._id} id="prodCard" className="buyProduct">
                <div><img className="theProductImage" src= {products.productImage}alt="" /> </div>
                <div id={products.price}>
                    <button id="buyButton" type ="button" onClick={(e)=> BuyProduct(e)}>Buy</button>
                    <h3 className="buyProductName"> {products.name} </h3>
                    <h4 className="productDescription"> {products.description} </h4>
                    <h3 className="productPrice"> ${products.price} </h3>
                    {/* <input type="hidden" name="id" value={props.product} /> */}
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

const SpiralsCash = function(obj){
    spirals = obj.spiral;
    // console.dir(spirals);
    return (
        <div className="money">
            Spiral Cash: {obj.spiral}
        </div>
    );

}

const getSpiralsStorefront = () => {
    sendAjax('GET', '/getSpirals', null, (data) => {
        // spirals = data.spirals;
        console.dir(data.spirals);
        ReactDOM.render(
            <SpiralsCash spiral={data.spirals} />, document.querySelector("#spiralsStorefront")
        );
    });
};

const loadAllProductsFromServer = () => {
    sendAjax('GET', '/getAllProducts', null, (data) => {
        ReactDOM.render(
            <ProductsList products={data.products} csrf={csrfToken} />, document.querySelector("#allProducts")
        );
    });
};

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
    getTokenStore();
    loadAllProductsFromServer();
});