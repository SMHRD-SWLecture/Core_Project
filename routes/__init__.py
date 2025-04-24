from flask import Blueprint

def init_app(app):
    from . import auth, main, restaurant, menu, order, api
    
    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(main.main_bp)
    app.register_blueprint(restaurant.restaurant_bp)
    app.register_blueprint(menu.menu_bp)
    app.register_blueprint(order.order_bp)
    app.register_blueprint(api.api_bp) 