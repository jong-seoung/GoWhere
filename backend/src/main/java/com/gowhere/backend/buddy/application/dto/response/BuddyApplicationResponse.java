package com.gowhere.backend.buddy.application.dto.response;

import com.gowhere.backend.buddy.application.entity.BuddyApplication;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 동행 신청 응답 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuddyApplicationResponse {
    private Long id;
    private String applicantUsername;
    private String message;
    private BuddyApplication.Status status;
    private LocalDateTime appliedAt;

    public static BuddyApplicationResponse fromEntity(BuddyApplication app) {
        return BuddyApplicationResponse.builder()
                .id(app.getId())
                .applicantUsername(app.getApplicant() != null ? app.getApplicant().getUsername() : null)
                .message(app.getMessage())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
