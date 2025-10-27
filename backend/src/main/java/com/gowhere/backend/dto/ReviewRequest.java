package com.gowhere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {

    @NotBlank(message = "제목은 필수입니다")
    private String title;

    @NotBlank(message = "장소명은 필수입니다")
    private String placeName;

    @NotBlank(message = "내용은 필수입니다")
    private String content;

    private Long tripId;
    private Integer ratingPoint;  //별점 반영 추가
}