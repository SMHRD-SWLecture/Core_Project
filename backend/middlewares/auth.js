const jwt = require('jsonwebtoken');

/**
 * 사용자 인증 미들웨어
 * 요청의 Authorization 헤더에서 JWT 토큰을 검증하고, 사용자 정보를 요청에 추가합니다.
 */
module.exports = (req, res, next) => {
  // 토큰 가져오기
  const token = req.header('Authorization')?.split(' ')[1]; // "Bearer [token]" 형식에서 토큰 추출
  
  // 토큰이 없는 경우
  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
  }
  
  try {
    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // 검증된 사용자 정보를 요청 객체에 추가
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};