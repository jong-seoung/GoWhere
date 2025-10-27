// 북마크 버튼 컴포넌트
import { useState, useEffect } from "react";
import { bookmarkService } from "../../services/bookmarkService";
import useAuthStore from "../../store/authStore";

const BookmarkButton = ({ reviewId, tripId, placeName, onBookmarkChanged }) => {
  const { user } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 북마크 상태 확인
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!user || !reviewId) return;
      
      try {
        const status = await bookmarkService.checkBookmarkStatus(reviewId);
        setIsBookmarked(status.isBookmarked || false);
        setBookmarkId(status.bookmarkId || null);
      } catch (error) {
        console.error("북마크 상태 확인 실패:", error);
      }
    };

    checkBookmarkStatus();
  }, [user, reviewId]);

  // 북마크 토글
  const handleBookmarkToggle = async () => {
    console.log("북마크 버튼 클릭됨:", { user, reviewId, isBookmarked, bookmarkId });
    
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!reviewId) {
      console.error("reviewId가 없습니다:", reviewId);
      alert("리뷰 ID를 찾을 수 없습니다.");
      return;
    }

    try {
      setLoading(true);
      
      if (isBookmarked && bookmarkId) {
        // 북마크 삭제
        console.log("북마크 삭제 시도:", bookmarkId);
        await bookmarkService.removeBookmark(bookmarkId);
        console.log("북마크 삭제 성공");
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {
        // 북마크 추가
        console.log("북마크 추가 시도:", { reviewId });
        const newBookmark = await bookmarkService.addBookmark({
          reviewId: reviewId,
          tripId: tripId,
          placeName: placeName
        });
        console.log("북마크 추가 성공:", newBookmark);
        setIsBookmarked(true);
        setBookmarkId(newBookmark.id);
      }
      
      onBookmarkChanged && onBookmarkChanged();
    } catch (error) {
      console.error("북마크 처리 실패:", error);
      console.error("에러 상세:", error.response?.data);
      alert("북마크 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmarkToggle}
      disabled={loading}
      className={`bookmark-button ${isBookmarked ? "bookmark-button-active" : "bookmark-button-inactive"}`}
      title={isBookmarked ? "북마크 해제" : "북마크 추가"}
    >
      <span className="bookmark-icon">
        {isBookmarked ? "❤️" : "🤍"}
      </span>
      <span className="bookmark-text">
        {loading ? "처리 중..." : isBookmarked ? "북마크됨" : "북마크"}
      </span>
    </button>
  );
};

export default BookmarkButton;
