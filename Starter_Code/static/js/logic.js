var myMap = L.map("map", {
    center: [30, -5.574290],
    zoom: 2
});

var basemap = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'", {
    attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

var themap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

basemap.addTo(myMap)

// Include dropdown menu
var baseMaps = {
    "Global Earthquakes": basemap,
    "Global Blue": themap,
};
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

var overlays = {
    "Tectonic Plates": tectonicplates,
    Earthquakes: earthquakes
};

L.control.layers(baseMaps, overlays).addTo(myMap);

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson').then(function (data) {
    console.log(data.features[100]);
 
        function styleInfo(feature) {
            return {
                opacity: 1,
                fillOpacity: 1,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000000",
                radius: getRadius(feature.properties.mag),
                stroke: true,
                weight: 0.5
            };
        }
    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return 'red'
            case depth > 40:
                return 'orange'
            case depth < 41:
                return 'green'
        }
    }

    function getRadius (mag){
        if (mag == 0){
            return 1;
        }
        return mag * 4;
    }

    L.geoJson(data,{
        pointToLayer: function(feature,coords){
            return L.circleMarker(coords)
        },
        style:styleInfo,
        onEachFeature: function (feature, layer){
            layer.bindPopup(feature.properties.place + '<br>Magnitude: ' + feature.properties.mag)
        }
    }).addTo(myMap);
});
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<i style="background: red">>90</i><br>';
    div.innerHTML += '<i style="background: orange">>40</i><br>';
    div.innerHTML += '<i style="background: green"><40</i><br>';
    return div;
};
legend.addTo(myMap);
