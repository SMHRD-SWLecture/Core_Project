import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { text } = useLanguage();
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // 레스토랑 데이터 가져오기
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('/restaurants');
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);
  
  const handleScanQR = () => {
    // QR 스캐너 열기 (실제 앱에서는 카메라 API 연동 필요)
    // 여기서는 예시로 음식점 상세 페이지로 바로 이동
    navigate('/restaurant/1');
  };
  
  // 검색 기능
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // 검색 결과 필터링
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex flex-col h-full bg-gray-50 pb-16">
      <header className="bg-white p-4 shadow-sm">
        {currentUser && (
          <div className="mb-3 text-sm text-gray-600">
            {text.welcome}, {currentUser.name || currentUser.username}
          </div>
        )}
        <h1 className="text-xl font-semibold mb-3">{text.findRestaurants}</h1>
        <div className="relative">
          <input
            type="text"
            placeholder={text.searchRestaurants}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </header>
      
      <div className="p-4 overflow-auto">
        <button
          onClick={handleScanQR}
          className="flex items-center justify-center w-full bg-blue-600 text-white p-3 rounded-lg mb-6"
        >
          <Globe className="mr-2" size={20} />
          {text.scanQR}
        </button>
        
        {loading ? (
          <div className="text-center py-8">{text.loading}</div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {text.noResults || '검색 결과가 없습니다.'}
          </div>
        ) : (
          <>
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">{text.nearbyRestaurants}</h2>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-2">
                  {filteredRestaurants.slice(0, 4).map(restaurant => (
                    <div 
                      key={restaurant.id} 
                      className="w-40 flex-shrink-0"
                      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                        <img 
                          src={restaurant.image || '/api/placeholder/150/100'} 
                          alt={restaurant.name} 
                          className="w-full h-24 object-cover" 
                        />
                        <div className="p-2">
                          <h3 className="font-medium">{restaurant.name}</h3>
                          <p className="text-sm text-gray-500">{restaurant.type}</p>
                          <div className="flex items-center text-sm mt-1">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{restaurant.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-3">{text.popularRestaurants}</h2>
              <div className="space-y-4">
                {filteredRestaurants.map(restaurant => (
                  <div 
                    key={restaurant.id} 
                    className="flex bg-white rounded-lg overflow-hidden shadow-sm"
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  >
                    <img 
                      src={restaurant.image || '/api/placeholder/150/100'} 
                      alt={restaurant.name} 
                      className="w-24 h-24 object-cover" 
                    />
                    <div className="p-3 flex-1">
                      <h3 className="font-medium">{restaurant.name}</h3>
                      <p className="text-sm text-gray-500">{restaurant.type}</p>
                      <div className="flex items-center text-sm mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{restaurant.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;