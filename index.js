var MyForm = {

	validate: function() { 

		var myObject = {
			isValid: true,
			errorFields: []
		};
		// myObject.errorFields.push('phone');
		// myObject.errorFields.push('email');

		function isValidFio (fio) {
			var regExp = /^[a-zа-я]+[\s\,]+[a-zа-я]+[\s\,]+[a-zа-я]+$/i;
        	return regExp.test(fio);
		}

		function isValidEmail(email) { 
			var regExp = /^[a-z][-.a-z0-9]+@((ya\.ru)|((yandex)\.(ru|ua|by|kz|com)))$/i;
	   		return regExp.test(email);
		}

		function isValidPhone(phone) {
		   	var regExp = /^\+7\([\d]{3}\)[\d]{3}-[\d]{2}\-[\d]{2}$/;

		   	if (!regExp.test(phone)) {
		   		return false;
		   	}

		    var sum = 0;
		    var maxSum = 30;
		    var symbols = phone.split('');
		    for (var i = 0; i < symbols.length; i++) {
		    	if (/\d/.test(symbols[i])) {
		    		sum += parseInt(symbols[i]);
		    	}
		    }
		    if (sum > maxSum) {
		    	return false;
		    } else {
		    	return true;
		    }
		}

        if (!isValidFio($('input[name=fio]').val())) {
        	myObject.isValid = false;
        	myObject.errorFields.push('fio');

        }
        if (!isValidEmail($('input[name=email]').val())) {
        	myObject.isValid = false;
        	myObject.errorFields.push('email');
        }
    	if (!isValidPhone( $('input[name=phone]').val())) {
    		myObject.isValid = false;
    		myObject.errorFields.push('phone');
    	}

		return myObject;	
	},

	getData: function() { 
		var dataForm = {
			fio: $('input[name=fio]').val(),
			email: $('input[name=email]').val(),
			phone: $('input[name=phone]').val(),
		};	
		return dataForm;
	},

	setData: function(object) { 
	  	if (object.fio) 
	  		$('input[name=fio]').val(object.fio);
	    if (object.email) 
	    	$('input[name=email]').val(object.email);
	    if (object.phone) 
	    	$('input[name=phone]').val(object.phone);
		return;
	},

	submit: function(event) { 
		event.preventDefault();
		var result = MyForm.validate();

		$('#myForm').find('input').removeClass('error');
		if (!result.isValid) {
			for (var i=0; i < result.errorFields.length; i++) {
				$('input[name='+result.errorFields[i]+']').addClass('error');
			}
			return;
		}

		function formEnable() {
			$('input').attr('disabled', false);
			$('#submitButton').attr('disabled', false);
		}
		function formDisable() {
			$('input').attr('disabled', true);
			$('#submitButton').attr('disabled', true);
		}

			// resultContainer

		function sendDataToServer() {
			formDisable();
			$('#resultContainer')
							.removeClass('success')
							.removeClass('progress')
							.removeClass('error');
		    $.get({
		    	url: $('#myForm').attr('action'),
		    	data: MyForm.getData(),
		    	success: function(server_response) {
		    		server_response = JSON.parse(server_response);
		    		if (server_response.status == 'success') {
		    			$('#resultContainer').addClass('success').text('Success').show();
		    			formEnable();
		    		} else if (server_response.status == 'error') {
		    			$('#resultContainer').addClass('error').text(server_response.reason).show();
		    			formEnable();
		    		} else if (server_response.status == 'progress') {
		    			$('#resultContainer').addClass('progress').text('progress');
		    			setTimeout(function(){
		    				sendDataToServer();
		    			}, parseInt(server_response.timeout));	
		    		}
		    		console.log(server_response);
		    	}
		    })
		}
		sendDataToServer();
	}
}	




$(document).ready(function(){
	$('#submitButton').on('click', MyForm.submit);	
})



// MyForm.setData({"fio":"Ernest Mihalovich Drunko","email":"drunkoololo@yandex.com","phone":"+7(912)310-21-11"})

