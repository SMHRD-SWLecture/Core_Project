/**
 * 이메일 유효성 검사
 * @param {string} email - 검사할 이메일 주소
 * @returns {boolean} 유효성 여부
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * 비밀번호 유효성 검사
   * 최소 6자 이상, 하나 이상의 숫자 포함
   * @param {string} password - 검사할 비밀번호
   * @returns {boolean} 유효성 여부
   */
  export const isValidPassword = (password) => {
    // 최소 6자 이상, 하나 이상의 숫자 포함
    return password.length >= 6 && /\d/.test(password);
  };
  
  /**
   * 비밀번호 강도 검사
   * @param {string} password - 검사할 비밀번호
   * @returns {string} 강도 ('weak', 'medium', 'strong')
   */
  export const checkPasswordStrength = (password) => {
    if (!password) return 'weak';
    
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < 6) return 'weak';
    if (password.length >= 8 && hasLetter && hasNumber && hasSpecialChar) return 'strong';
    return 'medium';
  };
  
  /**
   * 전화번호 유효성 검사 (한국 기준)
   * @param {string} phoneNumber - 검사할 전화번호
   * @returns {boolean} 유효성 여부
   */
  export const isValidPhoneNumber = (phoneNumber) => {
    // 숫자, 하이픈, 공백만 포함된 전화번호 확인 후 숫자만 추출
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // 한국 전화번호 길이 검사 (10-11자리)
    return cleaned.length >= 10 && cleaned.length <= 11;
  };
  
  /**
   * 사용자 이름 유효성 검사
   * 최소 2자 이상, 특수문자 제외
   * @param {string} username - 검사할 사용자 이름
   * @returns {boolean} 유효성 여부
   */
  export const isValidUsername = (username) => {
    // 특수문자 제외, 최소 2자 이상
    return username.length >= 2 && /^[a-zA-Z0-9_]+$/.test(username);
  };
  
  /**
   * 입력값이 비어있는지 검사
   * @param {string} value - 검사할 값
   * @returns {boolean} 비어있는지 여부
   */
  export const isEmpty = (value) => {
    return value === undefined || value === null || value.trim() === '';
  };
  
  /**
   * 가격 유효성 검사
   * @param {number|string} price - 검사할 가격
   * @returns {boolean} 유효성 여부
   */
  export const isValidPrice = (price) => {
    // 문자열이면 숫자로 변환
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // NaN 체크 및 양수 체크
    return !isNaN(numPrice) && numPrice >= 0;
  };
  
  /**
   * 입력 객체의 여러 필드 유효성 검사
   * @param {Object} input - 검사할 입력 객체
   * @param {Array} requiredFields - 필수 필드 배열
   * @returns {Object} { isValid, errors } 형태의 결과
   */
  export const validateForm = (input, requiredFields) => {
    const errors = {};
    
    // 필수 필드 확인
    requiredFields.forEach(field => {
      if (isEmpty(input[field])) {
        errors[field] = '필수 입력 항목입니다.';
      }
    });
    
    // 이메일 유효성 검사
    if (input.email && !isValidEmail(input.email)) {
      errors.email = '유효한 이메일 형식이 아닙니다.';
    }
    
    // 비밀번호 유효성 검사
    if (input.password && !isValidPassword(input.password)) {
      errors.password = '비밀번호는 최소 6자 이상, 숫자를 포함해야 합니다.';
    }
    
    // 비밀번호 확인 일치 검사
    if (input.confirmPassword && input.password !== input.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    
    // 전화번호 유효성 검사
    if (input.phoneNumber && !isValidPhoneNumber(input.phoneNumber)) {
      errors.phoneNumber = '유효한 전화번호 형식이 아닙니다.';
    }
    
    // 사용자 이름 유효성 검사
    if (input.username && !isValidUsername(input.username)) {
      errors.username = '사용자 이름은 영문, 숫자, 언더스코어만 사용 가능합니다.';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };