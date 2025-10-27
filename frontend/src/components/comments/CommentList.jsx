// 댓글 목록 컴포넌트
import { useState, useEffect } from "react";
import { commentService } from "../../services/commentService";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

const CommentList = ({ reviewId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 댓글 목록 로드
  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getCommentsByReviewId(reviewId);
      console.log("댓글 목록 데이터:", data);
      console.log("댓글 데이터 구조:", data.map(comment => ({
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        user: comment.user,
        전체키들: Object.keys(comment)
      })));
      setComments(data);
      setError(null);
    } catch (err) {
      console.error("댓글 목록 불러오기 실패:", err);
      setError("댓글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reviewId) {
      fetchComments();
    }
  }, [reviewId]);

  // 댓글 추가 후 목록 새로고침
  const handleCommentAdded = () => {
    fetchComments();
  };

  // 댓글 수정 후 목록 새로고침
  const handleCommentUpdated = () => {
    fetchComments();
  };

  // 댓글 삭제 후 목록 새로고침
  const handleCommentDeleted = () => {
    fetchComments();
  };

  if (loading) {
    return (
      <div className="comment-list">
        <div className="text-center text-gray-500 py-4">
          댓글을 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comment-list">
        <div className="text-center text-red-500 py-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="comment-list">
      <h3 className="comment-section-title">댓글 ({comments.length})</h3>
      
      <CommentForm 
        reviewId={reviewId} 
        onCommentAdded={handleCommentAdded}
      />

      <div className="comment-items">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              reviewId={reviewId}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
