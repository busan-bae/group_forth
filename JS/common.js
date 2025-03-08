// import userArea from "./mypage.js";

// console.log(userArea); 

document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".side-menu-list a");
    menuItems.forEach(item => {
        item.addEventListener("click", (event) => {
            event.preventDefault(); 
            getNewsByCategory(event);
        });
    });

    document.getElementById("btnMenu").addEventListener("click", openNav);
    document.querySelector(".close-btn").addEventListener("click", closeNav);
    
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


document.addEventListener("DOMContentLoaded", function () {
    let searchInput = document.getElementById("search-input");
    let addButton = document.getElementById("add-button");
    let searchListSection = document.querySelector(".search-wrap section:first-of-type");

    // 로컬 스토리지에서 검색어 불러오기
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    function renderSearchList() {
        searchListSection.innerHTML = "<h2>최근 검색어</h2>"; // 기존 내용 초기화

        recentSearches.forEach((search, index) => {
            let searchItem = document.createElement("div");
            searchItem.classList.add("search-item");
            searchItem.innerHTML = `
                <span>${search}</span>
                <button class="delete-btn" data-index="${index}">&times;</button>
            `;
            searchListSection.appendChild(searchItem);
        });

        // 삭제 버튼에 이벤트 추가
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                recentSearches.splice(index, 1);
                localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
                renderSearchList();
            });
        });
    }

    addButton.addEventListener("click", function () {
        let keyword = searchInput.value.trim();
        if (keyword === "") return;

        recentSearches.unshift(keyword);
        recentSearches = [...new Set(recentSearches)].slice(0, 5); // 중복 제거, 최대 5개 유지
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));

        searchInput.value = "";
        renderSearchList();
    });

 
    // 검색창 닫기 기능
    document.querySelector(".close-btn").addEventListener("click", function () {
        document.getElementById("search-list").style.display = "none";
    });

    renderSearchList(); // 초기 검색어 리스트 렌더링
});

