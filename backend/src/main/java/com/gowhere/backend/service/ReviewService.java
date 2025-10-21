package com.gowhere.backend.service;

import com.gowhere.backend.dto.ReviewRequest;
import com.gowhere.backend.dto.ReviewResponse;
import com.gowhere.backend.entity.Review;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.exception.BadRequestException;
import com.gowhere.backend.exception.ResourceNotFoundException;
import com.gowhere.backend.repository.ReviewRepository;
import com.gowhere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(Long userId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = Review.builder()
                .title(request.getTitle())
                .placeName(request.getPlaceName())
                .content(request.getContent())
                .userId(user.getId())
                .tripId(request.getTripId())
                .build();

        Review saved = reviewRepository.save(review);
        return new ReviewResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable)
                .map(ReviewResponse::new);
    }

    @Transactional(readOnly = true)
    public ReviewResponse getReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("리뷰를 찾을 수 없습니다. ID: " + id));
        return new ReviewResponse(review);
    }

    @Transactional
    public ReviewResponse updateReview(Long id, ReviewRequest request, Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("리뷰를 찾을 수 없습니다. ID: " + id));

        // 작성자 권한 체크
        if (!review.getUserId().equals(userId)) {
            throw new BadRequestException("수정 권한이 없습니다.");
        }

        review.setTitle(request.getTitle());
        review.setPlaceName(request.getPlaceName());
        review.setContent(request.getContent());
        review.setTripId(request.getTripId());

        return new ReviewResponse(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long id, Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("리뷰를 찾을 수 없습니다. ID: " + id));

        // 작성자 권한 체크
        if (!review.getUserId().equals(userId)) {
            throw new BadRequestException("삭제 권한이 없습니다.");
        }

        reviewRepository.deleteById(id);
    }
}
