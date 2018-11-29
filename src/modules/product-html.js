let _makeHtml = ({
	id,
	name,
	image_url,
	description,
	price,
	special_price
}) => {
	let $product = $(`<div class="product card  col-xs-12 col-sm-4 col-md-3 ${id} d-flex flex-column" data-product-id="${id}">`);
	$product.append($(`<img src="${image_url}" alt="${name}" class="img-fluid product-image">`));
	$product.append($(`<span class="product-title mt-auto">`).text(name));
	$product.append($('<span class = "product-price mt-auto">').text(price));
	if(special_price != null){
		$product.children('.product-price').css({"text-decoration":"line-through","color" : "gray","background-color" : "white"});
		$product.append($('<span class = "product-price special">').text(special_price));
	}
	$product.append($(`<button class = "btn-primary btn-block btn-lg buy-button ">`).text("To cart!"))

	return $product;
};
 module.exports = _makeHtml;