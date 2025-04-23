const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    사용자 회원가입
 * @access  Public
 */
router.post(
  '/register',
  [
    // 입력값 검증
    body('username').not().isEmpty().withMessage('아이디는 필수 입력값입니다.'),
    body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
    body('email').isEmail().withMessage('유효한 이메일 형식이 아닙니다.'),
    body('name').not().isEmpty().withMessage('이름은 필수 입력값입니다.')
  ],
  async (req, res) => {
    // 입력값 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email, name, phoneNumber, country } = req.body;

    try {
      const db = req.db;
      
      // 아이디 중복 확인
      const [existingUser] = await db.execute(
        'SELECT * FROM USERS WHERE username = ?',
        [username]
      );
      
      if (existingUser.length > 0) {
        return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });
      }
      
      // 이메일 중복 확인
      const [existingEmail] = await db.execute(
        'SELECT * FROM USERS WHERE email = ?',
        [email]
      );
      
      if (existingEmail.length > 0) {
        return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
      }
      
      // 비밀번호 해싱
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // 사용자 등록
      const [result] = await db.execute(
        `INSERT INTO USERS 
        (username, password, name, email, phone_number, country_id, user_type_id) 
        VALUES (?, ?, ?, ?, ?, (SELECT country_id FROM COUNTRY WHERE language_code = ?), 1)`,
        [username, hashedPassword, name, email, phoneNumber, country || 'ko']
      );
      
      res.status(201).json({
        message: '회원가입이 완료되었습니다.',
        userId: result.insertId
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    사용자 로그인 및 토큰 발급
 * @access  Public
 */
router.post(
  '/login',
  [
    body('username').not().isEmpty().withMessage('아이디를 입력해주세요.'),
    body('password').not().isEmpty().withMessage('비밀번호를 입력해주세요.')
  ],
  async (req, res) => {
    // 입력값 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const db = req.db;
      
      // 사용자 조회
      const [users] = await db.execute(
        `SELECT u.*, c.language_code 
         FROM USERS u 
         LEFT JOIN COUNTRY c ON u.country_id = c.country_id 
         WHERE u.username = ?`,
        [username]
      );
      
      if (users.length === 0) {
        return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
      }
      
      const user = users[0];
      
      // 비밀번호 확인
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
      }
      
      // JWT 토큰 생성
      const token = jwt.sign(
        { id: user.user_id, username: user.username },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1d' }
      );
      
      // 사용자 정보에서 비밀번호 제외
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        token,
        user: userWithoutPassword
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
);

module.exports = router;