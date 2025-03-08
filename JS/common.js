// export const imgRoot = "./images/";

// import {imgRoot} from "./mypage.js";

// console.log(imgRoot); 

document.addEventListener("DOMContentLoaded", function () {
    // 사이드 메뉴 관련 이벤트
    const menuItems = document.querySelectorAll(".side-menu-list a");
    menuItems.forEach(item => {
        item.addEventListener("click", (event) => {
            event.preventDefault(); 
            getNewsByCategory(event);
        });
    });

    document.getElementById("btnMenu").addEventListener("click", openNav);
    document.querySelector(".close-btn").addEventListener("click", closeNav);
    
    // 검색창 관련 이벤트
    const searchButton = document.getElementById("btnSearch");
    const searchWrap = document.getElementById("search-list");
    const searchInput = document.getElementById("search-input");
    const addButton = document.getElementById("add-button");
    const searchListSection = document.querySelector(".search-wrap section:first-of-type");
    const closeButton = document.querySelector(".close-btn");

    let isSearchOpen = false;

    // 로컬 스토리지에서 검색어 불러오기
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    // 검색어 리스트 렌더링
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

    // 검색창 열기/닫기
    searchButton.addEventListener("click", function () {
        isSearchOpen = !isSearchOpen;
        if (isSearchOpen) {
          searchWrap.style.display = "block";
        } else {
          searchWrap.style.display = "none";
        }
      });

    // 검색창 외부 클릭 시 닫기
    searchWrap.addEventListener("click", function (event) {
        if (event.target === searchWrap) {
            isSearchOpen = false;
            searchWrap.style.display = "none";
            setTimeout(() => {
                searchWrap.style.display = "none";
            }, 500);
        }
    });

    // 검색어 추가
    addButton.addEventListener("click", function () {
        let keyword = searchInput.value.trim();
        if (keyword === "") return;

        recentSearches.unshift(keyword);
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));

        searchInput.value = "";
        renderSearchList();
    });

    // 검색창 닫기 버튼
    closeButton.addEventListener("click", function () {
        searchWrap.style.display = "none";
    });

    renderSearchList(); // 초기 검색어 리스트 렌더링
});

// 사이드 메뉴 열기/닫기
const openNav = () => {
    document.getElementById("mySidenav").style.width = "100%";
};

const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
};
