from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required
from models.menu import Menu
from services.menu_service import MenuService

menu_bp = Blueprint('menu', __name__)
menu_service = MenuService()

@menu_bp.route('/restaurants/<int:restaurant_id>/menu')
def menu_list(restaurant_id):
    menu_items = menu_service.get_menu_by_restaurant(restaurant_id)
    return render_template('menu/menu.html', menu_items=menu_items, restaurant_id=restaurant_id)

@menu_bp.route('/restaurants/<int:restaurant_id>/menu/create', methods=['GET', 'POST'])
@login_required
def create_menu_item(restaurant_id):
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        price = request.form.get('price')
        menu_item = menu_service.create_menu_item(restaurant_id, name, description, price)
        if menu_item:
            return redirect(url_for('menu.menu_list', restaurant_id=restaurant_id))
    return render_template('menu/create.html', restaurant_id=restaurant_id) 