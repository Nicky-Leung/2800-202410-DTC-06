const starting_minutes = 60;
let time = starting_minutes * 60
HomeScore = 0;
AwayScore = 0;


const countdownElement = document.getElementById('countdown');

setInterval(updateCountdown, 1000);

function updateCountdown() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    

    countdownElement.innerHTML = `${minutes}:${seconds}`;
    time--;
}

