const profileItem = document.querySelectorAll(".profile-item");
const profileInfo = document.querySelectorAll(".profile-info div");
const pencilIcon = document.querySelectorAll(".profile i");
const profileIMG = document.querySelector(".profile-img");
const inputFile = document.getElementById("input-file");
const myProfile = {
  // 프로필 객체
  name: "코알누",
  birth: "2006.03.09",
  phone: "010-1234-5678",
  email: "codingnoona@gmail.com",
};
let isEditable = [false, false, false, false]; // 각 항목별 편집 활성화 여부 체크용 배열

// 프로필 이미지 주소값
export let imgRoot = "https://static.vecteezy.com/system/resources/thumbnails/013/360/247/small/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg";

// 연필 버튼 클릭 이벤트
pencilIcon.forEach((item, index) => {
  item.addEventListener("click", () => {
    // 편집을 눌렀을 때
    if (isEditable[index] === false) {
      profileItem[index].contentEditable = "true";
      profileInfo[index].style.borderColor = "#00a9ff";
      profileItem[index].textContent = "";
      item.style.color = "#00a9ff";
      isEditable[index] = true;
    } else {
      // 편집 완료를 눌렀을 때
      if (profileRender(index)) { // 유효성 검사 후 렌더가 되고 true 를 반환받았을때
        window.localStorage.setItem("profile", JSON.stringify(myProfile)); // 로컬 스토리지에 프로필 객체 저장
        profileItem[index].contentEditable = "false";
        profileInfo[index].style.borderColor = "lightgray";
        item.style.color = "gray";
        isEditable[index] = false;
      }
    }
  });
});

profileItem.forEach((item, index) => {
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("enter");
    }
  });
});

// 프로필 사진 변경 이벤트
inputFile.addEventListener("change", () => {
  const fReader = new FileReader();
  fReader.readAsDataURL(inputFile.files[0]);
  fReader.onloadend = (event) => {
    profileIMG.style.backgroundImage = `url(${event.target.result})`;
    imgRoot = event.target.result;
    window.localStorage.setItem("imgAdress", imgRoot);
  };
});

// 공통된 유효성 체크 항목
const trueCheck = (index, key) => {
  if (!profileItem[index].textContent) {
    alert(`${key} 은/는 빈칸으로 둘 수 없습니다.`);
    return false;
  }
  if (profileItem[index].textContent.includes(" ")) {
    alert("공백 문자는 사용할 수 없습니다.");
    return false;
  }
};

// 작성한 프로필 유효성 체크하고 렌더하는 함수
const profileRender = (index) => {
  if (index === 0) {
    // 이름을 변경했을때
    if (trueCheck(index, "이름") === false) {
      return false;
    }
    if (
      profileItem[index].textContent.length < 2 ||
      profileItem[index].textContent.length > 6
    ) {
      alert("2 ~ 6 글자 사이만 입력할 수 있습니다.");
      return false;
    }
    // 프로필 객체에 저장
    myProfile.name = profileItem[index].textContent;
    return true;
  }
  if (index === 1) {
    // 생년월일을 변경했을때
    if (trueCheck(index, "생년월일") === false) {
      return false;
    }
    if (profileItem[index].textContent.length != 8) {
      alert("8글자 생년월일을 입력 하십시오.");
      return false;
    }
    let birthList = profileItem[index].textContent.split("");
    if (
      birthList[0] <= 0 ||
      birthList[0] >= 3 ||
      birthList[1] < 0 ||
      birthList[2] < 0 ||
      birthList[3] < 0 ||
      birthList[4] < 0 ||
      birthList[4] > 1 ||
      birthList[5] < 0 ||
      birthList[6] < 0 ||
      birthList[6] > 3 ||
      birthList[7] < 0
    ) {
      alert("해당 생년월일은 입력할 수 없습니다.");
      return false;
    }
    if (birthList[6] === 3 && birthList[7] > 1) {
      alert("해당 생년월일은 입력할 수 없습니다.");
      return false;
    }
    // 년.월.일 형식으로 렌더, 프로필 객체에 저장
    let year = "";
    let month = "";
    let day = "";
    for (let i = 0; i < birthList.length; i++) {
      if (i <= 3) {
        year += birthList[i];
      } else if (i <= 5) {
        month += birthList[i];
      } else {
        day += birthList[i];
      }
    }
    myProfile.birth = `${year}.${month}.${day}`;
    profileItem[index].textContent = myProfile.birth;
    return true;
  }
  if (index === 2) {
    // 전화번호를 변경했을때
    if (trueCheck(index, "전화번호") === false) {
      return false;
    }
    if (profileItem[index].textContent.includes("-")) {
      alert("- 를 제외한 전화번호 11자리를 입력 하십시오.");
      return false;
    }
    if (profileItem[index].textContent.length !== 11) {
      alert("11자리 전화번호를 입력 하십시오.");
      return false;
    }
    let phoneList = profileItem[index].textContent.split("");
    if (
      phoneList[0] != 0 ||
      phoneList[1] != 1 ||
      phoneList[2] != 0 ||
      phoneList[3] < 0 ||
      phoneList[4] < 0 ||
      phoneList[5] < 0 ||
      phoneList[6] < 0 ||
      phoneList[7] < 0 ||
      phoneList[8] < 0 ||
      phoneList[9] < 0 ||
      phoneList[10] < 0
    ) {
      alert("해당 전화번호는 입력할 수 없습니다.");
      return false;
    }
    // 000 - 0000 - 0000 형식으로 렌더, 프로필 객체에 저장
    let firstNum = "";
    let secondNum = "";
    let thirdNum = "";
    for (let i = 0; i < phoneList.length; i++) {
      if (i <= 2) {
        firstNum += phoneList[i];
      } else if (i <= 6) {
        secondNum += phoneList[i];
      } else {
        thirdNum += phoneList[i];
      }
    }
    myProfile.phone = `${firstNum}-${secondNum}-${thirdNum}`;
    profileItem[index].textContent = myProfile.phone;
    return true;
  }
  if (index === 3) {
    // 이메일을 변경했을때
    if (trueCheck(index, "이메일") === false) {
      return false;
    }
    if (
      profileItem[index].textContent.includes("@") === false ||
      profileItem[index].textContent.includes(".") === false
    ) {
      alert("올바른 이메일을 입력 하십시오.");
      return false;
    }
    // 프로필 객체에 저장
    myProfile.email = profileItem[index].textContent;
    return true;
  }
};

if (window.localStorage.getItem("profile") === null) { // 로컬 스토리지가 비어있을 경우 (프로필 설정을 한번도 안한 경우)
  window.localStorage.setItem("profile", JSON.stringify(myProfile)); // 로컬 스토리지를 디폴트 값으로 저장
}
if (window.localStorage.getItem("imgAdress") === null) { // 이미지 스토리지가 비어있을 경우
  window.localStorage.setItem("imgAdress", imgRoot); // 이미지 스토리지를 디폴트 값으로 저장
}

for(let i = 0; i <= 3; i++) { // 로컬 스토리지에 저장되어있는 객체를 가져와서 프로필에 렌더
  if (i === 0) {
    profileItem[i].textContent = JSON.parse(window.localStorage.getItem("profile")).name;
  } else if (i === 1) {
    profileItem[i].textContent = JSON.parse(window.localStorage.getItem("profile")).birth;
  } else if (i === 2) {
    profileItem[i].textContent = JSON.parse(window.localStorage.getItem("profile")).phone;
  } else {
    profileItem[i].textContent = JSON.parse(window.localStorage.getItem("profile")).email;
  }
}
profileIMG.style.backgroundImage = `url(${window.localStorage.getItem("imgAdress")})`; // 프로필 이미지 렌더