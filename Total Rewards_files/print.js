function printerfriendlyVersion(){
	var form = $('<form></form>');
	form.attr("method", "POST");
	form.attr("action", '/trex/app/secure/checkout/printable');
	$(document.body).append(form);
	form.submit();
}


function loadPrintPage(checoutJson,productID_AddressMap) {

	var tempContent = jQuery.parseJSON(checoutJson);
	var productID_AddressMap = jQuery.parseJSON(productID_AddressMap);
	var cartLineItem = tempContent.extendedCartLineItem;
	var cartLength = cartLineItem.length;
	
	var totalPrice = 0;
	var tatalRewardsPoints = 0;
	for (var i = 0; i < cartLineItem.length; i++) {
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
		
		var price = cartLineItem[i].price;
		var rollupId = cartLineItem[i].rollupId;
		var quantity = cartLineItem[i].quantity;
		var imageURL = cartLineItem[i].imageURL;
		var productURL = cartLineItem[i].productURL;
		var rollupId = cartLineItem[i].rollupId;
		totalPrice = totalPrice + price;
		tatalRewardsPoints = tatalRewardsPoints + pointValue;

		//var shippingdisplay = "";
		var newline = "<br/>";
		
		$.each(productID_AddressMap, function(skuidkey, addressValue) {
			
			if(skuidkey === skuId)
		            
				{
				
					firstName = addressValue.firstName;
					lastName = addressValue.lastName;
					addressLine1 = addressValue.addressLine1;
					
					addLine2 = addressValue.addressLine2;
					
					addressLine2 = "";
					
					if(addLine2!=null && addLine2!="" && addLine2!=undefined)
					{
						addressLine2 = addressValue.addressLine2;
					}
					
			        postalCode = addressValue.postalCode;
			        state = addressValue.state;
			        city = addressValue.city;
			        country = addressValue.country;
			        email = addressValue.email;
			        
			        //shippingdisplay = firstName+"  "+lastName+"<br/>"+addressLine1+"<br/> "+addressLine2+"<br/> "+city+",  "+state+"  "+postalCode+"  "+country;
			        
			        
			        
			  }
		});
		
		var div_shippingdisplay = $(' <div id="shippingdisplay' + i
				+ '" class="panel" style="padding: .25em;">');
        
        div_shippingdisplay.append(firstName).append("  ").append(lastName).append(newline);
		
        if(email){
        	div_shippingdisplay.append(email).append(newline);
		}
		if(addressLine1){
			div_shippingdisplay.append(addressLine1).append(newline);
		}
		if(addressLine2){
			div_shippingdisplay.append(addressLine2).append(newline);
		}
		if(city){
			div_shippingdisplay.append(city);
			if(state){
				div_shippingdisplay.append(",");
			}
		}
		if(state){
			div_shippingdisplay.append(state).append("  ");
		}
		if(postalCode){
			div_shippingdisplay.append(postalCode).append("  ");
		}
		if(country){
			div_shippingdisplay.append(country).append("  ");
		}
		
		
		var tableRow = $('<tr id="orderline' + i
				+ '" style="vertical-align: top;">');

		var orderLineImage = $(' <td class="hide-for-small-down" style="padding-left:2em">');
		var productImage1 = $(' <img src="' + imageURL + '" width="150px">');

		orderLineImage.append(productImage1);

		var td_detail = $(' <td class="td-detail">');

		var td_details_div1 = $(' <div class="prodname bold">').text(
				itemDescription);

		var itemNumber = $('<div class="item hide-for-small">ITEM NUMBER: <span>'
				+ productId + '</span></div>');

		var div_rowcollapse = $(' <div class="row collapse">');
		var div_small_12_coulmns = $(' <div class="small-12 columns">');
		

		td_detail.append(td_details_div1);
		td_detail.append(itemNumber);
		td_detail.append(div_rowcollapse);
		td_detail.append(div_small_12_coulmns);
		td_detail.append(div_shippingdisplay);
		var formatPrice = String(pointValue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		var pricetd = $('<td class="show-for-medium"><div>' + formatPrice
				+ '</div></td>');

		var qtyTd = $('  <td class="hide-for-small-down">' + quantity
				+ '</div></td>');
		var formatTotal = String( pointValue * quantity ).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		var loyaltylinetotal = $(' <td class="hide-for-small-down"><div>'
				+ formatTotal + '</div></td>  ')

		tableRow.append(orderLineImage)
		tableRow.append(td_detail)
		tableRow.append(pricetd)
		tableRow.append(qtyTd)
		tableRow.append(loyaltylinetotal)

		$('.print-confirm-table').append(tableRow);
	}
	var formattatalRewardsPoints = String(tatalRewardsPoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	var formattotalPointsUsed = String(tempContent.totalPointsUsed).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	var formatNetPointsUsed = String(tempContent.netPointsUsed).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	var formattotalShippingPoints = String(tempContent.totalShippingPoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	if((tempContent.totalShippingPoints !=null || tempContent.totalShippingPoints!="") && tempContent.totalShippingPoints>0){
		$("#additional-shipping-none").css('display','block');
		$('#totalAddShipping').html(formattotalShippingPoints);
	}
	$('#totalprdcts').append(formattatalRewardsPoints);
	$('#rewardsPoints').append(formattotalPointsUsed);
	//$('#totalPointsUsed').append(formattotalPointsUsed);
	/*$('#cc-total-display').append(tempContent.totalDollarsUsed);*/
	
	if(tempContent.totalDollarsUsed>0){
		$('#cc-total-display').append("$"+tempContent.totalDollarsUsed.toFixed(2));
	}
	else{
		$('#creditcard-none').css('display','none');
	}
}