import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { text } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // 2초 후 인증 상태에 따라 다른 페이지로 이동
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/home');
      } else {
        navigate('/language');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-blue-700 text-white">
      <div className="text-4xl font-bold mb-4">{text.appName}</div>
      <div className="text-xl">{text.welcomeMessage}</div>
      <div className="mt-12 animate-pulse">
        <Globe size={64} />
      </div>
    </div>
  );
};

export default SplashScreen;