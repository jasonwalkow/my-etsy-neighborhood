$(document).ready( function() {
	$('.results').hide();
	$('#map').hide();
	$('.search__field__box').submit( function(event){
		getMap(findShops);
	});
	
// this function takes the shop object returned by Etsy 
// and creates new result to be appended to DOM
var showResults = function(shops) {
    // display default image if no icon is found
    var defaultImage = "../my-etsy-neighborhood/img/etsyicon.png";
	// clone our result template code
	var result = $('.templates .results__boxes__shops').clone();
	// Set the profile image in result
	result.find('.profile--image img').attr('src', shops.icon_url_fullxfull || defaultImage);
	// Set shop name to show and link in result
    result.find('.shop-name a').text(shops.shop_name).attr('href', shops.url);
	// Set tagline to show in result
	result.find('.shop-tagline').text(shops.title);
    // Set shop admirers to show in result
    result.find('.admirers').text(shops.num_favorers);
    // Set shop listings number to show in result
    result.find('.listings').text(shops.listing_active_count);
	return result;
};

var findShops = function(options) {

	// parameters needed to pass in request to Etsy's API
	var requestData = {
		lat: options.H,
		lon: options.L,
		distance_max: 50,
        api_key: "id5s60fsw2x2ozw38lzpkq5h"
    };

    var terms = $('#address').val();
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
    function insertAddress (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //look for locality tag and administrative_area_level_1
            var city = "";
            var state = "";
            for(var i=0, len=results[0].address_components.length; i<len; i++) {
                var ac = results[0].address_components[i];
                if(ac.types.indexOf("locality") >= 0) city = ac.long_name;
                if(ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.short_name;
            }
            // Post results
            if(city != '' && state != '') {
                $("#search__location__city").text(city + ", " + state);
            }
        }
    }

	function getMap(findShops) {
        $('.map-placeholder').hide();
        $('#map').show();
        $('.results__boxes').html("");
        $('.results').show();
        //Get address from input field
        var address = document.getElementById("address").value;
        //Apply address to geocoder
        geocoder.geocode({address: address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                findShops(location);
                var mapOptions = {
                    center: location,
                    zoom: 13,
                    mapTypeControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                var map = new google.maps.Map(document.getElementById("map"), mapOptions);
                map.setCenter(location);
                //Set address marker on map
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    title: "My Location"
                });
                var latlng = new google.maps.LatLng(location.H,location.L);
                geocoder.geocode({'latLng': latlng}, insertAddress);
            }
        });
        //Slow Scroll animated
        $('html, body').animate({scrollTop: $("#results__title").offset().top}, 1000);
        }
    });








