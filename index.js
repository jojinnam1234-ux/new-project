const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// DB 연결 (Supabase 연결 정보)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// [회원가입 API] - 닉네임 저장 로직 확인!
app.post('/register', async (req, res) => {
    // 1. 프론트엔드(login.js)에서 보낸 3가지 데이터를 받습니다.
    const { username, password, nickname } = req.body;

    try {
        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. DB에 저장 (nickname 컬럼과 $3이 반드시 있어야 함)
        const result = await pool.query(
            'INSERT INTO users (username, password, nickname) VALUES ($1, $2, $3) RETURNING id, nickname',
            [username, hashedPassword, nickname] // 세 번째 인자로 nickname을 전달!
        );

        console.log("회원가입 성공:", result.rows[0]);
        res.status(201).json({
            message: "회원가입 성공!",
            userId: result.rows[0].id
        });
    } catch (err) {
        console.error("회원가입 에러 상세:", err);
        res.status(500).json({ error: "아이디 중복 또는 DB 오류" });
    }
});

// [로그인 API] - 닉네임 불러오기 확인!
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (validPassword) {
                // 로그인 성공 시 DB에 저장된 nickname을 프론트로 보냄
                res.json({
                    message: "로그인 성공!",
                    nickname: user.nickname // DB의 nickname 컬럼값을 가져옴
                });
            } else {
                res.status(401).json({ error: "비밀번호 불일치" });
            }
        } else {
            res.status(404).json({ error: "사용자 없음" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`서버 실행 중: ${PORT}`));