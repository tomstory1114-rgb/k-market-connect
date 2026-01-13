# K-Market Connect

해외 한인을 위한 구매대행 & 커뮤니티 플랫폼

![K-Market Connect](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![Firebase](https://img.shields.io/badge/Firebase-10-orange.svg)

## 📋 프로젝트 소개

K-Market Connect는 해외 거주 한인들을 위한 통합 쇼핑 및 커뮤니티 플랫폼입니다. 한국 주요 쇼핑몰과의 연동, 나우물류의 배송 서비스, 그리고 게이미피케이션 요소를 결합하여 최고의 사용자 경험을 제공합니다.

### 주요 기능

- 🛍️ **쇼핑 포털**: 한국 주요 쇼핑몰 통합 검색 및 구매 연결
- 👥 **커뮤니티 허브**: 국가별 한인 커뮤니티 및 정보 공유
- 🎮 **게이미피케이션**: 포인트 시스템, 룰렛 이벤트, 레벨 시스템
- 📦 **배송 통합**: 나우물류 배송 서비스 직접 연동
- 🎁 **리워드 시스템**: 출석체크, 포인트 적립, 등급별 혜택

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn
- Firebase 프로젝트 (Authentication, Firestore 활성화 필요)

### 설치 방법

1. **저장소 클론 및 의존성 설치**

```bash
# 프로젝트 폴더로 이동
cd k-market-connect

# 의존성 설치
npm install
```

2. **환경 변수 설정**

Firebase 설정은 이미 `src/lib/firebase.ts` 파일에 포함되어 있습니다.

3. **개발 서버 실행**

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📁 프로젝트 구조

```
k-market-connect/
├── src/
│   ├── app/                    # Next.js 14 App Router 페이지
│   │   ├── page.tsx           # 메인 홈페이지
│   │   ├── shop/              # 쇼핑 페이지
│   │   ├── community/         # 커뮤니티 페이지
│   │   ├── events/            # 이벤트 & 게이미피케이션
│   │   ├── mypage/            # 마이페이지
│   │   └── auth/              # 인증 페이지 (로그인, 회원가입)
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── layout/           # 레이아웃 컴포넌트 (Navbar, Footer)
│   │   ├── features/         # 기능별 컴포넌트
│   │   └── ui/               # UI 컴포넌트
│   ├── lib/                   # 라이브러리 설정
│   │   └── firebase.ts       # Firebase 초기화
│   ├── store/                 # Zustand 상태 관리
│   ├── types/                 # TypeScript 타입 정의
│   ├── utils/                 # 유틸리티 함수
│   └── hooks/                 # 커스텀 React Hooks
├── public/                    # 정적 파일
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔥 Firebase 설정

### Firestore 컬렉션 구조

```
users/
  {userId}/
    - uid: string
    - email: string
    - displayName: string
    - country: string
    - address: string
    - uniqueId: string (NW-US-0001234)
    - points: number
    - level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
    - totalSpent: number
    - createdAt: timestamp
    - lastLogin: timestamp
    - consecutiveLogins: number
    - isPremium: boolean

posts/
  {postId}/
    - userId: string
    - userName: string
    - country: string
    - category: string
    - title: string
    - content: string
    - likes: number
    - comments: number
    - createdAt: timestamp

shipments/
  {shipmentId}/
    - userId: string
    - uniqueId: string
    - status: 'pending' | 'warehouse' | 'shipping' | 'delivered'
    - items: string[]
    - trackingNumber: string
    - createdAt: timestamp
```

## 🎨 기술 스택

### Frontend
- **Next.js 14**: React 프레임워크 (App Router)
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **Framer Motion**: 애니메이션 라이브러리
- **Lucide React**: 아이콘 라이브러리

### Backend & Database
- **Firebase Authentication**: 사용자 인증
- **Cloud Firestore**: NoSQL 데이터베이스
- **Firebase Analytics**: 사용자 분석

### State Management
- **Zustand**: 가벼운 상태 관리 라이브러리

### UI/UX
- **React Hot Toast**: 토스트 알림
- **Pretendard Font**: 한글 웹폰트
- **Manrope Font**: 영문 디스플레이 폰트

## 🌟 주요 페이지

### 홈페이지 (/)
- 히어로 섹션 with 검색 기능
- 주요 기능 소개
- 제휴 쇼핑몰 목록
- 인기 상품 갤러리
- CTA 섹션

### 쇼핑 (/shop)
- 상품 검색 및 필터링
- 카테고리별, 쇼핑몰별 필터
- 정렬 옵션 (인기순, 가격순, 할인율순)
- 상품 카드 with 제휴 링크

### 커뮤니티 (/community)
- 국가별 게시판
- 카테고리별 필터링
- 게시글 작성 및 댓글
- 좋아요 및 조회수

### 이벤트 (/events)
- 출석 체크 시스템
- 룰렛 이벤트 (하루 1회)
- 포인트 적립 안내
- 등급별 혜택 소개

### 마이페이지 (/mypage)
- 사용자 프로필
- 고유번호 (배송용)
- 포인트 및 등급 정보
- 배송 내역 조회

## 🎮 게이미피케이션

### 포인트 시스템
- 회원가입: 3,000P
- 첫 구매: 5,000P
- 리뷰 작성: 500P
- 출석체크: 100P/일
- 연속 출석 (7일): +500P
- 룰렛 이벤트: 최대 10,000P

### 등급 시스템
- **Bronze** (기본): 0원 ~
- **Silver**: 100만원 ~ (배송비 5% 할인)
- **Gold**: 500만원 ~ (배송비 10% 할인 + 전용 상담)
- **Platinum**: 1,000만원 ~ (배송비 15% 할인 + VIP 라운지)

## 🔐 보안

- Firebase Authentication으로 안전한 사용자 인증
- Firestore Security Rules로 데이터 보호
- HTTPS 강제 적용
- 환경 변수를 통한 민감 정보 관리

## 📱 반응형 디자인

모든 페이지는 모바일, 태블릿, 데스크톱에서 최적화되어 있습니다:
- 모바일 우선 접근 방식
- Tailwind CSS의 반응형 유틸리티 클래스 사용
- 햄버거 메뉴 (모바일)
- 유연한 그리드 시스템

## 🚀 향후 계획

- [ ] 모바일 앱 개발 (React Native)
- [ ] 실시간 채팅 기능
- [ ] AI 상품 추천 시스템
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 프리미엄 멤버십 기능
- [ ] 파트너 광고 플랫폼
- [ ] B2B 기업 배송 서비스

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스로 배포됩니다.

## 📞 연락처

프로젝트 문의: info@k-market-connect.com

프로젝트 링크: [https://github.com/yourname/k-market-connect](https://github.com/yourname/k-market-connect)

## 🙏 감사의 말

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Pretendard Font](https://github.com/orioncactus/pretendard)

---

Made with ❤️ by 나우물류
