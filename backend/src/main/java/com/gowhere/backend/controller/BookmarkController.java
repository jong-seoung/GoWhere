package com.gowhere.backend.controller;

import com.gowhere.backend.dto.BookmarkRequest;
import com.gowhere.backend.dto.BookmarkResponse;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.service.AuthenticationService;
import com.gowhere.backend.service.BookmarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final AuthenticationService authenticationService;

    //  북마크 추가
    @PostMapping
    public ResponseEntity<BookmarkResponse> addBookmark(
            @Valid @RequestBody BookmarkRequest request) {

        User currentUser = authenticationService.getCurrentUser();
        BookmarkResponse bookmark = bookmarkService.addBookmark(currentUser.getId(), request);
        return ResponseEntity.ok(bookmark);
    }

    //  북마크 목록 조회 (페이징)
    @GetMapping
    public Page<BookmarkResponse> getBookmarks(Pageable pageable) {
        User currentUser = authenticationService.getCurrentUser();
        return bookmarkService.getBookmarks(currentUser.getId(), pageable);
    }

    //  특정 리뷰 북마크 여부 확인
    @GetMapping("/check/{reviewId}")
    public ResponseEntity<Boolean> isBookmarked(@PathVariable Long reviewId) {
        User currentUser = authenticationService.getCurrentUser();
        boolean isBookmarked = bookmarkService.isBookmarked(currentUser.getId(), reviewId);
        return ResponseEntity.ok(isBookmarked);
    }

    //  리뷰 ID 기준 북마크 삭제
    @DeleteMapping("/review/{reviewId}")
    public ResponseEntity<Void> removeBookmarkByReviewId(@PathVariable Long reviewId) {
        User currentUser = authenticationService.getCurrentUser();
        bookmarkService.removeBookmark(currentUser.getId(), reviewId);
        return ResponseEntity.noContent().build();
    }

    //  북마크 ID 기준 삭제
    @DeleteMapping("/{bookmarkId}")
    public ResponseEntity<Void> removeBookmarkById(@PathVariable Long bookmarkId) {
        User currentUser = authenticationService.getCurrentUser();
        bookmarkService.removeBookmarkById(currentUser.getId(), bookmarkId);
        return ResponseEntity.noContent().build();
    }
}

