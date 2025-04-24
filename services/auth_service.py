from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

class AuthService:
    def authenticate(self, email, password):
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            return user
        return None

    def register(self, email, password, name):
        if User.query.filter_by(email=email).first():
            return False
        
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            name=name
        )
        user.save()
        return True 