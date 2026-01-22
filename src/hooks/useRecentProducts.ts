'use client';

import { useState, useEffect } from 'react';
import { UnifiedProduct } from '@/utils/shopApi';

const MAX_RECENT = 20;

export function useRecentProducts() {
  const [recentProducts, setRecentProducts] = useState<UnifiedProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentProducts');
    if (stored) {
      try {
        setRecentProducts(JSON.parse(stored));
      } catch (error) {
        console.error('최근 본 상품 로드 실패:', error);
      }
    }
  }, []);

  const addRecentProduct = (product: UnifiedProduct) => {
    setRecentProducts(prev => {
      // 중복 제거
      const filtered = prev.filter(p => p.id !== product.id);
      // 맨 앞에 추가
      const updated = [product, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem('recentProducts', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentProducts = () => {
    setRecentProducts([]);
    localStorage.removeItem('recentProducts');
  };

  return {
    recentProducts,
    addRecentProduct,
    clearRecentProducts,
  };
}