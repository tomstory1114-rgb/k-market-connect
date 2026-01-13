'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';
import { Ticket, Gift } from 'lucide-react';
import Confetti from 'react-confetti';

const prizes = [
  { id: 1, name: '꽝', points: 0, color: 'bg-gray-400', emoji: '😢' },
  { id: 2, name: '500P', points: 500, color: 'bg-blue-400', emoji: '🎁' },
  { id: 3, name: '1,000P', points: 1000, color: 'bg-green-400', emoji: '🎉' },
  { id: 4, name: '꽝', points: 0, color: 'bg-gray-400', emoji: '😢' },
  { id: 5, name: '2,000P', points: 2000, color: 'bg-purple-400', emoji: '🎊' },
  { id: 6, name: '꽝', points: 0, color: 'bg-gray-400', emoji: '😢' },
  { id: 7, name: '5,000P 대박!', points: 5000, color: 'bg-yellow-400', emoji: '🏆' },
  { id: 8, name: '꽝', points: 0, color: 'bg-gray-400', emoji: '😢' },
];

export default function LuckyDraw() {
  const { user, updatePoints } = useUserStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<typeof prizes[0] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleDraw = () => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    setIsDrawing(true);
    setSelectedPrize(null);

    // 애니메이션 시뮬레이션
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % prizes.length;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setSelectedPrize(randomPrize);
      setIsDrawing(false);

      if (randomPrize.points > 0) {
        updatePoints(randomPrize.points);
        setShowConfetti(true);
        toast.success(`🎉 ${randomPrize.name} 당첨!`, {
          duration: 5000,
          icon: randomPrize.emoji,
        });
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        toast('아쉽지만 다음 기회에! 💪', {
          icon: '😢',
          duration: 3000,
        });
      }
    }, 3000);
  };

  return (
    <div className="card max-w-4xl mx-auto bg-gradient-to-br from-pink-50 to-purple-50 relative overflow-hidden">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      {user && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <Gift className="w-6 h-6 text-pink-600" />
            <span className="font-bold text-gray-900 text-lg">
              보유 포인트: <span className="text-pink-600">{user.points.toLocaleString()}P</span>
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        {prizes.map((prize) => (
          <motion.div
            key={prize.id}
            animate={isDrawing ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.3, repeat: isDrawing ? Infinity : 0 }}
            className={`${prize.color} rounded-2xl p-6 text-center text-white font-bold shadow-xl cursor-pointer hover:scale-110 transition-all duration-200`}
          >
            <div className="text-4xl mb-2">{prize.emoji}</div>
            <div className="text-lg">{prize.name}</div>
          </motion.div>
        ))}
      </div>

      {selectedPrize && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${selectedPrize.color} rounded-2xl p-8 text-center text-white mb-6 shadow-2xl`}
        >
          <div className="text-6xl mb-4">{selectedPrize.emoji}</div>
          <div className="text-3xl font-bold">결과: {selectedPrize.name}</div>
        </motion.div>
      )}

      <button
        onClick={handleDraw}
        disabled={isDrawing || !user}
        className={`w-full py-6 rounded-2xl font-bold text-2xl transition-all duration-200 shadow-xl flex items-center justify-center gap-3 ${
          isDrawing || !user
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white hover:shadow-2xl transform hover:scale-105'
        }`}
      >
        <Ticket className="w-8 h-8" />
        {isDrawing ? '추첨 중...' : !user ? '로그인 필요' : '제비뽑기 도전!'}
      </button>

      <p className="text-center text-gray-600 mt-4 text-sm">
        💡 하루에 여러 번 도전 가능!
      </p>
    </div>
  );
}