rightFooterBtn = document.getElementById('rightFooterBtn')
console.log(rightFooterBtn);

rightFooterBtn.addEventListener('click', () => {
    window.location.href = '/localleaderboard';   
});

home = document.getElementById('home')
console.log(home);
home.addEventListener('click', () => {
    window.location.href = '/index';   
});