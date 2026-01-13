'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useUserStore } from '@/store/userStore';
import { User } from '@/types';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: userData.displayName || firebaseUser.displayName || '사용자',
              country: userData.country || 'US',
              address: userData.address || '',
              uniqueId: userData.uniqueId || '',
              points: userData.points || 0,
              level: userData.level || 'Bronze',
              totalSpent: userData.totalSpent || 0,
              createdAt: userData.createdAt?.toDate() || new Date(),
              lastLogin: new Date(),
              consecutiveLogins: userData.consecutiveLogins || 0,
              isPremium: userData.isPremium || false,
            };
            setUser(user);
            console.log('User loaded:', user.email);
          } else {
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '사용자',
              country: 'US',
              address: '',
              uniqueId: `NW-US-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
              points: 0,
              level: 'Bronze',
              totalSpent: 0,
              createdAt: new Date(),
              lastLogin: new Date(),
              consecutiveLogins: 0,
              isPremium: false,
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...newUser,
              createdAt: new Date(),
              lastLogin: new Date(),
            });
            
            setUser(newUser);
            console.log('New user created:', newUser.email);
          }
        } catch (error) {
          console.error('사용자 데이터 로드 실패:', error);
          setUser(null);
        }
      } else {
        console.log('User logged out');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}