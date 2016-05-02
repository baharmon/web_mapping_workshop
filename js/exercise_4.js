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

var dataParks = 'data/rome_parks.geojson';

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


var featureLayerParks = L.mapbox.featureLayer();
	featureLayerParks.loadURL(dataParks);
	featureLayerParks.addTo(map);

featureLayerParks.on('ready', function(){
	this.eachLayer(function(layer){
    	layer.setIcon(L.mapbox.marker.icon({
          "marker-color": "#333", 
          "marker-size": "large",
          "marker-symbol": "marker"
        }))
    })
    map.fitBounds(featureLayerParks.getBounds());
})

