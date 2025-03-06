const apiKey = `d98d9402f26042ed994300072acd892e`;
const perfID = `PF260373`;

let perfInfo = [];

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

    //공연상세정보를 객체에 담아서 배열에 push하기
    let perfData = {
      id: perfDB.getElementsByTagName("mt20id")[0]?.textContent || "",
      name: perfDB.getElementsByTagName("prfnm")[0]?.textContent || "",
      startDate: perfDB.getElementsByTagName("prfpdfrom")[0]?.textContent || "",
      endDate: perfDB.getElementsByTagName("prfpdto")[0]?.textContent || "",
      area: perfDB.getElementsByTagName("area")[0]?.textContent || "",
      venue: perfDB.getElementsByTagName("fcltynm")[0]?.textContent || "",
      runtime: perfDB.getElementsByTagName("prfruntime")[0]?.textContent || "",
      price: perfDB.getElementsByTagName("pcseguidance")[0]?.textContent || "",
      poster: perfDB.getElementsByTagName("poster")[0]?.textContent || "",
      genre: perfDB.getElementsByTagName("genrenm")[0]?.textContent || "",
      status: perfDB.getElementsByTagName("prfstate")[0]?.textContent || "",
      age: perfDB.getElementsByTagName("prfage")[0]?.textContent || "",
      starring: perfDB.getElementsByTagName("prfcrew")[0]?.textContent || "",
    };

    perfInfo.push(perfData);
  } catch (error) {
    console.error("오류 발생:", error.message);
    // renderError(error.message); // 화면에 에러 표시하는 함수 (이따 구현해야댐)
  }

  renderDetail();
};

//공연 상세정보 화면에 보여주기
const renderDetail = () => {
  const titleHTML = perfInfo.map((item) => {
    return `              <div class="product-name-wrap">
                <h2>${item.name}</h2>
              </div>
              <div class="product-name-wrap">
                <div>${item.area}</div>
                <div>${item.age}</div>
              </div>`;
  });

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

  document.querySelector("#perf-title").innerHTML = titleHTML;
  document.querySelector("#perf-detail").innerHTML = detailHTML;
};

getPerfDetail();
