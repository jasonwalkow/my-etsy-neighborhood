$(document).ready( function() {
	$('.results').hide();
	$('#map').hide();
	$('.search__field__box').submit( function(event){
		$('.map-placeholder').hide();
		$('#map').show();
        $('.results__boxes').html("");
		$('.results').show();
		getMap(findShops);
		//showResults();
		//goToResults();
	});

	//Slow Scroll animated
	var goToResults = function() {
		$('html, body').animate({
	         scrollTop: $("#results__title").offset().top
	    		}, 1000);
	}

// this function takes the shop object returned by Etsy 
// and creates new result to be appended to DOM
var showResults = function(shops) {
	
	// clone our result template code
	var result = $('.templates .results__boxes__shops').clone();
	
	// Set the profile image in result
	result.find('.profile--image img').attr('src', shops.icon_url_fullxfull);

	// Set shop name to show and link in result
	var shopName = result.find('.shop-name a');
	shopName.text(shops.shop_name);
	shopName.attr('href', shops.url);

	// Set tagline to show in result
	result.find('.shop-tagline').text(shops.title);

	// Set shop city and state to show in result
	//result.find('.shop-city-state').text(shops.UserAddress.city + ", " + shops.UserAddress.state);

	// Set zip code to show in result
	//result.find('.shop-zip').text(shops.UserAddress.zip);

	// Set latitude and longitude to show in result
	//result.find('.shop-distance').text(shops.lat + ", " + shops.lon);

	return result;
};

var findShops = function(options) {

	// parameters needed to pass in request to Etsy's API
	var requestData = {
		lat: options.G,
		lon: options.K,
		distance_max: 50,
        api_key: "id5s60fsw2x2ozw38lzpkq5h"
    };

        var terms = $('#address').val();
        //var etsyURL = "https://openapi.etsy.com/v2/shops?lat="+latitude+"&lon="+longitude+"&distance_max=25&api_key="+api_key;
        var etsyURL = "https://openapi.etsy.com/v2/shops.js";

        $.ajax({
            url: etsyURL,
            data: requestData,
            dataType: "JSONP",
            jsonpCallback: "callback",
            type: "GET",
            success: function getData(data) {
                if (data.ok) {
                    if (data.count > 0) {
                        $.each(data.results, function(i,item) {
                            var sellers = showResults(item);
                            $('.results__boxes').append(sellers);
                        });
                    } else {
                        $('<p>No shops found.</p>').appendTo('.results__boxes');
                    }
                } else {
                    $('.results__boxes').empty();
                    alert(data.error);
                }
            }
        });

        return false;
	}

	var geocoder = new google.maps.Geocoder();

	function getMap(findShops) {
        //Get address from input field
        var address = document.getElementById("address").value;
        //Apply address to geocoder
        geocoder.geocode( { address: address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                findShops(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map, 
                    position: results[0].geometry.location
                });
                var mapOptions = {
                    center: results[0].geometry.location,
                    zoom: 13,
                    mapTypeControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                var map = new google.maps.Map(document.getElementById("map"), mapOptions);
                map.setCenter(results[0].geometry.location);
                //Set address marker on map
                var marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    title: "My Location"
                });

                // Insert city and zip into .search__location__city and .search__location__zip
                $(".search__location__city").text();
                $(".search__location__zip").text();
            } else {
                console.log("GoogleMaps could not locate your address due to the following reason: " + status);
            }
        });
    }
        
	
	
  		
  		
});

//geocoder api=AIzaSyA399D_AbwR9Dz6xml2trtSAtNWRtlxbiw