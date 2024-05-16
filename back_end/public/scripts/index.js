async function createMap() {
    const map = (window.map = new maplibregl.Map({
        container: 'map',
        style:
            'https://api.maptiler.com/maps/dataviz/style.json?key=4Uo4TLB3nj9dKd6jXKku',
        zoom: 15,
        center: [-123.11377687420126, 49.23844728285027],
        pitch: 40,
        antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased


    }));

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
                'features': [
                    {
                        'type': 'Feature',
                        'properties': {
                            'icon': 'basketball'
                        },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-123.11377687420126, 49.23844728285027]
                        }
                    },
                    
                ]
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

        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
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