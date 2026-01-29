'use client';

import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, Package, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/helpers';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState } from 'react';

const countries = [
  { code: 'US', name: '미국', shippingFee: 25000, flag: '🇺🇸' },
  { code: 'CA', name: '캐나다', shippingFee: 28000, flag: '🇨🇦' },
  { code: 'JP', name: '일본', shippingFee: 15000, flag: '🇯🇵' },
  { code: 'CN', name: '중국', shippingFee: 12000, flag: '🇨🇳' },
  { code: 'AU', name: '호주', shippingFee: 30000, flag: '🇦🇺' },
  { code: 'GB', name: '영국', shippingFee: 32000, flag: '🇬🇧' },
  { code: 'DE', name: '독일', shippingFee: 30000, flag: '🇩🇪' },
  { code: 'FR', name: '프랑스', shippingFee: 30000, flag: '🇫🇷' },
];

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal } = useCart();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName}이(가) 장바구니에서 제거되었습니다`);
  };

  const handleClearAll = () => {
    if (confirm('장바구니를 비우시겠습니까?')) {
      clearCart();
      toast.success('장바구니가 비워졌습니다');
    }
  };

  const handleCheckout = () => {
    toast.success('주문 페이지로 이동합니다 (개발 중)');
  };

  const finalTotal = cartTotal + selectedCountry.shippingFee;

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
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">장바구니</h1>
                <p className="text-gray-600">선택한 상품을 확인하세요</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">{cartCount}</div>
                <div className="text-sm text-gray-600">개의 상품</div>
              </div>
              {cartCount > 0 && (
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

        {cartCount === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              장바구니가 비어있습니다
            </h2>
            <p className="text-gray-600 mb-8">
              마음에 드는 상품을 담아보세요!
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 장바구니 아이템 목록 */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map((item) => {
                  const discountedPrice = item.product.discount
                    ? item.product.price * (1 - item.product.discount / 100)
                    : item.product.price;
                  const itemTotal = discountedPrice * item.quantity;

                  return (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="card p-4"
                    >
                      <div className="flex gap-4">
                        {/* 상품 이미지 */}
                        <Link href={`/product/${item.product.id}`} className="flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition-transform"
                          />
                        </Link>

                        {/* 상품 정보 */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.product.id}`}
                            className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2 mb-2"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {item.product.mall}
                            </span>
                            {item.product.discount && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">
                                {item.product.discount}% OFF
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {item.product.discount && item.product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(item.product.originalPrice)}
                              </span>
                            )}
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(discountedPrice)}
                            </span>
                          </div>
                        </div>

                        {/* 수량 조절 & 삭제 */}
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => handleRemove(item.product.id, item.product.name)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-lg font-bold text-primary-600">
                            {formatPrice(itemTotal)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary-600" />
                  주문 요약
                </h2>

                {/* 배송 국가 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    배송 국가
                  </label>
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = countries.find(c => c.code === e.target.value);
                      if (country) setSelectedCountry(country);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name} ({formatPrice(country.shippingFee)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 가격 상세 */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>상품 금액</span>
                    <span className="font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>배송비 ({selectedCountry.name})</span>
                    <span className="font-medium">{formatPrice(selectedCountry.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>총 결제 금액</span>
                    <span className="text-primary-600">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* 포인트 적립 안내 */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-700 font-medium mb-1">
                    💰 예상 적립 포인트
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.floor(finalTotal * 0.01).toLocaleString()}P
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    구매 금액의 1% 적립
                  </div>
                </div>

                {/* 주문하기 버튼 */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  {formatPrice(finalTotal)} 주문하기
                </button>

                {/* 안내 사항 */}
                <div className="text-xs text-gray-500 space-y-1 pt-4 border-t border-gray-200">
                  <p>• 배송비는 국가별로 상이합니다</p>
                  <p>• 관세 및 통관 비용은 별도입니다</p>
                  <p>• 결제 후 1-3일 내 발송됩니다</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}