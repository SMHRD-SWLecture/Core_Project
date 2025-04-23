import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { text } = useLanguage();
  const { cart, totalAmount, updateQuantity, removeFromCart } = useCart();
  
  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout');
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-16">
      <header className="bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold ml-3">{text.cart}</h1>
        </div>
      </header>
      
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-gray-500 mb-4">{text.emptyCart}</p>
          <button 
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {text.continueShopping}
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            {cart.map(item => (
              <div key={item.id || item.menu_id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.menu_name}</h3>
                    <p className="text-sm text-gray-600">{item.price.toLocaleString()} {text.won}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id || item.menu_id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex items-center justify-end">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button 
                      onClick={() => updateQuantity(item.id || item.menu_id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-500"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id || item.menu_id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-500"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                  <span className="font-medium">{text.subTotal || '소계'}</span>
                  <span className="font-medium">
                    {(item.price * item.quantity).toLocaleString()} {text.won}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-white shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">{text.totalAmount}</span>
              <span className="text-lg font-semibold">{totalAmount.toLocaleString()} {text.won}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
            >
              {text.checkout}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;