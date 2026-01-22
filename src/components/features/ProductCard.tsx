'use client';

import { UnifiedProduct } from '@/utils/shopApi';
import { formatPrice } from '@/utils/helpers';
import { ExternalLink, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import FavoriteButton from './FavoriteButton';
import Link from 'next/link';

interface ProductCardProps {
  product: UnifiedProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -12, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="card card-hover overflow-hidden group cursor-pointer relative"
      >
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

        {/* 이미지 영역 */}
        <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          {/* 할인 배지 */}
          {product.discount && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            >
              {product.discount}% OFF
            </motion.div>
          )}
          
          {/* 인기 배지 */}
          {product.isPopular && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg"
            >
              <Star className="w-3 h-3 mr-1" fill="currentColor" />
              인기
            </motion.div>
          )}

          {/* 찜하기 버튼 */}
          <div className="absolute bottom-3 right-3 z-10">
            <FavoriteButton product={product} size="md" />
          </div>

          {/* 호버 시 장바구니 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(product.affiliateLink, '_blank');
              }}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 py-2 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              구매하기
            </button>
          </motion.div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="space-y-2">
          {/* 쇼핑몰 & 카테고리 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors duration-200">
              {product.mall}
            </span>
            <span className="text-xs text-primary-600 font-medium">
              {product.category}
            </span>
          </div>

          {/* 상품명 */}
          <h3 className="text-base font-medium text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* 가격 */}
          <div className="flex items-end justify-between">
            <div>
              {product.discount && product.originalPrice && (
                <div className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
              <div className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                {formatPrice(discountedPrice)}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(product.affiliateLink, '_blank');
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-110"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default ProductCard;