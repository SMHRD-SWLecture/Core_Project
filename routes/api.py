from flask import Blueprint, jsonify, request
from services.translation_service import TranslationService

api_bp = Blueprint('api', __name__)
translation_service = TranslationService()

@api_bp.route('/api/translate', methods=['POST'])
def translate():
    text = request.json.get('text')
    target_language = request.json.get('target_language')
    if not text or not target_language:
        return jsonify({'error': 'Missing required parameters'}), 400
    
    translated_text = translation_service.translate(text, target_language)
    return jsonify({'translated_text': translated_text})

@api_bp.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    restaurants = RestaurantService().get_all_restaurants()
    return jsonify([restaurant.to_dict() for restaurant in restaurants])

@api_bp.route('/api/restaurants/<int:restaurant_id>/menu', methods=['GET'])
def get_menu(restaurant_id):
    menu_items = MenuService().get_menu_by_restaurant(restaurant_id)
    return jsonify([item.to_dict() for item in menu_items]) 