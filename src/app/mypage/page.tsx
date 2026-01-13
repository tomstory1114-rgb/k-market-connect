'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { User, Package, MapPin, Settings, LogOut, Plus, Trash2 } from 'lucide-react';
import { getLevelBadge } from '@/utils/helpers';
import toast from 'react-hot-toast';

interface Shipment {
  id: string;
  userId: string;
  trackingNumber: string;
  mall: string;
  productName: string;
  status: 'pending' | 'warehouse' | 'shipping' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}

export default function MyPage() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddShipment, setShowAddShipment] = useState(false);
  const [newShipment, setNewShipment] = useState({
    trackingNumber: '',
    mall: '',
    productName: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    loadShipments();
  }, [user, router]);

  const loadShipments = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'shipments'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const shipmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Shipment[];
      
      setShipments(shipmentsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('배송 내역 로드 실패:', error);
      toast.error('배송 내역을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleAddShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!newShipment.mall || !newShipment.productName) {
      toast.error('쇼핑몰과 상품명을 입력해주세요');
      return;
    }

    try {
      await addDoc(collection(db, 'shipments'), {
        userId: user.uid,
        trackingNumber: newShipment.trackingNumber || '',
        mall: newShipment.mall,
        productName: newShipment.productName,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success('배송 정보가 등록되었습니다');
      setNewShipment({ trackingNumber: '', mall: '', productName: '' });
      setShowAddShipment(false);
      loadShipments();
    } catch (error) {
      console.error('배송 정보 등록 실패:', error);
      toast.error('배송 정보 등록에 실패했습니다');
    }
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!confirm('이 배송 내역을 삭제하시겠습니까?')) return;

    try {
      await deleteDoc(doc(db, 'shipments', shipmentId));
      toast.success('배송 내역이 삭제되었습니다');
      loadShipments();
    } catch (error) {
      console.error('배송 내역 삭제 실패:', error);
      toast.error('배송 내역 삭제에 실패했습니다');
    }
  };

  const handleLogout = async () => {
    if (!confirm('로그아웃 하시겠습니까?')) return;
    
    try {
      await signOut(auth);
      setUser(null);
      toast.success('로그아웃 되었습니다');
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      toast.error('로그아웃에 실패했습니다');
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: '배송 준비',
      warehouse: '창고 도착',
      shipping: '배송 중',
      delivered: '배송 완료',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-700',
      warehouse: 'bg-blue-100 text-blue-700',
      shipping: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">마이페이지</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.displayName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">등급</span>
                  <span className="font-bold text-lg">
                    {getLevelBadge(user.level)} {user.level}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">포인트</span>
                  <span className="font-bold text-primary-600 text-lg">
                    🪙 {user.points.toLocaleString()}P
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 mb-2">나의 고유번호</div>
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg">
                  <span className="font-mono font-bold text-primary-600">
                    {user.uniqueId}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.uniqueId);
                      toast.success('복사되었습니다');
                    }}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    복사
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * 배송 신청 시 이 번호를 사용하세요
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600 py-2">
                  <MapPin className="w-5 h-5 mr-3" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">국가</div>
                    <div className="font-medium">{user.country}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 py-2">
                  <Package className="w-5 h-5 mr-3" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">배송지 주소</div>
                    <div className="font-medium text-sm">{user.address}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => router.push('/mypage/settings')}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                  계정 설정
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  로그아웃
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Shipments */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-primary-600" />
                나의 배송 내역
              </h2>
              <button
                onClick={() => setShowAddShipment(!showAddShipment)}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                배송 추가
              </button>
            </div>

            {/* Add Shipment Form */}
            {showAddShipment && (
              <div className="card mb-6 bg-blue-50 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  새 배송 정보 등록
                </h3>
                <form onSubmit={handleAddShipment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      쇼핑몰
                    </label>
                    <input
                      type="text"
                      required
                      value={newShipment.mall}
                      onChange={(e) => setNewShipment({ ...newShipment, mall: e.target.value })}
                      className="input-field"
                      placeholder="예: 쿠팡, 지마켓, 네이버쇼핑 등"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상품명
                    </label>
                    <input
                      type="text"
                      required
                      value={newShipment.productName}
                      onChange={(e) => setNewShipment({ ...newShipment, productName: e.target.value })}
                      className="input-field"
                      placeholder="예: 마켓컬리 한우세트"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      송장번호 (선택사항)
                    </label>
                    <input
                      type="text"
                      value={newShipment.trackingNumber}
                      onChange={(e) => setNewShipment({ ...newShipment, trackingNumber: e.target.value })}
                      className="input-field"
                      placeholder="예: NM2026810011234"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      등록하기
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddShipment(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Shipment List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">배송 내역을 불러오는 중...</p>
              </div>
            ) : shipments.length === 0 ? (
              <div className="card text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">아직 배송 내역이 없습니다</p>
                <p className="text-gray-500 text-sm">
                  쇼핑몰에서 구매 후 배송 정보를 등록해주세요
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="card hover:shadow-xl transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                            {getStatusText(shipment.status)}
                          </span>
                          {shipment.trackingNumber && (
                            <span className="text-sm text-gray-500">
                              송장번호: {shipment.trackingNumber}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {shipment.productName}
                        </h3>
                        <p className="text-gray-600">{shipment.mall}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteShipment(shipment.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold text-gray-600">
                          배송 진행률
                        </div>
                        <div className="text-xs font-semibold text-primary-600">
                          {shipment.status === 'pending' && '25%'}
                          {shipment.status === 'warehouse' && '50%'}
                          {shipment.status === 'shipping' && '75%'}
                          {shipment.status === 'delivered' && '100%'}
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                        <div
                          style={{
                            width:
                              shipment.status === 'pending'
                                ? '25%'
                                : shipment.status === 'warehouse'
                                ? '50%'
                                : shipment.status === 'shipping'
                                ? '75%'
                                : '100%',
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 transition-all duration-500"
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                      등록일: {shipment.createdAt.toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}