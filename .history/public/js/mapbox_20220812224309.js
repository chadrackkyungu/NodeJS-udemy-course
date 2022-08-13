const locations = JSON.parse(document.getElementById('map').dataset.locations);

export const displayMap = locations => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiY2hhZHJhY2tjb2RlIiwiYSI6ImNsNmxzMnlhbzA0bHYzZ28xYThkOW5sdWMifQ.sO9gXrE_bbRO5FqmhFX7AA';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-80.185942, 25.774772], //center from this latitude to this longitude
        zoom: 10,
        interactive: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add marker, is that mark on the map
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup. is the labels that shows the name of the Map pop
        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });
}
