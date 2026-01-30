/**
 * db.js
 * 로컬 스토리지와 관련된 보조 데이터 관리 로직을 담당합니다.
 */

let DBLists = [];

/**
 * 1. 로컬 스토리지에 특정 키로 데이터를 저장하는 함수
 * @param {string} key - 저장할 키 이름
 * @param {any} value - 저장할 값 (객체나 배열은 자동으로 JSON화)
 */
function saveToLocalStorage(key, value) {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
        console.log(`[DB] ${key} 데이터가 로컬에 저장되었습니다.`);
    } catch (e) {
        console.error("[DB] 로컬 스토리지 저장 중 오류 발생:", e);
    }
}

/**
 * 2. 로컬 스토리지에서 데이터를 불러오는 함수
 * @param {string} key - 불러올 키 이름
 * @returns {any} - 불러온 데이터 (없으면 null)
 */
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("[DB] 로컬 스토리지 로드 중 오류 발생:", e);
        return null;
    }
}

/**
 * 3. 사용자 행동 로그나 임시 데이터를 메모리에 저장하는 예시 함수
 */
function updateDBList(item) {
    DBLists.push(item);
    console.log("[DB] 현재 메모리 리스트:", DBLists);
    // 필요 시 로컬 스토리지와 동기화
    saveToLocalStorage("temp_activity_log", DBLists);
}

// 외부에서 사용할 수 있도록 노출 (필요 시)
// 만약 다른 스크립트에서 호출하려면 login.js보다 먼저 로드되어야 합니다.