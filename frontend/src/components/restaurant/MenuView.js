import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Info } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import axios from 'axios';

const MenuView = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { text, language } = useLanguage();
  const { addToCart } = useCart();
  
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [translatedMenus, setTranslatedMenus] = useState({});
  const [menuDetailVisible, setMenuDetailVisible] = useState(null);
  
  // 식당 및 메뉴 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 식당 정보 가져오기
        const restaurantRes = await axios.get(`/api/restaurants/${restaurantId}`);
        setRestaurant(restaurantRes.data);
        
        // 메뉴 가져오기
        const menuRes = await axios.get(`/api/restaurants/${restaurantId}/menus`);
        setMenus(menuRes.data);
        
        // 카테고리 불러오기
        const categoryRes = await axios.get('/api/categories');
        
        // 카테고리 목록 가공
        const allCategories = [
          { id: 'all', name: text.all },
          { id: 'popular', name: text.popular },
          ...categoryRes.data
        ];
        
        setCategories(allCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [restaurantId, text.all, text.popular]);
  
  // 언어가 한국어가 아니면 메뉴 번역
  useEffect(() => {
    const translateMenus = async () => {
      if (language === 'ko' || menus.length === 0) return;
      
      try {
        // 번역할 항목 준비
        const itemsToTranslate = menus.map((menu, index) => ({
          id: menu.menu_id,
          text: `${menu.menu_name}\n${menu.description || ''}`
        }));
        
        // 번역 서비스 호출
        const response = await axios.post('http://localhost:5001/api/translate/batch', {
          items: itemsToTranslate,
          source_lang: 'ko',
          target_lang: language
        });
        
        // 번역 결과 처리
        const translations = {};
        response.data.translations.forEach(item => {
          const [name, description] = item.translated.split('\n', 2);
          translations[item.id] = {
            name: name,
            description: description || ''
          };
        });
        
        setTranslatedMenus(translations);
      } catch (error) {
        console.error('Translation error:', error);
      }
    };
    
    translateMenus();
  }, [language, menus]);
  
  // 메뉴 필터링
  const filteredMenus = menus.filter(menu => {
    const menuName = translatedMenus[menu.menu_id]?.name || menu.menu_name;
    const menuDesc = translatedMenus[menu.menu_id]?.description || menu.description || '';
    
    const matchesSearch = 
      menuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menuDesc.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      activeCategory === 'all' || 
      (activeCategory === 'popular' && menu.is_popular) || 
      menu.category_id.toString() === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // 장바구니에 메뉴 추가
  const handleAddToCart = (menu) => {
    // 번역된 이름이 있으면 해당 이름으로 메뉴 이름 대체
    const translatedMenu = translatedMenus[menu.menu_id] 
      ? {
          ...menu,
          menu_name: translatedMenus[menu.menu_id].name,
          description: translatedMenus[menu.menu_id].description || menu.description
        }
      : menu;
      
    addToCart(translatedMenu);
    
    // 토스트 메시지로 알림
    // 실제 구현에서는 토스트 컴포넌트 추가 필요
  };
  
  // 메뉴 상세 정보 표시
  const toggleMenuDetail = (menuId) => {
    if (menuDetailVisible === menuId) {
      setMenuDetailVisible(null);
    } else {
      setMenuDetailVisible(menuId);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <div className="text-blue-600">{text.loading}</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-16">
      <header className="bg-white p-4 shadow-sm">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold ml-3">{restaurant?.restaurant_name}</h1>
        </div>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={text.searchMenu}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-2 pb-1">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      <div className="flex-1 p-4 overflow-auto space-y-4">
        {filteredMenus.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {text.noResults || '검색 결과가 없습니다.'}
          </div>
        ) : (
          filteredMenus.map(menu => (
            <div key={menu.menu_id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex">
                <img 
                  src={menu.image || '/api/placeholder/100/100'} 
                  alt={translatedMenus[menu.menu_id]?.name || menu.menu_name} 
                  className="w-24 h-24 object-cover" 
                />
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {translatedMenus[menu.menu_id]?.name || menu.menu_name}
                      </h3>
                      <button
                        onClick={() => toggleMenuDetail(menu.menu_id)}
                        className="p-1 text-gray-500"
                      >
                        <Info size={18} />
                      </button>
                    </div>
                    
                    {(translatedMenus[menu.menu_id]?.description || menu.description) && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {translatedMenus[menu.menu_id]?.description || menu.description}
                      </p>
                    )}
                    
                    <p className="text-sm font-medium mt-2">
                      {text.price} {menu.price.toLocaleString()}원
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(menu)}
                    className="self-end p-2 rounded-full bg-blue-600 text-white"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              {/* 메뉴 상세 정보 */}
              {menuDetailVisible === menu.menu_id && (
                <div className="p-3 border-t border-gray-100">
                  {menu.ingredients && (
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold">{text.ingredients || '재료'}</h4>
                      <p className="text-sm text-gray-600">{menu.ingredients}</p>
                    </div>
                  )}
                  
                  {menu.allergy_info && (
                    <div>
                      <h4 className="text-sm font-semibold">{text.allergyInfo || '알레르기 정보'}</h4>
                      <p className="text-sm text-gray-600">{menu.allergy_info}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuView;