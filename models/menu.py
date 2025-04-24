"""
Different, Together - QR 오더 서비스
메뉴 관련 데이터베이스 모델
"""

from sqlalchemy.sql import func
from app import db

class MenuCategory(db.Model):
    """메뉴 카테고리 모델"""
    __tablename__ = 'menu_categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    
    def __repr__(self):
        return f'<MenuCategory {self.name}>'
    
    def to_dict(self):
        """API를 위한 카테고리 정보 딕셔너리 반환"""
        return {
            'id': self.id,
            'name': self.name
        }


class Menu(db.Model):
    """메뉴 모델"""
    __tablename__ = 'menus'
    
    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('menu_categories.id'))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(255))
    is_available = db.Column(db.Boolean, default=True)
    is_recommended = db.Column(db.Boolean, default=False)
    total_sales = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    
    # 관계 설정
    restaurant = db.relationship('Restaurant', backref=db.backref('menus', lazy=True))
    category = db.relationship('MenuCategory', backref=db.backref('menus', lazy=True))
    
    def __repr__(self):
        return f'<Menu {self.name}>'
    
    def to_dict(self):
        """API를 위한 메뉴 정보 딕셔너리 반환"""
        return {
            'id': self.id,
            'restaurant_id': self.restaurant_id,
            'restaurant_name': self.restaurant.name if self.restaurant else None,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image_url': self.image_url,
            'is_available': self.is_available,
            'is_recommended': self.is_recommended,
            'total_sales': self.total_sales,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class MenuAllergen(db.Model):
    """메뉴 알레르기 성분 모델"""
    __tablename__ = 'menu_allergens'
    
    id = db.Column(db.Integer, primary_key=True)
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'), nullable=False)
    allergen_name = db.Column(db.String(50), nullable=False)
    
    # 관계 설정
    menu = db.relationship('Menu', backref=db.backref('allergens', lazy=True))
    
    def __repr__(self):
        return f'<MenuAllergen {self.allergen_name}>'