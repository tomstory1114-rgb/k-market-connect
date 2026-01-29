'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Heart,
  ShoppingCart,
  Gift,
  Settings,
  CreditCard,
  Bell,
  LogOut,
  Crown,
  TrendingUp,
  Calendar,
  Award,
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/helpers';
import Link from 'next/link';

const tabs = [
  { id: 'overview', name: '대시보드', icon: User },
  { id: 'orders', name: '주문내역', icon: Package },
  { id: 'coupons', name: '쿠폰함', icon: Gift },
  { id: 'settings', name: '설정', icon: Settings },
];

const levelColors = {
  Bronze: 'from-orange-400 to-orange-600',
  Silver: 'from-gray-400 to-gray-600',
  Gold: 'from-yellow-400 to-yellow-600',
  Platinum: 'from-purple-400 to-purple-600',
};

const levelBenefits = {
  Bronze: { discount: 0, points: 1 },
  Silver: { discount: 3, points: 1.5 },
  Gold: { discount: 5, points: 2 },
  Platinum: { discount: 10, points: 3 },
};

export default function MyPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, orders, coupons } = useUser();
  const { favoriteCount } = useFavorites();
  const { cartCount } = useCart();

  const activeCoupons = coupons.filter(c => !c.used);
  const totalSavings = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + order.total * 0.01, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 프로필 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8 overflow-hidden"
        >
          <div className={`h-32 bg-gradient-to-r ${levelColors[user.level]}`}></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              {/* 아바타 */}
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white"
                />
                <div className={`absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r ${levelColors[user.level]} rounded-full flex items-center justify-center shadow-lg`}>
                  <Crown className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* 사용자 정보 */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-600 mb-3">{user.email}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className={`px-4 py-1.5 bg-gradient-to-r ${levelColors[user.level]} text-white rounded-full text-sm font-bold shadow-md`}>
                    {user.level} 등급
                  </span>
                  <span className="text-gray-600 text-sm">
                    가입일: {new Date(user.joinDate).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>

              {/* 포인트 */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-100">
                <div className="text-sm text-gray-600 mb-1">보유 포인트</div>
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {user.points.toLocaleString()}P
                </div>
                <div className="text-xs text-gray-500">
                  ≈ {formatPrice(user.points)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 퀵 스탯 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card hover:shadow-xl transition-shadow cursor-pointer"
          >
            <Link href="/favorites" className="block">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{favoriteCount}</div>
                  <div className="text-sm text-gray-600">찜한 상품</div>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card hover:shadow-xl transition-shadow cursor-pointer"
          >
            <Link href="/cart" className="block">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{cartCount}</div>
                  <div className="text-sm text-gray-600">장바구니</div>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                <div className="text-sm text-gray-600">총 주문</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <Gift className="w-7 h-7 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{activeCoupons.length}</div>
                <div className="text-sm text-gray-600">보유 쿠폰</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* 탭 컨텐츠 */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 등급 혜택 */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary-600" />
                  {user.level} 등급 혜택
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {levelBenefits[user.level].discount}%
                    </div>
                    <div className="text-gray-700 font-medium">추가 할인</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {levelBenefits[user.level].points}배
                    </div>
                    <div className="text-gray-700 font-medium">포인트 적립</div>
                  </div>
                </div>
              </div>

              {/* 최근 주문 */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-6 h-6 text-primary-600" />
                    최근 주문
                  </h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    전체보기 →
                  </button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString('ko-KR')} · {order.items}개 상품
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatPrice(order.total)}</div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'delivered' ? '배송완료' :
                           order.status === 'shipped' ? '배송중' :
                           order.status === 'processing' ? '처리중' : '대기중'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 누적 혜택 */}
              <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  누적 혜택
                </h2>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {formatPrice(totalSavings)}
                </div>
                <div className="text-gray-600">
                  지금까지 K-Market Connect에서 절약한 금액입니다
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">전체 주문 내역</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="font-bold text-lg text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-medium text-sm ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status === 'delivered' ? '✅ 배송완료' :
                         order.status === 'shipped' ? '🚚 배송중' :
                         order.status === 'processing' ? '⏳ 처리중' : '📦 대기중'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-gray-600">
                        상품 {order.items}개
                        {order.trackingNumber && (
                          <span className="ml-3 text-sm">
                            송장번호: <span className="font-mono text-primary-600">{order.trackingNumber}</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">사용 가능한 쿠폰</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {activeCoupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="relative bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-6 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="relative z-10">
                        <div className="text-4xl font-bold mb-2">
                          {coupon.discountType === 'percent' 
                            ? `${coupon.discount}%` 
                            : formatPrice(coupon.discount)}
                        </div>
                        <div className="font-medium mb-3">{coupon.name}</div>
                        <div className="text-sm text-white/80 mb-2">
                          {formatPrice(coupon.minAmount)} 이상 구매 시
                        </div>
                        <div className="text-xs text-white/70">
                          {new Date(coupon.expiryDate).toLocaleDateString('ko-KR')}까지
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {coupons.filter(c => c.used).length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">사용한 쿠폰</h2>
                  <div className="space-y-3">
                    {coupons.filter(c => c.used).map((coupon) => (
                      <div
                        key={coupon.id}
                        className="bg-gray-100 text-gray-500 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{coupon.name}</div>
                            <div className="text-sm">
                              {coupon.discountType === 'percent' 
                                ? `${coupon.discount}%` 
                                : formatPrice(coupon.discount)} 할인
                            </div>
                          </div>
                          <div className="text-xs bg-gray-200 px-3 py-1 rounded-full">
                            사용완료
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">설정</h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">알림 설정</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">결제 수단 관리</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">프로필 수정</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-600">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">로그아웃</span>
                  </div>
                  <span className="text-red-400">→</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}