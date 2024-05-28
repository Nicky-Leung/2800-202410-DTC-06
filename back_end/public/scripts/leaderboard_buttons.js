function goBack() {
    history.back();
}

function goToLocal() {
    window.location.href = "/localleaderboard";
    console.log("going to local leaderboard");
}

function goToRegional() {
    window.location.href = "/regionalleaderboard";
    console.log("going to local leaderboard");
}

function goToGlobal() {
    window.location.href = "/globalleaderboard";
    console.log("going to local leaderboard");
}



function loadbuttons() {
    document.getElementById("backButton").addEventListener("click", goBack);
    document.getElementById("localBoard").addEventListener("click", goToLocal);
    document.getElementById("globalBoard").addEventListener("click", goToGlobal);
    document.getElementById("regionalBoard").addEventListener("click", goToRegional);
  }


function startup() {
    loadbuttons();
    console.log("leaderboard.js started");
}


startup();