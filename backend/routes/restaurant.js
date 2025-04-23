const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @route   GET /api/restaurants
 * @desc    모든 식당 정보 조회
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    
    // 식당 목록 조회
    const [restaurants] = await db.execute(`
      SELECT r.*, 
             u.name as owner_name,
             COALESCE(rv.avg_rating, 0) as rating
      FROM RESTAURANT r
      LEFT JOIN USERS u ON r.owner_id = u.user_id
      LEFT JOIN (
        SELECT restaurant_id, AVG(rating) as avg_rating
        FROM REVIEWS
        GROUP BY restaurant_id
      ) rv ON r.restaurant_id = rv.restaurant_id
      ORDER BY r.created_at DESC
    `);
    
    res.json(restaurants);
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/**
 * @route   GET /api/restaurants/:id
 * @desc    특정 식당 정보 조회
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const db = req.db;
    const restaurantId = req.params.id;
    
    // 식당 정보 조회
    const [restaurants] = await db.execute(`
      SELECT r.*, 
             u.name as owner_name,
             COALESCE(rv.avg_rating, 0) as rating
      FROM RESTAURANT r
      LEFT JOIN USERS u ON r.owner_id = u.user_id
      LEFT JOIN (
        SELECT restaurant_id, AVG(rating) as avg_rating
        FROM REVIEWS
        GROUP BY restaurant_id
      ) rv ON r.restaurant_id = rv.restaurant_id
      WHERE r.restaurant_id = ?
    `, [restaurantId]);
    
    if (restaurants.length === 0) {
      return res.status(404).json({ message: '식당을 찾을 수 없습니다.' });
    }
    
    // 영업시간 정보 조회
    const [hours] = await db.execute(`
      SELECT day, open_time, close_time
      FROM RESTAURANT_HOURS
      WHERE restaurant_id = ?
    `, [restaurantId]);
    
    // 시간 정보 형식화
    const formattedHours = {};
    hours.forEach(hour => {
      formattedHours[hour.day] = `${hour.open_time} - ${hour.close_time}`;
    });
    
    // 결과 객체에 영업시간 추가
    const restaurant = {
      ...restaurants[0],
      hours: formattedHours
    };
    
    res.json(restaurant);
  } catch (err) {
    console.error('Error fetching restaurant:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/**
 * @route   GET /api/restaurants/:id/menus
 * @desc    특정 식당의 메뉴 목록 조회
 * @access  Public
 */
router.get('/:id/menus', async (req, res) => {
  try {
    const db = req.db;
    const restaurantId = req.params.id;
    
    // 메뉴 목록 조회
    const [menus] = await db.execute(`
      SELECT m.*, c.category_name
      FROM MENU m
      LEFT JOIN MENU_CATEGORY c ON m.category_id = c.category_id
      WHERE m.restaurant_id = ?
      ORDER BY c.category_id, m.menu_name
    `, [restaurantId]);
    
    res.json(menus);
  } catch (err) {
    console.error('Error fetching menus:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/**
 * @route   POST /api/restaurants
 * @desc    새 식당 등록
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    body('restaurant_name').not().isEmpty().withMessage('식당 이름은 필수 입력값입니다.'),
    body('address').not().isEmpty().withMessage('주소는 필수 입력값입니다.')
  ],
  async (req, res) => {
    // 입력값 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const db = req.db;
      const { restaurant_name, address, phone, description } = req.body;
      const userId = req.user.id;
      
      // 식당 등록
      const [result] = await db.execute(`
        INSERT INTO RESTAURANT 
        (restaurant_name, owner_id, address, phone, description)
        VALUES (?, ?, ?, ?, ?)
      `, [restaurant_name, userId, address, phone, description]);
      
      res.status(201).json({
        message: '식당이 등록되었습니다.',
        restaurantId: result.insertId
      });
    } catch (err) {
      console.error('Error creating restaurant:', err);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
);

/**
 * @route   PUT /api/restaurants/:id
 * @desc    식당 정보 수정
 * @access  Private
 */
router.put(
  '/:id',
  [
    auth,
    body('restaurant_name').not().isEmpty().withMessage('식당 이름은 필수 입력값입니다.'),
    body('address').not().isEmpty().withMessage('주소는 필수 입력값입니다.')
  ],
  async (req, res) => {
    // 입력값 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const db = req.db;
      const restaurantId = req.params.id;
      const userId = req.user.id;
      const { restaurant_name, address, phone, description } = req.body;
      
      // 식당 소유자 확인
      const [restaurants] = await db.execute(`
        SELECT * FROM RESTAURANT
        WHERE restaurant_id = ? AND owner_id = ?
      `, [restaurantId, userId]);
      
      if (restaurants.length === 0) {
        return res.status(403).json({ message: '해당 식당을 수정할 권한이 없습니다.' });
      }
      
      // 식당 정보 수정
      await db.execute(`
        UPDATE RESTAURANT
        SET restaurant_name = ?,
            address = ?,
            phone = ?,
            description = ?
        WHERE restaurant_id = ?
      `, [restaurant_name, address, phone, description, restaurantId]);
      
      res.json({ message: '식당 정보가 수정되었습니다.' });
    } catch (err) {
      console.error('Error updating restaurant:', err);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
);

/**
 * @route   DELETE /api/restaurants/:id
 * @desc    식당 삭제
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const db = req.db;
    const restaurantId = req.params.id;
    const userId = req.user.id;
    
    // 식당 소유자 확인
    const [restaurants] = await db.execute(`
      SELECT * FROM RESTAURANT
      WHERE restaurant_id = ? AND owner_id = ?
    `, [restaurantId, userId]);

    // 필요 없는 기능일 수 있음 나중에 삭제 가능성 검토
    if (restaurants.length === 0) {
      return res.status(403).json({ message: '해당 식당을 삭제할 권한이 없습니다.' });
    }
    
    // 식당 삭제 (관련 메뉴, 주문 정보 등도 삭제 필요 - 실제로는 트랜잭션 처리 필요)
    await db.execute('DELETE FROM RESTAURANT WHERE restaurant_id = ?', [restaurantId]);
    
    res.json({ message: '식당이 삭제되었습니다.' });
  } catch (err) {
    console.error('Error deleting restaurant:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
