function loadCheckoutBody(shippingAddressJson){
	
	if(shippingAddressJson!="" && shippingAddressJson!=null)
	{	
		var shippingAddressJson = jQuery.parseJSON(shippingAddressJson);
		loadShippingAddress(shippingAddressJson);
	}
}

function onChangeSelectedAddress(){
	
	var shipaddress1 = $('#shippingselect option:selected').attr('shipaddress1');
	var firstName = $('#shippingselect option:selected').attr('firstName');
	var lastName = $('#shippingselect option:selected').attr('lastName');
	var shipaddress2 = $('#shippingselect option:selected').attr('shipaddress2');
	var shipzip = $('#shippingselect option:selected').attr('shipzip');
	var shipstate = $('#shippingselect option:selected').attr('shipstate');
	var shipcity = $('#shippingselect option:selected').attr('shipcity');
	var country = $('#shippingselect option:selected').attr('country');
	var newline = "<br/>";
	
	$("#shippingdisplay").append(firstName).append("  ").append(lastName).append(newline).append(shipaddress1).append(newline).append(shipaddress2).append(newline).append(shipcity+",  ").append(shipstate).append("  ").append(shipzip).append("  ").append(country);
	
}


function loadShippingAddress(shippingAddressJson){
	//var primaryOption = $("#editShipAddress > option").clone();
	//$('#editShipAddress').empty();
	//$('#editShipAddress').append(primaryOption);
	
	if(shippingAddressJson) {
		var ShippingAddresses = shippingAddressJson.ShippingAddress;
		for (var i in ShippingAddresses ){
			var ShippingAddress = ShippingAddresses[i];
			//var id = ShippingAddress.id;
			var firstName = ShippingAddress.firstName;
			var lastName = ShippingAddress.lastName;
			var addressLine1 = ShippingAddress.addressLine1;
			var addressLine2 = ShippingAddress.addressLine2;
			var city = ShippingAddress.city;
			var state = ShippingAddress.state;
			var postalCode = ShippingAddress.postalCode;
			var country = ShippingAddress.country;
			var email = ShippingAddress.email;
			var phoneNumber = ShippingAddress.phoneNumber;
			var mobilePhone = ShippingAddress.mobilePhone;
			var nickName =  ShippingAddress.nickName;
			//var defaultAddress = false;
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
			
			option.attr('value',addressLine1).text(addressLine1);
			//option.attr('id',id);
			option.attr('shipaddress1',addressLine1);
			option.attr('firstName',firstName);
			option.attr('lastName',lastName);
			option.attr('shipaddress2',addressLine2);
			option.attr('shipzip',postalCode);
			option.attr('shipstate',state);
			option.attr('shipcity',city);			
			option.attr('country',country);
			//option.attr('email',email);
			//option.attr('phoneNumber',phoneNumber);
			//option.attr('mobilePhone',mobilePhone);	
			//option.attr('defaultAddress',defaultAddress);	
			//$('#selectedAddress,#editShipAddress').append(option);	
			$("#shippingselect").append(option);
		}
		//var addNew=$('<option>');
		//addNew.attr('value',"addnew").text("ADD NEW...");	     	
		//$('#editShipAddress').append(addNew);
		//$( "#shippingselect" ).find( 'option').eq(0).attr('selected','selected');
		
	}
}