// 요소 선택 (상세 페이지에는 없는 요소가 있을 수 있으므로 null 체크를 위해 id 사용 추천)
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginForm = document.getElementById("modalLoginForm");
const signupForm = document.getElementById("modalSignupForm");
const greetingHeader = document.getElementById("greeting");

const USERS_KEY = "service_users";
const LOGGED_IN_NICKNAME = "current_nickname";

// [공통] 인사말 출력 및 버튼 제어
function paintGreeting(nickname) {
    if (greetingHeader) {
        greetingHeader.innerHTML = `안녕하세요! ${nickname}님 환영합니다.`;
    }
    // 버튼 존재 여부 확인 후 스타일 변경 (에러 방지)
    if (loginBtn) loginBtn.classList.add("hidden");
    if (signupBtn) signupBtn.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
}

// [회원가입 로직] - signupForm이 있을 때만 작동
if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("signupId").value;
        const pw = document.getElementById("signupPw").value;
        const nickname = document.getElementById("signupNickname").value;
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

        if (users.find(user => user.id === id)) {
            alert("이미 존재하는 아이디입니다.");
            return;
        }

        users.push({ id, pw, nickname });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        alert("회원가입 성공! 가입하신 정보로 로그인해주세요.");
        signupModal.style.display = "none";
        signupForm.reset();
    });
}

// [로그인 로직] - loginForm이 있을 때만 작동
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("loginId").value;
        const pw = document.getElementById("loginPw").value;
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const user = users.find(u => u.id === id && u.pw === pw);

        if (user) {
            localStorage.setItem(LOGGED_IN_NICKNAME, user.nickname);
            if (loginModal) loginModal.style.display = "none";
            paintGreeting(user.nickname);
            loginForm.reset();
        } else {
            alert("아이디 또는 비밀번호가 틀렸습니다.");
        }
    });
}

// [로그아웃 로직]
if (logoutBtn) {
    logoutBtn.onclick = () => {
        localStorage.removeItem(LOGGED_IN_NICKNAME);
        location.href = "index.html"; // 로그아웃 시 메인으로 이동
    };
}

// [모달 제어] - 버튼이 존재하는 페이지에서만 작동
if (loginBtn) loginBtn.onclick = () => {
    loginModal.style.display = "block";
};
if (signupBtn) signupBtn.onclick = () => signupModal.style.display = "block";

const loginClose = document.getElementById("loginClose");
const signupClose = document.getElementById("signupClose");
if (loginClose) loginClose.onclick = () => loginModal.style.display = "none";
if (signupClose) signupClose.onclick = () => signupModal.style.display = "none";

window.onclick = (e) => {
    if (e.target == loginModal) loginModal.style.display = "none";
    if (e.target == signupModal) signupModal.style.display = "none";
};

// [초기 로드] 어떤 페이지든 저장된 닉네임이 있으면 표시
const savedNickname = localStorage.getItem(LOGGED_IN_NICKNAME);
if (savedNickname) {
    paintGreeting(savedNickname);
}




// 🚨 여기에 Render에서 받은 본인의 URL을 넣으세요!
const SERVER_URL = 'https://my-auth-web.onrender.com';

async function register() {
    const username = document.getElementById('regUser').value;
    const password = document.getElementById('regPass').value;

    const res = await fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    alert(data.message || data.error);
}

async function login() {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    const res = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    alert(data.message || data.error);
}