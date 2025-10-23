package com.gowhere.backend.controller;

import com.gowhere.backend.dto.BuddyPostCreateRequest;
import com.gowhere.backend.dto.BuddyPostResponse;
import com.gowhere.backend.entity.BuddyPost;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.service.BuddyPostService;
import jakarta.validation.Valid;
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
    public ResponseEntity<BuddyPostResponse> create(
            @Valid @RequestBody BuddyPostCreateRequest req,
            @RequestAttribute("user") User currentUser) {

        BuddyPost post = new BuddyPost();
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        post.setLocationCode(req.getLocationCode());
        post.setAddress(req.getAddress());
        post.setLatitude(req.getLatitude());
        post.setLongitude(req.getLongitude());
        post.setStartDate(req.getStartDate());
        post.setEndDate(req.getEndDate());
        post.setCapacity(req.getCapacity());
        post.setTags(req.getTags());

        BuddyPost created = buddyPostService.create(post, currentUser);
        return ResponseEntity.ok(BuddyPostResponse.fromEntity(created));
    }

    /** 모집글 단건 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<BuddyPostResponse> getPost(@PathVariable Long id) {
        BuddyPost post = buddyPostService.get(id);
        return ResponseEntity.ok(BuddyPostResponse.fromEntity(post));
    }

    /** 모집글 검색 (키워드 + 지역 + 태그 + 작성자) */
    @GetMapping("/search")
    public ResponseEntity<Page<BuddyPostResponse>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Long hostId,
            Pageable pageable) {

        Page<BuddyPost> posts = buddyPostService.search(q, location, tag, hostId, pageable);
        Page<BuddyPostResponse> mapped = posts.map(BuddyPostResponse::fromEntity);
        return ResponseEntity.ok(mapped);
    }

    /** 모집글 수정 (호스트만 가능) */
    @PatchMapping("/{id}")
    public ResponseEntity<BuddyPostResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody BuddyPostCreateRequest req,
            @RequestAttribute("user") User currentUser) {

        BuddyPost patch = new BuddyPost();
        patch.setTitle(req.getTitle());
        patch.setContent(req.getContent());
        patch.setLocationCode(req.getLocationCode());
        patch.setAddress(req.getAddress());
        patch.setLatitude(req.getLatitude());
        patch.setLongitude(req.getLongitude());
        patch.setStartDate(req.getStartDate());
        patch.setEndDate(req.getEndDate());
        patch.setCapacity(req.getCapacity());
        patch.setTags(req.getTags());

        BuddyPost updated = buddyPostService.update(id, patch, currentUser);
        return ResponseEntity.ok(BuddyPostResponse.fromEntity(updated));
    }

    /** 모집글 상태 변경 (closed true/false) */
    @PatchMapping("/{id}/status")
    public ResponseEntity<BuddyPostResponse> changeStatus(
            @PathVariable Long id,
            @RequestParam boolean closed,                        // enum → boolean
            @RequestAttribute("user") User currentUser) {

        BuddyPost updated = buddyPostService.changeClosed(id, closed, currentUser);
        return ResponseEntity.ok(BuddyPostResponse.fromEntity(updated));
    }

    /** 모집글 삭제 (호스트만 가능) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @RequestAttribute("user") User currentUser) {
        buddyPostService.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
