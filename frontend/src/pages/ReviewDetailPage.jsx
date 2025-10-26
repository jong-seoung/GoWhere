// 리뷰 상세 페이지
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reviewService } from "../services/reviewService";
import userService from "../services/user";
import CommentList from "../components/comments/CommentList";
import BookmarkButton from "../components/bookmarks/BookmarkButton";
import useAuthStore from "../store/authStore";

const ReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  
  const [review, setReview] = useState(null);
  const [reviewUser, setReviewUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 리뷰 데이터 로드
  useEffect(() => {
    const fetchReview = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await reviewService.getReviewById(id);
        console.log("리뷰 상세 데이터:", data);
        console.log("ratingPoint 값:", data.ratingPoint);
        console.log("전체 데이터 키들:", Object.keys(data));
        console.log("데이터 타입:", typeof data);
        console.log("사용자 ID:", data.userId);
        
        // userId로 사용자 정보 가져오기
        if (data.userId) {
          try {
            const userData = await userService.getUserById(data.userId);
            console.log("사용자 정보:", userData);
            setReviewUser(userData);
          } catch (err) {
            console.error("사용자 정보 조회 실패:", err);
          }
        }
        
        setReview(data);
        setError(null);
      } catch (err) {
        console.error("리뷰 상세 조회 실패:", err);
        setError("리뷰를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  // 리뷰 삭제
  const handleDeleteReview = async () => {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await reviewService.deleteReview(id);
      alert("리뷰가 삭제되었습니다.");
      navigate("/reviews");
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  // 리뷰 수정 페이지로 이동
  const handleEditReview = () => {
    navigate(`/reviews/${id}/edit`);
  };

  // 현재 사용자가 리뷰 작성자인지 확인
  const isAuthor = currentUser && currentUser.id === review?.userId;

  if (loading) {
    return (
      <div className="review-detail">
        <div className="text-center text-gray-500 mt-6">
          리뷰를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-detail">
        <div className="text-center text-red-500 mt-6">
          {error}
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="review-detail">
        <div className="text-center text-gray-500 mt-6">
          리뷰를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="review-detail">
      <div className="review-detail-container">
        {/* 리뷰 헤더 */}
        <div className="review-detail-header">
          <div className="review-detail-title-section">
            <h1 className="review-detail-title">{review.title}</h1>
            <div className="review-detail-meta">
              <span className="review-detail-author">
                작성자: {reviewUser?.nickname || reviewUser?.name || reviewUser?.username || reviewUser?.email || "익명"}
              </span>
              <span className="review-detail-date">
                {new Date(review.createdAt).toLocaleDateString("ko-KR")}
              </span>
              <div className="review-detail-bookmark">
                <BookmarkButton 
                  reviewId={review.id}
                  tripId={review.tripId}
                  placeName={review.placeName}
                  onBookmarkChanged={() => {}} 
                />
              </div>
            </div>
          </div>
          
          <div className="review-detail-actions">
            <button
              onClick={() => navigate("/reviews")}
              className="review-detail-back-btn"
            >
              목록으로
            </button>
            {/* 수정/삭제 버튼을 오른쪽에 배치 */}
            <div className="review-detail-edit-actions">
              <button
                onClick={handleEditReview}
                className="review-detail-edit-btn"
              >
                수정
              </button>
              <button
                onClick={handleDeleteReview}
                className="review-detail-delete-btn"
              >
                삭제
              </button>
            </div>
          </div>
        </div>

        {/* 리뷰 썸네일 */}
        {review.thumbnailUrl && (
          <div className="review-detail-thumbnail">
            <img
              src={review.thumbnailUrl}
              alt={review.title}
              className="review-detail-image"
            />
          </div>
        )}

        {/* 리뷰 내용 - 제목 바로 밑으로 이동 */}
        <div className="review-detail-content">
          <div className="review-detail-text">
            {review.content}
          </div>
          
          {/* 리뷰 내용과 별점 사이 간격 추가 */}
          <div className="review-detail-spacing"></div>
          
          <div className="review-detail-rating-section">
            <div className="rating-display">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => {
                  // 백엔드에서 실제 ratingPoint 데이터 사용
                  const ratingValue = Number(review.ratingPoint || 0);
                  const isFilled = star <= ratingValue;
                  console.log(`별 ${star}: ratingValue=${ratingValue}, isFilled=${isFilled}`);
                  
                  return (
                    <span 
                      key={star} 
                      className={`rating-star ${
                        isFilled ? "rating-star-filled" : "rating-star-empty"
                      }`}
                    >
                      ⭐
                    </span>
                  );
                })}
              </div>
              <div className="rating-info">
                <span className="rating-score">
                  {Number(review.ratingPoint || 0)}점
                </span>
                <span className="rating-text">
                  {review.ratingPoint ? 
                    "(리뷰 작성자 평가)" : 
                    "(별점 정보 없음)"
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="review-detail-comments">
          <CommentList reviewId={review.id} />
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
