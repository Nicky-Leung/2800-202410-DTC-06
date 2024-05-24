const starting_minutes = 60;
let time = starting_minutes * 60;
let isPaused = false;
let HomeScore = 0;
let AwayScore = 0;
const matchId = document.getElementById('matchID').value;

const pauseButton = document.getElementById('pause');
const endButton = document.getElementById('end');

pauseButton.addEventListener('click', function () {
    if (isPaused) {
        pauseButton.innerHTML = 'Pause';
        isPaused = false;
    } else {
        pauseButton.innerHTML = '<div class="pl-3 pr-3">Play</div>';
        isPaused = true;
        console.log('paused');
    }
});

endButton.addEventListener('click', async function () {
    if (!matchId) {
        console.error('Match ID not found');
        return;
    }
    const response = await fetch('/updateScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            matchId: matchId,
            homeScore: HomeScore,
            awayScore: AwayScore
        })
    });
    if (!response.ok) {
        console.error('Failed to update scores in the database');
    } else {
        window.location.href = '/matchend';
    }
});

const countdownElement = document.getElementById('countdown');

setInterval(function () {
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
    updateScoreInDatabase();
});
homeMinus.addEventListener('click', () => {
    if (HomeScore > 0) {
        HomeScore--;
        homeScoreElement.innerHTML = HomeScore;
        updateScoreInDatabase();
    }
});
awayPlus.addEventListener('click', () => {
    AwayScore++;
    awayScoreElement.innerHTML = AwayScore;
    updateScoreInDatabase();
});
awayMinus.addEventListener('click', () => {
    if (AwayScore > 0) {
        AwayScore--;
        awayScoreElement.innerHTML = AwayScore;
        updateScoreInDatabase();
    }
});

function updateScoreInDatabase() {
    fetch('/updateScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            matchId: matchId,
            homeScore: HomeScore,
            awayScore: AwayScore
        })
    })
        .then(response => {
            if (!response.ok) {
                console.error('Failed to update scores in the database');
            }
        })
        .catch(error => {
            console.error('Error updating scores:', error);
        });
}
