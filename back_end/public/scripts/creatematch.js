async function getPlaces(e) {
    e.preventDefault();
    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const sport = document.getElementById('sport').value;
    const radius = document.getElementById('radius').value;
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    response = await fetch('/placeSearch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sport,
            radius,
            lat,
            lng
        })
    });
    const data = await response.json();
    populateLocation(data, sport);

    


}

findplace = document.getElementById('findPlace');
console.log(findplace);
findplace.addEventListener('click', getPlaces);

async function populateLocation(data, sport) {

    
    
    console.log(data);
    matchForm = document.getElementById('matchSetUp');
    matchForm.classList.remove('hidden');

    locationForm = document.getElementById('location');

    Array.from(data.results).forEach((place, index) => {
        const option = document.createElement('option');
        option.value = JSON.stringify([place.geocodes.main.longitude, place.geocodes.main.latitude, place.name]);
        option.textContent = place.name;
        locationForm.appendChild(option);

    });

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = "sport";
    hiddenInput.value = sport;
    hiddenInput.id = "sport";
    matchForm.insertBefore(hiddenInput, matchForm.firstChild);



}