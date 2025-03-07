
document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".side-menu-list a");
    menuItems.forEach(item => {
        item.addEventListener("click", (event) => {
            event.preventDefault(); 
            getNewsByCategory(event);
        });
    });

});

const openNav = () => {
    document.getElementById("mySidenav").style.width = "100%";
};

const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
};

// 검색

const searchButton = document.getElementById("btnSearch"); 
const searchWrap = document.getElementById("search-list"); 
let isSearchOpen = false; 


document.addEventListener("DOMContentLoaded", function () {
    searchButton.addEventListener("click", function () {
        isSearchOpen = !isSearchOpen; 
        if (isSearchOpen) {
            searchWrap.style.display = "flex"; 
            searchWrap.style.opacity = "1"; 
        } else {
            searchWrap.style.opacity = "0"; 
            setTimeout(() => {
                searchWrap.style.display = "none"; 
            }, 500); 
        }
    });

    searchWrap.addEventListener("click", function (event) {
        if (event.target === searchWrap) {
            isSearchOpen = false;
            searchWrap.style.opacity = "0";
            setTimeout(() => {
                searchWrap.style.display = "none";
            }, 500);
        }
    });
});


