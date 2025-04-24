/**
 * Different, Together - QR 오더 서비스
 * 메뉴 페이지 자바스크립트
 */

document.addEventListener('DOMContentLoaded', function() {
    // 카트 관련 초기화
    const cart = {
        items: [],
        total: 0
    };
    
    // DOM 요소
    const cartButton = document.getElementById('openCartBtn');
    const cartBadge = document.querySelector('.cart-badge');
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const emptyCartMessage = document.querySelector('.empty-cart');
    const cartSummary = document.querySelector('.cart-summary');
    const cartTotal = document.querySelector('.cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // 메뉴 상세 모달 관련
    const menuDetailModal = new bootstrap.Modal(document.getElementById('menuDetailModal'));
    const menuDetailImg = document.querySelector('.menu-detail-img');
    const menuDetailName = document.querySelector('.menu-detail-name');
    const menuDetailDescription = document.querySelector('.menu-detail-description');
    const menuDetailPrice = document.querySelector('.menu-detail-price');
    const quantityInput = document.querySelector('.quantity-input');
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    const addToCartDetailBtn = document.querySelector('.add-to-cart-detail');
    
    // 주문 완료 모달
    const orderCompleteModal = new bootstrap.Modal(document.getElementById('orderCompleteModal'));
    
    // 메뉴 카드 클릭 이벤트 (메뉴 상세 모달 표시)
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        menuItem.addEventListener('click', function(e) {
            // '담기' 버튼 클릭 시 이벤트 전파 방지
            if (e.target.closest('.add-to-cart')) return;
            
            const menuCard = this;
            const menuImg = menuCard.querySelector('.menu-img').src;
            const menuName = menuCard.querySelector('.card-title').textContent;
            const menuDesc = menuCard.querySelector('.card-text').textContent;
            const menuPriceText = menuCard.querySelector('.fw-bold').textContent;
            const menuId = menuCard.querySelector('.add-to-cart').dataset.id;
            
            // 메뉴 상세 모달에 정보 채우기
            menuDetailImg.src = menuImg;
            menuDetailImg.alt = menuName;
            menuDetailName.textContent = menuName;
            menuDetailDescription.textContent = menuDesc;
            menuDetailPrice.textContent = menuPriceText;
            addToCartDetailBtn.dataset.id = menuId;
            addToCartDetailBtn.dataset.name = menuName;
            addToCartDetailBtn.dataset.price = menuPriceText.replace('₩', '').replace(',', '');
            
            // 수량 초기화
            quantityInput.value = 1;
            
            // 메뉴 상세 모달 표시
            menuDetailModal.show();
        });
    });
    
    // 수량 증가/감소 버튼
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            let quantity = parseInt(quantityInput.value);
            
            if (action === 'increase') {
                quantity++;
            } else if (action === 'decrease' && quantity > 1) {
                quantity--;
            }
            
            quantityInput.value = quantity;
        });
    });
    
    // 상세 페이지에서 장바구니에 추가
    addToCartDetailBtn.addEventListener('click', function() {
        const menuId = this.dataset.id;
        const menuName = this.dataset.name;
        const menuPrice = parseInt(this.dataset.price);
        const quantity = parseInt(quantityInput.value);
        
        addToCart(menuId, menuName, menuPrice, quantity);
        menuDetailModal.hide();
        
        // 토스트 메시지 표시
        showToast(`${menuName} ${quantity}개를 장바구니에 담았습니다.`);
    });
    
    // '담기' 버튼 클릭 이벤트
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // 이벤트 전파 방지
            
            const menuId = this.dataset.id;
            const menuName = this.dataset.name;
            const menuPrice = parseInt(this.dataset.price);
            
            addToCart(menuId, menuName, menuPrice, 1);
            
            // 토스트 메시지 표시
            showToast(`${menuName}을(를) 장바구니에 담았습니다.`);
        });
    });
    
    // 장바구니 버튼 클릭 이벤트
    cartButton.addEventListener('click', function() {
        updateCartModal();
        cartModal.show();
    });
    
    // 결제하기 버튼 클릭 이벤트
    checkoutBtn.addEventListener('click', function() {
        // 주문 처리 로직 (실제 구현에서는 서버에 주문 데이터 전송)
        processOrder();
    });
    
    // 장바구니에 아이템 추가
    function addToCart(id, name, price, quantity) {
        // 이미 카트에 있는 아이템인지 확인
        const existingItemIndex = cart.items.findIndex(item => item.id === id);
        
        if (existingItemIndex > -1) {
            // 이미 있는 아이템이면 수량만 증가
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // 새 아이템 추가
            cart.items.push({
                id: id,
                name: name,
                price: price,
                quantity: quantity
            });
        }
        
        // 장바구니 UI 업데이트
        updateCart();
    }
    
    // 장바구니 아이템 수량 변경
    function updateItemQuantity(id, newQuantity) {
        const itemIndex = cart.items.findIndex(item => item.id === id);
        
        if (itemIndex > -1) {
            if (newQuantity <= 0) {
                // 수량이 0 이하면 아이템 삭제
                removeCartItem(id);
            } else {
                // 수량 업데이트
                cart.items[itemIndex].quantity = newQuantity;
                updateCart();
            }
        }
    }
    
    // 장바구니 아이템 삭제
    function removeCartItem(id) {
        cart.items = cart.items.filter(item => item.id !== id);
        updateCart();
    }
    
    // 장바구니 업데이트 (UI + 데이터)
    function updateCart() {
        // 총 금액 계산
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // 장바구니 뱃지 업데이트
        const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalQuantity;
        
        // 장바구니 버튼 표시/숨김
        if (totalQuantity > 0) {
            cartButton.classList.remove('d-none');
        } else {
            cartButton.classList.add('d-none');
        }
        
        // 장바구니 모달 업데이트 (열려있는 경우)
        if (document.getElementById('cartModal').classList.contains('show')) {
            updateCartModal();
        }
    }
    
    // 장바구니 모달 내용 업데이트
    function updateCartModal() {
        if (cart.items.length === 0) {
            // 장바구니가 비어있을 때
            emptyCartMessage.style.display = 'block';
            cartItemsContainer.style.display = 'none';
            cartSummary.style.display = 'none';
        } else {
            // 장바구니에 아이템이 있을 때
            emptyCartMessage.style.display = 'none';
            cartItemsContainer.style.display = 'block';
            cartSummary.style.display = 'block';
            
            // 장바구니 아이템 목록 생성
            cartItemsContainer.innerHTML = '';
            
            cart.items.forEach(item => {
                const cartItemEl = document.createElement('div');
                cartItemEl.className = 'cart-item';
                cartItemEl.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1 fw-bold">${item.name}</h6>
                            <p class="text-muted mb-0">₩${item.price.toLocaleString()}</p>
                        </div>
                        <button type="button" class="btn-close remove-item" data-id="${item.id}"></button>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div class="item-quantity-control">
                            <button class="btn btn-outline-secondary btn-sm quantity-change" data-id="${item.id}" data-action="decrease">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="form-control form-control-sm mx-2" value="${item.quantity}" min="1" readonly>
                            <button class="btn btn-outline-secondary btn-sm quantity-change" data-id="${item.id}" data-action="increase">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <span class="fw-bold">₩${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItemEl);
            });
            
            // 삭제 버튼 이벤트 리스너 추가
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    removeCartItem(this.dataset.id);
                });
            });
            
            // 수량 변경 버튼 이벤트 리스너 추가
            document.querySelectorAll('.quantity-change').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const action = this.dataset.action;
                    const currentQuantity = cart.items.find(item => item.id === id).quantity;
                    
                    if (action === 'increase') {
                        updateItemQuantity(id, currentQuantity + 1);
                    } else if (action === 'decrease') {
                        updateItemQuantity(id, currentQuantity - 1);
                    }
                });
            });
            
            // 총 금액 업데이트
            cartTotal.textContent = `₩${cart.total.toLocaleString()}`;
        }
    }
    
    // 주문 처리
    function processOrder() {
        // 실제 구현에서는 서버에 주문 데이터 전송
        console.log('주문 처리:', cart);
        
        // 주문 성공 가정
        // 주문번호 생성 (실제로는 서버에서 받아옴)
        const orderNumber = Math.floor(10000 + Math.random() * 90000);
        document.querySelector('#orderCompleteModal .order-number-container h4').textContent = `#${orderNumber}`;
        
        // 장바구니 비우기
        cart.items = [];
        updateCart();
        
        // 장바구니 모달 닫기
        cartModal.hide();
        
        // 주문 완료 모달 표시
        setTimeout(() => {
            orderCompleteModal.show();
        }, 500);
    }
    
    // 토스트 메시지 표시 함수
    function showToast(message) {
        // 기존 토스트가 있으면 제거
        const existingToast = document.querySelector('.toast-container');
        if (existingToast) {
            existingToast.remove();
        }
        
        // 토스트 컨테이너 생성
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 start-50 translate-middle-x p-3';
        toastContainer.style.zIndex = '1080';
        
        // 토스트 엘리먼트 생성
        const toastEl = document.createElement('div');
        toastEl.className = 'toast show';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        
        // 토스트 컨텐츠
        toastEl.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">Different, Together</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        // 토스트 추가
        toastContainer.appendChild(toastEl);
        document.body.appendChild(toastContainer);
        
        // 닫기 버튼 이벤트
        const closeButton = toastEl.querySelector('.btn-close');
        closeButton.addEventListener('click', function() {
            toastContainer.remove();
        });
        
        // 2초 후 자동 제거
        setTimeout(() => {
            toastContainer.remove();
        }, 2000);
    }
    
    // 언어 변경 기능
    const languageItems = document.querySelectorAll('.dropdown-menu .dropdown-item[data-lang]');
    const languageButton = document.querySelector('#languageDropdown');
    
    languageItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedLanguage = this.textContent.trim();
            const languageCode = this.dataset.lang;
            
            // 언어 버튼 텍스트 업데이트
            languageButton.innerHTML = `<i class="fas fa-globe me-1"></i> ${selectedLanguage}`;
            
            // 실제 구현에서는 여기에 언어 변경 로직 추가
            console.log(`언어가 ${selectedLanguage}(${languageCode})로 변경되었습니다.`);
            
            // 메뉴 번역 시뮬레이션
            translateMenuItems(languageCode);
            
            // 토스트 메시지 표시
            showToast(`언어가 ${selectedLanguage}로 변경되었습니다.`);
        });
    });
    
    // 메뉴 번역 시뮬레이션 (실제로는 서버에서 번역 데이터 받아옴)
    function translateMenuItems(languageCode) {
        const translationData = {
            'en': {
                '불고기': 'Bulgogi',
                '비빔밥': 'Bibimbap',
                '갈비찜': 'Braised Beef Ribs',
                '제육볶음': 'Spicy Stir-fried Pork',
                '김치찌개': 'Kimchi Stew',
                '된장찌개': 'Soybean Paste Stew',
                '파전': 'Green Onion Pancake',
                '소주': 'Soju',
                '담기': 'Add',
                '장바구니': 'Cart',
                '주문하기': 'Order Now',
                '인기': 'Popular',
                '추천 메뉴': 'Recommended',
                '메인 메뉴': 'Main Menu',
                '사이드': 'Side Dishes',
                '국/찌개': 'Soups & Stews',
                '음료': 'Drinks'
            },
            'ja': {
                '불고기': 'プルコギ',
                '비빔밥': 'ビビンバ',
                '갈비찜': 'カルビチム',
                '제육볶음': 'テユクポックム',
                '김치찌개': 'キムチチゲ',
                '된장찌개': 'テンジャンチゲ',
                '파전': 'パジョン',
                '소주': 'ソジュ',
                '담기': '追加',
                '장바구니': 'カート',
                '주문하기': '注文する',
                '인기': '人気',
                '추천 메뉴': 'おすすめ',
                '메인 메뉴': 'メインメニュー',
                '사이드': 'サイド',
                '국/찌개': 'スープ・チゲ',
                '음료': 'ドリンク'
            },
            'zh': {
                '불고기': '烤肉',
                '비빔밥': '拌饭',
                '갈비찜': '炖排骨',
                '제육볶음': '辣炒猪肉',
                '김치찌개': '泡菜汤',
                '된장찌개': '大酱汤',
                '파전': '葱饼',
                '소주': '烧酒',
                '담기': '添加',
                '장바구니': '购物车',
                '주문하기': '下单',
                '인기': '热门',
                '추천 메뉴': '推荐',
                '메인 메뉴': '主菜',
                '사이드': '配菜',
                '국/찌개': '汤品',
                '음료': '饮料'
            }
        };
        
        // 한국어인 경우 번역 안함
        if (languageCode === 'ko') {
            document.querySelectorAll('.english-translation').forEach(el => {
                el.style.display = 'none';
            });
            return;
        }
        
        // 선택된 언어에 대한 번역 데이터가 있는 경우
        if (translationData[languageCode]) {
            // 메뉴 이름 번역
            document.querySelectorAll('.menu-item .card-title').forEach(el => {
                const koreanText = el.textContent.trim();
                const translatedText = translationData[languageCode][koreanText] || koreanText;
                
                // 한국어 이름은 유지하고 번역된 이름을 괄호 안에 표시
                el.textContent = koreanText;
                
                // 영어 번역 업데이트
                const translationEl = el.closest('.card-body').querySelector('.english-translation');
                if (translationEl) {
                    translationEl.textContent = `(${translatedText})`;
                    translationEl.style.display = 'inline';
                }
            });
            
            // 버튼 텍스트 번역
            document.querySelectorAll('.add-to-cart').forEach(el => {
                const btnText = el.textContent.trim().replace(/\s*\S*\s*/, ''); // 아이콘 제외한 텍스트만
                const translatedBtnText = translationData[languageCode]['담기'] || '담기';
                el.innerHTML = `<i class="fas fa-plus"></i> ${translatedBtnText}`;
            });
            
            // 메뉴 카테고리 번역
            document.querySelectorAll('.nav-link').forEach(el => {
                const tabText = el.textContent.trim();
                const translatedTabText = translationData[languageCode][tabText] || tabText;
                el.textContent = translatedTabText;
            });
            
            // 장바구니 버튼 번역
            const cartBtnText = translationData[languageCode]['장바구니'] || '장바구니';
            document.querySelector('#openCartBtn').innerHTML = `<i class="fas fa-shopping-cart me-2"></i> ${cartBtnText} <span class="cart-badge">${cartBadge.textContent}</span>`;
            
            // 섹션 헤더 번역
            document.querySelectorAll('.h6.fw-bold').forEach(el => {
                const headerText = el.textContent.trim().replace(/^[\s\S]*\s/, ''); // 아이콘 제외한 텍스트만
                const translatedHeaderText = translationData[languageCode][headerText] || headerText;
                if (el.querySelector('.fas.fa-star')) {
                    el.innerHTML = `<i class="fas fa-star text-warning me-2"></i>${translatedHeaderText}`;
                } else {
                    el.textContent = translatedHeaderText;
                }
            });
        }
    }
});