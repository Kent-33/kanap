/**
 * Gestion des produits en objets
 */

class ArticlePoduct{
    constructor(listProduct){
        this.listProduct = listProduct;
    }
    sort(){
        this.listProductsort((a,b) => {
           return (a.price < b.price)?1:-1;
        }); 
    }
}