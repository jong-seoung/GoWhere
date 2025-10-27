// 북마크 목록 페이지
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookmarkService } from "../services/bookmarkService";

const BookmarkPage = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 북마크 목록 로드
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const data = await bookmarkService.getBookmarks();
        setBookmarks(data);
        setError(null);
      } catch (err) {
        console.error("북마크 목록 불러오기 실패:", err);
        setError("북마크를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  // 북마크 삭제
  const handleRemoveBookmark = async (bookmarkId, reviewId) => {
    if (!window.confirm("북마크를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await bookmarkService.removeBookmark(bookmarkId);
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
    } catch (error) {
      console.error("북마크 삭제 실패:", error);
      alert("북마크 삭제에 실패했습니다.");
    }
  };

  // 리뷰 상세 페이지로 이동
  const handleReviewClick = (reviewId) => {
    navigate(`/reviews/${reviewId}`);
  };

  if (loading) {
    return (
      <div className="bookmark-page">
        <div className="text-center text-gray-500 mt-6">
          북마크를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookmark-page">
        <div className="text-center text-red-500 mt-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bookmark-page">
      <div className="bookmark-header">
        <h1 className="bookmark-title">내 북마크</h1>
        <p className="bookmark-subtitle">
          총 {bookmarks.length}개의 북마크
        </p>
      </div>

      <div className="bookmark-content">
        {bookmarks.length > 0 ? (
          <div className="bookmark-grid">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bookmark-card"
                onClick={() => handleReviewClick(bookmark.review?.id)}
              >
                {bookmark.review?.thumbnailUrl && (
                  <img
                    src={bookmark.review.thumbnailUrl}
                    alt={bookmark.review.title}
                    className="bookmark-thumbnail"
                  />
                )}

                <div className="bookmark-card-content">
                  <h2 className="bookmark-card-title">
                    {bookmark.review?.title || "제목 없음"}
                  </h2>

                  <p className="bookmark-card-description">
                    {bookmark.review?.content || "내용이 없습니다."}
                  </p>

                  <div className="bookmark-card-meta">
                    <span className="bookmark-rating">
                      ⭐ {bookmark.review?.ratingPoint || 0}점
                    </span>
                    <span className="bookmark-author">
                      {bookmark.review?.user?.nickname || "익명"}
                    </span>
                  </div>

                  <div className="bookmark-card-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBookmark(bookmark.id, bookmark.review?.id);
                      }}
                      className="bookmark-remove-btn"
                    >
                      북마크 해제
                    </button>
                  </div>

                  <div className="bookmark-date">
                    북마크: {new Date(bookmark.createdAt).toLocaleDateString("ko-KR")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-6">
            <div className="bookmark-empty">
              <div className="bookmark-empty-icon">📚</div>
              <h3 className="bookmark-empty-title">북마크가 없습니다</h3>
              <p className="bookmark-empty-description">
                관심 있는 리뷰를 북마크해보세요!
              </p>
              <button
                onClick={() => navigate("/reviews")}
                className="btn-primary px-4 py-2 rounded-md mt-4"
              >
                리뷰 보러가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPage;
