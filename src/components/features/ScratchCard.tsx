'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

const rewards = [
  { value: 0, label: '다음 기회에!', color: 'text-gray-600', emoji: '😢' },
  { value: 500, label: '500P', color: 'text-blue-600', emoji: '🎁' },
  { value: 1000, label: '1,000P', color: 'text-green-600', emoji: '🎉' },
  { value: 2000, label: '2,000P', color: 'text-purple-600', emoji: '🎊' },
  { value: 5000, label: '5,000P 대박!', color: 'text-yellow-600', emoji: '🏆' },
];

export default function ScratchCard() {
  const { user, updatePoints } = useUserStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reward, setReward] = useState(rewards[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 스크래치 영역 그리기
    ctx.fillStyle = '#9333ea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('여기를 긁으세요!', canvas.width / 2, canvas.height / 2);

    // 랜덤 보상 선택
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    setReward(randomReward);
  }, []);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsScratching(true);

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // 일정 부분 이상 긁으면 자동으로 전체 공개
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percentScratched = (transparent / (pixels.length / 4)) * 100;

    if (percentScratched > 50) {
      reveal();
    }
  };

  const reveal = () => {
    setIsRevealed(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    if (user && reward.value > 0) {
      updatePoints(reward.value);
      toast.success(`🎉 ${reward.label} 당첨!`, {
        duration: 5000,
        icon: reward.emoji,
      });
    } else if (reward.value === 0) {
      toast('아쉽지만 다음 기회에! 💪', {
        icon: '😢',
        duration: 3000,
      });
    }
  };

  const reset = () => {
    setIsRevealed(false);
    setIsScratching(false);
    
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    setReward(randomReward);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#9333ea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('여기를 긁으세요!', canvas.width / 2, canvas.height / 2);
  };

  return (
    <div className="card max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50">
      {user && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="font-bold text-gray-900 text-lg">
              보유 포인트: <span className="text-purple-600">{user.points.toLocaleString()}P</span>
            </span>
          </div>
        </div>
      )}

      <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
        {/* 보상 (뒤에 숨겨진 내용) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isRevealed ? 1 : 0 }}
            className="text-center"
          >
            <div className="text-8xl mb-4">{reward.emoji}</div>
            <div className={`text-4xl font-bold ${reward.color}`}>
              {reward.label}
            </div>
          </motion.div>
        </div>

        {/* 스크래치 캔버스 */}
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseMove={(e) => {
            if (e.buttons === 1) scratch(e);
          }}
          onTouchMove={scratch}
          className="w-full h-auto rounded-xl cursor-pointer"
          style={{ display: isRevealed ? 'none' : 'block' }}
        />
      </div>

      <div className="mt-6 flex gap-4">
        {isRevealed && (
          <button
            onClick={reset}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            다시 도전하기 🎲
          </button>
        )}
      </div>

      <p className="text-center text-gray-600 mt-4 text-sm">
        💡 마우스나 손가락으로 긁어보세요!
      </p>
    </div>
  );
}