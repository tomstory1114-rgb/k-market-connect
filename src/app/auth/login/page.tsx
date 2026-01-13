'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Loader, Sparkles } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';
import { generateUniqueId } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingDemo, setCreatingDemo] = useState(false);

  // 데모 계정 자동 생성 함수
  const createDemoAccountIfNotExists = async () => {
    try {
      const demoEmail = 'demo@kmarket.com';
      const demoPassword = 'demo1234';

      // 데모 계정으로 로그인 시도
      try {
        await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
        return true; // 이미 존재함
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // 계정이 없으면 생성
          const userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
          
          await updateProfile(userCredential.user, {
            displayName: '데모 사용자',
          });

          const uniqueId = generateUniqueId('US', 9999999);

          const userData: User = {
            uid: userCredential.user.uid,
            email: demoEmail,
            displayName: '데모 사용자',
            country: 'US',
            address: '123 Demo Street, Los Angeles, CA 90001, USA',
            uniqueId: uniqueId,
            points: 10000, // 데모 계정은 포인트 많이
            level: 'Gold',
            totalSpent: 5500000,
            createdAt: new Date(),
            lastLogin: new Date(),
            consecutiveLogins: 7,
            isPremium: true,
          };

          await setDoc(doc(db, 'users', userCredential.user.uid), userData);
          console.log('✅ 데모 계정 생성 완료');
          return true;
        }
        throw error;
      }
    } catch (error) {
      console.error('데모 계정 생성 오류:', error);
      return false;
    }
  };

  // 컴포넌트 마운트 시 데모 계정 확인/생성
  useEffect(() => {
    const initDemo = async () => {
      setCreatingDemo(true);
      await createDemoAccountIfNotExists();
      setCreatingDemo(false);
    };
    initDemo();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Firestore에서 사용자 데이터 확인
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // Firestore 문서가 없으면 생성
        const userData: User = {
          uid: userCredential.user.uid,
          email: email,
          displayName: userCredential.user.displayName || email.split('@')[0],
          country: 'US',
          address: '',
          uniqueId: generateUniqueId('US', Date.now() % 10000000),
          points: 3000,
          level: 'Bronze',
          totalSpent: 0,
          createdAt: new Date(),
          lastLogin: new Date(),
          consecutiveLogins: 0,
          isPremium: false,
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      }
      
      toast.success('🎉 로그인 성공!');
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('존재하지 않는 계정입니다');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('비밀번호가 올바르지 않습니다');
      } else if (error.code === 'auth/invalid-credential') {
        toast.error('이메일 또는 비밀번호를 확인해주세요');
      } else {
        toast.error('로그인에 실패했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@kmarket.com');
    setPassword('demo1234');
    
    // 약간의 딜레이 후 자동 로그인
    setTimeout(async () => {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, 'demo@kmarket.com', 'demo1234');
        toast.success('🎉 데모 계정으로 로그인했습니다!');
        setTimeout(() => {
          router.push('/');
        }, 500);
      } catch (error) {
        toast.error('데모 계정 로그인 실패. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-4 shadow-2xl animate-pulse">
            <span className="text-white text-4xl font-bold">K</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 font-display">
            K-Market Connect
          </h2>
          <p className="mt-3 text-gray-600 text-lg">
            한국 쇼핑, 세계 어디서나
          </p>
        </div>

        {/* Login Form */}
        <div className="card shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            로그인
          </h3>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12 text-base"
                  placeholder="이메일을 입력하세요"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 text-base"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">로그인 상태 유지</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                비밀번호 찾기
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || creatingDemo}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  로그인
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                아직 회원이 아니신가요?{' '}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-bold">
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Account Info - 개선된 디자인 */}
        <div className="mt-6 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative card bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-yellow-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-8 h-8 text-yellow-600 animate-spin" style={{ animationDuration: '3s' }} />
              <h4 className="font-bold text-gray-900 text-xl">🎉 데모 계정으로 체험하기</h4>
            </div>
            <p className="text-sm text-gray-700 mb-4 font-medium">
              바로 시작하고 싶으신가요? 데모 계정으로 모든 기능을 체험해보세요!
            </p>
            <button
              onClick={handleDemoLogin}
              disabled={loading || creatingDemo}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center text-lg"
            >
              {creatingDemo ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  데모 계정 준비중...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  데모 계정으로 바로 시작
                </>
              )}
            </button>
            <div className="mt-4 p-3 bg-white/70 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">💡 데모 계정 정보:</p>
              <div className="text-sm font-mono text-gray-700">
                <div>📧 demo@kmarket.com</div>
                <div>🔑 demo1234</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}