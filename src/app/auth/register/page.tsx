'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, MapPin, Globe, Loader } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';
import { generateUniqueId } from '@/utils/helpers';
import toast from 'react-hot-toast';

const countries = [
  { code: 'US', name: '미국', flag: '🇺🇸' },
  { code: 'CA', name: '캐나다', flag: '🇨🇦' },
  { code: 'JP', name: '일본', flag: '🇯🇵' },
  { code: 'UK', name: '영국', flag: '🇬🇧' },
  { code: 'AU', name: '호주', flag: '🇦🇺' },
  { code: 'DE', name: '독일', flag: '🇩🇪' },
  { code: 'FR', name: '프랑스', flag: '🇫🇷' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'US',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다');
      return;
    }

    if (!agreeTerms) {
      toast.error('이용약관에 동의해주세요');
      return;
    }

    setLoading(true);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update profile
      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
      });

      // Generate unique ID
      const uniqueId = generateUniqueId(formData.country, Date.now() % 10000000);

      // Create user document in Firestore
      const userData: User = {
        uid: userCredential.user.uid,
        email: formData.email,
        displayName: formData.displayName,
        country: formData.country,
        address: formData.address,
        uniqueId: uniqueId,
        points: 3000, // Welcome bonus
        level: 'Bronze',
        totalSpent: 0,
        createdAt: new Date(),
        lastLogin: new Date(),
        consecutiveLogins: 0,
        isPremium: false,
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      toast.success('🎉 회원가입 성공! 웰컴 포인트 3,000P 지급!');
      router.push('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('이미 사용 중인 이메일입니다');
      } else if (error.code === 'auth/weak-password') {
        toast.error('비밀번호는 최소 6자 이상이어야 합니다');
      } else {
        toast.error('회원가입에 실패했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4 shadow-xl">
            <span className="text-white text-3xl font-bold">K</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 font-display">
            K-Market Connect
          </h2>
          <p className="mt-2 text-gray-600">
            회원가입하고 3,000P 받아가세요!
          </p>
        </div>

        {/* Register Form */}
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            회원가입
          </h3>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="홍길동"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="최소 6자 이상"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="비밀번호 재입력"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                거주 국가
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="input-field pl-12"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                배송지 주소
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <textarea
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="input-field pl-12"
                  placeholder="상세 주소를 입력하세요"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700">
                  <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                    이용약관
                  </Link>
                  {' '}및{' '}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                    개인정보처리방침
                  </Link>
                  에 동의합니다
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                '회원가입'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 회원이신가요?{' '}
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center bg-white">
            <div className="text-3xl mb-2">🎁</div>
            <div className="text-sm font-medium text-gray-900">가입 즉시</div>
            <div className="text-lg font-bold text-primary-600">3,000P</div>
          </div>
          <div className="card text-center bg-white">
            <div className="text-3xl mb-2">🛍️</div>
            <div className="text-sm font-medium text-gray-900">첫 구매 시</div>
            <div className="text-lg font-bold text-primary-600">5,000P</div>
          </div>
          <div className="card text-center bg-white">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-sm font-medium text-gray-900">안전한 배송</div>
            <div className="text-lg font-bold text-primary-600">나우물류</div>
          </div>
        </div>
      </div>
    </div>
  );
}
