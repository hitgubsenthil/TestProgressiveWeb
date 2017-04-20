
$(document).ready(function() {

    $("#paymentccnumber").numeric();
    $("#paymentcccvv").numeric();
    /* $("#shipphone").numeric(); */
    /* $("#billphone").numeric(); */

    $("#checkout-button").on('click', Foundation.utils.debounce(function(e) {
    	e.stopImmediatePropagation();
		$("label").removeClass("error");
		/*$("div.alert-box").remove();*/
		e.preventDefault();
		
		var isValid = validatebillingForm();
		var invalidAddressSelection = "";
		var allRows = $("#checkoutBody").children('tr');
        $(allRows).each(function(i, row){
        	var obj = $(row).data("skuId");
        	var skuId = obj["productId"]; //Just following as it was there from begining
        	var desc = obj["desc"];
        	var classType = obj["classType"];
        	var productId = obj["productId_actual"];        	
        	var shoppingItemId = $('#shippingselect'+i+'').find('option:selected').attr('shippingitmid');
			var shipzip = $('#shippingselect'+i+'').find('option:selected').attr('shipzip');
			var shipstate = $('#shippingselect'+i+'').find('option:selected').attr('shipstate');			
			var email = $('#shippingselect'+i+'').find('option:selected').attr('email');
			var phoneNumber = $('#shippingselect'+i+'').find('option:selected').attr('phoneNumber');		
			var country = $('#shippingselect'+i+'').find('option:selected').attr('country');
			var city = $('#shippingselect'+i+'').find('option:selected').attr('shipcity');
			var shipaddress1 = $('#shippingselect'+i+'').find('option:selected').attr('shipaddress1');
			var shipaddress2 = $('#shippingselect'+i+'').find('option:selected').attr('shipaddress2');
			var firstName = $('#shippingselect'+i+'').find('option:selected').attr('firstName');
			var lastName = $('#shippingselect'+i+'').find('option:selected').attr('lastName');	
			if(isValid){
			if(classType == "ECERT"){
				if(!email){
					if(invalidAddressSelection == "") {
						
							$('.alert-box').empty();
							$('#alert-box-id').empty();
							$('#alert-box-id').css('display','block');
						
					}
					else{
							$('#alert-box-id').append("<br>");
						}
					
						invalidAddressSelection = "Email address is required for electronic gift certificates ["+productId+"]";
						$('#alert-box-id').append(invalidAddressSelection);						
					
				}
			}
			else{
				
				if(!shipaddress1 || !city || !shipzip || !shipstate || !country){
					
					if(invalidAddressSelection == "") {
						
							$('.alert-box').empty();
							$('#alert-box-id').empty();
							$('#alert-box-id').css('display','block');
						
					}
					else{
							$('#alert-box-id').append("<br>");
						}
					
						invalidAddressSelection = "Invalid shipping address selected for item ["+productId+"]";
						$('#alert-box-id').append(invalidAddressSelection);						
					}		
					
				
			}
			
			}
	
	    }); 
        
        if(invalidAddressSelection){
        
			$("html, body").animate({ scrollTop: 0 }, "slow");				 
		
		}
		
		
    if (isValid && !invalidAddressSelection) {
    	var tempArray = new Array();
        var allRows = $("#checkoutBody").children('tr');
        $(allRows).each(function(i, row){
        	var skuID = $(row).data("skuId");
        	var productID = skuID["productId"];
        	var shoppingItemId = $('#shippingselect'+i+'').find('option:selected').attr('shippingitmid');
			var shipzip = $('#shippingselect'+i+'').find('option:selected').attr('shipzip');
			var shipstate = $('#shippingselect'+i+'').find('option:selected').attr('shipstate');
			tempArray.push({
		    sku_id : skuID.productId,		
	        shoppingItemId :shoppingItemId,
			shipzip:shipzip,
			shipstate:shipstate
	    });
        });
        
        var tempInfo = {"shipInfo" : tempArray };
        var skuDetails = JSON.stringify(tempInfo);    
        
              
        $("#checkout-ajax").show();
        $(this).prop('disabled', true);
        $("label").removeClass("error");
        $("#payment").append('<input type="hidden" name="cg" value="'+csrfTokenValue+'"/>');
        $.post(paths.PATH + "/secure/checkout/addpaymentsandbilling?", $("#payment,#billing,#splitpayment").serialize(),
                function(json) {
                    if (json.status == "success") {
						var isDisplaySlider	= 	$('#displayslider').val();
						var availablePoints =0;
						var selectedSliderValue=100;
						if(isDisplaySlider == "true"){
								availablePoints =  $('#availablePointsHidden').val();
								selectedSliderValue = $('[data-slider]').attr('data-slider');
						}
    	
					if(selectedSliderValue==100){
						availablePoints =0;
					}else{
						availablePoints = availablePoints;
					}
						
                    	var form = $('<form></form>');
                    	form.attr("method", "POST");
                    	form.attr("action", '/trex/app/secure/checkout/confirm');
                    	var field = $('<input></input>');
                    	field.attr("type", "hidden");
                    	field.attr("name", "productID_AddressMap");
                    	field.attr("value", JSON.stringify(productID_AddressMap));
						var field1 = $('<input></input>');
	                    field1.attr("type", "hidden");
	                    field1.attr("name", "TaxshipInfo");
	                    field1.attr("value", skuDetails);
						var field2 = $('<input></input>');
	                    field2.attr("type", "hidden");
	                    field2.attr("name", "selectedSliderValue");
	                    field2.attr("value", selectedSliderValue);
						var field3 = $('<input></input>');
	                    field3.attr("type", "hidden");
	                    field3.attr("name", "rewardsPointsHidden");
	                    field3.attr("value", availablePoints);
	                    form.append(field);
                    	form.append(field1);
						form.append(field2);
                    	form.append(field3);
                    	$(document.body).append(form);
                    	//form.submit();
                    	submitFormWithCsrfToken(form);
                    	
                    } else {
                        $("#" + json.status).parent().addClass("error");
                        $("#" + json.status + "-error").text(json.result);
                        $("#checkout-button").prop('disabled', false);
                    }
                }
        );
		}
        $(document).ajaxStop(function() {
            $("#checkout-ajax").hide();
        });
    }, 2000, true));

	
    $("#shipctry").on('change', function() {
        $.post(paths.PATH + "/secure/checkout/statelist", {countryCode: this.value, cg : csrfTokenValue },
        function(json) {
            $("#shipstate").html(json.result);
        }
        );
    });

    $("#billctry").on('change', function() {
        $.post(paths.PATH + "/secure/checkout/statelist", {countryCode: this.value, cg : csrfTokenValue },
        function(json) {
            $("#billstate").html(json.result);
        }
        );
    });
    
    $("#billeqship").click(function() {
    	if (this.checked) {
    		$("#billing img.ajax").show();
            $.post("/trex/app/secure/checkout/billeqship", {shippingAddressItemId :$("#shippingselect0 option:selected").attr("shippingitmid"), cg : csrfTokenValue },
            function(json) {
                if (json.status === "success") {
					$("#billing img.ajax").hide();
                    $.each(json.result, function(k, v) {
                        // console.log(k + " " + v);
                        if (k === "billstates") {
                            $("#billstate").html(v);
                        } else if(k === "billphone"){
						  
							$("#billphone").val(v).mask('(999) 999-9999');
                        }else{
							$("#" + k).val(v);
						}
                    });
                } else {
                    $("#billeqship").prop('checked', false);
                }
            }
            );
            $(document).ajaxStop(function() {
                $("#billing img.ajax").hide();
            });

            //setup ajax error handling
            $.ajaxSetup({
                error: function(x, status) {
                    if (x.status === 0 && status === "error") {
                        alert("Sorry, your session has expired. Please login again to continue");
                        document.location.reload();
                    }
                }
            });
        }
    	else{
            $('#billfirstname,#billemail,#billlastname,#billaddress1,#billaddress2,#billcity,#billzip,#billphone').val("");
     }
    });
    
  
    	$(document).on('change','[id^=shippingselect]',function(e) {
    	
        e.stopImmediatePropagation();
        
        var index = new String($(this).attr('id')).split('shippingselect')[1];
       
        var skuId = $("#checkoutTR"+index).data("skuId");
        
    	var shippingMethods = skuId["shippingMethods"];
    	
    	var quantity =  skuId["quantity"];
    	
    	var classType = skuId["classType"];
        
        var shippingMethodValue = "";
        
        $("#shippingdisplay"+index).empty();
        
        $("#shippingmethodselect"+index).html('');
        
        var optionMethod=$('<option>');
        
        var shippingMethodValuereplaced = "";
        
        var shipaddress1 = $('option:selected', this).attr('shipaddress1');
        var shipaddress2 = $('option:selected', this).attr('shipaddress2');
        var firstName = $('option:selected', this).attr('firstName');
        var lastName = $('option:selected', this).attr('lastName');
        var shipzip = $('option:selected', this).attr('shipzip');
        var shipstate = $('option:selected', this).attr('shipstate');
        var shipcity = $('option:selected', this).attr('shipcity');
        var country = $('option:selected', this).attr('country');
        var id = $('option:selected', this).attr('shippingitmid');
        var email = $('option:selected', this).attr('email');
        var phoneNumber = $('option:selected', this).attr('phoneNumber');
        var mobilePhone = $('option:selected', this).attr('mobilePhone');
    	var newline = "<br/>";
    	
    	var addressObj = new Object();
    	addressObj["firstName"] = firstName;
		addressObj["lastName"] = lastName;
		addressObj["addressLine1"] = shipaddress1;
		addressObj["addressLine2"] = shipaddress2;
		addressObj["postalCode"] = shipzip;
		addressObj["state"] = shipstate;
		addressObj["city"] = shipcity;
		addressObj["country"] = country;
		addressObj["id"] = id;
		addressObj["email"] = email;
		addressObj["phoneNumber"] = phoneNumber;
		addressObj["mobilePhone"] = mobilePhone;
		
    	var skuId = $("#checkoutTR"+index).data("skuId");
    	var productId = skuId["productId"];
    	productID_AddressMap[productId] = addressObj;
		
		var isDisplaySlider	= 	$('#displayslider').val();
		var availablePoints =0;
		var selectedSliderValue=100;
		if(isDisplaySlider == "true"){
			availablePoints =  $('#availablePointsHidden').val();
			selectedSliderValue = $('[data-slider]').attr('data-slider');
		}
    	
		if(selectedSliderValue==100){
			availablePoints =0;
		}else{
			availablePoints = availablePoints;
		}
    	
		$.ajax({
    		type : "POST",
    		url : "/trex/app/secure/checkout/onshippingmethodchange",
    		data : {
    			availablePoints : availablePoints,
				productID_AddressMap : JSON.stringify(productID_AddressMap),
				cg : csrfTokenValue
    		},
    		success : function(data) {
				if(data == "false"){
					if($('.alert-box:visible').length==0){
					$('.alert-box').empty();
					$('#alert-box-id').empty();
						$('#alert-box-id').css('display','block');
						$('#alert-box-id').append("Sorry, you do not have enough Reward Credits to complete this transaction due to one of the following reasons: <ul><li>Minimum Reward credit usage of 20% is required per product.</li> <li> Minimum of 100 Reward Credits must remain in your Reward Credit balance after any TR eCatalog redemption.</li></ul>");
					}
				}else{
				$('.alert-box').css('display','none');
				$("#shippingdisplay"+index).empty();
				var dataContent= jQuery.parseJSON(data);
				var cartLineItem = dataContent.extendedCartLineItem;
				var totalItemShippingPoints=0;
				for(var i=0;i<cartLineItem.length;i++){
				  var lineItemskuId = cartLineItem[i].skuId;
				  if(lineItemskuId == productId){ 
				     totalItemShippingPoints = cartLineItem[i].totalShippingPoints;
				   }
				}
				$('#totalNet').empty();
				$('#totalNet-mobile').empty();
				$('#totalNetCC').empty();
				$('#totalNetCC-mobile').empty();
				$('#totalShippingAndHandling').empty();
				$('#rewardsCreditsUsed').empty();
		    	$('#rewardsCreditsUsed-mobile').empty();
		    	
		    	if(classType != "ECERT" && "US"== country && ("AK"==shipstate || "HI"==shipstate || "GU"==shipstate || "PR"==shipstate))
				{	
		
				shippingMethodValue = shippingMethods.akhiprgushippingMethods;	
				shippingMethodValuereplaced = shippingMethodValue.replace(/X,XXX/g ,totalItemShippingPoints);
				optionMethod.attr('value',shippingMethodValuereplaced).text(shippingMethodValuereplaced);
		
				}else if(classType != "ECERT" && ("US"== country && "AK"!=shipstate && "HI"!=shipstate && "GU"!=shipstate && "PR"!=shipstate)){
			
				shippingMethodValue = shippingMethods.usshippingMethods;
				optionMethod.attr('value',shippingMethodValue).text(shippingMethodValue);
			
				}else if(classType != "ECERT" && "CA"== country){
			
				shippingMethodValue = shippingMethods.canadaShippingMethods;
				shippingMethodValuereplaced = shippingMethodValue.replace(/X,XXX/g ,totalItemShippingPoints);
				optionMethod.attr('value',shippingMethodValuereplaced).text(shippingMethodValuereplaced);
			
				}
				else if(classType != "ECERT"){
					shippingMethodValue = shippingMethods.usshippingMethods;
					optionMethod.attr('value',shippingMethodValue).text(shippingMethodValue);
				}
    	
    	
				optionMethod.attr('selected',true);
		
				$("#shippingmethodselect"+index).append(optionMethod);
    	
				//$("#shippingdisplay"+index).append(firstName).append("  ").append(lastName).append(newline).append(shipaddress1).append(newline).append(shipaddress2).append(newline).append(shipcity+",  ").append(shipstate).append("  ").append(shipzip).append("  ").append(country);
				
				
				
				$("#shippingdisplay"+index).append(firstName).append("  ").append(lastName).append(newline);
				
		        if(email){
		        	$("#shippingdisplay"+index).append(email).append(newline);
				}
				if(shipaddress1){
					$("#shippingdisplay"+index).append(shipaddress1).append(newline);
				}
				if(shipaddress2){
					$("#shippingdisplay"+index).append(shipaddress2).append(newline);
				}
				if(shipcity){
					$("#shippingdisplay"+index).append(shipcity);
					if(shipstate){
						$("#shippingdisplay"+index).append(",");
					}
				}
				if(shipstate){
					$("#shippingdisplay"+index).append(shipstate).append("  ");
				}
				if(shipzip){
					$("#shippingdisplay"+index).append(shipzip).append("  ");
				}
				if(country){
					$("#shippingdisplay"+index).append(country).append("  ");
				}
				
				setCartTotals(dataContent);

				var totalPointsUsed = $('#mp-loyalty-value').val();
			    var sliderEnd = $('#sliderEnd').val();
			    var sliderStart = $('#sliderStart').val();
			    var displaySlider = $('#displayslider').val();
			    
			    if(totalPointsUsed && sliderEnd && sliderStart && displaySlider && displaySlider=="true") {
			    	updateSlider(sliderStart,sliderEnd,totalPointsUsed);
			    }
				
				$(this).drawSlider();
    		  }
			}
    	});
    });
    	

    $(document).on("change", "[id^=shippingmethodselect]", function(e) {
        e.stopImmediatePropagation();
        var index = new String($(this).attr('id')).split('shippingmethodselect')[1];
        var id = $("#orderline" + index).val();
        var method = $(this).val();

        if (id.length > 0 && method.length > 0) {
            $.post(paths.PATH + "/secure/checkout/shipping/method", {id: id, method: method, cg : csrfTokenValue},
            function(json) {
                if (json.status === "success") {
                    $.each(json.result, function(k, v) {
                        //console.log(k);
                        //console.log(v);
                        //$("#" + k).html(v);
                        $("[id^=\"" + k + "\"]").each(function() {
                            $(this).html(v);
                        });
                        if (k === 'mp-loyalty') {
                            $('#' + k).val(v);
                        }
                        displayShippingAndTax(k, v);
                    });
                    
                    var totalPointsToBeUsed = $('#mp-loyalty-dollars').val();
                    var totalPointsUsed = $('#mp-loyalty-value').val(); 
                    var sliderEnd = $('#sliderEnd').val();
                    var sliderStart = $('#sliderStart').val();
                    var displaySlider = $('#displayslider').val();
                    
                    if(totalPointsUsed && sliderEnd && sliderStart && displaySlider && displaySlider=="true") {
                 	   updateSlider(sliderStart,sliderEnd,totalPointsUsed);
                    }
                }
            }
            );
        }
    });
	
    $(document).on('click','[id^=addshippingbutton]',function(e) {
        e.preventDefault();
        var index = new String($(this).attr('id')).split('addshippingbutton')[1];
        var classType = $("#classType"+index).val();       
        $("#shiplineindex").val(index);
        $("#classTypeContent").val(classType);
        $("#addShippingModal").foundation("reveal", "open");
        $("#addShipping").find("input[type=text],input[type=tel]").val("");
        $("#addShipping label").removeClass("error");
        
    });   
    $('[data-slider]').on('change', Foundation.utils.throttle(function(e){
    	$(this).drawSlider();
    }, 1000, true));
    
    $.fn.drawSlider = function() {
        var displaySlider = $('#displayslider').val();
        
        if(displaySlider && displaySlider=="true") {
        
	    	var loyalty = $('#mp-loyalty-value').val();
	    	var selectedLoyalty = $('#totalNet').val();
	        var sliderEnd = $('#sliderEnd').val();
	        var sliderStart = $('#sliderStart').val();
	        var totalPointsToBeUsed = $('#mp-loyalty-dollars').val();
	        var sliderSelectedPoint = $(this).attr('data-slider');
	        var selectedDisplayPoints = 0;
	
	        if(sliderSelectedPoint) {
				selectedDisplayPoints = Math.floor(((sliderEnd-sliderStart)*sliderSelectedPoint/100)+Number(sliderStart));
	        } else {
	        	selectedDisplayPoints = Math.floor(((sliderEnd-sliderStart))+Number(sliderStart));
	        }
	        
	        if(loyalty && selectedLoyalty && sliderSelectedPoint &&
	        		Number(loyalty) == Number(selectedLoyalty) &&
	        		Number(sliderSelectedPoint) < 100 ) {
	        	sliderSelectedPoint = 100;
				$(this).attr('data-slider',100); 
	        }
	        
	        if(sliderSelectedPoint && sliderSelectedPoint==100 && loyalty) {
	        	selectedDisplayPoints = Number(loyalty);
	        }
			
			$('#mp-loyalty-value').val(loyalty);
	
	        $('#mixed-payment-cc').html(totalPointsToBeUsed);
	    	var ccVaule = $('<input type="hidden" id="ccVauleHidden" name="ccVauleHidden" value="'+totalPointsToBeUsed+'">');
	    	$('#mixed-payment-cc').append(ccVaule);
	    	
	    	$('#mixed-payment-points').html(localeString(loyalty));
	    	if(selectedLoyalty) {
	    		selectedLoyalty = selectedLoyalty.replace(/,/g,"");
	    		if($.isNumeric(selectedLoyalty)===true) {
	    			$('#mixed-payment-points').html(localeString(selectedLoyalty));
	    		}
	    	}
	
	        var sliderSelectedValue = $('<input type="hidden" id="sliderSelectedValue" name="sliderSelectedValue" value="'+ sliderSelectedPoint +'">');
	        $('#mixed-payment-points').append(sliderSelectedValue);
	    	var rewardsPointsValue = $('<input type="hidden" id="rewardsPointsHidden" name="rewardsPointsHidden" value="'+ selectedDisplayPoints +'">');
	    	 $('#mixed-payment-points').append(rewardsPointsValue);
			$('#availablePointsHidden').val(selectedDisplayPoints);
	        if (totalPointsToBeUsed > 0) {
	            $("[id^=cc-total-display]").each(function() {
	                $(this).show();
	            });
	            $("#creditcard-panel-toggle").show("slow");
	        } else {
	            $("[id^=cc-total-display]").each(function() {
	                $(this).hide();
	            });
	            $("#creditcard-panel-toggle").hide("slow");
	        }
	        
        	
        	$(this).reCalcCart();
    	}
    }
    
    $.fn.reCalcCart = function() {
    	var availablePoints =  $('#rewardsPointsHidden').val();
		var selectedSliderValue = $('#sliderSelectedValue').val();
		var currentTotalPointsToBeUsed = $('#mp-loyalty-dollars').val();
	    var currentTotalPointsUsed = $('#mp-loyalty-value').val(); 
    	$.ajax({
    		type : "GET",
    		url : "/trex/app/secure/checkout/slider",
    		data : {
    			availablePoints : availablePoints,
    		},
    		success : function(data) {
				
				if(data == "false"){
					if($('.alert-box:visible').length==0){
					   $('.alert-box').empty();
					   $('#alert-box-id').empty();
						$('#alert-box-id').css('display','block');
						$('#alert-box-id').append("Sorry, you do not have enough Reward Credits to complete this transaction due to one of the following reasons: <ul><li>Minimum Reward credit usage of 20% is required per product.</li> <li> Minimum of 100 Reward Credits must remain in your Reward Credit balance after any TR eCatalog redemption.</li></ul>");
					}
				} else {
				var tempContent = jQuery.parseJSON(data);
			    var totalPointsToBeUsed = tempContent.totalDollarsUsed;
			    var totalPointsUsed = tempContent.netPointsUsed;
			    
			    //$('#mp-loyalty').val(tempContent.netPointsUsed);
			    $('#mp-loyalty-dollars').val(tempContent.totalDollarsUsed.toFixed(2));
			    /*$('#mp-loyalty-value').val(tempContent.netPointsUsed);
			    $('#sliderStart').val(tempContent.startSliderPoints);
			    $('#sliderEnd').val(tempContent.endSliderPoints);*/
			    
				var formatNetPointsUsed = String(tempContent.netPointsUsed).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
				var formatTotalPointsUsed = String(tempContent.totalPointsUsed).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		    	$('#mixed-payment-points').html(formatNetPointsUsed);
		    	$('#mixed-payment-cc').html(tempContent.totalDollarsUsed.toFixed(2));
		    	$('#totalNet').empty();
		    	$('#totalNet-mobile').empty();
				$('#rewardsCreditsUsed').empty();
		    	$('#rewardsCreditsUsed-mobile').empty();
		    	$('#totalNetCC').empty();
		    	$('#totalNetCC-mobile').empty();
		    	$('#totalNet').html(formatNetPointsUsed);
		    	$('#totalNet-mobile').append(formatNetPointsUsed);
	    		$('#totalNetCC').html("$"+tempContent.totalDollarsUsed.toFixed(2));
	    		$('#totalNetCC-mobile').html("$"+tempContent.totalDollarsUsed.toFixed(2));
				$('#rewardsCreditsUsed').append(formatTotalPointsUsed);
		    	$('#rewardsCreditsUsed-mobile').append(formatTotalPointsUsed);
	            if (tempContent.totalDollarsUsed > 0) {
	                $("[id^=cc-total-display]").each(function() {
	                    $(this).show();
	                });
	                $("#creditcard-panel-toggle").show("slow");
	            } else {
	                $("[id^=cc-total-display]").each(function() {
	                    $(this).hide();
	                });
	                $("#creditcard-panel-toggle").hide("slow");
	            }
			 }
			}
    	});
	}

    var totalPointsToBeUsed = $('#mp-loyalty-dollars').val();
    var totalPointsUsed = $('#mp-loyalty-value').val(); 
    var sliderEnd = $('#sliderEnd').val();
    var sliderStart = $('#sliderStart').val();
    var displaySlider = $('#displayslider').val();
    
	if(totalPointsUsed && sliderEnd && sliderStart && displaySlider && displaySlider=="true") {
		updateSlider(sliderStart,sliderEnd,totalPointsUsed);
	}

});

function updateEmail() {
	
	var emailID = $.trim($('#billemail').val());
	 var errorMsgEmail = "Invalid Email Address";
	 
	if (emailID != null && emailID != "" ){
		
		var val = validateValidEmail(emailID);
		if (val == 'success') {
		 
			 $('#billemail-error').parent('label').removeClass("error");
		   
	   } else {
		   
		   $('#billemail-error').parent('label').addClass("error");
	       $('#billemail-error').html(errorMsgEmail);
	       $('#billemail').focus();
	   }
	}
}
function validateValidEmail(emailID) {
	
	var output = "";
	$.ajax({
		   type : "GET",
		   dataType :'text',
		   async:false,
		   contentType: 'application/text',
		   url : "checkout/validateEmail",
		   data : {
			  emailValue : emailID
		   },
		   success: function( data, textStatus, jQxhr ){
			  
			   output = data;
		    },
		    error: function( jqXhr, textStatus, errorThrown ){
		        console.log( errorThrown );
		    }
	   });
	
	return output;
}
function validatebillingForm() {

	var formSubmit = true;
	var billemail = $.trim($('#billemail').val());
    var billfirstname = $.trim($('#billfirstname').val());
    var billlastname = $.trim($('#billlastname').val());
    var billaddress1 = $.trim($('#billaddress1').val());
    var billcity = $.trim($('#billcity').val());
    var billzip = $.trim($('#billzip').val());
    var billphone = $.trim($('#billphone').val());
	var billstate = $.trim($('#billstate').val());
	var totalRetail = parseInt($("#totalRetail").text());
	
	/*var rewardCredits = parseInt($(".usertype > b").text().replace(/,/g , ""));
	var rewardserrorDiv = $('<div data-alert="" class="alert-box success radius">Sorry,you do not have enough Reward Credits to complete this transaction.</div>');*/
	  

    var errorMsg = "This field is required";
    var errorMsgEmail = "Invalid Email Address";
	var zipCode = "Please enter valid zip code";
	/*var noShipAddress = "Please select a shipping address"*/
    if (billemail == "") {
		$('#billemail-error').parent('label').addClass("error");
        $('#billemail-error').html(errorMsg);
        formSubmit = false;
    }
    else if(!(validateValidEmail(billemail)=='success')){
    	$('#billemail-error').parent('label').addClass("error");
        $('#billemail-error').html(errorMsgEmail);
        formSubmit = false;
    }
    if (billfirstname == "") {
		$('#billfirstname-error').parent('label').addClass("error");
        $('#billfirstname-error').html(errorMsg);
        formSubmit = false;
    }
    if (billlastname == "") {
		$('#billlastname-error').parent('label').addClass("error");
        $('#billlastname-error').html(errorMsg);
        formSubmit = false;
    }
    if (billaddress1 == "") {
		$('#billaddress1-error').parent('label').addClass("error");
        $('#billaddress1-error').html(errorMsg);
        formSubmit = false;
    }
    if (billcity == "") {
		$('#billcity-error').parent('label').addClass("error");
        $('#billcity-error').html(errorMsg);
        formSubmit = false;
    }
    if (billzip == "") {
		$('#billzip-error').parent('label').addClass("error");
        $('#billzip-error').html(errorMsg);
        formSubmit = false;
    } else {
		var billctry = $.trim($('#billctry').val());
		if(billctry=="US" && !usZipValidation(billzip)){
			$('#billzip-error').parent('label').addClass("error");
			$('#billzip-error').html(zipCode);
			formSubmit = false;
		}
    }
    if (billphone == "") {
		$('#billphone-error').parent('label').addClass("error");
        $('#billphone-error').html(errorMsg);
        formSubmit = false;

    }
	if (billstate == "") {
		$('#billstate-error').parent('label').addClass("error");
        $('#billstate-error').html(errorMsg);
        formSubmit = false;

    }
	if($("#creditcard-panel-toggle").css("display")=="block"){
        
        var paymentType = $("#paymenttype").val();
        var creditCardNumber = $.trim($("#paymentccnumber").val());
        var expiryMonth = $("#paymentccmonth").val();
        var expiryYear  = $("#paymentccyear").val();
        var cvvNumber = $.trim($("#paymentcccvv").val());
        
        if (paymentType == "") {
               $('#paymenttype-error').parent('label').addClass("error");
         $('#paymenttype-error').html(errorMsg);
         formSubmit = false;

     }
        if (creditCardNumber == "") {
               $('#paymentccnumber-error').parent('label').addClass("error");
         $('#paymentccnumber-error').html(errorMsg);
         formSubmit = false;

     }
        if (expiryMonth == "") {
               $('#paymentccmonth-error').parent('label').addClass("error");
         $('#paymentccmonth-error').html(errorMsg);
         formSubmit = false;

     }
        if (expiryYear == "") {
               $('#paymentccyear-error').parent('label').addClass("error");
         $('#paymentccyear-error').html(errorMsg);
         formSubmit = false;

     }
        if (cvvNumber == "") {
               $('#paymentcccvv-error').parent('label').addClass("error");
         $('#paymentcccvv-error').html(errorMsg);
         formSubmit = false;

     }
	
 }

	 if($("[id^=shippingselect]").length==0){
		$("#noShipAddress").css('display','block');
		$("html, body").animate({ scrollTop: 0 }, 500);
		formSubmit = false;
	 }
	
	/*if( rewardCredits < totalRetail ){
		$('.cart_header').append(rewardserrorDiv);
		formSubmit = false;
	}*/
    return formSubmit;
}

var elementIds = "#billfirstname,#billlastname,#billaddress1,#billzip,#billcity";
	$(elementIds).on('keypress', function (event) {
		var identifer=$(this).attr('id');
		var regex;
		if(identifer=="billcity" || identifer=="billfirstname" || identifer=="billlastname"){
			regex=/^[a-zA-Z\b ]+$/;
		}else{
			regex=/^[a-zA-Z0-9\b ]+$/;
		}
		var pattern = new RegExp(regex);
		var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		if ((key >= 35 && key <= 40)) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
			return;
	    }
		if (!regex.test(key)) {
			event.preventDefault();
			return false;
		}
	});
var productID_AddressMap = new Object();
function updateSlider(startPointRange, endPointRange, totalPointsUsed) {
    $(document).foundation({
        slider: {
        	start: 0,
            end: 100,
            step: 1
        }
    });
    
    //var selectedPoint = Math.floor((totalPointsUsed/endPointRange)*100);
    var selectedPoint = Math.floor((totalPointsUsed-startPointRange)/(endPointRange-startPointRange)*100);
    
    // get foundation to rebind
    $(document).foundation('slider','reflow');
    $('[data-slider]').foundation('slider', 'set_value', selectedPoint);
}

function displayShippingAndTax(k, v) {
    if (k === 'totalShippingAndHandling') {
        if (v != '0') {
            $('.totalShippingAndHandlingContainer').show();
        } else {
            $('.totalShippingAndHandlingContainer').hide();
        }
    }
    if (k === 'totalTax') {
        if (v != '0') {
            $('.totalTaxContainer').show();
        } else {
            $('.totalTaxContainer').hide();
        }
    }
}

function localeString(x, sep, grp) {
    var sx = (''+x).split(','), s = '', i, j;
    sep || (sep = ','); // default seperator
    grp || grp === 0 || (grp = 3); // default grouping
    i = sx[0].length;
    while (i > grp) {
        j = i - grp;
        s = sep + sx[0].slice(j, i) + s;
        i = j;
    }
    s = sx[0].slice(0, i) + s;
    sx[0] = s;
    return sx.join(',');
}

function loadCheckoutBody(cartJson,shippingAddressJson,shippingMethods,productCartDetailsJson){
	var tempContent = jQuery.parseJSON(cartJson);
	var cartLineItem = tempContent.extendedCartLineItem;
	
	var shippingMethods = jQuery.parseJSON(shippingMethods);	
	if(shippingAddressJson!="" && shippingAddressJson!=null)
	{	
		var shippingAddressJson = jQuery.parseJSON(shippingAddressJson);
	}
	
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
		
		var price = cartLineItem[i].price;
		var rollupId = cartLineItem[i].rollupId;
		var quantity = cartLineItem[i].quantity;
		var imageURL = cartLineItem[i].imageURL;
		var productURL = cartLineItem[i].productURL;
		var rollupId = cartLineItem[i].rollupId;
		totalPrice = totalPrice + price;
		tatalRewardsPoints = tatalRewardsPoints + pointValue*quantity;
		
		var onChangeSelectAddressArray = [];
		var lastAddressCountry;
		var lastAddressAddressState;
		var classType = "";
		var objDetailData = JSON.parse(productCartDetailsJson);
		
		for (var m in objDetailData){
			
			if(objDetailData[m].id == productId){
				classType = objDetailData[m].classType;
			}
			
		
		}
		
		if(shippingAddressJson && shippingAddressJson!="" && shippingAddressJson!=null) {
			
			var ShippingAddresses = shippingAddressJson.shippingAddress;
			var shippingAddresslenth = ShippingAddresses.length;
			
			for (var j in ShippingAddresses ){
				
				var ShippingAddress = ShippingAddresses[j];
				
				var id = ShippingAddress.id;
				var firstName = ShippingAddress.firstName;
				var lastName = ShippingAddress.lastName;
				var addressLine1 = ShippingAddress.addressLine1;
				var addressLine2 = ShippingAddress.addressLine2;
				var city = ShippingAddress.city;
				var state = ShippingAddress.state;
				var postalCode = ShippingAddress.postalCode;
				var country = ShippingAddress.country;
				
				if((shippingAddresslenth-1) == j){
					lastAddressCountry = ShippingAddress.country;
					lastAddressAddressState = ShippingAddress.state;
				}
				
				var email = ShippingAddress.email;
				var phoneNumber = ShippingAddress.phoneNumber;
				var mobilePhone = ShippingAddress.mobilePhone;
				var nickName =  ShippingAddress.nickName;
				var option=$('<option>');
				
				
			     
				if(nickName!= "" && nickName!=null)
				{
					option.attr('value',nickName).text(nickName);
					option.attr('nickName',nickName);
					
			    }else if(firstName!="" && firstName!=null && lastName!="" && lastName!=null)
			    {
			    	option.attr('value',firstName).text(firstName);
			    	option.attr('firstName',firstName);
			    	option.attr('value',lastName).text(lastName);
			    	option.attr('lastName',lastName);
			    }
				
				if((shippingAddresslenth-1) == j){
					var addressObj = new Object();
					addressObj["firstName"] = firstName;
					addressObj["lastName"] = lastName;
					addressObj["addressLine1"] = addressLine1;
					addressObj["addressLine2"] = addressLine2;
					addressObj["postalCode"] = postalCode;
					addressObj["state"] = state;
					addressObj["city"] = city;
					addressObj["country"] = country;
					addressObj["id"] = id;
					addressObj["email"] = email;
					addressObj["phoneNumber"] = phoneNumber;
					addressObj["mobilePhone"] = mobilePhone;
					productID_AddressMap[skuId] = addressObj;	
				}
				
				option.attr('shippingitmid',id);
				option.attr('value',addressLine1).text(nickName);
			    option.attr('shipaddress1',addressLine1);
				option.attr('firstName',firstName);
				option.attr('lastName',lastName);
				option.attr('shipaddress2',addressLine2);
				option.attr('shipzip',postalCode);
				option.attr('shipstate',state);
				option.attr('shipcity',city);			
				option.attr('country',country);
				option.attr('email',email);
				option.attr('phoneNumber',phoneNumber);
				option.attr('mobilePhone',mobilePhone);
				if((shippingAddresslenth-1) == j){
				
				option.attr('selected',true);
				}
				onChangeSelectAddressArray.push($(option));
				
			}
			
			var onChangeSelectAddress = $(' <select id="shippingselect'+i+'" class="radius selectshipping" > ').prepend(onChangeSelectAddressArray);
			
		}
		
		
		var obj = new Object();
		obj["classType"] = classType;
        obj["productId"] = skuId;
        obj["shippingMethods"] = shippingMethods;
		obj["quantity"] = quantity;
		obj["desc"] = itemDescription;
		obj["productId_actual"] = productId;
		
        var optionMethod = $('<option>');
				if(classType != "ECERT" && "US"== lastAddressCountry && ("AK"==lastAddressAddressState || "HI"==lastAddressAddressState || "GU"==lastAddressAddressState || "PR"==lastAddressAddressState))
				{	
				
				shippingMethodValue = shippingMethods.akhiprgushippingMethods;	
				shippingMethodValuereplaced = shippingMethodValue.replace(/X,XXX/g ,cartLineItem[i].totalShippingPoints);
				optionMethod.attr('value',shippingMethodValuereplaced).text(shippingMethodValuereplaced);
		
				}else if(classType != "ECERT" && ("US"== lastAddressCountry && "AK"!=lastAddressAddressState && "HI"!=lastAddressAddressState && "GU"!=state && "PR"!=lastAddressAddressState)){
			
				shippingMethodValue = shippingMethods.usshippingMethods;
				optionMethod.attr('value',shippingMethodValue).text(shippingMethodValue);
			
				}else if(classType != "ECERT" && "CA"== lastAddressCountry){
			
				shippingMethodValue = shippingMethods.canadaShippingMethods;
				shippingMethodValuereplaced = shippingMethodValue.replace(/X,XXX/g ,cartLineItem[i].totalShippingPoints);
				optionMethod.attr('value',shippingMethodValuereplaced).text(shippingMethodValuereplaced);
				
				}
				else if (classType != "ECERT"){
					shippingMethodValue = shippingMethods.usshippingMethods;
					optionMethod.attr('value',shippingMethodValue).text(shippingMethodValue);				
				}
		
        
		var tableRow = $('<tr id="checkoutTR'+i+'" style="vertical-align: top;">').data("skuId", obj);
        
		var imageTd = $(' <td class="hide-for-small-down" style="padding-left:2em">');
		var image = $('<img src="'+imageURL+'" width="150px"/>');
		var newline = "<br/>";
		
		var detailTd = $('<td class="td-detail">');
		
		var productname = $(' <div id="prodname'+i+'" class="prodname bold">').text(itemDescription);
		var itemNumber =  $('<div class="item hide-for-small-down">ITEM NUMBER: <span>'+productId+'</span></div>');
		var text;
		
		if(classType != "ECERT"){
			text = $('<div class="small-12 columns">').text("Select Shipping Address/Method:");
		}
		else{
			text = $('<div class="small-12 columns">').text("Select Shipping Address:");
		}
		
		var shippingAddressTextdiv = $('<div class="row collapse" style="margin-top: 1em;">').append(text);
		
		var onChangeDiv = $(' <div class="small-9 columns">  ').append(onChangeSelectAddress);
		
		var classTypeDiv = $('<input type="hidden" id="classType'+i+'" name="classType" value="'+classType+'">');
		
		var addText = $(' <a href="#" id="addshippingbutton'+i+'" class="button postfix addshipAddr">').text("Add").append(classTypeDiv);
		//var errorText =$('<small style="display:none;float:left;margin-left:3%;margin-top:0px" id="noShipAddress" class="error">');
		var addDiv = $('<div class="small-2 columns" style="float:left;">').append(addText);
		
		
		
		
		var shippingAddressDropdowntdiv = $(' <div class="row collapse"> ').append(onChangeDiv).append(addDiv);
		
		var shippingmethodselect = $(' <select id="shippingmethodselect'+i+'" class="radius shipmethod" > ').append(optionMethod);
		
		var shippingmethodDiv = $('<div class="small-12 columns">').append(shippingmethodselect); 
		
		var shippingmethodDropDownDiv = $(' <div class="row collapse"> ').append(shippingmethodDiv);
		
		var shippingDisplayInnerInDiv = $('<div id="shippingdisplay'+i+'" class="panel displayselect" style="padding: .25em;">');
		
		var shippingDisplayInnerDiv = $('<div class="small-12 columns">').append(shippingDisplayInnerInDiv);
			if (shippingAddressJson && shippingAddressJson!=null && shippingAddressJson!="") {
				
				
				shippingDisplayInnerInDiv.append(shippingAddressJson.shippingAddress[shippingAddresslenth-1].firstName).append("  ").append(shippingAddressJson.shippingAddress[shippingAddresslenth-1].lastName).append(newline);
				
		        if(shippingAddressJson.shippingAddress[shippingAddresslenth-1].email){
		        	shippingDisplayInnerInDiv.append(shippingAddressJson.shippingAddress[shippingAddresslenth-1].email).append(newline);
				}
				if(shippingAddressJson.shippingAddress[shippingAddresslenth-1].addressLine1){
					shippingDisplayInnerInDiv.append(shippingAddressJson.shippingAddress[shippingAddresslenth-1].addressLine1).append(newline);
				}
				if(shippingAddressJson.shippingAddress[shippingAddresslenth-1].addressLine2){
					shippingDisplayInnerInDiv.append(shippingAddressJson.shippingAddress[shippingAddresslenth-1].addressLine2).append(newline);
				}
				if(shippingAddressJson.shippingAddress[shippingAddresslenth-1].city){
					shippingDisplayInnerInDiv.append(shippingAddressJson.shippingAddress[shippingAddresslenth-1].city);
					if(shippingAddressJson.shippingAddress[shippingAddresslenth-1].state){
						shippingDisplayInnerInDiv.append(",");
					}
				}
				if(shippingAddressJson.shippingAddress[shippingAddresslenth-1].state){
					shippingDisplayInnerInDiv.append(state).append("  ");
				}
				if(shippingAddressJson.shippingAddress[shippingAddresslenth-1].postalCode){
					shippingDisplayInnerInDiv.append(shippingAddressJson.shippingAddress[shippingAddresslenth-1].postalCode).append("  ");
				}
				if(shippingAddressJson.shippingAddress[shippingAddresslenth-1].country){
					shippingDisplayInnerInDiv.append(shippingAddressJson.shippingAddress[shippingAddresslenth-1].country).append("  ");
				}
				
				/*shippingDisplayInnerInDiv
						.append(
								shippingAddressJson.shippingAddress[shippingAddresslenth-1].firstName)
						.append("  ")
						.append(shippingAddressJson.shippingAddress[shippingAddresslenth-1].lastName)
						.append(newline)
						.append(
								shippingAddressJson.shippingAddress[shippingAddresslenth-1].addressLine1)
						.append(newline)
						.append(
								shippingAddressJson.shippingAddress[shippingAddresslenth-1].addressLine2)
						.append(newline).append(
								shippingAddressJson.shippingAddress[shippingAddresslenth-1].city
										+ ",  ").append(
								shippingAddressJson.shippingAddress[shippingAddresslenth-1].state)
						.append("  ").append(postalCode).append("  ").append(
								shippingAddressJson.shippingAddress[shippingAddresslenth-1].country);*/
			}
		var shippingDisplayDiv = $('<div class="row collapse">').append(shippingDisplayInnerDiv);
		
		var priceTd = $('<td id="price'+i+'" class="show-for-medium">');
		var formatpointValue = String(pointValue).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		var priceDiv = $('<div>'+formatpointValue+'</div>');
		var qtyTd =$(' <td id="qty'+i+'" class="hide-for-small-down">');
		var qtyDiv = $('<div>'+quantity+'</div>');
		
		var totalTd=$('<td id="total'+i+'" class="hide-for-small-down">');
		var formatTotal = String(pointValue * quantity).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		var totalDiv = $('<div>'+ formatTotal +'</div>');
		
		var mobileImage = $('<div class="show-for-small-down"></div>');
		detailTd.append(mobileImage);
		mobileImage.append('<img style="width:75px;" src="'+imageURL+'" width="150px"/>');
		
		var mobileQuantity = $('<div style="padding-top:2em;color: #777777;" class="show-for-small-down">QTY: </div>');
		var quantitySpan = $('<span>'+quantity+' X '+pointValue+'</span>');
		mobileQuantity.append(quantitySpan);
		
		imageTd.append(image);
		tableRow.append(imageTd);
		
		detailTd.append(productname);
		detailTd.append(itemNumber);
		detailTd.append(mobileQuantity);
		
		detailTd.append(shippingAddressTextdiv);
		detailTd.append(shippingAddressDropdowntdiv);
		if(shippingAddresslenth>0 && classType != "ECERT"){
			detailTd.append(shippingmethodDropDownDiv);
		}
		
		detailTd.append(shippingDisplayDiv);
		
		tableRow.append(detailTd);
		
		priceTd.append(priceDiv);
		tableRow.append(priceTd);
		//TODO--- Add the shipping detail here 
		
		qtyTd.append(qtyDiv);
		tableRow.append(qtyTd);
		
		totalTd.append(totalDiv);
		tableRow.append(totalTd);
		
		$('#checkoutBody').append(tableRow);
		
	} 
	$("#productAddressMapPopup").val(JSON.stringify(productID_AddressMap));	
	
	var formatedTotalRewardsPoints = String(tatalRewardsPoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	$('#totalRetail').append(formatedTotalRewardsPoints);
	$('#totalRetailMobile').append(formatedTotalRewardsPoints);
	
	setCartTotals(tempContent);
}
}

function setCartTotals(tempContent) {
	var formatNetPointsUsed = String(tempContent.netPointsUsed).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	var formattotalPointsUsed = String(tempContent.totalPointsUsed).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	$('#totalNet').append(formatNetPointsUsed);
	$('#totalNet-mobile').append(formatNetPointsUsed);
	
	$('#rewardsCreditsUsed').empty();
	$('#rewardsCreditsUsed-mobile').empty();
	
	$('#rewardsCreditsUsed').append(formattotalPointsUsed);
	$('#rewardsCreditsUsed-mobile').append(formattotalPointsUsed);
	
	$('#totalNetCC').empty();
	$('#totalNetCC-mobile').empty();
	if(tempContent.totalDollarsUsed > 0){
		$('#totalNetCC').append("$"+tempContent.totalDollarsUsed.toFixed(2));
		$('#totalNetCC-mobile').append("$"+tempContent.totalDollarsUsed.toFixed(2));
	}
	else{
		
		$('#cc-total-display').css('display','none');
		$('#cc-total-display-mobile').css('display','none');
	}
	
	if((tempContent.totalShippingPoints !=null || tempContent.totalShippingPoints!="") && tempContent.totalShippingPoints>0){
		var formaTotalShippingPoints = String(tempContent.totalShippingPoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
					$(".totalShippingAndHandlingContainer").css('display','block');
					$('#totalShippingAndHandling').html(formaTotalShippingPoints);
					$('#totalShippingAndHandlingMobile').html(formaTotalShippingPoints);
	}else{
			$(".totalShippingAndHandlingContainer").css('display','none');
	}
	var mpoyalty = $('<input type="hidden" id="mp-loyalty" name="mp-loyalty" value="'+tempContent.netPointsUsed+'">');
	var mployaltydollars = $('<input type="hidden" id="mp-loyalty-dollars" name="mp-loyalty-dollars" value="'+tempContent.totalDollarsUsed.toFixed(2)+'">');
	var mployaltyvalue = $('<input type="hidden" id="mp-loyalty-value" name="mp-loyalty-value" value="'+tempContent.netPointsUsed+'"/>');
	var sliderStart = $('<input type="hidden" id="sliderStart" name="mp-loyalty-value" value="'+tempContent.startSliderPoints+'"/>');
	var sliderEnd = $('<input type="hidden" id="sliderEnd" name="mp-loyalty-value" value="'+tempContent.endSliderPoints+'"/>');
	
	$('#splitpaymentProperties').empty();
	$('#splitpaymentProperties').append(mpoyalty);
	$('#splitpaymentProperties').append(mployaltydollars);
	$('#splitpaymentProperties').append(mployaltyvalue);
	$('#splitpaymentProperties').append(sliderStart); 
	$('#splitpaymentProperties').append(sliderEnd);
	
	var displaySlider = $('#displayslider').val();
	if(displaySlider) {
		$('#displayslider').val(tempContent.displaySlider);
		//console.log($('#displayslider').val());
	} else {
		var displaySliderField = $('<input type="hidden" id="displayslider" name="displayslider" value="'+tempContent.displaySlider+'"/>');
		$('#splitpaymentProperties').append(displaySliderField);
	}
}
	
$(document).ready(function(){
	
	$("#billemail").keyup(function(e) {
	    var max = 80;
	    if ($(this).val().length > max) {
	        $(this).val($(this).val().substr(0, max));
	    }
	});
	
	$("#billfirstname,#billlastname,#billcity").keyup(function(e) {
	    var max = 30;
	    if ($(this).val().length > max) {
	        $(this).val($(this).val().substr(0, max));
	    }
	});
	
	$("#billaddress1,#billaddress2").keyup(function(e) {
	    var max = 50;
	    if ($(this).val().length > max) {
	        $(this).val($(this).val().substr(0, max));
	    }
	});
	
	/*$("#billphone").keyup(function(e) {
	    var max = 10;
	    if ($(this).val().length > max) {
	        $(this).val($(this).val().substr(0, max));
	    }
	});*/
	
	$("#billzip").keyup(function(e) {
	    var max = 12;
	    if ($(this).val().length > max) {
	        $(this).val($(this).val().substr(0, max));
	    }
	});
	
	var elementIds="#billfirstname,#billlastname,#billcity";
	$(elementIds).on('keypress', function (event) {
		var identifer=$(this).attr('id');
		var regex;
		if(identifer=="billfirstname" || identifer=="billlastname" || identifer=="billcity"){
			regex=/^[a-zA-Z ]+$/;
		}
		
		var pattern = new RegExp(regex);
		var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		/* if (key == 8 || (key >= 35 && key <= 40)) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
			return;
		} */
		if (!regex.test(key)) {
			event.preventDefault();
			return false;
		}
});
	
});

function emailValidation(str){
	
	var val = validateValidEmail(str);
	if (val == 'success') {
		return true;
	}
	return false
}

function updateProductMap(){		
	
	var updatedMap = $("#productAddressMap").val();
	productID_AddressMap = 	 jQuery.parseJSON(updatedMap);	
	
}

$(document).ready(function(){
	$('#billphone').mask('(999) 999-9999');
	$('#shipphone').mask('(999) 999-9999');
	
});

function usZipValidation(zipcode){
	var value = /\d{5}-\d{4}$|^\d{5}$|^\d{9}$/.test(zipcode)
	return value;
}

$('[data-slider]').on('click touchstart', function(event) {
	$('.alert-box').css('display','none');
})

