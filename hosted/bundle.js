'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* Clients view of the storefront. User is able to view all selling 
products and buy a product.If user buys a product, the amount will 
be deducted from their Spirals Cash. *This works, but the actual 
text is not refreshed until user logs out and logs back in.
*/

var csrfToken;
var spirals;

// update spiral cash
var BuyProduct = function BuyProduct(e) {
    // get the price of the product
    var price = e.target.parentNode.id;
    var productId = e.target.parentNode.parentNode.id;
    console.dir(productId);

    var param = 'price=' + price + '&_csrf=' + csrfToken;
    var productIdParam = 'prodId=' + productId + '&_csrf=' + csrfToken;

    sendAjax('PUT', '/updateSpirals', param, function () {
        getSpiralsStorefront(); // update the text/amount displayed

        // if product was bought successfully create clone of product and change ownerId
        sendAjax('PUT', '/updateOwner', productIdParam, function () {
            console.dir('successful');

            sendAjax('DELETE', '/deleteProduct', productIdParam, function () {
                console.dir('successful');
                location.reload(); // TODO: extra- refreshes a different way. setInterval?
            });
        });
    });

    //TODO: transfer product to new owner
    //TODO: remove element from page

    return false;
};

// show all products 
var ProductsList = function ProductsList(props) {
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
    var productsNodes = props.products.map(function (products) {
        return React.createElement(
            'div',
            _defineProperty({ className: 'productCard', key: products._id, id: products._id }, 'className', 'buyProduct'),
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
                    { id: 'buyButton', type: 'button', onClick: function onClick(e) {
                            return BuyProduct(e);
                        } },
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

var SiteSale = function SiteSale(obj) {
    // console.log("hiii");
    // console.dir(obj.saleTime.sale);
    var saleDate = new Date(obj.saleTime);
    return (
        // <div>
        //     <h2>{saleDate.toDateString()}</h2>
        // </div>
        React.createElement(
            'div',
            { id: 'splashContainer' },
            React.createElement(
                'div',
                { 'class': 'content' },
                React.createElement(
                    'h1',
                    { 'class': 'msgBlock' },
                    ' CHRISTMAS SALE COUNTDOWN!'
                ),
                React.createElement(
                    'div',
                    { 'class': 'time', id: 'clockCont' },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'span',
                            { 'class': 'days' },
                            ' ',
                            obj.saleTime.days,
                            ' '
                        ),
                        React.createElement(
                            'div',
                            { 'class': 'caption' },
                            'Days'
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'span',
                            { 'class': 'hours' },
                            ' ',
                            obj.saleTime.hours,
                            ' '
                        ),
                        React.createElement(
                            'div',
                            { 'class': 'caption' },
                            'Hours'
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'span',
                            { 'class': 'minutes' },
                            ' ',
                            obj.saleTime.minutes,
                            ' '
                        ),
                        React.createElement(
                            'div',
                            { 'class': 'caption' },
                            'Minutes'
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'span',
                            { 'class': 'seconds' },
                            ' ',
                            obj.saleTime.seconds,
                            ' '
                        ),
                        React.createElement(
                            'div',
                            { 'class': 'caption' },
                            'Seconds'
                        )
                    )
                )
            )
        )
    );
};

var getRemainingTime = function getRemainingTime() {
    // requestAnimationFrame(getRemainingTime);

    sendAjax('GET', '/getRemainingTime', null, function (result) {
        // let saleDate = new Date(result);
        // console.dir(result);
        ReactDOM.render(React.createElement(SiteSale, { saleTime: result }), document.querySelector('#saleCont'));

        if (result.sale <= 0) {
            // cancelAnimationFrame(updateClock);
            days.innerHTML = 0;
            hours.innerHTML = 0;
            minutes.innerHTML = 0;
            seconds.innerHTML = 0;
        }
    });
};

// display the user's Spiral Cash in the nav bar.
var SpiralsCash = function SpiralsCash(obj) {
    spirals = obj.spiral;
    // console.log(spirals);
    return React.createElement(
        'div',
        { className: 'money' },
        React.createElement(
            'a',
            { href: '/gameCenter' },
            'Spiral Cash: $ ',
            obj.spiral
        )
    );
};

var getSpiralsStorefront = function getSpiralsStorefront() {
    sendAjax('GET', '/getSpirals', null, function (data) {
        // console.dir(data);
        ReactDOM.render(React.createElement(SpiralsCash, { spiral: data }), document.querySelector("#spiralsStorefront"));
    });
};

// load all products from server
var loadAllProductsFromServer = function loadAllProductsFromServer() {
    sendAjax('GET', '/getAllProducts', null, function (data) {
        ReactDOM.render(React.createElement(ProductsList, { products: data.products, csrf: csrfToken }), document.querySelector("#allProducts"));
    });
};

// const loadOrderHistoryTest = () =>{
//     sendAjax('GET', '/orders', null, (data) => {
//         ReactDOM.render(
//             <OrdersList orders={data.orders} csrf={csrfToken} />, document.querySelector("#content")
//         );
//     });
// }

// const createOrderHistoryPageTest = (csrf) =>{
//     // console.dir(csrf);
//     ReactDOM.render(
//         <div></div>, document.querySelector("#allProducts")
//     );

//     ReactDOM.render(
//         <div></div>, document.querySelector('#saleCont')
//     );


//     ReactDOM.render(
//         <OrdersList orders={[]} csrf={csrf} />, document.querySelector("#content")
//     );

//     loadOrderHistoryTest();
// }

// set up for rendering the products and spirals
var setupAllProducts = function setupAllProducts(csrf) {
    // products attribute is empty for now, because we don't have data yet. But
    // it will at least get the HTML onto the page while we wait for the server
    ReactDOM.render(React.createElement(ProductsList, { products: [], csrf: csrf }), document.querySelector("#allProducts"));

    ReactDOM.render(React.createElement(SpiralsCash, { spiral: spirals }), document.querySelector('#spiralsStorefront'));

    // ordersButton.addEventListener("click", (e) =>{
    //     console.dir("orders button clicked");
    //     e.preventDefault();
    //     createOrderHistoryPageTest(csrf);
    //     return false;
    // });

    loadAllProductsFromServer();
    getSpiralsStorefront();
};

// allows us to get new CSRF token for new submissions
var getTokenStore = function getTokenStore() {
    sendAjax('GET', '/getToken', null, function (result) {
        setupAllProducts(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

// $(document).ready(function(){
//     // console.dir(window.location.pathname);
//     // getTokenStore();
//     // loadAllProductsFromServer();
// });
'use strict';

/* Game Center for user to win more Spiral Cash */

// TODO: next day is never stored and next day is only set when button is clicked. so when page
//refreshes it doesnt know what the next day is. create another object literal in account for storing times...


var csrfToken;
var spirals;
var currentDate;
var nextDay;

var checkDailyReward = function checkDailyReward() {
    var dailyRStatus;

    var currentTime = new Date();

    console.log("current time", currentTime);

    // if(currentTime < test){
    //     document.querySelector("#dailyRewardButton").disabled = true;
    // }
    // if(currentTime > test){
    //     document.querySelector("#dailyRewardButton").disabled = false;
    // }

    sendAjax('GET', '/getDRStatus', null, function (result) {
        dailyRStatus = result; // should be false
        console.log("point A");
        console.log("here", dailyRStatus);

        sendAjax('GET', '/getNextDay', null, function (retrieve) {
            var tomorrow = new Date(retrieve);
            console.log("tomorrow", tomorrow);
            // console.log("tomorrow", tomorrow.setDate(retrieve.getDate()));

            console.log("dailyRStatus", dailyRStatus);
            // user has not yet clicked

            // user already clicked
            // it's not the next day
            // button should be disable (disable = true)
            if (dailyRStatus === true && currentTime < tomorrow) {
                console.dir("3");
                document.querySelector("#dailyRewardButton").disabled = true;
            }

            // user already clicked
            // it's the next day
            // button should be clickable (disable = false)
            if (dailyRStatus === true && currentTime > tomorrow) {
                console.dir("4");
                document.querySelector("#dailyRewardButton").disabled = false;
            }
        });
    });
};

var afterButtonClicked = function afterButtonClicked() {
    var dailyStatus = void 0;
    sendAjax('GET', '/getDRStatus', null, function (result) {
        dailyStatus = result; // should be false
        if (dailyStatus == false) {
            console.dir("1");
            document.querySelector("#dailyRewardButton").disabled = false;
        }

        if (dailyStatus == true) {
            console.dir("2");
            document.querySelector("#dailyRewardButton").disabled = true;
            checkDailyReward();
        }
    });
};

// Game of Chance - generate a random winning number and the user's random number
// if the two numbers match the user wins. 
// Currently: spiral cash is not added to the user's account
var playChance = function playChance() {
    var spiralCashWon = 50;
    var winningNum = Math.floor(Math.random() * 10);
    var userNum = Math.floor(Math.random() * 10);

    var param = 'won=' + spiralCashWon + '&_csrf=' + csrfToken;
    if (winningNum == userNum) {
        sendAjax('PUT', '/updateSpiralsWon', param, function () {
            getSpiralsGC(); // update the spirals text display
            console.dir("success");
        });
        $("#message").text("You won " + spiralCashWon + " Spiral Cash!");
    } else {
        $("#message").text("Sorry you did not get the lucky number. Your number: " + userNum + " | Winning number: " + winningNum);
    }
};

var getDailyReward = function getDailyReward() {
    document.querySelector("#dailyRewardButton").disabled = true;

    var dailyCollect = 100;

    // get time when user clicked on reward button
    currentDate = new Date();
    // calculate the next day (so button can be enabled again)
    nextDay = new Date();
    nextDay.setDate(currentDate.getDate() + 1);
    // nextDay = new Date("2018-12-03T23:16:00-06:00");

    console.log("currentdate", currentDate);
    // console.log("nextDay", nextDay);

    // if user clicks on daily reward update the boolean in account. 
    var paramStatus = 'nextDay=' + nextDay + '&status=' + true + '&_csrf=' + csrfToken;
    sendAjax('PUT', '/updateDRStatus', paramStatus, function () {
        console.dir("clicked on daily reward button");
        checkDailyReward();
    });

    var param = 'won=' + dailyCollect + '&_csrf=' + csrfToken;

    sendAjax('PUT', '/updateSpiralsWon', param, function () {
        getSpiralsGC(); // update the spirals text display
        console.dir("success");
    });
};

// Game of Chance display
var Chance = function Chance() {
    return React.createElement(
        'div',
        { className: 'dailyReward' },
        React.createElement(
            'h2',
            null,
            ' Game of Chance | Will you get the lucky number? '
        ),
        React.createElement(
            'p',
            null,
            'Rules: Play to see if your number is our winning number.'
        ),
        React.createElement(
            'button',
            { onClick: function onClick(e) {
                    return playChance(e);
                } },
            ' Play '
        ),
        React.createElement(
            'h2',
            null,
            ' Collect Your Daily Reward'
        ),
        React.createElement(
            'button',
            { id: 'dailyRewardButton', onClick: function onClick(e) {
                    return getDailyReward(e);
                } },
            ' Collect Reward '
        )
    );
};

var SpiralCash = function SpiralCash(obj) {
    return React.createElement(
        'div',
        { className: 'money' },
        React.createElement(
            'a',
            { href: '/gameCenter' },
            'Spiral Cash: $ ',
            obj.spiral
        )
    );
};

var getSpiralsGC = function getSpiralsGC() {
    sendAjax('GET', '/getSpirals', null, function (result) {
        ReactDOM.render(React.createElement(SpiralCash, { spiral: result }), document.querySelector("#spiralsGameCenter"));
    });
};

var gameSetup = function gameSetup(csrf) {
    ReactDOM.render(React.createElement(Chance, { csrf: csrf }), document.querySelector("#games"));

    ReactDOM.render(React.createElement(SpiralCash, { spiral: spirals }), document.querySelector('#spiralsGameCenter'));
    getSpiralsGC();
};

var getTokenGame = function getTokenGame() {
    sendAjax('GET', '/getToken', null, function (result) {
        gameSetup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

// $(document).ready(function(){
//     // getTokenGame();
// });
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* View for User's Account page 
Displays the user's products to sell
*/

var csrfToken;
var spirals;

// adding a product to sell
var handleProduct = function handleProduct(e) {
    e.preventDefault();

    // check if user entered all fields
    if ($("#productName").val() == '' || $("#productPrice").val() == '' || $("#description").val() == '' || $("#productImage").val() == '') {
        handleError("All fields are required");
        return false;
    }

    // add the product
    var toMatch = /^\$?[0-9]+\.?[0-9]?[0-9]?$/;
    var isMatch = toMatch.test(document.querySelector('#productPrice').value);
    // console.dir(document.querySelector('#productPrice').value);
    // console.dir(isMatch);

    console.dir($("#productForm").serialize());
    if (isMatch === true) {
        sendAjax('POST', $("#productForm").attr("action"), $("#productForm").serialize(), function () {
            loadProductsFromServer();
        });
    } else {
        alert("Value entered for the price of the product needs to be in numerical form.");
    }

    return false;
};

// delete product: using the product's unique id
var deleteProduct = function deleteProduct(e) {
    var productId = e.target.parentNode.id;
    var params = "prodId=" + productId + "&_csrf=" + csrfToken;
    console.dir(params);

    sendAjax('DELETE', '/deleteProduct', params, function () {
        console.log("success");
        location.reload();
    });
};

// updating the product
var updateProductHandle = function updateProductHandle(e) {
    e.preventDefault();
    var productId = e.target.parentNode.id;

    // check if user entered in all fields
    if ($("#updateName").val() == '' || $("#updatePrice").val() == '' || $("#updateDescription").val() == '' || $("#updateproductImage").val() == '') {
        alert("All fields are required in order to update product.");
        return false;
    }

    var updatedProduct = $("#updateProductForm").serialize();

    var toMatch = /^\$?[0-9]+\.?[0-9]?[0-9]?$/;
    var isMatch = toMatch.test(document.querySelector('#updatePrice').value);
    console.log(document.querySelector('#updatePrice').value);
    console.log(isMatch);

    if (isMatch === true) {
        // send request to update product
        sendAjax('PUT', $("#updateProductForm").attr("action"), updatedProduct, function () {
            console.log("success");
            location.reload();
        });
    } else {
        alert("Value entered for the price of the product needs to be in numerical form.");
    }
};

// rendering the update product form with a modal
var UpdateProductForm = function UpdateProductForm(props) {
    return React.createElement(
        "div",
        { id: "updateModal", className: "modal" },
        React.createElement(
            "div",
            { className: "formContent" },
            React.createElement(
                "button",
                { id: "closeForm", className: "close", onClick: function onClick(e) {
                        return closeModal(e);
                    } },
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
var closeModal = function closeModal() {
    ReactDOM.render(React.createElement(
        "div",
        null,
        " "
    ), document.querySelector("#modal"));
};

// render the update product form
var showUpdateProductForm = function showUpdateProductForm(e, csrf, productId) {
    ReactDOM.render(React.createElement(UpdateProductForm, { csrf: csrf, product: productId }), document.querySelector("#modal"));
};

// create React JSX for Add Product form
var ProductForm = function ProductForm(props) {
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
var ProductList = function ProductList(props) {
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
    var productNodes = props.products.map(function (product) {
        return React.createElement(
            "div",
            _defineProperty({ className: "productCard", key: product._id, id: product._id }, "className", "product"),
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
                { id: "deleteButton", type: "button", onClick: function onClick(e) {
                        return deleteProduct(e);
                    } },
                "Delete"
            ),
            React.createElement(
                "button",
                { id: "updateButton", type: "button", onClick: function onClick(e) {
                        return showUpdateProductForm(e, props.csrf, product._id);
                    } },
                "Update"
            )
        );
    });

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h2",
            { id: "pageHeader" },
            "Your Inventory"
        ),
        React.createElement(
            "div",
            { className: "productList" },
            productNodes
        )
    );
};

// from result.spirals
var SpiralCash = function SpiralCash(obj) {
    return React.createElement(
        "div",
        { className: "money" },
        React.createElement(
            "a",
            { href: "/gameCenter" },
            "Spiral Cash: $ ",
            obj.spiral
        )
    );
};

var getSpirals = function getSpirals() {
    sendAjax('GET', '/getSpirals', null, function (result) {
        ReactDOM.render(React.createElement(SpiralCash, { spiral: result }), document.querySelector("#spirals"));
    });
};

// add function to grab products from the server and reder a product list
// will need to periodically update the screen with changes(without siwtching pages)
// since ajax is asynchronous, we will need to do the rendering on the success of the
// ajax call and pass in the data we get from the server
var loadProductsFromServer = function loadProductsFromServer() {
    sendAjax('GET', '/getProducts', null, function (data) {
        ReactDOM.render(React.createElement(ProductList, { products: data.products, csrf: csrfToken }), document.querySelector("#products"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(ProductForm, { csrf: csrf }), document.querySelector("#makeProduct"));

    // products attribute is empty for now, because we don't have data yet. But
    // it will at least get the HTML onto the page while we wait for the server
    ReactDOM.render(React.createElement(ProductList, { products: [], csrf: csrf }), document.querySelector("#products"));

    ReactDOM.render(React.createElement(SpiralCash, { spiral: spirals }), document.querySelector('#spirals'));

    loadProductsFromServer();
    getSpirals();
};

// allows us to get new CSRF token for new submissions
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

$(document).ready(function () {
    if (window.location.pathname == "/userAccount") {
        getToken();
    }
    if (window.location.pathname == "/storefront") {
        getTokenStore();
        loadAllProductsFromServer();
        getSpiralsStorefront();
        getRemainingTime();
    }
    if (window.location.pathname == "/gameCenter") {
        getTokenGame();
        gameSetup();
        afterButtonClicked();
    }
    if (window.location.pathname == "/orderHistory") {
        getTokenOrderPage();
        getSpiralsOrdersPage();
        orderPageSetup();
    }
});
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var csrfToken;
var spirals;

var OrdersList = function OrdersList(theOrders) {
    // no products exist 
    if (theOrders.orders.length === 0) {
        return React.createElement(
            "div",
            { className: "ordersList" },
            React.createElement(
                "h3",
                { className: "emptyOrders" },
                "No orders to show! No purchases were made."
            )
        );
    }

    // map function to create UI for EACH product stored
    // every product will generate a product Div and add it to productNodes
    // advantage is that we can update the sate of this component via Ajax.
    // everytimes the state updates, the page will immediately create UI and show the updates
    var orderNodes = theOrders.orders.map(function (order) {
        return React.createElement(
            "div",
            _defineProperty({ className: "productCard", key: order._id, id: order._id }, "className", "product"),
            React.createElement(
                "div",
                { id: "test" },
                React.createElement(
                    "div",
                    null,
                    React.createElement("img", { className: "theProductImage", src: order.productImage, alt: "" }),
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
                        order.name,
                        " "
                    ),
                    React.createElement(
                        "h4",
                        { className: "productDescription" },
                        " ",
                        order.description,
                        " "
                    ),
                    React.createElement(
                        "h3",
                        { className: "productPrice" },
                        " $",
                        order.price,
                        " "
                    )
                )
            )
        );
    });

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h2",
            { id: "pageHeader" },
            "Order History"
        ),
        React.createElement(
            "div",
            { className: "productList" },
            orderNodes
        )
    );
};

// // from result.spirals
var SpiralCash = function SpiralCash(obj) {
    return React.createElement(
        "div",
        { className: "money" },
        React.createElement(
            "a",
            { href: "/gameCenter" },
            "Spiral Cash: $ ",
            obj.spiral
        )
    );
};

var getSpiralsOrdersPage = function getSpiralsOrdersPage() {
    sendAjax('GET', '/getSpirals', null, function (result) {
        ReactDOM.render(React.createElement(SpiralCash, { spiral: result }), document.querySelector("#spiralsOrderHistory"));
    });
};

var loadOrderHistory = function loadOrderHistory() {
    sendAjax('GET', '/orders', null, function (data) {
        ReactDOM.render(React.createElement(OrdersList, { orders: data.orders, csrf: csrfToken }), document.querySelector("#orders"));
    });
};

// setup function takes a CSRF token in client/userAccount.js
// function will render out ProductForm to the page and a default product list
var orderPageSetup = function orderPageSetup(csrf) {
    ReactDOM.render(React.createElement(OrdersList, { orders: [], csrf: csrf }), document.querySelector("#orders"));

    ReactDOM.render(React.createElement(SpiralCash, { spiral: spirals }), document.querySelector('#spiralsOrderHistory'));

    loadOrderHistory();
    getSpiralsOrdersPage();
};

// allows us to get new CSRF token for new submissions
var getTokenOrderPage = function getTokenOrderPage() {
    sendAjax('GET', '/getToken', null, function (result) {
        orderPageSetup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};
"use strict";

// handle the error message
var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    console.log("TODO: include a better eroor handling message");
};

// redirect to the specified page
var redirect = function redirect(response) {
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
