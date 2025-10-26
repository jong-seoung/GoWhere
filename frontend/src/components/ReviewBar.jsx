import { useEffect, useState } from "react";
import { reviewService } from "../services/reviewService";

export default function ReviewBar() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 리뷰 데이터 로드
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getAllReviews();
        console.log("리뷰 응답 데이터:", data); //  콘솔에서 구조 확인
        const reviewsData = data.content || data; // pageable OR plain list
        setReviews(reviewsData);
      } catch (err) {
        console.error("리뷰 목록 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-6">
        리뷰 데이터를 불러오는 중입니다...
      </div>
    );
  }

  // 데이터 없음
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-6">
        아직 등록된 리뷰가 없습니다.
      </div>
    );
  }

  // 리뷰 카드 렌더링
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 px-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
        >
          {review.thumbnailUrl && (
            <img
              src={review.thumbnailUrl}
              alt={review.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
          )}

          <div className="p-4">
            <h2 className="text-lg font-semibold mb-1 text-gray-800">
              {review.title || "제목 없음"}
            </h2>

            <p className="text-sm text-gray-600 line-clamp-3 mb-2">
              {review.content || "내용이 없습니다."}
            </p>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>⭐ {review.ratingPoint || 0}점</span>
              <span>{review.user?.nickname || "익명"}</span>
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {new Date(review.createdAt).toLocaleDateString("ko-KR")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
