'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, User, Home, Users, Gift, Bell, Heart, Clock, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { favoriteCount } = useFavorites();
  const { cartCount } = useCart();

  const navigation = [
    { name: '홈', href: '/', icon: Home },
    { name: '쇼핑', href: '/shop', icon: ShoppingBag },
    { name: '커뮤니티', href: '/community', icon: Users },
    { name: '이벤트', href: '/events', icon: Gift },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-2xl">K</span>
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-2xl font-bold">
                <span className="text-gray-900">K-Market</span>
                <span className="text-primary-600 ml-1">Connect</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    active
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-2">
            {/* 찜하기 */}
            <Link
              href="/favorites"
              className="relative p-2 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <Heart className="w-6 h-6" />
              {favoriteCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg"
                >
                  {favoriteCount > 99 ? '99+' : favoriteCount}
                </motion.span>
              )}
            </Link>

            {/* 최근 본 상품 */}
            <Link
              href="/recent"
              className="relative p-2 rounded-lg text-gray-600 hover:text-purple-500 hover:bg-purple-50 transition-all duration-200"
            >
              <Clock className="w-6 h-6" />
            </Link>

            {/* 장바구니 */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-gray-600 hover:text-green-500 hover:bg-green-50 transition-all duration-200"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </Link>

            {/* 알림 */}
            <button className="relative p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* 사용자 메뉴 */}
            <Link
              href="/mypage"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <User className="w-5 h-5" />
              <span>관리자</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">3,000P</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      active
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}

              {/* 모바일 찜하기 */}
              <Link
                href="/favorites"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5" />
                  찜한 상품
                </div>
                {favoriteCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              {/* 모바일 최근 본 상품 */}
              <Link
                href="/recent"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
              >
                <Clock className="w-5 h-5" />
                최근 본 상품
              </Link>

              {/* 모바일 장바구니 */}
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  장바구니
                </div>
                {cartCount > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* 모바일 프로필 */}
              <Link
                href="/mypage"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  관리자
                </div>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">3,000P</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}