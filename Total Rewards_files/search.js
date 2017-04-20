function loadSearchResultsPage(searchResultsJson, pageSize, sortBy) {
	var searchResultsJson = $.parseJSON( searchResultsJson );

	renderSearchCrumbs(searchResultsJson,pageSize);
	
	renderLeftPaneContentResults(searchResultsJson, pageSize);
	
	renderGiftCardLayoutResults(searchResultsJson);
	
	renderPaginationComponent(searchResultsJson, pageSize);
	
	renderSeachText(searchResultsJson);
	
	renderSortOptionsResults(searchResultsJson,pageSize);
	
	renderRecordPerpageResults(searchResultsJson,pageSize)
}

function renderPaginationComponent(searchResultsJson, pageSize) {
	
	$("#topright-filter .paging").empty();
	//$('#pagination_top').empty();
	
	var navigationOptions = searchResultsJson.navigation;
	var pagination = navigationOptions.pagination;

	var totalRecordCount = pagination.totalRecordCount;
	var totalPageCount = pagination.totalPageCount;

	var pages = pagination.pages;	
	
	var paginationList = $('<ul class="pagination">');

	var ajaxImageContent = $('<li id="ajax-loader-pagination" style="display:none;"><span><img src="/trex_assets/images/pagination-ajax-loader.gif" alt="Pagination ajax loading image"></span></li>');
	paginationList.append(ajaxImageContent);

	/*var pageLabel = $('<li><span>Page:</span></li>');
	paginationList.append(pageLabel);*/
	var getTotalPages=getAllPages(pages);
	var maxPage=getMaxPage(getTotalPages);
	var minPage=getMinPage(getTotalPages);
	for(var i = 0; i < pages.length; i++) {
		var pageDetails = pages[i];
		var pageNumber = pageDetails.label;
		var pageURL = pageDetails.pageUrl;
		var activePage = '';
		var activePageURL = '';
		if(pageNumber === 'Next') {

			var nextElement = $('<li id="next_element" class="next_li">');

			var nextElementLink = $('<a onclick="ajaxCallToFilter(\''+pageURL+ '\',\'' + null + '\',\'' + pageSize + '\');" class="gray_small next_li" href="javascript:void(0);">');			

			var overlaySpan = $('<span class="overlay">');
			var laftSpan = $('<span class="left"></span>');
			/*var previousPageImg = $('<img src="assets_${sessionScope.brand}/img/buttons/gray/next_bg.png.png" alt="Top Navigation Back">');*/
			var centerSpan = $('<span class="center next">').append('>>');
			var rightSpan = $('<span class="right"></span>');

			nextElementLink.append(overlaySpan).append(laftSpan).append(centerSpan).append(rightSpan);
			nextElement.append(nextElementLink);

			
			paginationList.append(nextElement);
		} else if(pageNumber === 'Previous') {
			var previousElement = $('<li id="previous_element" class="next_li">');

			var previousElementLink = $('<a onclick="ajaxCallToFilter(\''+pageURL+ '\',\'' + null + '\',\'' + pageSize + '\');" class="gray_small next_li" href="javascript:void(0);">');

			var overlaySpan = $('<span class="overlay">');
			var laftSpan = $('<span class="left"></span>');
			var centerSpan = $('<span class="center next">').append('<<');
			var rightSpan = $('<span class="right"></span>');

			previousElementLink.append(overlaySpan).append(laftSpan).append(centerSpan).append(rightSpan);
			previousElement.append(previousElementLink);
			
			paginationList.append(previousElement);
			

		} else {
			var pgno = pageDetails.label;
			var pgurl = pageDetails.pageUrl;
			var currentPage = pageDetails.currentPage;
			
			var pageElement = $('<li id="'+pgno+'">');
			var pageElementLink; 
			if(currentPage===true){
				pageElementLink = $('<b class="black">');
				pageElementLink.append(pgno);
				pageElement.css('padding-top', '1px');
				pageElement.css('padding-left', '4px');
				pageElement.css('padding-right', '8px');	
			}else{
				pageElementLink = $('<a onclick="ajaxCallToFilter(\''+pageURL+ '\',\'' + null + '\',\'' + pageSize + '\'); addClassActive(\''+pgno+'\');" href="javascript:void(0);" >');
				pageElementLink.append(pgno);
			}
			

			var hiddenPageNumbercontent = $('<span class="hidden-text-ada">');
			hiddenPageNumbercontent.append('Top Navigation - Go to page ' + pageNumber);

			if(pageNumber == minPage) {
				pageElement.addClass("active");
			} 
			pageElement.append(pageElementLink);
			paginationList.append(pageElement); 
		}		
	}
	$("#topright-filter .paging").append(paginationList);
}

/**
 * This method retreives all the page numbers shown in respective page
 * @param pages - contains the page details
 * @returns {Array} - returns all the page number 
 */
function getAllPages(pages){
	var getTotalPages = [];
	var label='';
	for(var i = 0; i < pages.length; i++) {
		var pageDetails = pages[i];
		var pageNumber = pageDetails.label;
		if(isNaN(pageNumber)){
			continue;
		}
		else{
			getTotalPages.push(pageNumber);
		}				
	}
	return getTotalPages;
}

/**
 * get's the maximum page number to deal with Next button
 * @param getTotalPages - contains all the page number 
 * @returns - the largest of all the page number
 */
function getMaxPage(getTotalPages) {
	var largest=getTotalPages[0];
	for (var i = 0; i < getTotalPages.length; i++) {
		if (getTotalPages[i] > largest) {
			largest = getTotalPages[i];
		}
	}
	return largest;
}

/**
 * get's the mininum page number to deal with Next button
 * @param getTotalPages - contains all the page number 
 * @returns - the smallest of all the page number
 */
function getMinPage(getTotalPages) {
	var smallest = getTotalPages[0];
	for (var i = 0; i < getTotalPages.length; i++) {
		if (getTotalPages[i]<smallest) {
			smallest = getTotalPages[i];
		}
	}
	return smallest;
}

function goToNextPage(pageUrl, pageSize){	
	//$("#ajax-loader-pagination").show();
	$.ajax({
		url:pageUrl,
		type: 'GET',
		//data: {pageUrl:pageUrl},
		success:function(data) {
			renderPaginationComponent(data,pageSize)
			$("#searchresults-list").empty();
			renderGiftCardLayoutResults(data);
			
		}
	});
}

/** 
 * sets the class active based on the id triggered.
 * @param id - holds the id of the current class
 */
function addClassActive(id) {
	$(".pagination li").each(function() {
		var idAttr = $(this).attr('id');
		if (typeof idAttr !== typeof undefined) {
			if(idAttr == id){
				$(this).attr('class', 'active'); 
			}
			else{
				$(this).removeAttr('class'); 
			}
		}
	});

}

function renderLeftPaneContentResults(productDetails, pageSize) {
	var isCat = true, isPnt = true, isBnd = true;
	for (var facets = productDetails.facets, categoriesList = $('<ul id="catnav" class="side-nav" varStatus="status">'), pointsList = $(' <ul id="pointsnav" class="side-nav">'), brandsList = $('<ul id="brandsnav" class="side-nav">'), f = 0; f < facets.length; f++) {
		for (var g = facets[f].facetDimensions, h = 0; h < g.length; h++) {
			var selected = g[h].selected;
			var i = $("<li>");
			var cbox = $("<div class='checkbox'>")
			if ("Categories" === facets[f].name) {
				isCat = false;
				var j = $('<input type="checkbox" style="vertical-align: middle; margin:0px;" onclick="ajaxCallToFilter(\'' + g[h].productSearchUrl + '\',\'' + g[h].removeActionUrl + '\',\'' +  pageSize + '\');" name="categories" id="' + g[h].name + '" value="' + g[h].name + '" />'),
				k = $('<label class="chk-label" for="' + g[h].name + '">').text(g[h].name);
				if(selected && selected === true){
					j.attr('checked', true);					
				}
				i.append(cbox);
				cbox.append(j).append(k), categoriesList.append(i);
			} else if ("Point Range" === facets[f].name) {
				isPnt = false;
				
				var rangeInput = g[h].name;     
                var index=rangeInput.indexOf('-');
                var result;
                if(index!=-1)
                {
              var minRange=rangeInput.substring(0,index).trim();
              var minArray=minRange.split(",");
              var minValue="";
              for(var m=0; m<minArray.length;m++)
              {
                minValue=minValue+minArray[m];
              }
              minValue=(parseInt(minValue)+1).toString();
              result=rangeInput.replace(minRange,minValue);
                }
                else
                {
                  result=rangeInput;
                }
        
                var formatRange = String(result).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                
                
				
				var j = $('<input  type="checkbox" style="vertical-align: middle; margin:0px;" onclick="ajaxCallToFilter(\'' + g[h].productSearchUrl + '\',\'' + g[h].removeActionUrl + '\',\'' +  pageSize + '\');" name="pointLevel" id="' + formatRange + '" value="' + formatRange + '" />'),
				k = $('<label class="chk-label" for="' + formatRange + '">').text(formatRange);
				if(selected && selected === true){
					j.attr('checked', true);					
				}
				i.append(cbox);
				cbox.append(j).append(k), pointsList.append(i);
			} else if ("Brands" === facets[f].name) {
				isBnd = false;
				var j = $('<input  type="checkbox" style="vertical-align: middle; margin:0px;" onclick="ajaxCallToFilter(\'' + g[h].productSearchUrl + '\',\'' + g[h].removeActionUrl + '\',\'' + pageSize + '\');" name="groups" id="' + g[h].name + '" value="' + g[h].name + '" />'),
				k = $('<label class="chk-label" for="' + g[h].name + '">').text(g[h].name);
				if(selected && selected === true){
					j.attr('checked', true);					
				}
				i.append(cbox);
				cbox.append(j).append(k), brandsList.append(i);
			}
		}
		"Categories" === facets[f].name ? ($("#panel1").append(categoriesList), $("#categoryAccordion").removeClass("hide"))
				: "Point Range" === facets[f].name ? ($("#panel2")
						.append(pointsList),$("#rewardcreditsAccordion").removeClass("hide"))
						:"Brands" === facets[f].name
						&& ($("#panel3").append(brandsList) , $("#brandAccordion").removeClass("hide"))
	}
	if(isCat) ($("#categoryAccordion").addClass("hide"));
	if(isPnt) ($("#rewardcreditsAccordion").addClass("hide"));
    if(isBnd) ($("#brandAccordion").addClass("hide"));
}


/**
 * This method  makes the backend call to filter the selected product
 * @param filterProducts - holds the product search URL
 */
function ajaxCallToFilter(filterProducts, removeActionUrl,pageSize) {	
	var filterUrl = '';      
	
	if (filterProducts!="null") {
		filterUrl = filterProducts; 
	} else {
		filterUrl = removeActionUrl;
	}
	
	filterUrl = decodeURIComponent(filterUrl);
		$.ajax({
			type : "GET",
			url : "/trex/app/filterResults",
			data : {
				filterProducts : filterUrl
			},
			success : function(data) {
				$('#searchresults-list').empty();
				$('#searchresultsfound').empty();
				$('.paging').empty();
				$('#panel1').empty();
				$('#panel2').empty();
				$('#panel3').empty();
				renderPaginationComponent(data,pageSize)
				renderGiftCardLayoutResults(data);
				renderSeachText(data);
				renderSortOptionsResults(data,pageSize);
				renderRecordPerpageResults(data,pageSize);
				renderLeftPaneContentResults(data, pageSize);
			}
		});

}

function renderGiftCardLayoutResults(data) {
	var counter = 1;
	var totalRecords = data.records;
	var navigation = data.navigation;
	var breadcrumbCategoryName=null;
	if(navigation.searchCrumbs!=""){
		var searchCrumbs = navigation.searchCrumbs;
	breadcrumbCategoryName = searchCrumbs[0].name;
	}
	for (var i = 0; i < totalRecords.length; i++) {
		
		var brands = totalRecords[i].brands;
		var brand = brands[0];
		var totalProducts = brand.products;
		var rollupId = brands[0].id;
		var brandDesc = brands[0].description;
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
		
		for(var j = 0; j < totalProducts.length; j++) {
			
			var product = totalProducts[j];
			var desc = product.description;
			var desc1 = desc.split(/\s+/).slice(0,2).join(" ");
			var desc2 = desc.split(" ").pop();
			var imageurl = product.imageUrl;
			var classType = product.classType;
			var productId = product.id;
			if((!map[productId] && classType == 'ECERT')|| classType != 'ECERT'){
			var prodctdesc;
			var description;
			var productImageLink;
			
			//var productImage = $('<img style="height: 150px;" />').attr('src' , imageurl);
			var productImage = $('<img class="mimg" />').attr('src' , imageurl);
			
			if(classType == "CERT" && map[productId]){				
				prodctdesc = $('<a href="javascript:void(0)" onclick="searchRetriveProductDetailsEcert(\''
						+ productId + '\',\''+ breadcrumbCategoryName +'\',\''+ brandDesc.replace("'","") +'\')" class="button radius add-cart">SELECT</a>');
				
				description = $('<a class="bold black" onclick="homeRetriveProductEcert(\''+ productId + '\',\''+ brandDesc.replace("'","") +'\')" href="javascript:void(0)"/>').text(desc1+" "+desc2);
				productImageLink = $('<a onclick="homeRetriveProductEcert(\''+ productId + '\',\''+ brandDesc.replace("'","") +'\')"> </div>').append(productImage);
			}
			
			else{
				prodctdesc = $('<a href="javascript:void(0)" onclick="searchRetriveProductDetails(\''
						+ productId + '\',\''+ breadcrumbCategoryName +'\')" class="button radius add-cart">SELECT</a>');
				
				description = $('<a class="bold black" onclick="homeRetriveProductDetails(\''+ productId + '\')" href="javascript:void(0)"/>').text(desc1+" "+desc2);
				productImageLink = $('<a onclick="homeRetriveProductDetails(\''+ productId + '\')">').append(productImage);
			}
			
			
			
			//var addtocartdesc = $('<a class="button radius add-cart"  href="javascript:void(0)"  onclick="addToCart();"/>').text(addToCartText);
			var addtocart;
			
			if(classType == "CERT" && map[productId]){
			
				addtocart = $('<li class="cta-button" style="padding-bottom: -;padding-top: 9.5;padding-top: 9.5px;">').append(prodctdesc);	
			} else{
			
				addtocart = $('<li class="cta-button">').append(prodctdesc);
			}
			
			var desc = $('<li class="description bold black">').append(description);			
			
			productImage.attr('alt' , desc);
			
			productImageLink.attr('href', "javascript:void();");
			
			
			
			/*var productImageDiv = $('<div class="productImageDiv">');
			productImageDiv.append(productImageLink);*/

			var quickviewImage = $('<img style="width:35px;height:35px;"/>').attr('src' , "/trex_assets/images/quickview.png");
			var quickviewURL = $('<a href="#" class=" show-for-medium-up">').append(quickviewImage);			
			var productImageLinkDiv = $('<div class="pro-image" style="height:98px">').append(productImageLink);
			
			//var title = $('<div class="pro-image">').append(productImageLink).append(quickviewURL);
			var title = $('<li class="title">').append(productImageLinkDiv);
			var quickviewURLDiv = $('<li class="title">').append(quickviewURL);
			
			var productURL = product.self;
			var totalSkus = product.skus;
			totalSkus.sort(sortByProperty('points'));
			var sku = totalSkus[0];		
			var id = sku.id;	
			var price = sku.listPrice;
			var points = sku.points;	
			var itemDescription = sku.description;
			
			var onSaleFlag = sku.onSale;
			var onSalePoints = sku.salePoints;
			var skuLength = totalSkus.length;
			
			
			
			if(onSaleFlag)
			{   
				var formatonSalePoints = String(onSalePoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
				var formatPoints = String(points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
				var formatedWasNumber = $('<fmt:formatNumber type="number"/>').text(formatPoints+" Reward Credits");
				var wasText = $('<span style="text-decoration: line-through;">').text("Was: ").append(formatedWasNumber);
                var formatedNowNumber = $('<fmt:formatNumber type="number"/>').text(formatonSalePoints+" Reward Credits");
                var nowText = $('<br/> <b>').text("Now: ").append(formatedNowNumber);
                var slashThroughDiv = $('<div class="slash-through">').append(wasText).append(nowText);
                var price = $('<li class="price">').append(slashThroughDiv);
                
			}else
			{   if(skuLength>1){
					var formatPoints = String(points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
					var formatedNumber = $('<fmt:formatNumber type="number"/>').text("From "+formatPoints+" Reward Credits");
					var price = $('<li class="price">').append(formatedNumber).add('<li class="extraSpace">');
					$('.extraSpace').css('padding-bottom','0.8em');
				}else{
					var formatPoints = String(points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
					var formatedNumber = $('<fmt:formatNumber type="number"/>').text(formatPoints+" Reward Credits");
					var price = $('<li class="price">').append(formatedNumber).add('<li class="extraSpace">');
					$('.extraSpace').css('padding-bottom','0.8em');
				}
				
			}
				
			var hiddenValues= $(' <input id="imgProdURL'+ counter++ +'" type="hidden" rollupId="'+rollupId+'" productId="'+productId+'" imageUrl="'+imageurl+'" productURL="'+productURL+'" skuid="'+sku.id+'" skuprice="'+price+'" points="'+points+'" itemDescription="'+itemDescription+'"/>');
			
			//var price = $('<li class="price">').append(points);
			if(classType=="CERT" && map[productId]){
				var electronicDelivery = $('<label class="ecert-label">').append("Electronic delivery available.");

				var pricingTableli = $('<ul class="pricing-table">').append(title).append(quickviewURLDiv).append(desc).append(price).append(electronicDelivery).append(addtocart).append(hiddenValues);

					}
			else{
				var pricingTableli = $('<ul class="pricing-table">').append(title).append(quickviewURLDiv).append(desc).append(price).append(addtocart).append(hiddenValues);

				}
			var featuredProductli = $('<li class="featured-product-wrapper"/>').append(pricingTableli);
			
			$("#searchresults-list").append(featuredProductli);
			}
		}
	}
	
}

function renderSeachText(searchResultsJson){
	
	var navigationOptions = searchResultsJson.navigation;
	var site_pagination = navigationOptions.pagination;
	var totalRecordCount = site_pagination.totalRecordCount;
	var navigationOptions = searchResultsJson.navigation;
	var brdCrumbs = navigationOptions.breadCrumbs;
	var searchText = brdCrumbs.name;
	/*var i = $('<h3 class="show-for-large-up" style="line-height: 0.8;font-size: 1.3em;"/> '+ searchText +'</h3>');
	var l = $(' <span id="searchresultsfound" class="hide-for-small-down" style="color:#999999;font-size: 0.85em;">' +totalRecordCount +'</span>');*/
	$("#searchresultsfound").prepend(totalRecordCount+" ");
	if(totalRecordCount==0){
		var errorIcon = $('<img/>').attr('src' , "/trex_assets/images/error-icon.png");
		$(".empty-products").css("display","block").prepend(errorIcon);
		$(".clear-all").css("display","none");
	}
	/*$("#searchpanel").append(i).append(l);*/
}


/**
 * Below method used to get and set the sort url in sortBy option respectively.
 * @param productDetails
 */
function renderSortOptionsResults(productDetails,pageSize) {
	var navigationOptions = productDetails.navigation;
	var sortOptions = navigationOptions.sortOptions;     
	$('#sortfilterselect').attr('onchange', "sortByOrderResults('"+pageSize +"');");
		for (var i = 0; i < sortOptions.length; i++) {
			var optionName = sortOptions[i].name;
			var encodedSortUrl = sortOptions[i].sortUrl;		
			var decodedSortUrl = decodeURIComponent(encodedSortUrl);
			if(optionName=="Alphabetical (Ascending)"){
				var order= $('#sortfilterselect').find('option:selected').attr('value');
				if(order == "name,asc"){
					$('#sortfilterselect').find('option:selected').attr('sortUrl',decodedSortUrl);			
				}
				
			}	
			if(optionName=="Alphabetical (Descending)"){
				var order= $('#sortfilterselect').find('option').eq(1).attr('value');
				if(order == "name,desc"){
					$('#sortfilterselect').find('option').eq(1).attr('sortUrl',decodedSortUrl);			
				}
				
			}	
			if(optionName=="Points (Ascending)"){
				var order= $('#sortfilterselect').find('option').eq(2).attr('value');
				if(order == "price,asc"){		
					$('#sortfilterselect').find('option').eq(2).attr('sortUrl',decodedSortUrl);					
				}
			}
			if(optionName=="Points (Descending)"){
				var order= $('#sortfilterselect').find('option').eq(3).attr('value');
				if(order == "price,desc"){
					$('#sortfilterselect').find('option').eq(3).attr('sortUrl',decodedSortUrl);			
				}
				
			}
			
		}	
}

function renderRecordPerpageResults(productDetails,pageSize) {
	var navigationOptions = productDetails.navigation;
	var paginations = navigationOptions.pagination;
	var recordsPerPageList = paginations.recordsPerPageList;   
	$('#perpagefilterselect').attr('onchange', "sortByRecordPerPageResults('"+pageSize +"');");
		for (var i = 0; i < recordsPerPageList.length; i++) {
			var optionName = recordsPerPageList[i].name;
			var encodedSortUrl = recordsPerPageList[i].recordsPerPageUrl;		
			var decodedSortUrl = decodeURIComponent(encodedSortUrl);
			if(optionName=="12"){
				var order= $('#perpagefilterselect').find('option').eq(1).attr('value');
				if(order == "12"){					
					$('#perpagefilterselect').find('option').eq(1).attr('recordsPerPageUrl',decodedSortUrl);					
				}
			}
			if(optionName=="24"){
				var order= $('#perpagefilterselect').find('option').eq(2).attr('value');
				if(order == "24"){
					$('#perpagefilterselect').find('option').eq(2).attr('recordsPerPageUrl',decodedSortUrl);			
				}
				
			}
			
			if(optionName=="48"){
				var order= $('#perpagefilterselect').find('option').eq(3).attr('value');
				if(order == "48"){
					$('#perpagefilterselect').find('option').eq(3).attr('recordsPerPageUrl',decodedSortUrl);			
				}
				
			}	
		}	
}

/**
 *  Sorted Content is retreived for sorting the data based on the Sort option.
 */
function sortByOrderResults(pageSize){	   
	var hasFilterOccured=true;
	
	var sortUrl = $('#sortfilterselect').find('option:selected').attr('sortUrl');
	sortUrl = decodeURIComponent(sortUrl);
	var msg = $("#ajaxLoadingMessage");
	
	$.ajax({
		type : "GET",
		url : "/trex/app/filterResults",
		data : {
			"filterProducts" : sortUrl
		},
		success : function(data) {
			$('#searchresults-list').empty();
			$('#searchresultsfound').empty();
			$('.paging').empty();
			$('#panel1').empty();
			$('#panel2').empty();
			$('#panel3').empty();
			renderPaginationComponent(data,pageSize);
			renderGiftCardLayoutResults(data);
			renderSeachText(data);
			renderLeftPaneContentResults(data, pageSize);
		}
	});
}

function sortByRecordPerPageResults(pageSize){	 
	var recordsPerPageUrl = $('#perpagefilterselect').find('option:selected').attr('recordsPerPageUrl');
	var value = $('#perpagefilterselect').find('option:selected').attr('value');
	recordsPerPageUrl = decodeURIComponent(recordsPerPageUrl);
	$.ajax({
		type : "GET",
		url : "/trex/app/filterResults",
		data : {
			"filterProducts" : recordsPerPageUrl
		},
		success : function(data) {
			$('#searchresults-list').empty();
			$('#searchresultsfound').empty();
			$('.paging').empty();
			$('#panel1').empty();
			$('#panel2').empty();
			$('#panel3').empty();
			renderPaginationComponent(data,value);
			renderGiftCardLayoutResults(data);
			renderSeachText(data);
			renderLeftPaneContentResults(data, pageSize);
		}
	});
}



function searchRetriveProductDetails(productId,breadcrumbCategoryName) {
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
	field1.attr("name", "pdpBreadcrumb");
	field1.attr("value", "SEARCH");
	form.append(field1);
	
	$(document.body).append(form);
	form.submit();
}


function searchRetriveProductDetailsEcert(productId,breadcrumbCategoryName,brandDesc) {
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
	field1.attr("name", "pdpBreadcrumb");
	field1.attr("value", "SEARCH");
	form.append(field1);
	
	var field2 = $('<input></input>');
	field2.attr("type", "hidden");
	field2.attr("name", "brandDesc");
	field2.attr("value", brandDesc);
	form.append(field2);
	
	$(document.body).append(form);
	form.submit();
}

function getTopBrandsResults(filter) {
	
	var form = $('<form></form>');
	form.attr("method", "get");
	form.attr("action", '/trex/app/topBrands');
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "topBrandsUrl");
	field.attr("value", filter);
	form.append(field);
	$(document.body).append(form);
	form.submit();
	
}

function renderSearchCrumbs(data,pageSize){
	var navigation = data.navigation;
	var allItem = $("#searchpanel").text();
	var spItem = allItem.split(" ");
	var val = spItem[0].trim("");
	if(navigation.searchCrumbs!=""){
		var searchCrumbs = navigation.searchCrumbs;
		
		var ul = $('<ul class="breadcrumbs hide-for-small">');
		var liHome = $("<li>");
		var home = $('<a href = "'+ paths.PATH +'/home">Home</a>');
		liHome.append(home);
		ul.append(liHome);
		
		for(var i in searchCrumbs ){
			menuName = searchCrumbs[i].name;
			
			if( menuName!=="GIFT CARDS"){
				var liCurrent = $('<li class="current">'+menuName+'</li>');
				var searchLi = $('<li class="current">SEARCH</li>');
				ul.append(searchLi);
				ul.append(liCurrent);
				}
				else {	
					/*var searchLi = $('<li class="current">SEARCH</li>');
					ul.append(searchLi);*/
					var liCurrent =$('<li class="current">'+menuName+'</li>');
					ul.append(liCurrent);
				}
		}
		$('#searchCrumbs-name').append(ul);
	}
	else if (val == "ALL" || val =="ALLPRODUCTS" ){
		
		var ul = $('<ul class="breadcrumbs hide-for-small">');
		var liHome = $("<li>");
		var home = $('<a href = "'+ paths.PATH +'/home">Home</a>');
		liHome.append(home);
		ul.append(liHome);
		
		var searchLi = $('<li class="current">SEARCH</li>');
		ul.append(searchLi);
		if(val != "ALLPRODUCTS"){
		var currentLi = $('<li class="current">ALL</li>');
		}
		else{
			var currentLi = $('<li class="current">ALLPRODUCTS</li>');
		}
		ul.append(currentLi);
		$('#searchCrumbs-name').append(ul);			
    	}
		
	}
