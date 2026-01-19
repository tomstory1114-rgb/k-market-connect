import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const display = searchParams.get('display') || '10';
  const start = searchParams.get('start') || '1';
  const sort = searchParams.get('sort') || 'sim';

  if (!query) {
    return NextResponse.json(
      { error: '검색어를 입력해주세요.' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=${display}&start=${start}&sort=${sort}`,
      {
        method: 'GET',
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID!,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET!,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('네이버 API 오류:', errorText);
      throw new Error('네이버 API 요청 실패');
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('네이버 쇼핑 API 오류:', error);
    return NextResponse.json(
      { error: '상품 검색에 실패했습니다.' },
      { status: 500 }
    );
  }
}