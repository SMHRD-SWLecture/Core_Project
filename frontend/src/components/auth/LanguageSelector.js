import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../contexts/LanguageContext';

const LanguageSelector = () => {
  const navigate = useNavigate();
  const { changeLanguage, text } = useLanguage();
  
  const handleLanguageSelect = (langCode) => {
    // 선택한 언어로 변경
    changeLanguage(langCode);
    
    // 로그인 페이지로 이동
    navigate('/login');
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-white">
      <h1 className="text-2xl font-bold mb-8">{text.selectLanguage}</h1>
      <h2 className="text-lg mb-8">{text.description}</h2>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {SUPPORTED_LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            className="flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:bg-gray-50"
          >
            <span className="text-2xl">{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector; 