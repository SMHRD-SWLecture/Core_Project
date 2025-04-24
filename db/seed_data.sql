-- Different, Together - QR 오더 서비스
-- 초기 데이터 SQL

USE different_together;

-- 국가 데이터
INSERT INTO countries (name, language_code) VALUES
('대한민국', 'ko'),
('미국', 'en'),
('일본', 'ja'),
('중국', 'zh'),
('베트남', 'vi'),
('필리핀', 'tl'),
('태국', 'th'),
('인도네시아', 'id');

-- 사용자 유형 데이터
INSERT INTO user_types (name) VALUES
('손님'),
('식당 주인');

-- 메뉴 카테고리 데이터
INSERT INTO menu_categories (name) VALUES
('추천'),
('메인'),
('사이드'),
('국/찌개'),
('음료');

-- 샘플 사용자 데이터 (비밀번호: 'admin123', 'user123')
INSERT INTO users (username, email, password, name, country_id, birth_year, user_type_id) VALUES
('admin', 'admin@example.com', '$2b$12$5V5RnGGi5RoGxVCF3Fs.puqw9Gg/YJ/k1TVQnVhj2m/.FTAuN0XZK', '관리자', 1, 1990, 2),
('user', 'user@example.com', '$2b$12$oFjSVIi6LvMnNXCZGTGYM.TQU0pRH8UvkRfBgA6HXKPnx3CLt0kDe', '테스트 사용자', 1, 1995, 1),
('john_doe', 'john@example.com', '$2b$12$oFjSVIi6LvMnNXCZGTGYM.TQU0pRH8UvkRfBgA6HXKPnx3CLt0kDe', 'John Doe', 2, 1985, 1),
('sakura', 'sakura@example.com', '$2b$12$oFjSVIi6LvMnNXCZGTGYM.TQU0pRH8UvkRfBgA6HXKPnx3CLt0kDe', 'Sakura Tanaka', 3, 1992, 1);

-- 샘플 식당 데이터
INSERT INTO restaurants (name, owner_id, address, phone, description, image_url, latitude, longitude) VALUES
('서울정 (Seoul Jung)', 1, '서울시 종로구 인사동길 12', '02-123-4567', '전통 한정식을 맛볼 수 있는 정통 한식당입니다.', '/static/images/restaurant-1.jpg', 37.576162, 126.985325),
('트라토리아 (Trattoria)', 1, '서울시 마포구 와우산로 35', '02-345-6789', '정통 이탈리안 요리를 즐길 수 있는 아늑한 분위기의 레스토랑입니다.', '/static/images/restaurant-2.jpg', 37.554524, 126.923774),
('스시히로 (Sushi Hiro)', 1, '서울시 강남구 언주로 726', '02-987-6543', '신선한 해산물로 만든 정통 일본 스시와 사시미를 맛볼 수 있습니다.', '/static/images/restaurant-3.jpg', 37.498558, 127.052270);

-- 샘플 메뉴 데이터
INSERT INTO menus (restaurant_id, category_id, name, description, price, image_url, is_available, is_recommended, total_sales) VALUES
-- 서울정 메뉴
(1, 2, '불고기', '소고기를 양념에 재워 구운 한국 전통 요리', 15000, '/static/images/menu-bulgogi.jpg', 1, 1, 250),
(1, 2, '비빔밥', '밥 위에 다양한 나물과 고기를 올리고 고추장으로 비벼 먹는 음식', 12000, '/static/images/menu-bibimbap.jpg', 1, 1, 320),
(1, 2, '갈비찜', '소갈비를 간장 양념에 조려낸 찜 요리', 18000, '/static/images/menu-galbi.jpg', 1, 0, 180),
(1, 2, '제육볶음', '돼지고기를 고추장 양념에 볶은 매콤한 요리', 14000, '/static/images/menu-jeyuk.jpg', 1, 0, 210),
(1, 4, '김치찌개', '김치를 주재료로 한 매콤한 한국의 대표 찌개', 10000, '/static/images/menu-kimchi-stew.jpg', 1, 0, 290),
(1, 4, '된장찌개', '된장을 주재료로 한 구수한 한국의 대표 찌개', 9000, '/static/images/menu-doenjang-stew.jpg', 1, 0, 270),
(1, 3, '파전', '부추와 해물을 넣어 부친 전', 12000, '/static/images/menu-pajeon.jpg', 1, 0, 220),
(1, 5, '소주', '한국의 대표적인 증류주', 5000, '/static/images/menu-soju.jpg', 1, 0, 450),

-- 트라토리아 메뉴
(2, 2, '마르게리타 피자', '토마토 소스, 모짜렐라 치즈, 바질을 얹은 클래식 이탈리안 피자', 16000, '/static/images/menu-pizza.jpg', 1, 1, 280),
(2, 2, '파스타 카르보나라', '계란, 페코리노 치즈, 베이컨, 후추를 섞은 크리미한 파스타', 15000, '/static/images/menu-carbonara.jpg', 1, 1, 310),
(2, 2, '라자냐', '미트소스와 베샤멜 소스가 층층이 들어간 이탈리안 오븐 파스타', 17000, '/static/images/menu-lasagna.jpg', 1, 0, 190),
(2, 3, '카프레제 샐러드', '토마토, 모짜렐라, 바질, 올리브 오일로 만든 신선한 샐러드', 10000, '/static/images/menu-caprese.jpg', 1, 0, 150),
(2, 5, '하우스 와인 (레드)', '레스토랑 특선 레드 와인', 8000, '/static/images/menu-wine.jpg', 1, 0, 220),

-- 스시히로 메뉴
(3, 2, '모듬 초밥', '신선한 생선으로 만든 12종 모듬 초밥', 25000, '/static/images/menu-sushi.jpg', 1, 1, 310),
(3, 2, '사시미 모듬', '다양한 종류의 신선한 생선회 모듬', 28000, '/static/images/menu-sashimi.jpg', 1, 1, 280),
(3, 2, '우동', '진한 육수에 쫄깃한 우동면', 12000, '/static/images/menu-udon.jpg', 1, 0, 240),
(3, 3, '야키토리', '숯불에 구운 닭꼬치', 9000, '/static/images/menu-yakitori.jpg', 1, 0, 220),
(3, 5, '사케', '일본 전통 쌀 증류주', 7000, '/static/images/menu-sake.jpg', 1, 0, 320);

-- 메뉴 알레르기 정보
INSERT INTO menu_allergens (menu_id, allergen_name) VALUES
(1, '소고기'), (2, '계란'), (3, '소고기'), (4, '돼지고기'), (5, '고추'),
(9, '밀가루'), (9, '유제품'), (10, '계란'), (10, '밀가루'), (10, '유제품'), (10, '돼지고기'),
(15, '생선'), (16, '생선');

-- 샘플 주문 데이터
INSERT INTO orders (user_id, restaurant_id, order_number, total_amount, status, ordered_at, completed_at) VALUES
(2, 1, 'ORD20250423001', 42000, 'completed', '2025-04-23 12:30:00', '2025-04-23 13:15:00'),
(2, 2, 'ORD20250424001', 31000, 'completed', '2025-04-24 18:45:00', '2025-04-24 19:30:00'),
(3, 3, 'ORD20250425001', 53000, 'completed', '2025-04-25 19:20:00', '2025-04-25 20:05:00'),
(4, 1, 'ORD20250423002', 30000, 'completed', '2025-04-23 13:10:00', '2025-04-23 13:55:00');

-- 주문 상세 데이터
INSERT INTO order_details (order_id, menu_id, quantity, price) VALUES
(1, 1, 1, 15000), (1, 2, 1, 12000), (1, 8, 3, 5000),
(2, 9, 1, 16000), (2, 10, 1, 15000),
(3, 15, 1, 25000), (3, 16, 1, 28000),
(4, 2, 2, 12000), (4, 7, 1, 6000);

-- 번역 키 데이터
INSERT INTO translation_keys (`key`, description, category) VALUES
('menu.bulgogi', '메뉴: 불고기', 'menu'),
('menu.bibimbap', '메뉴: 비빔밥', 'menu'),
('menu.kimchi-stew', '메뉴: 김치찌개', 'menu'),
('nav.home', '네비게이션: 홈', 'ui'),
('nav.restaurants', '네비게이션: 식당', 'ui'),
('nav.orders', '네비게이션: 주문', 'ui'),
('button.order', '버튼: 주문하기', 'ui'),
('button.add-to-cart', '버튼: 장바구니 담기', 'ui');

-- 번역 데이터
INSERT INTO translations (key_id, language_code, text) VALUES
(1, 'en', 'Bulgogi (Marinated Beef)'),
(1, 'ja', 'プルコギ (焼肉)'),
(1, 'zh', '烤牛肉 (bulgogi)'),
(2, 'en', 'Bibimbap (Mixed Rice Bowl)'),
(2, 'ja', 'ビビンバ (混ぜご飯)'),
(2, 'zh', '拌饭 (bibimbap)'),
(3, 'en', 'Kimchi Stew'),
(3, 'ja', 'キムチチゲ (キムチ鍋)'),
(3, 'zh', '泡菜汤 (kimchi jjigae)'),
(4, 'en', 'Home'),
(4, 'ja', 'ホーム'),
(4, 'zh', '首页'),
(5, 'en', 'Restaurants'),
(5, 'ja', 'レストラン'),
(5, 'zh', '餐厅'),
(6, 'en', 'Orders'),
(6, 'ja', '注文履歴'),
(6, 'zh', '订单'),
(7, 'en', 'Order Now'),
(7, 'ja', '注文する'),
(7, 'zh', '立即下单'),
(8, 'en', 'Add to Cart'),
(8, 'ja', 'カートに追加'),
(8, 'zh', '加入购物车');