// Get the rating dialog element
var ratingDialog = document.getElementById("ratingDialog");

// Get the close button element
var closeBtn = document.getElementById("closeBtn");

var icons = document.getElementById("icons");

icons.innerHTML = `
<div class="terrible" id="terrible" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
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
<div class="bad" id="bad" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mood-sad" width="75" height="75" viewBox="0 0 24 24" stroke-width="1" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M9 10l.01 0" />
        <path d="M15 10l.01 0" />
        <path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" />
    </svg>
    <span style="margin-top: 8px;">Bad</span>
</div>

<div class="neutral" id="neutral" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mood-empty" width="75" height="75" viewBox="0 0 24 24" stroke-width="1" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M9 10l.01 0" />
        <path d="M15 10l.01 0" />
        <path d="M9 15l6 0" />
    </svg>
    <span style="margin-top: 8px;">Neutral</span>
</div>

<div class="goodl" id="good" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mood-smile" width="75" height="75" viewBox="0 0 24 24" stroke-width="1" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 10l.01 0" />
  <path d="M15 10l.01 0" />
  <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
</svg>
    <span style="margin-top: 8px;">Good</span>
</div>

<div class="happy" id="happy" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
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

// Add event listener to each flag icon to open the rating dialog
flagIcons.forEach(function (icon) {
    icon.addEventListener("click", function () {
        console.log("Flag icon clicked");
        ratingDialog.classList.remove("hidden");
    });
});

var submit = document.getElementById("submitBtn");

submit.addEventListener("click", function () {
    ratingDialog.classList.add("hidden");
    alert("Thank you for your feedback!");
});

function selected() {
    var faceIcons = document.querySelectorAll("#icons > div");

    faceIcons.forEach(function (icon) {
        icon.addEventListener("click", function () {
            faceIcons.forEach(function (icon) {
                icon.style.border = "none";
            });
            console.log(document.getElementById("submitBtn"));


            this.style.border = "solid 1px black";
        });
    });
}
selected();
