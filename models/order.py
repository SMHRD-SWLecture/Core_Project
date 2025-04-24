"""
Different, Together - QR 오더 서비스
주문 관련 데이터베이스 모델
"""

from sqlalchemy.sql import func
from app import db

class Order(db.Model):
    """주문 모델"""
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    order_number = db.Column(db.String(20), unique=True, nullable=False)
    total_amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, completed, cancelled
    ordered_at = db.Column(db.DateTime, server_default=func.now())
    completed_at = db.Column(db.DateTime)
    
    # 관계 설정
    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    restaurant = db.relationship('Restaurant', backref=db.backref('orders', lazy=True))
    
    def __repr__(self):
        return f'<Order {self.order_number}>'
    
    def to_dict(self):
        """API를 위한
 주문 정보 딕셔너리 반환"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'restaurant_id': self.restaurant_id,
            'restaurant_name': self.restaurant.name if self.restaurant else None,
            'order_number': self.order_number,
            'total_amount': self.total_amount,
            'status': self.status,
            'ordered_at': self.ordered_at.isoformat() if self.ordered_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'details': [detail.to_dict() for detail in self.details]
        }


class OrderDetail(db.Model):
    """주문 상세 모델"""
    __tablename__ = 'order_details'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    
    # 관계 설정
    order = db.relationship('Order', backref=db.backref('details', lazy=True))
    menu = db.relationship('Menu', backref=db.backref('order_details', lazy=True))
    
    def __repr__(self):
        return f'<OrderDetail {self.id}>'
    
    def to_dict(self):
        """API를 위한 주문 상세 정보 딕셔너리 반환"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'menu_id': self.menu_id,
            'menu_name': self.menu.name if self.menu else None,
            'quantity': self.quantity,
            'price': self.price,
            'subtotal': self.quantity * self.price
        }