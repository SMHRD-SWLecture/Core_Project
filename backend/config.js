require('dotenv').config();

module.exports = {
  // 서버 설정
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // 데이터베이스 설정
  db: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/qr-order-service',
  },
  
  // JWT 설정
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  
  // CORS 설정
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  
  // 번역 서비스 설정
  translationService: {
    url: process.env.TRANSLATION_SERVICE_URL || 'http://localhost:5001',
  },
}; 