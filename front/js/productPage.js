/**
 * Gère l'affichage et les interactions de la page produit
 */

// Identifie l'id produit passé dans l'URL
var str = window.location.href;
var url = new URL(str);
var search_params = new URLSearchParams(url.search); 
if(search_params.has('id')) {
  var productId = search_params.get('id');
}

// Récupère les infos du produit dont l'id est donnée dans l'URL et les intègre dans le HTML
fetch(`http://localhost:3000/api/products/${productId}`)
.then( data => data.json())
.then( jsonProduct => {
    let product = new Product(jsonProduct);
    var itemImg = document.getElementsByClassName('item__img');
    var productImg = document.createElement("img");
    productImg.setAttribute("src", `${product.imageUrl}`);
    productImg.setAttribute("alt", `${product.altTxt}`);
    itemImg[0].appendChild(productImg);

    var productTitle = document.getElementById('title');
    var title = document.createTextNode(`${product.name}`);
    productTitle.appendChild(title);

    var productPrice = document.getElementById('price');
    var price = document.createTextNode(`${product.price}`);
    productPrice.appendChild(price);
    
    var productDesc = document.getElementById('description');
    var desc = document.createTextNode(`${product.description}`);
    productDesc.appendChild(desc);
    
    var productColors = document.getElementById('colors');

    for(let color in product.colors) {                
        var colorOption = document.createElement("option");
        colorOption.textContent=  `${product.colors[color]}`;
        colorOption.setAttribute("value", `${product.colors[color]}`);              
        productColors.appendChild(colorOption);
    }         
});

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

function addToCart() {
    var selectColor = document.getElementById('colors');
    var curentProductColor = selectColor.options[selectColor.selectedIndex].value;
    var curentProductQuantity = document.getElementById('quantity').value;
    var curentProductTitle = document.getElementById('title').textContent;
    let product = {
            id : productId,
            color : curentProductColor,
            quantity : curentProductQuantity,
            name : curentProductTitle
    }

    if ((parseInt(curentProductQuantity) > 0) && (parseInt(curentProductQuantity) < 100)){
        let cart = getCart();
        let foundIndex = cart.findIndex(p => p.id == product.id && p.color == product.color);

        if (foundIndex != -1) {
            cart[foundIndex].quantity = parseInt(cart[foundIndex].quantity) + parseInt(curentProductQuantity);                   
        } else {
            product.quantity = curentProductQuantity;
            cart.push(product);
        }
        saveCart(cart);
    }
    else {
        alert('La quantité sélectionnée doit être comprise entre 1 et 99');
    }
}
 
document.getElementById("addToCart").onclick = function() {  
    addToCart();
}; 
