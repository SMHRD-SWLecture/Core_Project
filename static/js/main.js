/**
 * Different, Together - QR 오더 서비스
 * 클라이언트 사이드 자바스크립트
 */

document.addEventListener('DOMContentLoaded', function() {
    // 내비게이션 바 스크롤 효과
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
            navbar.classList.add('bg-white');
        } else {
            navbar.classList.remove('shadow-sm');
            navbar.classList.remove('bg-white');
        }
    });
    
    // 부드러운 스크롤 효과
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 내비게이션 바 높이 고려
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 언어 전환 기능
    const languageItems = document.querySelectorAll('#languageDropdown + .dropdown-menu .dropdown-item');
    const languageButton = document.querySelector('#languageDropdown');
    
    languageItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedLanguage = this.textContent.trim();
            
            // 언어 버튼 텍스트 업데이트
            languageButton.innerHTML = `<i class="fas fa-globe"></i> ${selectedLanguage}`;
            
            // 실제 구현에서는 여기에 언어 변경 로직 추가
            // 예: 서버에 언어 설정 저장 또는 i18n 라이브러리 호출
            console.log(`언어가 ${selectedLanguage}로 변경되었습니다.`);
            
            // 데모: 페이지 새로고침 대신 알림 표시
            showToast(`언어가 ${selectedLanguage}로 변경되었습니다.`);
        });
    });
    
    // 토스트 메시지 표시 함수
    function showToast(message) {
        // 기존 토스트가 있으면 제거
        const existingToast = document.querySelector('.toast-container');
        if (existingToast) {
            existingToast.remove();
        }
        
        // 토스트 컨테이너 생성
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '11';
        
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
        
        // 3초 후 자동 제거
        setTimeout(() => {
            toastContainer.remove();
        }, 3000);
    }
    
    // 식당 검색 기능 (데모용)
    const searchButton = document.querySelector('.input-group button');
    const searchInput = document.querySelector('.input-group input');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // 실제 구현에서는 여기에 검색 API 호출
                console.log(`검색어: ${searchTerm}`);
                
                // 데모: 페이지 이동 대신 알림
                showToast(`'${searchTerm}'에 대한 검색 결과를 불러오는 중입니다...`);
                
                // 검색 후 입력창 비우기
                searchInput.value = '';
            } else {
                showToast('검색어를 입력해주세요.');
            }
        });
        
        // Enter 키 이벤트 추가
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
    
    // QR 코드 데모 스캔 시뮬레이션
    const demoQrButton = document.querySelector('#scan-demo .btn-primary');
    if (demoQrButton) {
        demoQrButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 로딩 효과 표시
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 로딩중...';
            this.disabled = true;
            
            // 2초 후 데모 메뉴 페이지로 이동 시뮬레이션
            setTimeout(() => {
                showToast('QR 코드 스캔 완료! 메뉴 페이지로 이동합니다.');
                
                // 실제 구현에서는 페이지 이동 또는 메뉴 모달 표시
                setTimeout(() => {
                    window.location.href = '/demo-menu';
                    // 또는 모달 표시: showMenuModal();
                }, 1000);
            }, 2000);
        });
    }
    
    // 레스토랑 카드 호버 효과
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    restaurantCards.forEach(card => {
        card.addEventListener('mouseover', function() {
            this.classList.add('shadow-lg');
        });
        
        card.addEventListener('mouseout', function() {
            this.classList.remove('shadow-lg');
        });
    });
    
    // 모바일 메뉴 닫기
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarMenu = document.querySelector('#navbarNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    if (navbarToggler && navbarMenu) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) { // 모바일 뷰에서만 자동 닫기
                    const bsCollapse = new bootstrap.Collapse(navbarMenu);
                    bsCollapse.hide();
                }
            });
        });
    }
    
    // 뉴스레터 구독 폼 제출
    const newsletterForm = document.querySelector('footer form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // 실제 구현에서는 여기에 API 호출
                console.log(`이메일 구독: ${email}`);
                
                // 성공 메시지 표시
                showToast('뉴스레터 구독이 완료되었습니다. 감사합니다!');
                
                // 입력창 비우기
                emailInput.value = '';
            } else {
                showToast('유효한 이메일 주소를 입력해주세요.');
            }
        });
    }
    
    // 이메일 유효성 검사 함수
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // 뒤로가기 시 스크롤 위치 복원
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            // 브라우저 뒤로가기로 돌아왔을 때 실행
            window.scrollTo(0, window.scrollY);
        }
    });
    
    // 이미지 지연 로딩 (성능 최적화)
    if ('IntersectionObserver' in window) {
        const imgOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, imgOptions);
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }
});