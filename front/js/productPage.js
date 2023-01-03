/**
 * Gère l'affichage et les interactions de la page produit
 */
var str = window.location.href;
console.log(str);
var url = new URL(str);
var search_params = new URLSearchParams(url.search); 
if(search_params.has('name')) {
  var name = search_params.get('name');
  console.log(name)
}