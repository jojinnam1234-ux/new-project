/**
 * [수정본] login.js - 통합 관리 스크립트
 */

// 🚨 본인의 실제 Render 서버 URL을 넣으세요.
const SERVER_URL = 'https://my-auth-web.onrender.com';
const LOGGED_IN_NICKNAME = "current_nickname";

// --- UI 업데이트 함수 ---
function paintUI(nickname) {
    const greetingHeader = document.getElementById("greeting");
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (greetingHeader) {
        greetingHeader.innerText = `안녕하세요! ${nickname}님 환영합니다. ✨`;
    }

    if (loginBtn) loginBtn.classList.add("hidden");
    if (signupBtn) signupBtn.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
}

// --- 메인 로직 (HTML 로드 후 실행) ---
window.addEventListener("DOMContentLoaded", () => {
    // 1. 요소 선택
    const loginModal = document.getElementById("loginModal");
    const signupModal = document.getElementById("signupModal");
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const loginForm = document.getElementById("modalLoginForm");
    const signupForm = document.getElementById("modalSignupForm");

    // 2. 모달 열기 버튼 이벤트
    if (loginBtn) {
        loginBtn.onclick = () => {
            loginModal.style.display = "block";
        };
    }

    if (signupBtn) {
        signupBtn.onclick = () => {
            signupModal.style.display = "block";
        };
    }

    // 3. 모달 닫기 로직 (공통)
    document.querySelectorAll(".close-btn").forEach(btn => {
        btn.onclick = () => {
            if (loginModal) loginModal.style.display = "none";
            if (signupModal) signupModal.style.display = "none";
        };
    });

    window.onclick = (e) => {
        if (e.target === loginModal) loginModal.style.display = "none";
        if (e.target === signupModal) signupModal.style.display = "none";
    };

    // 4. 회원가입 제출 (서버 통신)
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
                    alert("회원가입 성공! 이제 로그인해 주세요.");
                    signupModal.style.display = "none";
                    signupForm.reset();
                } else {
                    alert(data.error || "회원가입 실패");
                }
            } catch (err) {
                alert("서버 연결에 실패했습니다.");
            }
        };
    }

    // 5. 로그인 제출 (서버 통신)
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
                    localStorage.setItem(LOGGED_IN_NICKNAME, data.nickname);
                    paintUI(data.nickname);
                    loginModal.style.display = "none";
                    loginForm.reset();
                } else {
                    alert(data.error || "로그인 실패");
                }
            } catch (err) {
                alert("서버 연결 실패");
            }
        };
    }

    // 6. 로그아웃
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem(LOGGED_IN_NICKNAME);
            alert("로그아웃 되었습니다.");
            location.href = "index.html";
        };
    }

    // 7. 초기 로그인 상태 체크
    const savedNickname = localStorage.getItem(LOGGED_IN_NICKNAME);
    if (savedNickname) {
        paintUI(savedNickname);
    }
});