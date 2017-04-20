function loadThankyouPage(checoutJson,productID_AddressMap) {
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
		
		
		var newline = "<br/>";
		
		$.each(productID_AddressMap, function(skuidkey, addressValue) {
			
			if(skuidkey === skuId)
		            
				{
				
					firstName = addressValue.firstName;
					lastName = addressValue.lastName;
					addressLine1 = addressValue.addressLine1;
					
					var addLine2 = addressValue.addressLine2;
					
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
			       // shippingdisplay = firstName+"  "+lastName+"<br/>"+addressLine1+"<br/> "+addressLine2+"<br/> "+city+",  "+state+"  "+postalCode+"  "+country;
			       
			        
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

		var orderLineImage = $(' <td style="padding-left:2em">');
		var desktopImage = $(' <img class="hide-for-small-down" src="' + imageURL + '" width="150px">');
		var mblImage = $(' <img class="show-for-small-down" src="' + imageURL + '" width="70px">');

		orderLineImage.append(desktopImage);
		orderLineImage.append(mblImage);

		var td_detail = $(' <td class="td-detail">');

		var td_details_div1 = $(' <div class="prodname bold">').text(
				itemDescription);

		var itemNumber = $('<div class="item">ITEM NUMBER: <span>'
				+ productId + '</span></div>');

		var div_rowcollapse = $(' <div class="row collapse">');
		var div_small_12_coulmns = $(' <div class="small-12 columns">');

		td_detail.append(td_details_div1);
		td_detail.append(itemNumber);
		td_detail.append(div_rowcollapse);
		td_detail.append(div_small_12_coulmns);
		td_detail.append(div_shippingdisplay);

		var formatpointValue = String(pointValue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		
		var pricetd = $('<td class="show-for-medium"><div>' + formatpointValue
				+ '</div></td>');

		var qtyTd = $('  <td class="hide-for-small-down">' + quantity
				+ '</div></td>');

		var formatTotal = String(pointValue * quantity).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		
		var loyaltylinetotal = $(' <td class="hide-for-small-down"><div>'
				+ formatTotal + '</div></td>  ')

		tableRow.append(orderLineImage)
		tableRow.append(td_detail)
		tableRow.append(pricetd)
		tableRow.append(qtyTd)
		tableRow.append(loyaltylinetotal)

		$('.thankyou-confirm-table').append(tableRow);
	}

	var formattatalRewardsPoints = String(tatalRewardsPoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	var formattotalPointsUsed = String(tempContent.totalPointsUsed).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	var formatNetPointsUsed = String(tempContent.netPointsUsed).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	
	$('#productTotal').append(formattatalRewardsPoints);
	$('#productTotalSmall').append(formattatalRewardsPoints);
	/*$('#totalNetCC').append(tempContent.totalDollarsUsed);
	$('#totalNetCC-mobile').append(tempContent.totalDollarsUsed);*/
	$('#totalRewardCreditsSmall').append(formattotalPointsUsed);
	$('#totalRewardCredits').append(formattotalPointsUsed);
	/*$('#totalRewardsCreditsUsed').append(formattotalPointsUsed);
	$('#totalRewardsCreditsUsed-mobile').append(formattotalPointsUsed);*/
	if(tempContent.totalDollarsUsed > 0){
		$('#totalNetCC').append("$"+tempContent.totalDollarsUsed.toFixed(2));
		$('#totalNetCC-mobile').append("$"+tempContent.totalDollarsUsed.toFixed(2));
	}
	else{
		
		$('#cc-total-display').css('display','none');
		$('#cc-total-display-mobile').css('display','none');
	}
	
	if((tempContent.totalShippingPoints !=null || tempContent.totalShippingPoints!="") && tempContent.totalShippingPoints>0){
			var formattotalShippingPoints = String(tempContent.totalShippingPoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
			$(".totalShippingAndHandlingContainer").css('display','block');
			$('#totalShippingAndHandling').html(formattotalShippingPoints);
			$('#addtionalshipping-mobile').html(formattotalShippingPoints);
	}else{
	        $('#addtionalshipping-mobile').empty();
			$(".totalShippingAndHandlingContainer").css('display','none');
			$("#additinalShippingDiv").css('display','none');
	}
}