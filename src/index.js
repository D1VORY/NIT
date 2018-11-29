import './scss/main.scss';
import $ from 'jquery';
window.$ = $;
window.jQuery = $;


/*MMM Spaghetti*/

let _makeProduct = require('./modules/product-html');
 jQuery.ajax({
	url: 'https://nit.tron.net.ua/api/product/list',
	method: 'get',
 	dataType: 'json',
 	success: function(json){

		//console.table(json);
 		json.forEach(product => $('.product-grid').append(_makeProduct(product)));
		
	},
	error: function(xhr){
		alert("An error occured: " + xhr.status + " " + xhr.statusText);
 	},
 });

 let _makeCategory = require('./modules/category-html');
 jQuery.ajax({
 	type: 'GET',
	url: 'http://nit.tron.net.ua/api/category/list',
	data: { get_param: 'value'},
	dataType: 'json',

 	success: function(json,data){
		
		console.table(json);
		$('.category-ul').append($(`<li class="category-li cat1" data-category-id="1">`));
		$('.cat1').append($('<a class = "category-description" href = "#">').text('All products'));
	
 		json.forEach(category => $('.category-ul').append(_makeCategory(category)));

		//console.log('Added categories');
	},
	error: function(xhr){
		alert("An error occured: " + xhr.status + " " + xhr.statusText);
 	},
 });


$(document).on("click",".category-li",function() {
	$('.product-grid').empty();

	var $this = $(this);
		var id = $this.data('category-id');
		let _makeProduct = require('./modules/product-html');
		if( id != 1){
	 jQuery.ajax({
		url: 'http://nit.tron.net.ua/api/product/list/category/' + id,
		method: 'get',
	 	dataType: 'json',
	 	success: function(json){

			//console.table(json);
	 		json.forEach(product => $('.product-grid').append(_makeProduct(product)));
			
		},
		error: function(xhr){
			alert("An error occured: " + xhr.status + " " + xhr.statusText);
	 	},
	 });
	}else{
		jQuery.ajax({
		url: 'http://nit.tron.net.ua/api/product/list',
		method: 'get',
	 	dataType: 'json',
	 	success: function(json){
	 		json.forEach(product => $('.product-grid').append(_makeProduct(product)));
		},
		error: function(xhr){
			alert("An error occured: " + xhr.status + " " + xhr.statusText);
	 	},
	 });
	}
});





$(document).on("mouseenter",".product",function() {   		
		var $this = $(this);
 		var id = $this.data('product-id');
 		
		 jQuery.ajax({
		 	type: 'GET',
			url: 'http://nit.tron.net.ua/api/product/' + id,			
			data: { get_param: 'value'},
		 	dataType: 'json',

		 	success: function(data){
		 		$('.' + id).append($('<span class = "product-description ">').text(data.description));
				
			},
			error: function(xhr){
				alert("An error occured: " + xhr.status + " " + xhr.statusText);
		 	},
		 });		
});


$(document).on("mouseleave",".product",function() {   		
		var $this = $(this);
 		var id = $this.data('product-id');
 		
 		$('.' + id).children('.product-description').remove();
 		
		
    });

$(document).on("mouseenter",".category-li",function() {   		
		var $this = $(this);
 		var id = $this.data('category-id');
 		
 		$('.cat' + id).addClass('active');		
    });

$(document).on("mouseleave",".category-li",function() {   		
		var $this = $(this);
 		var id = $this.data('category-id');
 		
 		$('.cat' + id).removeClass('active');		
    });




$(document).on("click",".buy-button",function() {   			
		var $this = $(this);
 		var el = $this.parent();
 		var id = $(el).data('product-id');
 		var product = {};

 		if(localStorage.getItem(id) !== null){
 			product = JSON.parse(localStorage.getItem(id));
 			product.quantity += 1;

 			var serialObj = JSON.stringify(product);
			localStorage.setItem(id,serialObj);		
 		}else{	
			product.name = $(el).children('.product-title').text();
			product.image = $(el).children('.product-image').attr('src');

			if($(el).has('.special').length ){
				product.price = $(el).children('.special').text();
			}else{
				product.price = $(el).children('.product-price').text();
			}		
			product.quantity = 1;
			var serialObj = JSON.stringify(product);

			localStorage.setItem(id,serialObj);
			var retObj = JSON.parse(localStorage.getItem(id));
		}
		//console.log(localStorage.getItem(id));
    });


$(document).on("click",".cart",function() { 
	$('.modal-body').empty();
	$('.total-product-price').empty();
	$('#totSum').text('Total sum: ');
	var pr;  
	var sum =0;
	var key;
	for (var i = 0; i < localStorage.length; i++){
		key = localStorage.key(i);
		pr = JSON.parse(localStorage.getItem(key));
		//console.log(pr);
		$('.modal-body').append(`<div class = "product-in-cart${key} kek card" data-product-in-cart-id="${key}">`);
		$('.product-in-cart' + key).append($(`<button type="button" class="btn btn-default btn-sm btndelete" id = "btndel${key}">`));
		$('#btndel' + key).append($(`<span class="glyphicon glyphicon-trash">`));
		$('.product-in-cart' + key).append($(`<img src="${pr.image}" alt="${name}" class="img-fluid product-image">`))	;	
		$('.product-in-cart' + key).append($(`<span class="product-title">`).text(pr.name));
		$('.product-in-cart' + key).append($(`<span class = "product-price">`).text(pr.price));

		$('.product-in-cart' + key).append($(`<div class = "product-quantity${key} center-block ">`));
		$('.product-quantity' +key).append($(`<button type="button" class="btn btn-default btnm${key} btnminus">`));
		$('.btnm' +key ).append($(`<span class="glyphicon glyphicon-minus qt" >`));
		$('.product-quantity' +key).append($(`<span class="product-current-quantity${key} qt">`).text(pr.quantity));
		$('.product-quantity' +key).append($(`<button type="button" class="btn btn-default btnp${key} btnplus">`));
		$('.btnp' +key).append($(`<span class="glyphicon glyphicon-plus qt" >`));
		sum += pr.price * pr.quantity;
	}
	$('.total-product-price').append(sum);
});


$(document).on("click",".btndelete",function() {   		
		var $this = $(this);
 		var id = $this.parent().data("product-in-cart-id");
 		$('.product-in-cart' + id).remove();
 		var pr =  JSON.parse(localStorage.getItem(id));
 		var sum = $('.total-product-price').text();
 		$('.total-product-price').text(parseFloat(sum) - (parseFloat(pr.price)*pr.quantity));
		localStorage.removeItem(id);
});

$(document).on("click",".btnminus",function() {   		
		var $this = $(this);
 		var id = $this.parent().parent().data("product-in-cart-id");
 		var pr = JSON.parse(localStorage.getItem(id));
 		var sum = $('.total-product-price').text();
 		console.log(sum);
 		console.log(typeof(sum));
 		if(pr.quantity > 0){			
	 		pr.quantity--;
	 		$('.product-current-quantity' + id).text(pr.quantity);
	 		//console.log(pr);
	 		console.log(pr.price);
 			console.log(typeof(pr.price));
	 		$('.total-product-price').text(parseFloat(sum) - parseFloat(pr.price));
	 		var serialObj = JSON.stringify(pr);
			localStorage.setItem(id,serialObj);
			//console.log(localStorage.getItem(id));
			
		}
		if(pr.quantity == 0){
			$('.product-in-cart' + id).remove();
			localStorage.removeItem(id);
		}
});

$(document).on("click",".btnplus",function() {   		
		var $this = $(this);
 		var id = $this.parent().parent().data("product-in-cart-id");
 		var pr = JSON.parse(localStorage.getItem(id));
 		var sum = $('.total-product-price').text();
 		$('.total-product-price').text(parseFloat(sum) + parseFloat(pr.price));
 		pr.quantity++;
 		$('.product-current-quantity' + id).text(pr.quantity);
 		//console.log(pr);
 		var serialObj = JSON.stringify(pr);
		localStorage.setItem(id,serialObj);
		//console.log(localStorage.getItem(id));
});



$(document).on('click', '.purchase', function(e){
	 var name = $('.name').val();
	 var phone = $('.telephone').val();
	 var email = $('.email').val();
	 var products = "";	 
	var product;
	for (var i = 0; i < localStorage.length; i++){
		product = JSON.parse(localStorage.getItem(localStorage.key(i)));		
		products += "products[" +localStorage.key(i) + "]="+product.quantity+"&";		
	}
	 if(name && phone && email && products){
	 
	 jQuery.ajax({
	  url: 'https://nit.tron.net.ua/api/order/add',
	  method: 'post',
	  token: 'GQTs-je8EFgaPirHNisR',
	  dataType: 'json',
	  data:
	  'name='+name+'&email='+email+'&phone='+phone+'&'+products+'token=GQTs-je8EFgaPirHNisR',
	  success: function(){	  	
	   	alert("Succesfully purchased");
	   	localStorage.clear();
	   	//$('#myModal').modal('hide');
	  },
	  error: function(xhr){
	  	
	   alert("An error occured: "+ xhr.status+" "+ xhr.statusText);
	  },
	});
	}else{
		if(!name){
			alert("Enter your name");
		}

		if(!phone){
			alert("Enter your telephone number");
		}

		if(!email){
			alert("Enter your e-mail");
		}

		if(!products){
			alert("You haven't chosen any product!");
		}

	}
});


