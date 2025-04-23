import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Settings, LogOut, ChevronRight } from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { text } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const menuItems = [
    {
      icon: <User size={20} />,
      label: text.personalInfo,
      onClick: () => navigate('/profile/edit')
    },
    {
      icon: <Settings size={20} />,
      label: text.settings,
      onClick: () => navigate('/settings')
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 프로필 헤더 */}
      <div className="bg-white p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {currentUser?.profileImage ? (
              <img 
                src={currentUser.profileImage} 
                alt={currentUser.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={32} className="text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{currentUser?.name}</h1>
            <p className="text-gray-500">{currentUser?.email}</p>
          </div>
        </div>
      </div>
      
      {/* 메뉴 목록 */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex items-center justify-between w-full p-4 hover:bg-gray-50 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-600">{item.icon}</div>
                <span>{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </div>
        
        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center justify-center w-full mt-4 p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
        >
          <LogOut size={20} className="mr-2" />
          {text.logout}
        </button>
      </div>
    </div>
  );
};

export default UserProfile; 