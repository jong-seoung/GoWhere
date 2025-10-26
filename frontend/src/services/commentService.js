// 댓글 관련 API 서비스
import api from "./api";
import StorageService from "./storage";

export const commentService = {
  // 리뷰별 댓글 조회
  async getCommentsByReviewId(reviewId) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get(`/api/reviews/${reviewId}/comments`, { headers });
      return response.data;
    } catch (error) {
      console.error("댓글 목록 불러오기 실패:", error);
      throw error;
    }
  },

  // 댓글 생성
  async createComment(reviewId, commentData) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.post(`/api/reviews/${reviewId}/comments`, commentData, { headers });
      return response.data;
    } catch (error) {
      console.error("댓글 생성 실패:", error);
      throw error;
    }
  },

  // 댓글 수정
  async updateComment(reviewId, commentId, commentData) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.put(`/api/reviews/${reviewId}/comments/${commentId}`, commentData, { headers });
      return response.data;
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      throw error;
    }
  },

  // 댓글 삭제
  async deleteComment(reviewId, commentId) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.delete(`/api/reviews/${reviewId}/comments/${commentId}`, { headers });
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      throw error;
    }
  },

  // 대댓글 작성
  async createReply(reviewId, parentCommentId, content) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.post(
        `/api/reviews/${reviewId}/comments/${parentCommentId}/replies`,
        { content },
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("대댓글 작성 실패:", error);
      throw error;
    }
  },
};

export default commentService;
