'use client';

import { UnifiedProduct } from '@/utils/shopApi';
import { formatPrice } from '@/utils/helpers';
import { ExternalLink, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: UnifiedProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="card card-hover overflow-hidden group cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {product.discount}% OFF
          </div>
        )}
        {product.isPopular && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <Star className="w-3 h-3 mr-1" fill="currentColor" />
            인기
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.mall}
          </span>
          <span className="text-xs text-primary-600 font-medium">
            {product.category}
          </span>
        </div>

        <h3 className="text-base font-medium text-gray-900 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        <div className="flex items-end justify-between">
          <div>
            {product.discount && product.originalPrice && (
              <div className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </div>
          </div>
          <button
            onClick={() => window.open(product.affiliateLink, '_blank')}
            className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;