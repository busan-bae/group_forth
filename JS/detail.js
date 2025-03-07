const apiKey = `d98d9402f26042ed994300072acd892e`;
const perfID = `PF260542`;
const showStatus = document.querySelector(".now-showing");
const detailNav = document.querySelectorAll(".detail-nav div");
const underLine = document.getElementById("underline");
const likeButton = document.querySelector(".fa-heart");
const bookButton = document.querySelector(".book");

let perfInfo = [];
let perfState = {
  perfID: perfID,
  isBooked: false,
  isLiked: false,
};

likeButton.addEventListener("click", (event) => likeToggle(event));
bookButton.addEventListener("click", (event) => bookToggle(event));

// underline 빼고 이벤트리스너 추가
for (let i = 1; i < detailNav.length; i++) {
  detailNav[i].addEventListener("click", (event) => {
    filter(event);
    toggleTabs(event);
  });
}

//언더바 슬라이딩
detailNav.forEach((nav) => {
  if (nav.id !== "underline") {
    nav.addEventListener("click", (e) => indicator(e));
  }
});

function indicator(e) {
  //클릭한 아이템의 왼쪽 시작점(offsetLeft)부터 아이템의 width만큼 슬라이드
  underLine.style.left = e.currentTarget.offsetLeft + "px";
  underLine.style.width = e.currentTarget.offsetWidth + "px";
  underLine.style.top =
    e.currentTarget.offsetTop + e.currentTarget.offsetHeight + "px";
}

//공연 상세정보 가져오기
const getPerfDetail = async () => {
  try {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const url = new URL(
      `http://www.kopis.or.kr/openApi/restful/pblprfr/${perfID}?service=${apiKey}`
    );

    const response = await fetch(proxy + url);
    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    let text = await response.text();
    const xml = new DOMParser().parseFromString(text, "application/xml");

    const perfDB = xml.getElementsByTagName("db")[0];
    if (!perfDB) {
      throw new Error(`데이터를 찾을 수 없습니다.`);
    }

    //공연상세정보를 객체에 담아서 배열에 넣기
    perfInfo = [
      {
        id: perfDB.getElementsByTagName("mt20id")[0]?.textContent || "",
        name: perfDB.getElementsByTagName("prfnm")[0]?.textContent || "",
        startDate:
          perfDB.getElementsByTagName("prfpdfrom")[0]?.textContent || "",
        endDate: perfDB.getElementsByTagName("prfpdto")[0]?.textContent || "",
        area: perfDB.getElementsByTagName("area")[0]?.textContent || "",
        venue: perfDB.getElementsByTagName("fcltynm")[0]?.textContent || "",
        runtime:
          perfDB.getElementsByTagName("prfruntime")[0]?.textContent || "",
        price:
          perfDB.getElementsByTagName("pcseguidance")[0]?.textContent || "",
        poster: perfDB.getElementsByTagName("poster")[0]?.textContent || "",
        genre: perfDB.getElementsByTagName("genrenm")[0]?.textContent || "",
        status: perfDB.getElementsByTagName("prfstate")[0]?.textContent || "",
        age: perfDB.getElementsByTagName("prfage")[0]?.textContent || "",
        starring:
          perfDB.getElementsByTagName("prfcrew")[0]?.textContent.trim() ||
          perfDB.getElementsByTagName("prfcast")[0]?.textContent.trim() ||
          "",
        detailPic:
          Array.from(perfDB.getElementsByTagName("styurl")).map(
            (el) => el.textContent
          ) || [], //공연 상세정보 이미지 여러개 가져오기
      },
    ];

    //넘겨줄 공연정보
    perfState = {
      perfID: perfDB.getElementsByTagName("mt20id")[0]?.textContent || "",
      name: perfDB.getElementsByTagName("prfnm")[0]?.textContent || "",
      status: perfDB.getElementsByTagName("prfstate")[0]?.textContent || "",
      poster: perfDB.getElementsByTagName("poster")[0]?.textContent || "",
      isBooked: false,
      isLiked: false,
    };
  } catch (error) {
    console.error("오류 발생:", error.message);
    // renderError(error.message); // 화면에 에러 표시하는 함수 (이따 구현해야댐)
  }

  renderDetail();
};

//지도 api 호출
const getMapInfo = () => {
  console.log("지도 불러오기");
};

//공연 상세정보 화면에 보여주기
const renderDetail = () => {
  if (perfInfo.length === 0) return;

  const titleHTML = perfInfo.map((item) => {
    return `              <div class="product-name-wrap">
                <h2>${item.name}</h2>
              </div>
              <div class="product-name-wrap">
                <div>${item.area}</div>
                <div>${item.age}</div>
              </div>`;
  });

  //공연중-공연완료-공연예정
  if (perfInfo[0].status === "공연예정") {
    showStatus.classList.add("tbd");
    showStatus.textContent = perfInfo[0].status;
  } else if (perfInfo[0].status === "공연완료") {
    showStatus.classList.add("complete");
    showStatus.textContent = perfInfo[0].status;
  }

  const detailHTML = perfInfo.map((item) => {
    return `<li>
                  <div>공연 장소</div>
                  <div>${item.venue}</div>
                </li>
                <li>
                  <div>공연 시간</div>
                  <div>${item.runtime}</div>
                </li>
                <li>
                  <div>공연 기간</div>
                  <div>${item.startDate} ~ ${item.endDate}</div>
                </li>
                <li>
                  <div>출연</div>
                  <div>${item.starring}</div>
                </li>
                <li>
                  <div>가격</div>
                  <div>${item.price}</div>
                </li>`;
  });

  //포스터
  if (perfInfo[0].poster) {
    const posterContainer = document.querySelector("#perf-poster");
    //포스터가 이미 있으면 이미지 태그 또 추가안함(prepend써서 필요)
    if (!posterContainer.querySelector("img")) {
      const imgElement = document.createElement("img");
      imgElement.src = perfInfo[0].poster;

      document.querySelector("#perf-poster").prepend(imgElement);
    }
  }

  //상세이미지
  const detailPicHTML = perfInfo[0].detailPic.map((item) => {
    return `<div><img src="${item}"/></div>`;
  });

  document.querySelector("#perf-title").innerHTML = titleHTML;
  document.querySelector("#perf-detail").innerHTML = detailHTML;
  document.querySelector("#detail-contents").innerHTML = detailPicHTML.join("");
};

//탭에 따라서 정보 필터링
const filter = (event) => {
  const tab = event.target.textContent;
  if (tab === "공연 소개") {
    getPerfDetail();
  } else if (tab === "공연 장소") {
    getMapInfo();
  }
};

// 탭 선택되면 스타일 바꾸기 (모바일)
const toggleTabs = (event) => {
  if (window.innerWidth <= 768) {
    // 모든 탭에서 active 클래스 제거
    detailNav.forEach((tab) => {
      tab.classList.remove("active");
    });

    // 클릭된 탭에만 active 클래스 추가
    event.target.classList.add("active");
  }
};

//공연 찜하기 기능
const likeToggle = (event) => {
  const heart = event.target;

  //하트 활성화 토글
  if (heart.classList.contains("fa-regular")) {
    heart.classList.remove("fa-regular");
    heart.classList.add("fa-solid");
    heart.style.color = "red";
    perfState.isLiked = true;
  } else {
    heart.classList.remove("fa-solid");
    heart.classList.add("fa-regular");
    heart.style.color = ""; // 색상 초기화
    perfState.isLiked = false;
  }

  console.log(perfState);
};

//예매하기
const bookToggle = (event) => {
  const button = event.target;
  button.classList.toggle("is-complete");

  if (button.classList.contains("is-complete")) {
    button.innerText = "예매 완료";
    perfState.isBooked = true;
  } else {
    button.innerText = "예매하기";
    perfState.isBooked = false;
  }

  console.log(perfState);
};

getPerfDetail();

export { likeToggle, bookToggle, perfState };
