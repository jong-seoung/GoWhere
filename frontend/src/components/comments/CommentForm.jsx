// 댓글 작성 폼 컴포넌트
import { useState } from "react";
import { commentService } from "../../services/commentService";

const CommentForm = ({ reviewId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // 댓글 작성
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    if (!reviewId) {
      console.error("reviewId가 없습니다:", reviewId);
      alert("리뷰 ID를 찾을 수 없습니다.");
      return;
    }

    try {
      setLoading(true);
      console.log("댓글 작성 시도:", { reviewId, content: content.trim() });
      
      await commentService.createComment(reviewId, {
        content: content.trim()
      });
      
      console.log("댓글 작성 성공");
      setContent("");
      onCommentAdded();
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      console.error("에러 상세:", error.response?.data);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-form">
      <form onSubmit={handleSubmit} className="comment-form-container">
        <div className="comment-form-group">
          <label htmlFor="comment-content" className="comment-form-label">
            댓글 작성
          </label>
          <textarea
            id="comment-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력해주세요..."
            className="comment-form-textarea"
            rows="3"
            disabled={loading}
          />
        </div>
        
        <div className="comment-form-actions">
          <button
            type="submit"
            className="comment-form-submit"
            disabled={loading || !content.trim()}
          >
            {loading ? "작성 중..." : "댓글 작성"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
