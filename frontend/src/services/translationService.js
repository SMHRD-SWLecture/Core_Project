import axios from 'axios';

const API_BASE_URL = '/api';

export const translationService = {
  // 텍스트 번역
  translate: async (text, targetLang, sourceLang = 'auto') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/translate`, {
        text,
        target_lang: targetLang,
        source_lang: sourceLang
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || '번역 중 오류가 발생했습니다.');
    }
  },

  // 지원 언어 목록 조회
  getLanguages: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/languages`);
      return response.data;
    } catch (error) {
      throw new Error('지원 언어 목록을 가져오는데 실패했습니다.');
    }
  }
}; 