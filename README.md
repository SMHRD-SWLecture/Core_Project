# 번역 서비스 프로젝트

## 프로젝트 구조
```
different_together/
│
├── app.py                  # Flask 애플리케이션 메인 파일
├── config.py               # 설정 파일
├── requirements.txt        # 필요한 패키지 목록
│
├── models/                 # 데이터베이스 모델
│   ├── __init__.py
│   ├── user.py             # 사용자 관련 모델
│   ├── restaurant.py       # 식당 관련 모델
│   ├── menu.py             # 메뉴 관련 모델
│   ├── order.py            # 주문 관련 모델
│   └── translation.py      # 번역 관련 모델
│
├── routes/                 # 라우트 정의
│   ├── __init__.py
│   ├── auth.py             # 인증 관련 라우트
│   ├── main.py             # 메인 페이지 라우트
│   ├── restaurant.py       # 식당 관련 라우트
│   ├── menu.py             # 메뉴 관련 라우트
│   ├── order.py            # 주문 관련 라우트
│   └── api.py              # API 엔드포인트
│
├── services/               # 비즈니스 로직
│   ├── __init__.py
│   ├── auth_service.py     # 인증 관련 서비스
│   ├── menu_service.py     # 메뉴 관련 서비스
│   ├── order_service.py    # 주문 관련 서비스
│   └── translation_service.py  # 번역 관련 서비스
│
├── static/                 # 정적 파일 (CSS, JS, 이미지 등)
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/            # 업로드된 이미지 파일
│
├── templates/              # HTML 템플릿
│   ├── base.html           # 기본 레이아웃
│   ├── index.html          # 메인 페이지
│   ├── auth/
│   │   ├── login.html      # 로그인 페이지
│   │   └── signup.html     # 회원가입 페이지
│   ├── restaurant/
│   │   ├── list.html       # 식당 목록
│   │   └── detail.html     # 식당 상세
│   └── menu/
│       └── menu.html       # 메뉴 페이지
│
├── utils/                  # 유틸리티 함수
│   ├── __init__.py
│   ├── db_utils.py         # 데이터베이스 유틸리티
│   └── translator.py       # 번역 유틸리티
│
└── db/                     # 데이터베이스 관련 파일
    ├── schema.sql          # 데이터베이스 스키마 생성 SQL
    └── seed_data.sql       # 초기 데이터 SQL
    
```

## 설치 방법
```bash
pip install -r requirements.txt
```

## 실행 방법
```bash
python app.py
```
서버가 실행되면 웹 브라우저에서 http://localhost:5000 으로 접속

## 기술 스택
- HTML
- CSS
- JavaScript
- Flask (Python) 