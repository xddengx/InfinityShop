var csrfToken;

const handleProduct = (e) => {
    e.preventDefault();

    if($("#productName").val() == '' || $("#productPrice").val() == '' || $("#description").val() == ''){
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#productForm").attr("action"), $("#productForm").serialize(), function() {
        loadProductsFromServer();
    });

    return false;
};

const deleteProduct = (e) =>{
    console.log("hello", e.target.parentNode.id);
    let productId = e.target.parentNode.id;
    console.log(csrfToken);
    let params = `data=${productId}&_csrf=${csrfToken}`;
    console.dir(params);

    sendAjax('DELETE', '/deleteProduct', params, function(){
        console.log("success");
    });
}

const UpdateProductForm = () =>{
    console.log("hello");
    
    return(
        <form id="testing"
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

        <input className="makeProductSubmit" type="submit" value="Create Product" />
        </form>
    );
};

const showUpdateProductForm = function(csrf){
    ReactDOM.render(
        <UpdateProductForm csrf={csrf} />, document.querySelector("#testing")
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

        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeProductSubmit" type="submit" value="Create Product" />
        </form>
    );
};

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
                <button id="deleteButton" type ="button" onClick={(e)=> deleteProduct(e)}>Delete</button>
                <button id="updateButton" type ="button" onClick={(e)=> showUpdateProductForm()}>Update</button>
                <h3 className="productName"> {product.name} </h3>
                <h4 className="productDescription"> {product.description} </h4>
                <h3 className="productPrice"> ${product.price} </h3>
            </div>
        );
    });

    return(
        <div className="productList">
            {productNodes}
        </div>
    );
};

// add function to grab products from the server and reder a product list
// will need to periodically update the screen with changes(without siwtching pages)
// since ajax is asynchronous, we will need to do the rendering on the success of the
// ajax call and pass in the data we get from the server
const loadProductsFromServer = () => {
    sendAjax('GET', '/getProducts', null, (data) => {
        ReactDOM.render(
            <ProductList products={data.products} />, document.querySelector("#products")
        );
    });
};

// setup function takes a CSRF token in client/userAccount.js
// function will render out ProductForm to the page and a default product list
const setup = function(csrf){

    ReactDOM.render(
        <ProductForm csrf={csrf} />, document.querySelector("#makeProduct")
    );

    // products attribute is empty for now, because we don't have data yet. But
    // it will at least get the HTML onto the page while we wait for the server
    ReactDOM.render(
        <ProductList products={[]} />, document.querySelector("#products")
    );

    loadProductsFromServer();
};

// allows us to get new CSRF token for new submissions
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

$(document).ready(function(){
    getToken();
});