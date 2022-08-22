mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: hotel.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(hotel.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25})
            .setHTML(
                `<h5 style="color: black;">${hotel.title}</h3><p style="color: black;">${hotel.address}</p>`
            )
    )
    .addTo(map)