'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  points: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinDate: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  total: number;
  trackingNumber?: string;
}

export interface Coupon {
  id: string;
  name: string;
  discount: number;
  discountType: 'percent' | 'amount';
  minAmount: number;
  expiryDate: string;
  used: boolean;
}

interface UserContextType {
  user: User;
  orders: Order[];
  coupons: Coupon[];
  updateUser: (updates: Partial<User>) => void;
  addPoints: (points: number) => void;
  useCoupon: (couponId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    id: '1',
    name: '신이여',
    email: 'admin@nawoologistics.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    points: 3000,
    level: 'Gold',
    joinDate: '2024-01-15',
  });

  // Mock 주문 데이터
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-2024-001',
      date: '2024-01-25',
      status: 'delivered',
      items: 3,
      total: 156000,
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      items: 2,
      total: 89000,
      trackingNumber: 'KR1234567890',
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-15',
      status: 'processing',
      items: 1,
      total: 45000,
    },
    {
      id: 'ORD-2024-004',
      date: '2024-01-10',
      status: 'delivered',
      items: 5,
      total: 234000,
    },
  ]);

  // Mock 쿠폰 데이터
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'COUP-001',
      name: '신규 회원 웰컴 쿠폰',
      discount: 5000,
      discountType: 'amount',
      minAmount: 30000,
      expiryDate: '2024-12-31',
      used: false,
    },
    {
      id: 'COUP-002',
      name: '뷰티 카테고리 10% 할인',
      discount: 10,
      discountType: 'percent',
      minAmount: 50000,
      expiryDate: '2024-06-30',
      used: false,
    },
    {
      id: 'COUP-003',
      name: 'VIP 회원 특별 쿠폰',
      discount: 15000,
      discountType: 'amount',
      minAmount: 100000,
      expiryDate: '2024-03-31',
      used: false,
    },
    {
      id: 'COUP-004',
      name: '식품 카테고리 5% 할인',
      discount: 5,
      discountType: 'percent',
      minAmount: 20000,
      expiryDate: '2024-02-28',
      used: true,
    },
  ]);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addPoints = (points: number) => {
    setUser(prev => ({ ...prev, points: prev.points + points }));
  };

  const useCoupon = (couponId: string) => {
    setCoupons(prev =>
      prev.map(coupon =>
        coupon.id === couponId ? { ...coupon, used: true } : coupon
      )
    );
  };

  return (
    <UserContext.Provider
      value={{
        user,
        orders,
        coupons,
        updateUser,
        addPoints,
        useCoupon,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}