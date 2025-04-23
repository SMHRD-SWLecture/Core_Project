import axios from 'axios';

// API 기본 URL 설정
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TRANSLATION_API_URL = process.env.REACT_APP_TRANSLATION_API_URL || 'http://localhost:5001/api';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 번역 서비스용 axios 인스턴스
const translationApi = axios.create({
  baseURL: TRANSLATION_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터 설정 - 요청 전에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정 - 토큰 만료 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 인증 오류(401)인 경우 로그아웃 처리
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 식당 API
export const fetchRestaurants = async () => {
  const response = await api.get('/restaurants');
  return response.data;
};

export const fetchRestaurantById = async (id) => {
  const response = await api.get(`/restaurants/${id}`);
  return response.data;
};

export const fetchRestaurantMenus = async (restaurantId) => {
  const response = await api.get(`/restaurants/${restaurantId}/menus`);
  return response.data;
};

// 메뉴 API
export const fetchMenuById = async (id) => {
  const response = await api.get(`/menus/${id}`);
  return response.data;
};

export const createMenu = async (menuData) => {
  const response = await api.post('/menus', menuData);
  return response.data;
};

export const updateMenu = async (id, menuData) => {
  const response = await api.put(`/menus/${id}`, menuData);
  return response.data;
};

export const deleteMenu = async (id) => {
  const response = await api.delete(`/menus/${id}`);
  return response.data;
};

// 주문 API
export const fetchOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const fetchOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

// 카테고리 API
export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// 번역 API
export const translateText = async (text, sourceLang = 'ko', targetLang) => {
  const response = await translationApi.post('/translate', {
    text,
    source_lang: sourceLang,
    target_lang: targetLang
  });
  return response.data;
};

export const translateBatch = async (items, sourceLang = 'ko', targetLang) => {
  const response = await translationApi.post('/translate/batch', {
    items,
    source_lang: sourceLang,
    target_lang: targetLang
  });
  return response.data;
};

export default api;