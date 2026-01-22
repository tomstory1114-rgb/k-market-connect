'use client';

import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '@/contexts/FavoritesContext';
import ProductCard from '@/components/features/ProductCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, favoriteCount } = useFavorites();

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
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">찜한 상품</h1>
                <p className="text-gray-600">관심 있는 상품을 모아보세요</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">{favoriteCount}</div>
              <div className="text-sm text-gray-600">개의 상품</div>
            </div>
          </div>
        </motion.div>

        {/* 찜한 상품 목록 */}
        {favoriteCount === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              찜한 상품이 없습니다
            </h2>
            <p className="text-gray-600 mb-8">
              마음에 드는 상품을 찜해보세요!
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
                {favorites.map((product, index) => (
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