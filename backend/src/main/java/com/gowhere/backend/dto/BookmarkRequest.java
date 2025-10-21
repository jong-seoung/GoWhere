package com.gowhere.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class BookmarkRequest {

    @NotNull(message = "리뷰 ID는 필수입니다")
    private Long reviewId;

    private Long tripId;
    private String placeName;
}

