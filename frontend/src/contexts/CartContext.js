import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // localStorage에서 장바구니 데이터 로드
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart data:', error);
      }
    }
  }, []);

  // 장바구니 변경 시 localStorage에 저장 및 합계 계산
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));

    // 총 아이템 수와 총 금액 계산
    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    const amount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setTotalItems(items);
    setTotalAmount(amount);
  }, [cart]);

  // 장바구니에 메뉴 추가
  const addToCart = (menu) => {
    const existingItemIndex = cart.findIndex(item => item.id === menu.id);
    
    if (existingItemIndex >= 0) {
      // 이미 장바구니에 있는 메뉴면 수량 증가
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // 새 메뉴면 장바구니에 추가
      setCart([...cart, { ...menu, quantity: 1 }]);
    }
  };

  // 장바구니 메뉴 수량 변경
  const updateQuantity = (menuId, quantity) => {
    if (quantity <= 0) {
      // 수량이 0 이하면 아이템 제거
      setCart(cart.filter(item => item.id !== menuId));
    } else {
      // 수량 업데이트
      setCart(cart.map(item => 
        item.id === menuId ? { ...item, quantity } : item
      ));
    }
  };

  // 장바구니 비우기
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // 장바구니에서 특정 메뉴 제거
  const removeFromCart = (menuId) => {
    setCart(cart.filter(item => item.id !== menuId));
  };

  const value = {
    cart,
    totalItems,
    totalAmount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}