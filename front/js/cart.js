/**
 * Gère l'affichage et les interactions de la page panier
 */

function getProductsInCart() {
    let curentProductLinea = localStorage.getItem("cart");
    let curentProductJson = JSON.parse(curentProductLinea);
    console.log(curentProductJson);
    
    for (let cartProduct of curentProductJson) {
        const cartItem = document.getElementById('cart__items');
        console.log(cartProduct);

        var cartArticle = document.createElement("article");
        cartArticle.setAttribute("class", "cart__item");
        cartArticle.setAttribute("data-id", `${cartProduct.id}`);
        cartArticle.setAttribute("data-color", `${cartProduct.color}`);
        cartItem.appendChild(cartArticle);

        var cartImg = document.createElement("div");
        cartImg.setAttribute("class", "cart__item__img");
        cartImg.textContent = `${cartProduct.img}`;
        cartArticle.appendChild(cartImg);

        var cartItemContent = document.createElement("div");
        cartItemContent.setAttribute("class", "cart__item__content"),
        cartArticle.appendChild(cartItemContent);
        
        var cartItemContentDescription = document.createElement("div");
        cartItemContentDescription.setAttribute("class", "cart__item__content__description"),
        cartItemContent.appendChild(cartItemContentDescription);
        
        var cartItemTitle = document.createElement("h2");
        cartItemTitle.textContent = cartProduct.name;
        cartItemContentDescription.appendChild(cartItemTitle);
    }
}


getProductsInCart();

function removeFromCart(product) {
    let cart = getCart();
    cart = cart.filter( p => p.id != product.id)
    saveCart(product);
}

function changeQuantity(product, quantity) {
    let cart = getCart();
    let foundProductId = cart.find(p => p.id == product.id);
    let foundProductColor = cart.find(p => p.color == product.color);
    if(foundProductId != undefined) {
        if(foundProductColor != undefined) {
            foundProductId.quantity += quantity;
            if(foundProductId.quantity <=0) {
                removeFromCart(foundProductId);
            }
            else {
                saveCart(cart);
            }
        }
    }
}