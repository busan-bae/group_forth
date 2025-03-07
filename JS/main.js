const proxy = "https://api.allorigins.win/raw?url=";
const apiKey = "d98d9402f26042ed994300072acd892e";
const baseURL = "https://www.kopis.or.kr/openApi/restful/";

// 공연 데이터 목록
let performances = [];

// XML을 JSON으로 변환하는 함수
const xmlToJson = (xml) => {
    let obj = {};
    if (xml.nodeType === 1) { // element 노드
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let i = 0; i < xml.attributes.length; i++) {
                const attribute = xml.attributes.item(i);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // text 노드
        obj = xml.nodeValue.trim();
    }

    // 자식 노드 처리
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            if (typeof obj[nodeName] === "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (!Array.isArray(obj[nodeName])) {
                    obj[nodeName] = [obj[nodeName]];
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }

    return obj;
};

// API 요청 함수
const fetchKopisData = async (queryParams, containerClass) => {
  try {
      const apiURL = `${baseURL}${queryParams}&service=${apiKey}`;
      const response = await fetch(proxy + encodeURIComponent(apiURL), { timeout: 10000 });

      if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);

      const xmlText = await response.text();
      const xml = new DOMParser().parseFromString(xmlText, "application/xml");
      const jsonData = xmlToJson(xml);

      console.log("API 요청 URL:", apiURL);
      console.log("JSON 데이터:", jsonData);

      let performances = [];

// 데이터 구조에 맞게 배열 추출
if (jsonData.boxofs && jsonData.boxofs.boxof) {
  // boxofs.boxof이 배열인지 확인하고, 배열로 처리
  performances = Array.isArray(jsonData.boxofs.boxof) ? jsonData.boxofs.boxof : [jsonData.boxofs.boxof];
} else if (jsonData.dbs && jsonData.dbs.db) {
  // dbs.db이 배열인지 확인하고, 배열로 처리
  performances = Array.isArray(jsonData.dbs.db) ? jsonData.dbs.db : [jsonData.dbs.db];
} else {
  console.error("데이터가 잘못되었습니다. boxofs.boxof 또는 dbs.db가 없습니다.");
}

    console.log("JSON 데이터에서 추출된 performances:", performances);
    render(performances, containerClass);

      console.log("JSON 데이터에서 추출된 performances:", performances);
      render(performances, containerClass);

  } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
  }
};

// 공연 목록 렌더링 함수
const render = (performancesToRender, containerClass) => {
    let mainslHTML = "";
    let listHTML = "";

    // 메인 슬라이드 HTML 생성
    mainslHTML = performancesToRender.map(item => `
        <div class="swiper-slide mainsl">
            <div class="mainsl-img"><img src="${item.poster['#text']}" alt="공연포스터"></div>
            <div class="mainsl-txt">
                <p class="tit">${item.prfnm['#text']}</p>
                <p class="place">${item.fcltynm['#text']}</p>
                <p class="date">${item.prfpdfrom['#text']} ~ ${item.prfpdto['#text']}</p>
            </div>
        </div>
    `).join('');

    // performances 배열을 순회하면서 HTML 생성
    listHTML = performancesToRender.map(item => `
        <div class="swiper-slide list-item-bx">
            <div class="list-item">
                <div class="list-img"><a href=""><img src="${item.poster['#text']}" alt="공연이미지"></a></div>
                <div class="list-txt">
                    <div class="tit-bx">
                        <div class="d-flex justify-content-between">
                            <p class="tit">${item.prfnm['#text']}</p>
                            <button><i class="fa-regular fa-heart"></i></button>
                        </div>
                        <p class="place">${item.fcltynm['#text']}</p>
                    </div>
                    <p class="date">${item.prfpdfrom['#text']} ~ ${item.prfpdto['#text']}</p>
                </div>
            </div>
        </div>
    `).join('');

  // 각 컨테이너 클래스에 맞게 HTML 삽입
  const container = document.querySelector(containerClass);
  if (container) {
    container.innerHTML = containerClass === ".mainsl-bx" ? mainslHTML : listHTML;
  } else {
    console.error(`Container element with class ${containerClass} not found`);
  }
};
// 데이터 요청 실행
fetchKopisData("prffest?stdate=20250301&eddate=20250330&cpage=1&rows=10", ".mainsl-bx");
fetchKopisData("pblprfr?&stdate=20230601&eddate=20260808&cpage=1&rows=10&prfstate=02", ".main-cont-bx");
fetchKopisData("prfawad?stdate=20230601&eddate=20230630&cpage=1&rows=10&prfstate=03", ".award-wrap");
fetchKopisData("pblprfr?&stdate=20230601&eddate=20260808&cpage=1&rows=10&prfstate=02", ".mdate-cont");


// 날짜 버튼 생성 함수
const addDate = () => {
    const todayDate = new Date();
    let currentDate = new Date();
    let dateHTML = "";

    // 날짜 버튼 생성
    for (let i = 0; i < 25; i++) {
        // currentDate의 날짜를 증가시키기 위해
        currentDate.setDate(todayDate.getDate() + i); // 오늘 날짜에 i일을 더함

        let dateStr = currentDate.toLocaleDateString('ko-KR', { month: 'long', day: '2-digit' });
        let dateClass = i === 0 ? "mdate today" : "mdate";

        // 각 버튼에 날짜 추가
        dateHTML += `
            <button class="${dateClass} swiper-slide" data-index="${i}">
                <p>${i === 0 ? "Today" : ""}</p>
                <p>${dateStr}</p>
            </button>
        `;
    }

    document.querySelector(".main-date-bx").innerHTML = dateHTML;

    // 날짜 클릭 시
    const mdateBtn = document.querySelectorAll(".mdate");
    mdateBtn.forEach(button => {
        button.addEventListener("click", function() {
            // active 클래스 추가/제거
            mdateBtn.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            // 클릭한 날짜 가져오기
            const date = this.querySelector('p:nth-child(2)').textContent; // 클릭한 날짜 텍스트
            const [month, day] = date.split("월");
            const dayOfMonth = parseInt(day.replace("일", "").trim(), 10);

            // 클릭된 날짜 계산
            const selectedDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), dayOfMonth);
            // 필터링된 공연 리스트 표시
            filterPerformancesByDate(selectedDate);
        });
    });
};

// 날짜별 공연 필터링 함수
const filterPerformancesByDate = (selectedDate) => {
    // 공연 항목을 모두 가져옴
    const mdateCont = document.querySelector(".mdate-cont");
    const performanceItems = mdateCont.querySelectorAll('.list-item-bx');

    performanceItems.forEach(item => {
        const dateRangeText = item.querySelector('.date').textContent;
        const [startDateText, endDateText] = dateRangeText.split(' ~ ');

        const startDate = new Date(startDateText.trim());
        const endDate = new Date(endDateText.trim());

        // 선택된 날짜가 공연 날짜 범위 안에 있으면 보이게, 아니면 숨기기
        if (selectedDate >= startDate && selectedDate <= endDate) {
            item.style.display = 'block';  // 해당 공연 보이기
        } else {
            item.style.display = 'none';   // 해당 공연 숨기기
        }
    });
};

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

/* s : 메인1 스와이퍼 */
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
            slidesPerView: 4,
            spaceBetween: 0,
        },
    },
});
/* e : 메인 슬라이드 스와이퍼 */

/* s : 날짜 스와이퍼 */
var mdateSwiper = new Swiper(".main-date-area", {
    slidesPerView: 5,
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

// 페이지가 로드될 때, 기본적으로 날짜 버튼 생성
addDate();
