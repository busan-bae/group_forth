
  /* 슬라이드 5개 보임 */
  const render = () => {
    let mainslHTML = "";
    let listHTML = "";
    
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
    for (let i = 1; i <= 10; i++) {
      listHTML += `
          <div class="swiper-slide list-item">
                      <div class="list-img"><img src="/img/testpost.jpg" alt="공연이미지"></div>
                      <div class="list-txt">
                          <p class="tit">공연명${i}</p>
                          <p class="place">공연장소</p>
                          <p class="date">공연날짜</p>
                      </div>
                  </div>
      `
    }
    document.querySelector(".main-cont-bx").innerHTML = listHTML;
    console.log(listHTML)
    document.querySelector(".mainsl-bx").innerHTML = mainslHTML;
    
};

render();


/* s : 메인슬라이드(.mainsl-area) 스와이퍼 */
var mainslSwiper = new Swiper(".mainsl-area", {
    slidesPerView:1,
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
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
});
/* e : 메인 슬라이드 스와이퍼 */