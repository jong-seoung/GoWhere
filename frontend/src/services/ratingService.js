// 별점 관련 API 서비스
import api from "./api";
import StorageService from "./storage";

export const ratingService = {
  // 별점 조회
  async getRating(reviewId) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get(`/api/reviews/${reviewId}/rating`, { headers });
      return response.data;
    } catch (error) {
      console.error("별점 조회 실패:", error);
      throw error;
    }
  },

  // 별점 생성
  async createRating(reviewId, ratingData) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      console.log("별점 생성 요청:", { reviewId, ratingData, headers });
      
      // CORS 문제 해결을 위한 직접 fetch 사용
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(ratingData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("별점 생성 응답:", data);
      return data;
    } catch (error) {
      console.error("별점 생성 실패:", error);
      console.error("에러 상세:", error.message);
      throw error;
    }
  },

  // 별점 수정
  async updateRating(reviewId, ratingData) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.put(`/api/reviews/${reviewId}/rating`, ratingData, { headers });
      return response.data;
    } catch (error) {
      console.error("별점 수정 실패:", error);
      throw error;
    }
  },

  // 평균 별점 조회
  async getAverageRating(reviewId) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // 여러 가능한 엔드포인트 시도
      let response;
      try {
        response = await api.get(`/api/reviews/${reviewId}/rating/average`, { headers });
      } catch (firstError) {
        console.log("첫 번째 엔드포인트 실패, 두 번째 시도:", firstError.message);
        try {
          response = await api.get(`/api/reviews/${reviewId}/rating`, { headers });
        } catch (secondError) {
          console.log("두 번째 엔드포인트 실패, 세 번째 시도:", secondError.message);
          response = await api.get(`/api/ratings/review/${reviewId}/average`, { headers });
        }
      }
      
      console.log("별점 API 응답:", response.data);
      return response.data;
    } catch (error) {
      console.error("평균 별점 조회 실패:", error);
      console.error("에러 상세:", error.response?.data);
      // 에러가 발생해도 기본값 반환
      return { averageRating: 0, ratingCount: 0 };
    }
  },
};

export default ratingService;
