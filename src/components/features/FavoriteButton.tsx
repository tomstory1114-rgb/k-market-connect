'use client';

import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '@/contexts/FavoritesContext';
import { UnifiedProduct } from '@/utils/shopApi';
import toast from 'react-hot-toast';

interface FavoriteButtonProps {
  product: UnifiedProduct;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ product, size = 'md' }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      removeFavorite(product.id);
      toast.success('찜 목록에서 제거되었습니다');
    } else {
      addFavorite(product);
      toast.success('찜 목록에 추가되었습니다');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 ${
        favorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
      }`}
    >
      <Heart
        className={iconSizes[size]}
        fill={favorite ? 'currentColor' : 'none'}
      />
    </motion.button>
  );
}