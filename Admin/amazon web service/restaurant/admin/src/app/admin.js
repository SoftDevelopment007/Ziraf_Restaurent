var baseUrl = "http://35.177.9.16:8080/admin/";
var adminUrl = "http://35.177.9.16:3000/";
// var baseUrl = "localhost:8080/admin/";
// var adminUrl = "localhost:3000/";
var validation = function() {
	var isValid = true;
	for(var i = 0; i < $(".form-control").length; i++) {
		if($(".form-control")[i].value == '') {	
			isValid = false;
			$(".form-group:nth-child(" + (i*2+1) + ")").addClass("has-error").removeClass("has-success");
		} else {
			$(".form-group:nth-child(" + (i*2+1) + ")").addClass("has-success").removeClass("has-error");
		}
	}
	return isValid;
};

$("#login").click(function() {
	var isValid = validation();
	if(isValid) {
		$.post(
            baseUrl + "login",
            {
                email: $("#email").val(),
                password: $("#pass").val()
            },
            function(data) {
                if(data.success) {
                	if(typeof(Storage) !== "undefined") {				        
				        localStorage.token = data.token;
				        window.open(adminUrl + "#/users", "_self", "", true);
				    } else {
				        Alert("Sorry, your browser does not support web storage...");
				    }
                } else {
                    $("#l-error").show().html('<strong>Oh snap!</strong> Admin info is invalid.');
                }
        });
	}
});

$("#c-error").hide().css({
	color: "#a94442"
});
$("#l-error").hide().css({
	'background-color': "#aa1111",
	'text-align': 'center'
});

$("#reset").click(function() {
	var isValid = validation();
	if($("#pass").val() == $("#passA").val()) {
		$("#c-error").hide();
	} else {
		isValid = false;
		$("#c-error").show();
	};

	if(isValid) {
		$.post(
            baseUrl + "reset",
            {
                oldEmail: $("#oEmail").val(),
                oldPassword: $("#oPass").val(),
                password: $("#pass").val(),
                email: $("#email").val()
            },
            function(data) {
                if(data.success) {
                    window.open(adminUrl + "auth.html", "_self", "", true);
                } else {
                    $("#l-error").show().html('<strong>Oh snap!</strong> Admin info is invalid.');
                }
        });
	}
});