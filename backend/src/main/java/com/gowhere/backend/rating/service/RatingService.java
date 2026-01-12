package com.gowhere.backend.rating.service;

import com.gowhere.backend.rating.dto.request.RatingRequest;
import com.gowhere.backend.rating.dto.response.RatingResponse;
import com.gowhere.backend.rating.entity.Rating;
import com.gowhere.backend.review.entity.Review;
import com.gowhere.backend.user.entity.User;
import com.gowhere.backend.exception.BadRequestException;
import com.gowhere.backend.exception.ResourceNotFoundException;
import com.gowhere.backend.rating.repository.RatingRepository;
import com.gowhere.backend.review.repository.ReviewRepository;
import com.gowhere.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Transactional
    public RatingResponse createRating(Long reviewId, Long userId, RatingRequest request) {
        // 중복 체크
        if (ratingRepository.existsByUserIdAndReviewId(userId, reviewId)) {
            throw new BadRequestException("이미 별점을 등록했습니다.");
        }

        // 리뷰 존재 확인
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("리뷰를 찾을 수 없습니다."));

        // 유저 존재 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("유저를 찾을 수 없습니다."));

        Rating rating = Rating.builder()
                .user(user)
                .review(review)
                .ratingPoint(request.getRatingPoint())
                .build();

        return new RatingResponse(ratingRepository.save(rating));
    }

    @Transactional
    public RatingResponse updateRating(Long reviewId, Long userId, RatingRequest request) {
        Rating rating = ratingRepository.findByUserIdAndReviewId(userId, reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("별점을 찾을 수 없습니다."));

        rating.setRatingPoint(request.getRatingPoint());
        return new RatingResponse(ratingRepository.save(rating));
    }

    @Transactional(readOnly = true)
    public RatingResponse getRating(Long reviewId, Long userId) {
        Rating rating = ratingRepository.findByUserIdAndReviewId(userId, reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("별점을 찾을 수 없습니다."));
        return new RatingResponse(rating);
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByReview(Long reviewId) {
        return ratingRepository.findByReviewId(reviewId).stream()
                .map(RatingResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double getAverageRatingPoint(Long reviewId) {
        List<Rating> ratings = ratingRepository.findByReviewId(reviewId);
        if (ratings.isEmpty()) {
            return 0.0;
        }
        return ratings.stream()
                .mapToInt(Rating::getRatingPoint)
                .average()
                .orElse(0.0);
    }

    @Transactional
    public void deleteRating(Long reviewId, Long userId) {
        if (!ratingRepository.existsByUserIdAndReviewId(userId, reviewId)) {
            throw new ResourceNotFoundException("별점을 찾을 수 없습니다.");
        }
        ratingRepository.deleteByUserIdAndReviewId(userId, reviewId);
    }
}