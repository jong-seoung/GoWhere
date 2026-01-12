package com.gowhere.backend.bookmark.service;

import com.gowhere.backend.bookmark.dto.request.BookmarkRequest;
import com.gowhere.backend.bookmark.dto.response.BookmarkResponse;
import com.gowhere.backend.bookmark.entity.Bookmark;
import com.gowhere.backend.review.entity.Review;
import com.gowhere.backend.trip.entity.Trip;
import com.gowhere.backend.user.entity.User;
import com.gowhere.backend.exception.BadRequestException;
import com.gowhere.backend.exception.ResourceNotFoundException;
import com.gowhere.backend.bookmark.repository.BookmarkRepository;
import com.gowhere.backend.review.repository.ReviewRepository;
import com.gowhere.backend.trip.repository.TripRepository;
import com.gowhere.backend.user.repository.UserRepository;
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
    private final TripRepository tripRepository;  // ✅ 추가
    private final UserRepository userRepository;

    @Transactional
    public BookmarkResponse addBookmark(Long userId, BookmarkRequest request) {
        if (bookmarkRepository.existsByUserIdAndReviewId(userId, request.getReviewId())) {
            throw new BadRequestException("이미 북마크된 리뷰입니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("유저를 찾을 수 없습니다."));

        Review review = reviewRepository.findById(request.getReviewId())
                .orElseThrow(() -> new ResourceNotFoundException("리뷰를 찾을 수 없습니다"));

        Trip trip = tripRepository.findById(request.getTripId())  // ✅ Trip 조회
                .orElseThrow(() -> new ResourceNotFoundException("Trip을 찾을 수 없습니다"));

        Bookmark bookmark = Bookmark.builder()
                .user(user)  //  userId --> user 수정
                .review(review)
                .trip(trip)  // tripId --> trip 수정
                .placeName(request.getPlaceName())
                .build();

        Bookmark saved = bookmarkRepository.save(bookmark);
        return new BookmarkResponse(saved);
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

    @Transactional
    public void removeBookmark(Long userId, Long reviewId) {
        Bookmark bookmark = bookmarkRepository.findByUserIdAndReviewId(userId, reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("북마크를 찾을 수 없습니다."));

        bookmarkRepository.delete(bookmark);
    }

    @Transactional
    public void removeBookmarkById(Long userId, Long bookmarkId) {
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new ResourceNotFoundException("북마크를 찾을 수 없습니다."));

        if (bookmark.getUser().getId() != userId) {  // ✅ 수정
            throw new BadRequestException("삭제 권한이 없습니다.");
        }

        bookmarkRepository.delete(bookmark);
    }
}