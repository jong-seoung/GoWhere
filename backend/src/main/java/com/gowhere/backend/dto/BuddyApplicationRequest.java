package com.gowhere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

// 동행 신청 요청 dto
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class BuddyApplicationRequest {
        @NotNull
        private Long postId;      // 신청 대상 모집글 ID

        @NotBlank
        private String message;   // 신청자가 남기는 메시지
}
