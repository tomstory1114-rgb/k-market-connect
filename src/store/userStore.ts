import { create } from 'zustand';
import { User } from '@/types';

interface UserState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updatePoints: (points: number) => void;
  incrementConsecutiveLogins: () => void;
  resetConsecutiveLogins: () => void;
  updateLevel: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  
  setUser: (user) => set({ user }),
  
  setLoading: (loading) => set({ loading }),
  
  updatePoints: (points) => set((state) => ({
    user: state.user ? { ...state.user, points: state.user.points + points } : null
  })),
  
  incrementConsecutiveLogins: () => set((state) => ({
    user: state.user ? {
      ...state.user,
      consecutiveLogins: state.user.consecutiveLogins + 1,
      lastLogin: new Date()
    } : null
  })),
  
  resetConsecutiveLogins: () => set((state) => ({
    user: state.user ? { ...state.user, consecutiveLogins: 0 } : null
  })),
  
  updateLevel: () => set((state) => {
    if (!state.user) return {};
    
    const { totalSpent } = state.user;
    let newLevel: User['level'] = 'Bronze';
    
    if (totalSpent >= 10000000) newLevel = 'Platinum';
    else if (totalSpent >= 5000000) newLevel = 'Gold';
    else if (totalSpent >= 1000000) newLevel = 'Silver';
    
    return {
      user: { ...state.user, level: newLevel }
    };
  }),
}));