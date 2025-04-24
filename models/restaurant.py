"""
Different, Together - QR 오더 서비스
식당 관련 데이터베이스 모델
"""

from sqlalchemy.sql import func
from app import db

class Restaurant(db.Model):
    """식당 모델"""
    __tablename__ = 'restaurants'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    address = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    
    # 관계 설정
    owner = db.relationship('User', backref=db.backref('restaurants', lazy=True))
    
    def __repr__(self):
        return f'<Restaurant {self.name}>'
    
    def to_dict(self):
        """API를 위한 식당 정보 딕셔너리 반환"""
        return {
            'id': self.id,
            'name': self.name,
            'owner_id': self.owner_id,
            'owner_name': self.owner.name if self.owner else None,
            'address': self.address,
            'phone': self.phone,
            'description': self.description,
            'image_url': self.image_url,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }