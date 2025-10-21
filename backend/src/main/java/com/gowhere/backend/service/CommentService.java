package com.gowhere.backend.service;

import com.gowhere.backend.dto.CommentRequest;
import com.gowhere.backend.dto.CommentResponse;
import com.gowhere.backend.entity.Comment;
import com.gowhere.backend.entity.Review;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.exception.ResourceNotFoundException;
import com.gowhere.backend.repository.CommentRepository;
import com.gowhere.backend.repository.ReviewRepository;
import com.gowhere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    public CommentResponse createComment(Long reviewId, CommentRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("리뷰를 찾을 수 없습니다."));

        // 추후 Security에서 인증 사용자로 대체
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .review(review)
                .user(user)
                .build();

        commentRepository.save(comment);
        return toResponse(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByReviewId(Long reviewId) {
        return commentRepository.findByReviewId(reviewId, null)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CommentResponse updateComment(Long reviewId, Long commentId, CommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("댓글을 찾을 수 없습니다."));
        comment.setContent(request.getContent());
        return toResponse(comment);
    }

    public void deleteComment(Long reviewId, Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new ResourceNotFoundException("댓글을 찾을 수 없습니다.");
        }
        commentRepository.deleteById(commentId);
    }

    private CommentResponse toResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorName(comment.getUser().getUsername())
                .reviewId(comment.getReview().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
