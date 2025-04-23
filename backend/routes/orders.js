const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @route   GET /api/orders
 * @desc    주문 목록 조회 (사용자: 자신의 주문만, 식당주인: 자신의 식당 주문만)
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    
    // 사용자 유형 확인 (일반 사용자인지 식당 주인인지)
    const [users] = await db.execute(`
      SELECT user_type_id FROM USERS WHERE user_id = ?
    `, [userId]);
    
    const userTypeId = users[0].user_type_id;
    let orders;
    
    if (userTypeId === 1) {
      // 일반 사용자인 경우 자신의 주문만 조회
      [orders] = await db.execute(`
        SELECT o.*, r.restaurant_name,
               (SELECT COUNT(*) FROM ORDER_DETAILS WHERE order_id = o.order_id) as item_count
        FROM ORDERS o
        JOIN RESTAURANT r ON o.restaurant_id = r.restaurant_id
        WHERE o.user_id = ?
        ORDER BY o.order_date DESC
      `, [userId]);
    } else if (userTypeId === 2) {
      // 식당 주인인 경우 자신의 식당 주문 조회
      [orders] = await db.execute(`
        SELECT o.*, u.name as customer_name,
               (SELECT COUNT(*) FROM ORDER_DETAILS WHERE order_id = o.order_id) as item_count
        FROM ORDERS o
        JOIN USERS u ON o.user_id = u.user_id
        JOIN RESTAURANT r ON o.restaurant_id = r.restaurant_id
        WHERE r.owner_id = ?
        ORDER BY o.order_date DESC
      `, [userId]);
    } else {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    특정 주문 상세 조회
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const db = req.db;
    const orderId = req.params.id;
    const userId = req.user.id;
    
    // 사용자 유형 확인
    const [users] = await db.execute(`
      SELECT user_type_id FROM USERS WHERE user_id = ?
    `, [userId]);
    
    const userTypeId = users[0].user_type_id;
    
    // 주문 기본 정보 조회
    const [orders] = await db.execute(`
      SELECT o.*, r.restaurant_name, r.owner_id, u.name as customer_name
      FROM ORDERS o
      JOIN RESTAURANT r ON o.restaurant_id = r.restaurant_id
      JOIN USERS u ON o.user_id = u.user_id
      WHERE o.order_id = ?
    `, [orderId]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });
    }
    
    const order = orders[0];
    
    // 권한 확인 (자신의 주문이거나, 자신의 식당 주문만 볼 수 있음)
    if (order.user_id !== userId && order.owner_id !== userId) {
      return res.status(403).json({ message: '해당 주문을 볼 권한이 없습니다.' });
    }
    
    // 주문 상세 항목 조회
    const [orderDetails] = await db.execute(`
      SELECT od.*, m.menu_name
      FROM ORDER_DETAILS od
      JOIN MENU m ON od.menu_id = m.menu_id
      WHERE od.order_id = ?
    `, [orderId]);
    
    // 결과 반환
    res.json({
      ...order,
      items: orderDetails
    });
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/**
 * @route   POST /api/orders
 * @desc    새 주문 생성
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    body('restaurant_id').isNumeric().withMessage('유효한 식당 ID가 필요합니다.'),
    body('items').isArray().withMessage('주문 항목은 배열 형태여야 합니다.'),
    body('items.*.menu_id').isNumeric().withMessage('유효한 메뉴 ID가 필요합니다.'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('수량은 1 이상이어야 합니다.'),
    body('items.*.price').isNumeric().withMessage('가격은 숫자여야 합니다.')
  ],
  async (req, res) => {
    // 입력값 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { restaurant_id, items, total_amount } = req.body;
    const userId = req.user.id;

    // 트랜잭션 처리
    const db = req.db;
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 1. 메인 주문 생성
      const [orderResult] = await connection.execute(`
        INSERT INTO ORDERS (user_id, restaurant_id, total_amount, order_date)
        VALUES (?, ?, ?, NOW())
      `, [userId, restaurant_id, total_amount]);
      
      const orderId = orderResult.insertId;
      
      // 2. 주문 상세 항목 생성
      for (const item of items) {
        await connection.execute(`
          INSERT INTO ORDER_DETAILS (order_id, menu_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `, [orderId, item.menu_id, item.quantity, item.price]);
        
        // 3. 메뉴 판매량 업데이트
        await connection.execute(`
          UPDATE MENU
          SET total_sales = total_sales + ?
          WHERE menu_id = ?
        `, [item.quantity, item.menu_id]);
      }
      
      await connection.commit();
      
      res.status(201).json({
        message: '주문이 완료되었습니다.',
        orderId: orderId
      });
    } catch (err) {
      await connection.rollback();
      console.error('Error creating order:', err);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    } finally {
      connection.release();
    }
  }
);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    주문 상태 업데이트 (식당 주인만 가능)
 * @access  Private
 */
router.put(
  '/:id/status',
  [
    auth,
    body('status').isIn(['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled']).withMessage('유효한 주문 상태가 아닙니다.')
  ],
  async (req, res) => {
    // 입력값 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const db = req.db;
      const orderId = req.params.id;
      const userId = req.user.id;
      const { status } = req.body;
      
      // 권한 확인 (식당 주인만 상태 변경 가능)
      const [orders] = await db.execute(`
        SELECT o.*, r.owner_id
        FROM ORDERS o
        JOIN RESTAURANT r ON o.restaurant_id = r.restaurant_id
        WHERE o.order_id = ?
      `, [orderId]);
      
      if (orders.length === 0) {
        return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });
      }
      
      if (orders[0].owner_id !== userId) {
        return res.status(403).json({ message: '주문 상태를 변경할 권한이 없습니다.' });
      }
      
      // 주문 상태 업데이트
      await db.execute(`
        UPDATE ORDERS
        SET status = ?
        WHERE order_id = ?
      `, [status, orderId]);
      
      res.json({ message: '주문 상태가 업데이트되었습니다.' });
    } catch (err) {
      console.error('Error updating order status:', err);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    주문 취소 (사용자만 가능, pending 상태일 때만)
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const db = req.db;
    const orderId = req.params.id;
    const userId = req.user.id;
    
    // 주문 정보 조회
    const [orders] = await db.execute(`
      SELECT * FROM ORDERS
      WHERE order_id = ?
    `, [orderId]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });
    }
    
    const order = orders[0];
    
    // 권한 확인 (자신의 주문만 취소 가능)
    if (order.user_id !== userId) {
      return res.status(403).json({ message: '해당 주문을 취소할 권한이 없습니다.' });
    }
    
    // 주문 상태 확인 (pending 상태일 때만 취소 가능)
    if (order.status !== 'pending') {
      return res.status(400).json({ message: '이미 처리 중인 주문은 취소할 수 없습니다.' });
    }
    
    // 주문 취소 (상태만 변경)
    await db.execute(`
      UPDATE ORDERS
      SET status = 'cancelled'
      WHERE order_id = ?
    `, [orderId]);
    
    res.json({ message: '주문이 취소되었습니다.' });
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;