import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, Info, Lock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder } from '../../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { text } = useLanguage();
  const { cart, totalAmount, clearCart } = useCart();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  // 결제 수단 옵션
  const paymentOptions = [
    { id: 'card', name: text.creditCard || '신용카드', icon: <CreditCard size={20} /> },
    { id: 'cash', name: text.cash || '현금', icon: null },
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 결제 처리 로직 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 장바구니 비우기
      clearCart();
      
      // 주문 확인 페이지로 이동
      navigate('/order-confirmation');
    } catch (error) {
      console.error('결제 처리 중 오류 발생:', error);
      setError(error.response?.data?.message || text.orderError || '주문 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  if (cart.length === 0) {
    // 장바구니가 비어있으면 홈으로 리다이렉트
    navigate('/home');
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold ml-3">{text.checkout}</h1>
        </div>
      </header>
      
      <div className="p-4 flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 배송 정보 */}
          <section className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">{text.shippingInfo}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.fullName}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.address}
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </section>
          
          {/* 결제 정보 */}
          <section className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">{text.paymentInfo}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.cardNumber}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                  />
                  <CreditCard className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.expiryDate}
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    placeholder="MM/YY"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    placeholder="123"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* 주문 요약 */}
          <section className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">{text.orderSummary}</h2>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>{text.total}</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>
          
          {/* 결제 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
          >
            {loading ? (
              <span>{text.processing}</span>
            ) : (
              <>
                <Lock size={18} className="mr-2" />
                <span>{text.payNow}</span>
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">
          <div className="flex items-start">
            <Info size={18} className="mr-2 mt-0.5" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;