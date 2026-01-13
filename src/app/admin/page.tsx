'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUserStore } from '@/store/userStore';
import { Users, Package, Edit, Trash2, Search, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ADMIN_EMAILS = ['admin@kmarket.com', 'www1114com@naver.com'];

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  uniqueId: string;
  country: string;
  points: number;
  level: string;
  createdAt: Date;
}

interface AdminShipment {
  id: string;
  userId: string;
  trackingNumber: string;
  mall: string;
  productName: string;
  status: string;
  createdAt: Date;
}

export default function AdminPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [shipments, setShipments] = useState<AdminShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'shipments'>('users');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('Admin page - Current user:', user?.email);
    
    if (!user) {
      console.log('No user, redirecting to login');
      router.push('/auth/login');
      return;
    }

    if (!ADMIN_EMAILS.includes(user.email)) {
      console.log('Not admin, redirecting to home');
      toast.error('관리자 권한이 없습니다');
      router.push('/');
      return;
    }

    console.log('Admin access granted');
    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      // Load users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as AdminUser[];
      setUsers(usersData);

      // Load shipments
      const shipmentsSnapshot = await getDocs(collection(db, 'shipments'));
      const shipmentsData = shipmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as AdminShipment[];
      setShipments(shipmentsData);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      toast.error('데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<AdminUser>) => {
    try {
      await updateDoc(doc(db, 'users', userId), updates);
      toast.success('사용자 정보가 수정되었습니다');
      setEditingUser(null);
      loadData();
    } catch (error) {
      console.error('수정 실패:', error);
      toast.error('수정에 실패했습니다');
    }
  };

  const handleUpdateShipmentStatus = async (shipmentId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'shipments', shipmentId), {
        status,
        updatedAt: new Date(),
      });
      toast.success('배송 상태가 업데이트되었습니다');
      loadData();
    } catch (error) {
      console.error('업데이트 실패:', error);
      toast.error('업데이트에 실패했습니다');
    }
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!confirm('이 배송 내역을 삭제하시겠습니까?')) return;

    try {
      await deleteDoc(doc(db, 'shipments', shipmentId));
      toast.success('배송 내역이 삭제되었습니다');
      loadData();
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제에 실패했습니다');
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !ADMIN_EMAILS.includes(user.email)) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">관리자 페이지</h1>
          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <span className="text-gray-600">전체 회원: </span>
              <span className="font-bold text-primary-600">{users.length}명</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <span className="text-gray-600">배송 건수: </span>
              <span className="font-bold text-primary-600">{shipments.length}건</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'users'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            회원 관리
          </button>
          <button
            onClick={() => setActiveTab('shipments')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'shipments'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Package className="w-5 h-5" />
            배송 관리
          </button>
        </div>

        {/* Search */}
        {activeTab === 'users' && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이메일, 이름, 고유번호로 검색..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">이메일</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">이름</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">고유번호</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">국가</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">포인트</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">등급</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{u.displayName}</td>
                      <td className="px-6 py-4">
                        {editingUser === u.id ? (
                          <input
                            type="text"
                            defaultValue={u.uniqueId}
                            id={`uniqueId-${u.id}`}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        ) : (
                          <span className="font-mono text-sm text-primary-600">{u.uniqueId}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{u.country}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{u.points.toLocaleString()}P</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{u.level}</td>
                      <td className="px-6 py-4">
                        {editingUser === u.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const input = document.getElementById(`uniqueId-${u.id}`) as HTMLInputElement;
                                handleUpdateUser(u.id, { uniqueId: input.value });
                              }}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Save className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingUser(u.id)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Shipments Tab */}
        {activeTab === 'shipments' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">송장번호</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">상품명</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">쇼핑몰</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">상태</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">등록일</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">{s.trackingNumber || '미등록'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{s.productName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{s.mall}</td>
                      <td className="px-6 py-4">
                        <select
                          value={s.status}
                          onChange={(e) => handleUpdateShipmentStatus(s.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pending">배송 준비</option>
                          <option value="warehouse">창고 도착</option>
                          <option value="shipping">배송 중</option>
                          <option value="delivered">배송 완료</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {s.createdAt.toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteShipment(s.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}