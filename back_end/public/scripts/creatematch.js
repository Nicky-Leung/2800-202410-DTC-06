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

    cardcontainer = document.getElementById('cardContainer');
    cardcontainer.innerHTML = '';
    
    console.log(data);
    matchForm = document.getElementById('matchSetUp');
    matchForm.classList.remove('hidden');

    locationForm = document.getElementById('location');

    Array.from(data.results).forEach((place, index) => {

        const option = document.createElement('option');
        option.value = JSON.stringify([place.geocodes.main.longitude, place.geocodes.main.latitude, place.name]);
        option.textContent = place.name;
        locationForm.appendChild(option);

        card = document.createElement('div');
        card.classList.add('flex', 'flex-col', 'border', 'border-black', 'p-2', 'm-2', 'w-38', 'bg-white', 'rounded-lg', 'h-48', 'overflow-y-auto', 'overflow-x-auto');
       
        distanceaway = parseInt(place.distance)/1000;
        cardcontent = document.createElement('div');
        cardcontent.innerHTML = `<h3 class="text-xl font-bold">${place.name}</h3>
                          <p>${place.location.formatted_address}</p>
                          <p>${distanceaway}KM from you</p>`
        cardcontent.classList.add('text-center', 'px-2');
        card.appendChild(cardcontent);

        cardbuttoncontainer = document.createElement('div');
        cardbuttoncontainer.classList.add('flex', 'justify-center');
        cardbutton = document.createElement('button');
        cardbutton.textContent = "select";
        cardbutton.classList.add('bg-baby-blue', 'hover:bg-blue-500', 'p-2', 'rounded-lg', 'mt-2');
        cardbuttoncontainer.appendChild(cardbutton);
        cardbutton.setAttribute('id', place.name)
        card.appendChild(cardbuttoncontainer);
        cardcontainer.appendChild(card);

       
        cardbutton.addEventListener('click', (e) => {
            const buttons = cardcontainer.querySelectorAll('button');

            // Loop through all buttons
            buttons.forEach((button) => {
                // If the button is not the clicked button, toggle it back to the original color
                if (button !== e.target) {
                    button.classList.add('bg-baby-blue');
                    button.classList.remove('bg-blue-500');
                }
            });
        
            // Toggle the color of the clicked button
           
            e.target.classList.add('bg-blue-500');
            e.target.classList.remove('bg-baby-blue');
           
            Array.from(locationForm.options).forEach((opt, i) => {
                if (opt.textContent === place.name) {
                    locationForm.selectedIndex = i;
                }
            });
        });

   

    });

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = "sport";
    hiddenInput.value = sport;
    hiddenInput.id = "sport";
    matchForm.insertBefore(hiddenInput, matchForm.firstChild);



}

async function createCard() {


}