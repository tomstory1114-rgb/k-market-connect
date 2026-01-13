'use client';

import { useState } from 'react';
import { Gift, Sparkles, Target, Award } from 'lucide-react';
import RouletteWheel from '@/components/features/RouletteWheel';
import LuckyDraw from '@/components/features/LuckyDraw';
import ScratchCard from '@/components/features/ScratchCard';
import AttendanceCalendar from '@/components/features/AttendanceCalendar';
import DailyMissions from '@/components/features/DailyMissions';
import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';

type TabType = 'games' | 'missions' | 'rewards';

export default function EventsPage() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<TabType>('games');
  const [hasSpunToday, setHasSpunToday] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Gift className="w-12 h-12 text-purple-600 animate-bounce" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              이벤트 & 게임존
            </h1>
            <Sparkles className="w-12 h-12 text-pink-600 animate-pulse" />
          </div>
          <p className="text-xl text-gray-600">
            매일 참여하고 포인트를 획득하세요!
          </p>
        </motion.div>

        {/* Attendance Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-8 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <Gift className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">오늘의 출석 체크 ✨</h3>
                <p className="text-blue-100">
                  출석하고 100P 받아가세요! 연속 7일 출석 시 보너스 500P
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('games')}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              출석하기 🎁
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('games')}
            className={`flex-1 min-w-[150px] py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
              activeTab === 'games'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
            }`}
          >
            🎮 게임존
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex-1 min-w-[150px] py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
              activeTab === 'missions'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
            }`}
          >
            🎯 미션
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 min-w-[150px] py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
              activeTab === 'rewards'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
            }`}
          >
            🏆 혜택
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'games' && (
            <div className="space-y-8">
              {/* Roulette */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                  <h2 className="text-3xl font-bold text-gray-900">행운의 룰렛</h2>
                </div>
                <RouletteWheel hasSpunToday={hasSpunToday} setHasSpunToday={setHasSpunToday} />
              </section>

              {/* Lucky Draw */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Gift className="w-8 h-8 text-pink-600" />
                  <h2 className="text-3xl font-bold text-gray-900">제비뽑기</h2>
                </div>
                <LuckyDraw />
              </section>

              {/* Scratch Card */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8 text-orange-600" />
                  <h2 className="text-3xl font-bold text-gray-900">스크래치 카드</h2>
                </div>
                <ScratchCard />
              </section>

              {/* Attendance Calendar */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-8 h-8 text-blue-600" />
                  <h2 className="text-3xl font-bold text-gray-900">출석 캘린더</h2>
                </div>
                <AttendanceCalendar />
              </section>
            </div>
          )}

          {activeTab === 'missions' && (
            <div>
              <DailyMissions />
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              {/* Event Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        신규 회원 가입 이벤트
                      </h3>
                      <p className="text-gray-600 mb-3">
                        가입만 해도 3,000P + 첫 구매 시 5,000P 추가!
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>📅 상시 진행</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        친구 초대 이벤트
                      </h3>
                      <p className="text-gray-600 mb-3">
                        친구 초대 시 추천인 5,000P, 가입자 3,000P
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>📅 2026.01.01 ~ 2026.12.31</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        리뷰 작성 이벤트
                      </h3>
                      <p className="text-gray-600 mb-3">
                        구매 후기 작성 시 500P 적립
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>📅 상시 진행</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        연속 출석 보너스
                      </h3>
                      <p className="text-gray-600 mb-3">
                        7일 연속 출석 시 추가 500P 지급
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>📅 상시 진행</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level Benefits */}
              <div className="card bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Award className="w-8 h-8" />
                  등급별 혜택
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🥉</div>
                    <div className="font-bold mb-2">Bronze</div>
                    <div className="text-sm text-gray-300">기본 혜택</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🥈</div>
                    <div className="font-bold mb-2">Silver</div>
                    <div className="text-sm text-gray-300">100만원 이상</div>
                    <div className="text-sm text-yellow-300 mt-1">배송비 5% 할인</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🥇</div>
                    <div className="font-bold mb-2">Gold</div>
                    <div className="text-sm text-gray-300">500만원 이상</div>
                    <div className="text-sm text-yellow-300 mt-1">배송비 10% 할인</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">💎</div>
                    <div className="font-bold mb-2">Platinum</div>
                    <div className="text-sm text-gray-300">1000만원 이상</div>
                    <div className="text-sm text-yellow-300 mt-1">배송비 15% 할인</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}