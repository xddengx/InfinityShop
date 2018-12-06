/* View for User's Account page 
Displays the user's products to sell
*/

var csrfToken;
var spirals;

// adding a product to sell
const handleProduct = (e) => {
    e.preventDefault();

    // check if user entered all fields
    if($("#productName").val() == '' || $("#productPrice").val() == '' || $("#description").val() == '' || $("#productImage").val() == ''){
        handleError("All fields are required");
        return false;
    }

    // add the product
    var toMatch = /^\$?[0-9]+\.?[0-9]?[0-9]?$/;
    var isMatch = toMatch.test(document.querySelector('#productPrice').value);
    // console.dir(document.querySelector('#productPrice').value);
    // console.dir(isMatch);

    console.dir($("#productForm").serialize());
    if(isMatch === true){
        sendAjax('POST', $("#productForm").attr("action"), $("#productForm").serialize(), function() {
            loadProductsFromServer();
        });
    }else{
        alert("Value entered for the price of the product needs to be in numerical form.")
    }

    return false;
};

// delete product: using the product's unique id
const deleteProduct = (e) =>{
    let productId = e.target.parentNode.id;
    let params = `prodId=${productId}&_csrf=${csrfToken}`;
    console.dir(params);

    sendAjax('DELETE', '/deleteProduct', params, function(){
        console.log("success");
        location.reload();
    });
}

// updating the product
const updateProductHandle = (e) => {
    e.preventDefault();
    let productId = e.target.parentNode.id;

    // check if user entered in all fields
    if($("#updateName").val() == '' || $("#updatePrice").val() == '' || $("#updateDescription").val() == '' || $("#updateproductImage").val() == ''){
        alert("All fields are required in order to update product.");
        return false;
    }

    let updatedProduct = $("#updateProductForm").serialize();

    var toMatch = /^\$?[0-9]+\.?[0-9]?[0-9]?$/;
    var isMatch = toMatch.test(document.querySelector('#updatePrice').value);
    console.log(document.querySelector('#updatePrice').value);
    console.log(isMatch);
    
    if(isMatch === true){
        // send request to update product
        sendAjax('PUT', $("#updateProductForm").attr("action"), updatedProduct, function() {
            console.log("success");
            location.reload();
        });
    }else{
        alert("Value entered for the price of the product needs to be in numerical form.")
    }
};

// rendering the update product form with a modal
const UpdateProductForm = (props) =>{
    return(
        <div id ="updateModal" className="modal"> 
            <div className="formContent">
                <button id="closeForm" className="close" onClick={(e)=> closeModal(e)}>&times; </button>

                <form id="updateProductForm"
                    onSubmit={updateProductHandle}
                    name="updateProductForm"
                    action="/updateProduct"
                    method="POST"
                    className="updateProductForm"
                >
                <h4> Update product</h4>
                <label htmlFor="name">Product Name: </label>
                <input  id ="updateName" type="text" name="name" placeholder="Product Name"/>

                <label htmlFor="price"> Price: </label>
                <input  id="updatePrice" type="text" name="price" placeholder="Product Price"/>

                <label htmlFor="description">Description: </label>
                <input  id ="updateDescription" type="text" name="description" placeholder="Description"/>

                <label htmlFor="productImage">Image: </label>
                <input id ="updateproductImage" type="text" name="productImage" placeholder="Image URL"/>

                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="hidden" name="id" value={props.product} />
                <input className="updateProductSubmit" type="submit" value="Update Product" />
                </form>
            </div>
        </div>
    );
};

// closing the modal using empty div
const closeModal = () =>{
    ReactDOM.render(
        <div> </div>, document.querySelector("#modal")
    );
}

// render the update product form
const showUpdateProductForm = function(e, csrf, productId){
    ReactDOM.render(
        <UpdateProductForm csrf={csrf} product={productId} />, document.querySelector("#modal")
    );
}

// create React JSX for Add Product form
const ProductForm = (props) => {
    return(
        <form id="productForm"
            onSubmit={handleProduct}
            name="productForm"
            action="/userAccount"
            method="POST"
            className="productForm"
        >
        <h4> Add a product to sell</h4>
        <label htmlFor="name">Product Name: </label>
        <input className="inputProds" id ="productName" type="text" name="name" placeholder="Product Name"/>

        <label htmlFor="price"> Price: </label>
        <input className="inputProds" id="productPrice" type="text" name="price" placeholder="Product Price"/>

        <label htmlFor="description">Description: </label>
        <input className="inputProds" id ="description" type="text" name="description" placeholder="Description"/>

        <label htmlFor="productImage">Image: </label>
        <input className="inputProds" id ="productImage" type="text" name="productImage" placeholder="Image URL"/>

        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeProductSubmit" type="submit" value="Create Product" />
        </form>
    );
};

// render the user's product list
const ProductList = function(props){
    // no products exist 
    if(props.products.length === 0){
        return (
            <div className="productList">
                <h3 className="emptyProduct">You don't have any products to sell!</h3>
            </div>
        );
    }

    // map function to create UI for EACH product stored
    // every product will generate a product Div and add it to productNodes
    // advantage is that we can update the sate of this component via Ajax.
    // everytimes the state updates, the page will immediately create UI and show the updates
    const productNodes = props.products.map(function(product) {
        return(
            <div className="productCard" key={product._id} id={product._id} className="product">
                <div id="test"> 
                    <div><img className="theProductImage" src= {product.productImage}alt="" /> </div>
                    <div id="togglePrivacy">
                        <p> Public/Private</p>
                        <label className="switch">
                            <input type="checkbox"></input>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div id="prodInfo">
                        <h3 className="productName"> {product.name} </h3>
                        <h4 className="productDescription"> {product.description} </h4>
                        <h3 className="productPrice"> ${product.price} </h3>                      
                    </div>
                </div>
                <button id="deleteButton" type ="button" onClick={(e)=> deleteProduct(e)}>Delete</button>
                <button id="updateButton" type ="button" onClick={(e)=> showUpdateProductForm(e, props.csrf, product._id)}>Update</button>  
            </div>
        );
    });

    return(
        <div>
            <h2 id="pageHeader">Your Inventory</h2>
            <div className="productList">
                {productNodes}
            </div>
        </div>
    );
};

// from result.spirals
const SpiralCash = function(obj){
    return (
        <div className="money">
            <a href="/gameCenter">Spiral Cash: $ {obj.spiral}</a>
        </div>
    );

}

const getSpirals = () => {
    sendAjax('GET', '/getSpirals', null, (result) => {
        ReactDOM.render(
            <SpiralCash spiral={result} />, document.querySelector("#spirals"),
        );
    });
};

// add function to grab products from the server and reder a product list
// will need to periodically update the screen with changes(without siwtching pages)
// since ajax is asynchronous, we will need to do the rendering on the success of the
// ajax call and pass in the data we get from the server
const loadProductsFromServer = () => {
    sendAjax('GET', '/getProducts', null, (data) => {
        ReactDOM.render(
            <ProductList products={data.products} csrf={csrfToken} />, document.querySelector("#products")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <ProductForm csrf={csrf} />, document.querySelector("#makeProduct")
    );

    // products attribute is empty for now, because we don't have data yet. But
    // it will at least get the HTML onto the page while we wait for the server
    ReactDOM.render(
        <ProductList products={[]} csrf={csrf} />, document.querySelector("#products")
    );

    ReactDOM.render(
        <SpiralCash spiral={spirals} />, document.querySelector('#spirals'),
    );

    loadProductsFromServer();
    getSpirals();
}

// allows us to get new CSRF token for new submissions
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

$(document).ready(function(){
    if(window.location.pathname == "/userAccount"){
        getToken();
    }
    if(window.location.pathname == "/storefront"){
        getTokenStore();
        loadAllProductsFromServer();
        getSpiralsStorefront();
        getRemainingTime();
    }
    if(window.location.pathname == "/gameCenter"){
        getTokenGame();
        gameSetup();
        afterButtonClicked();
    }
    if(window.location.pathname == "/orderHistory"){
        getTokenOrderPage();
        getSpiralsOrdersPage();
        orderPageSetup();
    }
});