
// This script is responsible for creating the map and adding the basketball icon to the map.
async function createMap() {

    sessions = await fetch('/matchSessions')
    sessions = await sessions.json();
    console.log(sessions);

    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const map = (window.map = new maplibregl.Map({
        container: 'map',
        style:
            '/map-data',
        zoom: 15,
        center: [position.coords.longitude, position.coords.latitude],
        pitch: 40,
        antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased


    }));
    let features = [];

    for (let i = 0; i < sessions.length; i++) {
        features.push({
            'type': 'Feature',
            'properties': {
                'icon': 'basketball'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [sessions[i].location.coordinates[0], sessions[i].location.coordinates[1]]
            }
        });

    }
    // Add the basketball icon to the map
    map.on('load', () => {

        map.loadImage(
            'basketball.jpg',
            function (error, image) {
              if (error) throw error;
              map.addImage('basketball', image);
            }
          );
        map.addSource('places', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': features
            }
        });
        // Add a layer showing the places.
        map.addLayer({
            'id': 'places',
            'type': 'symbol',
            'source': 'places',
            'layout': {
                'icon-image':'{icon}' ,
                'icon-size': 2,
                'icon-overlap': 'always'
            }
        });

       // When a click event occurs on a feature in the places layer
       //opens a UI element populated by /information
        map.on('click', 'places', (event) => {

            

            fetch('/information')
            .then(response => response.text())
            .then(html => {
              const element = document.getElementById('overlay');
              //clear the html
              element.innerHTML = "";
              //add the new html
              element.innerHTML = html;
            });

            map.flyTo({
                center: event.lngLat,
                essential: true
            
                
              });
                
          
        });

       
    });



}
createMap();
console.log('map.js loaded');