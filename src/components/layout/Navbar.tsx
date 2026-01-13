'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ShoppingBag, Users, User, Menu, X, Gift, Home, Shield } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { getLevelBadge } from '@/utils/helpers';

const ADMIN_EMAILS = ['admin@kmarket.com', 'www1114com@naver.com'];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUserStore();

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const navItems = [
    { name: '홈', href: '/', icon: Home },
    { name: '쇼핑', href: '/shop', icon: ShoppingBag },
    { name: '커뮤니티', href: '/community', icon: Users },
    { name: '이벤트', href: '/events', icon: Gift },
  ];

  if (isAdmin) {
    navItems.push({ name: '관리자', href: '/admin', icon: Shield });
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">K</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900 font-display">K-Market</span>
              <span className="text-sm text-primary-600 ml-1">Connect</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${item.href === '/admin' ? 'bg-red-50 text-red-600 hover:bg-red-100' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                href="/mypage"
                className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user.displayName}
                      {isAdmin && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">관리자</span>}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      {getLevelBadge(user.level)} {user.points.toLocaleString()}P
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                로그인
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    } ${item.href === '/admin' ? 'bg-red-50 text-red-600' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}