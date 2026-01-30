// 🚨 본인의 실제 Render 서버 URL로 수정하세요!
const SERVER_URL = 'https://my-auth-web.onrender.com';
const LOGGED_IN_NICKNAME = "current_nickname";

/**
 * 1. UI 업데이트 함수
 * 로그인 상태에 따라 버튼을 숨기거나 인사말을 표시합니다.
 */
function paintUI(nickname) {
    const greetingHeader = document.getElementById("greeting");
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (greetingHeader) {
        greetingHeader.innerText = `안녕하세요! ${nickname}님 환영합니다. ✨`;
    }

    // 버튼들의 존재 여부를 확인(null 체크) 후 상태 변경
    if (loginBtn) loginBtn.classList.add("hidden");
    if (signupBtn) signupBtn.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
}

/**
 * 2. 회원가입 로직
 */
const signupForm = document.getElementById("modalSignupForm");
if (signupForm) {
    signupForm.onsubmit = async (e) => {
        e.preventDefault();

        const username = document.getElementById("signupId").value;
        const password = document.getElementById("signupPw").value;
        const nickname = document.getElementById("signupNickname").value;

        try {
            const res = await fetch(`${SERVER_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, nickname })
            });

            const data = await res.json();

            if (res.ok) {
                alert("회원가입이 완료되었습니다! 로그인해 주세요.");
                document.getElementById("signupModal").style.display = "none";
                signupForm.reset();
            } else {
                alert(data.error || "회원가입 실패");
            }
        } catch (err) {
            console.error("회원가입 에러:", err);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };
}

/**
 * 3. 로그인 로직
 */
const loginForm = document.getElementById("modalLoginForm");
if (loginForm) {
    loginForm.onsubmit = async (e) => {
        e.preventDefault();

        const username = document.getElementById("loginId").value;
        const password = document.getElementById("loginPw").value;

        try {
            const res = await fetch(`${SERVER_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                // 서버에서 돌려준 nickname을 로컬 스토리지에 저장
                localStorage.setItem(LOGGED_IN_NICKNAME, data.nickname);
                paintUI(data.nickname);
                document.getElementById("loginModal").style.display = "none";
                loginForm.reset();
            } else {
                alert(data.error || "로그인 실패");
            }
        } catch (err) {
            console.error("로그인 에러:", err);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };
}

/**
 * 4. 모달 제어 (열기/닫기)
 */
const loginBtn = document.getElementById