from models.order import Order

class OrderService:
    def create_order(self, user_id, restaurant_id, menu_items):
        order = Order(
            user_id=user_id,
            restaurant_id=restaurant_id,
            menu_items=menu_items
        )
        order.save()
        return order

    def get_user_orders(self, user_id):
        return Order.query.filter_by(user_id=user_id).all()

    def get_order_by_id(self, order_id):
        return Order.query.get(order_id)

    def update_order_status(self, order_id, status):
        order = self.get_order_by_id(order_id)
        if order:
            order.status = status
            order.save()
            return order
        return None 