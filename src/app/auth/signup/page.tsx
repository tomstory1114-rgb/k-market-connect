'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Mail, Lock, User, MapPin, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const countries = [
  { code: 'US', name: '미국', flag: '🇺🇸' },
  { code: 'CA', name: '캐나다', flag: '🇨🇦' },
  { code: 'JP', name: '일본', flag: '🇯🇵' },
  { code: 'UK', name: '영국', flag: '🇬🇧' },
  { code: 'AU', name: '호주', flag: '🇦🇺' },
];

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    country: 'US',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('비밀번호는 6자 이상이어야 합니다');
      return;
    }

    setLoading(true);

    try {
      // Firebase 인증으로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 프로필 업데이트
      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
      });

      // Firestore에 사용자 데이터 저장
      const uniqueId = `NW-${formData.country}-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: formData.email,
        displayName: formData.displayName,
        country: formData.country,
        address: formData.address,
        uniqueId: uniqueId,
        points: 0,
        level: 'Bronze',
        totalSpent: 0,
        createdAt: new Date(),
        lastLogin: new Date(),
        consecutiveLogins: 1,
        isPremium: false,
      });

      toast.success('회원가입 완료! 🎉');
      router.push('/');
      
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('이미 사용 중인 이메일입니다');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('유효하지 않은 이메일 형식입니다');
      } else if (error.code === 'auth/weak-password') {
        toast.error('비밀번호가 너무 약합니다');
      } else {
        toast.error('회원가입 실패: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">K-Market Connect와 함께하세요</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="input-field pl-10"
                  placeholder="홍길동"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10"
                  placeholder="6자 이상"
                />
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-field pl-10"
                  placeholder="비밀번호 재입력"
                />
              </div>
            </div>

            {/* 국가 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                거주 국가
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="input-field pl-10"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                배송 주소
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field pl-10"
                  placeholder="배송받을 주소"
                />
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? '처리중...' : '회원가입'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}