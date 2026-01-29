'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NotificationType = 'price' | 'event' | 'shipping' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 로컬 스토리지에서 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Date 객체로 변환
        const withDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(withDates);
      } catch (error) {
        console.error('알림 로드 실패:', error);
      }
    }

    // Mock 알림 추가 (초기 데이터)
    const hasInitialNotifications = localStorage.getItem('hasInitialNotifications');
    if (!hasInitialNotifications) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'price',
          title: '가격 하락 알림',
          message: '찜한 상품 "신라면 멀티팩"이 15% 할인 중입니다!',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
          read: false,
          link: '/shop',
        },
        {
          id: '2',
          type: 'event',
          title: '🎉 신규 이벤트',
          message: '설 명절 특가! 전 상품 최대 50% 할인',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
          read: false,
          link: '/events',
        },
        {
          id: '3',
          type: 'shipping',
          title: '배송 출발',
          message: '주문하신 상품이 배송 시작되었습니다. (ORD-2024-002)',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5시간 전
          read: false,
          link: '/mypage',
        },
        {
          id: '4',
          type: 'system',
          title: '포인트 적립 완료',
          message: '구매 확정으로 3,000P가 적립되었습니다.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
          read: true,
        },
      ];
      setNotifications(mockNotifications);
      localStorage.setItem('hasInitialNotifications', 'true');
    }
  }, []);

  // 로컬 스토리지에 저장
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
    localStorage.removeItem('hasInitialNotifications');
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}