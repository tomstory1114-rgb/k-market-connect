'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Star, TrendingUp, Zap } from 'lucide-react';
import ProductCard from '@/components/features/ProductCard';
import { motion } from 'framer-motion';
import { searchNaverShopping, unifyNaverProducts, UnifiedProduct } from '@/utils/shopApi';
import toast from 'react-hot-toast';

const categories = [
  { id: 'all', name: '전체', icon: '🛍️', query: '인기상품' },
  { id: 'food', name: '식품', icon: '🍜', query: '한국 식품' },
  { id: 'beauty', name: '뷰티', icon: '💄', query: '한국 화장품' },
  { id: 'fashion', name: '패션', icon: '👕', query: '한국 패션' },
  { id: 'electronics', name: '전자제품', icon: '📱', query: '전자제품' },
  { id: 'living', name: '리빙', icon: '🏠', query: '생활용품' },
  { id: 'baby', name: '유아동', icon: '👶', query: '유아용품' },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'discount'>('popular');

  const loadProducts = async (query: string) => {
    setLoading(true);
    try {
      const data = await searchNaverShopping(query, 40);
      
      if (data.items && data.items.length > 0) {
        const unified = unifyNaverProducts(data.items);
        setProducts(unified);
      } else {
        setProducts([]);
        toast.error('검색 결과가 없습니다');
      }
    } catch (error) {
      console.error('상품 로드 실패:', error);
      toast.error('상품을 불러오는데 실패했습니다');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts('인기상품');
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      loadProducts(category.query);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      loadProducts(searchTerm);
    }
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
    
    return sorted;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🛍️ K-쇼핑
          </h1>
          <p className="text-xl text-gray-600">
            네이버 쇼핑 실시간 검색 - 한국의 인기 상품을 전 세계로!
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="card mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="상품명으로 검색... (예: 신라면, 설화수, 갤럭시)"
              className="w-full pl-14 pr-32 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            >
              {loading ? '검색중...' : '검색'}
            </button>
          </div>
        </form>

        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap disabled:opacity-50 ${
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

        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="popular">⭐ 관련도순</option>
            <option value="price-low">💰 낮은 가격순</option>
            <option value="price-high">💎 높은 가격순</option>
            <option value="discount">🔥 할인율순</option>
          </select>

          <div className="flex items-center px-4 py-3 bg-blue-50 rounded-lg text-blue-700 font-medium">
            <Filter className="w-5 h-5 mr-2" />
            {loading ? '검색중...' : `${sortedProducts.length}개 상품`}
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">상품을 검색하는 중...</p>
          </div>
        )}

        {!loading && sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600">다른 검색어를 시도해보세요</p>
          </div>
        ) : !loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard 
                  product={{
                    ...product,
                    category: product.category || '기타'
                  }} 
                />
              </motion.div>
            ))}
          </div>
        ) : null}

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">실시간 검색</h3>
                <p className="text-gray-600 text-sm">네이버 쇼핑 API 연동</p>
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
                <p className="text-gray-600 text-sm">공식 쇼핑몰 직접 구매</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">최저가 비교</h3>
                <p className="text-gray-600 text-sm">실시간 가격 업데이트</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}