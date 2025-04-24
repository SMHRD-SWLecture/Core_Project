"""
Different, Together - QR 오더 서비스
Flask 애플리케이션 메인 파일
"""

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# 설정 가져오기
from config import get_config

# 확장 모듈 초기화
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
bcrypt = Bcrypt()

def create_app():
    """Flask 애플리케이션 팩토리 함수"""
    app = Flask(__name__)
    
    # 설정 적용
    app.config.from_object(get_config())
    
    # 확장 모듈 초기화
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    
    # CORS 설정 (API 요청을 위해)
    CORS(app)
    
    # 업로드 폴더 생성
    os.makedirs(os.path.join(app.root_path, app.config['UPLOAD_FOLDER']), exist_ok=True)
    
    # 블루프린트 등록
    from routes.main import main as main_blueprint
    from routes.auth import auth as auth_blueprint
    from routes.restaurant import restaurant as restaurant_blueprint
    from routes.menu import menu as menu_blueprint
    from routes.order import order as order_blueprint
    from routes.api import api as api_blueprint
    
    app.register_blueprint(main_blueprint)
    app.register_blueprint(auth_blueprint, url_prefix='/auth')
    app.register_blueprint(restaurant_blueprint, url_prefix='/restaurant')
    app.register_blueprint(menu_blueprint, url_prefix='/menu')
    app.register_blueprint(order_blueprint, url_prefix='/order')
    app.register_blueprint(api_blueprint, url_prefix='/api')
    
    # 모델 임포트 (SQLAlchemy가 인식하도록)
    from models.user import User, UserType, Country
    from models.restaurant import Restaurant
    from models.menu import Menu, MenuCategory
    from models.order import Order, OrderDetail
    from models.translation import TranslationKey, Translation
    
    # 사용자 로더 등록
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # 오류 핸들러
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('errors/404.html'), 404
    
    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('errors/500.html'), 500
    
    return app

# 애플리케이션 실행
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)