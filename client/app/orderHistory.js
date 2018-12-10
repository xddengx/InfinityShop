var csrfToken;
var spirals;


const OrdersList = function(theOrders){
    // no products exist 
    if(theOrders.orders.length === 0){
        return (
            <div className="ordersList">
                <h3 className="emptyOrders">No orders to show! No purchases were made.</h3>
            </div>
        );
    }

    // map function to create UI for EACH product stored
    // every product will generate a product Div and add it to productNodes
    // advantage is that we can update the sate of this component via Ajax.
    // everytimes the state updates, the page will immediately create UI and show the updates
    const orderNodes = theOrders.orders.map(function(order) {
        return(
            <div className="productCard" key={order._id} id={order._id} className="product">
                <div id="test"> 
                    <div><img className="theProductImage" src= {order.productImage}alt="" /> </div>
                    <div id="prodInfo">
                        <h3 className="productName"> {order.name} </h3>
                        <h4 className="productDescription"> {order.description} </h4>
                        <h3 className="productPrice"> ${order.price} </h3>                      
                    </div>
                </div>
            </div>
        );
    });

    return(
        <div>
            <h2 id="pageHeader">Order History</h2>
            <div className="productList">
            {orderNodes}
        </div></div>
    );
};

// // from result.spirals
const SpiralCash = function(obj){
    return (
        <div className="money">
            <a href="/gameCenter">Spiral Cash: $ {obj.spiral}</a>
        </div>
    );

}

const getSpiralsOrdersPage = () => {
    sendAjax('GET', '/getSpirals', null, (result) => {
        ReactDOM.render(
            <SpiralCash spiral={result} />, document.querySelector("#spiralsOrderHistory"),
        );
    });
};

const loadOrderHistory = () =>{
    sendAjax('GET', '/orders', null, (data) => {
        ReactDOM.render(
            <OrdersList orders={data.orders} csrf={csrfToken} />, document.querySelector("#orders")
        );
    });
}

// setup function takes a CSRF token in client/userAccount.js
// function will render out ProductForm to the page and a default product list
const orderPageSetup = function(csrf){
    ReactDOM.render(
        <OrdersList orders={[]} csrf={csrf} />, document.querySelector("#orders")
    );

    ReactDOM.render(
        <SpiralCash spiral={spirals} />, document.querySelector('#spiralsOrderHistory'),
    );

    loadOrderHistory();
    getSpiralsOrdersPage();
};

// allows us to get new CSRF token for new submissions
const getTokenOrderPage = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        orderPageSetup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};