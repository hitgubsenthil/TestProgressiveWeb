function loadCartBody(cartJson,wishListJsonContents, errorContents){
		
	
	if(wishListJsonContents!=""){
		var wishListJsonContents = jQuery.parseJSON(wishListJsonContents);
		rendertWishListItems(wishListJsonContents);
	}
	var checkoutButton=$('<a id="checkoutButton" href="javascript:void(0);" onclick="cartUpdate();" class="button radius yellow-button submit-button">CHECKOUT</a>');
	
	if(errorContents && errorContents!=null && errorContents!=""){
		$("#cart-message").html(errorContents);
		checkoutButton=$('<a id="checkoutButton" href="javascript:void(0);" class="button radius yellow-button submit-button disabled">CHECKOUT</a>');
	}

	if(cartJson && cartJson!=null && cartJson!="") {
	var tempContent = jQuery.parseJSON(cartJson);
	var cartLineItem = tempContent.extendedCartLineItem;
	if(cartLineItem == null || cartLineItem == ""){
		var emptycartlist = $('<p id="body_text_empty_cartlist">');
		$('.card_list').append(emptycartlist);
		$('#body_text_empty_cartlist').append('You currently have nothing saved in your wish list.');
		return false;
	}
	else {
	var totalPrice =0;
	var tatalRewardsPoints=0;
	var cartLength = cartLineItem.length;
	$('#cartLength').val(cartLength);
	for(var i=0;i<cartLineItem.length;i++){
		var skuId = cartLineItem[i].skuId;
		var lineItemId = cartLineItem[i].lineItemId;
		var productId = cartLineItem[i].productId;
		var itemDescription = cartLineItem[i].itemDescription;
		var onSalePoints = cartLineItem[i].salePoints;
		
		var pointValue = "";
		
		if(onSalePoints!=null && onSalePoints!="" && onSalePoints!=undefined)
		{
			pointValue = onSalePoints;
		}else{
			pointValue = cartLineItem[i].points;	
		}
		
		var price = cartLineItem[i].dollars;
		var rollupId = cartLineItem[i].rollupId;
		var quantity = cartLineItem[i].quantity;
		var imageURL = cartLineItem[i].imageURL;
		var productURL = cartLineItem[i].productURL;
		var rollupId = cartLineItem[i].rollupId;
		totalPrice = totalPrice + price;
		tatalRewardsPoints = tatalRewardsPoints + pointValue*quantity;
		var productImage2;
		var productImageLink2;
		var lastPart = imageURL.split('/');
		var lastURL = lastPart[lastPart.length-2];
		var cartPage = "cartPage";
		if(lastURL == 'large'){
			var mobileURL = imageURL.replace('large','small');
			productImage2 =$('<img class="show-for-small-down" src="'+mobileURL+'"/>');
			productImageLink2 = $('<a href="javascript:void(0)" onclick="homeRetriveProductDetails(\''
                    + productId
                    + '\',\''
                    + cartPage
                    + '\',\''
                    + cartPage
                    + '\')">').append(productImage2);
		}
		else{
			productImage2 =$('<img class="show-for-small-down" src="'+imageURL+'"/>');
			productImageLink2 = $('<a href="javascript:void(0)" onclick="homeRetriveProductDetails(\''
	                + productId
	                + '\',\''
	                + cartPage
	                + '\',\''
	                + cartPage
	                + '\')">').append(productImage2);
		}
		
		var tableRow = $('<tr id="orderline'+i+'" style="vertical-align: top;">');
		
		var orderLineImage = $('<td class="ordrline-image">');
		var productImage1 = $('<img class="hide-for-small-down" src="'+imageURL+'"/>');
		productImageLink1 = $('<a href="javascript:void(0)" onclick="homeRetriveProductDetails(\''
                + productId
                + '\',\''
                + cartPage
                + '\',\''
                + cartPage
                + '\')">').append(productImage1);
		
		var td2 = $('<td>');
		var productname = $(' <div class="prodname bold">');
		var productAnchor = $('<a href="javascript:void(0)" onclick="homeRetriveProductDetails(\''
                + productId
                + '\',\''
                + cartPage
                + '\',\''
                + cartPage
                + '\')">').text(itemDescription);
		productname.append(productAnchor);
		var itemNumber =  $('<div class="item hide-for-small-down">ITEM NUMBER: <span>'+productId+'</span></div>');
		
		var hiddenQty = "hiddenqty_" + i;
		
		var moveTowishList=$('<div class="add-to-wish" style="clear: left;width: 105px;"><a title="MoveToWishlist" id="moveToWishlist_'+i+'" href="javascript:void(0);" onclick="moveToWishlist(\''+ hiddenQty +'\');">MOVE TO WISHLIST</a></div>');

		var mble_update = $('<div class="add-to-wish show-for-small-down" style="clear:left;"><a id="cart-update-mobile" onclick="updatemobileCart('+i+')" href="javascript:void(0);">UPDATE CART</a></div>');
		
		var formatPrice = String(pointValue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		var pricetd=$('<td class="show-for-large-up">'+formatPrice+'</td>');
		
		var qtyTd =$(' <td class="hide-for-small-down" style="padding-left:0.5em;">');
		
		var qtyText=$('<input type="text" id="qty_'+i+'" name="qty'+i+'" value="'+quantity+'" placeholder="1" maxlength="3" class="radius left" style=" width: 3.5em;text-align: center; border-radius: 5px;"/>');
		var mblqtyText=$('<div class="show-for-small-down mobile-qty-update"><ul><li>QTY:</li><li><input type="text" id="qtymobile_'+i+'" name="qty'+i+'" value="'+quantity+'" placeholder="1" maxlength="3" class="radius" style=" width: 4em;text-align: center; border-radius: 5px;"/></li><li><span>X</span><span>'+pointValue+'</span></li></ul></div><br>');
		
		var qtyImg = $('<a href="javascript:void(0)"  onclick="updateCart('+i+');"><img id="cart-update_'+i+'" src="/trex_assets/images/refresh.png" alt="" class="postfix" style="height: 20px;width:18px;margin-top:8px; border:0px;cursor: pointer;"/></a>');
		
		var hiddenValues= $(' <input id="hiddenqty_'+ i+'" type="hidden" rollupId="'+rollupId+'" productId="'+productId+'" imageUrl="'+imageURL+'" productURL="'+productURL+'" skuid="'+skuId+'" skuprice="'+price+'" points="'+pointValue+'" itemDescription="'+itemDescription+'" lineItemId="'+lineItemId+'"/>');   
		
		var formatTotal = String( pointValue * quantity ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		var total=$('<td class="hide-for-small-down">'+ formatTotal +'</td>');
		 
		var deletebox=$(' <td class="delete"><a href="javascript:void(0);"><img onclick="removeFromCart('+lineItemId+');" id="'+cartLineItem[i].productId+'" src="/trex_assets/images/delete_icon.gif" alt="" style="position:absolute"></a></td>');
		
		 $('#order-table-id').append(tableRow);
		 tableRow.append(orderLineImage);
		 
		 orderLineImage.append(productImageLink1);
		 orderLineImage.append(productImageLink2);
		 
		 tableRow.append(td2);
		 td2.append(productname);
		 td2.append(itemNumber);
		 td2.append(mblqtyText);
		 td2.append(mble_update);
		 td2.append(moveTowishList);
		 
		 tableRow.append(pricetd);
		 
		 tableRow.append(qtyTd);
		 
		 qtyTd.append(qtyText);
		 qtyTd.append(qtyImg);
		 qtyTd.append(hiddenValues);
		 
		 tableRow.append(total);
		 
		 tableRow.append(deletebox);
		

	} 
//	var checkoutButton=$('<a id="checkoutButton" href="javascript:void(0);" onclick="cartUpdate();" class="button radius yellow-button submit-button">CHECKOUT</a>');
	 var continueDiv = $('<div class="continue-shopping" id="continue_shop"/>');
	var continueShopping=$('<a href="/trex/app/home"> or, Continue Shopping </a>');
	var formattotalRwardsCredits = String(tatalRewardsPoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	$('#totalRetail').append(formattotalRwardsCredits);
	$('#totalRetailMobile').append(formattotalRwardsCredits);
	if(tempContent.totalPointsUsed!=null && tempContent.totalPointsUsed!="" && tempContent.totalPointsUsed!=undefined && tempContent.totalPointsUsed>0){
		var formattotalPointsUsed = String(tempContent.totalPointsUsed).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		$('#rewardsCreditsUsed').append(formattotalPointsUsed);
		$('#rewardsCreditsUsed-mobile').append(formattotalPointsUsed);
	}else{
			$('#rewardsCreditsUsedContainer').css('display','none');
			$('#rewardsCreditsUsedContainerMobile').css('display','none');
	}
	$('#input-cartremove').val(length);
	$('#checkout_div').append(checkoutButton);
	$('#checkout_div').append(continueDiv);
	$('#continue_shop').append(continueShopping);
	if(tempContent.totalDollarsUsed > 0){
		$('#totalNetCC').append(tempContent.totalDollarsUsed.toFixed(2));
		$('#totalNetCC-mobile').append(tempContent.totalDollarsUsed.toFixed(2));
	}
	else{
		
		$('#cc-total-display').css('display','none');
		$('#cc-total-display-mobile').css('display','none');
	}

}
}else{
	var emptycartlist = $('<p id="body_text_empty_cartlist">');
	$('.card_list').append(emptycartlist);
	$('#body_text_empty_cartlist').append('You currently have nothing saved in your wish list.');
	return false;
}
}

/**
 * Below method performs the functionality for adding the current selected product into to the cart 
 * 
 */
function updateCart(indValue) {
	var tempArray = [];
	var length = $('#cartLength').val();
	for (var i = 0; i < length; i++) {
		var skuId = $('#hiddenqty_'+indValue+'').attr("skuid");
		var quantity = $('#qty_'+indValue+'').val();
		tempArray.push({
			skuId : skuId,
			quantity : quantity
		});
	}
	var tempInfo = {"updateInfo" : tempArray };
	var skuDetails = JSON.stringify(tempInfo);
	var form = $('<form></form>');
	form.attr("method", "post");
	form.attr("action", "/trex/app/updateCart");
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "skuDetails");
	field.attr("value", skuDetails);
	form.append(field);
	$(document.body).append(form);
	//form.submit();
	submitFormWithCsrfToken(form);
}

function updatemobileCart(indValue) {
	var tempArray = [];
	var length = $('#cartLength').val();
	for (var i = 0; i < length; i++) {
		var skuId = $('#hiddenqty_'+indValue+'').attr("skuid");
		var quantity = $('#qtymobile_'+indValue+'').val();
		tempArray.push({
			skuId : skuId,
			quantity : quantity
		});
	}
	var tempInfo = {"updateInfo" : tempArray };
	var skuDetails = JSON.stringify(tempInfo);
	var form = $('<form></form>');
	form.attr("method", "post");
	form.attr("action", "/trex/app/updateCart");
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "skuDetails");
	field.attr("value", skuDetails);
	form.append(field);
	$(document.body).append(form);
	//form.submit();
	submitFormWithCsrfToken(form);
}

function removeFromCart(lineItemId){
	if (validateCartRemove()) {
		var form = $('<form></form>');
		form.attr("method", "post");
		form.attr("action", '/trex/app/removeFromCart');
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

function moveToWishlist(id){	
	var elementId = $(document.getElementById(id));
	var lineItemId = $(elementId).attr('lineItemId');
	var skuId = $(elementId).attr('skuId');
	var productId = $(elementId).attr('productId');
	
	var form = $('<form></form>');
	form.attr("method", "post");
	form.attr("action", '/trex/app/moveToWishlist');
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "lineItemId");
	field.attr("value", lineItemId);
	var field1 = $('<input></input>');
	field1.attr("type", "hidden");
	field1.attr("name", "productId");
	field1.attr("value", productId);	
	var field2 = $('<input></input>');
	field2.attr("type", "hidden");
	field2.attr("name", "skuId");
	field2.attr("value", skuId);
	var field3 = $('<input></input>');
	field3.attr("type", "hidden");
	field3.attr("name", "quantity");
	field3.attr("value", 1);
	
	form.append(field);
	form.append(field1);
	form.append(field2);
	form.append(field3);
	
	$(document.body).append(form);
	//form.submit();
	submitFormWithCsrfToken(form);	
	
}

function rendertWishListItems(wishListContent){
	var rootUl = $('<ul class="small-block-grid-2 medium-block-grid-3 large-block-grid-4 small-centered medium-centered large-centered" style="padding-left: 1rem;">');
	var wishlistLineItem = wishListContent.wishlistLineItem;
	if(wishlistLineItem.length>0){
		  var wishlisttitle = $('<dd class="active"><a href="#panel2-1">WISH LIST ITEMS</a></dd>');
		  $('#wish-list-items').append(wishlisttitle);
	}
	for(var i=0;i<wishlistLineItem.length;i++){
		var lineItemId = wishlistLineItem[i].lineItemId;
		var productId = wishlistLineItem[i].productId;
		var itemDescription = wishlistLineItem[i].itemDescription;
		var imageURL = wishlistLineItem[i].imageURL;
		var productURL = wishlistLineItem[i].productURL;
		var skuId = wishlistLineItem[i].skuId;					
		var pointValue = wishlistLineItem[i].pointValue;
		var price = wishlistLineItem[i].price;
		var rollupId = wishlistLineItem[i].rollupId;
		var quantity = wishlistLineItem[i].quantity;
		var cartPage = "cartPage";
		var rootLi=$('<li class="featured-product-wrapper">');
		var subUl = $('<ul class="pricing-table">');
		
		var subli1 = $('<li class="title">');
		var sublia = $('<a href="javascript:void(0);">');
		var subliimg = $('<img src="'+wishlistLineItem[i].imageURL+'" class="mimg" alt="Wishlist -"'+wishlistLineItem[i].itemDescription+'" >');
		sublia.append(subliimg);
		subli1.append(sublia);
		
		var subli2 =$('<li class="description bold black" style="height: 50px;">');
		var subli2a=$('<a href="javascript:void(0)" onclick="homeRetriveProductDetails(\''
                + productId
                + '\',\''
                + cartPage
                + '\',\''
                + cartPage
                + '\')">').text(itemDescription);
		var hiddenWishlistvalues= $(' <input id="hiddenWishlistvalues_'+ i+'" type="hidden" skuid="'+skuId+'" rollupId="'+rollupId+'" productId="'+productId+'" imageUrl="'+imageURL+'" productURL="'+productURL+'"  skuprice="'+price+'" points="'+pointValue+'" itemDescription="'+itemDescription+'" lineItemId="'+lineItemId+'"/>');
		subli2.append(subli2a);
		subli2.append(hiddenWishlistvalues);
		
		var subli4 =$('<li class="cta-button" style="padding-bottom:2em">');
		var subli4a1 = $('<a class="button radius" style="background-color: #aaaaaa;" onclick="moveToCartFromCartSummary('+i+');" href="javascript:void(0);">').text("MOVE TO CART");
		
		var subli4a2=$('<a id="wishlistremove_${orderLine.businessId}" onclick="removeWishListItemFromCartSummary('+lineItemId+');" href="javascript:void(0);">').text("Remove");       
            
        subli4.append(subli4a1);
        subli4.append(subli4a2);
        var productImageLinkDiv = $('<div class="pro-image" style="height:98px">').append(subli1);  
		subUl.append(productImageLinkDiv);
		subUl.append(subli2);
		subUl.append(subli4);
		rootLi.append(subUl);
		rootUl.append(rootLi);
	}
	
	$('#panel2-1').append(rootUl);
}

function cartUpdate() {
/*	if($("#totalNet").text() > 10000){
		alert("error");
		return false;
	}*/
	var form = $('<form></form>');
	form.attr("method", "post");
	form.attr("action", '/trex/app/secure/checkout');
	$(document.body).append(form);
	//form.submit();
	submitFormWithCsrfToken(form);
}

function moveToCartFromCartSummary(id) {
	var wishListId = $('#hiddenWishlistvalues_'+id+'').attr('lineItemId');
	var skuId = $('#hiddenWishlistvalues_'+id+'').attr('skuId');
	var productId = $('#hiddenWishlistvalues_'+id+'').attr('productId');
	
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

function removeWishListItemFromCartSummary(lineItemId){
	
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

function validateCartRemove() {
    return confirm(" Are you sure you want to remove this item from your cart?");
}

$(document).ready(function(){
	$('[id^=qty],[id^=qtymobile]').keyup(function(e) {
		var max = 3;
	    if ($(this).val().length > max) {
	        $(this).val($(this).val().substr(0, max));
	    }
	});
});