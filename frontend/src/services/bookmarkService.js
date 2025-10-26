// 북마크 관련 API 서비스
import api from "./api";
import StorageService from "./storage";

export const bookmarkService = {
  // 사용자 북마크 목록 조회
  async getBookmarks() {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get("/api/bookmarks", { headers });
      return response.data;
    } catch (error) {
      console.error("북마크 목록 불러오기 실패:", error);
      throw error;
    }
  },

  // 북마크 추가
  async addBookmark(bookmarkData) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.post("/api/bookmarks", bookmarkData, { headers });
      return response.data;
    } catch (error) {
      console.error("북마크 추가 실패:", error);
      throw error;
    }
  },

  // 북마크 수정
  async updateBookmark(bookmarkId, bookmarkData) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.put(`/api/bookmarks/${bookmarkId}`, bookmarkData, { headers });
      return response.data;
    } catch (error) {
      console.error("북마크 수정 실패:", error);
      throw error;
    }
  },

  // 북마크 삭제
  async removeBookmark(bookmarkId) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.delete(`/api/bookmarks/${bookmarkId}`, { headers });
    } catch (error) {
      console.error("북마크 삭제 실패:", error);
      throw error;
    }
  },

  // 북마크 상태 확인
  async checkBookmarkStatus(reviewId) {
    try {
      const token = StorageService.getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get(`/api/bookmarks/check/${reviewId}`, { headers });
      const isBookmarked = response.data; // Boolean 값 반환
      return { isBookmarked, bookmarkId: null }; // bookmarkId는 별도 조회 필요
    } catch (error) {
      console.error("북마크 상태 확인 실패:", error);
      // 에러가 발생하면 북마크되지 않은 상태로 처리
      return { isBookmarked: false, bookmarkId: null };
    }
  },
};

export default bookmarkService;
