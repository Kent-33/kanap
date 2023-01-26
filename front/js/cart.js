/**
 * Gère l'affichage et les interactions de la page panier
 */
function showCart() {
    let cartList = getCart();
    for (let cartProduct of cartList) {
        let cartProductId = cartProduct.id;
        fetch(`http://localhost:3000/api/products/${cartProductId}`)
        .then( data => data.json())
        .then( jsonProduct => {
            let product = new Product(jsonProduct);
            const cartItem = document.getElementById('cart__items');        
            var cartArticle = document.createElement("article");
            cartArticle.setAttribute("class", "cart__item");
            cartArticle.setAttribute("data-id", `${product._id}`);
            cartArticle.setAttribute("data-color", `${product.color}`);
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
            cartItemTitle.textContent = product.name;

            var cartItemColor = document.createElement("p");
            cartItemColor.textContent = cartProduct.color;
            
            var cartItemPrice = document.createElement("p");
            cartItemPrice.textContent = product.price + ' €';
            cartItemContentDescription.append(cartItemTitle, cartItemColor, cartItemPrice);

            var cartItemContentSettings = document.createElement("div");
            cartItemContentSettings.setAttribute("class", "cart__item__content_settings");
            cartArticle.appendChild(cartItemContentSettings);
            
            var cartItemContentSettingsQuantity = document.createElement("div");
            cartItemContentSettingsQuantity.setAttribute("class", "cart__item__content_settings_quantity");
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

            document.querySelector("[data-id=\"" + cartProductId + "\"] .itemQuantity")
                .addEventListener('change', function (evt) {
                changeQuantity(product._id, cartProduct.color);
            }); 

            var cartItemContentDelete = document.createElement("div");
            cartItemContentDelete.setAttribute("class", "cart__item__content__settings__delete");
            cartItemContentSettings.appendChild(cartItemContentDelete);

            var deleteItem = document.createElement("p");
            deleteItem.setAttribute("class", "deleteItem");
            deleteItem.textContent = 'Suprimer';
            cartItemContentDelete.appendChild(deleteItem);

            document.querySelector("[data-id=\"" + cartProductId + "\"] .deleteItem")
                .addEventListener('click', function (evt) {
                removeFromCart(product._id, cartProduct.color);
            });

        });
    }
}
showCart();

function removeShowedCart(id) {
    var articlesCart = document.querySelector("[data-id=\"" + id + "\"]");
    articlesCart.remove();
}

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

function removeFromCart(product, color) {
    let cart = getCart(); 
    let foundIndex = cart.findIndex(p => p.id == product && p.color == color); 
    cart.splice(foundIndex,1);    
    saveCart(cart);
    removeShowedCart(product);
    showCart();
}

function changeQuantity(product, color) {    
    var curentProductQuantity = document.querySelector("[data-id=\"" + product + "\"] .itemQuantity");  
    let cart = getCart(); 
    let foundIndex = cart.findIndex(p => p.id == product && p.color == color); 

    if ((parseInt(curentProductQuantity.value) > 0) && (parseInt(curentProductQuantity.value) < 101)){
        cart[foundIndex].quantity = parseInt(curentProductQuantity.value);                          
    } 
    else if (parseInt(curentProductQuantity.value) < 1){
        if (confirm('Souhaitez vous supprimer ce produit du panier ?')) {
            removeFromCart(product, color);
        }
        else {
            newQuantity = parseInt(prompt("Chosissez une nouvelle quantité"));
            cart[foundIndex].quantity = newQuantity;
        }
    }
    else if (parseInt(curentProductQuantity.value) > 100){
        alert('Le kanap ' + cart[foundIndex].name + ' ne peut pas être commandé en plus de 100 exemplaires.');
    }
    saveCart(cart);
}

async function totalCart() {
    try {
        let cart = getCart();
        for (let cartProduct of cart) {
        totalPrice += parseInt(cartProduct.quantity);
        }
    } catch (e) {
      console.log(e);
    }
  }