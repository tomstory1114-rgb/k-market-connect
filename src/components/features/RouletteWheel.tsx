'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';
import { Gift, Sparkles } from 'lucide-react';

interface RouletteWheelProps {
  hasSpunToday: boolean;
  setHasSpunToday: (value: boolean) => void;
}

const rewards = [
  { type: 'discount', value: 10, label: '배송비 10% 할인', color: 'bg-blue-500' },
  { type: 'points', value: 1000, label: '1,000P', color: 'bg-purple-500' },
  { type: 'discount', value: 30, label: '배송비 30% 할인', color: 'bg-green-500' },
  { type: 'points', value: 5000, label: '5,000P', color: 'bg-yellow-500' },
  { type: 'nothing', value: 0, label: '다음 기회에!', color: 'bg-gray-400' },
  { type: 'points', value: 3000, label: '3,000P', color: 'bg-pink-500' },
  { type: 'discount', value: 50, label: '배송비 무료', color: 'bg-red-500' },
  { type: 'points', value: 10000, label: '10,000P 대박!', color: 'bg-orange-500' },
];

export default function RouletteWheel({ hasSpunToday, setHasSpunToday }: RouletteWheelProps) {
  const { user, updatePoints } = useUserStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<typeof rewards[0] | null>(null);

  const spinWheel = () => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    if (hasSpunToday) {
      toast.error('오늘은 이미 룰렛을 돌렸습니다');
      return;
    }

    setIsSpinning(true);
    setResult(null);

    // Random result
    const winningIndex = Math.floor(Math.random() * rewards.length);
    const selectedReward = rewards[winningIndex];
    
    // Calculate rotation (multiple full rotations + final position)
    const segmentAngle = 360 / rewards.length;
    const finalRotation = 360 * 5 + (360 - (winningIndex * segmentAngle + segmentAngle / 2));
    
    setRotation(finalRotation);

    // Wait for animation to complete
    setTimeout(() => {
      setIsSpinning(false);
      setHasSpunToday(true);
      setResult(selectedReward);

      // Apply reward
      if (selectedReward.type === 'points') {
        updatePoints(selectedReward.value as number);
        toast.success(`🎉 ${selectedReward.label} 당첨!`, {
          duration: 4000,
          icon: '🎊',
        });
      } else if (selectedReward.type === 'discount') {
        toast.success(`🎉 ${selectedReward.label} 당첨!`, {
          duration: 4000,
          icon: '🎊',
        });
      } else {
        toast('아쉽지만 다음 기회에! 내일 다시 도전하세요 💪', {
          duration: 3000,
        });
      }
    }, 4000);
  };

  return (
    <div className="card max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center mb-6">
        {user && (
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Gift className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-gray-900">
              보유 포인트: <span className="text-primary-600">{user.points.toLocaleString()}P</span>
            </span>
          </div>
        )}
      </div>

      {/* Roulette Wheel */}
      <div className="relative">
        {/* Center pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-yellow-400 drop-shadow-lg"></div>
        </div>

        {/* Wheel */}
        <div className="relative w-full aspect-square max-w-md mx-auto">
          <motion.div
            className="relative w-full h-full rounded-full overflow-hidden shadow-2xl"
            style={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
          >
            {rewards.map((reward, index) => {
              const segmentAngle = 360 / rewards.length;
              const startAngle = index * segmentAngle;
              
              return (
                <div
                  key={index}
                  className={`absolute w-full h-full ${reward.color}`}
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((startAngle * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((startAngle + segmentAngle) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((startAngle + segmentAngle) * Math.PI) / 180)}%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm p-4"
                    style={{
                      transform: `rotate(${startAngle + segmentAngle / 2}deg)`,
                      transformOrigin: 'center',
                    }}
                  >
                    <span className="rotate-90 whitespace-nowrap text-xs sm:text-sm">
                      {reward.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-yellow-400">
              <Sparkles className="w-10 h-10 text-yellow-500" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Spin Button */}
      <div className="mt-8 text-center">
        <button
          onClick={spinWheel}
          disabled={isSpinning || hasSpunToday || !user}
          className={`px-12 py-4 rounded-full font-bold text-lg transition-all duration-200 shadow-xl ${
            isSpinning || hasSpunToday || !user
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-2xl transform hover:scale-105'
          }`}
        >
          {isSpinning
            ? '돌리는 중...'
            : hasSpunToday
            ? '오늘은 이미 참여했어요'
            : !user
            ? '로그인 필요'
            : '룰렛 돌리기'}
        </button>
        
        {hasSpunToday && result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-white rounded-lg shadow-md"
          >
            <p className="text-gray-600 mb-2">오늘의 당첨 결과:</p>
            <p className="text-2xl font-bold text-primary-600">{result.label}</p>
          </motion.div>
        )}

        {!hasSpunToday && (
          <p className="mt-4 text-sm text-gray-500">
            * 하루 1회 무료 룰렛 기회가 제공됩니다
          </p>
        )}
      </div>
    </div>
  );
}