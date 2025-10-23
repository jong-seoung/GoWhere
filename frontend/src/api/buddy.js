// src/api/buddy.js
import api from "../lib/api";

// Buddy Posts
export const BuddyPostAPI = {
  create: (payload) => api.post("/api/buddy/posts", payload),
  get: (id) => api.get(`/api/buddy/posts/${id}`),

  // 프론트는 locationCode로 받되 서버엔 location으로 매핑
  search: (params = {}) => {
    const { locationCode, ...rest } = params;
    const finalParams = { ...rest };
    if (locationCode !== undefined && locationCode !== "") {
      finalParams.location = locationCode;
    }
    return api.get("/api/buddy/posts/search", { params: finalParams });
  },

  update: (id, payload) => api.patch(`/api/buddy/posts/${id}`, payload),
  changeStatus: (id, closed) =>
    api.patch(`/api/buddy/posts/${id}/status`, null, { params: { closed } }),
  remove: (id) => api.delete(`/api/buddy/posts/${id}`),
};

// Buddy Applications
export const BuddyAppAPI = {
  apply: (postId, message) =>
    api.post(`/api/buddy/applications/${postId}`, { message }),
  myApplications: () => api.get("/api/buddy/applications/me"),
  applicantsForPost: (postId) =>
    api.get(`/api/buddy/applications/post/${postId}`),
  updateStatus: (applicationId, status) =>
    api.patch(`/api/buddy/applications/${applicationId}/status`, null, {
      params: { status }, // APPROVED | REJECTED | PENDING
    }),
  cancel: (applicationId) => api.delete(`/api/buddy/applications/${applicationId}`),
};
