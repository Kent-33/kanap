/**
 * Gère l'affichage et les interactions de la page d'accueil
 */

fetch(" http://localhost:3000/api/products")
    .then( data => data.json())
    .then( jsonListProducts => {
       for(let jsonProduct of jsonListProducts) {

        let product = new Product(jsonProduct);
        const myList = document.getElementById('items');
        var productLink = document.createElement("a");
        var productArticle = document.createElement("article");
        var productImg = document.createElement("img");
        var productTitle = document.createElement("h3");
        var productDesc = document.createElement("p");
        
        productLink.setAttribute("href", `./product.html?id=${product._id}`);
        productImg.setAttribute("src", `${product.imageUrl}`);
        productImg.setAttribute("alt", `${product.altTxt}`);
        productTitle.setAttribute("class", "productName");
        productTitle.textContent = `${product.name}`;
        productDesc.setAttribute("class", "productDescription");
        productDesc.textContent = `${product.description}`;
        
        myList.appendChild(productLink);
        productLink.appendChild(productArticle);
        productArticle.appendChild(productImg);
        productArticle.appendChild(productTitle);
        productArticle.appendChild(productDesc);
       }
    })

    
    