package com.gowhere.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class BookmarkRequest {

    @NotNull(message = "리뷰 ID는 필수입니다")
    private Long reviewId;   // 북마크할 대상 리뷰 ID

    private Long tripId;     // 선택적으로 연결된 여행 ID
    private String placeName; // 장소 이름
}
