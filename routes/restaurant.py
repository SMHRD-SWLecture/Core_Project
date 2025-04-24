from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required
from models.restaurant import Restaurant
from services.restaurant_service import RestaurantService

restaurant_bp = Blueprint('restaurant', __name__)
restaurant_service = RestaurantService()

@restaurant_bp.route('/restaurants')
def list_restaurants():
    restaurants = restaurant_service.get_all_restaurants()
    return render_template('restaurant/list.html', restaurants=restaurants)

@restaurant_bp.route('/restaurants/<int:restaurant_id>')
def restaurant_detail(restaurant_id):
    restaurant = restaurant_service.get_restaurant_by_id(restaurant_id)
    if not restaurant:
        return render_template('404.html'), 404
    return render_template('restaurant/detail.html', restaurant=restaurant)

@restaurant_bp.route('/restaurants/create', methods=['GET', 'POST'])
@login_required
def create_restaurant():
    if request.method == 'POST':
        name = request.form.get('name')
        address = request.form.get('address')
        phone = request.form.get('phone')
        restaurant = restaurant_service.create_restaurant(name, address, phone)
        if restaurant:
            return redirect(url_for('restaurant.restaurant_detail', restaurant_id=restaurant.id))
    return render_template('restaurant/create.html') 