$(document).ready( function() {
	$('.results').hide();
	$('#map').hide();
	$('.search__field__box').submit( function(event){
		$('.map-placeholder').hide();
		$('#map').show();
		$('.results').show();
		getMap(geocoder, map);
		findShops();
		showResults();
		goToResults();
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
	var result = $('.results__boxes__shops').clone();
	
	// Set the profile image in result
	result.find('.profile--image img').attr('src', shops.icon_url_fullxfull);

	// Set shop name to show and link in result
	var shopName = result.find('.shop-name a');
	displayName.text(shops.shop_name);
	displayName.attr('href', shops.url);

	// Set tagline to show in result
	result.find('.shop-tagline').text(shops.title);

	// Set shop city and state to show in result
	result.find('.shop-city-state').text(shops.UserAddress.city + ", " + shops.UserAddress.state);

	// Set zip code to show in result
	result.find('.shop-zip').text(shops.UserAddress.zip);

	// Set latitude and longitude to show in result
	result.find('.shop-distance').text(shops.lat + ", " + shops.lon);

	return result;
};

var findShops = function(shops) {

	// parameters needed to pass in request to Etsy's API
	var findAllShops = {tag: shops,
							shop_name: string,
							title: string,
							UserAddress.city: string,
							UserAddress.zip: string,
							lat: latitude,
							lon: longitude,
							distance_max: 25};

		api_key = "id5s60fsw2x2ozw38lzpkq5h";
        terms = $('.address').val();
        etsyURL = "https://openapi.etsy.com/v2/shops/active.js?keywords="+terms+"&limit=5&includes=Shop:1&api_key="+api_key;
        
        var data = $.ajax({
                url: etsyURL,
                data: request,
                dataType: "jsonp",
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

	/*var geocoder = new google.maps.Geocoder();

	function getMap(position) {
			var coords = new google.maps.LatLng(latitude, longitude);
            var latitude = 34.0500;
            var longitude = -118.2500;
            var mapOptions = {
                center: coords,
                zoom: 13,
                mapTypeControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
             }
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
          }

    	//Get address from input field
    	var address = document.getElementById("address").value;
    	//Apply address to geocoder
    	geocoder.geocode( { 'address': address}, function(results, status) {
    		if (status == google.maps.GeocoderStatus.OK) {
    			map.setCenter(results[0].geometry.location);
    			var marker = new google.maps.Marker({
                map: map, 
                position: results[0].geometry.location
            	});
    		} else {
    			console.log("GoogleMaps could not locate your address due to the following reason: " + status);
    			}
      });
  		
  		//Set address marker on map
  		var marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: "My location"
        });*/
});

//geocoder api=AIzaSyA399D_AbwR9Dz6xml2trtSAtNWRtlxbiw