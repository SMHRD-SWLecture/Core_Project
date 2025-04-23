import React, { createContext, useContext, useState, useEffect } from 'react';

// 지원되는 언어 목록
export const SUPPORTED_LANGUAGES = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' }
];

// 번역 데이터
export const translations = {
  ko: {
    // 공통
    loading: '로딩 중...',
    error: '오류가 발생했습니다.',
    back: '뒤로 가기',
    
    // 스플래시 및 시작 화면
    appName: '스마트인재개발원',
    appDescription: '샐러드볼 정신을 담은 QR 오더 서비스',
    selectLanguage: '언어를 선택하세요',
    welcome: '환영합니다!',
    description: 'QR 코드로 쉽고 편리하게 음식을 주문하세요.',
    
    // 인증
    login: '로그인',
    register: '회원가입',
    username: '아이디',
    password: '비밀번호',
    confirmPassword: '비밀번호 확인',
    name: '이름',
    email: '이메일',
    phoneNumber: '전화번호',
    country: '국가',
    forgotPassword: '비밀번호를 잊으셨나요?',
    noAccount: '계정이 없으신가요?',
    alreadyHaveAccount: '이미 계정이 있으신가요?',
    guest: '게스트로 계속하기',
    
    // 홈 및 레스토랑
    restaurants: '음식점',
    findRestaurants: '음식점 찾기',
    scanQR: 'QR 코드 스캔하기',
    nearbyRestaurants: '근처 음식점',
    popularRestaurants: '인기 음식점',
    search: '검색',
    searchRestaurants: '음식점 또는 음식 검색',
    
    // 메뉴
    menu: '메뉴',
    searchMenu: '메뉴 검색',
    all: '전체',
    popular: '인기 메뉴',
    addToCart: '장바구니 담기',
    price: '가격:',
    
    // 장바구니 및 주문
    cart: '장바구니',
    emptyCart: '장바구니가 비어있습니다.',
    continueShopping: '쇼핑 계속하기',
    totalAmount: '총 금액',
    checkout: '결제하기',
    won: '원',
    orderSummary: '주문 요약',
    deliveryInfo: '배달 정보',
    paymentMethod: '결제 방법',
    placeOrder: '주문하기',
    orderSuccess: '주문이 성공적으로 완료되었습니다!',
    orderNumber: '주문 번호',
    backToHome: '홈으로 돌아가기',
    
    // 프로필
    myProfile: '내 프로필',
    orderHistory: '주문 내역',
    settings: '설정',
    logout: '로그아웃',
    welcomeMessage: '환영합니다!',
    orderConfirmed: '주문이 완료되었습니다',
    orderConfirmationMessage: '주문이 성공적으로 처리되었습니다.',
    viewOrders: '주문 내역 보기'
  },
  en: {
    // 공통
    loading: 'Loading...',
    error: 'An error occurred.',
    back: 'Back',
    
    // 스플래시 및 시작 화면
    appName: 'Smart HRD',
    appDescription: 'QR Order Service with a Salad Bowl Spirit',
    selectLanguage: 'Please select your language',
    welcome: 'Welcome!',
    description: 'Order food easily with QR code.',
    
    // 인증
    login: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    country: 'Country',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    guest: 'Continue as Guest',
    
    // 홈 및 레스토랑
    restaurants: 'Restaurants',
    findRestaurants: 'Find Restaurants',
    scanQR: 'Scan QR Code',
    nearbyRestaurants: 'Nearby Restaurants',
    popularRestaurants: 'Popular Restaurants',
    search: 'Search',
    searchRestaurants: 'Search restaurants or food',
    
    // 메뉴
    menu: 'Menu',
    searchMenu: 'Search menu',
    all: 'All',
    popular: 'Popular',
    addToCart: 'Add to Cart',
    price: 'Price:',
    
    // 장바구니 및 주문
    cart: 'Cart',
    emptyCart: 'Your cart is empty.',
    continueShopping: 'Continue Shopping',
    totalAmount: 'Total Amount',
    checkout: 'Checkout',
    won: 'KRW',
    orderSummary: 'Order Summary',
    deliveryInfo: 'Delivery Information',
    paymentMethod: 'Payment Method',
    placeOrder: 'Place Order',
    orderSuccess: 'Your order has been successfully placed!',
    orderNumber: 'Order Number',
    backToHome: 'Back to Home',
    
    // 프로필
    myProfile: 'My Profile',
    orderHistory: 'Order History',
    settings: 'Settings',
    logout: 'Logout',
    welcomeMessage: 'Welcome!',
    orderConfirmed: 'Order Confirmed',
    orderConfirmationMessage: 'Your order has been successfully processed.',
    viewOrders: 'View Orders'
  },
  zh: {
    // 공통
    loading: '加载中...',
    error: '发生错误。',
    back: '返回',
    
    // 스플래시 및 시작 화면
    appName: '智能人才开发院',
    appDescription: '带有沙拉碗精神的二维码点餐服务',
    selectLanguage: '请选择您的语言',
    welcome: '欢迎！',
    description: '使用二维码轻松点餐。',
    
    // 인증
    login: '登录',
    register: '注册',
    username: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    name: '姓名',
    email: '电子邮箱',
    phoneNumber: '电话号码',
    country: '国家',
    forgotPassword: '忘记密码？',
    noAccount: '没有账号？',
    alreadyHaveAccount: '已有账号？',
    guest: '以访客身份继续',
    
    // 홈 및 레스토랑
    restaurants: '餐厅',
    findRestaurants: '查找餐厅',
    scanQR: '扫描二维码',
    nearbyRestaurants: '附近餐厅',
    popularRestaurants: '热门餐厅',
    search: '搜索',
    searchRestaurants: '搜索餐厅或食物',
    
    // 메뉴
    menu: '菜单',
    searchMenu: '搜索菜单',
    all: '全部',
    popular: '热门',
    addToCart: '加入购物车',
    price: '价格：',
    
    // 장바구니 및 주문
    cart: '购物车',
    emptyCart: '购物车是空的。',
    continueShopping: '继续购物',
    totalAmount: '总金额',
    checkout: '结账',
    won: '韩元',
    orderSummary: '订单摘要',
    deliveryInfo: '配送信息',
    paymentMethod: '支付方式',
    placeOrder: '下单',
    orderSuccess: '订单已成功提交！',
    orderNumber: '订单号',
    backToHome: '返回首页',
    
    // 프로필
    myProfile: '我的个人资料',
    orderHistory: '订单历史',
    settings: '设置',
    logout: '退出登录',
    welcomeMessage: '欢迎！',
    orderConfirmed: '订单已确认',
    orderConfirmationMessage: '您的订单已成功处理。',
    viewOrders: '查看订单'
  },
  ja: {
    // 공통
    loading: '読み込み中...',
    error: 'エラーが発生しました。',
    back: '戻る',
    
    // 스플래시 및 시작 화면
    appName: 'スマート人材開発院',
    appDescription: 'サラダボウル精神を持つQR注文サービス',
    selectLanguage: '言語を選択してください',
    welcome: 'ようこそ！',
    description: 'QRコードで簡単に注文できます。',
    
    // 인증
    login: 'ログイン',
    register: '新規登録',
    username: 'ユーザー名',
    password: 'パスワード',
    confirmPassword: 'パスワード（確認）',
    name: '名前',
    email: 'メールアドレス',
    phoneNumber: '電話番号',
    country: '国',
    forgotPassword: 'パスワードをお忘れですか？',
    noAccount: 'アカウントをお持ちでない方',
    alreadyHaveAccount: 'すでにアカウントをお持ちの方',
    guest: 'ゲストとして続ける',
    
    // 홈 및 레스토랑
    restaurants: 'レストラン',
    findRestaurants: 'レストランを探す',
    scanQR: 'QRコードをスキャン',
    nearbyRestaurants: '近くのレストラン',
    popularRestaurants: '人気のレストラン',
    search: '検索',
    searchRestaurants: 'レストランや料理を検索',
    
    // 메뉴
    menu: 'メニュー',
    searchMenu: 'メニューを検索',
    all: 'すべて',
    popular: '人気',
    addToCart: 'カートに追加',
    price: '価格：',
    
    // 장바구니 및 주문
    cart: 'カート',
    emptyCart: 'カートは空です。',
    continueShopping: '買い物を続ける',
    totalAmount: '合計金額',
    checkout: 'レジへ進む',
    won: '円',
    orderSummary: '注文内容',
    deliveryInfo: '配達情報',
    paymentMethod: '支払い方法',
    placeOrder: '注文する',
    orderSuccess: '注文が完了しました！',
    orderNumber: '注文番号',
    backToHome: 'ホームに戻る',
    
    // 프로필
    myProfile: 'マイプロフィール',
    orderHistory: '注文履歴',
    settings: '設定',
    logout: 'ログアウト',
    welcomeMessage: 'ようこそ！',
    orderConfirmed: '注文が確認されました',
    orderConfirmationMessage: '注文が正常に処理されました。',
    viewOrders: '注文を表示'
  },
  vi: {
    // 공통
    loading: 'Đang tải...',
    error: 'Đã xảy ra lỗi.',
    back: 'Quay lại',
    
    // 스플래시 및 시작 화면
    appName: 'Viện Phát triển Nhân tài Thông minh',
    appDescription: 'Dịch vụ Đặt món QR với Tinh thần Salad Bowl',
    selectLanguage: 'Vui lòng chọn ngôn ngữ của bạn',
    welcome: 'Chào mừng!',
    description: 'Đặt món dễ dàng với mã QR.',
    
    // 인증
    login: 'Đăng nhập',
    register: 'Đăng ký',
    username: 'Tên đăng nhập',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    name: 'Tên',
    email: 'Email',
    phoneNumber: 'Số điện thoại',
    country: 'Quốc gia',
    forgotPassword: 'Quên mật khẩu?',
    noAccount: 'Chưa có tài khoản?',
    alreadyHaveAccount: 'Đã có tài khoản?',
    guest: 'Tiếp tục với tư cách khách',
    
    // 홈 및 레스토랑
    restaurants: 'Nhà hàng',
    findRestaurants: 'Tìm nhà hàng',
    scanQR: 'Quét mã QR',
    nearbyRestaurants: 'Nhà hàng gần đây',
    popularRestaurants: 'Nhà hàng phổ biến',
    search: 'Tìm kiếm',
    searchRestaurants: 'Tìm nhà hàng hoặc món ăn',
    
    // 메뉴
    menu: 'Thực đơn',
    searchMenu: 'Tìm kiếm thực đơn',
    all: 'Tất cả',
    popular: 'Phổ biến',
    addToCart: 'Thêm vào giỏ hàng',
    price: 'Giá:',
    
    // 장바구니 및 주문
    cart: 'Giỏ hàng',
    emptyCart: 'Giỏ hàng trống.',
    continueShopping: 'Tiếp tục mua sắm',
    totalAmount: 'Tổng tiền',
    checkout: 'Thanh toán',
    won: 'KRW',
    orderSummary: 'Tóm tắt đơn hàng',
    deliveryInfo: 'Thông tin giao hàng',
    paymentMethod: 'Phương thức thanh toán',
    placeOrder: 'Đặt hàng',
    orderSuccess: 'Đặt hàng thành công!',
    orderNumber: 'Mã đơn hàng',
    backToHome: 'Về trang chủ',
    
    // 프로필
    myProfile: 'Hồ sơ của tôi',
    orderHistory: 'Lịch sử đơn hàng',
    settings: 'Cài đặt',
    logout: 'Đăng xuất',
    welcomeMessage: 'Chào mừng!',
    orderConfirmed: 'Đã xác nhận đơn hàng',
    orderConfirmationMessage: 'Đơn hàng của bạn đã được xử lý thành công.',
    viewOrders: 'Xem đơn hàng'
  },
  th: {
    // 공통
    loading: 'กำลังโหลด...',
    error: 'เกิดข้อผิดพลาด',
    back: 'ย้อนกลับ',
    
    // 스플래시 및 시작 화면
    appName: 'สถาบันพัฒนาบุคลากรอัจฉริยะ',
    appDescription: 'บริการสั่งอาหารด้วย QR Code ด้วยจิตวิญญาณสลัดโบว์ล',
    selectLanguage: 'กรุณาเลือกภาษาของคุณ',
    welcome: 'ยินดีต้อนรับ!',
    description: 'สั่งอาหารได้ง่ายด้วย QR Code',
    
    // 인증
    login: 'เข้าสู่ระบบ',
    register: 'ลงทะเบียน',
    username: 'ชื่อผู้ใช้',
    password: 'รหัสผ่าน',
    confirmPassword: 'ยืนยันรหัสผ่าน',
    name: 'ชื่อ',
    email: 'อีเมล',
    phoneNumber: 'เบอร์โทรศัพท์',
    country: 'ประเทศ',
    forgotPassword: 'ลืมรหัสผ่าน?',
    noAccount: 'ยังไม่มีบัญชี?',
    alreadyHaveAccount: 'มีบัญชีอยู่แล้ว?',
    guest: 'ดำเนินการต่อในฐานะผู้ใช้ทั่วไป',
    
    // 홈 및 레스토랑
    restaurants: 'ร้านอาหาร',
    findRestaurants: 'ค้นหาร้านอาหาร',
    scanQR: 'สแกน QR Code',
    nearbyRestaurants: 'ร้านอาหารใกล้เคียง',
    popularRestaurants: 'ร้านอาหารยอดนิยม',
    search: 'ค้นหา',
    searchRestaurants: 'ค้นหาร้านอาหารหรืออาหาร',
    
    // 메뉴
    menu: 'เมนู',
    searchMenu: 'ค้นหาเมนู',
    all: 'ทั้งหมด',
    popular: 'ยอดนิยม',
    addToCart: 'เพิ่มลงในตะกร้า',
    price: 'ราคา:',
    
    // 장바구니 및 주문
    cart: 'ตะกร้า',
    emptyCart: 'ตะกร้าว่างเปล่า',
    continueShopping: 'ช้อปปิ้งต่อ',
    totalAmount: 'ยอดรวม',
    checkout: 'ชำระเงิน',
    won: 'บาท',
    orderSummary: 'สรุปคำสั่งซื้อ',
    deliveryInfo: 'ข้อมูลการจัดส่ง',
    paymentMethod: 'วิธีการชำระเงิน',
    placeOrder: 'สั่งซื้อ',
    orderSuccess: 'สั่งซื้อสำเร็จ!',
    orderNumber: 'หมายเลขคำสั่งซื้อ',
    backToHome: 'กลับไปหน้าแรก',
    
    // 프로필
    myProfile: 'โปรไฟล์ของฉัน',
    orderHistory: 'ประวัติการสั่งซื้อ',
    settings: 'ตั้งค่า',
    logout: 'ออกจากระบบ',
    welcomeMessage: 'ยินดีต้อนรับ!',
    orderConfirmed: 'ยืนยันคำสั่งซื้อ',
    orderConfirmationMessage: 'คำสั่งซื้อของคุณได้รับการประมวลผลเรียบร้อยแล้ว',
    viewOrders: 'ดูคำสั่งซื้อ'
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ko');

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguage(langCode);
      localStorage.setItem('language', langCode);
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const text = translations[language] || translations.ko;

  const value = {
    language,
    changeLanguage,
    text
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};