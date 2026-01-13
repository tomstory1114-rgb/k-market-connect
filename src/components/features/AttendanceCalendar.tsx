'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, Gift } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';

export default function AttendanceCalendar() {
  const { user, updatePoints, incrementConsecutiveLogins } = useUserStore();
  const [attendedDays, setAttendedDays] = useState<number[]>([1, 2, 3]); // 예시

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleAttendance = (day: number) => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    if (attendedDays.includes(day)) {
      toast('이미 출석한 날입니다', { icon: '✅' });
      return;
    }

    setAttendedDays([...attendedDays, day]);
    updatePoints(100);
    incrementConsecutiveLogins();
    
    toast.success('출석 완료! 100P 적립', {
      icon: '🎉',
      duration: 3000,
    });

    // 7일 연속 출석 보너스
    if (attendedDays.length + 1 === 7) {
      updatePoints(500);
      toast.success('🎊 7일 연속 출석 달성! 보너스 500P', {
        duration: 5000,
      });
    }
  };

  return (
    <div className="card max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-green-50">
      {user && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900 text-lg">
              연속 출석: <span className="text-blue-600">{user.consecutiveLogins}일</span>
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="grid grid-cols-7 gap-3">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="text-center font-bold text-gray-600 py-2">
              {day}
            </div>
          ))}
          
          {days.map((day) => {
            const isAttended = attendedDays.includes(day);
            const isToday = day === new Date().getDate();
            
            return (
              <motion.button
                key={day}
                onClick={() => handleAttendance(day)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-xl font-bold text-lg transition-all duration-200 ${
                  isAttended
                    ? 'bg-green-500 text-white shadow-lg'
                    : isToday
                    ? 'bg-blue-500 text-white shadow-lg ring-4 ring-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isAttended ? <Check className="w-6 h-6 mx-auto" /> : day}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="font-bold text-blue-900">출석일: {attendedDays.length}일</div>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">💎</div>
            <div className="font-bold text-green-900">적립: {attendedDays.length * 100}P</div>
          </div>
        </div>
      </div>

      <div className="mt-6 card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
        <div className="flex items-center gap-3">
          <Gift className="w-8 h-8 text-yellow-600" />
          <div>
            <div className="font-bold text-gray-900 text-lg">7일 연속 출석 보너스</div>
            <div className="text-gray-600">7일 연속 출석 시 500P 추가 지급!</div>
          </div>
        </div>
      </div>
    </div>
  );
}