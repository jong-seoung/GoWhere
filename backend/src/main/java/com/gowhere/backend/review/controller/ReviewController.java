package com.gowhere.backend.review.controller;

import com.gowhere.backend.review.dto.request.ReviewRequest;
import com.gowhere.backend.review.dto.response.ReviewResponse;
import com.gowhere.backend.user.entity.User;
import com.gowhere.backend.auth.service.AuthenticationService;
import com.gowhere.backend.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthenticationService authenticationService;

    // 리뷰 생성 (로그인 사용자)
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request,
            UriComponentsBuilder uriBuilder) {

        User currentUser = authenticationService.getCurrentUser();
        ReviewResponse created = reviewService.createReview(currentUser.getId(), request);

        return ResponseEntity.created(
                uriBuilder.path("/api/reviews/{id}")
                        .buildAndExpand(created.getId())
                        .toUri()
        ).body(created);
    }

    // 전체 리뷰 조회 (페이징)
    @GetMapping
    public Page<ReviewResponse> getAllReviews(Pageable pageable) {
        return reviewService.getAllReviews(pageable);
    }

    // 리뷰 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReview(@PathVariable Long id) {
        ReviewResponse review = reviewService.getReview(id);
        return ResponseEntity.ok(review);
    }

    // 리뷰 수정 (작성자 본인만 가능)
    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request) {

        User currentUser = authenticationService.getCurrentUser();
        ReviewResponse updated = reviewService.updateReview(id, request, currentUser.getId());
        return ResponseEntity.ok(updated);
    }

    // 리뷰 삭제 (작성자 본인만 가능)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        User currentUser = authenticationService.getCurrentUser();
        reviewService.deleteReview(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}