var highlightedMobileMerchCategory;
function rdrMoblieMenu(modelAttributeValue){
	var modelAttribute = jQuery.parseJSON(modelAttributeValue);
	var propertiesContent = modelAttribute.PropertiesContent;
	for ( var x in propertiesContent) {
       var content = propertiesContent[x];
       if (content.PropertyKey === "HIGHLIGHTED_MERCH_CATEGORY") {
              highlightedMobileMerchCategory = content.PropertyValue;
       }
	}
}

$(document).ready(function () {
	$.get("/trex/app/menu", {},
			function (json) {
				$('#menu').multilevelpushmenu({
	                     onGroupItemClick: function () {
							var e = arguments[0];
							$res = arguments[1];
							$item = arguments[2];
							menuId = $item.attr('id');
							if(menuId != undefined){
								var splitId = menuId.split('_');
								var shopMenu = splitId['0'];
								var brandsURL = splitId['1'];
								var catId = parseInt(splitId['1'],10);
								if( shopMenu === 'SHOP' ){
									getCatetoryResults(catId);
								}
								else if(shopMenu === 'TOPBRANDS'){
									getTopBrandsResults(brandsURL);
								}
								 else{
									 if(menuId != null && menuId != "VIEW_ALL"){
										 getPointRangeResults(menuId);
									 }
									 else{
										 getSearchResults("ALLPRODUCTS");
									 }
								} 
							}
							
						}, 
	                    menu: json,
	                    mode: 'overlap',
	                    preventItemClick: false, 
					});
	                // Extra CSS on Login display
	                $('#menu').find("i.login").closest('li').addClass("member-login");
	                $('#menu').find("i.tier").closest('li').addClass("member-balance");
					$(".levelHolderClass .ltr li").find("a:contains('"+highlightedMobileMerchCategory+"')").css('font-weight','bold');
					$(".levelHolderClass .ltr li").find("a:contains('"+highlightedMobileMerchCategory+"')").css('font-size','1.2em');
	                
	                var rewardsCredits = $(".member-balance a").text().split(":");
	                var tier = rewardsCredits[0];
	                var segment = rewardsCredits[1];
	                var points = rewardsCredits[2];
	                
	                //$(".member-balance a").text(tier+":"+segment+":"+points.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
	    });    

    $('#header-search').click(function () {
        $(this).find('img').toggle();
        $("#large-header-search").toggle();
    });

    // Search Icon click on top nav
    $("#header-large .input-search #search-image").bind("click", function (e) {
    	e.preventDefault();
        var searchVal = $('input.search-input-large').val() === "" ? "ALLPRODUCTS" : $('input.search-input-large').val();
        document.location.replace($("#input-large-context").val() + searchVal);            
    });
    
    $("#header-large .input-search .search-input-large").bind("click", function (e) {
    	//if (showLogin(e)) {
    		$(this).focus();
    	//}
    });

    $('input.search-input-large').keypress(function (e) {
        //if (showLogin(e)) {
            if (e.which === 13) {
                var searchVal = ($(this).val() === "" ? "ALLPRODUCTS" : $(this).val());
                document.location.replace($("#input-large-context").val() + searchVal);
                searchByFilters();               
                return false;
            }
        //}
    });
    $('input.search-input-medium').keypress(function (e) {
        if (e.which === 13) {
            var searchVal = ($(this).val() === "" ? "ALLPRODUCTS" : $(this).val());
            document.location.replace($("#input-medium-context").val() + searchVal);
            searchByFilters()            
            return false;
        }
    });
    // minicart remove
    $(document.body).on("click","[id^=minicartremove]", function (e) {
        e.preventDefault();
        if (validateCartRemove()) {
            var businessId = new String($(this).attr('id')).split("_")[1];
            if (businessId !== "") {
                $.ajax({
                    type: "POST",
                    url: paths.PATH + "/removeFromCart",
                    data: { 
                    	lineItemId: businessId,
                    	cg : csrfTokenValue
                    	},
                    dataType: "html",
                    success: function (data) {
                        var dom = $("<div>").append($.parseHTML(data, document, true));
                        // Adjust UI.
                        $("#drop").html(dom.find("#drop").html());
                        $("#mini-item").html(dom.find("#mini-item").html());
                        $("#header_text_items").append(" ITEMS");
                        $("#table-wrap").html(dom.find("#table-wrap").html());
                        $(document).foundation();
                    }
                });
            }
        }
    });

    //wishlist remove
    $("[id^=wishlistremove]").on("click", function (e) {
        e.preventDefault();
        if (validateWishListRemove()) {
            var businessId = new String($(this).attr('id')).split("_")[1];
            if (businessId !== "") {
                document.location.replace(paths.PATH + "/secure/wishlist/remove?id=" + businessId);
            }
        }
    });

    function validateWishListRemove() {
        return confirm(" Are you sure you want to remove this item from your wishlist?");
    }

    function validateCartRemove() {
        return confirm(" Are you sure you want to remove this item from your cart?");
    }

    // Close Push Menue for desktop width
    $(window).resize(function () {
        if ($(this).width() > 1024) {
        	$("div.inner-wrap").find('a.exit-off-canvas').trigger('click');
        }
    });


    //TODO - once login functionality completed we need to uncommand this
    /*$("#tab2").click(function (event) {
    if (!showLogin(event)) {
        $("#tab2").removeAttr("href");
    }
   });*/

    $("#support-links a").click(function (event) {
        var values = "landingPage:" + this.id;		
		updateSessionDetails(values, this.id);
    });
    
    $("#support-links-mobile a").click(function (event) {
        var values = "landingPage:" + this.id;		
		updateSessionDetails(values, this.id);
    });
    
    $("#logout").click(function (event) {
    });   
    //Info created this two fuction for search result functionality
    function searchByFilters() {
	    $("#navigation #pagefilter").val("");
    ajaxCallToFilterParam();
}

function ajaxCallToFilterParam() {
    //console.log($("#navigation").serialize());
	
    $.ajax({
        type: "GET",
        url: paths.PATH + "/filtered",
        data: $("#navigation").serialize(),
        dataType: "html",
        success: function(data) {
            var dom = $("<div>").append($.parseHTML(data, document, true));
            // Adjust UI.
            $("#searchcontainer").html(dom.find("#searchcontainer").html());
            $("#searchresultsfound").html(dom.find("#searchresultsfound").html());
            $(document).foundation();
        }
    });
    $(document).ajaxStart(function() {
    });
}

});

function dynamicReplace(str, rMap) {
    var out = str;
    $.each(rMap, function(k, o) {        
        if (str === k) {
            out = o;
        }
    });
    return out;
}

function updateSessionDetails(values, page, form) {
	//TODO - Need to add the session values only if user is not logged in
	var loggedIn = $("#loggedIn").val();
    if (loggedIn === 'NO') {
	   	$.ajax({
    		type : "GET",
    		url : "/trex/app/updateSessionAttributes",
    		data : {
    			"sessionValues" : values
    		},
    		success : function(data) {
    			//do nothing
    			if(page === 'CONTACTUS') {
    				window.location.href = "/trex/app/service/contact";
    			} else if(page === 'ORDER_STATUS') {
    				window.location.href =  "/trex/app/secure/service/order/history";
    			} else if(page === 'WISHLIST') {
    				window.location.href = "/trex/app/secure/wishlist";
    			} else if(page === 'CART') {
    				window.location.href = "/trex/app/cart";
    			} else if(page === 'LOGIN') {
    				window.location.href = "/trex/app/login";
    			} else if(page === 'FAQ') {
    				window.location.href = "/trex/app/service/faq";
    			} else if(page === 'PRIVACY') {
    				window.location.href = "/trex/app/service/privacy";
    			} else if(page === 'TNC') {
    				window.location.href = "/trex/app/service/terms";
    			} else if(page === 'RETURN') {
    				window.location.href = "/trex/app/service/returns";
    			} else if(page === 'ADD_WISHLIST') {
    				if(form) {
    					submitFormWithCsrfToken(form);
    				}
    			} else if(page === 'ADD_CART') {
    				if(form) {
    					submitFormWithCsrfToken(form);
    				}
    			}
    		}
    	});    	
    } else {
    	if(page === 'CONTACTUS') {
			window.location.href = "/trex/app/service/contact";
		} else if(page === 'ORDER_STATUS') {
			window.location.href =  "/trex/app/secure/service/order/history";
		} else if(page === 'WISHLIST') {
			window.location.href = "/trex/app/secure/wishlist";
		} else if(page === 'CART') {
			window.location.href = "/trex/app/cart";
		} else if(page === 'LOGIN') {
			window.location.href = "/trex/app/login";
		} else if(page === 'FAQ') {
			window.location.href = "/trex/app/service/faq";
		} else if(page === 'PRIVACY') {
			window.location.href = "/trex/app/service/privacy";
		} else if(page === 'TNC') {
			window.location.href = "/trex/app/service/terms";
		} else if(page === 'RETURN') {
			window.location.href = "/trex/app/service/returns";
		} else if(page === 'ADD_WISHLIST') {
			if(form) {
				submitFormWithCsrfToken(form);
			}
		} else if(page === 'ADD_CART') {
			if(form) {
				submitFormWithCsrfToken(form);
			}
		}
    }
}

function openHeaderLink(page) {
	if(page) {
		if(page === 'CONTACTUS') {
			var values = "landingPage:CONTACTUS";
			updateSessionDetails(values, page);
		} else if(page === 'ORDER_STATUS') {
			var values = "landingPage:ORDER_STATUS";
			updateSessionDetails(values, page);
		} else if(page === 'WISHLIST') {
			var values = "landingPage:WISHLIST";
			updateSessionDetails(values, page);
		} else if(page === 'CART') {
			var values = "landingPage:CART";
			updateSessionDetails(values, page);
		} else if(page === 'LOGIN') {
			var values = "landingPage:LOGIN";
			updateSessionDetails(values, page);
		}
	}
}