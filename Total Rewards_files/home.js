function loadHomePage(jsonContent, productDetailsJson, pageSize, pageNo, sortBy) {

	if(jsonContent!=""  && jsonContent!=null ){
		
		var content = jQuery.parseJSON( jsonContent );
        renderPageContent(content);
	} 
        
	if(productDetailsJson != "" && productDetailsJson!=null){
        
    var productDetails = jQuery.parseJSON(productDetailsJson);

    renderLayout("#products-list", "featuredOffers", productDetails);
    renderLayout("#products-list-topsellers", "popularOffers", productDetails);
        
    }
        
}

function renderLayout(id, key, data) {

	var homepage = "HomePage";
	var bodyContent = data.BodyContent;

	if(bodyContent && bodyContent != "null"){

		var featuredOffers;
		var brandContents;
		var keys;
		var productContents;

		var offerContents = bodyContent.OfferContents;

		if(offerContents && offerContents != null) {
			for(var i in offerContents) {
				var offerContent = offerContents[i];

				if(offerContent && offerContent != null) {
					var contentId = offerContent.Key;

					if(key === contentId) {
						var brandContents = offerContent.BrandContents;

						if(brandContents && brandContents != null) {
							for(var j in brandContents) {
								var brandContent = brandContents[j];
								var map = new Object(); 
								var brandId = j;
								if(brandContent && brandContent != null) {
									var productContents = brandContent.ProductContents;
									var brandDesc = brandContent.BrandDisplayName;
									
									if(productContents != null && Object.keys(productContents).length > 1){
										
										// or var map = {};
										var productId_cert = null;
										var productId_ecert = null;
									
										for(var productKey in productContents) {				
											
											var productDetail = productContents[productKey];
											var classType = productDetail.ProductClassCode;				
											
											if(classType == "ECERT") {
												productId_ecert = productDetail.ProductId;
											}
											else{
												productId_cert = productDetail.ProductId;
											}				
										}
										
										if(productId_ecert !=null){
											map[productId_cert] = productId_ecert;
											map[productId_ecert] = productId_cert;
										}
										
									}
									
									
									
									if(productContents && productContents != null ) {

										for(var k in productContents) {

											var pdtcontent = productContents[k];

											var productId = pdtcontent.ProductId;
											
											var desc = pdtcontent.ProductDescription;

											var imageurl = pdtcontent.MediumProductImage;
											var classType = pdtcontent.ProductClassCode;
										if((!map[productId] && classType == "ECERT")|| classType != "ECERT"){
											var totalSkus = pdtcontent.SkuContents;
											
											totalSkus.sort(sortByProperty('SegmentPoints'));
											var skuLength = totalSkus.length;
											
											var skuContents = pdtcontent.SkuContents[0];

											var skuListPrice = skuContents.SegmentPoints;
											
											var onSaleFlag = skuContents.SegmentSaleFlag;
											
											var onSalePoints = skuContents.SegmentSalePoints;
											
											var onSaleRoundValue = Math.round(onSalePoints);
											var formatonSaleRoundValue = String(onSaleRoundValue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

											var intvalue = Math.round(skuListPrice);
											var formatintValue = String(intvalue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
											
											if(onSaleFlag)
											{    
												var formatedWasNumber = $('<fmt:formatNumber type="number"/>').text(formatintValue+" Reward Credits");
												var wasText = $('<span style="text-decoration: line-through;">').text("Was: ").append(formatedWasNumber);
								                var formatedNowNumber = $('<fmt:formatNumber type="number"/>').text(formatonSaleRoundValue+" Reward Credits");
								                var nowText = $('<br/> <b>').text("Now: ").append(formatedNowNumber);
								                var slashThroughDiv = $('<div class="slash-through">').append(wasText).append(nowText);
								                var price = $('<li class="price">').append(slashThroughDiv);
								            }else
											{
												if(skuLength>1){
													var formatedNumber = $('<fmt:formatNumber type="number"/>').text("From "+formatintValue+" Reward Credits");
													var price = $('<li class="price">').append(formatedNumber).add('<li class="extraSpace">');
													$('.extraSpace').css('padding-bottom','0.8em');
												}else{
													var formatedNumber = $('<fmt:formatNumber type="number"/>').text(formatintValue+" Reward Credits");
													var price = $('<li class="price">').append(formatedNumber).add('<li class="extraSpace">');
													$('.extraSpace').css('padding-bottom','0.8em');
												}
												
											}
											var prodctdesc;
											
											if(classType == "CERT" && map[productId]){
												var descBrand = brandDesc.replace("'", "");
												prodctdesc = $('<a href="javascript:void(0)" onclick="homeRetriveEcertProductDetails(\''
                                                    + productId
                                                    + '\',\''
                                                    + homepage
                                                    + '\',\''
                                                    + key
                                                    + '\',\''
                                                    + descBrand
                                                    + '\')" class="button radius add-cart">SELECT</a>');
											}
											else{
												prodctdesc = $('<a href="javascript:void(0)" onclick="homeRetriveProductDetails(\''
	                                                    + productId
	                                                    + '\',\''
	                                                    + homepage
	                                                    + '\',\''
	                                                    + key
	                                                    + '\')" class="button radius add-cart">SELECT</a>');
											}
											var addtocart;
											if(classType=="CERT" && map[productId] || classType=="ECERT"){
												addtocart = $('<li class="cta-button" style="padding-bottom: -;padding-top: 9.5;padding-top: 9.5px;">').append(prodctdesc);
											}
											else{
												addtocart = $('<li class="cta-button">').append(prodctdesc);
											}
											
											var description;
											
											if(classType == "CERT" && map[productId]){
												description = $('<a class="bold black" onclick="homeRetriveProductEcert(\''+ productId + '\',\''+ brandDesc.replace("'", "") + '\')" href="javascript:void(0);"/>').text(desc);
											}
											else{
												description = $('<a class="bold black" onclick="homeRetriveProductDetails(\''+ productId + '\')" href="javascript:void(0);"/>').text(desc);
											}
											var desc = $('<li class="description bold black">').append(description);
											

											var productImage = $('<img class="mimg_home" />').attr('src' , imageurl);
											productImage.attr('alt' , desc);
											
											var productImageLink;
											
											if(classType == "CERT" && map[productId]){
												productImageLink = $('<a onclick="homeRetriveProductEcert(\''+ productId + '\',\''+ brandDesc.replace("'", "") + '\')">').append(productImage);
											}else{
												productImageLink = $('<a onclick="homeRetriveProductDetails(\''+ productId + '\')">').append(productImage);
											}
											productImageLink.attr('href', "javascript:void();");
											
											/*var productImageDiv = $('<div class="productImageDiv">');
											productImageDiv.append(productImageLink);*/

											var quickviewImage = $('<img style="width:35px;height:35px;"/>').attr('src' , "/trex_assets/images/quickview.png");
											var quickviewURL = $('<a href="#" class=" show-for-medium-up">').append(quickviewImage);

											//var title = $('<li class="title">').append(productImageLink).append(quickviewURL);
											
											var productImageLinkDiv = $('<div class="pro-image" style="height:98px">').append(productImageLink);

											var title = $('<li class="title">').append(productImageLinkDiv);
											
											var quickviewURLDiv = $('<li class="title">').append(quickviewURL);			
											
											
											if(classType=="CERT" && map[productId] || classType=="ECERT"){
												var electronicDelivery = $('<label class="ecert-label">').append("Electronic delivery available.");

												var pricingTableli = $('<ul class="pricing-table">').append(title).append(quickviewURLDiv).append(desc).append(price).append(electronicDelivery).append(addtocart);

											}
											else{
												var pricingTableli = $('<ul class="pricing-table">').append(title).append(quickviewURLDiv).append(desc).append(price).append(addtocart);

											}
											var featuredProductli = $('<li class="featured-product-wrapper"/>').append(pricingTableli);

											$(id).append(featuredProductli);
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

function homeRetriveProductDetails(productId) {
	var form = $('<form></form>');
	form.attr("method", "GET");
	form.attr("action", '/trex/app/productDetails');
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "productId");
	field.attr("value", productId);
	/*field.attr("name", "breadcrumbCategoryName");
	field.attr("value", breadcrumbCategoryName);*/
	form.append(field);
	$(document.body).append(form);
	form.submit();
}

function homeRetriveProductEcert(productId, brandDesc) {

	
	var form = $('<form></form>');
	form.attr("method", "GET");
	form.attr("action", '/trex/app/productDetails');
	
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "productId");
	field.attr("value", productId);
	
	form.append(field);
	
	var fieldBrand = $('<input></input>');
	fieldBrand.attr("type", "hidden");
	fieldBrand.attr("name", "brandDesc");
	fieldBrand.attr("value", brandDesc);
	
	form.append(fieldBrand);	
	$(document.body).append(form);
	form.submit();

}

function homeRetriveProductDetails(productId,homepage,key) {
	
	
	var form = $('<form></form>');
	form.attr("method", "GET");
	form.attr("action", '/trex/app/productDetails');
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "productId");
	field.attr("value", productId);
	
	var field1 = $('<input></input>');
	field1.attr("type", "hidden");
	field1.attr("name", "homepage");
	field1.attr("value", homepage);
	
	var field2 = $('<input></input>');
	field2.attr("type", "hidden");
	field2.attr("name", "key");
	field2.attr("value", key);
	
	/*field.attr("name", "breadcrumbCategoryName");
	field.attr("value", breadcrumbCategoryName);*/
	form.append(field);
	form.append(field1);
	form.append(field2);
	
	$(document.body).append(form);
	form.submit();

    
}
    
function homeRetriveEcertProductDetails(productId,homepage,key,brandDesc) {

  	  	
  	var form = $('<form></form>');
  	form.attr("method", "GET");
  	form.attr("action", '/trex/app/productDetails');
  	var field = $('<input></input>');
  	field.attr("type", "hidden");
  	field.attr("name", "productId");
  	field.attr("value", productId);
  	
  	var field1 = $('<input></input>');
  	field1.attr("type", "hidden");
  	field1.attr("name", "homepage");
  	field1.attr("value", homepage);
  	
  	var field2 = $('<input></input>');
  	field2.attr("type", "hidden");
  	field2.attr("name", "key");
  	field2.attr("value", key);
  	
  	var field3 = $('<input></input>');
  	field3.attr("type", "hidden");
  	field3.attr("name", "brandDesc");
  	field3.attr("value", brandDesc);
  	
  	/*field.attr("name", "breadcrumbCategoryName");
  	field.attr("value", breadcrumbCategoryName);*/
  	form.append(field);
  	form.append(field1);
  	form.append(field2);
  	form.append(field3);
  	
  	$(document.body).append(form);
  	form.submit();
  
}


