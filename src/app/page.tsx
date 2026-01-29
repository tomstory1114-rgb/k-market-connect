'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Package, Users, Gift, ChevronRight, Star, Zap, ShoppingCart } from 'lucide-react';
import { UnifiedProduct } from '@/utils/shopApi';
import ProductCard from '@/components/features/ProductCard';
import SearchAutocomplete from '@/components/features/SearchAutocomplete';
import { motion } from 'framer-motion';

interface Mall {
  id: string;
  name: string;
  logo: string;
  url: string;
  commission: number;
}

const malls: Mall[] = [
  { 
    id: '1', 
    name: '쿠팡', 
    logo: 'https://image.coupangcdn.com/image/coupang/common/logo_coupang_w350.png',
    url: 'https://coupang.com', 
    commission: 3 
  },
  { 
    id: '2', 
    name: '네이버쇼핑', 
    logo: 'https://shopping-phinf.pstatic.net/main_2457068/24570687388.jpg',
    url: 'https://shopping.naver.com', 
    commission: 2.5 
  },
  { 
    id: '3', 
    name: '올리브영', 
    logo: 'https://static.oliveyoung.co.kr/pc-static-root/image/comm/h1_logo.png',
    url: 'https://oliveyoung.co.kr', 
    commission: 4 
  },
  { 
    id: '4', 
    name: '무신사', 
    logo: 'https://image.msscdn.net/musinsaUI/homework/data/20210909/mobile_20210909142609_pzgwh.png',
    url: 'https://musinsa.com', 
    commission: 5 
  },
  { 
    id: '5', 
    name: '마켓컬리', 
    logo: 'https://res.kurly.com/images/marketkurly/logo/logo_x2.png',
    url: 'https://kurly.com', 
    commission: 3.5 
  },
  { 
    id: '6', 
    name: 'G마켓', 
    logo: 'https://pics.gmarket.co.kr/pc/ko/main_logo.png',
    url: 'https://gmarket.co.kr', 
    commission: 3 
  },
];

const popularProducts: UnifiedProduct[] = [
  {
    id: '1',
    name: '올리브영 베스트 스킨케어 세트',
    title: '올리브영 베스트 스킨케어 세트',
    price: 89000,
    originalPrice: 105000,
    discount: 15,
    image: 'https://picsum.photos/seed/beauty1/400/400',
    url: 'https://oliveyoung.co.kr',
    affiliateLink: 'https://oliveyoung.co.kr',
    category: '뷰티',
    mall: '올리브영',
    source: 'naver',
    isPopular: true,
  },
  {
    id: '2',
    name: '무신사 겨울 패딩 재킷',
    title: '무신사 겨울 패딩 재킷',
    price: 149000,
    originalPrice: 186000,
    discount: 20,
    image: 'https://picsum.photos/seed/fashion1/400/400',
    url: 'https://musinsa.com',
    affiliateLink: 'https://musinsa.com',
    category: '패션',
    mall: '무신사',
    source: 'naver',
    isPopular: true,
  },
  {
    id: '3',
    name: '마켓컬리 프리미엄 한우세트',
    title: '마켓컬리 프리미엄 한우세트',
    price: 79000,
    image: 'https://picsum.photos/seed/food1/400/400',
    url: 'https://kurly.com',
    affiliateLink: 'https://kurly.com',
    category: '식품',
    mall: '마켓컬리',
    source: 'naver',
    isPopular: true,
  },
  {
    id: '4',
    name: '쿠팡 삼성 갤럭시 버즈',
    title: '쿠팡 삼성 갤럭시 버즈',
    price: 129000,
    originalPrice: 143000,
    discount: 10,
    image: 'https://picsum.photos/seed/tech1/400/400',
    url: 'https://coupang.com',
    affiliateLink: 'https://coupang.com',
    category: '전자제품',
    mall: '쿠팡',
    source: 'naver',
    isPopular: true,
  },
];

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: Package,
      title: '빠른 배송',
      description: '나우물류의 검증된 배송 시스템',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Gift,
      title: '포인트 적립',
      description: '구매할 때마다 포인트 혜택',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Users,
      title: '활발한 커뮤니티',
      description: '국가별 한인 커뮤니티',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Zap,
      title: '즉시 연동',
      description: '주요 쇼핑몰 실시간 연동',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)',
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display text-white drop-shadow-2xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              한국 쇼핑, 세계 어디서나
            </h1>
            <p className="text-xl md:text-3xl mb-10 text-white drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              구매대행부터 커뮤니티까지, 한 곳에서 해결하세요
            </p>
            
            {/* 검색 바 - 자동완성 적용 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <div className="shadow-2xl rounded-2xl overflow-hidden bg-white">
                <SearchAutocomplete 
                  onSearch={(query) => {
                    router.push(`/shop?q=${encodeURIComponent(query)}`);
                  }}
                  placeholder="찾고 싶은 상품을 검색하세요..."
                />
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            >
              {[
                { number: '10,000+', label: '활성 회원' },
                { number: '50,000+', label: '월 배송 건수' },
                { number: '10개국', label: '서비스 지역' },
                { number: '4.9/5', label: '고객 만족도' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/30 transition-all duration-300"
                >
                  <div className="text-4xl font-bold mb-2 text-white drop-shadow-lg">{stat.number}</div>
                  <div className="text-white/90 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">왜 K-Market Connect인가요?</h2>
            <p className="text-xl text-gray-600">해외 한인을 위한 최고의 쇼핑 경험</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="card text-center group cursor-pointer relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className={`bg-gradient-to-br ${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-lg">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Malls */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">제휴 쇼핑몰</h2>
              <p className="text-xl text-gray-600">한국의 주요 온라인 쇼핑몰과 연동되어 있어요</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {malls.map((mall, index) => (
              <motion.div
                key={mall.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="card text-center cursor-pointer group bg-white hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-20 flex items-center justify-center mb-4 p-2">
                  <img
                    src={mall.logo}
                    alt={mall.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<div class="text-4xl font-bold text-primary-600">${mall.name}</div>`;
                    }}
                  />
                </div>
                <div className="font-bold text-gray-900 text-lg mb-1">{mall.name}</div>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  커미션 {mall.commission}%
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-3 font-display flex items-center">
                <TrendingUp className="w-10 h-10 mr-4 text-red-500" />
                인기 상품
              </h2>
              <p className="text-xl text-gray-600">지금 가장 많이 찾는 상품들이에요</p>
            </motion.div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-6 h-6" />
              전체 상품 보기
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1%, transparent 0%), radial-gradient(circle at 80% 80%, white 1%, transparent 0%)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Star className="w-20 h-20 mx-auto mb-6 text-yellow-300 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display drop-shadow-lg">
              지금 가입하고 웰컴 포인트 받으세요!
            </h2>
            <p className="text-2xl mb-10 text-white/90 drop-shadow-md">
              가입 즉시 3,000P + 첫 구매 시 5,000P 추가 적립
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/auth/register"
                className="inline-block bg-white text-purple-600 hover:bg-gray-100 px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                무료로 시작하기 🚀
              </Link>
              <Link
                href="/events"
                className="inline-block bg-transparent border-4 border-white text-white hover:bg-white hover:text-purple-600 px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-200 hover:scale-105"
              >
                이벤트 확인하기 🎁
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}