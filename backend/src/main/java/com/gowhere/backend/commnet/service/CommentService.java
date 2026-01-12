package com.gowhere.backend.commnet.service;

import com.gowhere.backend.auth.service.AuthenticationService;
import com.gowhere.backend.commnet.dto.request.CommentRequest;
import com.gowhere.backend.commnet.dto.response.CommentResponse;
import com.gowhere.backend.commnet.entity.Comment;
import com.gowhere.backend.review.entity.Review;
import com.gowhere.backend.user.entity.User;
import com.gowhere.backend.exception.BadRequestException;
import com.gowhere.backend.exception.ResourceNotFoundException;
import com.gowhere.backend.commnet.repository.CommentRepository;
import com.gowhere.backend.review.repository.ReviewRepository;
import com.gowhere.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;

    // 댓글 작성
    public CommentResponse createComment(Long reviewId, CommentRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("리뷰를 찾을 수 없습니다."));

        User currentUser = authenticationService.getCurrentUser();

        Comment comment = Comment.builder()
                .content(request.getContent())
                .review(review)
                .user(currentUser)
                .build();

        commentRepository.save(comment);
        return toResponse(comment);
    }

    // 대댓글 작성
    public CommentResponse createReply(Long reviewId, Long parentCommentId, CommentRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("리뷰를 찾을 수 없습니다."));

        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new ResourceNotFoundException("부모 댓글을 찾을 수 없습니다."));

        User currentUser = authenticationService.getCurrentUser();

        Comment reply = Comment.builder()
                .content(request.getContent())
                .review(review)
                .user(currentUser)
                .parentComment(parentComment)
                .build();

        commentRepository.save(reply);
        return toResponse(reply);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByReviewId(Long reviewId) {
        // null 대신 Pageable.unpaged() 사용
        return commentRepository.findByReviewId(reviewId, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(comment -> comment.getParentComment() == null) // 최상위 댓글만 필터링
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // userId 파라미터 제거, reviewId 검증 추가
    public CommentResponse updateComment(Long reviewId, Long commentId, CommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("댓글을 찾을 수 없습니다."));

        if (!comment.getReview().getId().equals(reviewId)) {
            throw new BadRequestException("해당 리뷰의 댓글이 아닙니다.");
        }

        User currentUser = authenticationService.getCurrentUser();
        if (comment.getUser().getId() != currentUser.getId()) {  //  .getUser()
            throw new BadRequestException("수정 권한이 없습니다.");
        }

        comment.setContent(request.getContent());
        return toResponse(comment);
    }

    // userId 파라미터 제거, reviewId 검증 추가
    public void deleteComment(Long reviewId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("댓글을 찾을 수 없습니다."));

        if (!comment.getReview().getId().equals(reviewId)) {
            throw new BadRequestException("해당 리뷰의 댓글이 아닙니다.");
        }

        User currentUser = authenticationService.getCurrentUser();
        if (comment.getUser().getId() != currentUser.getId()) {  // ✅ .getUser()
            throw new BadRequestException("삭제 권한이 없습니다.");
        }

        commentRepository.deleteById(commentId);
    }

    private CommentResponse toResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorName(comment.getUser().getUsername())
                .reviewId(comment.getReview().getId())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .replies(comment.getReplies().stream()
                        .map(this::toResponse)
                        .collect(Collectors.toList()))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}