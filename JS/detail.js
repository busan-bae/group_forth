const apiKey = `d98d9402f26042ed994300072acd892e`;
const restApiKey = `c3f79e7f06bdb2e3b71716ee7890461e`;
const urlParams = new URLSearchParams(window.location.search);
const perfID = urlParams.get("id");
// const perfID = `PF260542`;
const showStatus = document.querySelector(".now-showing");
const detailNav = document.querySelectorAll(".detail-nav div");
const underLine = document.getElementById("underline");
let likeButton = document.querySelector(".fa-heart");
let bookButton = document.querySelector(".book");
const detailImage = document.querySelector("#detail-image");
const mapInfo = document.querySelector("#map");
const venueInfo = document.querySelector(".venue-info");
const venueDetail = document.querySelector(".venue-detail");

let perfInfo = [];
let mapArray = [];
let mapObject = {};
let perfStates = [];

// Function to save perfStates to localStorage
const savePerfStates = () => {
  localStorage.setItem("perfStates", JSON.stringify(perfStates));
};

// Function to load perfStates from localStorage
const loadPerfStates = () => {
  const savedStates = localStorage.getItem("perfStates");
  if (savedStates) {
    perfStates = JSON.parse(savedStates);
  }
};

// Apply UI states based on saved data
const applyUIStates = () => {
  if (!perfID) return;

  const stateIndex = perfStates.findIndex((perf) => perf.perfID === perfID);
  if (stateIndex === -1) return;

  const state = perfStates[stateIndex];

  // Apply like button state
  const heartButton = getLikeButton();
  if (heartButton) {
    if (state.isLiked) {
      heartButton.classList.remove("fa-regular");
      heartButton.classList.add("fa-solid");
      heartButton.style.color = "red";
    } else {
      heartButton.classList.remove("fa-solid");
      heartButton.classList.add("fa-regular");
      heartButton.style.color = "";
    }
  }

  // Apply book button state
  const reserveButton = getBookButton();
  if (reserveButton) {
    if (state.isBooked) {
      reserveButton.classList.add("is-complete");
      reserveButton.innerText = "예매 완료";
    } else {
      reserveButton.classList.remove("is-complete");
      reserveButton.innerText = "예매하기";
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Load saved states first
  loadPerfStates();

  likeButton = document.querySelector(".fa-heart");
  bookButton = document.querySelector(".book");

  if (likeButton) {
    likeButton.addEventListener("click", (event) => likeToggle(event));
  }

  if (bookButton) {
    bookButton.addEventListener("click", (event) => bookToggle(event));
  }

  // Apply UI states after the DOM is fully loaded and buttons are available
  setTimeout(() => {
    applyUIStates();
  }, 100);
});

function getLikeButton() {
  return document.querySelector(".fa-heart");
}

function getBookButton() {
  return document.querySelector(".book");
}

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
  } catch (error) {
    console.error("오류 발생:", error.message);
    renderError(error.message);
  }
  renderDetail();
  // Apply UI states after performance info is loaded and rendered
  setTimeout(() => {
    applyUIStates();
  }, 100);
};
document.addEventListener("DOMContentLoaded", () => {
  getPerfDetail();
});

//지도 api 호츌
const getMapInfo = async () => {
  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
  url.searchParams.append("query", `${perfInfo[0].venue}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${restApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    const data = await response.json();
    mapObject = data.meta.same_name;
    // console.log(mapObject);
  } catch (error) {
    console.error("API 오류 발생:", error);
    renderMapError(error);
  }

  renderMap();
};

//지도 렌더
const renderMap = async () => {
  const fetchMapData = async (query) => {
    const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
    url.searchParams.append("query", query);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `KakaoAK ${restApiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
      }

      const data = await response.json();
      return data.documents;
    } catch (error) {
      console.error("API 오류 발생:", error);
      renderMapError(error.message);
    }
  };

  // 1. selected_region으로 먼저 검색
  let mapArray = await fetchMapData(mapObject.selected_region);

  // 2. 결과가 없으면 keyword로 검색
  if (mapArray.length === 0 && mapObject.keyword) {
    // console.log(
    //   `"${mapObject.selected_region}" 검색 결과가 없어서 "${mapObject.keyword}"로 재검색합니다.`
    // );
    mapArray = await fetchMapData(mapObject.keyword);
  }

  if (mapArray.length === 0) {
    console.error("검색 결과가 없습니다.");
    renderMapError("검색 결과가 없습니다.");
    return;
  }

  // console.log(mapArray);

  const xAxis = Number(mapArray[0].x);
  const yAxis = Number(mapArray[0].y);

  var container = document.getElementById("map");
  //지도를 생성할 때 필요한 기본 옵션
  var options = {
    center: new kakao.maps.LatLng(yAxis, xAxis), //지도의 중심좌표.
    level: 3, //지도의 레벨(확대, 축소 정도)
  };

  var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

  // 마커가 표시될 위치입니다
  var markerPosition = new kakao.maps.LatLng(yAxis, xAxis);

  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    position: markerPosition,
  });

  //마커가 지도 위에 표시되도록 설정합니다
  marker.setMap(map);

  // 공연장 정보 표시
  const mapInfoHTML = `<div>${mapArray[0].place_name}</div>
    <div>전화번호 : ${mapArray[0].phone}</div>
    <div>주소 : ${mapArray[0].road_address_name}</div>`;
  venueInfo.innerHTML = mapInfoHTML;
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
  detailImage.innerHTML = detailPicHTML.join("");
};

//탭에 따라서 정보 필터링
const filter = (event) => {
  const tab = event.target.textContent;
  if (tab === "공연 소개") {
    detailImage.style.display = "block";
    venueDetail.style.display = "none";
    mapInfo.style.display = "none";
    getPerfDetail();
  } else if (tab === "공연 장소") {
    detailImage.style.display = "none";
    venueDetail.style.display = "block";
    mapInfo.style.display = "block";
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

//찜 상태 및 예매상태 업데이트
const updatePerfState = (id, key, value) => {
  const index = perfStates.findIndex((perf) => perf.perfID === id); //배열에 있는지 확인
  if (index !== -1) {
    perfStates[index][key] = value; //기존 공연인 경우 상태 업데이트
  } else {
    perfStates.push({
      //새 공연인 경우 배열에 push
      perfID: id,
      isLiked: key === "isLiked" ? value : false,
      isBooked: key === "isBooked" ? value : false,
    });
  }

  // Save to localStorage after updating the state
  savePerfStates();
};

//공연 찜하기 기능
const likeToggle = (event) => {
  const heart = event.target;
  const id = perfInfo[0]?.id;

  if (!id) return;

  //하트 활성화 토글
  if (heart.classList.contains("fa-regular")) {
    heart.classList.remove("fa-regular");
    heart.classList.add("fa-solid");
    heart.style.color = "red";
    updatePerfState(id, "isLiked", true);
  } else {
    heart.classList.remove("fa-solid");
    heart.classList.add("fa-regular");
    heart.style.color = ""; // 색상 초기화
    updatePerfState(id, "isLiked", false);
  }

  // console.log(perfStates);
};

//예매하기
const bookToggle = (event) => {
  const button = event.target;
  const id = perfInfo[0]?.id;

  if (!id) return;

  button.classList.toggle("is-complete");

  if (button.classList.contains("is-complete")) {
    button.innerText = "예매 완료";
    updatePerfState(id, "isBooked", true);
  } else {
    button.innerText = "예매하기";
    updatePerfState(id, "isBooked", false);
  }

  // console.log(perfStates);
};

//찜한 공연 및 예매된 공연 필터링
const getLikedPerformances = () => perfStates.filter((perf) => perf.isLiked);
const getBookedPerformances = () => perfStates.filter((perf) => perf.isBooked);

//에러 화면 표시
const renderError = (errorMessage) => {
  const errorElement = document.querySelector("#perf-detail");
  if (errorElement) {
    errorElement.innerHTML = `<div class="alert alert-light" role="alert" style="text-align: center;">
  ${errorMessage}</div>`;
  } else {
    console.error("Error element not found");
  }
};

const renderMapError = (errorMessage) => {
  venueDetail.innerHTML = `<div class="alert alert-light" role="alert" style="text-align: center;">
  ${errorMessage}</div>`;
};

// Load saved states when the script runs
loadPerfStates();
getPerfDetail();

export {
  perfStates,
  likeToggle,
  bookToggle,
  getLikedPerformances,
  getBookedPerformances,
};
