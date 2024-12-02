# Leaflet.DynamicServiceLoader

**Leaflet.DynamicServiceLoader** is a Leaflet plugin that enables users to dynamically add and manage WMS and WMTS map services directly from the client side. This tool eliminates the need for pre-configured services in the HTML or JavaScript code, making it highly flexible and user-friendly for non-developers.

---

## Features

- **Dynamic Service Management**:
  - Add WMS and WMTS (GeoServer and Esri) services at runtime via a simple user interface.
  - Fetch and display available layers for selection.
  - Add selected layers to the map dynamically.

- **Layer Management**:
  - Options to select all layers, deselect layers, and clear all added layers.
  - Supports dynamic attribution and interactivity.

- **Client-Side Functionality**:
  - No need to modify HTML or JavaScript to add new services.
  - Fully interactive and controlled by end-users.

- **Custom Styling and Intuitive Interface**:
  - Accordion-style interface for selecting and managing layers.
  - Styled buttons for "Add Selected Layers," "Clear Layers," and more.

---

## Requirements

### Leaflet Version

- Tested on Leaflet v1.7.1 or higher.

### External Dependencies

- **[leaflet.TileLayer.WMTS](https://github.com/alexandre-melard/leaflet.TileLayer.WMTS)**: A Leaflet plugin for handling WMTS layers.

### Browser/Device Compatibility

- Works on all modern browsers (Chrome, Firefox, Edge, Safari).
- Fully responsive and compatible with desktop, tablet, and mobile devices.

---

## Demo

![Demo Animation](examples/demo_video.gif)

View a live demo of the plugin:
[Demo Link](https://o-z-e-r-e-r.github.io/Leaflet.DynamicServiceLoader/)


---

## Instructions for Including the Plugin

1. **Include Leaflet Library**:  
   Add Leaflet JavaScript and CSS files to your HTML:
   ```html
   <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
   <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
   ```

2. **Include Dependency**:   
   Add WMTS dependency to your HTML file:
   ```html
   <script src="lib/leaflet-tilelayer-wmts.js.js"></script>
   ```
   
3. **Include DynamicServiceLoader Plugin**:  
   Add DynamicServiceLoader JavaScript and CSS files to your HTML:
   ```html
   <script src="dist/Leaflet.DynamicServiceLoader.js"></script>
   <link rel="stylesheet" href="dist/Leaflet.DynamicServiceLoader.css"/>
   ```
   
4. **Initialize map and add DynamicServiceLoader tool**:
   ```html
   // Initialize the map
   var map = L.map('map').setView([50, 25], 5);

   // Add a tile layer
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map);

   // Add DynamicServiceLoader tool
   L.control.dynamicServiceLoader().addTo(map);
   ```

---

## Usage Example

1.  **Click the control button (🗺)** on the map to open the layer management panel.
    
2.  **Select a service type** (WMS or WMTS).
    
3.  **Enter the URL** for the WMS/WMTS service.
    
4.  Click **"Show Layers"** to fetch available layers.
    
5.  Select specific layers using checkboxes or click **"Select All Layers"**.
    
6.  Add selected layers to the map with **"Add Selected Layers"**.
    
7.  Manage layers:
    
    *   Use **"Clear Layers"** to remove all added layers.
        
    *   Use **"Remove Selected Layers"** to deselect layers.
	
---

## API Reference

### Methods

1.  **\_fetchAndShowLayerSelection(map, url, type)**: Fetches available layers and displays them in a selection popup.
    
2.  **\_fetchWMSLayers(map, url)**: Fetches WMS layers using the GetCapabilities request.
    
3.  **\_fetchGeoServerWMTSLayers(map, url)**: Fetches GeoServer WMTS layers using the GetCapabilities request.
    
4.  **\_fetchEsriWMTSLayers(map, url)**: Fetches Esri WMTS layers using the GetCapabilities request.
    
5.  **\_showLayerSelectionPopup(map, url, layerNames, type)**: Displays a selection popup for available layers.
    
6.  **\_removeAllLayers(map)**: Removes all layers added to the map.

### Options

| Option         | Description                       | Default  |
|-----------------|-----------------------------------|----------|
| `position`      | Position of the control on the map. | `topleft` |

### Events

| Event           | Description                                           |
|------------------|-------------------------------------------------------|
| `click`          | Triggered when a user clicks on the map.              |
| `layeradd`       | Triggered when a layer is added to the map.           |
| `popupopen`      | Triggered when a selection popup is opened.           |

---

## Notes

- **Supported Service Types**:
  - WMS: Standard WMS services. 
  - WMTS: GeoServer and Esri WMTS services.
        
- **Cross-Origin Requests**:
  - Ensure the service URLs support CORS (Cross-Origin Resource Sharing) for proper functionality.

## License

This plugin is distributed under the **MIT License**.
