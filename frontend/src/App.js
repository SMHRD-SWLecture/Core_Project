import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// 컴포넌트 임포트
import SplashScreen from './components/SplashScreen';
import LanguageSelector from './components/auth/LanguageSelector';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/Home';
import RestaurantView from './components/restaurant/RestaurantView';
import MenuView from './components/restaurant/MenuView';
import Cart from './components/order/Cart';
import Checkout from './components/order/Checkout';
import OrderConfirmation from './components/order/OrderConfirmation';
import UserProfile from './components/user/UserProfile';
import BottomNavigation from './components/layout/BottomNavigation';

// 컨텍스트 임포트
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';

// API 기본 URL 설정
axios.defaults.baseURL = 'http://localhost:5001/api';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

function AppRoutes() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 앱 초기화 로직 (필요하다면)
    const initialize = async () => {
      // 초기화 작업...
      setLoading(false);
    };
    initialize();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/language" element={<LanguageSelector />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantView />} />
        <Route path="/menu/:restaurantId" element={<MenuView />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
      
      <BottomNavigation />
    </div>
  );
}

export default App;