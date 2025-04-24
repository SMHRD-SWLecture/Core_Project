"""
Different, Together - QR 오더 서비스
사용자 관련 데이터베이스 모델
"""

from flask_login import UserMixin
from sqlalchemy.sql import func
from app import db

class User(db.Model, UserMixin):
    """사용자 모델"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    country_id = db.Column(db.Integer, db.ForeignKey('countries.id'), nullable=False)
    birth_year = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    user_type_id = db.Column(db.Integer, db.ForeignKey('user_types.id'), nullable=False)
    
    # 관계 설정
    country = db.relationship('Country', backref=db.backref('users', lazy=True))
    user_type = db.relationship('UserType', backref=db.backref('users', lazy=True))
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        """API를 위한 사용자 정보 딕셔너리 반환"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'country_id': self.country_id,
            'country_name': self.country.name if self.country else None,
            'birth_year': self.birth_year,
            'user_type': self.user_type.name if self.user_type else None
        }


class UserType(db.Model):
    """사용자 유형 모델 (손님, 식당 주인 등)"""
    __tablename__ = 'user_types'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    
    def __repr__(self):
        return f'<UserType {self.name}>'


class Country(db.Model):
    """국가 모델"""
    __tablename__ = 'countries'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    language_code = db.Column(db.String(10), nullable=False)
    
    def __repr__(self):
        return f'<Country {self.name}>'