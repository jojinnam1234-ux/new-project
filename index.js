const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 미들웨어 설정 ---
app.use(cors()); // 다른 도메인(프론트엔드)에서의 요청 허용
app.use(express.json()); // JSON 데이터 파싱
app.use(express.static('public')); // public 폴더의 정적 파일 제공

// --- DB 연결 설정 (PostgreSQL) ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Render/Heroku 등 클라우드 DB 연결 필수 설정
    }
});

// --- API 경로 (Routes) ---

/**
 * 1. 회원가입 API
 * ID, PW, Nickname을 받아 비밀번호를 암호화하여 DB에 저장합니다.
 */
app.post('/register', async (req, res) => {
    const { username, password, nickname } = req.body;

    try {
        // 비밀번호 암호화 (Salt round: 10)
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, password, nickname) VALUES ($1, $2, $3) RETURNING id',
            [username, hashedPassword, nickname]
        );

        res.status(201).json({
            message: "회원가입 성공!",
            userId: result.rows[0].id
        });
    } catch (err) {
        console.error("회원가입 에러:", err);
        res.status(500).json({
            error: "아이디가 이미 존재하거나 데이터베이스 오류가 발생했습니다."
        });
    }
});

/**
 * 2. 로그인 API
 * ID를 조회하고 암호화된 비밀번호를 비교합니다.
 * 성공 시 DB에 저장된 nickname을 반환합니다.
 */
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            // 암호화된 비밀번호 비교
            const validPassword = await bcrypt.compare(password, user.password);

            if (validPassword) {
                // 로그인 성공 시 닉네임을 함께 응답
                res.json({
                    message: "로그인 성공! 환영합니다.",
                    nickname: user.nickname
                });
            } else {
                res.status(401).json({ error: "비밀번호가 틀렸습니다." });
            }
        } else {
            res.status(404).json({ error: "존재하지 않는 사용자입니다." });
        }
    } catch (err) {
        console.error("로그인 에러:", err);
        res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
    }
});

// --- 서버 실행 ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ 서버가 포트 ${PORT}에서 정상 실행 중입니다.`);
});