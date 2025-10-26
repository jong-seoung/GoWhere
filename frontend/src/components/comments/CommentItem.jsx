// 댓글 아이템 컴포넌트
import { useState, useEffect } from "react";
import { commentService } from "../../services/commentService";
import userService from "../../services/user";
import useAuthStore from "../../store/authStore";
import ReplyForm from "./ReplyForm";

const CommentItem = ({ comment, reviewId, onCommentUpdated, onCommentDeleted }) => {
  const { user: currentUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [commentUser, setCommentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);

  // 댓글 작성자 정보 가져오기
  useEffect(() => {
    const fetchCommentUser = async () => {
      console.log("댓글 데이터:", comment);
      console.log("댓글 userId:", comment.userId);
      
      if (comment.userId) {
        try {
          console.log("사용자 정보 API 호출 시작:", comment.userId);
          const userData = await userService.getUserById(comment.userId);
          console.log("댓글 작성자 정보:", userData);
          setCommentUser(userData);
        } catch (err) {
          console.error("댓글 작성자 정보 조회 실패:", err);
          console.error("에러 상세:", err.response?.data);
        } finally {
          setUserLoading(false);
        }
      } else {
        console.log("댓글에 userId가 없습니다!");
        setUserLoading(false);
      }
    };
    fetchCommentUser();
  }, [comment.userId]);

  // 댓글 수정
  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  // 대댓글 폼 토글
  const handleReplyToggle = () => {
    setShowReplyForm(!showReplyForm);
  };

  // 대댓글 작성 완료
  const handleReplyAdded = () => {
    setShowReplyForm(false);
    // 부모 컴포넌트에 댓글 목록 새로고침 요청
    if (onCommentUpdated) {
      onCommentUpdated();
    }
  };

  // 댓글 수정 저장
  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
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
      console.log("댓글 수정 시도:", { reviewId, commentId: comment.id, content: editContent.trim() });
      
      await commentService.updateComment(reviewId, comment.id, {
        content: editContent.trim()
      });
      
      console.log("댓글 수정 성공");
      setIsEditing(false);
      onCommentUpdated();
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      console.error("에러 상세:", error.response?.data);
      alert("댓글 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 댓글 삭제
  const handleDelete = async () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }

    if (!reviewId) {
      console.error("reviewId가 없습니다:", reviewId);
      alert("리뷰 ID를 찾을 수 없습니다.");
      return;
    }

    try {
      setLoading(true);
      console.log("댓글 삭제 시도:", { reviewId, commentId: comment.id });
      
      await commentService.deleteComment(reviewId, comment.id);
      
      console.log("댓글 삭제 성공");
      onCommentDeleted();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      console.error("에러 상세:", error.response?.data);
      alert("댓글 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 현재 사용자가 댓글 작성자인지 확인
  const isAuthor = currentUser && currentUser.id === comment.userId;
  
  // 디버깅을 위한 로그
  console.log("CommentItem 디버깅:", {
    currentUser: currentUser,
    commentUser: commentUser,
    isAuthor: isAuthor,
    commentId: comment.id,
    isEditing: isEditing,
    editContent: editContent
  });

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <span className="comment-author-name">
            {comment.authorName || "익명"}
          </span>
          <span className="comment-date">
            {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </div>

      <div className="comment-content">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="comment-edit-textarea"
            rows="3"
          />
        ) : (
          <p className="comment-text">{comment.content}</p>
        )}
      </div>

      {/* 수정/삭제 버튼을 댓글 내용 아래로 이동 */}
      {(isAuthor || true) && (
        <div className="comment-actions">
          {!isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className="comment-edit-btn"
                disabled={loading}
                style={{ backgroundColor: 'blue', color: 'white', padding: '5px 10px', margin: '2px' }}
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="comment-delete-btn"
                disabled={loading}
                style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', margin: '2px' }}
              >
                삭제
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveEdit}
                className="comment-save-btn"
                disabled={loading}
                style={{ backgroundColor: 'blue', color: 'white', padding: '5px 10px', margin: '2px' }}
              >
                저장
              </button>
              <button
                onClick={handleCancelEdit}
                className="comment-cancel-btn"
                disabled={loading}
                style={{ backgroundColor: 'gray', color: 'white', padding: '5px 10px', margin: '2px' }}
              >
                취소
              </button>
            </>
          )}
        </div>
      )}

      {/* 대댓글 버튼 */}
      <div className="comment-actions">
        <button
          onClick={handleReplyToggle}
          className="comment-reply-btn"
          disabled={loading}
        >
          {showReplyForm ? "대댓글 취소" : "대댓글"}
        </button>
      </div>

      {/* 대댓글 폼 */}
      {showReplyForm && (
        <ReplyForm
          reviewId={reviewId}
          parentCommentId={comment.id}
          onReplyAdded={handleReplyAdded}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              reviewId={reviewId}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
