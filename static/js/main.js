maplibregl.setRTLTextPlugin(
    "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js",
    null,
    true // Lazy load the plugin
);

const map = new maplibregl.Map({
    container: "map",
    style: "https://api.maptiler.com/maps/streets/style.json?key=KDhMfHvorAFkFe64wlZb",
    center: [31.2357, 30.0444],
    zoom: 8.5,
});

const hours = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
];

function filterBy(hour) {
    const filters = ["==", "disc_from", hour];
    map.setFilter("demo-cairo-small-labels", filters);

    // Set the label to the hour
    document.getElementById("hour").textContent = hours[hour];
}

map.on("load", () => {
    d3.json("../data/demo-cairo-small.geojson", (err, data) => {
        if (err) throw err;
        data.features = data.features.map((d) => {
            const date_time_from = new Date(d.properties.disc_from);
            const date_time_to = new Date(d.properties.disc_to);
            d.properties.disc_from = date_time_from.getHours();
            d.properties.disc_to = date_time_to.getHours();
            console.log(d);
            return d;
        });

        map.addSource("demo-cairo-small", {
            type: "geojson",
            data,
        });
        map.addLayer({
            'id': 'demo-cairo-small-labels',
            'type': 'fill',
            'source': 'demo-cairo-small',
            'paint': {
                'fill-color': '#888888',
                'fill-outline-color': 'red',
                'fill-opacity': 0.6
            },
            // filter for (multi)polygons; for also displaying linestrings
            // or points add more layers with different filters
            'filter': ['==', '$type', 'Polygon']
        });

        filterBy(0);

        document.getElementById("slider").addEventListener("input", (e) => {
            const hour = parseInt(e.target.value, 10);
            filterBy(hour);
        });
    });
});
