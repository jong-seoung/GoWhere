// 리뷰 작성/수정 폼 컴포넌트
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { reviewService } from "../services/reviewService";


const ReviewForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    placeName: "",
    tripId: null,
    ratingPoint: 0,
    thumbnailUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEdit && id) {
      const fetchReview = async () => {
        try {
          setLoading(true);
          const review = await reviewService.getReviewById(id);
          setFormData({
            title: review.title || "",
            content: review.content || "",
            placeName: review.placeName || "",
            tripId: review.tripId || null,
            ratingPoint: review.ratingPoint || 0,
            thumbnailUrl: review.thumbnailUrl || ""
          });
        } catch (err) {
          console.error("리뷰 데이터 로드 실패:", err);
          setError("리뷰 데이터를 불러올 수 없습니다.");
        } finally {
          setLoading(false);
        }
      };

      fetchReview();
    }
  }, [isEdit, id]);

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 별점 변경 핸들러
  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      ratingPoint: rating
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (!formData.placeName.trim()) {
      alert("장소명을 입력해주세요.");
      return;
    }

    if (!formData.tripId) {
      alert("여행 ID를 입력해주세요.");
      return;
    }

    if (formData.ratingPoint === 0) {
      alert("별점을 선택해주세요.");
      return;
    }

    try {
      setLoading(true);
      
      // JWT 토큰 확인
      const token = localStorage.getItem("accessToken");
      console.log("현재 JWT 토큰:", token ? "존재함" : "없음");
      
      if (!token) {
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
        return;
      }
      
      console.log("전송할 formData:", formData);
      console.log("ratingPoint 값:", formData.ratingPoint);
      console.log("ratingPoint 타입:", typeof formData.ratingPoint);

      if (isEdit) {
        await reviewService.updateReview(id, formData);
        alert("리뷰가 수정되었습니다.");
      } else {
        await reviewService.createReview(formData);
        alert("리뷰가 작성되었습니다.");
      }
      
      navigate("/reviews");
    } catch (error) {
      console.error("리뷰 저장 실패:", error);
      console.error("에러 상세:", error.response?.data);
      console.error("에러 상태:", error.response?.status);
      console.error("요청 데이터:", formData);
      alert(`리뷰 저장에 실패했습니다. 에러: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="review-form">
        <div className="text-center text-gray-500 mt-6">
          리뷰 데이터를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-form">
        <div className="text-center text-red-500 mt-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="review-form">
      <div className="review-form-container">
        <div className="review-form-header">
          <h1 className="review-form-title">
            {isEdit ? "리뷰 수정" : "새 리뷰 작성"}
          </h1>
          <button
            onClick={() => navigate("/reviews")}
            className="review-form-cancel"
          >
            취소
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form-content">
          <div className="review-form-group">
            <label htmlFor="title" className="review-form-label">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="review-form-input"
              placeholder="리뷰 제목을 입력해주세요"
              required
            />
          </div>

          <div className="review-form-group">
            <label htmlFor="content" className="review-form-label">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="review-form-textarea"
              placeholder="리뷰 내용을 입력해주세요"
              rows="6"
              required
            />
          </div>

          <div className="review-form-group">
            <label htmlFor="placeName" className="review-form-label">
              장소명
            </label>
            <input
              type="text"
              id="placeName"
              name="placeName"
              value={formData.placeName}
              onChange={handleChange}
              className="review-form-input"
              placeholder="방문한 장소명을 입력해주세요"
              required
            />
          </div>

          <div className="review-form-group">
            <label htmlFor="tripId" className="review-form-label">
              여행 ID
            </label>
            <input
              type="number"
              id="tripId"
              name="tripId"
              value={formData.tripId || ""}
              onChange={handleChange}
              className="review-form-input"
              placeholder="여행 ID를 입력해주세요 (예: 1)"
              required
            />
          </div>

          <div className="review-form-group">
            <label className="review-form-label">
              별점
            </label>
            <div className="review-form-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`review-form-star ${
                    star <= formData.ratingPoint ? "review-form-star-filled" : "review-form-star-empty"
                  }`}
                  onClick={() => handleRatingChange(star)}
                >
                  ⭐
                </button>
              ))}
              <span className="review-form-rating-text">
                {formData.ratingPoint > 0 ? `${formData.ratingPoint}점` : "별점을 선택해주세요"}
              </span>
            </div>
          </div>

          <div className="review-form-group">
            <label htmlFor="thumbnailUrl" className="review-form-label">
              썸네일 URL (선택사항)
            </label>
            <input
              type="url"
              id="thumbnailUrl"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="review-form-input"
              placeholder="이미지 URL을 입력해주세요"
            />
          </div>

          <div className="review-form-actions">
            <button
              type="submit"
              className="review-form-submit"
              disabled={loading}
            >
              {loading ? "저장 중..." : isEdit ? "수정하기" : "작성하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
