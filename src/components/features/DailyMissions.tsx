'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle, Circle, Gift } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';

interface Mission {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  icon: string;
}

export default function DailyMissions() {
  const { user, updatePoints } = useUserStore();
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: '첫 로그인',
      description: '오늘 첫 로그인하기',
      points: 100,
      completed: true,
      icon: '🔓',
    },
    {
      id: 2,
      title: '상품 둘러보기',
      description: '쇼핑 페이지에서 상품 10개 이상 보기',
      points: 200,
      completed: false,
      icon: '🛍️',
    },
    {
      id: 3,
      title: '커뮤니티 참여',
      description: '게시글 1개 작성하기',
      points: 300,
      completed: false,
      icon: '✍️',
    },
    {
      id: 4,
      title: '친구 초대',
      description: '친구 1명 초대하기',
      points: 500,
      completed: false,
      icon: '👥',
    },
    {
      id: 5,
      title: '이벤트 참여',
      description: '룰렛 또는 제비뽑기 1회 참여',
      points: 150,
      completed: false,
      icon: '🎯',
    },
  ]);

  const handleCompleteMission = (missionId: number) => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    if (mission.completed) {
      toast('이미 완료한 미션입니다', { icon: '✅' });
      return;
    }

    setMissions(
      missions.map((m) =>
        m.id === missionId ? { ...m, completed: true } : m
      )
    );

    updatePoints(mission.points);
    toast.success(`🎉 미션 완료! ${mission.points}P 적립`, {
      duration: 4000,
    });
  };

  const totalPoints = missions
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.points, 0);
  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-10 h-10 text-purple-600" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">데일리 미션</h3>
              <p className="text-gray-600">오늘의 미션을 완료하고 포인트를 받으세요!</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-4xl mb-2">🎯</div>
            <div className="font-bold text-gray-900 text-lg">
              {completedCount} / {missions.length}
            </div>
            <div className="text-gray-600 text-sm">완료한 미션</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-4xl mb-2">💰</div>
            <div className="font-bold text-purple-600 text-lg">{totalPoints}P</div>
            <div className="text-gray-600 text-sm">획득 포인트</div>
          </div>
        </div>
      </div>

      {/* Missions List */}
      <div className="space-y-4">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card cursor-pointer hover:shadow-xl transition-all duration-300 ${
              mission.completed ? 'bg-green-50 border-2 border-green-300' : 'bg-white'
            }`}
            onClick={() => !mission.completed && handleCompleteMission(mission.id)}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">{mission.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xl font-bold text-gray-900">{mission.title}</h4>
                  {mission.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <p className="text-gray-600 mb-2">{mission.description}</p>
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                  <Gift className="w-4 h-4" />
                  {mission.points}P
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* All Complete Bonus */}
      {completedCount === missions.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-4 border-yellow-300 shadow-2xl"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold mb-2">모든 미션 완료!</h3>
            <p className="text-xl mb-4">축하합니다! 보너스 1,000P 지급!</p>
            <button
              onClick={() => {
                if (user) {
                  updatePoints(1000);
                  toast.success('🎉 보너스 1,000P 획득!', { duration: 5000 });
                }
              }}
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200"
            >
              보너스 받기
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}