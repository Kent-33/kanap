/**
 *  Gére l'affichage du numéro de commande
 */

// Identifie l'orderId passé dans l'URL
var str = window.location.href;
var url = new URL(str);
var search_params = new URLSearchParams(url.search); 
if(search_params.has('orderId')) {
  var orderId = search_params.get('orderId');
}

// Affiche l'orderID
if (orderId) {
  let orderConfirmation = document.getElementById('orderId');
  orderConfirmation.textContent = orderId;
}

