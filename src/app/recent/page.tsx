'use client';

import { Clock, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecentProducts } from '@/hooks/useRecentProducts';
import ProductCard from '@/components/features/ProductCard';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RecentProductsPage() {
  const { recentProducts, clearRecentProducts } = useRecentProducts();

  const handleClearAll = () => {
    if (confirm('최근 본 상품을 모두 삭제하시겠습니까?')) {
      clearRecentProducts();
      toast.success('최근 본 상품이 모두 삭제되었습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">최근 본 상품</h1>
                <p className="text-gray-600">내가 본 상품을 다시 확인해보세요</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">{recentProducts.length}</div>
                <div className="text-sm text-gray-600">개의 상품</div>
              </div>
              {recentProducts.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  전체 삭제
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 최근 본 상품 목록 */}
        {recentProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              최근 본 상품이 없습니다
            </h2>
            <p className="text-gray-600 mb-8">
              상품을 둘러보고 관심있는 상품을 확인해보세요!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              쇼핑하러 가기
            </Link>
          </motion.div>
        ) : (
          <>
            {/* 상품 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {recentProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 액션 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="w-5 h-5" />
                더 많은 상품 보기
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}