package com.gowhere.backend.service;

import com.gowhere.backend.entity.Bookmark;
import com.gowhere.backend.entity.Review;
import com.gowhere.backend.dto.BookmarkRequest;
import com.gowhere.backend.dto.BookmarkResponse;
import com.gowhere.backend.repository.BookmarkRepository;
import com.gowhere.backend.repository.ReviewRepository;
import com.gowhere.backend.exception.ResourceNotFoundException;
import com.gowhere.backend.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final ReviewRepository reviewRepository;


    @Transactional
    public BookmarkResponse addBookmark(Long userId, BookmarkRequest request) {
        if (bookmarkRepository.existsByUserIdAndReviewId(userId, request.getReviewId())) {
            throw new BadRequestException("이미 북마크한 리뷰입니다.");
        }

        Review review = reviewRepository.findById(request.getReviewId())
                .orElseThrow(() -> new ResourceNotFoundException("리뷰를 찾을 수 없습니다. ID: " + request.getReviewId()));

        Bookmark bookmark = Bookmark.builder()
                .userId(userId)
                .review(review)
                .tripId(request.getTripId())
                .placeName(request.getPlaceName())
                .isBookmark(true)
                .build();

        return new BookmarkResponse(bookmarkRepository.save(bookmark));
    }


    @Transactional(readOnly = true)
    public Page<BookmarkResponse> getBookmarks(Long userId, Pageable pageable) {
        return bookmarkRepository.findByUserId(userId, pageable)
                .map(BookmarkResponse::new);
    }


    @Transactional(readOnly = true)
    public boolean isBookmarked(Long userId, Long reviewId) {
        return bookmarkRepository.existsByUserIdAndReviewId(userId, reviewId);
    }

    // 북마크 삭제 (리뷰 기준)
    @Transactional
    public void removeBookmark(Long userId, Long reviewId) {
        if (!bookmarkRepository.existsByUserIdAndReviewId(userId, reviewId)) {
            throw new ResourceNotFoundException("북마크를 찾을 수 없습니다.");
        }
        bookmarkRepository.deleteByUserIdAndReviewId(userId, reviewId);
    }

    // 북마크 삭제 (ID 기준)
    @Transactional
    public void removeBookmarkById(Long userId, Long bookmarkId) {
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new ResourceNotFoundException("북마크를 찾을 수 없습니다. ID: " + bookmarkId));

        if (!bookmark.getUserId().equals(userId)) {
            throw new BadRequestException("본인의 북마크만 삭제할 수 있습니다.");
        }

        bookmarkRepository.delete(bookmark);
    }
}
