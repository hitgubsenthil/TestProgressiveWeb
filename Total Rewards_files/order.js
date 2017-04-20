function renderOrderHistory(historyContents) {

	var orderInfoContents = historyContents["OrderInfo"];
	var rootLi=$(' <li class="featured-product-wrapper">');
	var trTd = "<tr> <td>";
	var tdTr = "</td> </tr>";
	var tdTd = "</td> <td>";
	var trTdClass = "<tr class='history'> <td>";
	var tdTdClass = "</td> <td class='hide-for-small-down'>";
	var tdTdStyClass = "</td> <td class='hide-for-small-down' style='whitespace:nowrap;'>";
	var histTable = "<thead>";
    var rMap = {
        'In Progress': 'Processing Order'
    };
	
	histTable += trTd + "ORDER DATE" + tdTd + "ORDER #";
	histTable += tdTdClass + "ITEMS IN ORDER" + tdTd + "STATUS";
	histTable += tdTdClass + "REWARD CREDITS" + tdTr +"</thead>";

	histTable += "<tbody class='ordr-table-tbody'>";
	$.each(orderInfoContents, function(index, orderInfoContent) {

		var dateFormat = formatDate(orderInfoContent.OrderIdDateTime);
	
		histTable += trTdClass + dateFormat;
		var HrefUrl =$("#pathValue").val();
		HrefUrl = HrefUrl + "?orderId="+orderInfoContent.OrderId;

		histTable += tdTd;
		histTable += "<a href="+HrefUrl+ "><span style='color: #FF651C'>";
		
		histTable += orderInfoContent.OrderId ;
		histTable += "</span></a>";
		histTable += tdTdStyClass + orderInfoContent.OrderItems;
		histTable += tdTd + dynamicReplace(orderInfoContent.OrderStatus, rMap);
		histTable += tdTdClass + " <p> Total Rewards: " + orderInfoContent.PointsUsed + "</p>" + tdTr;

	});
	histTable += "</tbody>";
	$('#ordr-table').html(histTable);
}

function formatDate(dte) {
	var dateFormat = dte.substring(4,6)+"/"+dte.substring(6,8)+"/"+dte.substring(0,4);
	return dateFormat;
}

function renderOrderStatus(statusContents, cnt, status) {
	var statusContent = jQuery.parseJSON(cnt)
	var cfmNo= "Confirmation number is: "+ statusContents.OrderInfo[0].OrderId;
	var addr = statusContents.OrderInfo[0].OrderShippingAddress[0];
	
	var startHd = "<thead class='hide-for-small-down'><tr><th width='150' class='hide-for-small'></th><th width='250'>ITEM/SHIPPING</th>" +
			"<th width='50' class='hide-for-small'>QTY</th>" +
			"<th width='80' class='hide-for-small'>TOTAL</th>" +
			"<th width='20' class='hide-for-small'></th>" +
			"</tr></thead>";
	var startBy = "<tbody>";
	var tbTr = "<tr style='vertical-align: top; border-bottom: none'>";
    var three= "</tr></tbody>";
    var closeTr= "</tr>";
    var closeBy= "</tbody>";
    var showFor = "<td class='show-for-medium'><div>";
    var divTd = "</div></td>";
    var hideFor = "<td class='hide-for-small-down'><div>";
    var imgTd="<td class='hide-for-small-down' style='padding-left:2em'>";
    var closeTd= "</td>";
    var itemTable = startHd+startBy;

    var it1 = "<td class='td-detail'>";
    var it1a = "<div class='prodname bold'>";

    var it2 = "</div><div class='item'>ITEM NUMBER: <span>";
    var it3 ="</span></div><div class='row collapse'><div class='small-12 columns'><div id='shippingdisplay' class='panel' style='padding: .25em;'></div>";
    var it4="</div></div>";
    var it5="<div class='row collapse bold'>Expected Ship Date: ";
    var collapseBold ="<div class='row collapse bold'>";
    var collapse ="<div class='row collapse'>";
    var it6 = "</div>";
    var totalPoints = 0;
    var totalDollars = 0;
    var totalTax = 0;
    var itemRow ="";
    
    $.each(statusContents.OrderInfo, function(statusIndex, orderInfoContent) {
    	
    	totalPoints += orderInfoContent.OrderPayment.PointAmount;
    	totalDollars += orderInfoContent.OrderPayment.DollarAmount;
    	totalTax += orderInfoContent.OrderPayment.TaxAmount;

    var i=0;
    $.each(orderInfoContent.OrderShippingAddress, function(orderindex, orderShippingAddressContent) {
        
        var shipMethod = "";
        
        var addressLines12 = orderShippingAddressContent.AddressLine1;
        
        var addressForLineItem = "";
        
        if(orderShippingAddressContent.AddressLine2) {
        	addressLines12 = addressLines12 +" "+ orderShippingAddressContent.AddressLine2;
        }
        
        var email = orderShippingAddressContent.Email;
    	/*var addressForLineItem= orderShippingAddressContent.FirstName+" "+orderShippingAddressContent.LastName + "<br />"
    	                        + addressLines12 + "<br />" + orderShippingAddressContent.AddressCity+", "
    	                        + orderShippingAddressContent.AddressState+" "+ orderShippingAddressContent.AddressPostalCode+" "+ orderShippingAddressContent.AddressCountry;
    	*/
    /*	var addressForLineItem = $(' <div id="shippingdisplayOrderStatus' + i
				+ '" class="panel" style="padding: .25em;">');*/
    	
    	var newline = "<br>";
    	
    	var addressForLineItem = addressForLineItem + orderShippingAddressContent.FirstName+" "+orderShippingAddressContent.LastName + newline;
    	
    	
    	//addressForLineItem.append(orderShippingAddressContent.FirstName).append("  ").append(orderShippingAddressContent.LastName).append(newline);
		
        if(email){
        	//addressForLineItem.append(email).append(newline);
        	addressForLineItem = addressForLineItem + email + newline;
        }
		if(orderShippingAddressContent.AddressLine1){
			//addressForLineItem.append(orderShippingAddressContent.AddressLine1).append(newline);
			addressForLineItem = addressForLineItem + orderShippingAddressContent.AddressLine1 + newline;
		}
		if(orderShippingAddressContent.AddressLine2){
			//addressForLineItem.append(orderShippingAddressContent.AddressLine2).append(newline);
			addressForLineItem = addressForLineItem + orderShippingAddressContent.AddressLine2 + newline;
		}
		if(orderShippingAddressContent.AddressCity){
			addressForLineItem = addressForLineItem + orderShippingAddressContent.AddressCity;
			if(orderShippingAddressContent.AddressState){
				addressForLineItem = addressForLineItem + ",";
			}
		}
		if(orderShippingAddressContent.AddressState){
			//addressForLineItem.append(orderShippingAddressContent.AddressState).append("  ");
			addressForLineItem = addressForLineItem + orderShippingAddressContent.AddressState + "  ";
		}
		if(orderShippingAddressContent.AddressPostalCode){
			//addressForLineItem.append(orderShippingAddressContent.AddressPostalCode).append("  ");
			addressForLineItem = addressForLineItem + orderShippingAddressContent.AddressPostalCode + "  ";
		}
		if(orderShippingAddressContent.AddressCountry){
			//addressForLineItem.append(orderShippingAddressContent.AddressCountry).append("  ");
			addressForLineItem = addressForLineItem + orderShippingAddressContent.AddressCountry + "  ";
		}
        
    	
    	if(orderShippingAddressContent.ShipMethod){
    		shipMethod = orderShippingAddressContent.ShipMethod;
    	}
    	var i=0;
    	 $.each(orderShippingAddressContent.OrderLineInfo, function(orderShippingIndex, orderLineInfoContent) {
    		 
    		    var value1 = orderLineInfoContent.OrderItemInfo.ProductDescription;
    		    var value2 = orderLineInfoContent.OrderItemInfo.ProductId;
    		    var classType = orderLineInfoContent.OrderItemInfo.ProductClassCode;
    		    var itemImg = "";
    		    var mobileQty = "";
    	        var itemPoint= 0;
    	        var itemPrice= 0;
    	        var itemQty=0;
    	        var itemTotal=0;
    	        var shipAndTrack ="";
    	        var itemDesc = "";
    		    var mobilImg = "<div class='show-for-small-down'></div>";
    	    	if(orderLineInfoContent.OrderItemInfo.ImageUrl){
    	    		itemImg = "<img src=" +orderLineInfoContent.OrderItemInfo.ImageUrl+" width='150px'>";
    	    		mobilImg = "<div class='show-for-small-down'><img src=" +orderLineInfoContent.OrderItemInfo.ImageUrl+"  width='75px'></div>";
    	    	}
    	    	//totalPoints += orderLineInfoContent.OrderQuantity * orderLineInfoContent.OrderLinePaymentInfo.PointAmount;
    		    itemQty = orderLineInfoContent.OrderQuantity;
    		    itemPrice = orderLineInfoContent.OrderLinePaymentInfo.PointAmount;
    		    var formatedItemPrice = String(itemPrice).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    		    itemTotal = orderLineInfoContent.OrderLinePaymentInfo.PointAmount;
    		    var formatedItemTotal = String(itemTotal).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    		    mobileQty = itemQty +"  TOTAL: "+ (formatedItemTotal);
    		   // if(orderLineInfoContent.OrderLinePaymentInfo.DollarAmount != 0){
    		   // 	itemTotal = "$"+ orderLineInfoContent.OrderLinePaymentInfo.DollarAmount;
    		    //	itemPrice = (orderLineInfoContent.OrderLinePaymentInfo.DollarAmount)/itemQty;
    		    	//itemPrice = "$" + itemPrice.toFixed(2);
    		    	//mobileQty = itemQty +" x "+ (((orderLineInfoContent.OrderLinePaymentInfo.DollarAmount)/itemQty).toFixed(2));
    		    //}else if(orderLineInfoContent.OrderLinePaymentInfo.PointAmount != 0){
    		    	//itemTotal = orderLineInfoContent.OrderLinePaymentInfo.Poi	ntAmount;
    		    	//itemPrice = (orderLineInfoContent.OrderLinePaymentInfo.PointAmount)/itemQty;
    		    	//itemPrice = itemPrice.toFixed(2);
    		    	//itemPrice = "";
    		    	//mobileQty = itemQty +" x "+ (((orderLineInfoContent.OrderLinePaymentInfo.PointAmount)/itemQty).toFixed(2));
    		    //}
    		    if($.trim(mobileQty) !== ""){
    		    	mobileQty = "</span></div><div class='show-for-small' style='padding-top: 2em; color: #777777;'>QTY: <span>"+ mobileQty; 
    		    }
    		    
    		    var shipAndTrackCollection1 ="";
    		    var shipAndTrackCollection2 ="";
    		    var redemptionId = "";
    		    var shippmentDate = "";
    		    $.each(orderLineInfoContent.OrderLineOccurrenceInfo, function(occurrenceIndex, orderLineOccurrenceInfoContent) {
    		    	
    		    	moment.tz.add('America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0');
    		    	redemptionId = orderLineOccurrenceInfoContent.OrderLineOccurrenceId;
		    		if($.trim(shipAndTrackCollection1) == "") {
		    			
		    			shipAndTrackCollection1 += collapseBold;
		    			
		    			if(orderLineOccurrenceInfoContent.OrderActionInfo) {
	    		    		$.each(orderLineOccurrenceInfoContent.OrderActionInfo, function(actionIndex, orderActionInfoContent) {
	        		    		if(orderActionInfoContent.Action && $.trim(orderActionInfoContent.Action) != "" && $.trim(orderActionInfoContent.Action)=='SHP' &&
	        		    				orderActionInfoContent.ActionDateTime && $.trim(orderActionInfoContent.ActionDateTime) != "") {
	        		    			
	        		    			//var shipDate = moment($.trim(orderActionInfoContent.ActionDateTime), 'YYYYMMDDHHmmss-Z').format('ddd MMM DD HH:mm:ss');
	        		    			//var shipYear = moment($.trim(orderActionInfoContent.ActionDateTime), 'YYYYMMDDHHmmss-Z').format('YYYY');
	        		    			//var tzone = moment($.trim(orderActionInfoContent.ActionDateTime), 'YYYYMMDDHHmmss-Z').tz('America/New_York').format('z');
	        		    			//var shippmentDate = shipDate+' '+tzone+' '+shipYear;
	        		    			shippmentDate = moment($.trim(orderActionInfoContent.ActionDateTime), 'YYYYMMDDHHmmss-Z').format('ddd DD MMM YYYY');
	        		    			
	        		    			if(shippmentDate && $.trim(shippmentDate) != "") {
	        		    				shipAndTrackCollection1 += "Shipped: " + $.trim(shippmentDate);
	    		    				}
	    		    			}
	    		    		});
	    		    	}

	    		    	if(orderLineOccurrenceInfoContent.OrderShippingInfo) {

			    			if(orderLineOccurrenceInfoContent.OrderShippingInfo.CarrierTrackingNumber && $.trim(orderLineOccurrenceInfoContent.OrderShippingInfo.CarrierTrackingNumber) != "") {
			    				shipAndTrackCollection1 += "  <br/> Tracking Number: "+ $.trim(orderLineOccurrenceInfoContent.OrderShippingInfo.CarrierTrackingNumber);
		        		    }
			    			
    		    			if(orderLineOccurrenceInfoContent.OrderShippingInfo.Carrier && $.trim(orderLineOccurrenceInfoContent.OrderShippingInfo.Carrier) != "") {
			    				shipAndTrackCollection1 += "  <br/>" + $.trim(orderLineOccurrenceInfoContent.OrderShippingInfo.Carrier);
			    			}
	    		    	}
		    			
	    		    	if(orderLineOccurrenceInfoContent.OrderActionInfo || orderLineOccurrenceInfoContent.OrderShippingInfo) {
	    		    		shipAndTrackCollection1 += it6;		    			
	    		    		shipAndTrack += shipAndTrackCollection1;
	    		    	}
		    		} else {
		    			
		    			shipAndTrackCollection2 += collapseBold;
		    			
		    			if(orderLineOccurrenceInfoContent.OrderActionInfo) {
	    		    		$.each(orderLineOccurrenceInfoContent.OrderActionInfo, function(actionIndex, orderActionInfoContent) {
	        		    		if(orderActionInfoContent.Action && $.trim(orderActionInfoContent.Action) != "" && $.trim(orderActionInfoContent.Action)=='SHP' &&
	        		    				orderActionInfoContent.ActionDateTime && $.trim(orderActionInfoContent.ActionDateTime) != "") {
	        		    			
	        		    			//var shipDate = moment($.trim(orderActionInfoContent.ActionDateTime), 'YYYYMMDDHHmmss-Z').format('ddd MMM DD HH:mm:ss');
	        		    			//var shipYear = moment($.trim(orderActionInfoContent.ActionDateTime), 'YYYYMMDDHHmmss-Z').format('YYYY');
	        		    			//var tzone = moment($.trim(orderActionInfoContent.ActionDateTime), 'YYYYMMDDHHmmss-Z').tz('America/New_York').format('z');
	        		    			//var shippmentDate = shipDate+' '+tzone+' '+shipYear;
	        		    			shippmentDate = moment($.trim(orderActionInfoContent.ActionDateTime), 'YYYYMMDDHHmmss-Z').format('ddd DD MMM YYYY');
	        		    			
	        		    			if(shippmentDate && $.trim(shippmentDate) != "") {
	        		    				shipAndTrackCollection2 += "Shipped: " + $.trim(shippmentDate);
	    		    				}
	    		    			}
	    		    		});
	    		    	}
		    			
		    			if(orderLineOccurrenceInfoContent.OrderShippingInfo) {
		    			
    		    			if(orderLineOccurrenceInfoContent.OrderShippingInfo.CarrierTrackingNumber && $.trim(orderLineOccurrenceInfoContent.OrderShippingInfo.CarrierTrackingNumber) != "") {
    		    				shipAndTrackCollection2 += "  <br/> Tracking Number: "+ $.trim(orderLineOccurrenceInfoContent.OrderShippingInfo.CarrierTrackingNumber);
    	        		    }
    		    			
    		    			if(orderLineOccurrenceInfoContent.OrderShippingInfo.Carrier && $.trim(orderLineOccurrenceInfoContent.OrderShippingInfo.Carrier) != "") {
    		    				shipAndTrackCollection2 += "  <br/>" + $.trim(orderLineOccurrenceInfoContent.OrderShippingInfo.Carrier);
    		    			}    		    			    		    			
	    		    	}
		    			
		    			if(orderLineOccurrenceInfoContent.OrderActionInfo || orderLineOccurrenceInfoContent.OrderShippingInfo) {
    		    			shipAndTrackCollection2 += it6;
    		    			
    		    			if(shipAndTrackCollection1 != shipAndTrackCollection2) {
    		    				shipAndTrack += " <br/> " + shipAndTrackCollection2;
    		    			}
    		    			shipAndTrackCollection1 = shipAndTrackCollection2;		    			
	    		    	}
		    		}
    		    	
    		    });
    		   var resend;
    		   var resendMobile;
    		   if(classType == "ECERT" && shippmentDate){
    			   resend = "<input type='button' id='resendpopup"+i+"' class='button postfix resendpopup' value='Resend'>";  
    			   resendMobile = "<div class='show-for-small'><input type='button'id='resendpopup"+i+"' class='button small' value='Resend'></div>";
    		   }
    		   else{
    			   resend = "<input type='hidden' id='resendpopup"+i+"' value='Resend'>"; 
    			   resendMobile = "<div><input type='hidden' id='resendpopup"+i+"' value='Resend'></div>";
    		   }
    		    // var resendSubmit = "<input type='button' id='resendsubmit' class='button postfix resendsubmit' value='Resend'>";   
    		    // var closepopup = "<a href='close' class='close-reveal-modal'></a>";
    		    var emailHidden = "<input type='hidden' id='emailid"+i+"' value='"+email+"'>";
    		    var productDescriptionHidden = "<input type='hidden' id='prodDesc"+i+"' value='"+value1+"'>";
    		    var productIdHidden = "<input type='hidden' id='prodId"+i+"' value='"+value2+"'>";
    		    var redemptionIdHidden = "<input type='hidden' id='redemptionId"+i+"' value='"+redemptionId+"'>";
    		    
    		   
    		    $(document).on('click','[id^=resendpopup]',function(e) {
    		        e.preventDefault();
    		        var index = new String($(this).attr('id')).split('resendpopup')[1]; 
    		        var emailId = $("#emailid"+index).val();   
    		        var prodDesc = $("#prodDesc"+index).val();   
    		        var prodId = $("#prodId"+index).val(); 
    		        var redemptionNumber = $("#redemptionId"+index).val();     		       
    		        var itemMessage = "<span style='font-size: 0.8em;'>This item was orginally sent to: </span>";
    		        var prodDescDiv = "<div class='prodname bold' style='font-size: 0.9em;'>"+prodDesc+"</div>";
    		        var itemNumberDiv = "<div class='item' style='font-size: .70em;padding-bottom: 5px;'>ITEM NUMBER: <span> "+prodId+" </span></div>";
    		        
    		        var firstName = orderShippingAddressContent.FirstName;
    		        var lastName = orderShippingAddressContent.LastName;    		   
    		        var addressDiv = "<div style='padding: .60em;'>" + "<span class='bold' style='font-size: 0.8em;'>" + firstName + "  " + lastName +" </span> <br><br> <span style='font-size: 0.75em;'>eMail: </span> <span class='bold' style='font-size: 0.8em;'>" + emailId + "</span></div>";
    		        var redemptionInput = "<input type='hidden' id='redemptionId' value='"+redemptionNumber+"'>";
    		        var oldEmailId = "<input type='hidden' id='oldEmailId' value='"+emailId+"'>";
    		        $('#prodDiv').empty();    		       
    		        $('#closepopup').empty(); 
    		        //$("#errorMessage").empty();
    				$('#message-id').empty();
    		        $("#resendModal").foundation("reveal", "open");    		        
    		        $('#prodDiv').append(prodDescDiv).append(itemNumberDiv).append(itemMessage).append(addressDiv).append(redemptionInput).append(oldEmailId);  
   		        
    		        $("#resendEmail").find("input[type=text],input[type=email]").val("");
    		        $("#resendEmail label").removeClass("error");
    		        
    		    });  
    		    
    		    //var resend = $('<a href="#" id="resend'+i+'" class="button postfix resend">').text("Resend");
    		    itemDesc = it1+mobilImg+it1a+  value1 + it2 + value2 + mobileQty +it3 + addressForLineItem + resendMobile + it4 + shipAndTrack + it6 +closeTd;
    		    itemRow += tbTr+imgTd+itemImg +closeTd + itemDesc +divTd+hideFor+itemQty+divTd+hideFor+formatedItemTotal +divTd+hideFor+resend+divTd+ emailHidden + productDescriptionHidden+ productIdHidden+redemptionIdHidden +closeTr;
    		    i += 1;
    	 });
    	
    });
    
    });
    
    itemTable += itemRow+closeBy;
    
	
	var openDiv1="<div class='row right' style='margin-right:5em;'> <div class='small-12 columns inner'>";
	
	var openDiv2="<div class='row'>";
	var openDiv3="<div class='small-10 bold text-right content-text '>";
	var openDiv ="<div>";
	var closeDiv="</div>"; 
	var dbCloseDiv="</div></div>"; 
	var spanDiv="</span></div>"; 
	var prodDiv="<div id='totalRetail' class='small-2 columns content-result'>";
	var addDiv="<div id='totalShippingAndHandling' class='small-2 columns content-result'>";
	var taxDiv="<div id='totalTax' class='small-2 columns content-result'>";
	var totalDiv="<div id='totalNet' class='small-2 columns content-result'>";
	var totalSpan="<span class='small-2 content-result'>";

	var formatedTotalPoints = String(totalPoints).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	var point = openDiv1;
	point += openDiv2+openDiv3+"TOTAL POINTS:"+" "+totalSpan+formatedTotalPoints+closeDiv+spanDiv;
	point += dbCloseDiv;
	
	var paymt = "<div><h4>PAYMENT METHODS</h3></div><br /><div><span style='font-weight: bold;'>Total Rewards :  </span>"+formatedTotalPoints+"</div><br/>"
	               + "<div><span style='font-weight: bold;'>Credit Card :  $</span>"+totalDollars+"</div><br/>"
	               + "<div><span style='font-weight: bold;'>Tax :  $</span>"+totalTax+"</div><br/>";

	
	/* var st1= "<div class='panel'> <div> <h4>BILLING INFORMATION</h3> </div> <div> <dl>  <dt>  Total Rewards  </dt> <dd>";
	var st2= addr.FirstName+" "+addr.LastName + "<br />" + addr.AddressLine1 + "<br />" + addr.AddressCity+", "+ addr.AddressState+" "+addr.AddressCountry+" "+ addr.AddressPostalCode;
	var st3= "</dd> </dl> </div> </div>";
	var statusAddress= st1 +st2+st3; */
	
	
	$('#confirm_no').html(cfmNo);
	$('#ordr-table').html(itemTable);
	$('#panel-total').html(point);
	$('#pay_total').html(paymt);
	//$('#addr_div').html(statusAddress);	

	$(document).ready(function() {
	$("#resendEmail").submit(function(e) {	 
		    e.preventDefault();
		    var oldEmailId = $("#oldEmailId").val();  
		  	var emailId = $("#newEmailId").val();   
	        var confirmEmailId = $("#confirmEmailId").val(); 
	        var redemptionId = $("#redemptionId").val(); 
	        var invalidEmailMsg = "Invalid email id";
	        var validEmail = true; 
	       
	        $('#newEmail-error').empty();
	        $('#confirm-error').empty();
	        
	        if (emailId != "" && !emailValidation(emailId)) {
    			$('#newEmail-error').parent('label').addClass("error");
    	        $('#newEmail-error').html(invalidEmailMsg);    	 
    	        validEmail = false;
    	    }
	        
	        if (confirmEmailId != "" && !emailValidation(confirmEmailId)) {
    			$('#confirm-error').parent('label').addClass("error");
    	        $('#confirm-error').html(invalidEmailMsg); 
    	        validEmail = false;
    	    }
	        
	        if (validEmail && (emailId != confirmEmailId)) {
	        	$('#confirm-error').parent('label').addClass("error");
	        	$('#confirm-error').html("Confirmation email address does not match"); 
	        	validEmail = false;
	        }
	        
	        if (!emailId && !confirmEmailId){
	        	emailId = oldEmailId;
	        }
	        
	        if(validEmail){
	        	$("#resendEmail img.ajax").show();
	            $.post("/trex/app/service/message/resend", {redemptionId: redemptionId, emailId: emailId, cg : csrfTokenValue }, function(response) {
	                        if (response === "success") {	                        	
	    						
	                        	 $("#resendModal").foundation("reveal", "close");
	    						
	                        } else if (response === "fail") {	    						
	                        	/*//$("#errorMessage").empty();
	    						$('#message-id').empty();
	    						$('#message-id').css('display','block');	    						
	    						$('#message-id').append("Sorry, Unable to send eGift message now, Please try later.");*/	    						
	    						
	                        } else {
	                        	
	                        	
	                        }
	                    }
	            );}	
	        
	        $(document).ajaxStop(function() {
	            $("#resendEmail img.ajax").hide();
	        });
	        
	 }); 
	
	
	 $(document).on('click','[id=closeLink]',function(e) {
	        e.preventDefault();
	        $("#resendModal").foundation("reveal", "close"); 
	 
	 });
	
	 
	 
	 });
		
	  
}