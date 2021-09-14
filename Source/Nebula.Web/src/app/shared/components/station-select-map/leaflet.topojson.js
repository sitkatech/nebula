import * as topojson from '../../../../../node_modules/topojson-client';

//This is not an official leaflet plugin nor is it one that is actively maintained.
//The code in defineTopoJSON came directly from Austin Orr, the rest is just boilerplate found in  other leaflet plugins 
//to add it to the L namespace.
(function () {
    function defineTopoJSON(L) {
        //extend Leaflet to create a GeoJSON layer from a TopoJSON file
        L.TopoJSON = L.GeoJSON.extend({
            addData: function (data) {
                var geojson, key;
                if (data.type === "Topology") {
                    for (key in data.objects) {
                        if (data.objects.hasOwnProperty(key)) {
                            geojson = topojson.feature(data, data.objects[key]);
                            L.GeoJSON.prototype.addData.call(this, geojson);
                        }
                    }
                    return this;
                }
                L.GeoJSON.prototype.addData.call(this, data);
                return this;
            },
        });

        L.topoJson = function (data, options) {
            return new L.TopoJSON(data, options);
        };
    }

    if (typeof define === 'function' && define.amd) {
        // Try to add topojson to Leaflet using AMD
        define(['leaflet'], function (L) {
            defineTopoJSON(L);
        });
    }
    else {
        // Else use the global L
        defineTopoJSON(L);
    }

})();