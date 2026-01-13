'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Star, TrendingUp, Zap, Heart } from 'lucide-react';
import ProductCard from '@/components/features/ProductCard';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', name: '전체', icon: '🛍️' },
  { id: 'food', name: '식품', icon: '🍜' },
  { id: 'beauty', name: '뷰티', icon: '💄' },
  { id: 'fashion', name: '패션', icon: '👕' },
  { id: 'electronics', name: '전자제품', icon: '📱' },
  { id: 'living', name: '리빙', icon: '🏠' },
  { id: 'baby', name: '유아동', icon: '👶' },
];

const malls = [
  { id: 'all', name: '전체' },
  { id: 'coupang', name: '쿠팡' },
  { id: 'naver', name: '네이버쇼핑' },
  { id: 'oliveyoung', name: '올리브영' },
  { id: 'musinsa', name: '무신사' },
  { id: 'kurly', name: '마켓컬리' },
  { id: 'gmarket', name: 'G마켓' },
];

// 실제 한국 상품 데이터 (예시)
const products = [
  {
    id: '1',
    name: '신라면 5개입',
    price: 4500,
    image: 'https://picsum.photos/seed/ramen/400/400',
    category: 'food',
    mall: 'coupang',
    affiliateLink: 'https://www.coupang.com',
    discount: 10,
    isPopular: true,
  },
  {
    id: '2',
    name: '설화수 자음생 에센셜 세트',
    price: 89000,
    image: 'https://picsum.photos/seed/sulwhasoo/400/400',
    category: 'beauty',
    mall: 'oliveyoung',
    affiliateLink: 'https://www.oliveyoung.co.kr',
    discount: 20,
    isPopular: true,
  },
  {
    id: '3',
    name: '삼성 갤럭시 버즈2 프로',
    price: 189000,
    image: 'https://picsum.photos/seed/buds/400/400',
    category: 'electronics',
    mall: 'coupang',
    affiliateLink: 'https://www.coupang.com',
    discount: 15,
    isPopular: true,
  },
  {
    id: '4',
    name: '나이키 에어포스 1',
    price: 129000,
    image: 'https://picsum.photos/seed/nike/400/400',
    category: 'fashion',
    mall: 'musinsa',
    affiliateLink: 'https://www.musinsa.com',
    isPopular: false,
  },
  {
    id: '5',
    name: '마켓컬리 한우 1등급 세트',
    price: 59900,
    image: 'https://picsum.photos/seed/beef/400/400',
    category: 'food',
    mall: 'kurly',
    affiliateLink: 'https://www.kurly.com',
    discount: 25,
    isPopular: true,
  },
  {
    id: '6',
    name: 'LG 스타일러 블랙',
    price: 1890000,
    image: 'https://picsum.photos/seed/styler/400/400',
    category: 'living',
    mall: 'coupang',
    affiliateLink: 'https://www.coupang.com',
    discount: 10,
    isPopular: false,
  },
  {
    id: '7',
    name: '메디힐 NMF 마스크팩 10매',
    price: 12900,
    image: 'https://picsum.photos/seed/mediheal/400/400',
    category: 'beauty',
    mall: 'oliveyoung',
    affiliateLink: 'https://www.oliveyoung.co.kr',
    discount: 30,
    isPopular: true,
  },
  {
    id: '8',
    name: '다이슨 에어랩 스타일러',
    price: 699000,
    image: 'https://picsum.photos/seed/dyson/400/400',
    category: 'beauty',
    mall: 'gmarket',
    affiliateLink: 'https://www.gmarket.co.kr',
    discount: 5,
    isPopular: true,
  },
  {
    id: '9',
    name: '아디다스 슈퍼스타',
    price: 109000,
    image: 'https://picsum.photos/seed/adidas/400/400',
    category: 'fashion',
    mall: 'musinsa',
    affiliateLink: 'https://www.musinsa.com',
    isPopular: false,
  },
  {
    id: '10',
    name: '파머스마켓 시리얼 3종 세트',
    price: 24900,
    image: 'https://picsum.photos/seed/cereal/400/400',
    category: 'food',
    mall: 'kurly',
    affiliateLink: 'https://www.kurly.com',
    discount: 15,
    isPopular: false,
  },
  {
    id: '11',
    name: '유니클로 히트텍 이너',
    price: 14900,
    image: 'https://picsum.photos/seed/heattech/400/400',
    category: 'fashion',
    mall: 'naver',
    affiliateLink: 'https://shopping.naver.com',
    isPopular: false,
  },
  {
    id: '12',
    name: '팸퍼스 기저귀 특대형',
    price: 39900,
    image: 'https://picsum.photos/seed/pampers/400/400',
    category: 'baby',
    mall: 'coupang',
    affiliateLink: 'https://www.coupang.com',
    discount: 20,
    isPopular: true,
  },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMall, setSelectedMall] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'discount'>('popular');

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // 쇼핑몰 필터
    if (selectedMall !== 'all') {
      filtered = filtered.filter((p) => p.mall === selectedMall);
    }

    // 검색
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      }
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'discount') {
        return (b.discount || 0) - (a.discount || 0);
      }
      return 0;
    });

    return sorted;
  }, [selectedCategory, selectedMall, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🛍️ K-쇼핑
          </h1>
          <p className="text-xl text-gray-600">
            한국의 인기 상품을 전 세계로 배송해드립니다
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="card mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="상품명으로 검색..."
              className="w-full pl-14 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Mall Filter */}
          <select
            value={selectedMall}
            onChange={(e) => setSelectedMall(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {malls.map((mall) => (
              <option key={mall.id} value={mall.id}>
                🏪 {mall.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="popular">⭐ 인기순</option>
            <option value="price-low">💰 낮은 가격순</option>
            <option value="price-high">💎 높은 가격순</option>
            <option value="discount">🔥 할인율순</option>
          </select>

          {/* Result Count */}
          <div className="flex items-center px-4 py-3 bg-blue-50 rounded-lg text-blue-700 font-medium">
            <Filter className="w-5 h-5 mr-2" />
            {filteredProducts.length}개 상품
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600">
              다른 검색어나 필터를 시도해보세요
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">빠른 배송</h3>
                <p className="text-gray-600 text-sm">주 5회 항공 배송</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">정품 보장</h3>
                <p className="text-gray-600 text-sm">100% 정품만 취급</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">포인트 적립</h3>
                <p className="text-gray-600 text-sm">구매 시 최대 5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}