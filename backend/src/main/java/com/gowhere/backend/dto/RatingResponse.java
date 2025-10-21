
package com.gowhere.backend.dto;

import com.gowhere.backend.entity.Rating;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    
    private Long id;
    private Long userId;
    private Long reviewId;
    private Integer ratingPoint;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RatingResponse(Rating rating) {
        this.id = rating.getId();
        this.userId = rating.getUserId();
        this.reviewId = rating.getReview() != null ? rating.getReview().getId() : null;
        this.ratingPoint = rating.getRatingPoint();
        this.createdAt = rating.getCreatedAt();
        this.updatedAt = rating.getUpdatedAt();
    }
}