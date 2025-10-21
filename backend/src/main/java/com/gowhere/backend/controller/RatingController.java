
package com.gowhere.backend.controller;

import com.gowhere.backend.dto.RatingRequest;
import com.gowhere.backend.dto.RatingResponse;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.service.AuthenticationService;
import com.gowhere.backend.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews/{reviewId}/rating")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;
    private final AuthenticationService authenticationService;

    // 별점 등록
    @PostMapping
    public ResponseEntity<RatingResponse> createRating(
            @PathVariable Long reviewId,
            @Valid @RequestBody RatingRequest request) {
        User currentUser = authenticationService.getCurrentUser();
        RatingResponse rating = ratingService.createRating(reviewId, currentUser.getId(), request);
        return ResponseEntity.ok(rating);
    }

    // 별점 수정
    @PutMapping
    public ResponseEntity<RatingResponse> updateRating(
            @PathVariable Long reviewId,
            @Valid @RequestBody RatingRequest request) {
        User currentUser = authenticationService.getCurrentUser();
        RatingResponse rating = ratingService.updateRating(reviewId, currentUser.getId(), request);
        return ResponseEntity.ok(rating);
    }

    // 별점 삭제
    @DeleteMapping
    public ResponseEntity<Void> deleteRating(@PathVariable Long reviewId) {
        User currentUser = authenticationService.getCurrentUser();
        ratingService.deleteRating(reviewId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    // 별점 조회
    @GetMapping
    public ResponseEntity<RatingResponse> getRating(@PathVariable Long reviewId) {
        User currentUser = authenticationService.getCurrentUser();
        RatingResponse rating = ratingService.getRating(reviewId, currentUser.getId());
        return ResponseEntity.ok(rating);
    }
}