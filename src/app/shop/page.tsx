'use client';

import { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from '@/components/features/ProductCard';

// Mock expanded product data
const allProducts: Product[] = [
  {
    id: '1',
    name: '올리브영 베스트 스킨케어 세트',
    price: 89000,
    image: 'https://picsum.photos/seed/shop1/400/400',
    category: '뷰티',
    mall: '올리브영',
    affiliateLink: 'https://oliveyoung.co.kr',
    isPopular: true,
    discount: 15,
  },
  {
    id: '2',
    name: '무신사 겨울 패딩 재킷',
    price: 149000,
    image: 'https://picsum.photos/seed/shop2/400/400',
    category: '패션',
    mall: '무신사',
    affiliateLink: 'https://musinsa.com',
    isPopular: true,
    discount: 20,
  },
  {
    id: '3',
    name: '마켓컬리 프리미엄 한우세트',
    price: 79000,
    image: 'https://picsum.photos/seed/shop3/400/400',
    category: '식품',
    mall: '마켓컬리',
    affiliateLink: 'https://kurly.com',
    isPopular: true,
  },
  {
    id: '4',
    name: '쿠팡 삼성 갤럭시 버즈',
    price: 129000,
    image: 'https://picsum.photos/seed/shop4/400/400',
    category: '전자제품',
    mall: '쿠팡',
    affiliateLink: 'https://coupang.com',
    discount: 10,
  },
  {
    id: '5',
    name: '네이버쇼핑 아디다스 운동화',
    price: 119000,
    image: 'https://picsum.photos/seed/shop5/400/400',
    category: '패션',
    mall: '네이버쇼핑',
    affiliateLink: 'https://shopping.naver.com',
    discount: 25,
  },
  {
    id: '6',
    name: '올리브영 더마 코스메틱 세트',
    price: 54000,
    image: 'https://picsum.photos/seed/shop6/400/400',
    category: '뷰티',
    mall: '올리브영',
    affiliateLink: 'https://oliveyoung.co.kr',
    isPopular: true,
  },
  {
    id: '7',
    name: 'G마켓 LG 공기청정기',
    price: 289000,
    image: 'https://picsum.photos/seed/shop7/400/400',
    category: '가전',
    mall: 'G마켓',
    affiliateLink: 'https://gmarket.co.kr',
    discount: 15,
  },
  {
    id: '8',
    name: '마켓컬리 유기농 채소 박스',
    price: 35000,
    image: 'https://picsum.photos/seed/shop8/400/400',
    category: '식품',
    mall: '마켓컬리',
    affiliateLink: 'https://kurly.com',
  },
];

const categories = ['전체', '뷰티', '패션', '식품', '전자제품', '가전', '도서', '생활용품'];
const malls = ['전체', '쿠팡', '네이버쇼핑', '올리브영', '무신사', '마켓컬리', 'G마켓', '11번가'];
const sortOptions = ['인기순', '최신순', '낮은 가격순', '높은 가격순', '할인율순'];

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedMall, setSelectedMall] = useState('전체');
  const [sortBy, setSortBy] = useState('인기순');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || product.category === selectedCategory;
    const matchesMall = selectedMall === '전체' || product.mall === selectedMall;
    return matchesSearch && matchesCategory && matchesMall;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 font-display">
            쇼핑하기
          </h1>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="상품명, 브랜드, 카테고리 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">필터</span>
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="card space-y-4 animate-slide-up">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    쇼핑몰
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {malls.map((mall) => (
                      <button
                        key={mall}
                        onClick={() => setSelectedMall(mall)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                          selectedMall === mall
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {mall}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    정렬
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            총 <span className="font-semibold text-primary-600">{filteredProducts.length}</span>개의 상품
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
            <p className="text-gray-400 mt-2">다른 검색어나 필터를 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
