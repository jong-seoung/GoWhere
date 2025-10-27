import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../services/api";
import MainLayout from "../components/layout/MainLayout";
import Header from "../components/layout/Header";
import PostList from "../components/PostList";
import ReviewList from "./ReviewList";
import BuddyList from "../components/buddy/BuddyList";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    tripType: "",
    departure: "",
    destination: "",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.title.trim()) return "제목을 입력하세요.";
    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      return "종료일은 시작일 이후여야 합니다.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return alert(msg);

    try {
      setSubmitting(true);
      await api.post("/api/travelplan", formData);
      alert("여행 등록 완료 ✅");
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        tripType: "",
        departure: "",
        destination: "",
      });
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "등록 실패. 콘솔에서 에러를 확인하세요."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Header onLogout={handleLogout} />

      <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
        <div className="flex items-center justify-between p-4">
          <h1 className="font-bold text-2xl">여행 게시글 검색/정렬</h1>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="btn-primary px-4 py-2 rounded-md"
          >
            {showForm ? "닫기" : "✏️ 작성하기"}
          </button>
        </div>
        {showForm && (
          <div className="card max-w-2xl mx-auto mt-4">
            <h2 className="text-xl font-semibold mb-4">새 여행 등록</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="제목"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <textarea
                name="description"
                placeholder="상세 설명"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border p-2 rounded"
                min={formData.startDate || undefined}
              />
              <input
                type="text"
                name="tripType"
                placeholder="여행 유형 (예: 국내, 해외)"
                value={formData.tripType}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="departure"
                placeholder="출발지"
                value={formData.departure}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="destination"
                placeholder="목적지"
                value={formData.destination}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <button
                type="submit"
                className="btn-primary w-full py-2 rounded-md mt-2"
                disabled={submitting}
              >
                {submitting ? "등록 중..." : "등록하기"}
              </button>
            </form>
          </div>
        )}

        <PostList />
        <div className="buddy-section">
          <BuddyList />
        </div>
        <div className="review-section">
          <ReviewList />
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
