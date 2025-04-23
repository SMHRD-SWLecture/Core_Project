import api from './api';

/**
 * 모든 식당 조회
 * @param {Object} params - 검색 매개변수 (선택사항)
 * @returns {Promise<Array>} 식당 목록
 */
export const getAllRestaurants = async (params = {}) => {
  try {
    const response = await api.get('/restaurants', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch restaurants error:', error);
    throw error;
  }
};

/**
 * 특정 식당 조회
 * @param {number|string} id - 식당 ID
 * @returns {Promise<Object>} 식당 정보
 */
export const getRestaurantById = async (id) => {
  try {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Fetch restaurant ${id} error:`, error);
    throw error;
  }
};

/**
 * 식당의 메뉴 목록 조회
 * @param {number|string} restaurantId - 식당 ID
 * @returns {Promise<Array>} 메뉴 목록
 */
export const getRestaurantMenus = async (restaurantId) => {
  try {
    const response = await api.get(`/restaurants/${restaurantId}/menus`);
    return response.data;
  } catch (error) {
    console.error(`Fetch restaurant ${restaurantId} menus error:`, error);
    throw error;
  }
};

/**
 * 식당 등록
 * @param {Object} restaurantData - 식당 등록 데이터
 * @returns {Promise<Object>} 등록 결과
 */
export const createRestaurant = async (restaurantData) => {
  try {
    const response = await api.post('/restaurants', restaurantData);
    return response.data;
  } catch (error) {
    console.error('Create restaurant error:', error);
    throw error;
  }
};

/**
 * 식당 정보 수정
 * @param {number|string} id - 식당 ID
 * @param {Object} restaurantData - 수정할 식당 데이터
 * @returns {Promise<Object>} 수정 결과
 */
export const updateRestaurant = async (id, restaurantData) => {
  try {
    const response = await api.put(`/restaurants/${id}`, restaurantData);
    return response.data;
  } catch (error) {
    console.error(`Update restaurant ${id} error:`, error);
    throw error;
  }
};

/**
 * 식당 삭제
 * @param {number|string} id - 식당 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteRestaurant = async (id) => {
  try {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Delete restaurant ${id} error:`, error);
    throw error;
  }
};

/**
 * 식당 영업시간 설정
 * @param {number|string} restaurantId - 식당 ID
 * @param {Array} hoursData - 영업시간 데이터
 * @returns {Promise<Object>} 설정 결과
 */
export const setRestaurantHours = async (restaurantId, hoursData) => {
  try {
    const response = await api.post(`/restaurants/${restaurantId}/hours`, { hours: hoursData });
    return response.data;
  } catch (error) {
    console.error(`Set restaurant ${restaurantId} hours error:`, error);
    throw error;
  }
};

/**
 * 식당 리뷰 조회
 * @param {number|string} restaurantId - 식당 ID
 * @returns {Promise<Array>} 리뷰 목록
 */
export const getRestaurantReviews = async (restaurantId) => {
  try {
    const response = await api.get(`/restaurants/${restaurantId}/reviews`);
    return response.data;
  } catch (error) {
    console.error(`Fetch restaurant ${restaurantId} reviews error:`, error);
    throw error;
  }
};

/**
 * 식당 리뷰 작성
 * @param {number|string} restaurantId - 식당 ID
 * @param {Object} reviewData - 리뷰 데이터
 * @returns {Promise<Object>} 리뷰 등록 결과
 */
export const addRestaurantReview = async (restaurantId, reviewData) => {
  try {
    const response = await api.post(`/restaurants/${restaurantId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error(`Add review to restaurant ${restaurantId} error:`, error);
    throw error;
  }
};

/**
 * 근처 식당 검색
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @param {number} radius - 검색 반경 (km)
 * @returns {Promise<Array>} 식당 목록
 */
export const getNearbyRestaurants = async (latitude, longitude, radius = 5) => {
  try {
    const response = await api.get('/restaurants/nearby', {
      params: { latitude, longitude, radius }
    });
    return response.data;
  } catch (error) {
    console.error('Fetch nearby restaurants error:', error);
    throw error;
  }
};

/**
 * 식당 메뉴 등록
 * @param {number|string} restaurantId - 식당 ID
 * @param {Object} menuData - 메뉴 데이터
 * @returns {Promise<Object>} 등록 결과
 */
export const createMenu = async (restaurantId, menuData) => {
  try {
    const response = await api.post('/menus', {
      ...menuData,
      restaurant_id: restaurantId
    });
    return response.data;
  } catch (error) {
    console.error(`Create menu for restaurant ${restaurantId} error:`, error);
    throw error;
  }
};

/**
 * 메뉴 카테고리 조회
 * @returns {Promise<Array>} 카테고리 목록
 */
export const getMenuCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Fetch menu categories error:', error);
    throw error;
  }
};

export default {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMenus,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  setRestaurantHours,
  getRestaurantReviews,
  addRestaurantReview,
  getNearbyRestaurants,
  createMenu,
  getMenuCategories
};