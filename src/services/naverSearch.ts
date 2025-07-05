import axios from 'axios';
import { Location, NaverSearchResult } from '@/models';
import Config from 'react-native-config';

export const searchNearbyRestaurants = async (location: Location, category: string): Promise<{ items: NaverSearchResult[] }> => {
  console.log(Config.NAVER_CLIENT_ID);
  console.log(Config.NAVER_CLIENT_SECRET);
  try {
    if (!location?.district) {
      console.error('위치 정보가 없습니다.');
      return { items: [] };
    }

    // 랜덤 키워드 배열
    const keywords = ['음식', '음식점', '식당', '점심', '저녁'];
    // 랜덤 키워드 선택
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

    // 랜덤 키워드를 포함한 검색어 생성
    const query = `${location.district} ${category} ${randomKeyword}`;
    
    const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=10&start=1&sort=random`;

    const response = await axios.get(url, {
      headers: {
        'X-Naver-Client-Id': Config.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': Config.NAVER_CLIENT_SECRET
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

export const searchRestaurantImage = async (query: string): Promise<string | null> => {
  try {
    const url = `https://openapi.naver.com/v1/search/image?query=${encodeURIComponent(query)}&display=1&start=1&sort=sim`;

    const response = await axios.get(url, {
      headers: {
        'X-Naver-Client-Id': Config.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': Config.NAVER_CLIENT_SECRET,
      },
    });

    if (response.data?.items && response.data.items.length > 0) {
      // 첫 번째 이미지의 link 또는 thumbnail URL 반환
      return response.data.items[0].link || response.data.items[0].thumbnail || null;
    } else {
      console.log('No image found for query:', query);
      return null;
    }
  } catch (error: any) {
    if (error.response) {
      console.error('네이버 이미지 API 응답 오류:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error('네이버 이미지 API 요청 실패:', error.request);
    } else {
      console.error('네이버 이미지 API 오류:', error.message);
    }
    return null;
  }
}; 