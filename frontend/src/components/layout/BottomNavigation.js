import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  
  // 현재 활성화된 탭 확인
  const isActive = (path) => {
    if (path === '/home' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };
  
  // 인증되지 않은 사용자는 하단 네비게이션 표시 안함
  if (!isAuthenticated) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-10">
      <button
        onClick={() => navigate('/home')}
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive('/home') ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        <Home size={24} />
        <span className="text-xs mt-1">홈</span>
      </button>
      
      <button
        onClick={() => navigate('/search')}
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive('/search') ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        <Search size={24} />
        <span className="text-xs mt-1">검색</span>
      </button>
      
      <button
        onClick={() => navigate('/cart')}
        className={`flex flex-col items-center justify-center w-full h-full relative ${
          isActive('/cart') || isActive('/checkout') ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute top-0 right-1/3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
        <span className="text-xs mt-1">장바구니</span>
      </button>
      
      <button
        onClick={() => navigate('/profile')}
        className={`flex flex-col items-center justify-center w-full h-full ${
          isActive('/profile') ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        <User size={24} />
        <span className="text-xs mt-1">내 정보</span>
      </button>
    </div>
  );
};

export default BottomNavigation;