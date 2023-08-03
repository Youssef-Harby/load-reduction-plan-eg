document.getElementById('getLocation').addEventListener('click', function () {
    // Check if Geolocation is supported
    if (!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser.");
        return;
    }

    // Get the user's current position
    navigator.geolocation.getCurrentPosition(function (position) {
        // Extract the coordinates
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("Latitude: " + latitude + ", Longitude: " + longitude);

        // Remove previous location marker if it exists
        if (window.locationMarker) {
            window.locationMarker.remove();
        }

        // Create a blue dot to represent the location
        window.locationMarker = new maplibregl.Marker({
            color: 'blue',
            draggable: false
        })
            .setLngLat([longitude, latitude])
            .addTo(map);
    }, function (error) {
        console.log("An error occurred while retrieving location: " + error.message);
    });
});