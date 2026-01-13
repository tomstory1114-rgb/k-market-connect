import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">K</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white font-display">K-Market Connect</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              해외 한인을 위한 구매대행 & 커뮤니티 플랫폼
              <br />
              한국과 세계를 연결합니다
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">바로가기</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="hover:text-primary-400 transition-colors">
                  쇼핑하기
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-primary-400 transition-colors">
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary-400 transition-colors">
                  이벤트
                </Link>
              </li>
              <li>
                <Link href="/mypage" className="hover:text-primary-400 transition-colors">
                  마이페이지
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">고객지원</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-primary-400 transition-colors">
                  이용가이드
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-400 transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-400 transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {currentYear} K-Market Connect powered by 나우물류. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              사업자등록번호: 123-45-67890
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}