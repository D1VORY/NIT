let _makeHtml = ({
	id,
	name,
	description,
	
}) => {
	let $category = $(`<li class="category-li cat${id}" data-category-id="${id}">`);
	
	$category.append($('<a class = "category-description" href = "#">').text(description));
	//$category.css("display","inline-block");

	return $category;
};
 module.exports = _makeHtml;