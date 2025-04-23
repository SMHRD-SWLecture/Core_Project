import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { text } = useLanguage();
  
  // 실제 앱에서는 주문 ID를 라우트 파라미터나 상태에서 가져와야 함
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{text.orderConfirmed}</h1>
        <p className="text-gray-600 mb-6">{text.orderConfirmationMessage}</p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-500 mb-1">{text.orderId}</p>
          <p className="font-mono font-medium">{orderId}</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
          >
            <Home size={18} className="mr-2" />
            <span>{text.backToHome}</span>
          </button>
          
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-white text-blue-600 p-3 rounded-lg border border-blue-600 flex items-center justify-center"
          >
            <ShoppingBag size={18} className="mr-2" />
            <span>{text.viewOrders}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;