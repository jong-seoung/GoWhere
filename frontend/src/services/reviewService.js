import api from "./api";
import StorageService from "./storage"; // 토큰을 불러오는 모듈

export const reviewService = {
  // 전체 리뷰 조회 (페이지네이션 포함)
  async getAllReviews(page = 0, size = 10) {
    try {
      const token = StorageService.getAccessToken(); // 사용자 토큰 가져오기
      const headers = token ? { Authorization: `Bearer ${token}` } : {}; // 헤더 설정
      const response = await api.get(`/api/reviews?page=${page}&size=${size}`, { headers });
      return response.data;
    } catch (error) {
      console.error("리뷰 목록 불러오기 실패:", error);
      throw error;
    }
  },

  // 리뷰 단건 조회
  async getReviewById(id) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get(`/api/reviews/${id}`, { headers });
      console.log("리뷰 API 응답:", response.data);
      console.log("ratingPoint 필드:", response.data.ratingPoint);
      console.log("전체 응답 구조:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("리뷰 단건 조회 실패:", error);
      throw error;
    }
  },

  // 리뷰 생성
  async createReview(reviewData) {
    try {
      const token = StorageService.getAccessToken();
      console.log("JWT 토큰:", token ? "존재함" : "없음");
      console.log("요청 데이터:", reviewData);
      
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log("요청 헤더:", headers);
      
      const response = await api.post(`/api/reviews`, reviewData, { headers });
      return response.data;
    } catch (error) {
      console.error("리뷰 생성 실패:", error);
      console.error("에러 응답:", error.response?.data);
      console.error("에러 상태:", error.response?.status);
      throw error;
    }
  },

  // 리뷰 수정
  async updateReview(id, reviewData) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.put(`/api/reviews/${id}`, reviewData, { headers });
      return response.data;
    } catch (error) {
      console.error("리뷰 수정 실패:", error);
      throw error;
    }
  },

  // 리뷰 삭제
  async deleteReview(id) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.delete(`/api/reviews/${id}`, { headers });
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      throw error;
    }
  },
};
export default reviewService;