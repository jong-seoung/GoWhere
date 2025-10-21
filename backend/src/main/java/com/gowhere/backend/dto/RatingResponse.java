
package com.gowhere.backend.dto;

import com.gowhere.backend.entity.Rating;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {

    private Long id;
    private Long userId;
    private Long tripId;
    private Integer ratingPoint;

    public RatingResponse(Rating rating) {
        this.id = rating.getId();
        this.userId = rating.getUserId();
        this.tripId = rating.getTripId();
        this.ratingPoint = rating.getRatingPoint();
    }
}