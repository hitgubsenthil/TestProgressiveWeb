/**
 * Below method performs the functionality for adding the current selected
 * product into to the cart
 * 
 */

function addToCart() {
	var skuId = $('#prod-select').find('option:selected').attr('value');
	var productId = $('#hidprodDetails').attr("productId");
	var quantity = $('input[name="qty"]').val();
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
		field3.attr("value", quantity);
		
		

		var form = $('<form></form>');
		form.attr("method", "post");
		form.attr("action", '/trex/app/addToCart');
		form.append(field1);
		form.append(field2);
		form.append(field3);
		$(document.body).append(form);
		
		var values = "landingPage:ADD_CART#" + "productId:" + productId + "#" + "skuId:" + skuId + "#" +"quantity:" + quantity;		
		updateSessionDetails(values, 'ADD_CART', form);
		//form.submit();
		//submitFormWithCsrfToken(form);
		return true;
	
}

var defaultProdJson = "";
var ecertProdJson = "";

/**
 * product detail page starts load
 * 
 * @param selectedProduct
 */
function loadProductDetailsPage(productDetailEcertJson, productResponseJson, recentlyViewedItesmJson,
		relatedproductsJson,segment,searchProductDetail,homepage,key,breadcrumb, recentlyViewedprodDetailsJson, recentlyViewedEcertDetail) {
	if (productResponseJson != "" && segment!=null && null!=breadcrumb) {
		var productDetails = jQuery.parseJSON(productResponseJson);
		var productDetailEcert = null;
		
		if (productDetailEcertJson != null && productDetailEcertJson != "" && productDetailEcertJson!=undefined) {
			productDetailEcert = jQuery.parseJSON(productDetailEcertJson);
		}		
		defaultProdJson = productResponseJson;
		ecertProdJson = productDetailEcertJson;
		loadProductDetailsContent(productResponseJson,productDetailEcertJson,segment,breadcrumb, "false");
	}

	if (recentlyViewedItesmJson !=null && recentlyViewedItesmJson != "") {
		var recentlyviewedproducts = jQuery.parseJSON(recentlyViewedItesmJson);
		renderRecentlyViewedItems("#products-list-recently-viewed",
				recentlyviewedproducts, recentlyViewedprodDetailsJson, recentlyViewedEcertDetail);
	}

	if(homepage!=null && homepage!="" && homepage!=undefined && relatedproductsJson != null && key!=null && key!="" && key!=undefined){

		var relatedproducts = jQuery.parseJSON(relatedproductsJson);
		var productDetails = jQuery.parseJSON(productResponseJson);

		renderRelatedProducts("#products-list-recent-body", key , relatedproducts,productDetails);

	}else if(searchProductDetail!=null && searchProductDetail!="" && productResponseJson!=null){

		var searchProductDetail = $.parseJSON(searchProductDetail);
		var productDetails = jQuery.parseJSON(productResponseJson);

		renderSearchRelatedProducts("#products-list-recent-body",searchProductDetail,productDetails);

	}
}

function renderSearchRelatedProducts(id,data,selectedProduct) {
	
	var counter = 1;
	var selectedProductId = selectedProduct.id;
	var totalRecords = data.records;
	var navigation = data.navigation;
	var breadcrumbCategoryName = null;
	
	if (navigation.breadCrumbs != ""){
		var breadCrumbs = navigation.breadCrumbs;
		breadcrumbCategoryName = breadCrumbs[0].name;
	}
	
	var count = 0;
		
	for (var i = 0; i < totalRecords.length; i++) {

		var brands = totalRecords[i].brands;
		var brand = brands[0];		

		var totalProducts = brand.products;
		var brandDesc = brand.description;
		
		var map = new Object(); 
		
		if(totalProducts != null && totalProducts.length > 1){
			
			// or var map = {};
			var productId_cert = null;
			var productId_ecert = null;
		
			for(var j = 0; j < totalProducts.length; j++) {				
				
				var productDetail = totalProducts[j];
				var isElectronic = productDetail.electronic;				
				
				if(isElectronic) {
					productId_ecert = productDetail.id;
				}
				else{
					productId_cert = productDetail.id;
				}				
			}
			
			if(productId_ecert !=null){
				map[productId_cert] = productId_ecert;
				map[productId_ecert] = productId_cert;
			}
			
		}
		
		for (var j = 0; j < totalProducts.length; j++) {
			
			var product = totalProducts[j];
			var proddesc = product.description;
			var imageurl = product.imageUrl;
			var productId = product.id;
			var classType = product.classType;

			var skus = product.skus;
			
			if(selectedProductId!=productId && (!map[productId] && classType == 'ECERT')|| classType != 'ECERT'){
			
			count = count + 1;
				
			if (count < 5) {

			for (var k = 0; k < skus.length; k++) {
				var prodctdesc;
				
				if (classType == "CERT" && map[productId]){
					prodctdesc = $('<a href="javascript:void(0)" onclick="categoryRetriveProductDetailsEcert(\''
						+ productId
						+ '\',\''+ brandDesc + '\')" class="button radius add-cart">SELECT</a>'); 
				}
				else{
					prodctdesc = $('<a href="javascript:void(0)" onclick="categoryRetriveProductDetails(\''
							+ productId
							+ '\')" class="button radius add-cart">SELECT</a>'); 
				}

				var addtocart;
				
				if(classType=="CERT" && map[productId]){
					addtocart = $('<li class="cta-button" style="padding-bottom: -;padding-top: 9.5;padding-top: 14.5;padding-top: 15px;">').append(prodctdesc);
				}
				else{
					addtocart = $('<li class="cta-button">').append(prodctdesc);
				}
				
				
				var description;
				if (classType == "CERT" && map[productId]){					
					description = $('<a class="bold black" onclick="homeRetriveProductEcert(\''+ productId + '\',\''+ brandDesc + '\')" href="javascript:void(0)"/>').html(proddesc);					
				}
				else{
					description = $('<a class="bold black" onclick="homeRetriveProductDetails(\''+ productId + '\')" href="javascript:void(0)"/>').html(proddesc);
				}
				var desc = $('<li class="description bold black">').append(
						description);

				/*var price = $('<li class="price">').append(skus[k].points);*/
				var formatPoints = String(skus[k].points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
				var price = $('<li class="price">').append(formatPoints);


				var productImage = $('<img class="mimg"/>').attr('src', imageurl);
				productImage.attr('alt', proddesc);
				
				var productImageLink;
				
				if (classType == "CERT" && map[productId]){
					productImageLink = $(
							'<a onclick="homeRetriveProductEcert(\''
							+ productId + '\',\''+ brandDesc + '\')">').append(
					productImage);
				}
				else{
					productImageLink = $(
						'<a onclick="homeRetriveProductDetails(\''
								+ productId + '\')">').append(
						productImage);
				}
				productImageLink.attr('href', "javascript:void();");

				/*
				 * var productImageDiv = $('<div class="productImageDiv">');
				 * productImageDiv.append(productImageLink);
				 */
				
				
				var totalSkus = product.skus;
				
				var sku = totalSkus[0];		
				var id = sku.id;	
				var price = sku.listPrice;
				var points = sku.points;	
				var itemDescription = sku.description;
				
				var onSaleFlag = sku.onSale;
				var onSalePoints = sku.salePoints;
				
/*				var pa = [];
				for(var k in totalSkus) {
					pa.push(totalSkus[k].points);				
				}
				pa.sort(function(a,b){return a - b});
				var lp = pa[0];
				var hp = pa[pa.length - 1];
				points = lp == hp ? lp : lp + ' - ' + hp; 	
				onSalePoints = lp == hp ? lp : lp + ' - ' + hp; */
				
				if(onSaleFlag)
				{    
					var formatPoints = String(points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
					var formatOnSalePoints = String(onSalePoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
					var formatedWasNumber = $('<fmt:formatNumber type="number"/>').text(formatPoints+" Reward Credits");
					var wasText = $('<span style="text-decoration: line-through;">').text("Was: ").append(formatedWasNumber);
	                var formatedNowNumber = $('<fmt:formatNumber type="number"/>').text(formatOnSalePoints+" Reward Credits");
	                var nowText = $('<br/> <b>').text("Now: ").append(formatedNowNumber);
	                var slashThroughDiv = $('<div class="slash-through">').append(wasText).append(nowText);
	                var price = $('<li class="price">').append(slashThroughDiv);
	                
				}else
				{   
					var formatPoints = String(points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
					var formatedNumber = $('<fmt:formatNumber type="number"/>').text(formatPoints+" Reward Credits");
					var price = $('<li class="price">').append(formatedNumber).add('<li class="extraSpace">');
					$('.extraSpace').css('padding-bottom','0.8em');
				}
				

				var quickviewImage = $('<img style="width:35px;height:35px;"/>').attr('src',
						"/trex_assets/images/quickview.png");
				var quickviewURL = $('<a href="#" class=" show-for-medium-up">')
						.append(quickviewImage);

				/*var title = $('<li class="title">').append(productImageLink)
						.append(quickviewURL);
*/				
				var productImageLinkDiv = $('<div class="pro-image" style="height:98px">').append(productImageLink);

				var title = $('<li class="title">').append(productImageLinkDiv);
											
				var quickviewURLDiv = $('<li class="title">').append(quickviewURL);				
						
				
				
				var pricingTableli;
				if(classType=="CERT" && map[productId]){
					var electronicDelivery = $('<label class="ecert-label">').append("Electronic delivery available.");
					var price = $('<li class="price">').append(formatedNumber).add('<li class="extraEcertSpace">');
					$('.extraEcertSpace').css('padding-bottom','0.4em');
					
					 pricingTableli = $('<ul class="pricing-table">').append(title).append(quickviewURLDiv).append(desc).append(price).append(electronicDelivery).append(addtocart);

				}
				else{
					 pricingTableli = $('<ul class="pricing-table">').append(
							title).append(quickviewURLDiv).append(desc).append(price).append(addtocart);
				}
				
				
				var featuredProductli = $(
						'<li class="featured-product-wrapper"/>').append(
						pricingTableli);
				
			}
				}else{
					  break;
				  }
					}
			
			$("#products-list-recent-body").append(featuredProductli);
			counter++;

		}
	}
	
}

function renderRelatedProducts(id, key, data,selectedProduct) {
	
	var bodyContent = data.BodyContent;
	var selectedProductId = selectedProduct.id;
	if (bodyContent && bodyContent != "null") {

		var featuredOffers;
		var brandContents;
		var keys;
		var productId;
		var productContents;

		var offerContents = bodyContent.OfferContents;

		if (offerContents && offerContents != null) {
			for ( var i in offerContents) {
				var offerContent = offerContents[i];

				if (offerContent && offerContent != null) {
					var contentId = offerContent.Key;

					if (key === contentId) {
						var brandContents = offerContent.BrandContents;

						if (brandContents && brandContents != null) {
							var count = 0;
							for ( var j in brandContents) {
								
								var brandContent = brandContents[j];

								var brandId = j;
								if (brandContent && brandContent != null) {
									var product = brandContent.ProductContents;

									if (product && product != null) {
									
										
											for ( var k in product) {
												
											var pdtcontent = product[k];
												
											var productId = pdtcontent.ProductId;	
												
											if(selectedProductId!=productId){	
												
											count = count + 1;	
											
											if (count < 3) {
												

												var productDescription = pdtcontent.ProductDescription;

												var imageurl = pdtcontent.MediumProductImage;

												var skuContents = pdtcontent.SkuContents[0];

												var skuListPrice = skuContents.SkuListPrice;

												var onSaleFlag = skuContents.SegmentSaleFlag;
												
												var onSalePoints = skuContents.SegmentSalePoints;
												
												var onSaleRoundValue = Math.round(onSalePoints);
												var formatonSaleRoundValue = String(onSaleRoundValue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
												
												var intvalue = Math.round(skuListPrice);
												var formatintvalue = String(intvalue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
												
												
												if(onSaleFlag)
												{    
													var formatedWasNumber = $('<fmt:formatNumber type="number"/>').text(formatintvalue+" Reward Credits");
													var wasText = $('<span style="text-decoration: line-through;">').text("Was: ").append(formatedWasNumber);
									                var formatedNowNumber = $('<fmt:formatNumber type="number"/>').text(formatonSaleRoundValue+" Reward Credits");
									                var nowText = $('<br/> <b>').text("Now: ").append(formatedNowNumber);
									                var slashThroughDiv = $('<div class="slash-through">').append(wasText).append(nowText);
									                var price = $('<li class="price">').append(slashThroughDiv);
									                
									                
												}else
												{
													var formatedNumber = $('<fmt:formatNumber type="number"/>').text(formatintvalue+" Reward Credits");
													var price = $('<li class="price">').append(formatedNumber);
												}
												
												var prodctdesc = $('<a href="javascript:void(0)" onclick="retriveProductDetails(\''
														+ productId
														+ '\')" class="button radius add-cart">SELECT</a>');

												var addtocart = $(
														'<li class="cta-button">')
														.append(prodctdesc);

												var description = $(
														'<a class="bold black" href="javascript:void(0)" onclick="retriveProductDetails(\''
																+ productId
																+ '\')"/>')
														.text(
																productDescription);
												var desc = $(
														'<li class="description bold black">')
														.append(description);

												var productImage = $('<img style="height: 150px;"/>')
														.attr('src', imageurl);
														
												productImage.attr('alt',
														productDescription);
												var productImageLink = $(
														'<a onclick="retriveProductDetails(\''
																+ productId
																+ '\')">')
														.append(productImage);
												productImageLink.attr('href',
														"javascript:void();");
												
												var title = $(
														'<li class="title">')
														.append(
																productImageLink);
												var pricingTableli = $(
														'<ul class="pricing-table">')
														.append(title).append(
																desc).append(
																price).append(
																addtocart);
												var relatedProductli = $(
														'<li />').append(
														pricingTableli);

												$(id).append(relatedProductli);
											} else {
												break;
											}

										}
									  }
									}
								}
							}

						}
					}
				}
			}
		}
	}

}

/**
 * amount is populated for the selected product
 * 
 * @param selectedProduct
 */
var breadcrumbData;
function loadProductDetailsContent(product,ecertProduct,segment,breadcrumbValue, isEcertProduct) {
	var productContent = null;
	
	breadcrumbData = breadcrumbValue;
	var backupProduct = product;
	var backupEcertProduct = ecertProduct;
	
	backupProduct = jQuery.parseJSON(product);
	
	if (ecertProduct != null && ecertProduct != "" &&  ecertProduct!=undefined) {
		backupEcertProduct = jQuery.parseJSON(ecertProduct);
	}
	
	
	
	if(isEcertProduct == "true"){
		productContent = backupEcertProduct;
	}
	else{
		productContent = backupProduct;
	}	
	
	var description = productContent.description;
	var longDescription = productContent.longDescription;
	var classType = productContent.classType;
	var imageUrl = productContent.largeImageUrl;
	var productURL = productContent.self;
	var totalSkus = productContent.skus;
	var brandDesc = productContent.brand.description;
	var rollupId = productContent.brand.id;
	var productId = productContent.id;
	var skuLength = totalSkus.length;
	totalSkus.sort(sortByProperty('listPrice'));
	var selectedSku = totalSkus[0];
	var shippingRestrictedStates = selectedSku.shippingRestrictedStates;
	var shippingRestrictedLength=shippingRestrictedStates.length;
	var alertBoxWithMessage;
	if(shippingRestrictedLength>= 52){
		alertBoxWithMessage = $('.alert-box').append("This item is not eligible to be shipped to the United States or its territories").css('display','block');
	}else if(shippingRestrictedLength==13){
		alertBoxWithMessage = $('.alert-box').append("This item is not eligible to be shipped to Canada").css('display','block');
	}else{
		alertBoxWithMessage = $('.alert-box').css('display','none');
	}
	
	//var shippingRestrictedLength = shippingRestrictedStates.length;
	/* var itemNumber = $('<ul id="item-number" class="itemnumber-list">'); */
	
	var select = $('<Select id="prod-select" onchange="updateSkuId();" name="pid" class="amount_select" name="selectedPointsFromDetail" >');
	var midiaImage = $('<img id="productImage" src="'
			+ imageUrl
			+ '" alt="'
			+ description
			+ '" style="width: auto; height: auto; border: 1px solid #dddddd;"/><br/>');

	var addtocartUl = $('  <ul id="add-to-cart" class="button-group" >');
	var addtocartLi = $('<li class="detail-li" style="margin-right:2em;">');

	var addtocartLink = $('<a id="cartbutton" href="javascript:void(0);" onclick="addToCart();" class="small button left">ADD TO CART</a>');
	var addtoWishListli = $('<li class="detail-li">');
	var addtowishListLink = $('<a id="wishlistbutton" href="javascript:void(0);" onclick="addToWishList();" class="small button right">ADD TO WISHLIST</a>');
	var hiddenli = $('<li class="detail-li">');

	var hiddenValues = $(' <input id="hidprodDetails" type="hidden" rollupId="'
			+ rollupId + '" productId="' + productId + '" imageUrl="'
			+ imageUrl + '" productURL="' + productURL + '"classType="'+classType+'"/>');
	$("#detail-table").add(alertBoxWithMessage);
	addtocartLi.append(addtocartLink);
	addtoWishListli.append(addtowishListLink);
	hiddenli.append(hiddenValues);
	addtocartUl.append(addtocartLi);
	addtocartUl.append(addtoWishListli);
	addtocartUl.append(hiddenli);

	var longDiscriptionP = longDescription;
	
	for (var i = 0; i < totalSkus.length; i++) {
		var sku = totalSkus[i];
		var skuId = sku.id;
		var cost = sku.price;
		var image = sku.largeImageUrl;
		var price = sku.listPrice;
		var listPrice = sku.listPrice;
		var points = sku.points;
		var onSaleFlag = sku.onSale;
		var onSalePoints = sku.salePoints;
		var itemDescription = sku.description;
		var variants = sku.skuVariants;
		var option = $('<option>');
		option.attr('value', skuId);
		option.attr('price', listPrice);
		option.attr('onSaleFlag', onSaleFlag);
		option.attr('onSalePoints', onSalePoints);
		option.attr('points', points);
		option.attr('skuLength', skuLength);
		option.attr('imageURL', image);
		
		if (itemDescription == null || itemDescription == "") {
			option.attr('itemDescription', description);
			option.attr('skuDescription', null);
		} else {
			option.attr('itemDescription', itemDescription);
			option.attr('skuDescription', itemDescription);
		}
		var variantOrder = '';
		$.each(variants, function( index, value ) {
			var ordr = value.order;
			var len = variants.length;
			if(ordr==len-1)
			{
				variantOrder += ' '+ value.value;
			}
			else{
				variantOrder += ' '+ value.value+',';
			}
		
		});
		variantOrder = variantOrder.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
		});		

		var formatPoints = String(points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		var formatOnSalePoints = String(onSalePoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		if(onSaleFlag){
			if(itemDescription == null || itemDescription == "" || itemDescription == undefined){
				option.text(formatOnSalePoints +" Reward Credits");
			}else{
				option.text(''+ formatOnSalePoints +' Reward Credits -'+ decodeHtmlEntity(variantOrder) +'');
			}
			
		}else{
			if(itemDescription == null || itemDescription == "" || itemDescription == undefined){
				option.text(''+ formatPoints +" Reward Credits");
			}else{
				option.text(''+ formatPoints +' Reward Credits -'+ decodeHtmlEntity(variantOrder) +'');
			}
			
		}
		
		select.append(option);
	}
	
    if(totalSkus.length > 1){
    $('#productAmount').empty();
    $('#productAmount').append("<p class='bold' style='margin-bottom: 0.40rem;'>Amount: </p>");
    $('#productAmount').append(select);
   
    }else{
    	$('#productAmount').empty();
    	$('#productAmount').append(select);
    	$('#prod-select').hide();
    }

    $('.sevenstar').empty();
	var label = $('<label for="prod-select" id="error-select" style="color: red;display: none;">*Please select an amount</label>');
	var formatPoints = String(points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	var formatonSalePoints = String(onSalePoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

	// var selectorsSingleDiv=$('<div class="selectors
	// single">').append('Amount:').append(select).append(label);
	
	if(onSaleFlag)
	{   
		if(onSalePoints!=null && onSalePoints!="" && onSalePoints!=undefined && points!=null && points!="" && points!=undefined){
		
		var formatedWasNumber = $('<fmt:formatNumber type="number"/>').text(formatPoints+" Reward Credits");
		var wasText = $('<span style="text-decoration: line-through;">').text("Was: ").append(formatedWasNumber);
        var formatedNowNumber = $('<fmt:formatNumber type="number"/>').text(formatonSalePoints+" Reward Credits");
        var nowText = $('<br/><b>').text("Now: ").append(formatedNowNumber);
        var rewardcredits = $('<div class="slash-through">').append(wasText).append(nowText);
		
		}
        
	}else
	{
		var amt = $('<fmt:formatNumber type="number"/>').text(formatPoints+" Reward Credits");
		var rewardcredits = $('<div class="slash-through">').append(amt);
	}

	if(segment!=null && segment!="" && segment!=undefined)
	{
		if(segment == "SVNSTRS") 
		{
			
			var sevenStarInnerDiv = $('<div>').text("Seven Stars 15% Discount or Special Value Discount Applied if Greater");
			var sevenStarSpan = $('<span style="font-size: .8em; font-weight: bold;display: block;line-height: 0.15em;">').text("(does not apply to Gift Cards)");
			sevenStarInnerDiv.append(sevenStarSpan);
			
			
		}
	}
	
	if(ecertProduct!=null && ecertProduct!="" && ecertProduct!=undefined){
		var giftCardMessage = "<p class='bold' style='margin-bottom: 0.70rem;'>Gift Card Type: </p>";
		var physicalType = "";
		var ecertType = "";
		
		ecertGiftType = "true";
		defaultGiftType = "false";
	
		$('#giftCardProduct').empty();
		
		if(isEcertProduct == "true"){
			physicalType =	$('<input type="radio" name="physical" onclick="loadProductDetails(\''+ segment + '\' , \''+ defaultGiftType +'\')" value="physical">Plastic Gift Card<br>');
			ecertType =	$('<input type="radio" name="ecert" onclick="loadProductDetails(\''+ segment + '\', \''+ ecertGiftType +'\')" checked value="ecert">eGift Card<br>');
		}
		else{
			physicalType =	$('<input type="radio" name="physical" onclick="loadProductDetails(\''+ segment + '\' , \''+ defaultGiftType +'\')" checked value="physical">Plastic Gift Card<br>');
			ecertType =	$('<input type="radio" name="ecert" onclick="loadProductDetails(\''+ segment + '\', \''+ ecertGiftType +'\')" value="ecert">eGift Card<br>');
		}		
		
		$('#giftCardProduct').append(giftCardMessage).append(physicalType).append(ecertType);
	}
	
	$('#product_Name_1').empty();
	$('#product_Name_1').append(description);
	
	$('#product_Name_1_Mob').empty();
	$('#product_Name_1_Mob').append(description);
	
	$('#add_to_cartlist').empty();
	$('#add_to_cartlist').append(addtocartUl);
	
	$('#tabs-1').empty();
	$('#tabs-1').append(longDiscriptionP);
	
	$('#mobile-desc').empty();
	$('#mobile-desc').append(longDiscriptionP);
	
	$('#mediaImage').empty();
	$('#mediaImage').append(midiaImage);
	$('#itemNumber').append(skuId);
	$('#itemNumberMob').empty();
	$('#itemNumberMob').append(productId);
	$('#rewardCredits').append(rewardcredits);
	$('.sevenstar').append(sevenStarInnerDiv);
	
	$( ".current" ).remove();
	$( ".other" ).remove();
	
	 if(breadcrumbValue=="SEARCH"){
			addBreadCrumb('#breadcrumb', breadcrumbValue,true);
			addBreadCrumb('#breadcrumb', description,true);
		}
	 
	 else if(breadcrumbValue !== '' && breadcrumbValue !== 'SEARCH'){
		
		 var breadCrumb = jQuery.parseJSON(unescapeHtml(breadcrumbValue));
		var	updateBreadcrumb = breadCrumb.breadCrumbList;
		
		for (var i = 0; i < updateBreadcrumb.length; i++) {
			
		var menuName = updateBreadcrumb[i].name;
		var removeUrl = updateBreadcrumb[i].removeActionUrl;
		
		var name = parseInt(removeUrl);
		if(null!=removeUrl&& isNaN(name)){
		var	breadcrumbBrandName = '<a  onclick="rediretandGetCatetoryResults(\''+ removeUrl + '\')" href="javascript:void(0)">'+menuName+'</a>';
		addBreadCrumb('#breadcrumb', breadcrumbBrandName,false);
		}
		else{
			var	breadcrumbBrandName = '<a  onclick="getCatetoryResults(\''+ removeUrl + '\')" href="javascript:void(0)">'+menuName+'</a>';
			addBreadCrumb('#breadcrumb', breadcrumbBrandName,false);
		}
		    
		}	
		addBreadCrumb('#breadcrumb', description,true);
	}
	 
	 else{
		
			addBreadCrumb('#breadcrumb', description,true);
		}
	
	updateSkuId();
}


/**
 * 
 * 
 * @param selectedProduct
 */
function loadProductDetails(segment,selectEcertProduct) {
    
    loadProductDetailsContent(defaultProdJson,ecertProdJson,segment,breadcrumbData, selectEcertProduct);
}

/**
 * renders the recently viewed products
 */
function renderRecentlyViewedItems(id, data, detailData, ecertDetail) {

	var cartLineItm = data.recentlyViewedLineItem;	
	var classType = "";
	var objDetailData = JSON.parse(detailData);
	var selectedProductDetail;
	var productIdsHasEcert = JSON.parse(ecertDetail);
	var productId = "";
	if (cartLineItm && cartLineItm != "null") {

		for ( var k in cartLineItm) {

			var pdtcontent = cartLineItm[k];
			
			for (var m in objDetailData){
				
				if(objDetailData[m].id == pdtcontent.productId){
					classType = objDetailData[m].classType;
					selectedProductDetail = objDetailData[m];
				}
				
			
			}
			var hasEcert = false;
			for (var productIdKey in productIdsHasEcert) {
				if(pdtcontent.productId == productIdKey && productIdsHasEcert[productIdKey] == "ECERT") {
						hasEcert = true;	
				}
			}			
			
			
			var itemDescription = pdtcontent.itemDescription;

			var imageurl = pdtcontent.imageURL;

			var pointValue = pdtcontent.pointValue;
			var onSalePoints = pdtcontent.salePoints;
			var formatedPointsValue = String(pointValue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
			productId = pdtcontent.productId;

			var intvalue = Math.round(price);
			var prodctdesc;
			var brandDesc;
			if(classType == "ECERT" || (classType == "CERT" && hasEcert)){
				brandDesc = selectedProductDetail.brand.description;
			}
			var description;
			
			if(classType == "ECERT" || (classType == "CERT" && hasEcert)){
				prodctdesc = $('<a href="javascript:void(0)" onclick="retriveProductDetailsEcert(\''
					+ productId
					+ '\',\''+ brandDesc.replace("'", "") + '\')" class="button radius add-cart">SELECT</a>');
				description = $(
						'<a class="bold black" href="javascript:void(0)" onclick="retriveProductDetailsEcert(\''
								+ productId + '\',\''+ brandDesc.replace("'", "") + '\')"/>').text(
						itemDescription);
			}
			else{
				
				prodctdesc = $('<a href="javascript:void(0)" onclick="retriveProductDetails(\''
						+ productId
						+ '\')" class="button radius add-cart">SELECT</a>');	
				description = $(
						'<a class="bold black" href="javascript:void(0)" onclick="retriveProductDetails(\''
								+ productId + '\')"/>').text(
						itemDescription);
			}

				var addtocart;
			
				if(classType == "ECERT" || (classType == "CERT" && hasEcert)){
					addtocart = $('<li class="cta-button" style="padding-bottom: -;padding-top: 9.5;padding-top: 16px;">').append(prodctdesc);
				}
				else{
					addtocart = $('<li class="cta-button">').append(prodctdesc);
				}

/*			var description = $(
					'<a class="bold black" href="javascript:void(0)" onclick="retriveProductDetails(\''
							+ productId + '\')"/>').text(
					itemDescription);*/
			
			
			var desc = $('<li class="description bold black">').append(
					description);
			
			if(onSalePoints!=null && onSalePoints!="" && onSalePoints!=undefined)
			{   
				var formatonSalePoints = String(onSalePoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
				var formatPoints = String(pointValue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
				var formatedWasNumber = $('<fmt:formatNumber type="number"/>').text(formatPoints+" Reward Credits");
				var wasText = $('<span style="text-decoration: line-through;">').text("Was: ").append(formatedWasNumber);
                var formatedNowNumber = $('<fmt:formatNumber type="number"/>').text(formatonSalePoints+" Reward Credits");
                var nowText = $('<br/> <b>').text("Now: ").append(formatedNowNumber);
                var slashThroughDiv = $('<div class="slash-through">').append(wasText).append(nowText);
                var price = $('<li class="price">').append(slashThroughDiv);
                
			}else
			{  
				var formatPoints = String(pointValue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
				var formatedNumber = $('<fmt:formatNumber type="number"/>').text(formatPoints+" Reward Credits");
				var price = $('<li class="price">').append(formatedNumber).add('<li class="extraSpace">');
				$('.extraSpace').css('padding-bottom','0.8em');
			}

			var productImage = $('<img class="mimg"/>').attr('src', imageurl);
			productImage.attr('alt', itemDescription);
			
			var productImageLink;
			
			if(classType == "ECERT" || (classType == "CERT" && hasEcert)){
				productImageLink = $(
					'<a onclick="retriveProductDetailsEcert(\'' + productId
							+ '\',\''+ brandDesc.replace("'", "") + '\')">').append(productImage);
			}else{
				productImageLink = $(
						'<a onclick="retriveProductDetails(\'' + productId
								+ '\')">').append(productImage);
			}
			productImageLink.attr('href', "javascript:void(0);");

			
			
			/*
			 * var productImageDiv = $('<div class="productImageDiv">');
			 * productImageDiv.append(productImageLink);
			 */

			//var title = $('<li class="title">').append(productImageLink);
			
			var productImageLinkDiv = $('<div class="pro-image" style="height:98px">').append(productImageLink);

			var title = $('<li class="title">').append(productImageLinkDiv);
											
				
			
			if((classType == "CERT" && hasEcert) || classType == "ECERT"){

				var electronicDelivery = $('<label class="ecert-label">').append("Electronic delivery available.");
				var price = $('<li class="price">').append(formatedNumber).add('<li class="extraEcertSpace">');
				$('.extraEcertSpace').css('padding-bottom','0.4em');
				
				var pricingTableli = $('<ul class="pricing-table">').append(title).append(desc).append(price).append(electronicDelivery).append(addtocart);

			}
			else{

				var pricingTableli = $('<ul class="pricing-table">').append(title)
						.append(desc).append(price).append(addtocart);
			}
			var recentlyViewedli = $('<li />').append(pricingTableli);

			$(id).append(recentlyViewedli);

		}
	}
}

/**
 * Below method performs the functionality for adding the current selected
 * product into to the wish list
 * 
 * @param encodedProductContent -
 *            holds the selected product content
 */

function addToWishList() {
	var skuId = $('#prod-select').find('option:selected').attr('value');
	var productId = $('#hidprodDetails').attr("productId");
	var form = $('<form></form>');
	form.attr("method", "post");
	form.attr("action", '/trex/app/secure/wishlist/add');
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
	form.append(field1);
	form.append(field2);
	form.append(field3);
	
	$(document.body).append(form);
	
	var values = "landingPage:ADD_WISHLIST" + "#" + "productId:" + productId + "#" + "skuId:" + skuId + "#" +"quantity:1";		
	updateSessionDetails(values, 'ADD_WISHLIST', form);
	//form.submit();
	//submitFormWithCsrfToken(form);
}

function retriveProductDetails(productId) {
	var form = $('<form></form>');
	form.attr("method", "GET");
	form.attr("action", '/trex/app/productDetails');
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "productId");
	field.attr("value", productId);
	/*
	 * field.attr("name", "breadcrumbCategoryName"); field.attr("value",
	 * breadcrumbCategoryName);
	 */
	form.append(field);
	$(document.body).append(form);
	form.submit();
}

function retriveProductDetailsEcert(productId, brandDesc) {
	var form = $('<form></form>');
	form.attr("method", "GET");
	form.attr("action", '/trex/app/productDetails');
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "productId");
	field.attr("value", productId);
	
	form.append(field);
	
	var field1 = $('<input></input>');
	field1.attr("type", "hidden");
	field1.attr("name", "brandDesc");
	field1.attr("value", brandDesc);
	/*
	 * field.attr("name", "breadcrumbCategoryName"); field.attr("value",
	 * breadcrumbCategoryName);
	 */
	form.append(field1);
	$(document.body).append(form);
	form.submit();
}

//validate qty
function validateQuantity(qty) {
   if ($(qty).val() <= 0) {
       $("#error-label").show();
       $(qty).val('1');
   } else
       $("#error-label").hide();
}

$(document).ready(function() {

$("#qty").numeric();

$("#qty").blur(function() {
    validateQuantity($(this));
});

 $("#qty").keypress(function(e) {
    if (e.which === 13) {
        //add to cart
       $("#cartbutton").trigger('click');
    }
 });
});

function updateSkuId(){
	var skuId = $('#prod-select').find('option:selected').attr('value');
	var points = $('#prod-select').find('option:selected').attr('points');
	var imageURL = $('#prod-select').find('option:selected').attr('imageURL');
	var onSalePoints = $('#prod-select').find('option:selected').attr('onSalePoints');
	var onSaleFlag = $('#prod-select').find('option:selected').attr('onSaleFlag');
	var skuDescription = $('#prod-select').find('option:selected').attr('skuDescription');
	var skuLength = $('#prod-select').find('option:selected').attr('skuLength');
	var productId = $('#hidprodDetails').attr("productId");
	var classType = $('#hidprodDetails').attr("classType");
	var stringToBoolean = JSON.parse(onSaleFlag);
	
	
	$("#itemNumber").text(productId);
	if(stringToBoolean)
	{   
		$('#rewardCredits').empty();
		if(onSalePoints!=null && onSalePoints!="" && onSalePoints!=undefined && points!=null && points!="" && points!=undefined){
			var formatedPoints = String(points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
			var formatedOnSalePoints = String(onSalePoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		if(skuLength==1){
			if(skuDescription!=null && skuDescription!="" && skuDescription!=undefined && classType!='MERCH' && classType!='MAGZN'){
				var formatedWasNumber = $('<fmt:formatNumber type="number"/>').text(formatedPoints+' Reward Credits - '+ decodeHtmlEntity(skuDescription) +'');
				 var formatedNowNumber = $('<fmt:formatNumber type="number"/>').text(''+formatedOnSalePoints + ' Reward Credits - '+ decodeHtmlEntity(skuDescription) +'');
			}else{
				var formatedWasNumber = $('<fmt:formatNumber type="number"/>').text(formatedPoints+" Reward Credits");
				var formatedNowNumber = $('<fmt:formatNumber type="number"/>').text(formatedOnSalePoints+" Reward Credits");
			}
			
		}else{
			
			 var formatedWasNumber = $('<fmt:formatNumber type="number"/>').text(formatedPoints+" Reward Credits");
			 var formatedNowNumber = $('<fmt:formatNumber type="number"/>').text(formatedOnSalePoints+" Reward Credits");
			 
			 if(null!=imageURL && imageURL!="" && imageURL!=undefined){
			 $('#mediaImage').empty();
			 var midiaImage = $('<img id="productImage" src="'
						+ imageURL +'" style="width: auto; height: auto; border: 1px solid #dddddd;"/><br/>');
			 $('#mediaImage').append(midiaImage);
			 }
		}
		var wasText = $('<span style="text-decoration: line-through;">').text("Was: ").append(formatedWasNumber);
        var nowText = $('<br/><b>').text("Now: ").append(formatedNowNumber);
        var rewardcredits = $('<div class="slash-through">').append(wasText).append(nowText);
        $('#rewardCredits').append(rewardcredits);
		}
        
	}else
	{
		$('#rewardCredits').empty();
		if(skuLength==1){
			var formatedPoints = String(points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
			if(skuDescription!=null && skuDescription!="" && skuDescription!=undefined && classType!='MERCH' && classType!='MAGZN'){
			var amt = $('<fmt:formatNumber type="number"/>').text(''+formatedPoints + ' Reward Credits - '+ decodeHtmlEntity(skuDescription) +'');
			}else{
			 var amt = $('<fmt:formatNumber type="number"/>').text(formatedPoints+" Reward Credits");
			}
			
		}else{
			
			var formatedPoints = String(points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
			var amt = $('<fmt:formatNumber type="number"/>').text(formatedPoints+" Reward Credits");
			
			if(null!=imageURL && imageURL!="" && imageURL!=undefined){
			$('#mediaImage').empty();
			var midiaImage = $('<img id="productImage" src="'
					+ imageURL +'" style="width: auto; height: auto; border: 1px solid #dddddd;"/><br/>');
		    $('#mediaImage').append(midiaImage);
			}
		}
		
		var rewardcredits = $('<div class="slash-through">').append(amt);
		$('#rewardCredits').append(rewardcredits);
	}
}

/**
 * Below method to sort based on the property 
 * @param property
 * @returns {Function}
 */
function sortByProperty(property) {
    'use strict';
    return function (a, b) {
        var sortStatus = 0;
        if (a[property] < b[property]) {
            sortStatus = -1;
        } else if (a[property] > b[property]) {
            sortStatus = 1;
        }
 
        return sortStatus;
    };
}

var decodeHtmlEntity = function(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};

function unescapeHtml(unsafe) {
    return unsafe
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#039;/g, "'");
}