document.getElementById('getLocation').addEventListener('click', function () {
    // Check if Geolocation is supported
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    // Get the user's current position
    navigator.geolocation.getCurrentPosition(function (position) {
        // Extract the coordinates
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Remove previous location marker if it exists
        if (window.locationMarker) {
            window.locationMarker.remove();
        }

        // Create a blue dot to represent the location using maplibregl
        window.locationMarker = new maplibregl.Marker({
            color: 'blue',
            draggable: false
        })
            .setLngLat([longitude, latitude])
            .addTo(map); // Assuming 'map' is your maplibregl map instance

        // Fly to the user's location
        map.flyTo({
            center: [longitude, latitude],
            zoom: 15 // Adjust zoom level as needed
        });

        // Turf 
        const userLocation = turf.point([longitude, latitude]);
        // Access the GeoJSON data from the global variable
        const geojsonData = window.geojsonData;

        let intersectingFeature = null;
        geojsonData.features.forEach(feature => {
            if (turf.booleanPointInPolygon(userLocation, feature)) {
                intersectingFeature = feature;
            }
        });

        // Create a popup with the intersecting polygon's content
        if (intersectingFeature) {
            const popupContent = JSON.stringify(intersectingFeature.properties, null, 2); // Format the properties as JSON

            new maplibregl.Popup()
                .setLngLat([longitude, latitude])
                .setHTML(`<pre>${popupContent}</pre>`) // Display the content in a <pre> tag
                .addTo(map); // Assuming 'map' is your maplibregl.Map instance
        }


    }, function (error) {
        // Handle errors and provide user feedback
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("Permission to access location was denied.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred while retrieving location.");
                break;
        }
    });
});
