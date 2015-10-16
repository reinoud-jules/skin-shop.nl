$(document).ready(function() {
	$("select#stars").change(function() {
		$("img#star_rating").attr("src", "img/ratings/png/" + $(this).val() + "-star.png");
	});
	
	$("form#review input[type='submit'").click(function(a) {
		var pass = true;
	});
	
	$("textarea#review").keyup(function() {
		var left = $(this).val().length - 50;
		if(left >= 0) {
			left += 50;
			left += "/500";
		}
		
		$("span#review_count").html(left);
	});
});