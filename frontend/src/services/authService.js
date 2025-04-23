import api from './api';

/**
 * 사용자 등록 (회원가입)
 * @param {Object} userData - 사용자 등록 데이터
 * @returns {Promise<Object>} 등록 결과
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

/**
 * 사용자 로그인
 * @param {string} username - 사용자 아이디
 * @param {string} password - 비밀번호
 * @returns {Promise<Object>} 로그인 결과 (토큰 및 사용자 정보)
 */
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    
    // 토큰 저장
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    
    // axios 헤더에 토큰 설정
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { token, user };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * 사용자 로그아웃
 */
export const logout = () => {
  // 토큰 제거
  localStorage.removeItem('token');
  
  // axios 헤더에서 인증 제거
  delete api.defaults.headers.common['Authorization'];
};

/**
 * 현재 사용자 정보 가져오기
 * @returns {Promise<Object>} 사용자 정보
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

/**
 * 사용자 정보 업데이트
 * @param {Object} userData - 업데이트할 사용자 데이터
 * @returns {Promise<Object>} 업데이트 결과
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * 비밀번호 변경
 * @param {string} currentPassword - 현재 비밀번호
 * @param {string} newPassword - 새 비밀번호
 * @returns {Promise<Object>} 변경 결과
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/users/password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

/**
 * 비밀번호 재설정 요청 (이메일 발송)
 * @param {string} email - 사용자 이메일
 * @returns {Promise<Object>} 요청 결과
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/password-reset-request', { email });
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

/**
 * 비밀번호 재설정 (토큰 확인 후)
 * @param {string} token - 비밀번호 재설정 토큰
 * @param {string} newPassword - 새 비밀번호
 * @returns {Promise<Object>} 재설정 결과
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/password-reset', { token, newPassword });
    return response.data;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * 구글 OAuth 로그인
 * @param {string} accessToken - 구글 액세스 토큰
 * @returns {Promise<Object>} 로그인 결과
 */
export const googleLogin = async (accessToken) => {
  try {
    const response = await api.post('/auth/google', { access_token: accessToken });
    
    // 토큰 저장
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    
    // axios 헤더에 토큰 설정
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { token, user };
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  googleLogin
};