function goBack() {
    history.back();
}

function goToLocal() {
    window.location.href = "/localleaderboard";
}

function goToRegional() {
    window.location.href = "/regionalleaderboard";
}

function goToGlobal() {
    window.location.href = "/globalleaderboard";
}

document.getElementById("backButton").addEventListener("click", goBack);

document.getElementById("localBoard").addEventListener("click", goToLocal);

document.getElementById("globalBoard").addEventListener("click", goToGlobal);

document.getElementById("regionalBoard").addEventListener("click", goToRegional);

