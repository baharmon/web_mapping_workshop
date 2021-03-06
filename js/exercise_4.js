// Here is the javascript setup for a basic map:

// Enter your mapbox map id here to reference it for the base layer,
// this one references the ugly green map that I made.
var mapId = 'baharmon.019h4lm1';

// And this is my access token, use yours.
var accessToken = 'pk.eyJ1IjoiYmFoYXJtb24iLCJhIjoiY2lnaXFwbmE2MDAyaXJxbTAxZGMwcmZneCJ9.M-KRxEOrjKct0rl8hxHJug';

// Create the map object with your mapId and token,
// referencing the DOM element where you want the map to go.
L.mapbox.accessToken = accessToken;
var map = L.mapbox.map('map', mapId);

// Set the initial view of the map to the whole US
map.setView([39, -96], 4);

var dataFileToAdd = 'data/restaurants.geojson';

var featureLayer = L.mapbox.featureLayer();
	featureLayer.loadURL(dataFileToAdd);
	featureLayer.addTo(map);

featureLayer.on('ready', function(){
	this.eachLayer(function(layer){
    	layer.setIcon(L.mapbox.marker.icon({
          "marker-color": "#333",
          "marker-size": "large",
          "marker-symbol": "marker"
        }))
    })
    map.fitBounds(featureLayer.getBounds());
})


// Sidebar
var clickHandler = function(e){
	$('#info').empty();

  var feature = e.target.feature;

  $('#sidebar').fadeIn(400, function(){
  	var info = '';
  	info += '<div>';
  	info += '<h2>'+ feature.properties.name + '<h2>';
    if(feature.properties.cuisine){
      info += '<p>' + feature.properties.cuisine + '</p>';
    }
    if(feature.properties.phone){
      info += '<p>' + feature.properties.phone + '</p>';
    }
    if(feature.properties.website){
			info += '<p><a href="' + feature.properties.website + '">' + feature.properties.website + '</a></p>';
    }
    info += '</div>';
    $('#info').append(info);
  })
	// Routing
	var myGeoJSON = myLocation.getGeoJSON();
	getDirections(myGeoJSON.geometry.coordinates, feature.geometry.coordinates);
}

featureLayer.on('ready', function(){
  this.eachLayer(function(layer){
  	layer.on('click', clickHandler);
  })
})

map.on('click',function(){
	$('#sidebar').fadeOut(200);
});


// Here I am!
var myLocation = L.mapbox.featureLayer().addTo(map);

map.on('locationfound', function(e){
	myLocation.setGeoJSON({
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [e.latlng.lng, e.latlng.lat]
		},
		properties: {
			"title": "Here I am!",
			"marker-color": "#111",
			"marker-symbol": "marker"
		}
	})
})

map.locate({setView: true})


// Mapzen
var routeLine = L.mapbox.featureLayer().addTo(map);

function getDirections(frm, to){
	var jsonPayload = JSON.stringify({
		locations: [
			{lat: frm[1], lon: frm[0]},
			{lat: to[1], lon: to[0]}
		],
		costing: 'pedestrian',
		units: 'miles'
	})
	$.ajax({
		url: 'https://valhalla.mapzen.com/route',
		data: {
			json: jsonPayload,
			api_key: 'valhalla-QFA6aem'
		}
	}).done(function(data){
		var routeShape = polyline.decode(data.trip.legs[0].shape);
		routeLine.setGeoJSON({
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: routeShape
			},
			properties: {
				"stroke": "#666",
				"stroke-opacity": 0.8,
				"stroke-width": 8
			}
		})
	})
}


//// Popup
//featureLayer.on('ready', function(){
//  this.eachLayer(function(layer){
//  	layer.bindPopup('Welcome to '+ layer.feature.properties.name);
//  })
//})
