import api from "../lib/api";

// ===== 모집글 API =====
export const BuddyPostAPI = {
  // 검색: params { q?, location?, tag?, hostId?, tripType?, page?, size? }
  search: (params) => api.get(`/api/buddy/posts/search`, { params }),

  // 단건 조회
  get: (id) => api.get(`/api/buddy/posts/${id}`),

  // 생성
  create: (payload) => api.post(`/api/buddy/posts`, payload),

  // 상태 변경 (마감/모집중)
  changeStatus: (postId, closedBool) =>
    api.patch(`/api/buddy/posts/${postId}/status`, null, {
      params: { closed: !!closedBool },
    }),

  // 삭제
  remove: (postId) => api.delete(`/api/buddy/posts/${postId}`),
};

// ===== 신청 API =====
export const BuddyAppAPI = {
  // 특정 글의 신청자 목록 (호스트 전용)
  applicantsForPost: (postId) =>
    api.get(`/api/buddy/applications/post/${postId}`),

  // 신청 상태 변경
  updateStatus: (applicationId, status) =>
    api.patch(`/api/buddy/applications/${applicationId}/status`, null, {
      params: { status },
    }),

  // 내 신청 내역
  myApplications: () => api.get(`/api/buddy/applications/me`),

  // 신청 취소
  cancel: (applicationId) =>
    api.delete(`/api/buddy/applications/${applicationId}`),

  // 모집글 신청하기 — 백엔드 DTO가 postId를 무시해도 안전
  apply: (postId, message) =>
    api.post(`/api/buddy/applications/${postId}`, { postId, message }),
};
