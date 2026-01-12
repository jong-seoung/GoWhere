package com.gowhere.backend.review.service;

import com.gowhere.backend.review.dto.request.ReviewRequest;
import com.gowhere.backend.review.dto.response.ReviewResponse;
import com.gowhere.backend.review.entity.Review;
import com.gowhere.backend.trip.entity.Trip;
import com.gowhere.backend.user.entity.User;
import com.gowhere.backend.exception.BadRequestException;
import com.gowhere.backend.exception.ResourceNotFoundException;
import com.gowhere.backend.review.repository.ReviewRepository;
import com.gowhere.backend.trip.repository.TripRepository;
import com.gowhere.backend.user.repository.UserRepository;
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
    private final TripRepository tripRepository;

    @Transactional
    public ReviewResponse createReview(Long userId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        Review review = Review.builder()
                .title(request.getTitle())
                .placeName(request.getPlaceName())
                .content(request.getContent())
                .ratingPoint(request.getRatingPoint()) // 별점 정보 저장 - 새로 추가된 필드
                .user(user)
                .trip(trip)
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

        if (review.getUser().getId() != userId) {
            throw new BadRequestException("수정 권한이 없습니다.");
        }

        Trip trip = tripRepository.findById(request.getTripId())  //  Trip 조회
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        review.setTitle(request.getTitle());
        review.setPlaceName(request.getPlaceName());
        review.setContent(request.getContent());
        review.setTrip(trip);  //  Trip 객체 설정

        return new ReviewResponse(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long id, Long userId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("리뷰를 찾을 수 없습니다. ID: " + id));

        if (review.getUser().getId() != userId) {
            throw new BadRequestException("삭제 권한이 없습니다.");
        }

        reviewRepository.deleteById(id);
    }
}