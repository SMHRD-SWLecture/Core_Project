/**
 * 숫자를 통화 형식으로 포맷팅
 * @param {number} amount - 포맷팅할 금액
 * @param {string} currency - 통화 코드 (기본값: 'KRW')
 * @param {string} locale - 로케일 (기본값: 'ko-KR')
 * @returns {string} 포맷팅된 금액 문자열
 */
export const formatCurrency = (amount, currency = 'KRW', locale = 'ko-KR') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  /**
   * 금액을 원화 형식으로 포맷팅 (심플 버전)
   * @param {number} amount - 포맷팅할 금액
   * @returns {string} 포맷팅된 금액 문자열 (예: '10,000원')
   */
  export const formatKRW = (amount) => {
    return `${amount.toLocaleString()}원`;
  };
  
  /**
   * ISO 날짜 문자열을 사용자 친화적인 형식으로 포맷팅
   * @param {string} isoString - ISO 형식 날짜 문자열
   * @param {string} locale - 로케일 (기본값: 'ko-KR')
   * @returns {string} 포맷팅된 날짜 문자열
   */
  export const formatDate = (isoString, locale = 'ko-KR') => {
    const date = new Date(isoString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /**
   * ISO 날짜 문자열을 시간 포함 형식으로 포맷팅
   * @param {string} isoString - ISO 형식 날짜 문자열
   * @param {string} locale - 로케일 (기본값: 'ko-KR')
   * @returns {string} 포맷팅된 날짜 및 시간 문자열
   */
  export const formatDateTime = (isoString, locale = 'ko-KR') => {
    const date = new Date(isoString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * 주문 상태를 사용자 친화적인 텍스트로 변환
   * @param {string} status - 주문 상태 코드
   * @param {Object} translations - 번역 객체
   * @returns {string} 변환된 상태 텍스트
   */
  export const formatOrderStatus = (status, translations = {}) => {
    const statusMap = {
      pending: translations.pending || '대기 중',
      accepted: translations.accepted || '접수됨',
      preparing: translations.preparing || '준비 중',
      ready: translations.ready || '준비 완료',
      completed: translations.completed || '배달 완료',
      cancelled: translations.cancelled || '취소됨'
    };
    
    return statusMap[status] || status;
  };
  
  /**
   * 주문 상태에 따른 배경색 클래스 반환
   * @param {string} status - 주문 상태 코드
   * @returns {string} 배경색 Tailwind 클래스
   */
  export const getStatusColorClass = (status) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };
  
  /**
   * 전화번호 포맷팅 (한국 번호 기준)
   * @param {string} phoneNumber - 포맷팅할 전화번호
   * @returns {string} 포맷팅된 전화번호
   */
  export const formatPhoneNumber = (phoneNumber) => {
    // 숫자만 추출
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    
    // 길이에 따라 다른 형식 적용
    if (cleaned.length === 11) {
      // 010-1234-5678 형식
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 10) {
      // 02-123-4567 또는 010-123-4567 형식
      if (cleaned.startsWith('02')) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
      }
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    
    // 변환할 수 없는 경우 원본 반환
    return phoneNumber;
  };
  
  /**
   * 주소 요약 (긴 주소를 요약하여 표시)
   * @param {string} address - 전체 주소
   * @param {number} maxLength - 최대 길이 (기본값: 20)
   * @returns {string} 요약된 주소
   */
  export const summarizeAddress = (address, maxLength = 20) => {
    if (!address) return '';
    if (address.length <= maxLength) return address;
    
    return address.substring(0, maxLength) + '...';
  };