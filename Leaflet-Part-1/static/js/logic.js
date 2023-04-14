// Load the GeoJSON data.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Creating the map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
}); 

// Create the base layers
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Get the data with d3.
d3.json(url).then(function(data) {
    function mapStyle(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: mapColor(feature.geometry.coordinates[2]),
        color: "black",
        radius: mapRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    } 

// Create markers whose size increases with magnitude and color with depth
    function mapColor(depth) {
      return depth > 90 ? 'red' :
            depth > 70 ? 'orangered' :
            depth > 50 ? 'orange' :
            depth > 30 ? 'gold' :
            depth > 10 ? 'yellow' :
                        'limegreen' ;   
                              
    }

// Establish magnitude size
    function mapRadius(mag) {
      if (mag === 0) {
          return 1;
      }
      return mag * 4;
    }

// Add earthquake data to the map
  L.geoJson(data, {

    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },

    style: mapStyle,

    // Activate pop-up data when circles are clicked
    onEachFeature: function (feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

    }
  }).addTo(myMap);

// Add the legend with colors to corrolate with depth
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];
 
for (let i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
  };
  legend.addTo(myMap)
});












