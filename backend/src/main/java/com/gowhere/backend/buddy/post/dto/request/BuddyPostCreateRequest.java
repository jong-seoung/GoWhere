package com.gowhere.backend.buddy.post.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

// 동행 모집글 생성 요청 dto
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuddyPostCreateRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotBlank
    private String address; // 주소 문자열

    @NotBlank
    private String locationCode; // 지역코드 ex)"JEJU"

    @DecimalMin(value = "-90.0", message = "위도는 -90 이상이어야 합니다.")
    @DecimalMax(value = "90.0", message = "위도는 90 이하이어야 합니다.")
    private Double latitude; // 위도

    @DecimalMin(value = "-180.0", message = "경도는 -180 이상이어야 합니다.")
    @DecimalMax(value = "180.0", message = "경도는 180 이하이어야 합니다.")
    private Double longitude; // 경도

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotNull
    @Positive
    private Integer capacity;

    @Builder.Default
    private Set<String> tags = new HashSet<>(); // 태그 목록

    // 추가: 모집글 마감 여부 (기본값 false)
    @Builder.Default
    private boolean closed = false;
}
