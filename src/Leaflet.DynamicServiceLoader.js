var addedLayers = []; // Array to track all added layers

L.Control.DynamicServiceLoader = L.Control.extend({
    options: { position: 'topleft' },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-custom');
        container.title = "Add WMS/WMTS";
        var button = L.DomUtil.create('div', '', container);
        button.innerHTML = '&#128506;';

        var accordion = L.DomUtil.create('div', 'leaflet-control-accordion', container);
        var accordionContent = L.DomUtil.create('div', 'accordion-content', accordion);

        var typeSelect = L.DomUtil.create('select', '', accordionContent);
        typeSelect.innerHTML = `
            <option value="WMS">WMS</option>
            <option value="WMTS">WMTS</option>
        `;

        var urlInput = L.DomUtil.create('input', '', accordionContent);
        urlInput.type = 'text';
        urlInput.placeholder = 'Enter WMS/WMTS URL';

        var addButton = L.DomUtil.create('button', '', accordionContent);
        addButton.innerHTML = 'Show Layers';
        addButton.style.backgroundColor = '#4CAF50';

        var clearButton = L.DomUtil.create('button', '', accordionContent);
        clearButton.innerHTML = 'Clear Layers';
        clearButton.style.backgroundColor = '#f44336';

        button.onclick = () => {
            accordion.style.display = (accordion.style.display === 'block') ? 'none' : 'block';
        };

        addButton.onclick = () => {
            var url = urlInput.value.trim();
            var type = typeSelect.value;
            if (url) {
                this._fetchAndShowLayerSelection(map, url, type);
            } else {
                alert("Please enter a valid URL.");
            }
        };

        clearButton.onclick = () => {
            this._removeAllLayers(map);
            urlInput.value = '';
        };

        return container;
    },

    _fetchAndShowLayerSelection: function (map, url, type) {
        if (type === 'WMS') {
            this._fetchWMSLayers(map, url);
        } else if (type === 'WMTS') {
            this._identifyWMTSService(map, url);
        }
    },

    _identifyWMTSService: function (map, url) {
        fetch(`${url}?service=WMTS&request=GetCapabilities`)
            .then(response => response.text())
            .then(data => {
                var parser = new DOMParser();
                var xml = parser.parseFromString(data, "text/xml");

                if (xml.getElementsByTagName("ResourceURL").length > 0) {
                    this._fetchEsriWMTSLayers(map, url);
                } else if (xml.getElementsByTagName("TileMatrixSetLink").length > 0) {
                    this._fetchGeoServerWMTSLayers(map, url);
                } else {
                    alert("Unable to determine WMTS type. Please check the service URL.");
                }
            })
            .catch(error => alert("Failed to identify WMTS type: " + error.message));
    },

    _fetchWMSLayers: function (map, url) {
        fetch(`${url}?service=WMS&request=GetCapabilities`)
            .then(response => response.text())
            .then(data => {
                var parser = new DOMParser();
                var xml = parser.parseFromString(data, "text/xml");
                var layers = xml.getElementsByTagName("Layer");
                var layerNames = [];

                for (var i = 0; i < layers.length; i++) {
                    var layerName = layers[i].getElementsByTagName("Name")[0];
                    if (layerName) {
                        layerNames.push(layerName.textContent);
                    }
                }

                if (layerNames.length > 0) {
                    this._showLayerSelectionPopup(map, url, layerNames, "WMS");
                } else {
                    alert("No layers found in the WMS service.");
                }
            })
            .catch(error => alert("Failed to retrieve WMS layers: " + error.message));
    },

    _fetchGeoServerWMTSLayers: function (map, url) {
        fetch(`${url}?service=WMTS&request=GetCapabilities`)
            .then(response => response.text())
            .then(data => {
                var parser = new DOMParser();
                var xml = parser.parseFromString(data, "text/xml");
                var layers = xml.getElementsByTagName("Layer");
                var layerNames = [];

                for (var i = 0; i < layers.length; i++) {
                    var layerName = layers[i].getElementsByTagName("ows:Identifier")[0];
                    if (layerName) {
                        layerNames.push(layerName.textContent);
                    }
                }

                if (layerNames.length > 0) {
                    this._showLayerSelectionPopup(map, url, layerNames, "GeoServer");
                } else {
                    alert("No layers found in the WMTS service.");
                }
            })
            .catch(error => alert("Failed to retrieve WMTS layers: " + error.message));
    },

    _fetchEsriWMTSLayers: function (map, url) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                var parser = new DOMParser();
                var xml = parser.parseFromString(data, "text/xml");
                var layers = xml.getElementsByTagName("Layer");
                var layerNames = [];

                for (var i = 0; i < layers.length; i++) {
                    var layerName = layers[i].getElementsByTagName("ows:Identifier")[0];
                    if (layerName) {
                        layerNames.push(layerName.textContent);
                    }
                }

                if (layerNames.length > 0) {
                    this._showLayerSelectionPopup(map, url, layerNames, "Esri");
                } else {
                    alert("No layers found in the WMTS service.");
                }
            })
            .catch(error => alert("Failed to retrieve WMTS layers: " + error.message));
    },

    _showLayerSelectionPopup: function (map, url, layerNames, type) {
        var popupContent = document.createElement('div');
        popupContent.classList.add('layer-selection-popup');

        var form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '10px';

        layerNames.forEach(layerName => {
            var label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = layerName;
            checkbox.style.marginRight = '10px';

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(layerName));
            form.appendChild(label);
        });

        var selectAllButton = document.createElement('button');
        selectAllButton.innerHTML = 'Select All Layers';
        selectAllButton.type = 'button';
        selectAllButton.style.backgroundColor = '#707070';
        selectAllButton.onclick = () => {
            form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        };

        var removeSelectedButton = document.createElement('button');
        removeSelectedButton.innerHTML = 'Remove Selected Layers';
        removeSelectedButton.type = 'button';
        removeSelectedButton.style.backgroundColor = '#707070';
        removeSelectedButton.onclick = () => {
            form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        };

        var addButton = document.createElement('button');
        addButton.innerHTML = 'Add Selected Layers';
        addButton.type = 'button';
        addButton.style.backgroundColor = '#4CAF50';
        addButton.onclick = () => {
            var selectedLayers = Array.from(form.querySelectorAll('input:checked')).map(cb => cb.value);
            selectedLayers.forEach(layerName => {
                if (type === "WMS") {
                    var wmsLayer = L.tileLayer.wms(url, {
                        layers: layerName,
                        format: 'image/png',
                        transparent: true,
                        attribution: 'WMS Layer'
                    }).addTo(map);
                    addedLayers.push(wmsLayer);
                } else if (type === "GeoServer") {
                    var geoLayer = new L.TileLayer.WMTS(url, {
                        layer: layerName,
                        tilematrixSet: 'EPSG:3857',
                        format: 'image/png',
                        style: 'default',
						attribution: 'WMTS Layer'
                    }).addTo(map);
                    addedLayers.push(geoLayer);
                } else if (type === "Esri") {
                    var esriLayer = L.tileLayer(`${url}/tile/1.0.0/${layerName}/default/default/{z}/{y}/{x}.png`, {
                        maxZoom: 21,
                        attribution: 'WMTS Layer'
                    }).addTo(map);
                    addedLayers.push(esriLayer);
                }
            });
            map.closePopup();
        };

        var cancelButton = document.createElement('button');
        cancelButton.innerHTML = 'Cancel';
        cancelButton.type = 'button';
        cancelButton.style.backgroundColor = '#f44336';
        cancelButton.onclick = () => {
            map.closePopup();
        };

        popupContent.appendChild(form);
        popupContent.appendChild(selectAllButton);
        popupContent.appendChild(removeSelectedButton);
        popupContent.appendChild(addButton);
        popupContent.appendChild(cancelButton);

        L.popup()
            .setLatLng(map.getCenter())
            .setContent(popupContent)
            .openOn(map);
    },

    _removeAllLayers: function (map) {
        addedLayers.forEach(layer => map.removeLayer(layer));
        addedLayers = [];
    }
});

L.control.dynamicServiceLoader = function (opts) {
    return new L.Control.DynamicServiceLoader(opts);
};
