package com.gowhere.backend.dto;

import com.gowhere.backend.entity.Review;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class ReviewResponse {
    private final Long id;
    private final String title;
    private final String placeName;
    private final String content;
    private final Integer ratingPoint;  //별점 반영 추가
    private final Long userId;
    private final Long tripId;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public ReviewResponse(Review review) {
        this.id = review.getId();
        this.title = review.getTitle();
        this.placeName = review.getPlaceName();
        this.content = review.getContent();
        this.ratingPoint = review.getRatingPoint(); //별점 반영 추가
        this.userId = review.getUser().getId();
        this.tripId = review.getTrip().getId();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
    }
}