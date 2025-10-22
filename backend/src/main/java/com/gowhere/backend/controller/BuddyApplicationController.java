package com.gowhere.backend.controller;

import com.gowhere.backend.entity.BuddyApplication;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.service.BuddyApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buddy/applications")
@RequiredArgsConstructor
public class BuddyApplicationController {

    private final BuddyApplicationService buddyApplicationService;

    /** 모집글 신청하기 */
    @PostMapping("/{postId}")
    public ResponseEntity<BuddyApplication> apply(@PathVariable Long postId,
                                                  @RequestAttribute("user") User currentUser) {
        BuddyApplication app = buddyApplicationService.applyToPost(postId, currentUser);
        return ResponseEntity.ok(app);
    }

    /** 내 신청 내역 보기 */
    @GetMapping("/me")
    public ResponseEntity<List<BuddyApplication>> myApplications(@RequestAttribute("user") User currentUser) {
        return ResponseEntity.ok(buddyApplicationService.getMyApplications(currentUser));
    }

    /** 내 글의 신청자 목록 보기 (호스트 전용) */
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<BuddyApplication>> applicants(@PathVariable Long postId,
                                                             @RequestAttribute("user") User currentUser) {
        return ResponseEntity.ok(buddyApplicationService.getApplicationsForMyPost(postId, currentUser));
    }

    /** 신청 상태 변경 (승인/거절) */
    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<BuddyApplication> updateStatus(@PathVariable Long applicationId,
                                                         @RequestParam BuddyApplication.Status status,
                                                         @RequestAttribute("user") User currentUser) {
        return ResponseEntity.ok(
                buddyApplicationService.updateStatus(applicationId, status, currentUser)
        );
    }

    /** 신청 취소 */
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Void> cancel(@PathVariable Long applicationId,
                                       @RequestAttribute("user") User currentUser) {
        buddyApplicationService.cancel(applicationId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
