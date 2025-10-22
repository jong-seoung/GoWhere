package com.gowhere.backend.service;

import com.gowhere.backend.dto.CommentRequest;
import com.gowhere.backend.dto.CommentResponse;
import com.gowhere.backend.entity.Comment;
import com.gowhere.backend.entity.Review;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.exception.BadRequestException;
import com.gowhere.backend.exception.ResourceNotFoundException;
import com.gowhere.backend.repository.CommentRepository;
import com.gowhere.backend.repository.ReviewRepository;
import com.gowhere.backend.repository.UserRepository;
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

    // userId 파라미터 제거, AuthenticationService 사용
    public CommentResponse createComment(Long reviewId, CommentRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("리뷰를 찾을 수 없습니다."));

        User currentUser = authenticationService.getCurrentUser();

        Comment comment = Comment.builder()
                .content(request.getContent())
                .review(review)
                .userId(currentUser.getId())
                .build();

        commentRepository.save(comment);
        return toResponse(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByReviewId(Long reviewId) {
        // null 대신 Pageable.unpaged() 사용
        return commentRepository.findByReviewId(reviewId, Pageable.unpaged())
                .getContent()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // userId 파라미터 제거, reviewId 검증 추가
    public CommentResponse updateComment(Long reviewId, Long commentId, CommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("댓글을 찾을 수 없습니다."));

        // reviewId 검증 추가
        if (!comment.getReview().getId().equals(reviewId)) {
            throw new BadRequestException("해당 리뷰의 댓글이 아닙니다.");
        }

        // 현재 사용자 권한 체크
        User currentUser = authenticationService.getCurrentUser();
        if (!comment.getUserId().equals(currentUser.getId())) {
            throw new BadRequestException("수정 권한이 없습니다.");
        }

        comment.setContent(request.getContent());
        return toResponse(comment);
    }

    // userId 파라미터 제거, reviewId 검증 추가
    public void deleteComment(Long reviewId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("댓글을 찾을 수 없습니다."));

        // reviewId 검증 추가
        if (!comment.getReview().getId().equals(reviewId)) {
            throw new BadRequestException("해당 리뷰의 댓글이 아닙니다.");
        }

        // 현재 사용자 권한 체크
        User currentUser = authenticationService.getCurrentUser();
        if (!comment.getUserId().equals(currentUser.getId())) {
            throw new BadRequestException("삭제 권한이 없습니다.");
        }

        commentRepository.deleteById(commentId);
    }

    private CommentResponse toResponse(Comment comment) {
        User user = userRepository.findById(comment.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorName(user.getUsername())
                .reviewId(comment.getReview().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}