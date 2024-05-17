const starting_minutes = 60;
let time = starting_minutes * 60
let isPaused = false;
HomeScore = 0;
AwayScore = 0;

const pauseButton = document.getElementById('pause');


pauseButton.addEventListener('click', function() {
    if (isPaused) {
        pauseButton.innerHTML = 'Pause';
        isPaused = false;
    } else {
        pauseButton.innerHTML = '<div class="pl-3 pr-3 ">Play</div>';
        isPaused = true;
        console.log('paused');
    }
});

const countdownElement = document.getElementById('countdown');

setInterval(function() {
    if (!isPaused) {
        updateCountdown();
    }
}, 1000);

function updateCountdown() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    

    countdownElement.innerHTML = `${minutes}:${seconds}`;
    time--;
}



const homeScoreElement = document.getElementById('home-score');
const awayScoreElement = document.getElementById('away-score');
const homePlus = document.getElementById('homePlus');
const homeMinus = document.getElementById('homeMinus');
const awayPlus = document.getElementById('awayPlus');
const awayMinus = document.getElementById('awayMinus');

homePlus.addEventListener('click', () => {
    HomeScore++;
    homeScoreElement.innerHTML = HomeScore;
});
homeMinus.addEventListener('click', () => {
    if (HomeScore > 0) {
    HomeScore--;
    homeScoreElement.innerHTML = HomeScore;}
});
awayPlus.addEventListener('click', () => {
    AwayScore++;
    awayScoreElement.innerHTML = AwayScore;
});
awayMinus.addEventListener('click', () => {
    if (AwayScore > 0) {
    AwayScore--;
    awayScoreElement.innerHTML = AwayScore;}
});

homeScoreElement.innerHTML = HomeScore;