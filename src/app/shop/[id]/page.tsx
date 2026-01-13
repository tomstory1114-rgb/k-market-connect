'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShoppingCart, Heart, Share2, Star, Package, Truck, Shield, ChevronLeft } from 'lucide-react';
import { formatPrice } from '@/utils/helpers';
import toast from 'react-hot-toast';

// 임시 상품 데이터 (실제로는 props나 API로 받아옴)
const getProductById = (id: string) => {
  const products: any = {
    '1': {
      id: '1',
      name: '신라면 5개입',
      price: 4500,
      image: 'https://picsum.photos/seed/ramen/800/800',
      category: 'food',
      mall: 'coupang',
      affiliateLink: 'https://www.coupang.com',
      discount: 10,
      description: '한국을 대표하는 매운맛 라면! 해외에서도 즐기는 그 맛 그대로.',
      features: ['칼칼한 매운맛', '쫄깃한 면발', '푸짐한 건더기'],
      rating: 4.8,
      reviews: 1234,
    },
  };
  return products[id] || null;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const product = getProductById(params.id as string);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h1>
          <button
            onClick={() => router.push('/shop')}
            className="btn-primary"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handlePurchase = () => {
    window.open(product.affiliateLink, '_blank');
    toast.success('쇼핑몰 페이지로 이동합니다');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          뒤로 가기
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-xl"
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
              {product.mall}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews.toLocaleString()} 리뷰)
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              {product.discount && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-2xl font-bold text-red-500">
                    {product.discount}% OFF
                  </span>
                </div>
              )}
              <div className="text-5xl font-bold text-gray-900">
                {formatPrice(discountedPrice)}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">상품 설명</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">주요 특징</h3>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">수량</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handlePurchase}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-6 h-6" />
                구매하기
              </button>
              <button className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                <Heart className="w-6 h-6 text-gray-600" />
              </button>
              <button className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">안전 포장</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">빠른 배송</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">정품 보장</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}