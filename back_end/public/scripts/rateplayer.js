var flagIcons = document.querySelectorAll(".flagIcon");
flagIcons.forEach(function (icon) {
    icon.addEventListener("click", function () {
        console.log("Flag icon clicked"); // log the click if working
        var ratingDialog = document.getElementById("ratingDialog");
        ratingDialog.classList.add("visible");
        ratingDialog.classList.remove("hidden");
    });
});
