async function createMap (){    
    const map = (window.map = new maplibregl.Map({
            container: 'map',
            style:
                'https://api.maptiler.com/maps/dataviz/style.json?key=4Uo4TLB3nj9dKd6jXKku',
            zoom: 15,
            center: [-123.11377687420126, 49.23844728285027],
            pitch: 40,
            antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
    
            
        }));

        

    }
createMap();
