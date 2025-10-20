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
    private final Long userId;
    private final Long tripId;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public ReviewResponse(Review review) {
        this.id = review.getId();
        this.title = review.getTitle();
        this.placeName = review.getPlaceName();
        this.content = review.getContent();
        this.userId = review.getUserId();
        this.tripId = review.getTripId();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
    }
}