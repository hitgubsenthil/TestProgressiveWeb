/**
 *  wish-list functionality 
 */


function loadWishlistDetailsContent(wishlistJson) {

	if(wishlistJson && wishlistJson!=null && wishlistJson!="") {
		var wishListContent = jQuery.parseJSON(wishlistJson);
		var wishlistLineItem = wishListContent.wishlistLineItem;

		if(wishlistLineItem && wishlistLineItem!="" && wishlistLineItem!=null) {
			var length = wishlistLineItem.length;
			
			for(var i=0;i<wishlistLineItem.length;i++){
				var lineItemId = wishlistLineItem[i].lineItemId;
				var productId = wishlistLineItem[i].productId;
				var itemDescription = wishlistLineItem[i].itemDescription;
				var imageURL = wishlistLineItem[i].imageURL;
				//var productImage = $('<img style="height: 150px;"/>').attr('src' , imageURL);
				var productImage = $('<img class="mimg" />').attr('src' , imageURL);
				if ( imageURL.indexOf("small") > -1 ){
					//var productImage = $('<img style="height: 150px;"/>').attr('src' , imageURL);
					
					var productImage = $('<img class="mimg" />').attr('src' , imageURL);
				}
				var productURL = wishlistLineItem[i].productURL;
				var skuId = wishlistLineItem[i].skuId;					
				var pointValue = wishlistLineItem[i].pointValue;
				var price = wishlistLineItem[i].price;
				var rollupId = wishlistLineItem[i].rollupId;
				var quantity = wishlistLineItem[i].quantity;
				var cartPage = "cartPage";
				var hiddenValues= $(' <input id="wishlistdetails_'+i+'" type="hidden" quantity="'+quantity+'"  rollupId="'+rollupId+'" price="'+price+'" pointValue="'+pointValue+'" itemDescription="'+itemDescription+'" skuId= "'+skuId+'" lineItemId="'+lineItemId+'"  productId="'+productId+'" imageURL="'+imageURL+'" productURL="'+productURL+'"/>');
				var removecart = $('<a class="wish-remove" onclick="removeWishListItem('+lineItemId+');" href="javascript:void(0);"/>').text("Remove");
				var movetocartdesc = $('<a class="button radius add-cart"   onclick="moveToCart(wishlistdetails_'+i+');" href="javascript:void(0);"/>').text("MOVE TO CART");
				var movetocart = $('<li class="cta-button" style="padding-bottom:2em">').append(movetocartdesc).append(removecart).append(hiddenValues);

				var description = $('<a class="bold black" href="javascript:void(0)" onclick="homeRetriveProductDetails(\''
		                + productId
		                + '\',\''
		                + cartPage
		                + '\',\''
		                + cartPage
		                + '\')">').text(itemDescription);
				var desc = $('<li class="description bold black style="height: 50px;">').append(description);

				
				productImage.attr('alt' , desc);
				var productImageLink = $('<a  href="javascript:void(0)" onclick="homeRetriveProductDetails(\''
		                + productId
		                + '\',\''
		                + cartPage
		                + '\',\''
		                + cartPage
		                + '\')">').append(productImage);
				
				/*var productImageDiv = $('<div class="productImageDiv">');
				productImageDiv.append(productImageLink);*/				
				var productImageLinkDiv = $('<div class="pro-image" style="height:98px">').append(productImageLink);
				var title = $('<li class="title">').append(productImageLinkDiv);
				var pricingTableli = $('<ul class="pricing-table">').append(title).append(desc).append(movetocart);
				var featuredProductli = $('<li class="featured-product-wrapper"/>').append(pricingTableli);

				$('#products-list').append(featuredProductli);
			}

		}else {
			var emptywishlist = $('<p>').text("You currently have nothing saved in your wish list.");
			var anchortag = $('<a href="" style="color:#ff651c;">&#60;&#60;').text("Continue Shopping");
			var continueShopping =  $('<span style="font-weight: bold;  font-size: 12px;  padding: 20px 10px;  display: block;  color: #3366cc;  width: 150px;margin-bottom: 14em;">').append(anchortag);
			$('.wish_list_page').append(emptywishlist).append(continueShopping);
			return false;	
		}
	}else {
		var emptywishlist = $('<p>').text("You currently have nothing saved in your wish list.");
		var anchortag = $('<a href="/trex/app/home" style="color:#ff651c;">&#60;&#60;').text("Continue Shopping");
		var continueShopping =  $('<span style="font-weight: bold;  font-size: 12px;  padding: 20px 10px;  display: block;  color: #3366cc;  width: 150px;margin-bottom: 14em;">').append(anchortag);
		$('.wish_list_page').append(emptywishlist).append(continueShopping);
		return false;	
	}
}

function moveToCart(id) {
	var wishListId = $(id).attr('lineItemId');
	var skuId = $(id).attr('skuId');
	var productId = $(id).attr('productId');
	
	var form = $('<form></form>');
	form.attr("method", "post");
	form.attr("action", '/trex/app/secure/moveToCart');
	
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "wishListId");
	field.attr("value", wishListId);
	var field1 = $('<input></input>');
	field1.attr("type", "hidden");
	field1.attr("name", "productId");
	field1.attr("value", productId);	
	var field2 = $('<input></input>');
	field2.attr("type", "hidden");
	field2.attr("name", "skuId");
	field2.attr("value", skuId);
	
	form.append(field);
	form.append(field1);
	form.append(field2);
	
	$(document.body).append(form);
	//form.submit();
	submitFormWithCsrfToken(form);
	
}

function removeWishListItem(lineItemId){
	
	if(validateWishListRemove()) {
	
	var form = $('<form></form>');
	form.attr("method", "post");
	form.attr("action", '/trex/app/secure/wishlist/remove');
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "lineItemId");
	field.attr("value", lineItemId);
	form.append(field);
	$(document.body).append(form);
	//form.submit();
	submitFormWithCsrfToken(form);
	
	}
}

function validateWishListRemove() {
    return confirm(" Are you sure you want to remove this item from your wishlist?");
}
