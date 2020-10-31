const logout = document.querySelector('#out');
const btn = document.querySelector('#logout');

logout.addEventListener('mouseover', () => {
    btn.style.backgroundColor = '#303030';
    btn.style.color = '#26ddeb';
});
logout.addEventListener('mouseout', () => {
    btn.style.backgroundColor = '#26ddeb';
    btn.style.color = '#303030';
});

const lis = document.querySelectorAll('ul li');