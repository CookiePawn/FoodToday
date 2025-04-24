import axios from 'axios';
import { Location, NaverSearchResult } from '@/models';
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from '@env';

// 랜덤한 음식 카테고리 배열
const foodCategories = [
  '한식', '중식', '일식', '양식', '분식', '치킨', '피자', '햄버거',
  '돈까스', '회', '초밥', '라면', '국밥', '찌개', '찜', '탕',
  '샐러드', '샌드위치', '카페', '디저트', '베이커리'
];

// 랜덤한 검색어 생성 함수
const generateRandomQuery = (district: string) => {
  const randomCategory = foodCategories[Math.floor(Math.random() * foodCategories.length)];
  return {
    query: `${district} ${randomCategory}`,
    category: randomCategory
  };
};

export const searchNearbyRestaurants = async (location: Location, category: string): Promise<{ items: NaverSearchResult[] }> => {
  try {
    if (!location?.district) {
      console.error('위치 정보가 없습니다.');
      return { items: [] };
    }

    // 랜덤 키워드 배열
    const keywords = ['음식', '음식점', '식당', '밥집', '점심', '저녁', '맛집', '추천', '추천식당', '추천음식점', '추천맛집'];
    // 랜덤 키워드 선택
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

    // 랜덤 키워드를 포함한 검색어 생성
    const query = `${location.district} ${category} ${randomKeyword}`;
    
    const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=10&start=1&sort=random`;

    const response = await axios.get(url, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
      }
    });

    if (!response.data?.items) {
      console.error('검색 결과가 없습니다:', response.data);
      return { items: [] };
    }

    return { items: response.data.items };
  } catch (error: any) {
    if (error.response) {
      // 서버에서 응답이 왔지만 에러 상태 코드
      console.error('네이버 API 응답 오류:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error('네이버 API 요청 실패:', error.request);
    } else {
      // 요청 설정 중에 문제가 발생
      console.error('네이버 API 오류:', error.message);
    }
    return { items: [] };
  }
}; 