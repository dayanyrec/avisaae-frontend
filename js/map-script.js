function avisaMap(idCanvas) {
  this.map = null,
  this.mapOptions = {
    zoom: 2,
    center: {lat: -33.865427, lng: 151.196123},
    mapTypeId: google.maps.MapTypeId.TERRAIN
  },
  this.mapCanvas = document.getElementById(idCanvas),
  this.loadMap = function() {
    this.map = new google.maps.Map(this.mapCanvas, this.mapOptions);
  },
  this.getData = function() {
    var script = document.createElement('script');

    script.src = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp';
    document.getElementsByTagName('head')[0].appendChild(script);
  },
  this.setStyle = function() {
    this.map.data.setStyle(function(feature) {
      var magnitude = feature.getProperty('mag');
      return {
        icon: getCircle(magnitude)
      };
    });
  }
}

var avisaAe;

function initialize() {
  avisaAe = new avisaMap('map');

  avisaAe.loadMap();
  avisaAe.getData();
  avisaAe.setStyle();
}

function getCircle(magnitude) {
  var circle = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'red',
    fillOpacity: .2,
    scale: Math.pow(2, magnitude) / 2,
    strokeColor: 'white',
    strokeWeight: .5
  };
  return circle;
}

function eqfeed_callback(results) {
  var heatmapData = [];
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1], coords[0]);
    var magnitude = results.features[i].properties.mag;
    var weightedLoc = {
      location: latLng,
      weight: Math.pow(2, magnitude)
    };
    heatmapData.push(weightedLoc);
  }
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    dissipating: false,
    map: avisaAe.map
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
