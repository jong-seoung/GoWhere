// 리뷰 전용 관리 페이지
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reviewService } from "../services/reviewService";
import ReviewBar from "../components/ReviewBar";

const ReviewPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 리뷰 데이터 로드
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewService.getAllReviews();
        setReviews(data.content || data);
        setError(null);
      } catch (err) {
        console.error("리뷰 목록 불러오기 실패:", err);
        setError("리뷰를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // 새 리뷰 작성 페이지로 이동
  const handleCreateReview = () => {
    navigate("/reviews/new");
  };

  // 리뷰 상세 페이지로 이동
  const handleReviewClick = (reviewId) => {
    navigate(`/reviews/${reviewId}`);
  };

  if (loading) {
    return (
      <div className="review-container">
        <div className="text-center text-gray-500 mt-6">
          리뷰 데이터를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-container">
        <div className="text-center text-red-500 mt-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="review-container">
      <div className="review-header">
        <h1 className="review-title">여행 리뷰</h1>
        <button
          onClick={handleCreateReview}
          className="btn-primary px-4 py-2 rounded-md"
        >
          새 리뷰 작성
        </button>
      </div>

      <div className="review-content">
        {reviews && reviews.length > 0 ? (
          <div className="review-grid">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="review-card"
                onClick={() => handleReviewClick(review.id)}
              >
                {review.thumbnailUrl && (
                  <img
                    src={review.thumbnailUrl}
                    alt={review.title}
                    className="review-thumbnail"
                  />
                )}

                <div className="review-card-content">
                  <h2 className="review-card-title">
                    {review.title || "제목 없음"}
                  </h2>

                  <p className="review-card-description">
                    {review.content || "내용이 없습니다."}
                  </p>

                  <div className="review-card-meta">
                    <span className="review-rating">
                      ⭐ {review.ratingPoint || 0}점
                    </span>
                    <span className="review-author">
                      {review.user?.nickname || "익명"}
                    </span>
                  </div>

                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-6">
            아직 등록된 리뷰가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
