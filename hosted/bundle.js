// var csrfToken;

// const ProductsList = function(props){
//     // no products exist 
//     if(props.products.length === 0){
//         return (
//             <div className="productsList">
//                 <h3 className="emptyProducts">All items are sold out!</h3>
//             </div>
//         );
//     }

//     // map function to create UI for EACH product stored
//     // every product will generate a product Div and add it to productNodes
//     // advantage is that we can update the sate of this component via Ajax.
//     // everytimes the state updates, the page will immediately create UI and show the updates
//     const productsNodes = props.products.map(function(products) {
//         return(
//             <div className="productCard" key={products._id} id={products._id} className="product">
//                 <button id="buyButton" type ="button" onClick={(e)=> BuyProduct(e)}>Buy</button>
//                 <h3 className="productName"> {products.name} </h3>
//                 <h4 className="productDescription"> {products.description} </h4>
//                 <h3 className="productPrice"> ${products.price} </h3>
//             </div>
//         );
//     });

//     return(
//         <div className="productList">
//             {productsNodes}
//         </div>
//     );
// };

// const loadAllProductsFromServer = () => {
//     sendAjax('GET', '/storefront', null, (data) => {
//         ReactDOM.render(
//             <ProductsList products={data.products} />, document.querySelector("#allProducts")
//         );
//     });
// };

// const showAllProducts = function(){
//     // products attribute is empty for now, because we don't have data yet. But
//     // it will at least get the HTML onto the page while we wait for the server
//     ReactDOM.render(
//         <ProductsList products={[]} />, document.querySelector("#allProducts")
//     );

//     loadAllProductsFromServer();
// };

// // allows us to get new CSRF token for new submissions
// // const getToken = () => {
// //     sendAjax('GET', '/getToken', null, (result) => {
// //         showAllProducts(result.csrfToken);
// //         csrfToken = result.csrfToken;
// //     });
// // };

// $(document).ready(function(){
//     getToken();
//     loadAllProductsFromServer();
// });
var csrfToken;

const handleProduct = e => {
    e.preventDefault();

    if ($("#productName").val() == '' || $("#productPrice").val() == '' || $("#description").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#productForm").attr("action"), $("#productForm").serialize(), function () {
        loadProductsFromServer();
    });

    return false;
};

const deleteProduct = e => {
    // console.log("hello", e.target.parentNode.id);
    let productId = e.target.parentNode.id;
    // console.log(csrfToken);
    let params = `data=${productId}&_csrf=${csrfToken}`;
    // console.dir(params);

    sendAjax('DELETE', '/deleteProduct', params, function () {
        console.log("success");
    });
};

// updating the actual product
const updateProductHandle = e => {
    e.preventDefault();

    console.log(e);
    let productId = e.target.parentNode.id;
    console.log(productId);

    if ($("#updateName").val() == '' || $("#updatePrice").val() == '' || $("#updateDescription").val() == '') {
        handleError("All fields are required in order to update product.");
        return false;
    }

    // $("#updateProductForm").serialize()
    let updatedProduct = $("#updateProductForm").serialize();
    // let query = `&${updatedProduct}`;

    console.dir(updatedProduct);

    // PUT, /updateProduct, 
    // sendAjax('PUT', $("#updateProductForm").attr("action"), query, function() {
    //     console.log("success");
    // });

    return false;
};

// rendering the form with a modal
const UpdateProductForm = props => {
    console.dir(props);

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
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { type: "hidden", name: "id", value: props.product }),
                React.createElement("input", { className: "updateProductSubmit", type: "submit", value: "Update Product" })
            )
        )
    );
};

const closeModal = e => {
    // console.log(e);
    // e.target.parentNode.style.display = "none";
    // console.dir(e.target.parentNode);

    ReactDOM.render(React.createElement(
        "div",
        null,
        " "
    ), document.querySelector("#testing"));
};

const showUpdateProductForm = function (e, csrf, productId) {
    ReactDOM.render(React.createElement(UpdateProductForm, { csrf: csrf, product: productId }), document.querySelector("#testing"));
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
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeProductSubmit", type: "submit", value: "Create Product" })
    );
};

const ProductList = function (props) {
    console.dir(props);

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
                "button",
                { id: "deleteButton", type: "button", onClick: e => deleteProduct(e) },
                "Delete"
            ),
            React.createElement(
                "button",
                { id: "updateButton", type: "button", onClick: e => showUpdateProductForm(e, props.csrf, product._id) },
                "Update"
            ),
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
            )
        );
    });

    return React.createElement(
        "div",
        { className: "productList" },
        productNodes
    );
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

    loadProductsFromServer();
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
const handleError = message => {
    $("#errorMessage").text(message);
    console.log(message);
};

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
