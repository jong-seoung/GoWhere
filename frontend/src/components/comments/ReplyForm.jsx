// 대댓글 작성 폼 컴포넌트
import { useState } from "react";
import { commentService } from "../../services/commentService";

const ReplyForm = ({ reviewId, parentCommentId, onReplyAdded, onCancel }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await commentService.createReply(reviewId, parentCommentId, content);
      setContent("");
      onReplyAdded();
    } catch (error) {
      console.error("대댓글 작성 실패:", error);
      alert("대댓글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reply-form">
      <div className="reply-form-content">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="대댓글을 입력해주세요..."
          className="reply-form-textarea"
          rows="2"
          disabled={loading}
        />
        <div className="reply-form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="reply-cancel-btn"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="reply-submit-btn"
            disabled={loading || !content.trim()}
          >
            {loading ? "작성중..." : "대댓글 작성"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;
