from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from models.order import Order
from services.order_service import OrderService

order_bp = Blueprint('order', __name__)
order_service = OrderService()

@order_bp.route('/orders')
@login_required
def order_list():
    orders = order_service.get_user_orders(current_user.id)
    return render_template('order/list.html', orders=orders)

@order_bp.route('/orders/create', methods=['POST'])
@login_required
def create_order():
    restaurant_id = request.form.get('restaurant_id')
    menu_items = request.form.getlist('menu_items')
    order = order_service.create_order(current_user.id, restaurant_id, menu_items)
    if order:
        return redirect(url_for('order.order_detail', order_id=order.id))
    return redirect(url_for('main.index'))

@order_bp.route('/orders/<int:order_id>')
@login_required
def order_detail(order_id):
    order = order_service.get_order_by_id(order_id)
    if not order or order.user_id != current_user.id:
        return render_template('404.html'), 404
    return render_template('order/detail.html', order=order) 