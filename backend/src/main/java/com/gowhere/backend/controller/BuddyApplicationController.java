package com.gowhere.backend.controller;

import com.gowhere.backend.dto.BuddyApplicationRequest;
import com.gowhere.backend.dto.BuddyApplicationResponse;
import com.gowhere.backend.entity.BuddyApplication;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.service.BuddyApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buddy/applications")
@RequiredArgsConstructor
@Slf4j
public class BuddyApplicationController {

    private final BuddyApplicationService buddyApplicationService;

    /** 모집글 신청하기 */
    @PostMapping("/{postId}")
    public ResponseEntity<BuddyApplicationResponse> apply(
            @PathVariable Long postId,
            @Valid @RequestBody BuddyApplicationRequest req
            ) {  //
        log.info(String.valueOf(postId));

        log.info(String.valueOf(req.getMessage()));
        BuddyApplication app = buddyApplicationService.applyToPost(postId, req.getMessage());

        return ResponseEntity.ok(BuddyApplicationResponse.fromEntity(app));
    }

    /** 내 신청 내역 보기 */
    @GetMapping("/me")
    public ResponseEntity<List<BuddyApplicationResponse>> myApplications(
            @AuthenticationPrincipal User currentUser) {  // 수정된 부분

        List<BuddyApplication> apps = buddyApplicationService.getMyApplications(currentUser);
        List<BuddyApplicationResponse> res = apps.stream()
                .map(BuddyApplicationResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(res);
    }

    /** 내 글의 신청자 목록 보기 (호스트 전용) */
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<BuddyApplicationResponse>> applicants(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser) {  // 수정된 부분

        List<BuddyApplication> apps = buddyApplicationService.getApplicationsForMyPost(postId, currentUser);
        List<BuddyApplicationResponse> res = apps.stream()
                .map(BuddyApplicationResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(res);
    }

    /** 신청 상태 변경 (승인/거절) */
    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<BuddyApplicationResponse> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam String status,  // 수정된 부분
            @AuthenticationPrincipal User currentUser) {  // 수정된 부분

        BuddyApplication.Status statusEnum = BuddyApplication.Status.valueOf(status.toUpperCase());  // 수정된 부분
        BuddyApplication updated = buddyApplicationService.updateStatus(applicationId, statusEnum, currentUser);
        return ResponseEntity.ok(BuddyApplicationResponse.fromEntity(updated));
    }

    /** 신청 취소 */
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Void> cancel(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal User currentUser) {  // 수정된 부분

        buddyApplicationService.cancel(applicationId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
