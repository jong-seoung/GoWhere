// 평균 별점 표시 컴포넌트
import { useState, useEffect } from "react";
import { ratingService } from "../../services/ratingService";

const RatingAverage = ({ reviewId }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 평균 별점 조회
  useEffect(() => {
    const fetchAverageRating = async () => {
      if (!reviewId) return;
      
      try {
        setLoading(true);
        // 실제 별점 데이터가 있는지 먼저 확인
        const data = await ratingService.getAverageRating(reviewId);
        console.log("평균 별점 데이터:", data); // 디버깅 로그
        
        // 데이터 처리 개선
        console.log("받은 별점 데이터:", data);
        
        if (data) {
          // 다양한 응답 형식 처리
          const avgRating = data.averageRating || data.average || data.rating || 0;
          const count = data.ratingCount || data.count || data.totalRatings || 0;
          
          console.log("처리된 별점:", { avgRating, count });
          
          setAverageRating(avgRating);
          setRatingCount(count);
        } else {
          setAverageRating(0);
          setRatingCount(0);
        }
        setError(null);
      } catch (err) {
        console.error("평균 별점 조회 실패:", err);
        // 에러가 발생해도 기본값으로 표시
        setAverageRating(0);
        setRatingCount(0);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAverageRating();
  }, [reviewId]);

  // 별점을 별 아이콘으로 표시
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="rating-display">
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-${index}`} className="rating-star-filled">⭐</span>
        ))}
        {hasHalfStar && (
          <span className="rating-star-half">⭐</span>
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="rating-star-empty">⭐</span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="rating-average">
        <div className="text-center text-gray-500">
          별점 정보를 불러오는 중...
        </div>
      </div>
    );
  }

  // 에러가 발생해도 기본값으로 표시 (에러 상태 제거)
  // if (error) {
  //   return (
  //     <div className="rating-average">
  //       <div className="text-center text-red-500">
  //         {error}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="rating-average">
      <div className="rating-average-content">
        {renderStars(averageRating)}
        <div className="rating-average-info">
          <span className="rating-average-score">
            {averageRating > 0 ? `${averageRating.toFixed(1)}점` : '0.0점'}
          </span>
          <span className="rating-average-count">
            ({ratingCount}명 평가)
          </span>
        </div>
        {/* 디버깅 정보 */}
        <div className="text-xs text-gray-400 mt-1">
          디버그: {averageRating} / {ratingCount}
        </div>
      </div>
    </div>
  );
};

export default RatingAverage;
