const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @route   GET /api/menus
 * @desc    모든 메뉴 조회
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    
    // 전체 메뉴 목록 조회
    const [menus] = await db.execute(`
      SELECT m.*, r.restaurant_name, c.category_name
      FROM MENU m
      LEFT JOIN RESTAURANT r ON m.restaurant_id = r.restaurant_id
      LEFT JOIN MENU_CATEGORY c ON m.category_id = c.category_id
      ORDER BY r.restaurant_name, c.category_name, m.menu_name
    `);
    
    res.json(menus);
  } catch (err) {
    console.error('Error fetching menus:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/**
 * @route   GET /api/menus/:id
 * @desc    특정 메뉴 조회
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const db = req.db;
    const menuId = req.params.id;
    
    // 특정 메뉴 조회
    const [menus] = await db.execute(`
      SELECT m.*, r.restaurant_name, c.category_name
      FROM MENU m
      LEFT JOIN RESTAURANT r ON m.restaurant_id = r.restaurant_id
      LEFT JOIN MENU_CATEGORY c ON m.category_id = c.category_id
      WHERE m.menu_id = ?
    `, [menuId]);
    
    if (menus.length === 0) {
      return res.status(404).json({ message: '메뉴를 찾을 수 없습니다.' });
    }
    
    res.json(menus[0]);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/**
 * @route   POST /api/menus
 * @desc    새 메뉴 등록
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    body('menu_name').not().isEmpty().withMessage('메뉴 이름은 필수 입력값입니다.'),
    body('restaurant_id').isNumeric().withMessage('유효한 식당 ID가 필요합니다.'),
    body('price').isNumeric().withMessage('가격은 숫자여야 합니다.')
  ],
  async (req, res) => {
    // 입력값 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const db = req.db;
      const { menu_name, restaurant_id, category_id, price, description, ingredients } = req.body;
      const userId = req.user.id;
      
      // 식당 소유자 확인
      const [restaurants] = await db.execute(`
        SELECT * FROM RESTAURANT
        WHERE restaurant_id = ? AND owner_id = ?
      `, [restaurant_id, userId]);
      
      if (restaurants.length === 0) {
        return res.status(403).json({ message: '해당 식당의 메뉴를 등록할 권한이 없습니다.' });
      }
      
      // 메뉴 등록
      const [result] = await db.execute(`
        INSERT INTO MENU 
        (restaurant_id, menu_name, category_id, price, description, ingredients)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [restaurant_id, menu_name, category_id, price, description, ingredients]);
      
      res.status(201).json({
        message: '메뉴가 등록되었습니다.',
        menuId: result.insertId
      });
    } catch (err) {
      console.error('Error creating menu:', err);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
);

/**
 * @route   PUT /api/menus/:id
 * @desc    메뉴 정보 수정
 * @access  Private
 */
router.put(
  '/:id',
  [
    auth,
    body('menu_name').not().isEmpty().withMessage('메뉴 이름은 필수 입력값입니다.'),
    body('price').isNumeric().withMessage('가격은 숫자여야 합니다.')
  ],
  async (req, res) => {
    // 입력값 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const db = req.db;
      const menuId = req.params.id;
      const userId = req.user.id;
      const { menu_name, category_id, price, description, ingredients, is_sold_out } = req.body;
      
      // 식당 소유자 확인
      const [menus] = await db.execute(`
        SELECT m.*, r.owner_id
        FROM MENU m
        JOIN RESTAURANT r ON m.restaurant_id = r.restaurant_id
        WHERE m.menu_id = ?
      `, [menuId]);
      
      if (menus.length === 0) {
        return res.status(404).json({ message: '메뉴를 찾을 수 없습니다.' });
      }
      
      if (menus[0].owner_id !== userId) {
        return res.status(403).json({ message: '해당 메뉴를 수정할 권한이 없습니다.' });
      }
      
      // 메뉴 정보 수정
      await db.execute(`
        UPDATE MENU
        SET menu_name = ?,
            category_id = ?,
            price = ?,
            description = ?,
            ingredients = ?,
            is_sold_out = ?
        WHERE menu_id = ?
      `, [menu_name, category_id, price, description, ingredients, is_sold_out ? 1 : 0, menuId]);
      
      res.json({ message: '메뉴 정보가 수정되었습니다.' });
    } catch (err) {
      console.error('Error updating menu:', err);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
);

/**
 * @route   DELETE /api/menus/:id
 * @desc    메뉴 삭제
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const db = req.db;
    const menuId = req.params.id;
    const userId = req.user.id;
    
    // 식당 소유자 확인
    const [menus] = await db.execute(`
      SELECT m.*, r.owner_id
      FROM MENU m
      JOIN RESTAURANT r ON m.restaurant_id = r.restaurant_id
      WHERE m.menu_id = ?
    `, [menuId]);
    
    if (menus.length === 0) {
      return res.status(404).json({ message: '메뉴를 찾을 수 없습니다.' });
    }
    
    if (menus[0].owner_id !== userId) {
      return res.status(403).json({ message: '해당 메뉴를 삭제할 권한이 없습니다.' });
    }
    
    // 메뉴 삭제
    await db.execute('DELETE FROM MENU WHERE menu_id = ?', [menuId]);
    
    res.json({ message: '메뉴가 삭제되었습니다.' });
  } catch (err) {
    console.error('Error deleting menu:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;