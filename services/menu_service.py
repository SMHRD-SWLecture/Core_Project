from models.menu import Menu

class MenuService:
    def get_menu_by_restaurant(self, restaurant_id):
        return Menu.query.filter_by(restaurant_id=restaurant_id).all()

    def create_menu_item(self, restaurant_id, name, description, price):
        menu_item = Menu(
            restaurant_id=restaurant_id,
            name=name,
            description=description,
            price=price
        )
        menu_item.save()
        return menu_item

    def get_menu_item(self, menu_id):
        return Menu.query.get(menu_id)

    def update_menu_item(self, menu_id, **kwargs):
        menu_item = self.get_menu_item(menu_id)
        if menu_item:
            for key, value in kwargs.items():
                setattr(menu_item, key, value)
            menu_item.save()
            return menu_item
        return None 