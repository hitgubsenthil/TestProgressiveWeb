function parseEndecaContent(content) {
	if(content) {
		var bodyContent = content.BodyContent;
		if(bodyContent) {
			var bodyHTMLCOntents = bodyContent.HtmlContents;
			if(bodyHTMLCOntents) {
				
			}
			
			
			var bodyTextCOntents = bodyContent.TextContents;
			if(bodyTextCOntents) {
				
			}
		}
	}
}

function appendImageContent(contentData) {
	/* START: Load Home Page Banner */
	var key = contentData.Key;
	if(key.indexOf('banner') >= 0 ){
		var txt = key;
		var numb = txt.match(/\d/g);
		numb = numb.join("");
		var imageUrl  = contentData.LargeImageURL;
		var bannerImage = $('<img/>').attr('src' , imageUrl);
		var imageLink = contentData.LinkURL;
		if(imageLink != null && imageLink != '#'){
			nValue = imageLink.split("=").pop();
		}
		var anchorElement = $('<a>').append(bannerImage);
		if(imageLink==="#" || imageLink===null ){
			anchorElement.attr('href', "#");
		}else{
			anchorElement.attr("href", "/trex/app/catsearch/"+nValue+"");
		}
		var productImageLi = $('<li id="#large-btns1_s"'+numb+'">');
		productImageLi.append(anchorElement);
		$("#slider").append(productImageLi);
	}
	
	/* END: Load Home Page Banner */
	if(key.indexOf('brand') >= 0 ){
		var smallImageurl = contentData.SmallImageURL;
		if(smallImageurl != null){
			var topBrandsimageLink = contentData.LinkURL;
			var topBrandNvalues;
			if(topBrandsimageLink != null && topBrandsimageLink != '#') {
				topBrandNvalues = topBrandsimageLink.split("=").pop();
			}else if(topBrandsimageLink==="#" || topBrandsimageLink===null){
				topBrandNvalues="#";
			}
			
			var brandImage = $('<img/>').attr('src' , smallImageurl);
			var imageURLLink;
			if(topBrandNvalues==="#"){
				imageURLLink = $('<a href="'+topBrandNvalues+'">').append(brandImage);
			}else{
				imageURLLink = $('<a href="/trex/app/catsearch/'+topBrandNvalues+'">').append(brandImage);	
			}
			
			var listofbrands = $('<li>').append(imageURLLink);
			$("#carousel-wrapper").append(listofbrands);
		}
	}
	
}


function appendTextContent(contentData) {
	var contentId = contentData.Key;
	var content = contentData.Text;
	$("#" + contentId ).append( content );
}

function prependTextContent(contentData) {
	var contentId = contentData.Key;
	var content = contentData.Text;
	$("#" + contentId ).prepend( content );
}

function renderPageContent(content) {
	
	if(content) {
		var headerContent = content.HeaderContent;
		if(headerContent) {
			var headerTextContents = headerContent.TextContents;
			if(headerTextContents) {
				for(var i in headerTextContents) {
					appendTextContent(headerTextContents[i]);
				}
			}
		}

		var bodyContent = content.BodyContent;
		if(bodyContent) {
			var bodyHTMLCOntents = bodyContent.HtmlContents;
			
			if(bodyHTMLCOntents) {
				for(var i in bodyHTMLCOntents) {
					var key = bodyHTMLCOntents[i].Key;
					if(key === 'offerHtml') {
						var htmlcontent = bodyHTMLCOntents[i].HtmlData;
						$("#banner-space").html(htmlcontent);
					}
				}
			}

			var bodyTextCOntents = bodyContent.TextContents;
			if(bodyTextCOntents) {
				for(var i in bodyTextCOntents) {
					appendTextContent(bodyTextCOntents[i]);
				}
			}
			
			var bodyImageContents = bodyContent.ImageContents;
			if(bodyImageContents){
				for(var i in bodyImageContents){
					appendImageContent(bodyImageContents[i]);
				}
				
			}
		}

		var footerContent = content.FooterContent;
		if(footerContent) {
			var footerTextContents = footerContent.TextContents;
			if(footerTextContents) {
				for(var i in footerTextContents) {
					appendTextContent(footerTextContents[i]);
				}
			}
			
			var footerHtmlContents = footerContent.HtmlContents;
			
			if(footerHtmlContents) {
				for(var i in footerHtmlContents) {
					var key = footerHtmlContents[i].Key;
					
					if(key === 'brand_image_map') {
						var htmlcontent = footerHtmlContents[i].HtmlData;
						
						$(".brands_wrapper").html(htmlcontent);
					}
				}
			}

			var footerlinks = ["hs_orderhistory_link", "hs_faq_text_link", "hs_contactus_text_link", "hc_privacy_text_link", "hs_terms_text_link", "hs_return_link"];
			var footerHyperlinkContents =  footerContent.HyperlinkContents;
			if(footerHyperlinkContents) {
				for(var i in footerHyperlinkContents) {
					var linkText = footerHyperlinkContents[i].LinkText;
					var linkURL = footerHyperlinkContents[i].LinkURL;
					var contentId = footerHyperlinkContents[i].Key;
					$("." + contentId ).append( linkText );
					if((footerlinks.indexOf(contentId) <= -1)) {
						$("." + contentId ).attr( "href", linkURL);
					}
					/*if(opeinnewwindow) {
						//Handle Open in new window coonfiguration
					}*/
				}
			}
		}
	}
}

function getProductDetails(productId, brand){
	var form = $('<form></form>');
	form.attr("method", "get");
	form.attr("action", '/trex/app/productDetails');	   
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "productId");
	field.attr("value", productId);
	form.append(field);
	
	$(document.body).append(form);
	form.submit();
}

function rdrCustomerServiceContents(page, customerServiceContent) {
/*	$.each(customerServiceContent.BodyContent.HtmlContents, function(index, contactContent) {
		console.log(contactContent.Key);
		var contactContentHtml = contactContent.HtmlData;
		if(contactContent.Key === 'cs_'+page) {
            $('#contentHtml').html(contactContentHtml);
        }
    });*/
}

function rdrMenuCategory(data,modelAttributeValue) {
    if (data != "") {  
        var menucontent = jQuery.parseJSON(data);
        var refinements = menucontent.refinements;
        /*for(var x in refinements)
    	{
    	var giftCard = refinements[x].name;
    		if("Gift Cards"==giftCard){
    		var gLi = $('<li>');
    		var gift = $('<a href="javascript:void(0)"  onclick="getCatetoryResults(\'' + refinements[x].productSearchUrl + '\',\''+giftCard+'\',\''+giftCard+'\');">GIFT CARDS</a>');
    		gLi.append(gift);
    		$('#has-dropdown').prepend (gLi);
    	}
    		}*/
        var merchandise = "MERCHANDISE";
        var giftcards= "GIFTCARDS";
        var categoriesList = $('<ul class="dropdown">');
		var modelAttribute = jQuery.parseJSON(modelAttributeValue);
        var propertiesContent = modelAttribute.PropertiesContent;
		var highlightedMerchCategory;
        for ( var x in propertiesContent) {
        	var content = propertiesContent[x];
			if (content.PropertyKey === "HIGHLIGHTED_MERCH_CATEGORY") {
        		highlightedMerchCategory = content.PropertyValue;
        	}
        }
        
        $.each(refinements, function(index, content) {
        	if (content.name === 'Merchandise') {
			var merchandisePrdUrl = content.productSearchUrl;
			$('#header_text_merchandise').attr("onclick",'getCatetoryResults(\'' + content.productSearchUrl + '\',\''+content.name+'\',\''+content.name+'\');');
        		$.each(content.refinements, function(index, merchandiseContent) {           			
		            var i = $("<li>");
		            var productName = merchandiseContent.name;
		            if(productName.toUpperCase() === highlightedMerchCategory.toUpperCase()){
						var j = $('<a href="javascript:void(0)"  style="font-weight:bold;font-size:1.1em" onclick="getCatetoryResults(\'' + merchandiseContent.productSearchUrl + '\',\''+productName+'\',\''+merchandise+'\');">' + productName + '</a>');
						 i.append(j);
					}else{
						var j = $('<a href="javascript:void(0)"  onclick="getCatetoryResults(\'' + merchandiseContent.productSearchUrl + '\',\''+productName+'\',\''+merchandise+'\');">' + productName + '</a>');
						 i.append(j);
					}	
					$("#categoryFields").append(i);  
		        });
        	}
        	
        	if (content.name === 'Gift Cards') {
    			var giftCardsPrdUrl = content.productSearchUrl;
    			$('#header_text_giftcards').attr("onclick",'getCatetoryResults(\'' + content.productSearchUrl + '\',\''+content.name+'\',\''+content.name+'\');').text(content.name.toUpperCase());
            		$.each(content.refinements, function(index, giftCardContent) {           			
    		            var i = $("<li>");
    		            var productName = giftCardContent.name;
    		            if(productName.toUpperCase() === highlightedMerchCategory.toUpperCase()){
    						var j = $('<a href="javascript:void(0)"  style="font-weight:bold;font-size:1.1em" onclick="getCatetoryResults(\'' + giftCardContent.productSearchUrl + '\',\''+productName+'\',\''+giftcards+'\');">' + productName + '</a>');
    						 i.append(j);
    					}else{
    						var j = $('<a href="javascript:void(0)"  onclick="getCatetoryResults(\'' + giftCardContent.productSearchUrl + '\',\''+productName+'\',\''+giftcards+'\');">' + productName + '</a>');
    						 i.append(j);
    					}	
    					$("#giftCategoryFields").append(i);  
    		        });
            	}
        	
        	
        	
        });
    }
}

var topBrandURL;
function rdrTopBrands(data, modelAttributeValue) {
	if (data != "") {
		var content = jQuery.parseJSON(data);
		var modelAttribute = jQuery.parseJSON(modelAttributeValue);
		var facets = content.facets;
		var topMenu = [];
		var propertiesContent = modelAttribute.PropertiesContent;
		var minValue="";
		
		for ( var x in propertiesContent) {
			var content = propertiesContent[x];
			if (content.PropertyKey == "top_brands") {
				var propertyValue = content.PropertyValue;
				topMenu = propertyValue.split(',');
			}
		}

		var brandsList = $('<ul class="dropdown">');
		if (null != topMenu && topMenu != '') {

			for ( var x in facets) {
				var content = facets[x];
				if ("Brands" === content.name) {
					for ( var i in topMenu) {
						var topMenuName = topMenu[i].toUpperCase();
						for ( var y in content.facetDimensions) {
							var facet = content.facetDimensions[y];

							var fName =facet.name.toUpperCase();
						   
						   fName = fName.replace('®','');
							var facetName = fName.trim("");
							if(facetName === topMenuName) {

								var i = $("<li>");

								var name = facet.name;
								var j = $('<a href="javascript:void(0)"  onclick="getTopBrandsResults(\''
										+ facet.productSearchUrl
										+ '\');">' + name + '</a>');
								i.append(j);
								$("#topBrands").append(i);
								
								/*This below code for making the TopBrand url for filter all products under TOPBRANDS */
								
								topBrandURL = facet.productSearchUrl;
								
								
								 var minArray=topBrandURL.split("&");
				                  
				                  for(var i=0; i<minArray.length;i++)
				                  {
				                   var arrayValue=minArray[i];
				                    var remove = arrayValue.search("=");
				                   remove = remove+1;
				                    if("NaN"!== parseInt(arrayValue.substr(remove)).toString())
				                    	{
				                    	minValue+=parseInt(arrayValue.substr(remove))+'+';
				                    	}
				                  }
							}
						}
					}
				}
			}
		}
		 for(var i=0; i<minArray.length;i++)
         {
			 var str = minArray[i];
			
				 var s = str.split("=");
				 for(var j=0; j<s.length;j++){
					 if("NaN"!== parseInt(s[j]).toString())
						 {
						var plus = minValue.substring(0, minValue.length - 1);
						topBrandURL= topBrandURL.replace(s[j],plus);
						
						
						
						
						 }
				 }
				 
			 
         }
		
	}
}


function rdrPointRanges(data) {
    if (data != "") {
        var content = jQuery.parseJSON(data);
        var facets = content.facets;
        var brandsList = $('<ul class="dropdown">');
        for (var x in facets) {        	
			var content = facets[x];			
			if ("Point Range" === content.name) {				
				for (var y in content.facetDimensions) {
					var facet = content.facetDimensions[y];	
                    var li = $("<li>");
                    var rangeInput = facet.name;     
                    var index=rangeInput.indexOf('-');
                    var result;
                    if(index!=-1)
                    {
                  var minRange=rangeInput.substring(0,index).trim();
                  var minArray=minRange.split(",");
                  var minValue="";
                  for(var i=0; i<minArray.length;i++)
                  {
                    minValue=minValue+minArray[i];
                  }
                  minValue=(parseInt(minValue)+1).toString();
                  result=rangeInput.replace(minRange,minValue);
                    }
                    else
                    {
                      result=rangeInput;
                    }
            
                    var formatRange = String(result).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
     
                    var j = $('<a href="javascript:void(0)"  onclick="getPointRangeResults(\'' + facet.productSearchUrl + '\',\''+formatRange+'\',\''+content.name+'\');">' + formatRange + '</a>');
                    li.append(j);                    
                    $("#pointRange").append(li);
                   				}
			}
        }
    }
}

function addBreadCrumb(breadcrumb, entry , desc) {
    if (entry != "") {		
    	if(desc){
    		var i = $('<li class="current">');}
    	else{
    		var i = $('<li class="other">');
    	}   	
    	i.append(entry);
        $(breadcrumb).append(i);  
    }
}

function removeFromMiniCart(lineItemId){
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

$(document).ready(function(){
	$(document).on("click",".inner-header-filter",function(){
		$(".facet-wrap").toggle();
	});
	
	$(document).on("click","#header_text_top_brands",function(){
	getTopBrandsResults(topBrandURL);
	});
	
});
