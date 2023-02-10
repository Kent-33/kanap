/**
 * Gère l'affichage et les interactions de la page panier
 */

// Affiche le résumé du panier
function showCart() {
    let cartList = getCart();
    let totalProductsQuantity = [];      
    let totalProductsPrice = []; 
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
            cartItemTitle.textContent = product.name;

            var cartItemColor = document.createElement("p");
            cartItemColor.textContent = cartProduct.color;
            
            var cartItemPrice = document.createElement("p");
            cartItemPrice.setAttribute ("id", "productPrice");
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

            document.querySelector("[data-id=\"" + cartProductId + "\"][data-color=\"" + cartProduct.color + "\"] .itemQuantity")
                .addEventListener('change', function () {
                changeQuantity(product._id, cartProduct.color);
            }); 

            var cartItemContentDelete = document.createElement("div");
            cartItemContentDelete.setAttribute("class", "cart__item__content__settings__delete");
            cartItemContentSettings.appendChild(cartItemContentDelete);

            var deleteItem = document.createElement("p");
            deleteItem.setAttribute("class", "deleteItem");
            deleteItem.textContent = 'Suprimer';
            cartItemContentDelete.appendChild(deleteItem);

            document.querySelector("[data-id=\"" + cartProductId + "\"][data-color=\"" + cartProduct.color + "\"] .deleteItem")
                .addEventListener('click', function () {
                removeFromCart(product._id, cartProduct.color);
            });     
            
            totalProductsPrice.push(parseInt(product.price) * parseInt(cartProduct.quantity));
            totalCartPrice(totalProductsPrice);         
        })
        totalProductsQuantity.push(parseInt(cartProduct.quantity));
    }
    totalCartQuantity(totalProductsQuantity);
}
showCart();

// Supprime le code html affhant le panier et affiche le panier MAJ
function removeShowedCart() {
    var articlesCart = document.querySelectorAll("article");
    for ( let i = 0; i < articlesCart.length; i++) {        
        articlesCart[i].remove();
    }
    showCart();
}

// Enregistre la panier 
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));    
}

// Appel le pannier du local storage
function getCart() {
    let cart = localStorage.getItem("cart");
    if(cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

// Supprime du local storage
function removeFromCart(product, color) {
    let cart = getCart(); 
    let foundIndex = cart.findIndex(p => p.id == product && p.color == color); 
    cart.splice(foundIndex,1);    
    saveCart(cart);
    removeShowedCart();
}

// Change les quantités du panier à l'affichage et dans le local storage
function changeQuantity(product, color) {    
    var curentProductQuantity = document.querySelector("[data-id=\"" + product + "\"][data-color=\"" + color + "\"] .itemQuantity");  
    let cart = getCart(); 
    let foundIndex = cart.findIndex(p => p.id == product && p.color == color); 

    if ((parseInt(curentProductQuantity.value) > 0) && (parseInt(curentProductQuantity.value) < 101)){
        cart[foundIndex].quantity = parseInt(curentProductQuantity.value);                          
    } 
    else if (parseInt(curentProductQuantity.value) < 1){
        if (confirm('Souhaitez vous supprimer ce produit du panier ?')) {
            removeFromCart(product, color);
            removeShowedCart()
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
    removeShowedCart();
}

// Calcule la quantité totale
async function totalCartQuantity(quantity) {
    let finalQuantity = 0; 
    for (let i = 0; i < quantity.length; i++) {
        finalQuantity += quantity[i];
    }
    document.getElementById('totalQuantity').textContent = finalQuantity;
}

// Calcule le prix total
async function totalCartPrice(price) {
    let finalPrice = 0; 
    for (let i = 0; i < price.length; i++) {
        finalPrice += price[i];
    }
    document.getElementById('totalPrice').textContent = finalPrice;
}

document.getElementById("order")
    .addEventListener('click', function (e) {
        e.preventDefault();
        formValidation();
        return false;
    });   

// Valide la commande et renvoie sur la page de confirmation
async function formValidation() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;
    let regExMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;    
    let processOrder = true;
    let cart = getCart();
    let cartValidation = true;

    if(cart.length < 1) {
        cartValidation = false;
        alert('Votre panier est vide. Veuillez sélectionner un article avant de procéder à la commande');
    }
    if (firstName == '') {
        document.getElementById("firstNameErrorMsg").textContent = "Merci de renseigner correctemnt ce champs. Ex: Jean";
        processOrder = false;
    } 
    if (lastName =='') {
        document.getElementById("lastNameErrorMsg").textContent = "Merci de renseigner correctemnt ce champs. Ex: Dupont";
        processOrder = false;
    }
    if(address == '') {
        document.getElementById("addressErrorMsg").textContent = "Merci de renseigner correctemnt ce champs. Ex: 12 rue des divans";
        processOrder = false;
    }
    if(city == '') {
        document.getElementById("cityErrorMsg").textContent = "Merci de renseigner correctemnt ce champs. Ex: Paris";
        processOrder = false;
    }
    if((email == '') || (!regExMail.test(email))) {
        document.getElementById("cityErrorMsg").textContent = "Merci de renseigner correctemnt ce champs. Ex: j.dupont@email.fr";
        processOrder = false;
    }
    if (processOrder && cartValidation) {
        let contact = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        };
        let products = [];
        let cart = getCart();
        for (let product of cart) {   
          products.push(product.id);
        }
        let response = await fetch('http://localhost:3000/api/products/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({contact, products}),
        });    
        let result = await response.json();
        document.location.href = 'confirmation.html?orderId=' + result.orderId;
    }
    
}
    
