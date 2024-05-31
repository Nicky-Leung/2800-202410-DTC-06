// Get the rating dialog element
var ratingDialog = document.getElementById("ratingDialog");

// Get the close button element
var closeBtn = document.getElementById("closeBtn");

// Get the icons element
var icons = document.getElementById("icons");

// Get the rated users from the local storage or initialize it as an empty array where the rated users will be stored
var ratedUsers = JSON.parse(localStorage.getItem('ratedUsers')) || [];

// contents of the rating dialog
icons.innerHTML = `
<div class="terrible" id="terrible" style="display: flex; flex-direction: column; align-items: center; justify-content: center;"> <!-- -elo -->
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mood-cry" width="75" height="75" viewBox="0 0 24 24" stroke-width="1" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 10l.01 0" />
        <path d="M15 10l.01 0" />
        <path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" />
        <path d="M17.566 17.606a2 2 0 1 0 2.897 .03l-1.463 -1.636l-1.434 1.606z" />
        <path d="M20.865 13.517a8.937 8.937 0 0 0 .135 -1.517a9 9 0 1 0 -9 9c.69 0 1.36 -.076 2 -.222" />
    </svg>
    <span style="margin-top: 8px;">Terrible</span>
</div>

<div class="neutral" id="neutral" style="display: flex; flex-direction: column; align-items: center; justify-content: center;"> <!-- No changes-->
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mood-empty" width="75" height="75" viewBox="0 0 24 24" stroke-width="1" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M9 10l.01 0" />
        <path d="M15 10l.01 0" />
        <path d="M9 15l6 0" />
    </svg>
    <span style="margin-top: 8px;">Neutral</span>
</div>

<div class="happy" id="happy" style="display: flex; flex-direction: column; align-items: center; justify-content: center;"> <!-- +elo -->
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mood-happy" width="75" height="75" viewBox="0 0 24 24" stroke-width="1" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M9 9l.01 0" />
        <path d="M15 9l.01 0" />
        <path d="M8 13a4 4 0 1 0 8 0h-8" />
    </svg>
    <span style="margin-top: 8px;">Excellent</span>
</div>
`;

// Add event listener to close the modal when the close button is clicked
closeBtn.addEventListener("click", function () {
    ratingDialog.classList.add("hidden");
});

// Add event listener to close the modal when clicking outside of it
window.addEventListener("click", function (event) {
    if (event.target == ratingDialog) {
        ratingDialog.classList.add("hidden");
    }
});

// Get all flag icons
var flagIcons = document.querySelectorAll(".flagIcon");

/** 
 * @description This function adds an event to the flag icon to open the player rating dialog. Each flag is located right beside the player's name in the match summary page.
 */
flagIcons.forEach(function (icon) {
    icon.addEventListener("click", function (event) {
        // Get the player id from closest parent element with data-player-id attribute, 
        var playerId = event.currentTarget.closest("[data-player-id]").dataset.playerId;
        // current user id is stored in the data-current-user-id attribute of the document
        var currentUserId = document.querySelector('[data-current-user-id]').dataset.currentUserId;
        // Get the match id from closest parent element with data-match-id attribute to identify the match the player is rated in.
        var matchId = event.currentTarget.closest("[data-match-id]").dataset.matchId;

        // console log for verifying that the flag icon is clicked and the player id and current user id are correct
        console.log("Flag icon clicked");
        console.log("Player ID:", playerId);
        console.log("Current user ID:", currentUserId);

        // condition that prevents user from rating themselves
        if (playerId === currentUserId) {
            alert("You cannot rate yourself!");
            return;
        }

        // condition that prevents a user from rating the same player in the same match more than once
        if (hasRatedUser(playerId, matchId)) {
            alert("You have already rated this user in this match!");
            return;
        }

        // shows the rating dialog when the flag icon is clicked
        ratingDialog.classList.remove("hidden");
        // set the player id and match id as attributes of the rating dialog
        ratingDialog.setAttribute("data-player-id", playerId);
        // set the match id as an attribute of the rating dialog
        ratingDialog.setAttribute("data-match-id", matchId);
    });
});
// Variable to store the rating picked by the user
var ratingpicked;
// Get the submit button
var submit = document.getElementById("submitBtn")
// Get all rating icons
var faceIcons = document.querySelectorAll("#icons > div");

/**
 * @description This function saves the rated users in the local storage so that the user cannot rate the same player in the same match more than once.
 */
function saveRatedUsers() {
    localStorage.setItem('ratedUsers', JSON.stringify(ratedUsers));
}

/**
 * @description This function checks if the user has already rated the player in the match.
 * @param {string} playerId - The id of the player being rated
 * @param {string} matchId - The id of the match the player is rated in
 * @returns {boolean} - True if the user has already rated the player in the match, false otherwise. 
 */
function hasRatedUser(playerId, matchId) {
    return ratedUsers.some(rating => rating.playerId === playerId && rating.matchId === matchId);
}

/**
 * @description This function adds an event listener to each rating icon to allow the user to select a rating. 
 
 */
faceIcons.forEach(function (icon) {
    // Add event listener to each icon
    icon.addEventListener("click", function () {
        // Remove border from all icons
        faceIcons.forEach(function (icon) {
            icon.style.border = "none";
        });
        // Add border to the clicked icon to highlight which rating is selected
        icon.style.border = "2px solid black";
        // Update the selected rating
        ratingpicked = icon.id;
        // console log for verifying that the rating is picked
        console.log("Rating picked:", ratingpicked);
    });
});

/**
 * @description This function adds an event listener to the submit button to update the sportsmanship rating of the player in the match.
 */
submit.addEventListener("click", async function () {
    // Check if a rating is picked. If not, show an alert to the user and return to prevent the rating from being submitted.
    if (!ratingpicked) {
        alert("Please select a rating before submitting");
        return;
    }

    // Get the player id and match id by getting the attributes of the rating dialog
    var playerId = ratingDialog.getAttribute("data-player-id");
    var matchId = ratingDialog.getAttribute("data-match-id");

    // condition that prevents user from rating themselves
    if (hasRatedUser(playerId, matchId)) {
        alert("You have already rated this user!");
        return;
    }

    // try to update the sportsmanship rating of the player in the match
    try {
        // fetches /updateSportsmanship route and sends a post request with the player id and rating picked by the user by converting it to JSON
        const resp = await fetch('/updateSportsmanship', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: playerId, rating: ratingpicked })
        });
        const data = await resp.json();
        // add the player id and match id to the rated users array in the local storage
        ratedUsers.push({ playerId: playerId, matchId: matchId });
        // save the rated users in the local storage via the saveRatedUsers function
        saveRatedUsers();
        // console log to check if the rated users are saved in the local storage
        console.log("Rated users:", ratedUsers);

        // alert the user that the sportsmanship rating is updated and hide the rating dialog
        alert(data.message);
        ratingDialog.classList.add("hidden");
        // catch block to handle errors
    } catch (err) {
        console.error('Error updating sportsmanship:', err);
        alert('Error updating sportsmanship');
    }
});
