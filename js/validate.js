$(document).ready(function() {
	/* ===================================== */
	/* >>>>>>>> GENERAL VALIDATION on KEYUP EVENT
	/* ===================================== */
	
	$("form.validate input, form.validate textarea").keyup(function() {
		if($(this).hasClass("required")) {
			validate_form_field($(this));
		} else {
			val_string($(this).val(), 0, $(this));
		}
	});
	
	$("form.validate input[type='text']:not(.no_validation), form.validate textarea").focusout(function() {
		if($(this).hasClass("required")) {
			validate_form_field($(this));
		} else {
			val_string($(this).val(), 0, $(this));
		}
	});
	
	/* ===================================== */
	/* >>>>>>>> CHECKOUT 1 VALIDATION
	/* ===================================== */
	
	$("form.validate#checkout_1 input[type='submit']").click(function(a) {
		var pass = true;
		
		
		// Checks all form fields, AND the fields for billing address, IF it's different from the shipping address.
		$("form.validate#checkout_1 div#bezorgadres input[type='text'].required, form.validate#checkout_1 div#factuuradres.show input[type='text'].required").each(function() {
			var success = validate_form_field($(this));
			if(!success) {
				pass = false;
			}
		});

		
		if(!pass) {
			a.preventDefault();
			alert("Niet alle velden zijn correct ingevuld. Controleer de rood-omlijnde velden.");
		}
	});
	
	/* ===================================== */
	/* >>>>>>>> CHECKOUT 2 VALIDATION
	/* ===================================== */
	
	$("form.validate#checkout_2 input[type='submit']").click(function(a) {
		var pass = true;
		
		var method_selected = false;
		// check radio buttons:
		$("input[name='method']").each(function() {
			if($(this).prop("checked")) {
				method_selected = true;
			}
		});
		
		if(!method_selected) {
			pass = false;
			$("div#method label").addClass("error");
		} else {
			$("div#method label").removeClass("error");
		}
		
		if($("div#ideal_bank:not(.hidden) select").val() == 0) {
			pass = false;
			$("div#ideal_bank:not(.hidden)").addClass("error");
		} else {
			$("div#ideal_bank:not(.hidden)").removeClass("error");
		}
		
		
		
		if(!pass) {
			a.preventDefault();
			alert("Niet alle velden zijn correct ingevuld. Controleer de rood-omlijnde velden.");
		}
		
	});
	
	/* ===================================== */
	/* >>>>>>>> REVIEW & QUESTION FORMS
	/* ===================================== */
	
	$("form.validate#review input[type='submit'], form.validate#question input[type='submit']").click(function(a) {
		var pass = true;
		console.log("WHeel");
		
		$("form.validate input[type='text'].required, form.validate textarea").each(function() {
			var success = validate_form_field($(this));
			if(!success) {
				pass = false;
			}
		});
		
		if(!pass) {
			a.preventDefault();
			alert("Niet alle velden zijn correct ingevuld. Controleer de rood-omlijnde velden.");
		}
	});
	
});

function validate_form_field($tar) {
	var val = $tar.val();
	var format = $tar.attr("data-format");
	var ret;
	switch(format) {
		case "string" :
			ret = val_string(val, 1, $tar);
			break;
		case "street" :
			ret = val_string(val, 2, $tar);
			break;
		case "zip" :
			ret = val_zip(val, $tar);
			break;
		case "phone" :
			ret = val_phone(val, $tar);
			break;
		case "email" :
			ret = val_email(val, $tar);
			break;
		case "city" :
			ret = val_city(val, $tar);
			break;
		case "name" :
			ret = val_string(val, 2, $tar);
			break;
		case "address_number" :
			ret = val_address(val, $tar);
			break;
		case "phone" :
			ret = val_phone(val, $tar);
			break;
		case "country" :
			ret = val_string(val, 3, $tar); 
			break;
		case "password" :
			ret = val_password(val, $tar, false);
			break;
		case "password_check" :
			ret = val_password(val, $tar, true);
			break;
		case "title" :
			ret = val_title(val, $tar);
			break;
		case "review" :
			ret = val_review(val, $tar);
			break;
		default :
			console.log("No datatype for form validation supplied.");
			ret = true;
			break;
	}
	
	return ret;
}

function val_password(val, $tar, check) {
	var reg = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{5,}$/;
	if(!reg.test(val)) {
		$tar.addClass("error").removeClass("success");
		$tar.parent().addClass("error");
		return false;
	} else {
		if(!check) {
			$tar.removeClass("error").addClass("success");
			$tar.parent().removeClass("error");
			return true;
		} else {
			if(val == $("input#password_original").val()) {
				$tar.removeClass("error").addClass("success");
				$tar.parent().removeClass("error");
				return true;
			} else {
				$tar.addClass("error").removeClass("success");
				$tar.parent().addClass("error");
				return false;
			}
		}
	}
	
}

function val_title(val, $tar) {
	if(val.length < 15) {
		$tar.addClass("error").removeClass("success");
		$tar.parent().addClass("error");
		return false;
	} else {
		$tar.removeClass("error").addClass("success");
		$tar.parent().removeClass("error");
	}
	return true;
}

function val_review(val, $tar) {
	if(val.length < 50 || val.length > 500) {
		$tar.addClass("error").removeClass("success");
		$tar.parent().addClass("error");
		return false;
	} else {
		$tar.removeClass("error").addClass("success");
		$tar.parent().removeClass("error");
	}
	return true;
}

function val_string(val, length, $tar) {
	var reg = /^[a-zA-Z\s]*$/;
	if(val.length < length || !reg.test(val)) {
		$tar.addClass("error").removeClass("success");
		$tar.parent().addClass("error");
		return false;
	} else {
		$tar.removeClass("error").addClass("success");
		$tar.parent().removeClass("error");
	}
	return true;
}

function val_zip(val, $tar) {
	var reg = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i;
	if(!reg.test(val)) {
		$tar.addClass("error").removeClass("success");
		$tar.parent().addClass("error");
		return false;
	} else {
		$tar.removeClass("error").addClass("success");
		$tar.parent().removeClass("error");
	}
	return true;
}

function val_city(val, $tar) {
	if(val.length < 2) {
		$tar.addClass("error").removeClass("success");
		$tar.parent().addClass("error");
		return false;
	} else {
		$tar.removeClass("error").addClass("success");
		$tar.parent().removeClass("error");
	}
	return true;
}

function val_phone(val, $tar) {
	var reg = /^[0-9]{10}$/;
	if(!reg.test(val)) {
	    $tar.addClass("error").removeClass("success");
	    $tar.parent().addClass("error");
	    return false;
	} else {
		$tar.removeClass("error").addClass("success");
		$tar.parent().removeClass("error");
	}
	return true;
}

function val_email(val, $tar) {
	var reg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if(!reg.test(val)) {
	    $tar.addClass("error").removeClass("success");
	    $tar.parent().addClass("error");
	    return false;
	} else {
		$tar.removeClass("error").addClass("success");
		$tar.parent().removeClass("error");
	}
	return true;
}

function val_address(val, $tar) {
	var reg = /^\d+$/;
	if(!reg.test(val)) {
		$tar.addClass("error").removeClass("success");
		$tar.parent().addClass("error");
		return false;
	} else {
		$tar.removeClass("error").addClass("success");
		$tar.parent().removeClass("error");
	}
	return true;
}

