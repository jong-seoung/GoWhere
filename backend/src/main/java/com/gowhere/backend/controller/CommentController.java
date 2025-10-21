package com.gowhere.backend.controller;

import com.gowhere.backend.dto.CommentRequest;
import com.gowhere.backend.dto.CommentResponse;
import com.gowhere.backend.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews/{reviewId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 댓글 작성
    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long reviewId,
            @Valid @RequestBody CommentRequest request
    ) {
        return ResponseEntity.ok(commentService.createComment(reviewId, request));
    }

    // 특정 리뷰의 댓글 목록 조회
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getCommentsByReviewId(
            @PathVariable Long reviewId
    ) {
        return ResponseEntity.ok(commentService.getCommentsByReviewId(reviewId));
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long reviewId,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request
    ) {
        return ResponseEntity.ok(commentService.updateComment(reviewId, commentId, request));
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long reviewId,
            @PathVariable Long commentId
    ) {
        commentService.deleteComment(reviewId, commentId);
        return ResponseEntity.noContent().build();
    }
}