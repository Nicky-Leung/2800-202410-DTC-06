rightFooterBtn = document.getElementById('rightFooterBtn')
console.log(rightFooterBtn);

rightFooterBtn.addEventListener('click', () => {
    rightMenu = document.getElementById('rightMenu');
    rightMenu.classList.toggle('hidden');
});

home = document.getElementById('home')
console.log(home);
home.addEventListener('click', () => {
    window.location.href = '/index';   
});

home = document.getElementById('profile')
console.log(home);
home.addEventListener('click', () => {
    window.location.href = '/profile';   
});
