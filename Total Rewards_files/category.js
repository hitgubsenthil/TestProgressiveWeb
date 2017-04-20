var breadCrumbUL;

function loadCategoryPage(productDetails, pageSize, sortBy,menuLi,menuLableName,categoryId) {
	var productDetails = $.parseJSON(productDetails);
	renderBreadCrumbs(productDetails,pageSize,menuLi,menuLableName);
	renderCategoryPagination(productDetails, pageSize,menuLi,menuLableName);
	renderLeftPaneContent(productDetails, pageSize,menuLi,menuLableName);
	renderGiftCardLayout(productDetails,pageSize,menuLi,menuLableName,categoryId);
	renderSortOptions(productDetails, pageSize,menuLi,menuLableName)
	renderRecordPerpage(productDetails, pageSize,menuLi,menuLableName);
	renderSeachTextResults(productDetails);
	
}

function renderCategoryPagination(productDetails, pageSize,menuLi,menuLableName) {
	
	$(".panel .paging").empty();
	//$('#pagination_top').empty();
	
	var navigationOptions = productDetails.navigation;
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

			var nextElementLink = $('<a onclick="ajaxCallToFilterResults(\''+pageURL+ '\',\'' + null + '\',\'' + pageSize + '\',\'' + menuLi + '\',\'' + menuLableName + '\');" class="gray_small next_li" href="javascript:void(0);">');			

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

			var previousElementLink = $('<a onclick="ajaxCallToFilterResults(\''+pageURL+ '\',\'' + null + '\',\'' + pageSize + '\',\'' + menuLi + '\',\'' + menuLableName + '\');" class="gray_small next_li" href="javascript:void(0);">');

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
			var pageElementLink; 
			var pageElement = $('<li id="'+pgno+'">');
			if(currentPage===true){
				pageElementLink = $('<b class="black">');
				pageElementLink.append(pgno);				
				pageElement.css('padding-top', '1px');
				pageElement.css('padding-left', '4px');
				pageElement.css('padding-right', '8px');				
			}else{
				pageElementLink = $('<a onclick="ajaxCallToFilterResults(\''+pageURL+ '\',\'' + null + '\',\'' + pageSize + '\',\'' + menuLi + '\',\'' + menuLableName + '\');addClassActive(\''+pgno+'\');" href="javascript:void(0);" >');
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
	$(".panel .paging").append(paginationList);
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

/*function getSelectedPageNumber(pages) {
	for (var i = 0; i < pages.length; i++) {
		var pageDetails = pages[i];
		var pageNumber = pageDetails.label;
		var pageUrl = pageDetails.pageUrl;
		if (pageUrl == null) {
			return pageNumber;
		}
	}
}*/

/*function renderPagination(productDetails, pageSize,menuLi,menuLableName) {
	var navigationOptions = productDetails.navigation;
	var site_pagination = navigationOptions.pagination;
	var totalItems = site_pagination.totalPageCount;
	var currentPage = getSelectedPageNumber(site_pagination.pages);
	var totalRecordCount = site_pagination.totalRecordCount;

	$('.paging').pagination({
		items : totalRecordCount,
		itemsOnPage : pageSize,
		currentPage : currentPage,
		onPageClick : function(p, e) {
			e.preventDefault();
			ajaxCallToPaginationFilterParam(p, pageSize,menuLi,menuLableName);
		}
	});
}

function getSelectedPageNumber(pages) {
	for (var i = 0; i < pages.length; i++) {
		var pageDetails = pages[i];
		var pageNumber = pageDetails.label;
		var pageUrl = pageDetails.pageUrl;
		if (pageUrl == null) {
			return pageNumber;
		}
	}
}*/

function renderLeftPaneContent(productDetails, pageSize,menuLi,menuLableName) {
	var isCat = true, isPnt = true, isBnd = true;
	for (var facets = productDetails.facets, categoriesList = $('<ul id="catnav" class="side-nav" varStatus="status">'), pointsList = $(' <ul id="pointsnav" class="side-nav">'), brandsList = $('<ul id="brandsnav" class="side-nav">'), f = 0; f < facets.length; f++) {
		for (var g = facets[f].facetDimensions, h = 0; h < g.length; h++) {
			var selected = g[h].selected;
			var i = $("<li>");
			var cbox = $("<div class='checkbox'>")
			if ("Categories" === facets[f].name) {
				isCat = false;
				var j = $('<input type="checkbox" style="vertical-align: middle; margin:0px;" onclick="ajaxCallToFilterResults(\''
						+ g[h].productSearchUrl
						+ '\',\''
						+ g[h].removeActionUrl
						+ '\',\''
						+ pageSize
						+ '\',\''
						+ menuLi
						+ '\',\''
						+ menuLableName
						+ '\');" name="categories" id="'
						+ g[h].name
						+ '" value="' + g[h].name + '" />'), k = $(
						'<label class="chk-label" for="' + g[h].name + '">')
						.text(g[h].name);
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
				
				var j = $('<input type="checkbox" style="vertical-align: middle; margin:0px;" onclick="ajaxCallToFilterResults(\''
						+ g[h].productSearchUrl
						+ '\',\''
						+ g[h].removeActionUrl
						+ '\',\''
						+ pageSize
						+ '\',\''
						+ menuLi
						+ '\',\''
						+ menuLableName
						+ '\');" name="pointLevel" id="'
						+ formatRange
						+ '" value="' + formatRange + '" />'), k = $(
						'<label class="chk-label" for="' + formatRange + '">')
						.text(formatRange);
				if(selected && selected === true){
					j.attr('checked', true);					
				}
				i.append(cbox);
				cbox.append(j).append(k), pointsList.append(i);
			} else if ("Brands" === facets[f].name) {
				isBnd = false;
				var j = $('<input type="checkbox" style="vertical-align: middle; margin:0px;" onclick="ajaxCallToFilterResults(\''
						+ g[h].productSearchUrl
						+ '\',\''
						+ g[h].removeActionUrl
						+ '\',\''
						+ pageSize
						+ '\',\''
						+ menuLi
						+ '\',\''
						+ menuLableName
						+ '\');" name="groups" id="'
						+ g[h].name
						+ '" value="'
						+ g[h].name + '" />'), k = $(
						'<label class="chk-label" for="' + g[h].name + '">')
						.text(g[h].name);
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
 * This method makes the back end call to filter the selected product
 * 
 * @param filterProducts -
 *            holds the product search URL
 */
function ajaxCallToFilterResults(filterProducts, removeActionUrl,pageSize,menuLi,menuLableName) {
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
				$('#deptresults-list').empty();
				//$('#searchpanel').empty();
				$('.paging').empty();
				$('#panel1').empty();
				$('#panel2').empty();
				$('#panel3').empty();
				$("#searchresultsfound").html("ITEMS");
				renderCategoryPagination(data, pageSize,menuLi,menuLableName);
				renderGiftCardLayout(data,pageSize,menuLi,menuLableName,filterUrl);
				renderSeachTextResults(data);
				
				
				renderSortOptions(data, pageSize,menuLi,menuLableName)
				renderRecordPerpage(data, pageSize,menuLi,menuLableName);
				renderLeftPaneContent(data, pageSize,menuLi,menuLableName);
			}
		});
}

function renderGiftCardLayout(data,pageSize,menuLi,menuLableName,filterProducts) {
	var counter = 1;
		
	var totalRecords = data.records;
	var navigation = data.navigation;
	var breadcrumbCategoryName = null;
	var breadCrumbs = navigation.breadCrumbs;
	var selfURL = data.self;
	
if (breadCrumbs!=null && breadCrumbs != "" && breadCrumbs.length>0){
	$('#breadcrumbs-name').empty();
	$("#searchpanel h3").empty();
		 var breadcrumbUl = $('<ul class="breadcrumbs hide-for-small">');
		var liHome = $("<li>");
		var home = $('<a href = "'+ paths.PATH +'/home">Home</a>');
		liHome.append(home);
		breadcrumbUl.append(liHome);
		
		var tempArray = [];
		for(var i in breadCrumbs ){
			
			var breadcrumbCategoryName = breadCrumbs[i].name;
			var removeActionUrl = breadCrumbs[i].removeActionUrl;
				if(null!=removeActionUrl){
				var	removeUrl=breadCrumbs[i].removeActionUrl;
				var li = $('<li >');
				var liDropdown = $('<a  onclick="breadcrumbAjaxCallRemoveAction(\''+ removeUrl + '\',\''+pageSize+'\',\''+menuLi+'\',\''+menuLableName+'\')" href="javascript:void(0)">'+breadcrumbCategoryName+'</a>');
				li.append(liDropdown);
				breadcrumbUl.append(li);

				tempArray.push({
					Menu : breadcrumbCategoryName,
					removeActionURL :removeActionUrl
				});
				}
				else if(filterProducts!=undefined&&filterProducts!=''){					
					var liCurrent =$('<li class="current">'+breadcrumbCategoryName+'</li>');
					breadcrumbUl.append(liCurrent);

					tempArray.push({
					Menu : breadcrumbCategoryName,
					removeActionURL :filterProducts
				});
				}
				else{
					var liCurrent =$('<li class="current">'+breadcrumbCategoryName+'</li>');
					breadcrumbUl.append(liCurrent);
				}
				
				
				
				var tempInfo = {"updateBreadcrumb" : tempArray };
				breadCrumbUL = JSON.stringify(tempInfo);
		}
		$('#breadcrumbs-name').append(breadcrumbUl);
		$("#searchpanel h3").append(menuLi);
	}

	
		
	
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
			var productDetailsLink = product.self;
			var classType = product.classType;
			var skus = product.skus;
		if((!map[productId] && classType == 'ECERT')|| classType != 'ECERT'){
			for (var k = 0; k < skus.length; k++) {
				var prodctdesc;
				if(classType == 'CERT' && map[productId]){
					prodctdesc = $('<a href="javascript:void(0)" onclick="categoryRetriveProductDetailsEcert(\''
						+ productId
						+ '\',\''+ brandDesc.replace("'","") + '\')" class="button radius add-cart">SELECT</a>');
				}
				else{
					prodctdesc = $('<a href="javascript:void(0)" onclick="categoryRetriveProductDetails(\''
							+ productId
							+ '\')" class="button radius add-cart">SELECT</a>');
				}

				var addtocart;
				
				if(classType=="CERT" && map[productId]){
					addtocart = $('<li class="cta-button" style="padding-bottom: -;padding-top: 9.5;padding-top: 9.5px;">').append(prodctdesc);
				}
				else{
					addtocart = $('<li class="cta-button">').append(prodctdesc);
				}
				
				var description;
				if(classType == 'CERT' && map[productId]){
					description = $('<a class="bold black" onclick="categoryRetriveProductDetailsEcert(\''+ productId + '\',\''+ brandDesc.replace("'","") + '\')" href="javascript:void(0)"/>').html(proddesc);
				}
				else{
					description = $('<a class="bold black" onclick="categoryRetriveProductDetails(\''+ productId + '\')" href="javascript:void(0)"/>').html(proddesc);
				}
				var desc = $('<li class="description bold black">').append(
						description);

				/*var price = $('<li class="price">').append(skus[k].points);*/

				var formatPrice = String(skus[k].points).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
				var price = $('<li class="price">').append(formatPrice);


				var productImage = $('<img class="mimg" />').attr('src', imageurl);
				productImage.attr('alt', proddesc);
				
				var productImageLink;
				if(classType == 'CERT' && map[productId]){
					productImageLink = $(
						'<a onclick="categoryRetriveProductDetailsEcert(\''
								+ productId + '\',\''+ brandDesc.replace("'","") + '\')">').append(
						productImage);
				}
				else{
					productImageLink = $(
							'<a onclick="categoryRetriveProductDetails(\''
									+ productId + '\')">').append(
							productImage);
				}
				productImageLink.attr('href', "javascript:void();");

				/*
				 * var productImageDiv = $('<div class="productImageDiv">');
				 * productImageDiv.append(productImageLink);
				 */
				
				
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
				{	if(skuLength>1){
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
				

				var quickviewImage = $('<img style="width:35px;height:35px;"/>').attr('src',
						"/trex_assets/images/quickview.png");
				var quickviewURL = $('<a href="#" class=" show-for-medium-up">')
						.append(quickviewImage);

				//var title = $('<li class="title">').append(productImageLink).append(quickviewURL);
						
						
				var productImageLinkDiv = $('<div class="pro-image" style="height:98px">').append(productImageLink);

				var title = $('<li class="title">').append(productImageLinkDiv);
											
				var quickviewURLDiv = $('<li class="title">').append(quickviewURL);			
											
											
				
				if(classType=="CERT" && map[productId]){
					var electronicDelivery = $('<label class="ecert-label">').append("Electronic delivery available.");

					var pricingTableli = $('<ul class="pricing-table">').append(title).append(quickviewURLDiv).append(desc).append(price).append(electronicDelivery).append(addtocart);

				}
				else{
					var pricingTableli = $('<ul class="pricing-table">').append(title).append(quickviewURLDiv).append(desc).append(price).append(addtocart);

				}
				
				var featuredProductli = $(
						'<li class="featured-product-wrapper"/>').append(
						pricingTableli);
				
				
				
			}
			
			}
			$("#deptresults-list").append(featuredProductli);
			counter++;

		}
	}


	
}


/**
 * Below method used to get and set the sort url in sortBy option respectively.
 * 
 * @param productDetails
 */
function renderSortOptions(productDetails, pageSize,menuLi,menuLableName) {
	var navigationOptions = productDetails.navigation;
	var sortOptions = navigationOptions.sortOptions;
	$('#sortfilterselect').attr('onchange', 'sortByOrder(\''
						+ pageSize
						+ '\',\''
						+ menuLi
						+ '\',\''
						+ menuLableName
						+ '\');');
	for (var i = 0; i < sortOptions.length; i++) {
		var optionName = sortOptions[i].name;
		var encodedSortUrl = sortOptions[i].sortUrl;
		var decodedSortUrl = decodeURIComponent(encodedSortUrl);
		
		if (optionName == "Alphabetical (Ascending)") {
			var order = $('#sortfilterselect').find('option:selected').attr(
					'value');
			if (order == "name,asc") {
				$('#sortfilterselect').find('option:selected').attr('sortUrl',
						decodedSortUrl);
			}

		}
		if (optionName == "Alphabetical (Descending)") {
			var order = $('#sortfilterselect').find('option').eq(1).attr(
					'value');
			if (order == "name,desc") {
				$('#sortfilterselect').find('option').eq(1).attr('sortUrl',
						decodedSortUrl);
			}

		}
		
		if (optionName == "Points (Ascending)") {
			var order = $('#sortfilterselect').find('option').eq(2).attr(
					'value');
			if (order == "price,asc") {
				$('#sortfilterselect').find('option').eq(2).attr('sortUrl',
						decodedSortUrl);
			}
		}
		if (optionName == "Points (Descending)") {
			var order = $('#sortfilterselect').find('option').eq(3).attr(
					'value');
			if (order == "price,desc") {
				$('#sortfilterselect').find('option').eq(3).attr('sortUrl',
						decodedSortUrl);
			}

		}
	}
}

function renderRecordPerpage(productDetails, pageSize,menuLi,menuLableName) {
	var navigationOptions = productDetails.navigation;
	var paginations = navigationOptions.pagination;
	var recordsPerPageList = paginations.recordsPerPageList;
	$('#perpagefilterselect').attr('onchange',
			'sortByRecordPerPage(\''
						+ pageSize
						+ '\',\''
						+ menuLi
						+ '\',\''
						+ menuLableName
						+ '\');');
	for (var i = 0; i < recordsPerPageList.length; i++) {
		var optionName = recordsPerPageList[i].name;
		var encodedSortUrl = recordsPerPageList[i].recordsPerPageUrl;
		var decodedSortUrl = decodeURIComponent(encodedSortUrl);
		if (optionName == "12") {
			var order = $('#perpagefilterselect').find('option').eq(1).attr(
					'value');
			if (order == "12") {
				$('#perpagefilterselect').find('option').eq(1).attr(
						'recordsPerPageUrl', decodedSortUrl);
			}
		}
		if (optionName == "24") {
			var order = $('#perpagefilterselect').find('option').eq(2).attr(
					'value');
			if (order == "24") {
				$('#perpagefilterselect').find('option').eq(2).attr(
						'recordsPerPageUrl', decodedSortUrl);
			}

		}

		if (optionName == "48") {
			var order = $('#perpagefilterselect').find('option').eq(3).attr(
					'value');
			if (order == "48") {
				$('#perpagefilterselect').find('option').eq(3).attr(
						'recordsPerPageUrl', decodedSortUrl);
			}

		}
	}
}

/**
 * Sorted Content is retreived for sorting the data based on the Sort option.
 */
function sortByOrder(pageSize,menuLi,menuLableName) {
	var hasFilterOccured = true;

	var sortUrl = $('#sortfilterselect').find('option:selected')
			.attr('sortUrl');
	sortUrl = decodeURIComponent(sortUrl);
	var msg = $("#ajaxLoadingMessage");

	$.ajax({
		type : "GET",
		url : "/trex/app/filterResults",
		data : {
			"filterProducts" : sortUrl
		},
		success : function(data) {
			$('#deptresults-list').empty();
			$('#searchpanel').empty();
			$('.paging').empty();
			$('#panel1').empty();
			$('#panel2').empty();
			$('#panel3').empty();
			renderCategoryPagination(data, pageSize,menuLi,menuLableName);
			renderGiftCardLayout(data,pageSize,menuLi,menuLableName);
			renderSeachTextResults(data);
			renderLeftPaneContent(data, pageSize,menuLi,menuLableName);
		}
	});
}

function sortByRecordPerPage(pageSize,menuLi,menuLableName) {
	var hasFilterOccured = true;

	var recordsPerPageUrl = $('#perpagefilterselect').find('option:selected')
			.attr('recordsPerPageUrl');
	var value = $('#perpagefilterselect').find('option:selected').attr('value');
	recordsPerPageUrl = decodeURIComponent(recordsPerPageUrl);
	var msg = $("#ajaxLoadingMessage");

	$.ajax({
		type : "GET",
		url : "/trex/app/filterResults",
		data : {
			"filterProducts" : recordsPerPageUrl
		},
		success : function(data) {
			$('#deptresults-list').empty();
			$('#searchpanel').empty();
			$('.paging').empty();
			$('#panel1').empty();
			$('#panel2').empty();
			$('#panel3').empty();
			renderCategoryPagination(data, pageSize,menuLi,menuLableName);
			renderGiftCardLayout(data,pageSize,menuLi,menuLableName);
			renderSeachTextResults(data);
			renderLeftPaneContent(data, pageSize,menuLi,menuLableName);
		}
	});
}

function renderSeachTextResults(searchResultsJson) {
	var navigationOptions = searchResultsJson.navigation;
	var site_pagination = navigationOptions.pagination;
	var totalRecordCount = site_pagination.totalRecordCount;
	var navigationOptions = searchResultsJson.navigation;
	var searchCrumbs = navigationOptions.searchCrumbs;
	var searchText = searchCrumbs.name;
	$("#searchresultsfound").prepend(totalRecordCount+" ");

}

function getCatetoryResults(catId) {
	var form = $('<form></form>');
	form.attr("method", "get");
	form.attr("action", '/trex/app/catsearch/'+catId);
	$(document.body).append(form);
	form.submit();
}

function getSearchResults(searchId) {
	var form = $('<form></form>');
	form.attr("method", "get");
	form.attr("action", '/trex/app/search/'+searchId);
	$(document.body).append(form);
	form.submit();
}

function getPointRangeResults(filter,menuLi,menuLabelName) {
	var form = $('<form></form>');
	form.attr("method", "get");
	form.attr("action", '/trex/app/facetResults');
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "filterProducts");
	field.attr("value", filter);
	form.append(field);
	var field1 = $('<input></input>');
	field1.attr("type", "hidden");
	field1.attr("name", "menuName");
	field1.attr("value", menuLabelName);
	form.append(field1);
	var field2 = $('<input></input>');
	field2.attr("type", "hidden");
	field2.attr("name", "menuLi");
	field2.attr("value", menuLi);
	form.append(field2);
	$(document.body).append(form);
	form.submit();
}

function categoryRetriveProductDetails(productId) {
	var form = $('<form></form>');
	form.attr("method", "get");
	form.attr("action", '/trex/app/productDetails');	   
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "productId");
	field.attr("value", productId);
	form.append(field);
	var field1 = $('<input></input>');
	field1.attr("type", "hidden");
	field1.attr("name", "pdpBreadcrumb");
	field1.attr("value", breadCrumbUL);
	form.append(field1);
	
	$(document.body).append(form);
	form.submit();
}

function categoryRetriveProductDetailsEcert(productId, brandDesc) {
	var form = $('<form></form>');
	form.attr("method", "get");
	form.attr("action", '/trex/app/productDetails');	   
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "productId");
	field.attr("value", productId);
	form.append(field);
	var field1 = $('<input></input>');
	field1.attr("type", "hidden");
	field1.attr("name", "pdpBreadcrumb");
	field1.attr("value", breadCrumbUL);
	form.append(field1);
	var field2 = $('<input></input>');
	field2.attr("type", "hidden");
	field2.attr("name", "brandDesc");
	field2.attr("value", brandDesc);
	form.append(field2);
	
	$(document.body).append(form);
	form.submit();
}


function renderBreadCrumbs(data,pageSize,menuLi,menuLableName) {
	var navigation = data.navigation;
	var breadCrumbs = navigation.breadCrumbs;
	var breadcrumbCategoryName = null;
	
		
		if(menuLableName=="Point Range"&&menuLi!=null){
			
			var ul = $('<ul class="breadcrumbs hide-for-small">');
			 var liHome = $("<li>");
	         var home = $('<a href = "'+ paths.PATH +'/home">Home</a>');
				var searchLi = $('<li class="current">SEARCH</li>');
				
				var liReward = $('<li class="current">REWARD CREDITS</li>');
				/*var rewardCredits = $('<a href = "'+ paths.PATH +'/SEARCH/REWARD CREDITS">REWARD CREDITS</a>');*/
				var liDropdown= $('<li class="current">'+menuLi+'</li>');
				liHome.append(home);
				
				
				ul.append(liHome);
				ul.append(searchLi);
				ul.append(liReward);
				ul.append(liDropdown);
				$('#breadcrumbs-name').append(ul);
				$("#searchpanel h3").append("REWARD CREDITS");
		}

}

/*$(window).load(function(){
	if(('.slash-through span').length > 0){
		$('.slash-through span').parents('li.featured-product-wrapper .pricing-table').find('a:first img').css('height','135px');
	}
});*/

function breadcrumbAjaxCallRemoveAction(removeUrl,pageSize,menuLi,menuLableName){
	removeActiontUrl = decodeURIComponent(removeUrl)
	$.ajax({
		type : "GET",
		url : "/trex/app/filterResults",
		data : {
			"filterProducts" : removeActiontUrl
		},
		success : function(data) {
			$('#deptresults-list').empty();
			//$('#searchpanel').empty();
			$('.paging').empty();
			$('#panel1').empty();
			$('#panel2').empty();
			$('#panel3').empty();
			$('#breadcrumbs-name').empty();
			$("#searchresultsfound").html("ITEMS");
			renderLeftPaneContent(data, pageSize,menuLi,menuLableName);
			renderGiftCardLayout(data,pageSize,menuLi,menuLableName);
			renderSeachTextResults(data);
			
			renderCategoryPagination(data, pageSize,menuLi,menuLableName);
			renderSortOptions(data, pageSize,menuLi,menuLableName)
			renderRecordPerpage(data, pageSize,menuLi,menuLableName);
			
		}
	});
	
}

$(document).ready(function(){
	$('.clear-all').click(function(){
		location.reload();
	});
});

function rediretandGetCatetoryResults(filter) {
	var form = $('<form></form>');
	form.attr("method", "get");
	form.attr("action", '/trex/app/facetResults');
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", "filterProducts");
	field.attr("value", filter);
	form.append(field);
	$(document.body).append(form);
	form.submit();
}