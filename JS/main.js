//임의 데이터터
const performances = [
  { id: 1, title: "공연1", eventSite: "공연장A", startDate: "2025-03-05", endDate: "2025-03-09" },
  { id: 2, title: "공연2", eventSite: "공연장B", startDate: "2025-03-07", endDate: "2025-03-10" },
  { id: 3, title: "공연3", eventSite: "공연장C", startDate: "2025-03-06", endDate: "2025-03-08" },
  { id: 4, title: "공연4", eventSite: "공연장D", startDate: "2025-03-09", endDate: "2025-03-12" },
  { id: 5, title: "공연5", eventSite: "공연장E", startDate: "2025-03-04", endDate: "2025-03-07" },
  { id: 6, title: "공연6", eventSite: "공연장F", startDate: "2025-03-08", endDate: "2025-03-11" },
  { id: 7, title: "공연7", eventSite: "공연장G", startDate: "2025-03-10", endDate: "2025-03-13" },
  { id: 8, title: "공연8", eventSite: "공연장H", startDate: "2025-03-12", endDate: "2025-03-14" },
  { id: 9, title: "공연9", eventSite: "공연장I", startDate: "2025-03-15", endDate: "2025-03-18" },
  { id: 0, title: "공연0", eventSite: "공연장J", startDate: "2025-03-16", endDate: "2025-03-19" },
];

const filterPerformancesByDate = (selectedDate) => {
  const filteredPerformances = performances.filter(performance => {
    const startDate = new Date(performance.startDate);
    const endDate = new Date(performance.endDate);
    return selectedDate >= startDate && selectedDate <= endDate; 
  });

  // 공연이 없으면 "공연이 없습니다" 메시지를 동적으로 추가
  const mdateCont = document.querySelector(".mdate-cont"); // 공연 리스트가 담길 부모 요소
  const noPerformanceMessage = mdateCont.querySelector(".no-maintxt");

  // 공연이 없으면 메시지 추가
  if (filteredPerformances.length === 0) {
    if (!noPerformanceMessage) {  // 이미 메시지가 있으면 추가하지 않음
      const messageElement = document.createElement("div");
      messageElement.classList.add("no-maintxt");
      messageElement.textContent = "공연이 없습니다.";
      mdateCont.appendChild(messageElement); // 부모 요소에 메시지 추가
    }
  } else {
    // 공연이 있으면 기존 메시지를 숨김
    if (noPerformanceMessage) {
      noPerformanceMessage.remove();
    }
  }

  return filteredPerformances;
};




// 공연 항목 표시 함수
const togglePerformanceVisibility = (performanceItems, selectedDate) => {
  performanceItems.forEach(item => {
    const performanceDateText = item.querySelector(".date").textContent;
    const performanceDates = performanceDateText.split(" ~ ");
    const startDate = new Date(performanceDates[0]);
    const endDate = new Date(performanceDates[1]);

    if (selectedDate >= startDate && selectedDate <= endDate) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
};

// 날짜 버튼 생성 및 이벤트 처리
const addDate = () => {
  const todayDate = new Date();
  let currentDate = new Date();
  let dateHTML = "";

  // 날짜 버튼 생성
  for (let i = 0; i < 20; i++) {
    currentDate.setDate(todayDate.getDate() + i);

    let dateStr = currentDate.toLocaleDateString('ko-KR', { day: '2-digit' });
    let dateClass = i === 0 ? "mdate today" : "mdate";

    dateHTML += `
      <button class="${dateClass} swiper-slide" data-index="${i}">
        <p>${i === 0 ? "Today" : ""}</p>
        <p>${dateStr}</p>
      </button>
    `;
  }

  document.querySelector(".main-date-bx").innerHTML = dateHTML;

  // 날짜 버튼 클릭 시 active 클래스 추가/제거 및 공연 필터링
  const dateButtons = document.querySelectorAll(".mdate");
  const mdateCont = document.querySelector(".mdate-cont");
  const performanceItems = mdateCont.querySelectorAll(".list-item-bx");

  // 처음 로드 시 "Today"에 해당하는 공연만 보이게 하기
  const todayButton = document.querySelector(".mdate.today");
  if (todayButton) {
    const todayDateText = todayButton.querySelector('p:nth-child(2)').textContent;
    const selectedDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), parseInt(todayDateText));

    const filteredPerformances = filterPerformancesByDate(selectedDate);
    togglePerformanceVisibility(performanceItems, selectedDate);
  }

  // 날짜 버튼 클릭 시
  dateButtons.forEach(button => {
    button.addEventListener("click", function() {
      dateButtons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");

      // 클릭된 날짜 가져오기
      const date = this.querySelector('p:nth-child(2)').textContent;
      const selectedDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), parseInt(date));

      const filteredPerformances = filterPerformancesByDate(selectedDate);
      togglePerformanceVisibility(performanceItems, selectedDate);
    });
  });
};

// 공연 목록 렌더링 함수
const render = (performancesToRender) => {
  let mainslHTML = "";
  let listHTML = "";

  // 메인 슬라이드 HTML 생성
  for (let i = 1; i <= 5; i++) {
    mainslHTML += `
      <div class="swiper-slide mainsl">
        <div class="mainsl-img"><img src="/img/testpost.jpg" alt="공연포스터"></div>
        <div class="mainsl-txt">
          <p class="tit">공연${i}</p>
          <p class="place">공연장소</p>
          <p class="date">공연날짜</p>
        </div>
      </div>
    `;
  }

  // performances 배열을 순회하면서 HTML 생성
  performancesToRender.forEach((performance) => {
    listHTML += `
      <div class="swiper-slide list-item-bx">
        <div class = "list-item" >
            <div class="list-img"><a href=""><img src="/img/testpost.jpg" alt="공연이미지"></a></div>
            <div class="list-txt">
              <div class="tit-bx">
                <div class="d-flex justify-content-between">
                  <p class="tit">${performance.title}</p>
                  <button><i class="fa-regular fa-heart"></i></button>
                </div>
                <p class="place">${performance.eventSite}</p>
              </div>
              <p class="date">${performance.startDate} ~ ${performance.endDate}</p>
            </div>
        </div>
      </div>
    `;
  });

  document.querySelector(".mainsl-bx").innerHTML = mainslHTML;
  document.querySelectorAll(".main-cont-bx").forEach(el => el.innerHTML = listHTML);
};

// 함수 실행
render(performances);
addDate();

/* s : 메인슬라이드(.mainsl-area) 스와이퍼 */
var mainslSwiper = new Swiper(".mainsl-area", {
  slidesPerView: 1,
  spaceBetween: 0,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
});
/* e : 메인 슬라이드 스와이퍼 */

/* s : 메인1(.mainsl-area) 스와이퍼 */
var mainCont1Swiper = new Swiper(".main-cont-area", {
  slidesPerView: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    500: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 0,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 0,
    },
    1400: {
      slidesPerView: 5,
      spaceBetween: 0,
    },
  },
});
/* e : 메인 슬라이드 스와이퍼 */

/* s : 날짜 스와이퍼 */
var mdateSwiper = new Swiper(".main-date-area", {
  slidesPerView:5,
  spaceBetween: 10,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    768: {
      slidesPerView: 7,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 12,
      spaceBetween: 20,
    },
  },
});
/* e : 날짜 스와이퍼 */