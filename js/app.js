$(document).ready( function() {
	$('.search__field__box').submit( function(event){
		showResults();
	});

	var showResults = function() {
		$('html, body').animate({
	         scrollTop: $("#results__title").offset().top
	    		}, 1000);
	}
});