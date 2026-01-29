'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Filter, Star, TrendingUp, Zap, DollarSign, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/features/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import SearchAutocomplete from '@/components/features/SearchAutocomplete';
import { motion, AnimatePresence } from 'framer-motion';
import { searchNaverShopping, unifyNaverProducts, UnifiedProduct } from '@/utils/shopApi';
import toast from 'react-hot-toast';
import Image from 'next/image';

const categories = [
  { id: 'all', name: '전체', icon: '🛍️', query: '인기상품' },
  { id: 'food', name: '식품', icon: '🍜', query: '한국 식품 인기' },
  { id: 'beauty', name: '뷰티', icon: '💄', query: '한국 화장품 인기' },
  { id: 'fashion', name: '패션', icon: '👕', query: '한국 패션 인기' },
  { id: 'electronics', name: '전자제품', icon: '📱', query: '전자제품 인기' },
  { id: 'living', name: '리빙', icon: '🏠', query: '생활용품 인기' },
  { id: 'baby', name: '유아동', icon: '👶', query: '유아용품 인기' },
];

const priceRanges = [
  { id: 'all', label: '전체 가격', min: 0, max: Infinity },
  { id: 'under10', label: '1만원 이하', min: 0, max: 10000 },
  { id: '10to30', label: '1만원 - 3만원', min: 10000, max: 30000 },
  { id: '30to50', label: '3만원 - 5만원', min: 30000, max: 50000 },
  { id: '50to100', label: '5만원 - 10만원', min: 50000, max: 100000 },
  { id: 'over100', label: '10만원 이상', min: 100000, max: Infinity },
];

// 다양한 인기 키워드 (카테고리별)
const popularKeywords = {
  food: ['신라면', '비비고', '정관장', '고추장', '김', '참기름', '된장', '떡볶이'],
  beauty: ['설화수', '후', '라네즈', '이니스프리', '에뛰드', 'VT', '메디힐', '토니모리'],
  electronics: ['에어팟', '갤럭시', 'LG', '삼성', '다이슨', '샤오미', 'JBL', '로지텍'],
  fashion: ['노스페이스', 'MLB', '나이키', '아디다스', '유니클로', '자라', '캘빈클라인'],
  living: ['락앤락', '쿠쿠', '코웨이', '청호나이스', '한일전기', '일리', '브레빌'],
  baby: ['페도라', '아기띠', '기저귀', '분유', '젖병', '유모차', '카시트'],
};

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<UnifiedProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'discount'>('popular');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [displayCount, setDisplayCount] = useState(20);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const loadProducts = async (query: string) => {
    setLoading(true);
    setDisplayCount(20);
    try {
      const data = await searchNaverShopping(query, 100);
      
      if (data.items && data.items.length > 0) {
        const unified = unifyNaverProducts(data.items);
        setProducts(unified);
        setInitialLoaded(true);
      } else {
        setProducts([]);
        if (initialLoaded) {
          toast.error('검색 결과가 없습니다');
        }
      }
    } catch (error) {
      console.error('상품 로드 실패:', error);
      if (initialLoaded) {
        toast.error('상품을 불러오는데 실패했습니다');
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 - 다양한 카테고리의 인기 상품
  useEffect(() => {
    const loadInitialProducts = async () => {
      setLoading(true);
      try {
        const allProducts: UnifiedProduct[] = [];
        
        // 각 카테고리에서 2-3개씩 키워드 선택
        const selectedKeywords = [
          ...popularKeywords.food.slice(0, 2),      // 신라면, 비비고
          ...popularKeywords.beauty.slice(0, 3),    // 설화수, 후, 라네즈
          ...popularKeywords.electronics.slice(0, 2), // 에어팟, 갤럭시
          ...popularKeywords.fashion.slice(0, 2),   // 노스페이스, MLB
          ...popularKeywords.living.slice(0, 2),    // 락앤락, 쿠쿠
          ...popularKeywords.baby.slice(0, 1),      // 페도라
        ];

        // 각 키워드로 검색 (병렬 처리)
        const searchPromises = selectedKeywords.map(keyword => 
          searchNaverShopping(keyword, 10)
            .then(data => {
              if (data.items && data.items.length > 0) {
                return unifyNaverProducts(data.items);
              }
              return [];
            })
            .catch(err => {
              console.error(`${keyword} 검색 실패:`, err);
              return [];
            })
        );

        const results = await Promise.all(searchPromises);
        results.forEach(productList => {
          allProducts.push(...productList);
        });

        if (allProducts.length > 0) {
          // 중복 제거 (id 기준)
          const uniqueProducts = Array.from(
            new Map(allProducts.map(p => [p.id, p])).values()
          );
          
          // 랜덤 셔플로 다양성 증가
          const shuffled = uniqueProducts.sort(() => Math.random() - 0.5);
          
          setProducts(shuffled);
          setInitialLoaded(true);
        } else {
          // 실패 시 기본 검색
          const data = await searchNaverShopping('인기상품', 100);
          if (data.items && data.items.length > 0) {
            const unified = unifyNaverProducts(data.items);
            setProducts(unified);
            setInitialLoaded(true);
          }
        }
      } catch (error) {
        console.error('초기 상품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialProducts();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedPriceRange('all');
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      loadProducts(category.query);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    
    // 소스 필터 (네이버/쿠팡)
    if (selectedSource !== 'all') {
      filtered = filtered.filter(p => {
        if (selectedSource === 'naver') {
          return p.source === 'naver' || !p.source;
        } else if (selectedSource === 'coupang') {
          return p.mall?.toLowerCase().includes('쿠팡') || 
                 p.mall?.toLowerCase().includes('coupang');
        }
        return true;
      });
    }

    // 가격 필터
    const priceRange = priceRanges.find(r => r.id === selectedPriceRange);
    if (priceRange && priceRange.id !== 'all') {
      filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    }
    
    // 정렬
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
    
    return filtered;
  }, [products, sortBy, selectedPriceRange, selectedSource]);

  useEffect(() => {
    setDisplayedProducts(filteredAndSortedProducts.slice(0, displayCount));
  }, [filteredAndSortedProducts, displayCount]);

  const handleScroll = useCallback(() => {
    if (loading) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 500) {
      if (displayCount < filteredAndSortedProducts.length) {
        setDisplayCount(prev => Math.min(prev + 20, filteredAndSortedProducts.length));
      }
    }
  }, [loading, displayCount, filteredAndSortedProducts.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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

        {/* 검색 바 */}
        <div className="card mb-8">
          <SearchAutocomplete 
            onSearch={(query) => {
              setSearchTerm(query);
              setSelectedPriceRange('all');
              loadProducts(query);
            }}
            placeholder="상품명으로 검색... (예: 신라면, 설화수, 갤럭시)"
          />
        </div>

        {/* 소스 탭 (로고 버전) */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {/* 전체 */}
            <button
              onClick={() => setSelectedSource('all')}
              disabled={loading}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-200 whitespace-nowrap disabled:opacity-50 flex items-center gap-3 ${
                selectedSource === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="text-lg">전체</span>
            </button>

            {/* 네이버쇼핑 */}
            <button
              onClick={() => setSelectedSource('naver')}
              disabled={loading}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-200 whitespace-nowrap disabled:opacity-50 flex items-center gap-3 ${
                selectedSource === 'naver'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border-2 border-green-200'
              }`}
            >
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">N</span>
              </div>
              <span className="text-lg">네이버쇼핑</span>
            </button>

            {/* 쿠팡 */}
            <button
              onClick={() => setSelectedSource('coupang')}
              disabled={loading}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-200 whitespace-nowrap disabled:opacity-50 flex items-center gap-3 ${
                selectedSource === 'coupang'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border-2 border-blue-200'
              }`}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">C</span>
              </div>
              <span className="text-lg">쿠팡</span>
            </button>
          </div>
        </div>

        {/* 카테고리 */}
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

        {/* 필터 & 정렬 */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {priceRanges.map(range => (
                <option key={range.id} value={range.id}>{range.label}</option>
              ))}
            </select>
          </div>

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
            {loading ? '검색중...' : `${filteredAndSortedProducts.length}개 상품`}
          </div>
        </div>

        {/* 상품 목록 */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : !loading && displayedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600 mb-6">다른 검색어나 가격대를 시도해보세요</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPriceRange('all');
                setSelectedSource('all');
                loadProducts('인기상품');
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              전체 상품 보기
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {displayedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {displayCount < filteredAndSortedProducts.length && (
              <div className="text-center mt-12">
                <div className="inline-flex items-center gap-2 text-gray-600 bg-white px-6 py-3 rounded-lg shadow-md">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                  <span>스크롤하면 더 많은 상품이 로드됩니다...</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* 안내 카드 */}
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
```

---