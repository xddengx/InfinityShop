/* Clients view of the storefront. User is able to view all selling 
products and buy a product.If user buys a product, the amount will 
be deducted from their Spirals Cash. *This works, but the actual 
text is not refreshed until user logs out and logs back in.
*/

var csrfToken;
var spirals;

// update spiral cash
const BuyProduct = e => {
    // get the price of the product
    let price = e.target.parentNode.id;
    // how much spirals the user has now after their purchase
    let totalSpirals = spirals - price;
    spirals = totalSpirals;

    // update
    let params = `spirals=${spirals}&_csrf=${csrfToken}`;

    sendAjax('PUT', '/updateSpirals', params, function () {
        getSpiralsStorefront(); //TODO: not updating 
        // location.reload();  
    });

    //TODO: transfer product to new owner
    //TODO: remove element from page

    return false;
};

// show all products 
const ProductsList = function (props) {
    // no products exist 
    if (props.products.length === 0) {
        return React.createElement(
            'div',
            { className: 'productsList' },
            React.createElement(
                'h3',
                { className: 'emptyProducts' },
                'All items are sold out!'
            )
        );
    }

    // map function to create UI for EACH product stored
    // every product will generate a product Div and add it to productNodes
    // advantage is that we can update the sate of this component via Ajax.
    // everytimes the state updates, the page will immediately creates the UI and shows the updates
    const productsNodes = props.products.map(function (products) {
        return React.createElement(
            'div',
            { className: 'productCard', key: products._id, id: 'prodCard', className: 'buyProduct' },
            React.createElement(
                'div',
                null,
                React.createElement('img', { className: 'theProductImage', src: products.productImage, alt: '' }),
                ' '
            ),
            React.createElement(
                'div',
                { id: products.price },
                React.createElement(
                    'button',
                    { id: 'buyButton', type: 'button', onClick: e => BuyProduct(e) },
                    'Buy'
                ),
                React.createElement(
                    'h3',
                    { className: 'buyProductName' },
                    ' ',
                    products.name,
                    ' '
                ),
                React.createElement(
                    'h4',
                    { className: 'productDescription' },
                    ' ',
                    products.description,
                    ' '
                ),
                React.createElement(
                    'h3',
                    { className: 'productPrice' },
                    ' $',
                    products.price,
                    ' '
                )
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'productsList' },
        productsNodes
    );
};

// display the user's Spiral Cash in the nav bar.
const SpiralsCash = function (obj) {
    spirals = obj.spiral;
    return React.createElement(
        'div',
        { className: 'money' },
        React.createElement(
            'a',
            { href: '/gameCenter' },
            'Spiral Cash: ',
            obj.spiral
        )
    );
};

const getSpiralsStorefront = () => {
    sendAjax('GET', '/getSpirals', null, data => {
        console.dir(data.spirals);
        ReactDOM.render(React.createElement(SpiralsCash, { spiral: data.spirals }), document.querySelector("#spiralsStorefront"));
    });
};

// load all products from server
const loadAllProductsFromServer = () => {
    sendAjax('GET', '/getAllProducts', null, data => {
        ReactDOM.render(React.createElement(ProductsList, { products: data.products, csrf: csrfToken }), document.querySelector("#allProducts"));
    });
};

// set up for rendering the products and spirals
const setupAllProducts = function (csrf) {
    // products attribute is empty for now, because we don't have data yet. But
    // it will at least get the HTML onto the page while we wait for the server
    ReactDOM.render(React.createElement(ProductsList, { products: [], csrf: csrf }), document.querySelector("#allProducts"));

    ReactDOM.render(React.createElement(SpiralsCash, { spiral: spirals }), document.querySelector('#spiralsStorefront'));

    loadAllProductsFromServer();
    getSpiralsStorefront();
};

// allows us to get new CSRF token for new submissions
const getTokenStore = () => {
    sendAjax('GET', '/getToken', null, result => {
        setupAllProducts(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

$(document).ready(function () {
    getTokenStore();
    loadAllProductsFromServer();
});
/* Game Center for user to win more Spiral Cash */

var csrfToken;

// Game of Chance - generate a random winning number and the user's random number
// if the two numbers match the user wins. 
// Currently: spiral cash is not added to the user's account
const playChance = () => {
    let spiralCashWon = 50;
    let winningNum = Math.floor(Math.random() * 20);
    let userNum = Math.floor(Math.random() * 20);

    if (winningNum == userNum) {
        $("#message").text("You won " + spiralCashWon + " Spiral Cash!");
    } else {
        $("#message").text("Sorry you did not get the lucky number. Your number: " + userNum + " | Winning number: " + winningNum);
    }
};

// Game of Chance display
const DailyReward = function () {
    return React.createElement(
        "div",
        { className: "dailyReward" },
        React.createElement(
            "h2",
            null,
            " Game of Chance | Will you get the lucky number? "
        ),
        React.createElement(
            "p",
            null,
            "Rules: Play to see if your number is our winning number."
        ),
        React.createElement(
            "button",
            { onClick: e => playChance(e) },
            " Play "
        )
    );
};

const gameSetup = function (csrf) {
    ReactDOM.render(React.createElement(DailyReward, { csrf: csrf }), document.querySelector("#games"));
};

const getTokenGame = () => {
    sendAjax('GET', '/getToken', null, result => {
        gameSetup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

$(document).ready(function () {
    getTokenGame();
});
/* View for User's Account page 
Displays the user's products to sell
*/

var csrfToken;
var spirals;

// adding a product to sell
const handleProduct = e => {
    e.preventDefault();

    // check if user entered all fields
    if ($("#productName").val() == '' || $("#productPrice").val() == '' || $("#description").val() == '' || $("#productImage").val() == '') {
        handleError("All fields are required");
        return false;
    }

    // add the product
    sendAjax('POST', $("#productForm").attr("action"), $("#productForm").serialize(), function () {
        loadProductsFromServer();
    });

    return false;
};

// delete product: using the product's unique id
const deleteProduct = e => {
    let productId = e.target.parentNode.id;
    let params = `data=${productId}&_csrf=${csrfToken}`;
    console.dir(params);

    sendAjax('DELETE', '/deleteProduct', params, function () {
        console.log("success");
        location.reload();
    });
};

// updating the product
const updateProductHandle = e => {
    e.preventDefault();
    let productId = e.target.parentNode.id;

    // check if user entered in all fields
    if ($("#updateName").val() == '' || $("#updatePrice").val() == '' || $("#updateDescription").val() == '' || $("#updateproductImage").val() == '') {
        alert("All fields are required in order to update product.");
        return false;
    }

    let updatedProduct = $("#updateProductForm").serialize();

    // send request to update product
    sendAjax('PUT', $("#updateProductForm").attr("action"), updatedProduct, function () {
        console.log("success");
        location.reload();
    });
};

// rendering the update product form with a modal
const UpdateProductForm = props => {
    return React.createElement(
        "div",
        { id: "updateModal", className: "modal" },
        React.createElement(
            "div",
            { className: "formContent" },
            React.createElement(
                "button",
                { id: "closeForm", className: "close", onClick: e => closeModal(e) },
                "\xD7 "
            ),
            React.createElement(
                "form",
                { id: "updateProductForm",
                    onSubmit: updateProductHandle,
                    name: "updateProductForm",
                    action: "/updateProduct",
                    method: "POST",
                    className: "updateProductForm"
                },
                React.createElement(
                    "h4",
                    null,
                    " Update product"
                ),
                React.createElement(
                    "label",
                    { htmlFor: "name" },
                    "Product Name: "
                ),
                React.createElement("input", { id: "updateName", type: "text", name: "name", placeholder: "Product Name" }),
                React.createElement(
                    "label",
                    { htmlFor: "price" },
                    " Price: "
                ),
                React.createElement("input", { id: "updatePrice", type: "text", name: "price", placeholder: "Product Price" }),
                React.createElement(
                    "label",
                    { htmlFor: "description" },
                    "Description: "
                ),
                React.createElement("input", { id: "updateDescription", type: "text", name: "description", placeholder: "Description" }),
                React.createElement(
                    "label",
                    { htmlFor: "productImage" },
                    "Image: "
                ),
                React.createElement("input", { id: "updateproductImage", type: "text", name: "productImage", placeholder: "Image URL" }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { type: "hidden", name: "id", value: props.product }),
                React.createElement("input", { className: "updateProductSubmit", type: "submit", value: "Update Product" })
            )
        )
    );
};

// closing the modal using empty div
const closeModal = () => {
    ReactDOM.render(React.createElement(
        "div",
        null,
        " "
    ), document.querySelector("#modal"));
};

// render the update product form
const showUpdateProductForm = function (e, csrf, productId) {
    ReactDOM.render(React.createElement(UpdateProductForm, { csrf: csrf, product: productId }), document.querySelector("#modal"));
};

// create React JSX for Add Product form
const ProductForm = props => {
    return React.createElement(
        "form",
        { id: "productForm",
            onSubmit: handleProduct,
            name: "productForm",
            action: "/userAccount",
            method: "POST",
            className: "productForm"
        },
        React.createElement(
            "h4",
            null,
            " Add a product to sell"
        ),
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Product Name: "
        ),
        React.createElement("input", { className: "inputProds", id: "productName", type: "text", name: "name", placeholder: "Product Name" }),
        React.createElement(
            "label",
            { htmlFor: "price" },
            " Price: "
        ),
        React.createElement("input", { className: "inputProds", id: "productPrice", type: "text", name: "price", placeholder: "Product Price" }),
        React.createElement(
            "label",
            { htmlFor: "description" },
            "Description: "
        ),
        React.createElement("input", { className: "inputProds", id: "description", type: "text", name: "description", placeholder: "Description" }),
        React.createElement(
            "label",
            { htmlFor: "productImage" },
            "Image: "
        ),
        React.createElement("input", { className: "inputProds", id: "productImage", type: "text", name: "productImage", placeholder: "Image URL" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeProductSubmit", type: "submit", value: "Create Product" })
    );
};

// render the user's product list
const ProductList = function (props) {
    // no products exist 
    if (props.products.length === 0) {
        return React.createElement(
            "div",
            { className: "productList" },
            React.createElement(
                "h3",
                { className: "emptyProduct" },
                "You don't have any products to sell!"
            )
        );
    }

    // map function to create UI for EACH product stored
    // every product will generate a product Div and add it to productNodes
    // advantage is that we can update the sate of this component via Ajax.
    // everytimes the state updates, the page will immediately create UI and show the updates
    const productNodes = props.products.map(function (product) {
        return React.createElement(
            "div",
            { className: "productCard", key: product._id, id: product._id, className: "product" },
            React.createElement(
                "div",
                { id: "test" },
                React.createElement(
                    "div",
                    null,
                    React.createElement("img", { className: "theProductImage", src: product.productImage, alt: "" }),
                    " "
                ),
                React.createElement(
                    "div",
                    { id: "togglePrivacy" },
                    React.createElement(
                        "p",
                        null,
                        " Public/Private"
                    ),
                    React.createElement(
                        "label",
                        { className: "switch" },
                        React.createElement("input", { type: "checkbox" }),
                        React.createElement("span", { className: "slider" })
                    )
                ),
                React.createElement(
                    "div",
                    { id: "prodInfo" },
                    React.createElement(
                        "h3",
                        { className: "productName" },
                        " ",
                        product.name,
                        " "
                    ),
                    React.createElement(
                        "h4",
                        { className: "productDescription" },
                        " ",
                        product.description,
                        " "
                    ),
                    React.createElement(
                        "h3",
                        { className: "productPrice" },
                        " $",
                        product.price,
                        " "
                    )
                )
            ),
            React.createElement(
                "button",
                { id: "deleteButton", type: "button", onClick: e => deleteProduct(e) },
                "Delete"
            ),
            React.createElement(
                "button",
                { id: "updateButton", type: "button", onClick: e => showUpdateProductForm(e, props.csrf, product._id) },
                "Update"
            )
        );
    });

    return React.createElement(
        "div",
        { className: "productList" },
        productNodes
    );
};

// from result.spirals
const SpiralCash = function (obj) {
    console.dir(obj);
    return React.createElement(
        "div",
        { className: "money" },
        React.createElement(
            "a",
            { href: "/gameCenter" },
            "Spiral Cash: ",
            obj.spiral
        )
    );
};

const getSpirals = () => {
    sendAjax('GET', '/getSpirals', null, result => {
        ReactDOM.render(React.createElement(SpiralCash, { spiral: result.spirals }), document.querySelector("#spirals"));
    });
};

// add function to grab products from the server and reder a product list
// will need to periodically update the screen with changes(without siwtching pages)
// since ajax is asynchronous, we will need to do the rendering on the success of the
// ajax call and pass in the data we get from the server
const loadProductsFromServer = () => {
    sendAjax('GET', '/getProducts', null, data => {
        ReactDOM.render(React.createElement(ProductList, { products: data.products, csrf: csrfToken }), document.querySelector("#products"));
    });
};

// setup function takes a CSRF token in client/userAccount.js
// function will render out ProductForm to the page and a default product list
const setup = function (csrf) {
    ReactDOM.render(React.createElement(ProductForm, { csrf: csrf }), document.querySelector("#makeProduct"));

    // products attribute is empty for now, because we don't have data yet. But
    // it will at least get the HTML onto the page while we wait for the server
    ReactDOM.render(React.createElement(ProductList, { products: [], csrf: csrf }), document.querySelector("#products"));

    ReactDOM.render(React.createElement(SpiralCash, { spiral: spirals }), document.querySelector('#spirals'));

    loadProductsFromServer();
    getSpirals();
};

// allows us to get new CSRF token for new submissions
const getToken = () => {
    sendAjax('GET', '/getToken', null, result => {
        setup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

$(document).ready(function () {
    getToken();
});

// handle the error message
const handleError = message => {
    $("#errorMessage").text(message);
    console.log(message);
};

// redirect to the specified page
const redirect = response => {
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function (xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
