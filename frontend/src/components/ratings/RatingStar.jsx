// 별점 입력 컴포넌트
import { useState, useEffect } from "react";
import { ratingService } from "../../services/ratingService";
import useAuthStore from "../../store/authStore";

const RatingStar = ({ reviewId, onRatingChanged }) => {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  // 사용자의 기존 별점 조회
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!user || !reviewId) return;
      
      try {
        // 사용자의 기존 별점이 있는지 확인 (실제 API에 따라 조정 필요)
        // const existingRating = await ratingService.getUserRating(reviewId);
        // setUserRating(existingRating);
        // setRating(existingRating?.rating || 0);
      } catch (error) {
        console.error("사용자 별점 조회 실패:", error);
      }
    };

    fetchUserRating();
  }, [user, reviewId]);

  // 별점 클릭 핸들러
  const handleStarClick = async (starRating) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    // reviewId 타입 확인 및 변환
    const reviewIdStr = String(reviewId);
    console.log("별점 클릭 - reviewId:", reviewId, "변환된 reviewId:", reviewIdStr);

    try {
      setLoading(true);
      
      if (userRating && userRating.id) {
        // 기존 별점 수정
        await ratingService.updateRating(reviewIdStr, {
          reviewId: reviewIdStr,
          rating: starRating
        });
      } else {
        // 새 별점 생성
        const newRating = await ratingService.createRating(reviewIdStr, {
          reviewId: reviewIdStr,
          rating: starRating
        });
        setUserRating(newRating);
      }
      
      setRating(starRating);
      onRatingChanged && onRatingChanged();
    } catch (error) {
      console.error("별점 저장 실패:", error);
      console.error("에러 상세:", error.response?.data);
      alert("별점 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 별점 삭제
  const handleDeleteRating = async () => {
    if (!userRating || !userRating.id) return;
    
    if (!window.confirm("별점을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setLoading(true);
      await ratingService.deleteRating(userRating.id);
      setRating(0);
      setUserRating(null);
      onRatingChanged && onRatingChanged();
    } catch (error) {
      console.error("별점 삭제 실패:", error);
      alert("별점 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rating-star">
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`rating-star-btn ${
              star <= (hoverRating || rating) ? "rating-star-filled" : "rating-star-empty"
            }`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={loading}
          >
            ⭐
          </button>
        ))}
      </div>
      
      <div className="rating-info">
        <span className="rating-text">
          {rating > 0 ? `${rating}점` : "별점을 선택해주세요"}
        </span>
        
        {userRating && userRating.id && (
          <button
            onClick={handleDeleteRating}
            className="rating-delete-btn"
            disabled={loading}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
};

export default RatingStar;
