package com.gowhere.backend.controller;

import com.gowhere.backend.entity.BuddyPost;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.service.BuddyPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buddy/posts")
@RequiredArgsConstructor
public class BuddyPostController {

    private final BuddyPostService buddyPostService;

    /** 모집글 생성 */
    @PostMapping
    public ResponseEntity<BuddyPost> create(@RequestBody BuddyPost post,
                                            @RequestAttribute("user") User currentUser) {
        BuddyPost created = buddyPostService.create(post, currentUser);
        return ResponseEntity.ok(created);
    }

    /** 모집글 단건 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<BuddyPost> getPost(@PathVariable Long id) {
        BuddyPost post = buddyPostService.get(id);
        return ResponseEntity.ok(post);
    }

    /** 모집글 검색 (키워드 + 지역 + 태그 + 작성자) */
    @GetMapping("/search")
    public ResponseEntity<Page<BuddyPost>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Long hostId,
            Pageable pageable) {
        Page<BuddyPost> posts = buddyPostService.search(q, location, tag, hostId, pageable);
        return ResponseEntity.ok(posts);
    }

    /** 모집글 수정 (호스트만 가능) */
    @PatchMapping("/{id}")
    public ResponseEntity<BuddyPost> update(@PathVariable Long id,
                                            @RequestBody BuddyPost updateData,
                                            @RequestAttribute("user") User currentUser) {
        BuddyPost updated = buddyPostService.update(id, updateData, currentUser);
        return ResponseEntity.ok(updated);
    }

    /** 모집글 상태 변경 (OPEN ↔ CLOSED) */
    @PatchMapping("/{id}/status")
    public ResponseEntity<BuddyPost> changeStatus(@PathVariable Long id,
                                                  @RequestParam BuddyPost.Status status,
                                                  @RequestAttribute("user") User currentUser) {
        BuddyPost updated = buddyPostService.changeStatus(id, status, currentUser);
        return ResponseEntity.ok(updated);
    }

    /** 모집글 삭제 (호스트만 가능) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @RequestAttribute("user") User currentUser) {
        buddyPostService.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
