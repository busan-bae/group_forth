let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)));
const sideNav = document.querySelectorAll(".side-nav button");
sideNav.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)));

document.addEventListener("DOMContentLoaded", function () {
    const btnBar = document.querySelector(".btn-bar");
    const gnb = document.querySelector(".gnb");
    let isMenuOpen = false;

    btnBar.addEventListener("click", function () {
        isMenuOpen = !isMenuOpen;
        gnb.classList.toggle("active", isMenuOpen);
    });

});