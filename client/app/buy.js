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