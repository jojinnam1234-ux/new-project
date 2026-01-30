/**
 * [최종 수정본] login.js
 * 1. 모달 제어 보강
 * 2. 폼 제출(submit) 이벤트 안정화
 * 3. 서버 통신 디버깅 로그 추가
 */

// 🚨 본인의 실제 Render 서버 URL로 반드시 수정하세요!
const SERVER_URL = 'https://my-auth-web.onrender.com';
const LOGGED_IN_NICKNAME = "current_nickname";

/**
 * UI 업데이트: 로그인 상태에 따라 버튼과 인사말 표시
 */
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

// 모든 로직은 HTML이 완전히 로드된 후 실행됩니다.
window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM 로드 완료 - 스크립트 시작");

    // 1. 요소 선택
    const loginModal = document.getElementById("loginModal");
    const signupModal = document.getElementById("signupModal");
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const loginForm = document.getElementById("modalLoginForm");
    const signupForm = document.getElementById("modalSignupForm");

    // 2. 모달 열기 이벤트
    if (loginBtn) {
        loginBtn.onclick = () => { loginModal.style.display = "block"; };
    }
    if (signupBtn) {
        signupBtn.onclick = () => { signupModal.style.display = "block"; };
    }

    // 3. 모달 닫기 이벤트
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

    // 4. 회원가입 제출 로직 (핵심 수정 부분)
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // 페이지 새로고침 방지
            console.log("회원가입 전송 시도...");

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
                console.log("서버 응답 데이터:", data);

                if (res.ok) {
                    alert("회원가입 성공! 가입하신 정보로 로그인해주세요.");
                    signupModal.style.display = "none";
                    signupForm.reset();
                } else {
                    alert("가입 실패: " + (data.error || "알 수 없는 오류"));
                }
            } catch (err) {
                console.error("네트워크 에러:", err);
                alert("서버 연결 실패! 서버 주소와 인터넷 연결을 확인하세요.");
            }
        });
    }

    // 5. 로그인 제출 로직
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("로그인 시도...");

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
                    alert("로그인 실패: " + (data.error || "비밀번호를 확인하세요."));
                }
            } catch (err) {
                console.error("네트워크 에러:", err);
                alert("서버 연결 실패!");
            }
        });
    }

    // 6. 로그아웃 로직
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem(LOGGED_IN_NICKNAME);
            alert("로그아웃 되었습니다.");
            location.href = "index.html";
        };
    }

    // 7. 페이지 로드 시 로그인 유지 확인
    const savedNickname = localStorage.getItem(LOGGED_IN_NICKNAME);
    if (savedNickname) {
        paintUI(savedNickname);
    }
});