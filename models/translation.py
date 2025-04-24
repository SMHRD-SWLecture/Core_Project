"""
Different, Together - QR 오더 서비스
번역 관련 데이터베이스 모델
"""

from sqlalchemy.sql import func
from app import db

class TranslationKey(db.Model):
    """번역 키 모델"""
    __tablename__ = 'translation_keys'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, server_default=func.now())
    
    def __repr__(self):
        return f'<TranslationKey {self.key}>'
    
    def to_dict(self):
        """API를 위한 번역 키 정보 딕셔너리 반환"""
        return {
            'id': self.id,
            'key': self.key,
            'description': self.description,
            'category': self.category,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'translations': [translation.to_dict() for translation in self.translations]
        }


class Translation(db.Model):
    """번역 모델"""
    __tablename__ = 'translations'
    
    id = db.Column(db.Integer, primary_key=True)
    key_id = db.Column(db.Integer, db.ForeignKey('translation_keys.id'), nullable=False)
    language_code = db.Column(db.String(10), nullable=False)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    
    # 복합 유니크 제약 (키 + 언어)
    __table_args__ = (
        db.UniqueConstraint('key_id', 'language_code', name='unique_key_language'),
    )
    
    # 관계 설정
    key = db.relationship('TranslationKey', backref=db.backref('translations', lazy=True))
    
    def __repr__(self):
        return f'<Translation {self.language_code}:{self.key_id}>'
    
    def to_dict(self):
        """API를 위한 번역 정보 딕셔너리 반환"""
        return {
            'id': self.id,
            'key_id': self.key_id,
            'language_code': self.language_code,
            'text': self.text,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }