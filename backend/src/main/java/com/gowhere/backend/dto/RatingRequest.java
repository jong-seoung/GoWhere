package com.gowhere.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingRequest {

    @NotNull(message = "Trip ID는 필수입니다")
    private Long tripId;

    @NotNull(message = "별점은 필수입니다")
    @Min(value = 1, message = "별점은 최소 1점입니다")
    @Max(value = 5, message = "별점은 최대 5점입니다")
    private Integer ratingPoint;
}