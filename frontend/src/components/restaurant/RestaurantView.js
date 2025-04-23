import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';

const RestaurantView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { text } = useLanguage();
  
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        setError(err.response?.data?.message || text.error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurant();
  }, [id, text.error]);
  
  const handleViewMenu = () => {
    navigate(`/menu/${id}`);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="bg-white p-4 shadow-sm">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft size={24} />
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div>{text.loading}</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="bg-white p-4 shadow-sm">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft size={24} />
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }
  
  if (!restaurant) {
    return null;
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-16">
      <div className="relative h-64">
        <img 
          src={restaurant.image || '/api/placeholder/400/300'} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
      
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        <div className="flex items-center text-gray-600 mt-1">
          <Star size={16} className="text-yellow-500" />
          <span className="ml-1">{restaurant.rating}</span>
          <span className="mx-2">•</span>
          <span>{restaurant.type}</span>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-start">
            <MapPin size={18} className="text-gray-500 mr-2 mt-0.5" />
            <span>{restaurant.address}</span>
          </div>
          
          {restaurant.phone && (
            <div className="flex items-center">
              <Phone size={18} className="text-gray-500 mr-2" />
              <span>{restaurant.phone}</span>
            </div>
          )}
        </div>
      </div>
      
      {restaurant.description && (
        <div className="p-4 bg-white mt-2 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">소개</h2>
          <p className="text-gray-700">{restaurant.description}</p>
        </div>
      )}
      
      <div className="p-4 bg-white mt-2 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">영업시간</h2>
        <div className="space-y-1">
          {restaurant.hours ? (
            Object.entries(restaurant.hours).map(([day, time]) => (
              <div key={day} className="flex justify-between">
                <span>{day}</span>
                <span>{time}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">영업시간 정보가 없습니다.</p>
          )}
        </div>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="p-4">
        <button
          onClick={handleViewMenu}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
        >
          메뉴 보기
        </button>
      </div>
    </div>
  );
};

export default RestaurantView;