/**
 * Gère l'affichage et les interactions de la page panier
 */

fetch(" http://localhost:3000/api/products")
.then( data => data.json())
.then( jsonListProducts => {
    for(let jsonProduct of jsonListProducts) {
        let product = new Product(jsonProduct);
        let curentProductLinea = localStorage.getItem("cart");
        let curentProductJson = JSON.parse(curentProductLinea);
        for (let cartProduct of curentProductJson) {            
            if (product._id == cartProduct.id) {
                const cartItem = document.getElementById('cart__items');
        
                var cartArticle = document.createElement("article");
                cartArticle.setAttribute("class", "cart__item");
                cartArticle.setAttribute("data-id", `${cartProduct.id}`);
                cartArticle.setAttribute("data-color", `${cartProduct.color}`);
                cartItem.appendChild(cartArticle);
        
                var itemImg = document.createElement("div");
                itemImg.setAttribute("class", "cart__item__img");
                var cartImg = document.createElement("img");
                cartImg.setAttribute("src", `${product.imageUrl}`);
                cartImg.setAttribute("alt", `${product.altTxt}`);
                itemImg.appendChild(cartImg);
                cartArticle.appendChild(itemImg);
        
                var cartItemContent = document.createElement("div");
                cartItemContent.setAttribute("class", "cart__item__content"),
                cartArticle.appendChild(cartItemContent);
                
                var cartItemContentDescription = document.createElement("div");
                cartItemContentDescription.setAttribute("class", "cart__item__content__description"),
                cartItemContent.appendChild(cartItemContentDescription);
                
                var cartItemTitle = document.createElement("h2");
                cartItemTitle.textContent = cartProduct.name;
                cartItemContentDescription.appendChild(cartItemTitle);

                var cartItemColor = document.createElement("p");
                cartItemColor.textContent = cartProduct.color;
                cartItemContentDescription.appendChild(cartItemColor);
                
                var cartItemPrice = document.createElement("p");
                cartItemPrice.textContent = product.price + ' €';
                cartItemContentDescription.appendChild(cartItemPrice);

                var cartItemContentSettings = document.createElement("div");
                cartItemContentSettings.setAttribute("class", "cart__item__content_settings"),
                cartArticle.appendChild(cartItemContentSettings);
                
                var cartItemContentSettingsQuantity = document.createElement("div");
                cartItemContentSettingsQuantity.setAttribute("class", "cart__item__content_settings_quantity"),
                cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

                var cartItemContentSettingsQuantityP = document.createElement("p");
                cartItemContentSettingsQuantityP.textContent = 'Qté : ';
                cartItemContentSettingsQuantity.appendChild(cartItemContentSettingsQuantityP);
                
                var cartItemContentSettingsQuantityInput = document.createElement("input");                
                cartItemContentSettingsQuantityInput.setAttribute("type", `number`);
                cartItemContentSettingsQuantityInput.setAttribute("class", `itemQuantity`);
                cartItemContentSettingsQuantityInput.setAttribute("name", `itemQuantity`);
                cartItemContentSettingsQuantityInput.setAttribute("min", `1`);
                cartItemContentSettingsQuantityInput.setAttribute("max", `100`);
                cartItemContentSettingsQuantityInput.setAttribute("value", `${cartProduct.quantity}`);
                cartItemContentSettingsQuantityInput.textContent = 'Qté : ' + cartProduct.quantity;
                cartItemContentSettingsQuantity.appendChild(cartItemContentSettingsQuantityInput);

                document.getElementsByClassName('itemQuantity')[0]
                    .addEventListener('change', function (evt) {
                    changeQuantity(cartProduct);
                }); 
            }
            else {
                console.log('nope');
            }
        }
    }
})
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    
}

function getCart() {
    let cart = localStorage.getItem("cart");
    if(cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}
function removeFromCart(product) {
    let cart = getCart();
    cart = cart.filter( p => p.id != product.id)
    saveCart(product);
}

function changeQuantity(product) {
    var curentProductQuantity = document.getElementsByClassName('itemQuantity')[0].value;
    if ((parseInt(curentProductQuantity) > 0) && (parseInt(curentProductQuantity) < 100)){
        let cart = getCart();
        let foundIndex = cart.findIndex(p => p.id == product.id && p.color == product.color);

        if (foundIndex != -1) {
            cart[foundIndex].quantity =  parseInt(curentProductQuantity);                   
        } 
        saveCart(cart);
    }
    else {
       console.log(product);
    }
}