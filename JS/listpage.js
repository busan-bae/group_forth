const proxy = "https://api.allorigins.win/raw?url=";
const apiKey = "31b9f7fd6d5642719e7bb23547c49e5a";
const baseURL = "https://www.kopis.or.kr/openApi/restful/";

const regionFilter = document.querySelector(".region-filter")

const sortFilter = document.querySelector(".filter");
sortFilter.addEventListener("change", (event) => applySortFilter(event));
regionFilter.addEventListener("change",(event)=>applyRegionFilter(event)) 



let allPerformances = []; // 전체 공연 데이터를 저장
const totalPages = 5; // 가져올 페이지 수
const itemsPerPage = 12; // 한 페이지에 보여줄 공연 수
let currentPage = 1; // 현재 페이지
let currentRegion = "all";
let filteredPerformances = [];
let selectedRegion = "all"
let selectedSort = "1"

// XML -> JSON 변환 함수
const xmlToJson = (xml) => {
  let obj = {};
  if (xml.nodeType === 1) {
      if (xml.attributes.length > 0) {
          obj["@attributes"] = {};
          for (let i = 0; i < xml.attributes.length; i++) {
              const attribute = xml.attributes.item(i);
              obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
      }
  } else if (xml.nodeType === 3) {
      obj = xml.nodeValue.trim();
  }

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

// 여러 페이지의 데이터를 가져와 합치는 함수
const fetchAllPages = async () => {
  try {
      let requests = [];
      allPerformances = []
      // 여러 페이지의 데이터를 요청
      for (let page = 1; page <= totalPages; page++) {
          const apiURL = `${baseURL}pblprfr?stdate=20250307&eddate=20250406&cpage=${page}&rows=99&prfstate=02&service=${apiKey}&shcate=GGGA`;
          requests.push(fetch(proxy + encodeURIComponent(apiURL))
              .then(response => {
                  if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);
                  return response.text();
              })
              .then(xmlText => {
                  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
                  return xmlToJson(xml);
              })
          );
      }

      // 모든 요청을 병렬로 실행
      const results = await Promise.all(requests);

      // 데이터 합치기
      results.forEach(jsonData => {
          if (jsonData.dbs && jsonData.dbs.db) {
              const performances = Array.isArray(jsonData.dbs.db) ? jsonData.dbs.db : [jsonData.dbs.db];
              allPerformances = allPerformances.concat(performances);
          }
      });

      // 필터링된 공연 데이터로 렌더링
      regionRender();
      selectedRegion = "all"; // "전지역" 초기화
      filteredPerformances = allPerformances; // "전지역"에 해당하는 모든 공연 데이터
      renderPage(currentPage); // 첫 페이지 렌더링

      console.log("✅ 모든 페이지에서 가져온 데이터:", allPerformances);
  } catch (error) {
      console.error("❌ API 요청 중 오류 발생:", error);
  }
};

// 데이터 가져오기 실행
fetchAllPages();

const regionRender = () => {
  if (!allPerformances || allPerformances.length === 0) {
      console.error("❌ 공연 데이터가 없습니다!");
      return;
  }

  // 중복을 제거한 지역만 뽑기
  const uniqueAreas = [...new Set(allPerformances.map((p) => p.area?.["#text"]))];
  
  console.log("🎭 지역 목록:", uniqueAreas);

  // "전지역"을 첫 번째 옵션으로 추가
  const regionHTML = [
    `<option value="all">전지역</option>`,
    ...uniqueAreas.map((area) => `<option value="${area}">${area}</option>`)
  ].join("");

  document.querySelector(".region-filter").innerHTML = regionHTML;
};



const applyRegionFilter = (event) => {
    currentPage = 1
  selectedRegion = event.target.value; // 선택된 지역 값 가져오기
  
  console.log("선택된 지역:", selectedRegion);

  // 지역에 맞는 공연만 필터링
  filteredPerformances = selectedRegion === "all" 
      ? allPerformances // "전지역"을 선택한 경우, 모든 공연을 표시
      : allPerformances.filter(performance => performance.area?.["#text"] === selectedRegion);

  // 필터링된 공연을 페이지에 렌더링
  renderPage(currentPage);
};


const applySortFilter = (event) => {
    selectedSort = event.target.value;
    console.log("선택된 정렬:", selectedSort);

    if (selectedSort === "1") { // 가나다순 정렬
        filteredPerformances.sort((a, b) => {
            const nameA = a.prfnm?.["#text"] || '';
            const nameB = b.prfnm?.["#text"] || '';
            return nameA.localeCompare(nameB); // 가나다순 정렬
        });
    } else if (selectedSort === "2") { // 날짜순 정렬
        filteredPerformances.sort((a, b) => {
            const dateA = new Date(a.prfpdfrom?.["#text"]);
            const dateB = new Date(b.prfpdfrom?.["#text"]);
            return dateA - dateB; // 날짜 오름차순 정렬
        });
    }

    // 정렬된 데이터로 페이지 렌더링
    renderPage(currentPage);
};



//list 뽑기//
const renderPage = (page) => {
  // 필터링된 공연 데이터에서 페이지에 해당하는 공연만 가져오기
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const performancesToRender = filteredPerformances.slice(start, end);
  console.log(performancesToRender)
  const container = document.querySelector(".performance-list");
  container.innerHTML = performancesToRender.map(performance => `
      <div class="col">
          <div class="list-item">
            <div class="list-img"><a href=""><img src="${performance.poster['#text']}" alt="공연이미지"></a></div>
                <div class="list-txt">
                    <div class="tit-bx">
                        <div class="d-flex justify-content-between>
                            <p class="tit">${performance.prfnm['#text']}</p>
                            <button><i class="fa-regular fa-heart"></i></button>
                        </div>
                        <p class="place">${performance.fcltynm['#text']}</p>
                    </div>
                    <p class="date">${performance.prfpdfrom['#text']} ~ ${performance.prfpdto['#text']}</p>
                </div>
          </div>
      </div>
  `).join("");

  renderPagination(); // 페이지네이션 갱신
};
//list 뽑기//


/* <div class="card-body">
<img src="${performance.poster?.["#text"] || 'no-image.jpg'}" class="card-img-top" alt="${performance.prfnm?.["#text"] || '공연명 없음'}">
<i class="fa-regular fa-heart"></i>
<h4>${performance.prfnm?.["#text"] || '공연명 없음'}</h4>
<p class="place">${performance.fcltynm?.["#text"]}</p>
<p class="date">${performance.prfpdfrom?.["#text"]} ~ ${performance.prfpdto?.["#text"]}</p>
</div> */


// 페이지네이션 렌더링 함수
const renderPagination = () => {
  const totalPages = Math.ceil(filteredPerformances.length / itemsPerPage);
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = `
      <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
          <a class="page-link" href="#" aria-label="Previous" onclick="changePage(${currentPage - 1})">
              <span aria-hidden="true">&laquo;</span>
          </a>
      </li>
      ${Array.from({ length: totalPages }, (_, i) => `
          <li class="page-item ${i + 1 === currentPage ? "active" : ""}">
              <a class="page-link" href="#" onclick="changePage(${i + 1})">${i + 1}</a>
          </li>
      `).join("")}
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
          <a class="page-link" href="#" aria-label="Next" onclick="changePage(${currentPage + 1})">
              <span aria-hidden="true">&raquo;</span>
          </a>
      </li>
  `;
};

// 페이지 변경 함수
const changePage = (page) => {
  const totalPages = Math.ceil(allPerformances.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderPage(currentPage);
};

