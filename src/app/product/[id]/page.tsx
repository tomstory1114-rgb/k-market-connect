'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronLeft, 
  Star,
  Package,
  Truck,
  Shield,
  ExternalLink,
  Info,
  TrendingUp
} from 'lucide-react';
import { UnifiedProduct } from '@/utils/shopApi';
import { formatPrice } from '@/utils/helpers';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { useRecentProducts } from '@/hooks/useRecentProducts';
import ProductCard from '@/components/features/ProductCard';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { recentProducts, addRecentProduct } = useRecentProducts();
  
  const [product, setProduct] = useState<UnifiedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const productId = params.id as string;
    const found = recentProducts.find(p => p.id === productId);
    
    if (found) {
      setProduct(found);
      addRecentProduct(found);
    } else {
      toast.error('상품을 찾을 수 없습니다');
      router.push('/shop');
    }
    
    setLoading(false);
  }, [params.id, recentProducts, router, addRecentProduct]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const favorite = isFavorite(product.id);
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFavorite(product.id);
      toast.success('찜 목록에서 제거되었습니다');
    } else {
      addFavorite(product);
      toast.success('찜 목록에 추가되었습니다');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `${product.name} - ${formatPrice(discountedPrice)}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('공유 실패:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('링크가 복사되었습니다');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name}이(가) 장바구니에 담겼습니다`);
  };

  const handleBuyNow = () => {
    window.open(product.affiliateLink, '_blank');
  };

  const similarProducts = recentProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">돌아가기</span>
        </button>

        {/* 상품 정보 메인 섹션 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 이미지 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                  {product.discount}% OFF
                </div>
              )}
              {product.isPopular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                  <Star className="w-4 h-4 mr-1" fill="currentColor" />
                  인기상품
                </div>
              )}
            </div>
          </motion.div>

          {/* 상품 정보 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* 카테고리 & 브랜드 */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                {product.category}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                {product.mall}
              </span>
            </div>

            {/* 상품명 */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* 가격 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-100">
              {product.discount && product.originalPrice && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xl font-bold text-red-500">
                    {product.discount}% 할인
                  </span>
                </div>
              )}
              <div className="text-4xl font-bold text-gray-900">
                {formatPrice(discountedPrice)}
              </div>
              <p className="text-sm text-gray-600 mt-2">* 배송비 별도</p>
            </div>

            {/* 수량 선택 */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">수량</span>
              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* 총 금액 */}
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
              <span className="text-lg font-medium text-gray-700">총 금액</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(discountedPrice * quantity)}
              </span>
            </div>

            {/* 액션 버튼 - 하이브리드 */}
            <div className="space-y-3">
              {/* 상단: 찜하기 + 공유 */}
              <div className="flex gap-3">
                <button
                  onClick={handleFavoriteToggle}
                  className={`flex-1 h-14 flex items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                    favorite
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart className="w-6 h-6 mr-2" fill={favorite ? 'currentColor' : 'none'} />
                  찜하기
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 h-14 flex items-center justify-center rounded-xl border-2 border-gray-300 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                >
                  <Share2 className="w-6 h-6 mr-2" />
                  공유
                </button>
              </div>

              {/* 하단: 구매 옵션 */}
              <div className="space-y-2">
                {/* 옵션 1: 나우물류 구매대행 (추천) */}
                <div className="relative">
                  <div className="absolute -top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-xs font-bold px-3 py-1 rounded-full text-gray-900 shadow-lg z-10">
                    ⭐ 추천
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col items-center justify-center"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingCart className="w-5 h-5" />
                      <span>나우물류 구매대행</span>
                    </div>
                    <span className="text-xs text-white/80">
                      안전한 배송 보장 · 수수료 15%
                    </span>
                  </button>
                </div>

                {/* 옵션 2: 직접 구매 */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 rounded-xl transition-all duration-200 border-2 border-gray-300 hover:border-primary-500 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  네이버쇼핑에서 직접 구매
                </button>
              </div>
            </div>

            {/* 구매 옵션 설명 */}
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-2">💡 구매 옵션 안내</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>
                      <strong>나우물류 구매대행:</strong> 저희가 대신 구매하고 해외로 안전하게 배송해드립니다
                    </li>
                    <li>
                      <strong>직접 구매:</strong> 네이버쇼핑에서 바로 구매하실 수 있습니다
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="space-y-3 pt-6 border-t-2 border-gray-200">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">빠른 배송</p>
                  <p className="text-sm text-gray-600">나우물류를 통한 안전한 해외 배송</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">정품 보장</p>
                  <p className="text-sm text-gray-600">공식 쇼핑몰 직접 구매</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">안전 포장</p>
                  <p className="text-sm text-gray-600">파손 방지 특수 포장</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 상품 상세 정보 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Info className="w-6 h-6 text-primary-600" />
            상품 정보
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">{product.name}</p>
            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-600">카테고리:</span>
                <span className="font-bold">{product.category}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-600">판매처:</span>
                <span className="font-bold">{product.mall}</span>
              </div>
              {product.brand && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-600">브랜드:</span>
                  <span className="font-bold">{product.brand}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 비슷한 상품 추천 */}
        {similarProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                이런 상품은 어때요?
              </h2>
              <Link
                href="/shop"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                더보기
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}